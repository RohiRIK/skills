from __future__ import annotations

import dataclasses
import plistlib
import shutil
import struct
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

sys.dont_write_bytecode = True

from ModelTools import (
    ARM64,
    IDENTIFIER,
    BuildProfile,
    ModelPatch,
    apply,
    check_destination,
    known_profile,
    load_profiles,
    parse_binary,
    prepare_patch,
    select_models,
    sha256,
    verify_sections,
)

BEFORE = bytes.fromhex('0b210639')
AFTER = bytes.fromhex('1f210639')
TEXT_ADDRESS = 0x100000200


def thin_binary(cpu: int) -> bytes:
    header = struct.pack('<IIIIIIII', 0xFEEDFACF, cpu, 0, 2, 1, 232, 0, 0)
    segment = struct.pack('<II16sQQQQiiII', 0x19, 232, b'__TEXT', 0x100000000,
                          4096, 0, 560, 5, 5, 2, 0)
    text = struct.pack('<16s16sQQIIIIIIII', b'__text', b'__TEXT', TEXT_ADDRESS, 32,
                       512, 2, 0, 0, 0x80000400, 0, 0, 0)
    constant = struct.pack('<16s16sQQIIIIIIII', b'__const', b'__TEXT', TEXT_ADDRESS + 32,
                           16, 544, 0, 0, 0, 0, 0, 0, 0)
    data = bytearray(560)
    commands = header + segment + text + constant
    data[:len(commands)] = commands
    data[512:544] = BEFORE * 8
    data[544:560] = b'unchanged-data!!'
    return bytes(data)


def universal_binary(wide: bool = False) -> bytes:
    x86 = thin_binary(0x1000007)
    arm = thin_binary(ARM64)
    header = struct.pack('>II', 0xCAFEBABF if wide else 0xCAFEBABE, 2)
    if wide:
        entries = struct.pack('>IIQQII', 0x1000007, 0, 4096, len(x86), 12, 0)
        entries += struct.pack('>IIQQII', ARM64, 0, 8192, len(arm), 12, 0)
    else:
        entries = struct.pack('>IIIII', 0x1000007, 0, 4096, len(x86), 12)
        entries += struct.pack('>IIIII', ARM64, 0, 8192, len(arm), 12)
    data = bytearray(8192 + len(arm))
    data[:len(header + entries)] = header + entries
    data[4096:4096 + len(x86)] = x86
    data[8192:] = arm
    return bytes(data)


