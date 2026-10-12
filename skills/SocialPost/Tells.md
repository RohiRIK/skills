# Tells: AI-isms, bait, and calques in posts

Phrases and patterns that make a post read as machine-written, as a ghostwriter template, or as engagement bait. The goal is a post that reads like a specific person, not one that evades detectors. Each row is a default. If the user's own draft uses a `warn` phrase on purpose, Rewrite keeps it, reports it, and passes it to the lint with `--keep`; the user's voice wins. `ban` rows are blocked: bait is a policy risk, and leaks and fabrications break trust.

`Tools/LintPost.ts` reads every table on this page whose first header is `Phrase`. Each backtick span is one case-insensitive phrase.
- English phrases match whole words. A trailing `*` makes a word stem (`delv*` matches delve, delves, delving). A leading `^` matches only at the start of a line or a sentence (`^like if you`), for phrases that are bait as a command but ordinary mid-sentence.
- Hebrew phrases may take one prefix letter (ו ה ש ב כ ל מ) and no other letter before them, so `תייגו` doesn't match inside "אל תתייגו". Because Hebrew writes the plural imperative and the past tense the same way, bait rows carry their bait context: `כתבו כן בתגובות`, not `כתבו כן`.
- `Level` is `ban` (error) or `warn`. Three or more `warn` hits in one post become an error: density is the tell. Keep pipes out of the cells.

Adapted with credit from blader/humanizer, hardikpandya/stop-slop, sergebulaev's linkedin-skills and x-skills, and coreyhaines31/marketingskills (`Credits.md`).

## Engagement bait

Meta demotes the five bait kinds and LinkedIn's spam policy names them, so these are blocked in every language. The lint also catches comment-gates in code: a verb such as "comment" or "תגיבו", a keyword to type, and "below", "in the comments", or a promise to send.

| Phrase | Level | Write instead |
|---|---|---|
| `comment yes` · `^comment "` · `comment below and` · `^type yes` · `write yes` | ban | A narrow question that needs a real answer, or the link itself. |
| `^like if you` · `^like this if` · `^share if you` · `repost if you` · `retweet if you` | ban | Ask what you actually want to know. |
| `^react with` · `^vote with` · `vote in the comments` | warn | Bait when it asks for a reaction per option; fine when literal. |
| `tag a friend` · `tag someone who` · `tag 3 friends` | ban | Nothing; people tag friends when the post is worth it. |
| `repost to help` · `share to help` · `share with 10` | ban | Make it worth sharing; say nothing about sharing. |
| `follow for follow` · `F4F` · `join my pod` · `drop your profile` · `I'll connect with everyone` | ban | Delete. Pods and follow trains break platform rules. |
| `תגיבו כן` · `תגיבו 1` · `תגיבו "` · `כתבו כן בתגובות` · `הגיבו כן בתגובות` · `כתבו אמן בתגובות` · `כתבו 1 בתגובות` | ban | שאלה ממוקדת שצריך לחשוב כדי לענות עליה. |
| `בתגובות ואשלח` · `ואשלח לכם בפרטי` | ban | הקישור עצמו, או "המדריך בקישור". |
| `תייגו חבר ש` · `תייגו חברה ש` · `תייגו חברים ש` · `תייגו מישהו ש` · `תייגו את מי ש` · `תייגו 3` | ban | Delete. |
| `שתפו את הפוסט אם` · `שתפו שיגיע` · `שיגיע לכמה שיותר` · `תעבירו הלאה` · `לייק אם` · `תנו לייק אם` · `עשו לייק אם` · `שתפו כדי לעזור` | ban | Delete; make it worth sharing. |

## Chatbot leaks

Text that only exists because a chatbot wrote around the post. The lint also flags a first line such as "Here's a LinkedIn post:" or "הנה פוסט:", a post wrapped whole in quotation marks, and a "Hashtags:" label line.

