# Design Taste Evolution

**Parent:** [`v1-baseline.md`](v1-baseline.md) · **Context:** [`../../CONTEXT.md`](../../CONTEXT.md)

This plan captures the first differentiated product direction after the v1 baseline is stable. The goal is not to make a better empty canvas. The goal is to let a user talk to Open Design and have the system generate design artifacts using a remembered understanding of what the user likes.

Canva is a coverage benchmark for breadth of creation entry points and print handoff expectations, not a UI clone target. Canva's public create guides list broad document types such as banners, brochures, social media, business cards, docs, whiteboards, flyers, labels, menus, posters, presentations, videos, and websites, while Canva Print groups physical products across marketing materials, branded merchandise, office supplies, apparel, and signage.

## Product Thesis

Open Design should become a conversational design system that learns the user's taste over time.

The user should not need to paste the same Pinterest, Behance, website, or screenshot references into every generation. They should be able to save references whenever they find them, let Open Design organize and extract taste signals, and later ask for an EDM, web page, social post, deck, banner, or custom artifact through conversation.

References can come from a different medium than the final artifact. A designer may like a package, poster, storefront, magazine spread, or website and later want that taste translated into a DM, business card, EDM, or landing page. Open Design should support this **Cross-medium taste transfer** by extracting reusable visual signals instead of treating references as same-format templates.

## Experience Shape

The primary creation path is a **Guided create flow**, not a traditional onboarding tutorial:

1. Choose artifact intent from the **Artifact intent catalog**.
2. Apply starting dimensions, platform constraints, and output expectations.
3. Choose or infer a style direction from the user's **Taste profile**.
4. Optionally attach project-specific references or brand rules.
5. Enter **Conversational design creation** to generate and refine the artifact.

The learning path is separate but connected:

1. User saves references into a **Reference board** over time.
2. Open Design performs **Taste extraction** to identify complete style signals.
3. Extracted signals become editable **Style cards** and can update the user's **Taste profile**.
4. Future conversations use the profile unless a project **Design system** or explicit brief overrides it.

The **Reference board** is a first-class product entry, not a hidden settings panel. Settings/Memory can remain the first implementation substrate, but the user-facing shape must make saving day-to-day inspiration feel like a normal part of the product.

## Artifact Intent Catalog

The catalog should be broad like Canva, but grouped for guided creation instead of shown as one overwhelming template wall.

| Group | Starting intents |
|---|---|
| Social | Instagram post/story/reel cover, Facebook post/cover/ad, LinkedIn post/banner, X/Twitter post/header, YouTube thumbnail/banner, TikTok cover, Lemon8, Pinterest pin, social carousel |
| Ads and marketing | EDM, newsletter, DM, flyer, brochure, rack card, poster, banner, display ad, product launch graphic, sales sheet, coupon, gift certificate |
| Web and app | Landing page, website section, hero, pricing page, dashboard, app screen, prototype, email capture page, product page |
| Brand identity | Logo concept, brand board, business card, letterhead, envelope, email signature, brand guideline excerpt |
| Documents | Proposal, report, invoice, resume, worksheet, form, checklist, menu, calendar, planner, certificate, flashcard |
| Presentations | Pitch deck, sales deck, lesson deck, product demo deck, keynote-style slides, webinar slides |
| Print products | Business card, postcard, invitation, thank-you card, sticker, label, notebook cover, photobook, booklet, magazine, catalog, wrapping paper |
| Packaging | Box, sleeve, pouch, bottle label, jar label, paper bag, shipping envelope, hang tag, insert card |
| Merchandise | T-shirt, hoodie, tote bag, mug, water bottle, coaster, mouse pad, magnet |
| Signage and large format | Yard sign, floor decal, storefront sign, event signage, roll-up banner, trade show panel |
| Video and motion | Short video, video cover, animated social post, intro/outro card, lower third |
| Custom | Custom size, custom ratio, printer-defined size, uploaded spec |

Each intent should carry defaults for dimensions, aspect ratio, safe area, export type, content density, and whether print readiness is relevant.

## Print Readiness

Print output is a differentiated requirement because many AI design tools stop at a good-looking preview. Open Design should support the last mile: files a print vendor can actually inspect and produce.

For print-oriented intents, the guided flow should allow a user to upload or paste a **Print spec** from a print vendor. The spec may be a PDF, image, web page, text block, or structured form. Open Design should extract and confirm:

