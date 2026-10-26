from __future__ import annotations

import argparse
import bisect
import hashlib
import json
import platform
import plistlib
import shutil
import struct
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

ARM64 = 0x100000C
IDENTIFIER = 'com.superduper.superwhisper'
PROFILE_FILE = Path(__file__).resolve().parent.parent / 'KnownBuilds.json'
CPU_NAMES = {ARM64: 'arm64', 0x1000007: 'x86_64'}


@dataclass(frozen=True)
class Section:
    segment: str
    name: str
    address: int
    offset: int
    size: int

    def location(self, address: int, length: int = 1) -> int:
        if not self.address <= address or address + length > self.address + self.size:
            raise ValueError(f'Address outside {self.segment},{self.name}: {address:#x}')
        return self.offset + address - self.address


@dataclass(frozen=True)
class Slice:
    cpu: int
    sections: tuple[Section, ...]
    functions: tuple[int, ...]

    def section(self, segment: str, name: str) -> Section:
        for section in self.sections:
            if (section.segment, section.name) == (segment, name):
                return section
        raise ValueError(f'Missing section: {segment},{name}')

    def location(self, address: int, length: int = 1) -> int:
        for section in self.sections:
            if section.address <= address and address + length <= section.address + section.size:
                return section.location(address, length)
        raise ValueError(f'Unmapped virtual address {address:#x}')


@dataclass(frozen=True)
class ModelPatch:
    key: str
    label: str
    address: int
    before: bytes
    after: bytes


@dataclass(frozen=True)
class BuildProfile:
    version: str
    identifier: str
    sha256: str
    patches: tuple[ModelPatch, ...]


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def parse_binary(data: bytes) -> tuple[Slice, ...]:
    if len(data) < 8:
        raise ValueError('Truncated binary')
    magic = data[:4]
    entries = []
    if magic in (bytes.fromhex('cafebabe'), bytes.fromhex('cafebabf')):
        count = struct.unpack_from('>I', data, 4)[0]
        wide = magic == bytes.fromhex('cafebabf')
        entry_size = 32 if wide else 20
        if not 1 <= count <= 16 or 8 + count * entry_size > len(data):
            raise ValueError('Invalid universal architecture table')
        for index in range(count):
            position = 8 + index * entry_size
            if wide:
                cpu, _, base, size, _, _ = struct.unpack_from('>IIQQII', data, position)
            else:
                cpu, _, base, size, _ = struct.unpack_from('>IIIII', data, position)
            if base + size > len(data):
                raise ValueError('Architecture extends beyond file')
            entries.append((cpu, base, size))
    elif magic == bytes.fromhex('cffaedfe'):
        entries.append((struct.unpack_from('<I', data, 4)[0], 0, len(data)))
    else:
        raise ValueError('Only little-endian 64-bit Mach-O / universal Mach-O is supported')
    slices = []
    for cpu, base, size in entries:
        if size < 32 or data[base:base + 4] != bytes.fromhex('cffaedfe'):
            raise ValueError('Invalid 64-bit Mach-O slice')
        if struct.unpack_from('<I', data, base + 4)[0] != cpu:
            raise ValueError('Architecture CPU mismatch')
        commands, command_bytes = struct.unpack_from('<II', data, base + 16)
        if base + 32 + command_bytes > base + size or commands > command_bytes // 8:
            raise ValueError('Invalid load-command region')
        position = base + 32
        sections = []
        function_data = b''
        image_base = None
        for _ in range(commands):
            command, length = struct.unpack_from('<II', data, position)
            if length < 8 or position + length > base + 32 + command_bytes:
                raise ValueError('Malformed load command')
            if command == 0x19:
                if length < 72:
                    raise ValueError('Truncated segment')
                segment_name = data[position + 8:position + 24].split(b'\0')[0].decode()
                virtual_address = struct.unpack_from('<Q', data, position + 24)[0]
                if segment_name == '__TEXT':
                    image_base = virtual_address
                count = struct.unpack_from('<I', data, position + 64)[0]
                if 72 + count * 80 > length:
                    raise ValueError('Truncated section table')
                for index in range(count):
                    record = position + 72 + index * 80
                    name = data[record:record + 16].split(b'\0')[0].decode()
                    segment = data[record + 16:record + 32].split(b'\0')[0].decode()
                    address, section_size, offset = struct.unpack_from('<QQI', data, record + 32)
                    flags = struct.unpack_from('<I', data, record + 64)[0]
                    if flags & 0xFF in (1, 12, 18):  # zero-fill, GB zero-fill, thread zero-fill
                        continue
                    if section_size and (not offset or offset + section_size > size):
                        raise ValueError('Invalid file-backed section range')
                    sections.append(Section(segment, name, address, base + offset, section_size))
            elif command == 0x26:
                if length < 16:
                    raise ValueError('Truncated function-starts command')
                offset, length_bytes = struct.unpack_from('<II', data, position + 8)
                if offset + length_bytes > size:
                    raise ValueError('Invalid function-starts range')
                function_data = data[base + offset:base + offset + length_bytes]
            position += length
        functions = []
        current = image_base or 0
        delta = shift = 0
        for value in function_data:
            delta |= (value & 0x7F) << shift
            if value & 0x80:
                shift += 7
                if shift > 63:
                    raise ValueError('Invalid ULEB128 function offset')
                continue
            if not delta:
                break
            current += delta
            functions.append(current)
            delta = shift = 0
        slices.append(Slice(cpu, tuple(sections), tuple(functions)))
    if len({item.cpu for item in slices}) != len(slices):
        raise ValueError('Duplicate architectures')
    return tuple(slices)