| Phrase | Level | Write instead |
|---|---|---|
| `feel free to adjust` · `feel free to tweak` · `feel free to customize` | ban | Delete. |
| `^Certainly!` · `as an AI language model` | ban | Delete. |
| `מוזמן לערוך את הפוסט` · `מוזמנת לערוך את הפוסט` · `אפשר לערוך את הפוסט לפי הצורך` · `תרגיש חופשי` · `תרגישי חופשי` | ban | Delete. |

## Openers

The first line is the only line most people see. These carry no information.

| Phrase | Level | Write instead |
|---|---|---|
| `thrilled to announce` · `excited to announce` · `thrilled to share` · `excited to share` · `honored to announce` · `proud to announce` · `beyond excited` | ban | The news itself: "We launched offline mode today." |
| `in today's fast-paced` · `in the ever-evolving` · `ever-changing landscape` · `in today's digital` | ban | Delete the sentence. |
| `let's dive in` · `let's delve` · `buckle up` · `here's the thing` · `stop scrolling` · `big news!` | ban | Start with the fact. |
| `unpopular opinion` · `hot take` · `can we talk about` · `I almost didn't post this` · `this is huge` | warn | State the opinion and the evidence. |
| `נרגש לשתף` · `נרגשת לשתף` · `נרגשים לשתף` · `נרגש לבשר` · `נרגשת לבשר` · `נרגשים לבשר` · `נרגש להכריז` · `נרגשת להכריז` · `נרגשים להכריז` | ban | החדשה עצמה: "השקנו היום מצב offline." |
| `גאה להכריז` · `גאה לבשר` · `גאה לשתף` · `גאים להכריז` · `גאים לבשר` · `גאים לשתף` · `גאה ונרגש` · `גאה ונרגשת` · `בהתרגשות רבה` · `בהתרגשות גדולה` | ban | החדשה עצמה. |
| `בעולם המשתנה במהירות` · `בעולם שבו הכל משתנה` | ban | Delete the sentence. |
| `בעולם של היום` · `בעידן של היום` · `בעידן ה-` | warn | Fine mid-sentence; as an opener, delete it. |
| `הנה העניין` · `בואו נצלול` | ban | Start with the fact. |
| `דעה לא פופולרית` · `לא האמנתי שאכתוב` · `לא חשבתי שאכתוב` · `אף אחד לא מדבר על` · `התלבטתי אם לפרסם` · `התלבטתי הרבה אם` · `בואו נדבר על` | warn | Say the opinion and why. |

## Cadence templates

The lint also counts contrast structures in code: "it's not X, it's Y", "not just X, but Y", "Not X. Not Y. Z.", "זה לא X, זה Y", "לא רק X אלא". These are a well-known AI cadence (Wikipedia, "Signs of AI writing"; blader/humanizer), and one report of LinkedIn's May 2026 crackdown says it targets them.

| Phrase | Level | Write instead |
|---|---|---|
| `let that sink in` · `read that again` | ban | Delete; the line before is the ending. |
| `full stop.` · `and that's okay` | warn | Delete; the line before is the ending. |
| `the best part?` · `the kicker?` · `the result?` · `plot twist` · `spoiler:` · `here's why:` · `here's what I learned` · `here's how:` | warn | State it directly. |
| `lessons I learned` · `things nobody tells you` · `a thread 🧵` · `thread 🧵` | warn | A list only when the content is one, with its real count. |
| `תנו לזה לשקוע` | ban | Delete. |
| `קראו שוב את הפוסט` · `קראו את זה שוב` | warn | Delete; the line before is the ending. |
| `החלק הכי טוב?` · `והטוויסט?` · `התוצאה?` · `הנה מה שלמדתי` · `הנה למה` · `ספוילר:` · `פלוט טוויסט` | warn | Say it directly. |
| `דברים שלמדתי:` · `דברים שאף אחד לא מספר` | warn | A list only when the content is one. |

## Vocabulary

Measurably overused by language models. One is fine; density is the tell.