class ModelToolsTests(unittest.TestCase):
    def setUp(self) -> None:
        self.data = universal_binary()
        self.patches = tuple(ModelPatch(key, key, TEXT_ADDRESS + index * 4, BEFORE, AFTER)
                             for index, key in enumerate(('cohere', 'parakeet', 'parakeet-multilanguage', 's1-mini')))
        self.profile = BuildProfile('test-version', IDENTIFIER, sha256(self.data), self.patches)

    def test_universal_and_thin_parsing(self) -> None:
        for data in (self.data, universal_binary(wide=True)):
            images = parse_binary(data)
            self.assertEqual([item.cpu for item in images], [0x1000007, ARM64])
            self.assertEqual(images[1].section('__TEXT', '__text').address, TEXT_ADDRESS)
        self.assertEqual(parse_binary(thin_binary(ARM64))[0].cpu, ARM64)

    def test_rejects_truncated_binary(self) -> None:
        for data in (b'', b'garbage!', self.data[:100]):
            with self.assertRaises(ValueError):
                parse_binary(data)

    def test_known_hash_required(self) -> None:
        self.assertEqual(known_profile(self.data, 'test-version', IDENTIFIER, (self.profile,)), self.profile)
        changed = self.data[:-1] + bytes([self.data[-1] ^ 1])
        with self.assertRaisesRegex(ValueError, 'Unknown pristine build'):
            known_profile(changed, 'test-version', IDENTIFIER, (self.profile,))

    def test_same_hash_wrong_version_rejected(self) -> None:
        with self.assertRaisesRegex(ValueError, 'Unknown pristine build'):
            known_profile(self.data, 'new-version', IDENTIFIER, (self.profile,))

    def test_wrong_identifier_rejected(self) -> None:
        with self.assertRaises(ValueError):
            known_profile(self.data, 'test-version', 'different.bundle', (self.profile,))

    def test_models_are_explicit_unique_and_scoped(self) -> None:
        self.assertEqual(select_models(self.profile, ['cohere']), (self.patches[0],))
        for keys in ([], ['cohere', 'cohere'], ['cloud']):
            with self.assertRaises(ValueError):
                select_models(self.profile, keys)

    def test_only_selected_instruction_changes(self) -> None:
        for patches in ((self.patches[0],), self.patches):
            patched = prepare_patch(self.data, patches)
            verify_sections(self.data, patched, patches)
            self.assertEqual(sum(a != b for a, b in zip(self.data, patched)), len(patches))
            self.assertEqual(self.data, universal_binary())

    def test_wrong_instruction_refused_before_mutation(self) -> None:
        wrong = dataclasses.replace(self.patches[0], before=b'xxxx')
        with self.assertRaisesRegex(ValueError, 'instruction mismatch'):
            prepare_patch(self.data, (wrong,))
        self.assertEqual(self.data, universal_binary())

    def test_out_of_range_patch_refused(self) -> None:
        wrong = dataclasses.replace(self.patches[0], address=TEXT_ADDRESS + 128)
        with self.assertRaises(ValueError):
            prepare_patch(self.data, (wrong,))

    def test_unexpected_arm_code_change_detected(self) -> None:
        patched = bytearray(prepare_patch(self.data, (self.patches[0],)))
        arm = parse_binary(bytes(patched))[1].section('__TEXT', '__text')
        patched[arm.offset + 20] ^= 1
        with self.assertRaisesRegex(ValueError, 'Unexpected ARM64'):
            verify_sections(self.data, bytes(patched), (self.patches[0],))

    def test_x86_code_change_detected(self) -> None:
        patched = bytearray(prepare_patch(self.data, (self.patches[0],)))
        x86 = parse_binary(bytes(patched))[0].section('__TEXT', '__text')
        patched[x86.offset] ^= 1
        with self.assertRaisesRegex(ValueError, 'Unrelated section changed'):
            verify_sections(self.data, bytes(patched), (self.patches[0],))

    def test_static_data_change_detected(self) -> None:
        patched = bytearray(prepare_patch(self.data, (self.patches[0],)))
        constant = parse_binary(bytes(patched))[1].section('__TEXT', '__const')
        patched[constant.offset] ^= 1
        with self.assertRaisesRegex(ValueError, 'Unrelated section changed'):
            verify_sections(self.data, bytes(patched), (self.patches[0],))

    def test_wrong_model_scope_detected(self) -> None:
        patched = prepare_patch(self.data, self.patches)
        with self.assertRaises(ValueError):
            verify_sections(self.data, patched, (self.patches[0],))

    def test_destination_is_new_and_separate(self) -> None:
        with tempfile.TemporaryDirectory(prefix='superwhisper-skill-test-') as temporary:
            root = Path(temporary)
            source = root / 'Original.app'
            source.mkdir()
            check_destination(source, root / 'New.app')
            for output in (source, source / 'Nested.app', root / 'not-an-app', root / 'missing/New.app'):
                with self.assertRaises(ValueError):
                    check_destination(source, output)
            (root / 'Existing.app').mkdir()
            with self.assertRaisesRegex(ValueError, 'already exists'):
                check_destination(source, root / 'Existing.app')
            (root / 'Link.app').symlink_to(root / 'Missing.app')
            with self.assertRaisesRegex(ValueError, 'already exists'):
                check_destination(source, root / 'Link.app')

    def test_bundled_profile_has_four_reviewed_stores(self) -> None:
        profiles = load_profiles()
        self.assertEqual(len(profiles), 1)
        self.assertEqual(profiles[0].version, '2.19.2')
        self.assertEqual({item.key for item in profiles[0].patches}, {item.key for item in self.patches})
        self.assertTrue(all(item.before == BEFORE and item.after == AFTER for item in profiles[0].patches))

    def fixture_app(self, root: Path) -> tuple[Path, Path]:
        source = root / 'Original.app'
        executable = source / 'Contents/MacOS/superwhisper'
        executable.parent.mkdir(parents=True)
        executable.write_bytes(self.data)
        resources = source / 'Contents/_CodeSignature/CodeResources'
        resources.parent.mkdir()
        resources.write_bytes(b'fixture-signature-resources')
        (source / 'Contents/Info.plist').write_bytes(plistlib.dumps({
            'CFBundleIdentifier': IDENTIFIER, 'CFBundleShortVersionString': 'test-version',
            'CFBundleExecutable': 'superwhisper',
        }))
        return source, executable

    def fake_run(self, command: list[str]) -> subprocess.CompletedProcess[str]:
        if command[0] == 'ditto':
            shutil.copytree(command[1], command[2], dirs_exist_ok=True)
        output = plistlib.dumps({}).decode() if '--entitlements' in command and '-d' in command else ''
        return subprocess.CompletedProcess(command, 0, stdout=output, stderr='')

    def test_signing_acknowledgement_is_required(self) -> None:
        with tempfile.TemporaryDirectory(prefix='superwhisper-skill-test-') as temporary:
            root = Path(temporary)
            source, executable = self.fixture_app(root)
            with self.assertRaisesRegex(ValueError, 'acknowledged'):
                apply(source, root / 'New.app', 'test-version', self.data, executable, self.patches, False)
            self.assertFalse((root / 'New.app').exists())
            self.assertFalse((root / 'New.app.audit').exists())

    def test_apply_creates_audit_and_preserves_source_with_mock_signer(self) -> None:
        with tempfile.TemporaryDirectory(prefix='superwhisper-skill-test-') as temporary:
            root = Path(temporary)
            source, executable = self.fixture_app(root)
            with mock.patch('ModelTools.platform.system', return_value='Darwin'), \
                 mock.patch('ModelTools.platform.machine', return_value='arm64'), \
                 mock.patch('ModelTools.run', side_effect=self.fake_run):
                report = apply(source, root / 'New.app', 'test-version', self.data, executable, self.patches, True)
            self.assertEqual(report['status'], 'verified_static')
            self.assertEqual(report['functional_test'], 'not_run')
            self.assertEqual(executable.read_bytes(), self.data)
            self.assertEqual((root / 'New.app.audit/OriginalExecutable.bin').read_bytes(), self.data)
            verify_sections(self.data, (root / 'New.app/Contents/MacOS/superwhisper').read_bytes(), self.patches)

    def test_failed_signing_retains_artifacts_with_mock_signer(self) -> None:
        def fail_signing(command: list[str]) -> subprocess.CompletedProcess[str]:
            if '--force' in command:
                raise ValueError('fixture signing failure')
            return self.fake_run(command)

        with tempfile.TemporaryDirectory(prefix='superwhisper-skill-test-') as temporary:
            root = Path(temporary)
            source, executable = self.fixture_app(root)
            with mock.patch('ModelTools.platform.system', return_value='Darwin'), \
                 mock.patch('ModelTools.platform.machine', return_value='arm64'), \
                 mock.patch('ModelTools.run', side_effect=fail_signing), \
                 self.assertRaisesRegex(ValueError, 'fixture signing failure'):
                apply(source, root / 'New.app', 'test-version', self.data, executable, self.patches, True)
            self.assertTrue((root / 'New.app').is_dir())
            self.assertIn('"status": "failed"', (root / 'New.app.audit/Report.json').read_text())
            self.assertEqual(executable.read_bytes(), self.data)

    def test_cli_unknown_build_is_read_only(self) -> None:
        with tempfile.TemporaryDirectory(prefix='superwhisper-skill-test-') as temporary:
            root = Path(temporary)
            source, executable = self.fixture_app(root)
            tool = Path(__file__).with_name('ModelTools.py')
            result = subprocess.run([sys.executable, '-B', str(tool), 'plan', '--source', str(source),
                                     '--models', 'cohere'], capture_output=True, text=True, check=False)
            self.assertEqual(result.returncode, 1)
            self.assertIn('Unknown pristine build', result.stderr)
            self.assertEqual(executable.read_bytes(), self.data)
            self.assertEqual(list(root.iterdir()), [source])


if __name__ == '__main__':
    unittest.main(verbosity=2)
