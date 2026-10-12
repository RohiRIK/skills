# Hebrew posts

Write Hebrew posts in Hebrew from the start. A translated English post carries calques and an American rhythm that Israeli readers spot in the first line (`Tells.md`). These rules match the Email skill's house rules, plus what posts need on top.

## House rules

- **Technical English stays in English.** Product names, UI labels, code, acronyms, and the tech terms the team says in English stay in English letters: "השקנו את ה-API החדש", "צריך לעשות Enable ל-feature flag". Prefixes take a hyphen before a Latin word or a number: ה-API, ב-Jira, ב-2026. Never invent a Hebrew translation of a term, and never gloss one: no "להפעיל (Enable)".
- **No parentheses.** A parenthetical reads as academic or translated in a Hebrew post, costs characters, and lands on the wrong side when a line flips to left-to-right. Modern renderers draw parentheses correctly in a right-to-left line, so this is a style rule plus a safety margin. Use a comma, a colon, a new sentence, or a new line. The lint rejects any parenthesis in a Hebrew line.
- **Everyday register**: "אפשר", "צריך", "עכשיו". At most one colloquialism per post (אחלה, סבבה, תכלס, יאללה, בקיצור) and only where the platform fits it. Stacked slang from an AI reads fake, and so does high register like "כעת" or "הנכם מוזמנים" in a casual post.
- **Formats**: dates 12.10.2026, times 14:30, money 4,500 ₪, days "יום א'" through "יום ו'" and "שבת". No niqqud.

## Gender

Posts are full of first-person present tense, and Hebrew marks it for gender: "אני שמח" or "אני שמחה", "זמין" or "זמינה", "נרגש" or "נרגשת".
- **The author**: `he_gender` from the profile, or the user's own Hebrew in the request. Never from a name. Unknown: use past tense ("התחלתי היום תפקיד חדש"), future ("אשמח לשמוע"), or forms spelled the same for both ("אני עושה", "אני רואה", "אני גאה"). Slash forms in the author's own voice ("שמח/ה") look like a template; the lint flags them.
- **The readers**: a feed audience is addressed in the plural: "תגיבו", "מוזמנים", "אתם". Or impersonally: "מי שרוצה…", "אפשר להירשם כאן", "שווה לקרוא". Doubling ("חברים וחברות", "כולם וכולן") suits an opening or a call to action. Never the masculine singular "אתה" for a whole audience.
- **Company pages**: first-person plural "אנחנו", which carries no gender.
- **Hiring posts**: job ads are written for all genders because Israeli equal-opportunity law bars discriminatory ads. Slash forms such as "מפתח/ת" are standard there, and the lint allows them with `--type hiring`.

## Right-to-left in posts

- **A line's direction comes from its first letter.** Digits, emoji, `#`, `@`, and punctuation don't count. The first Hebrew or Latin letter decides. So "🚀 השקנו היום", "2026 הייתה שנה…", and "#הייטק זה…" stay right-to-left, while "Figma השיקה…" and "@dana כתבה…" flip to left-to-right and scramble the punctuation. Start every Hebrew line with a Hebrew letter: "השקנו את Figma Make", "תודה רבה @dana". The lint warns on this.
- **English quotes go on their own line.** "כמו שאמר Steve Jobs: Stay hungry. וזה נכון." moves the period to the wrong side. Put the English sentence on its own line and continue in Hebrew on the next.
- **Pointers point the other way.** Emoji and arrows don't mirror, so "👉" in a Hebrew line points back to the start. Use "👈" or "←" to point forward to a link or the next line, or "👇" before a link on its own line.
- **Numbers**: hyphenated and dotted numbers stay intact: 054-1234567, 12.10.2026, 10-20. Spaced digit groups ("054 123 4567"), a leading plus ("+972…"), and a leading minus ("-5%") get reordered. Write mobile numbers with hyphens, international numbers and URLs on their own line, and decreases in words: "ירידה של 5%".
- **Invisible marks are a last resort.** An RLM (U+200F) at the start of a line can force right-to-left, but it costs 2 characters on X, stops a following hashtag from working on Bluesky and Mastodon and a following mention on Bluesky, and travels invisibly in copy and paste. Reword so a Hebrew word comes first instead.
- **Terminals lie.** Hebrew that looks reversed in a terminal is a display problem; never reverse characters to fix it. Check in the app or a browser.

## Hashtags and mentions