| Phrase | Level | Write instead |
|---|---|---|
| `delv*` · `tapestry` · `testament to` · `in the realm of` · `unleash*` · `elevat*` · `empower*` · `leverag*` · `synerg*` | warn | The plain verb: use, improve, start, show, help. |
| `game-changer` · `game changer` · `revolutioniz*` · `transformative` · `seamless*` · `cutting-edge` · `pivotal` | warn | What actually changed, with a number. |
| `deep dive` · `my journey` · `move the needle` · `at the end of the day` · `it's important to note` · `navigating the` | warn | Plain words. |
| `משנה משחק` · `גיים צ'יינג'ר` · `המסע שלי` · `למנף את` · `סינרגיה` · `חוויה חלקה` · `חלק בלתי נפרד` · `לרמה הבאה` · `בסופו של יום` | warn | מילים פשוטות: מה השתנה, במספר. |
| `זה לא סוד ש` · `חשוב לציין ש` · `יתרה מזאת` · `לסיכום,` · `צלילה לעומק` · `צלילה עמוקה` · `שורה תחתונה:` | warn | Delete the frame; say the point. |

## Closers, comments, and humblebrag

| Phrase | Level | Write instead |
|---|---|---|
| `thoughts?` · `agree?` · `let me know in the comments` · `what do you think? let me know` · `drop a comment` | warn | A narrow question tied to the content. |
| `follow me for more` · `follow for more` · `save this for later` · `bookmark this` · `hit the 🔔` | warn | End on the strongest line. |
| `great post` · `thanks for sharing` · `פוסט מעולה` · `תודה ששיתפת` | warn | In a comment, add one specific point instead. |
| `humbled to` · `grateful. honored` · `never in my wildest dreams` · `still can't believe I get to` · `not to brag` | warn | Say it straight, with what you'll actually do. |
| `מסכימים?` · `מה דעתכם? 👇` · `ספרו לי בתגובות` · `אשמח לשמוע את דעתכם בתגובות` · `מחשבות?` · `נשמע מוכר?` · `אחריי לעוד` · `שמרו את הפוסט` · `בחלומות הכי פרועים` | warn | שאלה ממוקדת, או לסיים במשפט החזק. |

## Hebrew-English calques (Heblish)

In English posts by Hebrew speakers. More in `English.md`.

| Phrase | Level | Write instead |
|---|---|---|
| `as we spoke` · `in continuation to` · `I'm turning to you` · `according to what we agreed` | ban | "As we discussed" · "Following up on" · "I'm writing about" · "As agreed" |
| `I will be happy if you` · `I'll be happy if you` · `will be glad for your` | ban | "Could you…?" · "I'd appreciate your…" |

## Patterns the lint checks in code

- Comment-gates and share bait in both languages, beyond the phrases above.
- Contrast and reveal structures: one is a warning, two an error.
- Em dashes: one is a warning, two or more an error. Exclamation marks: more than two is a warning.
- Emoji bullets: three or more lines starting with an emoji or a symbol such as ✔ or ➡ is an error. More than three emoji in a post is a warning.
- Broetry: four or more one-sentence paragraphs in a row is a warning.
- Fake formatting: Unicode "bold" and "italic" letters, circled letters, small capitals, and combining strikethrough are errors.
- Markdown: `**bold**`, `# heading`, `[text](url)`, and tables are errors. WhatsApp and Telegram have their own markers (`Channels.md`).
- Chatbot preambles, a post wrapped in quotation marks, a "Hashtags:" label line.

## Judged in Review, not linted

- An invented or unsupported story, number, quote, or testimonial. The single most serious tell, and illegal in ads (`Disclosure.md`).
- Someone else's results written as the user's: an article's "we" turned into the user's "we".
- A lesson that doesn't follow from the story, or a tragedy, layoff, or reserve duty turned into a sales lesson.
- Every list with exactly three items; every paragraph ending in a moral.
- Gratitude, humility, and enthusiasm stacked in one post.
- Mass-tagging people who weren't involved.
