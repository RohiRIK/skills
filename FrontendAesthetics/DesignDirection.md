# Design Direction — the brain

Adapted from Anthropic's canonical `frontend-design` skill. This is the judgment layer: how to make deliberate, brief-specific visual choices instead of templated defaults.

Approach it as the design lead at a studio known for giving every client an identity that couldn't be mistaken for anyone else's. The client has already rejected templated proposals — make opinionated choices about palette, typography, and layout specific to this brief, and take one real aesthetic risk you can justify.

## Ground it in the subject

If the brief doesn't pin down what the product is, pin it yourself: name one concrete subject, its audience, and the page's single job. Distinctive choices come from the subject's own world — its materials, instruments, artifacts, vernacular. Build with the brief's real content throughout. Use any known context about the user's preferences as a hint.

## Design principles

- **The hero is a thesis.** Open with the most characteristic thing in the subject's world — headline, image, animation, live demo, interactive moment. A big number + small label + supporting stats + gradient accent is the template answer; use only if truly best.
- **Typography carries personality.** Pair display and body faces deliberately — not the families you'd reach for on any project. Set a clear scale with intentional weights, widths, spacing. Make the type treatment itself memorable.
- **Structure is information.** Numbering, eyebrows, dividers, labels should encode something true about the content. Numbered markers (01/02/03) are only appropriate when the content actually is a sequence. Question whether each structural device earns its place.
- **Motion is deliberate.** Consider whether animation serves the subject (page-load sequence, scroll reveal, hover micro-interactions, ambient atmosphere). One orchestrated moment usually beats scattered effects. Often less is more — extra animation reads as AI-generated.
- **Match complexity to the vision.** Maximalist directions need elaborate execution; minimal ones need precision in spacing, type, detail. Elegance is executing the chosen vision well.
- **Copy is design material.** Generic copy makes a design feel as templated as the layout — see "Writing" below.

## The three default looks to avoid

AI-generated design clusters around three looks, applied regardless of subject:
1. Warm cream background (~#F4F1EA) + high-contrast serif display + terracotta accent.
2. Near-black background + a single bright acid-green or vermilion accent.
3. Broadsheet layout: hairline rules, zero border-radius, dense newspaper columns.

All three are legitimate *for some briefs*. Where the brief pins a direction, follow it exactly — the brief's words win, even if they ask for one of these. Where an axis is free, don't spend that freedom on a default.

## Process: brainstorm → critique → build → critique

Work in two passes:
1. **Brainstorm a token system** from the brief — Color: 4–6 named hex values. Type: 2+ roles (characterful display used with restraint, complementary body, utility face for captions/data). Layout: a concept in one-sentence prose + ASCII wireframes. Signature: the single element this page is remembered by.
2. **Critique the plan against the brief before building.** If any part reads like the generic default you'd produce for any similar page (mentally run a similar prompt and see if you land in the same place), revise it and say what you changed and why. Only then write code, deriving every color and type decision from the revised plan.

Watch CSS selector specificity — type-based (`.section`) and element-based (`.cta`) selectors cancel each other out, especially on section padding/margins. Do most planning in thinking; show the user only higher-confidence ideas.

## Restraint and self-critique

Spend your boldness in one place — let the signature element be the one memorable thing, keep everything around it quiet, cut decoration that doesn't serve the brief. Not taking a risk is itself a risk. Build to a quality floor without announcing it: responsive to mobile, visible keyboard focus, reduced-motion respected. Critique as you build (screenshots if available — a picture is worth 1000 tokens). Chanel's rule: before leaving, remove one accessory.

## Writing in design

Words exist to make the design easier to understand and use — design material, not decoration. Write from the end user's side: name things by what people control ("notifications", not "webhook config"). Active voice; a control says exactly what happens ("Save changes", not "Submit"), and keeps the same name through the flow ("Publish" → "Published"). Treat errors and empty states as direction, not mood — explain what went wrong and how to fix it. Sentence case, plain verbs, no filler; each element does exactly one job.