| Print spec field | Examples |
|---|---|
| Final size | A4, US Letter, 90 x 54 mm business card, custom dieline size |
| Bleed and safe area | 3 mm bleed, 0.125 in bleed, text safe margin |
| Color | CMYK required, RGB accepted, ICC profile, Pantone/spot color, rich black guidance |
| Resolution | 300 DPI target, minimum image DPI, vector-preferred assets |
| File format | PDF Print, PDF/X-compatible PDF, TIFF, EPS, packaged source, flattened PDF |
| Marks and trim | Crop marks, trim box, bleed box, registration marks |
| Fonts | Embedded fonts, outlined fonts, licensed font warning |
| Images | Embedded images, linked image handling, compression limits |
| Material | Paper stock, coated/uncoated, vinyl, fabric, sticker, packaging substrate |
| Finishing | Fold, binding, lamination, foil, emboss/deboss, die cut, rounded corners, varnish |
| Dieline | Cut line, fold line, glue area, no-print area, barcode/QR placement |
| Quantity/context | One-off proof, bulk run, local print shop, online print vendor |

Print-ready handoff should be treated as levels:

| Level | Capability |
|---|---|
| 0 Digital preview | Looks correct on screen only. Not enough for print. |
| 1 Print-aware layout | Uses physical units, final size, safe area, bleed guides, and DPI warnings. |
| 2 Printer spec intake | Extracts and confirms print vendor requirements before generation. |
| 2.5 Basic print handoff | Uses the uploaded spec to constrain generation, exports a PDF Print target plus production summary, and runs basic preflight checks while labeling CMYK as a compatibility target. |
| 3 Preflight | Checks color mode/profile, bleed coverage, text safety, image DPI, font embedding/outline status, missing assets, transparent effects, spot colors, and dieline constraints. |
| 4 Print-ready package | Exports vendor-facing files and notes: PDF Print/PDF-X-compatible output where possible, CMYK-compatible color, crop marks, bleed, embedded/outlined fonts, high-resolution images, dielines, and a production summary. |

CMYK compatibility is a requirement for print-ready outputs, but the implementation should be honest about the level achieved. Browser previews may remain RGB; the export/preflight pipeline owns CMYK-compatible conversion, proof warnings, and print handoff validation.

The first differentiated print milestone should target **Level 2.5 Basic print handoff**. Full PDF/X validation, ICC-managed conversion, spot color handling, and dieline rule checking can follow after the guided flow proves useful.

Print specs should start as project-level uploads, then become reusable **Print spec presets** when the user chooses to save them. The first version does not need a full vendor database, but the data model should support common future reuse cases:

- repeated business card specs from the same print shop;
- recurring DM or flyer sizes;
- packaging dielines;
- preferred paper stock and finishing options;
- vendor-specific export notes.

## Boundaries

- The **Taste profile** is user-level memory; it is not the same thing as a project **Design system**.
- **Taste evolution** must not silently mutate brand tokens or a `DESIGN.md`.
- References are used to extract preference signals, not to copy a third-party design.
- References do not need to match the target artifact type; cross-medium translation is a core behavior.
- Raw references and extracted **Style cards** are both retained. Raw references preserve evidence; **Style cards** are the generation-ready layer.
- A project-specific design system wins over taste preferences when they conflict.
- A skill's workflow wins over taste preferences when the artifact type has structural requirements.

## Taste Extraction Parameters

Taste extraction should be broad enough for high-quality generation but structured enough that a non-designer never has to operate the full control panel manually.

Each **Style card** should support these parameter groups:

| Group | Signals to extract |
|---|---|
| Source | URL, screenshot/image, origin site, capture date, source medium, user note, rights/caution note |
| Medium | Any **Artifact intent catalog** group plus observed source medium, targetable output media, and cross-medium transfer fit |
| Intent | Premium, playful, editorial, sales-driven, educational, event-driven, product launch, announcement, recruitment, community |
| Audience | Consumer, B2B, luxury, youth, parent, technical buyer, creative professional, local business, broad public |
| Mood | Calm, energetic, refined, bold, warm, futuristic, nostalgic, minimal, expressive, handmade, clinical, friendly |
| Brand personality | Conservative, experimental, elegant, rebellious, trustworthy, cute, sharp, organic, industrial, artistic |
| Color | Dominant colors, accent colors, contrast level, saturation, warmth/coolness, color rhythm, background behavior, dark/light bias |
| Typography | Serif/sans/mono/display tendency, weight, width, case behavior, contrast, spacing, editorial vs utility feel, headline/body relationship |
| Composition | Grid behavior, symmetry/asymmetry, focal point, layering, framing, crop style, alignment, negative space, reading path |
| Visual hierarchy | Primary message treatment, secondary info density, CTA prominence, grouping, scale jumps, emphasis rhythm |
| Spacing and density | Airy/dense, margin behavior, section rhythm, card/list density, information compression, whitespace personality |
| Imagery | Photo vs illustration, subject treatment, crop, angle, background, realism, texture, iconography, product visibility |
| Shape language | Corners, borders, geometry, organic forms, badges, containers, dividers, line weight, pattern use |
| Material and texture | Paper, foil, plastic, glass, metal, grain, shadow, embossing, print texture, tactile cues |
| Lighting and depth | Flat, layered, shadowed, glossy, studio-lit, ambient, 3D depth, physicality |
| Motion/interaction | Digital-only cues such as hover feel, transition energy, scroll rhythm, animation restraint |
| Content style | Short/long copy tendency, headline tone, label style, editorial voice, CTA directness, information order |
| Accessibility | Legibility risk, contrast risk, text-on-image risk, small-type risk, color-only meaning risk |
| Transfer notes | What should transfer to another medium, what should not transfer, likely artifact types, adaptation warnings |
| Negative constraints | Things to avoid because they weaken the reference's appeal or clash with the user's taste |
| Confidence | High/medium/low confidence per group, evidence snippets, needs-human-review flags |