def load_profiles(path: Path = PROFILE_FILE) -> tuple[BuildProfile, ...]:
    content = json.loads(path.read_text())
    if content.get('schema_version') != 1:
        raise ValueError('Unknown profile schema')
    result = []
    for build in content['builds']:
        if build['architecture'] != 'arm64':
            raise ValueError('Unreviewed mutation architecture')
        patches = tuple(ModelPatch(item['key'], item['label'], int(item['address'], 16),
                                   bytes.fromhex(item['before']), bytes.fromhex(item['after']))
                        for item in build['models'])
        if len({item.key for item in patches}) != len(patches):
            raise ValueError('Duplicate model keys')
        if len({item.address for item in patches}) != len(patches):
            raise ValueError('Duplicate patch addresses')
        if any(len(item.before) != 4 or len(item.after) != 4 or item.address % 4
               or item.before == item.after for item in patches):
            raise ValueError('Invalid instruction patch')
        result.append(BuildProfile(build['version'], build['bundle_identifier'],
                                   build['executable_sha256'], patches))
    return tuple(result)


def identity(app: Path) -> tuple[str, str, Path]:
    with (app / 'Contents/Info.plist').open('rb') as stream:
        info = plistlib.load(stream)
    identifier = info['CFBundleIdentifier']
    version = info['CFBundleShortVersionString']
    name = info['CFBundleExecutable']
    if identifier != IDENTIFIER or Path(name).name != name or not isinstance(version, str):
        raise ValueError('Unexpected bundle identity or executable name')
    return version, identifier, app / 'Contents/MacOS' / name


def known_profile(data: bytes, version: str, identifier: str,
                  profiles: tuple[BuildProfile, ...]) -> BuildProfile:
    fingerprint = sha256(data)
    for profile in profiles:
        if (version, identifier, fingerprint) == (profile.version, profile.identifier, profile.sha256):
            return profile
    raise ValueError(f'Unknown pristine build: {version}, SHA-256 {fingerprint}. Inspect and rediscover; do not reuse offsets.')


def select_models(profile: BuildProfile, keys: list[str]) -> tuple[ModelPatch, ...]:
    if not keys or len(keys) != len(set(keys)):
        raise ValueError('Choose unique model keys explicitly')
    available = {item.key: item for item in profile.patches}
    unknown = set(keys) - available.keys()
    if unknown:
        raise ValueError(f'Unknown model keys: {sorted(unknown)}')
    return tuple(available[key] for key in keys)


def prepare_patch(data: bytes, patches: tuple[ModelPatch, ...]) -> bytes:
    arm = next((item for item in parse_binary(data) if item.cpu == ARM64), None)
    if arm is None:
        raise ValueError('ARM64 slice missing')
    section = arm.section('__TEXT', '__text')
    prepared = bytearray(data)
    for patch in patches:
        location = section.location(patch.address, 4)
        if data[location:location + 4] != patch.before:
            raise ValueError(f'{patch.label}: reviewed instruction mismatch; no files modified')
        prepared[location:location + 4] = patch.after
    result = bytes(prepared)
    verify_sections(data, result, patches)
    return result


