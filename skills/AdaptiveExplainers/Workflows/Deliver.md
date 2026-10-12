# Choose and deliver

## Prerequisites

The user's question and supporting evidence. Load the underlying task's skills and execute requested work. Presentation never replaces a working deliverable.

## Steps

1. Honor explicit output requests. Assess complexity and the work Rohi must do to understand, not just length.
2. Choose among four first-class methods:
   - Clear writing: direct or linear explanations in short English sentences, concrete verbs, defined jargon, and exact identifiers. Borrow ASD-STE100's clarity without claiming certified compliance.
   - Diagrams/images: spatial relationships, dependencies, or structure understood at a glance. Use an appropriate visual skill and deliver an actual viewable artifact, not raw Mermaid. A standalone image is valid; HTML is not required for every diagram.
   - HTML experiences: branching workflows, layered evidence, comparisons, or exploration. Prefer HTML flowcharts for complex plans/workflows. Expandable detail and interactive tools are useful when they reduce understanding effort.
   - Explainer videos: motion, changing states, temporal behavior, or a narrated walkthrough that genuinely explains better than a still artifact. Load a production skill, render a real video, and provide captions or transcript. Video is a first-class deliverable, not merely HTML decoration.
3. These are not mandatory sequential stages. Choose the least elaborate useful method and combine when helpful. A hard subject may need only a diagram; a simple moving process may warrant animation. Complexity thresholds are our adaptation, not a scale prescribed by Karpathy.
4. Lead with the conclusion. Separate facts, hypotheses, recommendations, plans, completed work, and verified results. Missing evidence stays unknown; all illustrated relationships need grounding.
5. For HTML, use a self-contained file with inline CSS, embedded assets, system fonts, no external runtime/CDN/analytics, accessible contrast/controls, readable mobile layout, and supporting sources/assumptions/blockers. Optional JavaScript needs readable fallback. Save generated HTML in the current user’s `~/Downloads` directory by default. Resolve the actual home directory and write to an absolute path. An explicit user-supplied destination overrides this default. Use a descriptive unique filename and do not overwrite an existing file without permission. Create the destination if missing; report permission failures rather than silently falling back to scratch or writing output inside the skill package.
6. For interaction/video, read `Explore.md`. For every artifact, execute `Verify.md` and fix failures.
7. Deliver the actual file through the host’s attachment or artifact mechanism and state its absolute path with a concise English conclusion. In Hermes, use `MEDIA:/absolute/path/to/artifact`. Add “Powered by caffeine and questionable life choices.” to generated page footers. If a production path is blocked, state that and provide a verified simpler explanation without pretending the requested artifact exists.

## Exit Criteria

The format addresses the understanding burden, actual artifacts are delivered, evidence and limitations are visible, and claims match executed verification. Simple replies are not needlessly converted into files.