The first usable **Taste extraction** schema should persist the full parameter set above, but the novice-facing **Style card** UI should initially expose only six fields:

- Mood
- Color
- Typography
- Composition
- Density
- Transfer notes

This keeps the data model future-proof while keeping the first review/edit experience simple enough for non-designers.

## Novice-Safe UX

The product should be usable by someone with no design vocabulary. The UI must not require the user to understand grids, type scale, hierarchy, or color theory before they can produce good work.

Product rules:

- Ask one plain-language question at a time.
- Prefer visual choices over abstract sliders.
- Show style options as named **Style cards**, not raw parameter forms.
- Use simple labels first, with expert details expandable.
- Auto-fill dimensions and constraints after the user chooses an artifact intent.
- Provide safe defaults and warn when a choice will likely make the result worse.
- Let users say "more like this" or "less like this" instead of editing technical parameters.
- Keep expert controls available for designers, but never make them required for first success.

## Implementation Slices

Slice 1 should prove the main creation path before building the full learning system:

1. Add the **Guided create flow** as the primary creation entry.
2. Let the user choose an artifact intent from a small but extensible **Artifact intent catalog**.
3. Apply default dimensions, medium constraints, and output expectations from that intent.
4. Offer a small set of starter **Style cards** or a neutral default style.
5. Enter **Conversational design creation** with the selected intent and style card included in the generation context.

Slice 2 should connect taste learning and production constraints:

1. Add the first-class **Reference board**.
2. Support saving URLs, screenshots/images, and notes as raw references.
3. Run **Taste extraction** into editable **Style cards**.
4. Let the user accept, modify, or ignore extracted **Style cards** before they update the user's long-term **Taste profile**.
5. Add project-level **Print spec** upload/paste for print-oriented intents.
6. Generate **Level 2.5 Basic print handoff** outputs.

## Existing Hooks

The repo already has primitives that can support this direction:

- `MemorySection` can store user, feedback, project, and reference memories.
- `/api/memory/extract` already sediments conversation signals into memory.
- System prompts already inject personal memory as preferences and context.
- `inspirationDesignSystemIds` already expresses secondary design inspiration alongside a primary design system.

The differentiation work should productize these hooks instead of creating an unrelated preference subsystem.

## Decisions

- 2026-05-12 — Make the **Reference board** a first-class product entry while initially reusing the existing memory/reference substrate. *Why:* the differentiation depends on users saving inspiration continuously, not only configuring assistant memory in settings.
- 2026-05-12 — Keep both raw references and extracted **Style cards**. *Why:* raw references preserve provenance and review context, while style cards provide the structured design language agents need for reliable generation.
- 2026-05-12 — Treat print readiness as a differentiated last-mile workflow, including printer spec upload and CMYK-compatible handoff. *Why:* good-looking AI previews are not enough when the user needs a file that can be sent to a print vendor.
- 2026-05-12 — Target **Level 2.5 Basic print handoff** for the first print milestone. *Why:* spec intake, layout constraints, PDF Print export, production summary, and basic preflight create practical user value without blocking on full PDF/X, ICC, spot color, and dieline validation.
- 2026-05-12 — Start print specs as project-level uploads, but model them so they can be saved as reusable **Print spec presets**. *Why:* users need immediate upload support first, while repeated vendors, sizes, and dielines should become one-click constraints later.
- 2026-05-12 — Implement the Canva-style guided creation flow and starter **Style cards** before the full reference-learning and print-spec workflows. *Why:* the creation entry determines how intent, dimensions, style, conversation, references, and print constraints fit together.
- 2026-05-13 — Require user acceptance before extracted **Style cards** update the long-term **Taste profile**. *Why:* automatic extraction is useful, but one-off references should not silently become durable user taste.
- 2026-05-13 — Persist the full **Taste extraction** parameter set, but expose only Mood, Color, Typography, Composition, Density, and Transfer notes in the first novice-facing **Style card** UI. *Why:* generation needs structured depth, while first-time users need a short review surface.
