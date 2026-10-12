# Templates: scenario index

Pick the scenario, open its file, and adapt the skeleton. A template gives structure, not copy: rewrite every line for the real recipient and facts, and keep the moves. Each template lists its moves, a subject pattern, and two skeletons, one written natively in English and one in Hebrew. The Hebrew is not a translation of the English.

- `[Brackets]` are placeholders. Each one is filled, or listed under the draft, before sending.
- Hebrew skeletons use forms that carry no gender for either side (`Hebrew.md`). Once a gender is known, natural gendered phrasing is fine.
- Hebrew skeletons contain no parentheses, and technical terms stay in English.
- `Lint type` is the `--type` to pass to `Tools/LintEmail.ts`, which sets the length budget.
- After editing any template, run `bun Tools/LintEmail.ts --check-templates`.

| Scenario | File | Lint type |
|---|---|---|
| Ask for something: information, a file, a decision, an action | `TemplatesRequests.md` | request |
| Follow up when nobody replied | `TemplatesRequests.md` | followup |
| Payment reminder, first and second | `TemplatesRequests.md` | followup / hard |
| Say yes, confirm, accept | `TemplatesRequests.md` | reply |
| Meeting request with time slots | `TemplatesMeetings.md` | meeting |
| Reschedule or cancel | `TemplatesMeetings.md` | meeting |
| Meeting recap with action items | `TemplatesMeetings.md` | recap |
| Cold outreach, first contact | `TemplatesOutreach.md` | cold |
| Introduce two people, double opt-in | `TemplatesOutreach.md` | request |
| Thank you | `TemplatesOutreach.md` | reply |
| Introduce yourself: new role, new client, new team | `TemplatesOutreach.md` | request |
| Decline, say no | `TemplatesHard.md` | hard |
| Apologize for a mistake | `TemplatesHard.md` | hard |
| Bad news, a delay | `TemplatesHard.md` | hard |
| Complaint or escalation to a vendor or service | `TemplatesHard.md` | hard |
| Push back, disagree, negotiate | `TemplatesHard.md` | hard |
| Status update | `TemplatesUpdates.md` | update |
| Announcement to a team or customers | `TemplatesUpdates.md` | announcement |
| Handover before time off | `TemplatesUpdates.md` | update |
| Out-of-office auto-reply, bilingual | `TemplatesUpdates.md` | followup |
| Formal letter to an authority or institution | `TemplatesFormal.md` | formal |
| Job application | `TemplatesFormal.md` | cold |
| Resignation | `TemplatesFormal.md` | hard |

No template fits? Use `Anatomy.md` directly: point first, one ask with a date, the right register, the length budget of the closest type.
