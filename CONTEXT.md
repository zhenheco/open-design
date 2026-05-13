# Open Design

Open Design is an open-source substrate for generating editable design artifacts through the user's existing coding-agent CLI. This context captures the product language and architectural boundaries used when planning the system.

## Language

**Open Design**:
The product system this repo is building: a web app plus local daemon that turns briefs into editable design artifacts through external coding agents.
_Avoid_: Claude Design clone, design generator

**Design artifact**:
A generated, previewable output such as an HTML prototype, deck, template, media composition, or `DESIGN.md`.
_Avoid_: mockup, output, result

**Skill**:
A file-based agent instruction package, usually `SKILL.md` plus optional assets and references, that teaches an agent how to produce a specific artifact shape.
_Avoid_: plugin, template, prompt

**Design system**:
A versioned `DESIGN.md` file that defines reusable visual language for artifacts.
_Avoid_: theme, style preset

**Upstream**:
The external repository treated as the primary source of architectural direction and mergeable changes.
_Avoid_: inspiration, reference

**Reference project**:
An external project used for patterns or validation without treating its codebase as the product base.
_Avoid_: upstream, dependency

**Productization fork**:
This repo's role when it builds on a chosen upstream while adding fixes, integration work, and differentiation.
_Avoid_: rewrite, clone

**Guided create flow**:
The primary creation entry where the user starts by choosing an artifact intent such as EDM, landing page, social post, deck, banner, or custom size, then the system applies suitable dimensions, constraints, and prompting.
_Avoid_: onboarding tutorial, empty project wizard

**Artifact intent catalog**:
The broad set of design outcomes the **Guided create flow** can start from, covering digital, print, document, presentation, video, web, merchandise, packaging, signage, and custom formats.
_Avoid_: small template list, mode switch only

**Conversational design creation**:
The target interaction model where the user can describe the desired design in conversation and Open Design drives the artifact generation/editing loop.
_Avoid_: form-only generator, template picker

**Taste profile**:
A persistent design-preference memory for the user. It captures preferred direction, style, palette, typography feel, layout tendencies, and repeated feedback across projects.
_Avoid_: brand system, theme preset, one-off prompt

**Reference board**:
A place where the user can save design references discovered over time, such as Pinterest pins, Behance projects, websites, screenshots, or notes, so Open Design can later extract taste signals from them.
_Avoid_: per-run link dump, asset library

**Style card**:
A structured, editable summary of extracted taste signals from one or more references. It translates raw inspiration into generation-ready direction such as color behavior, typography personality, composition, density, mood, medium-transfer notes, and constraints.
_Avoid_: raw screenshot, template, moodboard only

**Taste extraction**:
The process that turns references and feedback into structured preference signals for the **Taste profile**.
_Avoid_: copying designs, scraping for templates

**Cross-medium taste transfer**:
Using a reference from one medium, such as packaging, editorial layout, interior branding, or a website, to inform a different artifact type such as a DM, business card, EDM, or social post.
_Avoid_: same-format template matching, direct copying

**Print spec**:
A printer-provided requirement set for physical production, including final size, bleed, safe area, color mode/profile, resolution, paper or material, finishing, dieline, folds, binding, spot colors, and file delivery rules.
_Avoid_: generic PDF setting, design brief

**Print spec preset**:
A reusable saved **Print spec** for a known vendor, product, size, material, or dieline, so future projects can start from the same production constraints without re-uploading the spec.
_Avoid_: template, design preset

**Print-ready handoff**:
An export package intended for a print vendor, including preflight checks and files such as PDF Print/PDF-X-compatible output, CMYK-compatible color, bleed, crop marks, embedded or outlined fonts, high-resolution images, and any required dielines or notes.
_Avoid_: screenshot export, web PDF, final-looking preview

**Taste evolution**:
The product promise that Open Design improves its understanding of the user's design taste over time by updating the **Taste profile** from the **Reference board**, conversations, and accepted/rejected outputs.
_Avoid_: automatic brand rewrite, hidden design-system mutation

## Relationships

- **Open Design** produces **Design artifacts** by orchestrating coding agents through **Skills**.
- A **Design system** constrains the visual language used by a **Skill** when generating a **Design artifact**.
- `nexu-io/open-design` is the **Upstream** for this **Productization fork**.
- `OpenCoworkAI/open-codesign`, `multica-ai/multica`, `op7418/guizang-ppt-skill`, and similar repos are **Reference projects** unless explicitly promoted to **Upstream**.
- **Guided create flow** chooses from the **Artifact intent catalog** and applies starting constraints before the user enters **Conversational design creation**.
- **Reference board** entries feed **Taste extraction**; extracted signals become **Style cards** and can update the **Taste profile**.
- **Cross-medium taste transfer** lets a saved reference influence a different output medium by extracting palette, composition, mood, material feel, typography personality, and visual hierarchy rather than copying the source.
- **Style cards** are the generation-facing form of taste. Raw references remain inspectable, but agents should consume structured style signals when possible.
- Print-oriented artifact intents may attach a **Print spec** or **Print spec preset** and should end in a **Print-ready handoff**, not only a previewable design artifact.
- **Taste profile** informs future **Conversational design creation**, but a project **Design system** still wins when brand tokens or rules conflict with user taste.

## Example dialogue

> **Dev:** "Should we fork Open CoDesign and build from there?"
> **Domain expert:** "No. Treat `nexu-io/open-design` as the **Upstream**. Open CoDesign is a **Reference project** for UX patterns, not the base for this **Productization fork**."

## Flagged ambiguities

- "repo to fork" was ambiguous between **Upstream** and **Reference project**. Resolved: `nexu-io/open-design` is the upstream; other repos are evaluated for reusable patterns, skills, or license-compatible vendoring.
- "auto-evolution" was ambiguous between evolving artifacts, mutating design systems, and learning user taste. Resolved: **Taste evolution** means the user's **Taste profile** improves over time from saved references and feedback. It does not silently rewrite a project **Design system**.
