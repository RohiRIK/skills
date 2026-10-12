# Voice profile

A short file that makes every draft sound like its sender. Every workflow reads it when it exists; `Workflows/Profile.md` creates and updates it.

The profile is personal data, so it lives outside this public skill folder:
- Default path: `~/.claude/state/email-profile.md`. A path the user names, or the host's memory, works too.
- Never write a filled profile into the skill folder or commit it to the repo.

## Fields

```yaml
name: ""                  # as signed in email
signature_en: |           # multi-line block, exactly as it should appear
signature_he: |
he_gender: ""             # m | f | neutral. Hebrew first-person agreement: אני שמח / אני שמחה.
                          # neutral = always use gender-free first-person forms.
time_zone: ""             # e.g. Asia/Jerusalem; used for meeting slots
english_variant: ""       # US | UK
default_register:         # formal | professional | friendly | casual, per audience
  internal: friendly
  clients: professional
  authorities: formal
sign_off: { en: "Best,", he: "תודה," }
tech_terms_in_hebrew: latin  # latin = keep technical terms in English letters (default)
                             # mixed = everyday loanwords such as באג, פיצ'ר in Hebrew letters
parentheses: none-in-hebrew  # house rule; see Hebrew.md
font: "Arial, 'Segoe UI', Tahoma, sans-serif"  # for rich text and HTML only
emoji: none               # none | thread-only | ok
length: short             # short | medium
use_phrases: []           # the user's own recurring phrases, to keep
avoid_phrases: []         # banned for this user, beyond Tells.md
notes: ""                 # e.g. "OOO always bilingual", "CC my assistant on client mail"
```

## When fields are missing

- Missing profile or signature: check approved owner context first. If a signed draft still needs an unknown exact name or language-specific spelling, apply `Clarification.md` and ask before drafting; do not silently insert `[Your name]`. Use neutral gender forms and existing tone defaults for nonessential gaps. Offer the Profile workflow only when persistent saving is useful and approved.
- Only `he_gender` affects how natural the Hebrew sounds; gender-free forms cover the gap until it's known.
- The user's own message can fill a field for the current draft: Hebrew they write in first person shows their grammatical gender, and a name they sign with is their name. Use it for this draft; save it only through the Profile workflow.
