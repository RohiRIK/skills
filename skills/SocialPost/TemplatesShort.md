# Templates: X, Threads, Bluesky, Mastodon

Craft, counting, and threads: `ShortForm.md`. Check every draft with `LintPost.ts --platform <name>`: Hebrew and English count differently on each.

## One claim with evidence

**Moves:** what changed and the result, with a number · why it worked, in one sentence. One idea. No hashtags on X by default.

```text x en
[What changed]: [the result, with a number, such as "median PR wait dropped from 19 hours to 6"].

[Why it worked, in one sentence.]
```

```text x he
[מה שינינו]: [התוצאה, עם מספר, למשל: "זמן ההמתנה החציוני ל-PR ירד מ-19 שעות ל-6"].

[למה זה עבד, במשפט אחד.]
```

## How-to thread

**Moves:** post 1 stands alone with the result and the promise · one change per post · the last post: the first thing to do, and the link. Number at the end, `n/N`. Split long drafts with `LintPost.ts --split --platform x`.

```text x en
[The result and the promise, such as "We cut our cloud bill by 38% in a month. Four changes did most of it:"] 1/4
```

```text x en
[Change one: what you did, and what it saved.] 2/4
```

```text x en
[Changes two and three, one line each.] 3/4
```

```text x en
[The one change to make first, and where the full write-up is: link] 4/4
```

```text x he
[התוצאה וההבטחה, למשל: "הורדנו את חשבון הענן ב-38% בחודש אחד. ארבעה שינויים עשו את רוב העבודה:"] 1/4
```

```text x he
[שינוי ראשון: מה עשינו, וכמה זה חסך.] 2/4
```

```text x he
[שינוי שני ושלישי, שורה לכל אחד.] 3/4
```

```text x he
[השינוי שכדאי לעשות קודם, ואיפה הסיכום המלא: קישור] 4/4
```

## Quote post

**Moves:** add one specific thing the original doesn't have: a number, a counterexample, what happened when you tried it. A quote post reaches people who don't follow the original author; a reply mostly doesn't.

```text x en
[Your specific addition: a number, a counterexample, or what happened when you tried it.]

[Who this applies to, in one line.]
```

```text x he
[התוספת הספציפית שלך: מספר, דוגמה נגדית, או מה קרה כשניסית.]

[למי זה רלוונטי, בשורה אחת.]
```

## Live or incident update

**Moves:** what, when with a time zone, and the current state · what people should do · when the next update comes. Facts only; no guesses about causes.

```text x en
[Event or incident] update, [time and time zone]: [what's happening now, in one line].

[What people should do, if anything.] Next update by [time].
```

```text x he
עדכון [אירוע או תקלה], [שעה]: [מה קורה עכשיו, בשורה אחת].

[מה כדאי לעשות, אם בכלל.] העדכון הבא עד [שעה].
```

## Correction

**Moves:** say what was wrong and what's right, once, plainly · thank whoever caught it. Post it as a reply to or quote of the original.

```text x en
Correction to my post [earlier today / on date]: [what was wrong]. The right [figure / name] is [correct value]. [Thanks to name for catching it.]
```

```text x he
תיקון לפוסט שלי [מהבוקר / מתאריך]: [מה היה שגוי]. הנכון הוא [הערך הנכון]. [תודה ל[שם] על ההערה.]
```

## Release or launch for a community

**Moves:** what's out and the change people asked for · the next most important change · release notes · 1 to 4 tags, CamelCase in English, `_` in Hebrew. Write alt text for any screenshot, and set the post language to `he` for Hebrew.

```text mastodon en
[Project] [version] is out: [the change people asked for, in plain words].

[The next most important change, in one line.]

Release notes: [link]

#OpenSource #[ProjectTag]
```

```text mastodon he
יצאה גרסה [גרסה] של [פרויקט]: [השינוי שביקשו, במילים פשוטות].

[השינוי הבא בחשיבותו, בשורה אחת.]

הערות הגרסה:
[קישור]

#קוד_פתוח
```

## Conversational post

**Moves:** something real from the user's day, in a conversational voice · a detail or a genuine question. Threads takes one topic tag, added in the app.

```text threads en
[A real observation from your day, such as "Spent the morning moving our docs to a new tool, and search finally works."]

[One detail, or a genuine question for people who've done the same.]
```

```text threads he
[משהו אמיתי מהיום שלך, למשל: "העברנו הבוקר את התיעוד לכלי חדש, וסוף סוף החיפוש עובד."]

[פרט אחד, או שאלה אמיתית למי שעשה את אותו הדבר.]
```