- **Hebrew hashtags**: join words with `_`: `#גיוס_עובדים`, `#בינה_מלאכותית`. No punctuation inside a tag: `#צה"ל` breaks into `#צה` on X and Mastodon. Drop the acronym marks (`#צהל`) or write the words out. More detail per platform: `Platforms.md`.
- **One language of tags per line.** A line mixing `#AI` and `#בינה_מלאכותית` always shows one `#` on the wrong side. Hebrew tags go with Hebrew text; English tags on their own last line.
- **Tags at the end**, never as the first word of a line that should be Hebrew, and never glued to a word: `ב#AI` is not a tag.
- **Mentions**: handles are Latin, so a mention is a Latin run inside the Hebrew line. Put a space before `@` ("תודה רבה @dana"); "ל-@dana" works on X and Mastodon but not on Bluesky. Never open a line with a handle. `@` followed by Hebrew is not a mention anywhere.

## Language choice

- **Who chooses**: the owner. Posts are in English unless the owner explicitly requests Hebrew (`Policy.md`); a Hebrew request message or a Hebrew source post doesn't choose. When the owner is deciding, this is the trade-off:
- **LinkedIn**: English reaches global recruiters, investors, and customers; Hebrew gets warmer local engagement. Israeli tech posts in Hebrew keep the tech terms in English.
- **Both audiences**: two separate native posts beat one bilingual post. A bilingual post doubles the length, hides the second language behind "see more", and mixes directions. If the user wants one post: the Hebrew block, a blank line, the English block, each written natively and each line starting in its own script. On X, a thread with the primary language first.

## The Israeli calendar

- **Work week**: Sunday to Thursday. Friday is a half day, Shabbat runs from Friday sundown to Saturday night. B2B and LinkedIn posts land best Sunday to Thursday; consumer audiences scroll on Saturday. Some brands and public bodies never post on Shabbat or holidays.
- **Holidays start at sundown the evening before.**
- **Pause check**: on national memorial days, on Yom Kippur, and on days of attacks, rocket fire, or announcements of fallen soldiers or hostages, the norm is to pause scheduled promotional or upbeat posts and post nothing, or a short sober message. Yom HaZikaron turns into Yom HaAtzmaut at the evening ceremony; celebration only after that. Before scheduling, ask the user about current events; never assume a quiet week.
- **Israel and the US**: Israel is 7 hours ahead of New York most of the year, 6 hours in the gaps between the two countries' clock changes. A slot of 16:00 to 18:00 Israel time is 9:00 to 11:00 in New York. Israeli Friday is not a workday; US Friday is.

Dates computed with `@hebcal/core` (Israel schedule) and Python `zoneinfo` on 2026-10-12. Refresh this table every year (`Workflows/Refresh.md`):

| Date | Day | What | Posting note |
|---|---|---|---|
| 22.10.2026 | Thu | Rabin Memorial Day | Sober tone |
| 25.10 to 31.10.2026 | | Israel is 6 hours ahead of New York | Shift bilingual slots |
| 5.12 to 12.12.2026 | Sat to Sat | Hanukkah, first candle the evening of 4.12 | Festive posts fine |
| 14.3 to 25.3.2027 | | Israel is 6 hours ahead of New York | Shift bilingual slots |
| 23.3.2027 | Tue | Purim | Festive posts fine |
| 22.4 to 28.4.2027 | Thu to Wed | Pesach, first and last days are holidays | Many people off all week |
| 4.5.2027 | Tue | Yom HaShoah | Pause promotional posts |
| 11.5.2027 | Tue | Yom HaZikaron | Pause until the evening ceremony |
| 12.5.2027 | Wed | Yom HaAtzmaut | Festive posts fine |
| 11.6.2027 | Fri | Shavuot | Holiday |
| 12.8.2027 | Thu | Tisha B'Av | Sober tone |
| 2.10 to 3.10.2027 | Sat to Sun | Rosh Hashanah | Holiday; "אחרי החגים" deferrals start |
| 11.10.2027 | Mon | Yom Kippur | No posting |
| 16.10 to 23.10.2027 | Sat to Sat | Sukkot and Simchat Torah | Holiday period |
| 31.10 to 6.11.2027 | | Israel is 6 hours ahead of New York | Shift bilingual slots |

7 October is observed every year, and the official memorial day for the war falls on 24 Tishrei; treat both as pause days and confirm the date with the user.