def verify_sections(original: bytes, candidate: bytes, patches: tuple[ModelPatch, ...]) -> None:
    old = {item.cpu: item for item in parse_binary(original)}
    new = {item.cpu: item for item in parse_binary(candidate)}
    if old.keys() != new.keys():
        raise ValueError('Architecture set changed')
    expected = {patch.address + index for patch in patches
                for index, (a, b) in enumerate(zip(patch.before, patch.after)) if a != b}
    for cpu, image in old.items():
        before_sections = {(item.segment, item.name): item for item in image.sections}
        after_sections = {(item.segment, item.name): item for item in new[cpu].sections}
        if before_sections.keys() != after_sections.keys():
            raise ValueError('Section set changed')
        for key, before in before_sections.items():
            after = after_sections[key]
            if (before.address, before.size) != (after.address, after.size):
                raise ValueError('Section layout changed')
            old_bytes = original[before.offset:before.offset + before.size]
            new_bytes = candidate[after.offset:after.offset + after.size]
            allowed = expected if cpu == ARM64 and key == ('__TEXT', '__text') else set()
            if not allowed:
                if old_bytes != new_bytes:
                    raise ValueError(f'Unrelated section changed: {CPU_NAMES.get(cpu, cpu)} {key}')
                continue
            differences = {before.address + index for index, (a, b) in enumerate(zip(old_bytes, new_bytes)) if a != b}
            if differences != allowed:
                raise ValueError(f'Unexpected ARM64 code differences: {sorted(differences)}')
    section = new[ARM64].section('__TEXT', '__text')
    for patch in patches:
        location = section.location(patch.address, 4)
        if candidate[location:location + 4] != patch.after:
            raise ValueError(f'{patch.label}: replacement instruction not preserved')


def reflection(data: bytes, image: Slice) -> dict[str, list[str]]:
    selected = {'Model', 'ModelLicenseType', 'LicenseManager', 'LocalProUsageState', 'SuperModelPickerPanelRow'}
    types = image.section('__TEXT', '__swift5_types')

    def relative(address: int) -> int:
        return address + struct.unpack_from('<i', data, image.location(address, 4))[0]

    def string(address: int) -> str:
        offset = image.location(address)
        end = data.find(b'\0', offset, min(len(data), offset + 4096))
        if end < 0:
            raise ValueError('Unterminated reflection string')
        return data[offset:end].decode(errors='replace')

    result = {}
    for offset in range(0, types.size, 4):
        descriptor = relative(types.address + offset)
        name = string(relative(descriptor + 8))
        if name not in selected:
            continue
        pointer = struct.unpack_from('<i', data, image.location(descriptor + 16, 4))[0]
        if not pointer:
            continue
        fields = descriptor + 16 + pointer
        _, _, _, record_size, count = struct.unpack_from('<iiHHI', data, image.location(fields, 16))
        if not 12 <= record_size <= 64 or count > 4096:
            raise ValueError('Invalid reflection field descriptor')
        result[name] = [string(relative(fields + 16 + index * record_size + 8)) for index in range(count)]
    return result


def candidate_references(data: bytes, image: Slice) -> list[dict[str, str]]:
    messages = (
        'This model requires a Pro license. Upgrade to access all Pro models.',
        'This model is only available with a Pro license.', 'cohere-transcribe-q4',
        'nvidia_parakeet-v2_476MB', 'nvidia_parakeet-v3_494MB',
        'https://models.superwhisper.com/s1-mini-v080-iq4_xs.gguf',
    )
    strings = image.section('__TEXT', '__cstring')
    targets = {}
    for message in messages:
        found = data.find(message.encode(), strings.offset, strings.offset + strings.size)
        if found >= 0:
            targets[strings.address + found - strings.offset] = message
    pages = {address & ~0xFFF for address in targets}
    text = image.section('__TEXT', '__text')
    result = []
    for offset in range(0, max(0, text.size - 28), 4):
        instruction = struct.unpack_from('<I', data, text.offset + offset)[0]
        if instruction & 0x9F000000 != 0x90000000:
            continue
        register = instruction & 31
        immediate = ((instruction >> 5) & 0x7FFFF) << 2 | (instruction >> 29) & 3
        if immediate & 1 << 20:
            immediate -= 1 << 21
        pc = text.address + offset
        page = (pc & ~0xFFF) + (immediate << 12)
        if page not in pages:
            continue
        for step in range(1, 7):
            other = struct.unpack_from('<I', data, text.offset + offset + step * 4)[0]
            if other & 0x9F000000 == 0x90000000 and other & 31 == register:
                break
            if other & 0xFF000000 == 0x91000000 and (other >> 5) & 31 == register:
                added = ((other >> 10) & 0xFFF) << (12 if other & 1 << 22 else 0)
                target = page + added
                if target in targets:
                    index = bisect.bisect_right(image.functions, pc) - 1
                    start = image.functions[index] if index >= 0 else text.address
                    result.append({'text': targets[target], 'reference': hex(pc), 'function_start': hex(start)})
                if other & 31 == register:
                    break
        if len(result) >= 100:
            break
    return result


def run(command: list[str]) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(command, capture_output=True, text=True, check=False, timeout=120)
    if result.returncode:
        raise ValueError(f'Command failed: {command[0]}: {result.stderr.strip() or result.stdout.strip()}')
    return result


def audit_path(app: Path) -> Path:
    return app.with_name(app.name + '.audit')


def check_destination(source: Path, output: Path) -> None:
    if output.suffix != '.app' or output == source or source in output.parents or output in source.parents:
        raise ValueError('Choose a separate .app outside the source bundle')
    if output.exists() or output.is_symlink() or audit_path(output).exists() or audit_path(output).is_symlink():
        raise ValueError('Output or audit path already exists; refusing to overwrite')
    if not output.parent.is_dir():
        raise ValueError('Create/approve the destination parent directory first')


def apply(source: Path, output: Path, version: str, data: bytes,
          executable: Path, patches: tuple[ModelPatch, ...], acknowledged: bool) -> dict[str, object]:
    if not acknowledged:
        raise ValueError('Local signing must be explicitly acknowledged with --confirm-local-signing')
    if platform.system() != 'Darwin' or platform.machine() != 'arm64':
        raise ValueError('Mutation is supported only on an Apple Silicon Mac')
    check_destination(source, output)
    prepared = prepare_patch(data, patches)
    run(['codesign', '--verify', '--deep', '--strict', str(source)])
    entitlements = run(['codesign', '-d', '--entitlements', '-', '--xml', str(source)]).stdout
    payload = plistlib.loads(entitlements.encode())
    if not isinstance(payload, dict):
        raise TypeError('Unexpected source entitlements')
    audit = audit_path(output)
    audit.mkdir()
    (audit / 'OriginalExecutable.bin').write_bytes(data)
    shutil.copy2(source / 'Contents/_CodeSignature/CodeResources', audit / 'OriginalCodeResources')
    (audit / 'Entitlements.plist').write_bytes(plistlib.dumps(payload))
    report: dict[str, object] = {
        'status': 'prepared', 'version': version, 'source': str(source), 'output': str(output),
        'source_sha256': sha256(data), 'models': [item.key for item in patches],
        'architecture': 'arm64', 'functional_test': 'not_run',
        'signing': 'ad-hoc; vendor trust and hardened-runtime signing not preserved',
    }
    report_file = audit / 'Report.json'
    report_file.write_text(json.dumps(report, indent=2) + '\n')
    try:
        run(['ditto', str(source), str(output)])
        destination = output / executable.relative_to(source)
        if executable.read_bytes() != data or destination.read_bytes() != data:
            raise ValueError('Source changed or copy does not match fingerprint; refusing to patch')
        destination.write_bytes(prepared)
        report['status'] = 'patched_not_signed'
        report_file.write_text(json.dumps(report, indent=2) + '\n')
        run(['codesign', '--force', '--sign', '-', '--options', '0', '--entitlements',
             str(audit / 'Entitlements.plist'), str(output)])
        verify_sections(data, destination.read_bytes(), patches)
        run(['codesign', '--verify', '--deep', '--strict', str(output)])
        run(['codesign', '--verify', '--deep', '--strict', str(source)])
        if executable.read_bytes() != data:
            raise ValueError('Original executable changed during operation')
        report['status'] = 'verified_static'
        report['signed_output_sha256'] = sha256(destination.read_bytes())
    except (ValueError, OSError, subprocess.TimeoutExpired) as error:
        report['status'] = 'failed'
        report['error'] = str(error)
        report_file.write_text(json.dumps(report, indent=2) + '\n')
        raise
    report_file.write_text(json.dumps(report, indent=2) + '\n')
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description='Inspect or rebuild exact-build Superwhisper local-model test copies.')
    commands = parser.add_subparsers(dest='command', required=True)
    for name in ('inspect', 'plan', 'apply', 'verify'):
        command = commands.add_parser(name)
        command.add_argument('--source', type=Path, default=Path('/Applications/superwhisper.app'))
        if name != 'inspect':
            command.add_argument('--models', nargs='+', required=True)
        if name == 'apply':
            command.add_argument('--output', type=Path, required=True)
            command.add_argument('--confirm-local-signing', action='store_true')
        if name == 'verify':
            command.add_argument('--app', type=Path, required=True)
    arguments = parser.parse_args()
    source = arguments.source.expanduser().resolve()
    version, identifier, executable = identity(source)
    data = executable.read_bytes()
    profiles = load_profiles()
    if arguments.command == 'inspect':
        images = parse_binary(data)
        supported = any((version, identifier, sha256(data)) == (item.version, item.identifier, item.sha256) for item in profiles)
        arm = next((item for item in images if item.cpu == ARM64), None)
        report: dict[str, object] = {'version': version, 'identifier': identifier, 'executable_sha256': sha256(data),
                  'supported_pristine_build': supported, 'architectures': [CPU_NAMES.get(item.cpu, hex(item.cpu)) for item in images],
                  'reference_limitations': 'Candidate ADRP+ADD references only; not proof of an executable gate.'}
        if arm:
            for key, reader in (('swift_fields', reflection), ('candidate_references', candidate_references)):
                try:
                    report[key] = reader(data, arm)
                except (ValueError, struct.error) as error:
                    report[key + '_limitation'] = str(error)
        print(json.dumps(report, indent=2))
        return
    profile = known_profile(data, version, identifier, profiles)
    patches = select_models(profile, arguments.models)
    prepare_patch(data, patches)  # Full read-only preflight, even for plan/verify.
    if arguments.command == 'plan':
        report = {'status': 'plan_only_no_files_changed', 'version': version,
                  'source_sha256': profile.sha256, 'architecture': 'arm64',
                  'models': [{'key': item.key, 'label': item.label, 'address': hex(item.address),
                              'before': item.before.hex(), 'after': item.after.hex()} for item in patches]}
    elif arguments.command == 'apply':
        output = arguments.output.expanduser().absolute()
        if output.is_symlink():
            raise ValueError('Output is a symlink; refusing to overwrite')
        report = apply(source, output.resolve(), version, data, executable, patches, arguments.confirm_local_signing)
    else:
        app = arguments.app.expanduser().resolve()
        copy_version, copy_identifier, copy_executable = identity(app)
        if (copy_version, copy_identifier) != (version, identifier):
            raise ValueError('Source and copy identities differ')
        copy_data = copy_executable.read_bytes()
        verify_sections(data, copy_data, patches)
        report_file = audit_path(app) / 'Report.json'
        if report_file.exists():
            audit = json.loads(report_file.read_text())
            if (audit.get('status') != 'verified_static' or audit.get('source_sha256') != profile.sha256
                    or set(audit.get('models', [])) != set(arguments.models)
                    or audit.get('signed_output_sha256') != sha256(copy_data)):
                raise ValueError('Copy does not match its completed audit report')
        run(['codesign', '--verify', '--deep', '--strict', str(source)])
        run(['codesign', '--verify', '--deep', '--strict', str(app)])
        if executable.read_bytes() != data:
            raise ValueError('Source changed during verification')
        report = {'status': 'verified_static', 'models': [item.key for item in patches],
                  'original_unchanged': True, 'other_sections_unchanged': True,
                  'audit_record_present': report_file.exists(), 'functional_test': 'not_run'}
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, TypeError, OSError, KeyError, struct.error, subprocess.TimeoutExpired) as error:
        print(f'Error: {error}', file=sys.stderr)
        sys.exit(1)
