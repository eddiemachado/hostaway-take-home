# Hostaway Take-Home — Project Plan

> Staff Product Designer — design system & product delivery take-home.
> Working doc — refine freely.

## Decisions locked
- **Format:** Coded mockup — React + Tailwind + CSS-variable tokens
- **Screen:** Hostaway Reservations
- **Priority:** System-heavy (atomic build + design-language doc are the center of gravity)
- **Foundation:** Untitled UI design language, rebuilt as a real atomic system — independent of Miro MDS
- **Component scope:** Build only the components the Reservations screen actually needs — not a
  full catalog. Each *built* component gets a frontmatter doc.
- **Tokens:** Always use real Untitled UI token names (from the CLI-generated `theme.css`) —
  never hardcoded values or invented token names.
- **Dark mode:** In scope. Tokens must support light + dark from the start (semantic tokens
  swap via a `dark-mode` class, per Untitled UI's model — no separate component styles).
- **Multi-filter:** Batch-staged apply (build filters → live count preview → single Apply).
- **Save as view:** In scope to build — named saved filter sets, persisted to **localStorage**.
- **A11y primitives:** Adopt **React Aria** for interactive components (Menu, Tooltip, popover,
  DatePicker/DateRangePicker, etc.) — same backbone Untitled UI uses, free + accessible.
- **Icons:** `@untitledui/icons` (free, open-source).
- **App framework:** **Vite** + React + TS (lighter/simpler than Next for a mockup).
- **Visuals:** before/after + roadmap shown as simple HTML/tables — no functional diagram tooling.
- **Untitled UI licensing:** **Do not pay.** Use the free Untitled UI React CLI to obtain
  exact `theme.css`/`global.css` token values; build our own atomic components on React Aria.
  Lifting their finished components would undercut the "re-architect it ourselves" narrative.
- **DateRangePicker:** Use React Aria's built-in `DateRangePicker` (no hand-build).
- **Component docs:** Every *built* component gets a co-located frontmatter doc (not just 2
  exemplars) so the manifest + drift-check have real coverage. The 2 polished exemplars
  (Button + an organism) carry full prose; the rest get frontmatter + minimal prose.
- **Status:** Plan only. No scaffolding until we say go.

---

## Framing

The trap in this brief is treating it as "design a screen." It's actually "demonstrate
systems thinking by *re-architecting* a screen." The screen is the evidence; the
**decomposition, documentation, and rollout** are the deliverable. Since we're going
system-heavy, the center of gravity is the atomic build + the design-language doc. Audit
and roadmap stay sharp and short but must read as *staff-level diagnosis*, not boilerplate.

Everything is built on **Untitled UI's design language**, rebuilt as a real atomic system —
independent of Miro MDS.

---

## Deliverable 1 — Audit of the current state

A one-page diagnosis. Lead with the specific failure mode the brief hands us, then generalize.

1. **The monolith pattern** — the page header exists as one block with
   `default / secondary / tertiary / quaternary` variants and baked-in titles. Diagnose
   *why* this is the smell:
   - **Variants encode layouts, not meaning** — "secondary" tells you nothing about what
     changed. Unscalable naming.
   - **Content baked into structure** — long titles hardcoded means no reuse across pages.
   - **No seams** — you can't swap the tab nav, add an action, or reuse the title treatment
     elsewhere because there are no underlying atoms/molecules.
   - **Combinatorial explosion** — every new need spawns a 5th, 6th variant instead of
     composing existing parts.
2. **What doesn't scale / can't be reused** — copy-paste drift, no single source of truth
   for spacing/color, inconsistent states (hover/focus/disabled/empty/loading missing).
3. **What's missing structurally** — no tokens, no naming convention, no documented anatomy,
   nothing machine-readable for AI tooling.
4. **A before/after diagram** — monolithic `PageHeader[variant=secondary]` vs composed
   `PageHeader = Title + TabNav + ActionGroup`.

*Output: `docs/01-audit.md` + a simple before/after visual.*

---

## Deliverable 2 — The atomic system + screen (the heavy part)

### 2a. Token foundation
CSS custom properties surfaced into a Tailwind theme. Tokens are the literal atoms below
everything.

**Happy alignment:** Untitled UI React **v8 is built on Tailwind CSS 4 with a CSS-variable
theme** — identical to our chosen stack. So we *adopt their real token structure*, not a
lookalike:
- **Colors** — CSS variables on a `25 → 950` shade scale. Brand palette via `--color-brand-*`;
  gray/error/warning/success inherit Tailwind 4 native palettes (v8 removed the redundant
  redeclarations). Semantic tokens: `bg-primary`, `text-secondary`, `border-primary`,
  `fg-*`, plus `utility-*` colors (neutral / red / yellow / green / slate / sky).
- **Typography** — type scale tokens `--text-display-md/sm/xs`, `--text-xl/lg/md/sm`; exact
  px/line-height come from the **free Untitled UI CLI-generated `theme.css`**.
- **Setup** — use the free Untitled UI CLI to generate `theme.css` (tokens) + `global.css`,
  then build our own atomic components on top.

This maps 1:1 to Untitled UI's actual variable names — strong fidelity story for the
engineer + AI audiences.

### 2b. Component inventory for the Reservations screen
Built so the file structure *is* the argument — `atoms/`, `molecules/`, `organisms/`,
`templates/`, `pages/`.

| Layer | Components |
|---|---|
| **Atoms** | Text, Button, IconButton, Icon, Input, Checkbox, Badge (status pill), Avatar, Divider, Tooltip, Spinner, Link |
| **Molecules** | Tab, SearchInput, FilterChip, Menu + MenuItem, FormField, TableHeaderCell (sortable), Pagination control, **FilterControl** (field → operator → value) |
| **Organisms** | **PageHeader** (title + TabNav + ActionGroup — composed, not monolithic), TabNav, Toolbar, **FilterBar**, **FilterBuilder**, **DataTable** (header/rows/selection/sort/empty/loading), Pagination, BulkActionBar |
| **Template** | `ListPageTemplate` — app shell with named slots: header / toolbar / table / pagination |
| **Page** | `ReservationsPage` — template instance with realistic data |

The old `PageHeader[variant=quaternary]` becomes `<PageHeader title tabs actions />` —
composition replaces variants. That contrast is the headline of the whole submission.

### 2b-data. Reservations data model
Defines the table columns and which fields are filterable — this drives `DataTable` and the
whole multi-filter centerpiece. Mock dataset; client-side filter/sort/paginate.

| Column | Type | Filterable | Filter UI |
|---|---|---|---|
| Guest (name + avatar) | text | ✓ | contains |
| Confirmation code | text | ✓ | contains |
| Property / Listing | enum | ✓ | multi-select |
| Channel (Airbnb, Booking.com, Vrbo, Direct) | enum | ✓ | multi-select |
| Status (Confirmed, Pending, Cancelled, Checked-in, Checked-out) | enum | ✓ | multi-select |
| Check-in date | date | ✓ | date range |
| Check-out date | date | ✓ | date range |
| Nights | number | — | — |
| Total / payout ($) | number | ✓ | number range |

These field types map 1:1 to the `FilterControl` variants in §2c (enum → multi-select,
date → range, text → contains, number → range) — proving the molecule's composability.

### 2c. The multi-filter challenge (the part they're really watching)
Dedicated design, since the brief calls it out.

- **FilterBar** shows applied filters as removable chips with explicit AND logic, a
  result-count preview ("Showing 24 of 312"), and **Clear all**.
- **"Add filter"** opens a **FilterBuilder** popover: pick field → operator → value(s).
  Filters **stage and batch-apply** (chosen model): user composes filters, sees a live
  "would show N of M" count preview, then hits **Apply** once → table updates a single time.
  Directly fixes the multi-filter thrash the brief calls out.
- **Field-type-aware FilterControl**: enum → multi-select checkboxes, date → range picker,
  text → contains, number → range. One molecule, many field types — composability proven.
- **Save as view** (in scope) — persist a named filter set; surfaced as a view dropdown/tabs
  for quick recall (e.g. "Airbnb · Confirmed · arriving this week").
- Fully keyboard-accessible; result counts announced to screen readers.

This directly answers "applying several filters at once is a known pain point."

### 2d. Design-language documentation — template, not exhaustive docs
Exhaustive per-component docs are a maintenance trap — they rot the moment code changes, and
writing 30 of them is out of scope. We also only **build the components the Reservations screen
actually needs** — not a full catalog. So we ship a **canonical doc template + a machine-readable
contract**, give every *built* component a frontmatter doc, and fully flesh out **2 exemplars**
(`Button` + an organism); automation keeps the rest in sync.

**What we deliver for 2d:**
1. `docs/02-design-language.md` — the system overview (foundations, layer definitions,
   composition rules, naming conventions, the cold-start test — see AI operating model).
2. `docs/component-template.md` — the **canonical doc template** (the real artifact).
3. **Every built component** gets a co-located frontmatter doc (so manifest + drift-check have
   real coverage). **Two exemplars** (`Button` atom + an organism) carry the *full* prose
   treatment to prove the pattern; the rest get frontmatter + minimal prose.

**Two-layer doc shape** (this is what makes it AI-ready *and* drift-resistant):
- **Machine-readable frontmatter** (YAML/JSON) — the *contract*: parseable by any model,
  and verifiable against source by a deterministic script.
- **Human prose** below — anatomy, dos/don'ts, examples.

```markdown
---
name: Button
layer: atom                 # atom | molecule | organism | template | page
status: stable              # draft | stable | deprecated
version: 1.2.0
source: untitled-ui/button  # provenance
composes: []                # parts it's built from
usedBy: [Toolbar, FilterBar, PageHeader]
tokensConsumed:             # ← real Untitled UI token names only (confirm vs generated theme.css)
  - color: [bg-brand-solid, text-primary_on-brand]
  - spacing: [spacing-md]
  - radius: [radius-md]
props:
  - { name: variant, type: "primary|secondary|tertiary|link", default: primary }
  - { name: size, type: "sm|md|lg", default: md }
  - { name: isDisabled, type: boolean, default: false }
a11y: [focus-visible ring, aria-disabled not disabled-attr, 44px hit target]
---

## Purpose & when to use / when not to
## Anatomy            (labelled parts)
## Variants & states  (incl. dark mode)
## Dos & Don'ts
## Usage example      (code)
## Changelog
```

**Co-location:** each doc lives next to its component (`Button.tsx` + `Button.docs.mdx`) so
they move together in the same PR and drift is obvious in review. The `tokensConsumed`,
`props`, and `composes` fields are *assertions a script can check against the actual source* —
docs become a testable contract, not prose that lies.

### 2e. The three audiences (explicit section in the doc)
- **Designers** — compose from atoms/molecules; extend by adding atoms, never by adding
  monolith variants.
- **Engineers** — 1:1 mapping: doc layer → folder → component → props. Tokens → Tailwind theme.
- **AI tooling** — consistent naming + structured specs + composition rules let *any* model
  (not just Claude) assemble a correct screen from the docs alone. See the AI operating model
  below for how we keep this tool-agnostic.

---

## AI operating model (tool-agnostic)

**Principle:** AI-readiness is a property of the *artifacts*, not the assistant. We don't
build a "Claude integration" — we keep the knowledge in open, machine-readable formats any
model (ChatGPT, Codex, Copilot, Cursor, Claude) can consume, and treat each tool's native
config as a thin adapter.

### Portable substrate (the real value — vendor-neutral)
- **Frontmatter contracts** in each component doc (YAML/JSON) — universal.
- **`component-manifest.json`** — a generated JSON index of the whole system (every component →
  layer, path, status, deps). One read = full-system understanding, no crawling. Generated
  from frontmatter, so it can't drift.
- **`design-language.md`, `component-template.md`, `conventions.md`** — plain Markdown.
- **`theme.css` / `tokens.json`** — single token source of truth (light + dark).
- **`component.schema.json`** — JSON Schema for the spec; validates in any language/CI, no model.

### `AGENTS.md` as the canonical instruction file
Converging cross-tool standard (OpenAI Codex reads it natively; others adopting). It's the
single source of truth; every other tool's config is a 2-line stub pointing at it — generated
in a build step so they can't drift apart:
```
AGENTS.md                          ← canonical operating manual
CLAUDE.md                          → "See AGENTS.md"  (or symlink)
.github/copilot-instructions.md    → "See AGENTS.md"
.cursor/rules/ds.mdc               → "See AGENTS.md"
```

### Deterministic-first: push logic out of the model
Most "agents" don't need an LLM — and deterministic tooling is both more reliable *and* 100%
portable across any CI:
- **drift check** → Node/TS script: parse the `.tsx` AST, diff props/tokens vs the doc
  frontmatter, exit non-zero on mismatch. Doc drift becomes a *failing check*, like a test.
- **token-guardian** → ESLint/Stylelint rule (hardcoded values, deprecated tokens, light/dark
  parity gaps).
- **schema validation** → JSON Schema validator.
Reserve the LLM only for genuine judgment (write a doc, diagnose monolith smells, propose a
migration).

### LLM tasks as portable prompt files
Judgment tasks live as plain prompt Markdown in a neutral location — paste into any assistant:
```
prompts/
  audit-component.md
  generate-component-doc.md
  propose-migration.md
```
Each tool's native wrapper (a Claude subagent, a Copilot prompt, a Cursor command) is a thin
shim that loads the *same* prompt file. Instructions live once, in the open.

### Agent roles (mapped to deliverables — implemented as scripts + prompt files, tool-agnostic)
| Role | Deliverable | Job | Impl |
|---|---|---|---|
| **auditor** | D1 | Diagnose monolith smells: layout-encoding variants, baked-in content, missing states | prompt file |
| **doc-writer** | D2 / 2d | Generate a component doc from source using the template; fill frontmatter from real props/tokens | prompt file |
| **drift-detective** | ongoing | Diff doc frontmatter vs source; flag/auto-PR | deterministic script |
| **token-guardian** | D2 | Hardcoded values, deprecated tokens, light/dark parity | lint rule |
| **a11y-reviewer** | D2 | Focus, aria, contrast, hit targets | prompt + axe |
| **migration-agent** | D3 | Find monolith usages, propose/codemod composed replacement — the adoption engine | script + prompt |

For the take-home, build the substrate for real: `AGENTS.md`, `component.schema.json`,
`build-manifest.ts` (→ `component-manifest.json`), `drift-check.ts`, and the prompt files. The
heavier roles (`token-guardian` lint, `migration-agent` codemod) stay specced. Defining them all
as files is itself a strong AI-ready signal.

### Containment & guardrails (defense-in-depth)
> Adapted from Anthropic's *How we contain Claude* —
> https://www.anthropic.com/engineering/how-we-contain-claude

If AI agents *act on* the repo, we bound their blast radius the way Anthropic bounds Claude's:
defense-in-depth across three layers, **deterministic boundaries first, prompts second**.

- **Layer 1 — Environment (deterministic; holds even under attack):** `drift-check.ts`, schema
  validation, `token-guardian` lint, CI gates, git-worktree isolation. These *can't be talked
  out of enforcing the rules*. Contain here first.
- **Layer 2 — Model (probabilistic; steers but can fail):** prompt files + `AGENTS.md`. Never
  the *only* thing enforcing a rule — e.g. "only use Untitled UI tokens" is a prompt guideline
  **backed by** a `token-guardian` lint that fails the build.
- **Layer 3 — External content (untrusted):** fetched Untitled UI docs, MCP outputs, component
  source. Treat ingested content as **data, not commands** (prompt-injection vector). `AGENTS.md`
  auto-loads into every assistant, so it's reviewed like code — poisoning it steers every tool.

**Operating rules:**
- **Least privilege per agent:** `doc-writer` writes only `*.docs.mdx`; `drift-check` is
  read-only/report-only; `migration-agent` works in a branch/worktree and **opens a PR — never
  writes `main`**.
- **Token/foundation changes = highest blast radius** (one `theme.css` edit cascades to every
  component) → require **human sign-off**, never auto-merge.
- **Don't rely on approval** (humans approved ~93% of prompts in the article) → make guardrails
  **blocking CI gates**, not reviewer vigilance. Definition-of-done is machine-enforced.
- **Prefer battle-tested primitives** ("the software you build yourself is often the weakest"):
  React Aria, a standard JSON-Schema validator, git worktrees, standard linters — not bespoke.

### Optional: MCP as a cross-vendor serving layer
MCP is now multi-vendor (OpenAI + others). A small docs/manifest MCP server could serve system
context to any MCP client over one protocol. Mention as the "live" option; the static files
above already achieve agnostic.

### The acceptance test for "agnostic"
Drop a **fresh session of any assistant** into the repo with no special setup and ask it to
build a new molecule. If the open substrate (`AGENTS.md` → manifest → template → tokens →
schema) is enough for it to produce a correct, on-system component, tool-agnostic AI-readiness
is proven. State this cold-start test explicitly in the design-language doc.

---

## Deliverable 3 — Adoption roadmap (3–6 months)

Tight but credible. Phased:

1. **Weeks 1–3 — Audit & inventory.** Catalog all lifted Untitled UI organisms; tag by
   reuse frequency and monolith-severity. Establish the token layer first (highest leverage,
   lowest risk).
2. **Weeks 4–8 — Systematise the core.** Build the atom/molecule layer + 2–3 highest-traffic
   organisms (table, page header, filters). Publish the design-language doc. Set
   governance/contribution rules.
3. **Weeks 9–16 — Migrate by surface, not ad hoc.** Strangler-fig approach: new screens use
   the system; high-traffic existing screens migrate next. Codemods + a deprecation lint for
   monolith variants.
4. **Weeks 17–24 — Drive adoption.** Office hours, paired migrations, a "definition of done"
   that requires system components, metrics (% screens on system, variant count trending to
   zero), and AI-assisted migration using the docs.

**AI-contribution governance** (defense-in-depth — see Containment & guardrails; ref:
Anthropic, *How we contain Claude*):
- **CI-enforced, not approval-dependent** gates (drift-check, schema, lint) — guardrails block
  the merge so safety doesn't hinge on reviewer vigilance.
- **Isolation:** agent changes land via branch/worktree → PR; agents never write `main`.
- **Human sign-off on token/foundation edits** (system-wide blast radius), backed by visual
  regression.
- **Audit logging / visibility:** pull-based log of what each agent changed (docs, migrations)
  for traceability.

Plus: how you'd audit the *rest* of the UI, and how to systematise rather than firefight.

*Output: `docs/03-roadmap.md` + a timeline visual.*

---

## Proposed project structure (when we build)

```
hostaway-take-home/
  README.md                          # human entry point
  AGENTS.md                          # canonical agent operating manual (cross-tool standard)
  CLAUDE.md                          # → stub: "See AGENTS.md" (generated)
  .github/copilot-instructions.md    # → stub: "See AGENTS.md" (generated)
  .cursor/rules/ds.mdc               # → stub: "See AGENTS.md" (generated)
  CONTRIBUTING.md                    # governance / contribution rules
  component-manifest.json            # GENERATED registry of the whole system
  component.schema.json              # JSON Schema for the doc frontmatter contract
  docs/
    01-audit.md
    02-design-language.md
    03-roadmap.md
    component-template.md            # the canonical doc template (key artifact)
    conventions.md                   # naming, token rules, layer definitions
    decisions/                       # ADRs — why composition over variants, etc.
  prompts/                           # portable, paste-into-any-assistant prompt files
    audit-component.md
    generate-component-doc.md
    propose-migration.md
  scripts/
    drift-check.ts                   # deterministic doc↔source drift detection
    build-manifest.ts                # regenerates component-manifest.json
  src/
    tokens/         # theme.css / tokens.json — single source of truth, light + dark
    atoms/Button/{Button.tsx, Button.docs.mdx}    # co-located docs
    molecules/
    organisms/
    templates/
    pages/ReservationsPage.tsx
```

## Suggested build order (when we start)
1. Project setup + foundations sourcing (Untitled UI CLI tokens, light + dark)
2. Token layer + atoms (everything depends on them)
3. DataTable + multi-filter (highest-scrutiny piece)
4. PageHeader + remaining *needed* organisms
5. Template + page assembly
6. Docs (audit, design-language, component template + exemplars, roadmap)
7. AI operating model — AGENTS.md, schema, build-manifest, drift-check, prompt files

## Action checklist

Grouped by section. `[ ]` = todo. Check off as we go. (B) = build for real, (S) = spec/design-only
for the take-home.

### 0. Project setup
- [ ] Init repo at `~/hostaway-take-home` (git, README.md)
- [ ] Scaffold React + TypeScript + Vite
- [ ] Add React Aria + `@untitledui/icons` deps; scaffold tokens via free Untitled UI CLI
- [ ] Install + configure Tailwind CSS 4
- [ ] Create folder structure: `src/{tokens,atoms,molecules,organisms,templates,pages}`, `docs/`, `prompts/`, `scripts/`
- [ ] Wire dark-mode toggle (`dark-mode` class on root)

### Foundations sourcing
- [ ] Pull Untitled UI color shade scale (25→950) for brand + semantic palettes
- [ ] Pull/derive type scale token names + numeric values (display-2xl…text-sm)
- [ ] Pull spacing scale, radii, shadows, breakpoints
- [ ] Resolve exact type-scale px/line-height (derive vs. approximate; note source-of-truth caveat)

### Deliverable 1 — Audit (`docs/01-audit.md`)
- [ ] Write the monolith-pattern diagnosis (variants-encode-layout, baked-in content, no seams, combinatorial explosion)
- [ ] Write "what doesn't scale / can't be reused" (drift, no SoT, missing states)
- [ ] Write "what's missing structurally" (no tokens/naming/contracts)
- [ ] Create before/after diagram (`PageHeader[variant=secondary]` → `Title + TabNav + ActionGroup`)

### Deliverable 2a — Token foundation
- [ ] Author `src/tokens/theme.css` — light + dark, semantic tokens (bg/text/border/fg/utility)
- [ ] Author `tokens.json` (machine-readable mirror) (B)
- [ ] Wire tokens into Tailwind theme
- [ ] Verify light/dark parity for every semantic token

### Deliverable 2b — Component inventory
> Candidate set for the Reservations screen. Build only what the screen actually needs — drop
> anything unused rather than gold-plating.
- [ ] **Atoms:** Text, Button, IconButton, Icon (`@untitledui/icons`), Input, Checkbox, Badge, Avatar, Divider, Tooltip (React Aria), Spinner, Link
- [ ] **Molecules:** Tab, SearchInput, FilterChip, Menu+MenuItem, FormField, TableHeaderCell (sortable), Pagination control, FilterControl
- [ ] **Organisms:** PageHeader, TabNav, Toolbar, FilterBar, FilterBuilder, DataTable (header/rows/selection/sort/empty/loading), Pagination, BulkActionBar
- [ ] **Template:** `ListPageTemplate` with named slots
- [ ] **Page:** `ReservationsPage` with realistic data
- [ ] Seed realistic reservations dataset (property, channel, status, dates, guest)

### Deliverable 2c — Multi-filter
- [ ] FilterControl molecule — field-type-aware (enum/date/text/number; date uses React Aria DateRangePicker)
- [ ] FilterBuilder popover — compose multiple filters, staged
- [ ] Live "would show N of M" count preview before Apply
- [ ] Batch-apply (single table update) + Clear all
- [ ] FilterBar — applied filters as removable chips (AND logic)
- [ ] Save as view — named saved filter sets + recall (dropdown/tabs), persisted to localStorage
- [ ] Keyboard accessibility + SR result-count announcements

### Deliverable 2d — Design-language docs
- [ ] Write `docs/component-template.md` — canonical two-layer template (frontmatter + prose) (B)
- [ ] Write `docs/02-design-language.md` — foundations, layer defs, composition + naming rules, cold-start test (B)
- [ ] Fill exemplar doc: Button (atom) (B)
- [ ] Fill exemplar doc: DataTable or FilterBuilder (organism) (B)
- [ ] Write `docs/conventions.md` (naming, token rules, layer definitions) (B)
- [ ] Add ADRs in `docs/decisions/` (composition-over-variants, batch-filter, etc.) (S)
- [ ] Co-locate `.docs.mdx` next to each built component

### Deliverable 2e — Three audiences
- [ ] Write Designers / Engineers / AI-tooling sections into design-language.md

### AI operating model (tool-agnostic)
- [ ] Write `AGENTS.md` — canonical operating manual (B); include the **change & decision log maintenance rule** so every agent/tool inherits it
- [ ] Generate tool stubs: CLAUDE.md, copilot-instructions.md, .cursor/rules (S)
- [ ] Author `component.schema.json` — JSON Schema for frontmatter (B)
- [ ] Author `scripts/build-manifest.ts` → `component-manifest.json` (B)
- [ ] Author `scripts/drift-check.ts` — AST↔frontmatter diff (B)
- [ ] Write prompt files: audit-component, generate-component-doc, propose-migration (B)
- [ ] Spec remaining agent roles (token-guardian, a11y-reviewer, migration-agent) (S)
- [ ] Document the cold-start acceptance test (S)
- [ ] Write "Containment & guardrails" subsection — 3-layer defense, least-privilege per agent, token blast-radius gate (S)

### Deliverable 3 — Roadmap (`docs/03-roadmap.md`)
- [ ] Write phased plan (Wk 1–3 audit, 4–8 systematise, 9–16 migrate, 17–24 adopt)
- [ ] Add "how to audit the rest of the UI" + "systematise not firefight"
- [ ] Add AI-contribution governance (CI gates, branch/worktree isolation, token sign-off, audit logging)
- [ ] Create timeline visual

### Wrap-up
- [ ] README with how-to-run + submission overview
- [ ] Optional short write-up / walkthrough tying the three deliverables together

## Foundations sourcing
- **Method:** Free Untitled UI React CLI + public docs (no paid kit).
- **Exact tokens:** Run the free Untitled UI React CLI to scaffold real `theme.css`/`global.css`
  — gives exact color, type-scale, spacing, radius, shadow values at zero cost. This closes the
  type-scale gap. (Fallbacks: inspect computed styles on public demos, or approximate.)
- **Confirmed sources:**
  - Theming / colors — https://www.untitledui.com/react/docs/theming
  - Typography — https://www.untitledui.com/react/docs/typography
  - Installation / core setup files — https://www.untitledui.com/react/docs/installation
  - Dark mode — https://www.untitledui.com/react/docs/dark-mode
- **Provenance:** add a one-line "tokens derived from Untitled UI, rebuilt independently" note
  in the design-language doc.

## Open questions / parking lot

**Deferred — tackle as a set after the foundations are in:**
- **Tabs vs. filters vs. saved views IA** — are nav tabs preset filters or a separate axis? are
  saved views shown as tabs (colliding with TabNav) or a separate control? which wins when a tab
  and a filter overlap? (Highest-leverage design decision; resolve before finalizing 2c.)
- **Component catalog / preview** — Storybook, or is the single page + docs the catalog?
- **Page-level header actions** — which actions (New reservation / Export / Import)?
- **Responsive behavior** — in scope or explicitly out?
- **Data behavior** — confirm client-side filter/sort/paginate over mock data; reframe the
  batch-apply benefit as render/intent clarity (no network with mock data).

**Minor / verify:**
- `@untitledui/icons` license — verify free/open before depending on it.
- "diagram"/"visual" wording — we use simple HTML/tables, not diagram tooling.
- Testing — out of scope (state explicitly).

## References
- Untitled UI — design language foundation: https://www.untitledui.com
- Anthropic, *How we contain Claude* — defense-in-depth model behind our AI guardrails:
  https://www.anthropic.com/engineering/how-we-contain-claude

---

## Change & decision log
Chronological. Newest entries appended at the bottom. Captures *what changed* and *why*.

> **Maintenance rule (for any agent/session):** Whenever a decision is made, reversed, or a
> meaningful change is applied to this plan or the project, append an entry under the current
> date here. Record the *decision* and the *why* (rationale), not just the action. Use the
> existing entry format. This log is the source of truth for project history — keep it current.

### 2026-06-05 — Project framing & core direction
- Reviewed the Hostaway Staff Product Designer take-home brief; created `plan.md`.
- **Decision — Deliverable format:** coded mockup (not Figma). _Why: best shows the live
  multi-filter interaction and proves atomic structure maps to real implementation._
- **Decision — Screen:** Hostaway Reservations. _Why: on-domain, filter-rich._
- **Decision — Priority:** system-heavy (atomic build + design-language doc are the focus).
- **Decision — Stack:** React + Tailwind + CSS-variable tokens. _Why: atomic layers become
  literal components — strongest proof for engineers._
- **Decision — Foundation:** build a fresh atomic system on Untitled UI's design language,
  independent of Miro MDS.
- **Decision — Status:** plan only; no scaffolding until we say go.

### 2026-06-06 — Foundations, scope decisions, AI operating model
- **Decision — Sourcing:** pull Untitled UI foundations from public docs (no paid kit).
- **Finding:** Untitled UI React v8 is built on **Tailwind CSS 4 + a CSS-variable theme** —
  identical to our stack. We adopt their *real* token structure (`--color-brand-*`, `25→950`
  scale, semantic tokens, `--text-*` scale), not a lookalike.
- **Decision — Dark mode:** in scope; tokens support light + dark from the start.
- **Decision — Multi-filter:** batch-staged apply (compose → live count preview → single
  Apply). _Why: directly fixes the "applying several filters at once" thrash the brief calls out._
- **Decision — Save as view:** in scope.
- **Decision — Docs (2d):** ship a doc *template* + machine-readable frontmatter contract +
  exemplars, not exhaustive per-component docs. _Why: exhaustive docs rot; a template +
  automation scales._
- **Decision — AI operating model:** added a tool-agnostic model (open substrate + `AGENTS.md`
  canonical + deterministic-first checks + portable prompt files).
- Added the full action checklist.

### 2026-06-07 — Gap review, resolutions, containment, this log
- **Decisions — tooling:** React Aria for a11y primitives; `@untitledui/icons`; Vite; Save-as-view
  persisted to localStorage; simple HTML/tables for visuals (no diagram tooling); DateRangePicker
  via React Aria.
- **Decision — don't pay for Untitled UI.** _Why: lifting their finished components undercuts the
  "re-architect it ourselves" narrative; the free CLI gives exact tokens and React Aria gives the
  a11y backbone — both free._
- **Decision — exact tokens via the free Untitled UI CLI** (closes the type-scale gap).
- **Fixed inconsistencies:** removed Figma-kit references; deleted the stale time budget;
  reconciled "build for real" (AGENTS.md, schema, build-manifest, drift-check, prompts = build);
  build only the components the screen needs; enforced real-Untitled-token rule; added project
  setup + AI operating model to the build order.
- **Added — Reservations data model** (§2b-data): 9 columns + filterable fields mapped to
  FilterControl variants.
- **Parked for later (as a set):** tabs vs. filters vs. saved-views IA, component catalog
  (Storybook?), page-level header actions, responsive scope, client-side data behavior.
- **Added — Containment & guardrails (defense-in-depth)**, adapted from Anthropic's *How we
  contain Claude*: 3-layer defense, least-privilege per agent, token-change blast-radius gate,
  blocking CI over approval; plus AI-contribution governance in the roadmap and a References section.
- **Added — this change & decision log.**
- **Decision — maintain the log going forward:** every future decision/change appends a dated
  entry here (decision + rationale). _Why: preserve project history and reasoning across sessions
  and tools; recorded as a rule in the substrate rather than relying on memory._
- **Decision — propagate the log-maintenance rule into `AGENTS.md`** at build time (added to its
  checklist item). _Why: make it a first-class project convention every agent/tool inherits, so a
  fresh session that reads only `AGENTS.md` still maintains the log._
- **Build started — Step 1 complete: project setup + foundations.** Scaffolded Vite + React 19 +
  TS; Tailwind CSS 4 via `@tailwindcss/vite`; added React Aria + `@untitledui/icons`. Sourced the
  **real Untitled UI v8 token files** (`theme.css`, `typography.css`) via the free CLI and placed
  them in `src/tokens/` as the single source of truth — full light/dark parity baked in via the
  `.dark-mode` class. Reused Untitled UI's `ThemeProvider` (light/dark/system + localStorage).
  Created the atomic folder structure and a foundations-verification page. `npm run build` and the
  dev server are green. _Findings: Untitled UI v8 surfaces semantic tokens as Tailwind utilities
  via property-specific namespaces (`--background-color-*` → `bg-primary`, etc.); confirmed against
  their component usage. Also saved their `CLAUDE.md` as `docs/UNTITLED_UI_REFERENCE.md` to inform
  our `AGENTS.md`. Committed (2 commits)._
- **Relocation fix.** Project was created at `~/hostaway-take-home` but the IDE workspace is
  `~/Documents/Personal/hostaway`. Moved the whole repo (git history intact) into the workspace.
  _Root cause: chose the path at plan-creation without checking the open workspace._
- **Deliverable 1 drafted.** Wrote `docs/01-audit.md` one-pager (monolith pattern, what doesn't
  scale, what's missing, impact by audience, page-header worked example). User editing directly
  (added an "Enabling AI" section + documentation tips).
- **Build — Steps 2–5 complete: full atomic component system + Reservations page.** `cx` util
  (clsx + tailwind-merge) + shared type-aware filter model (`src/lib/filtering.ts`). Atoms
  (Button, IconButton, Input, Checkbox, Badge, Avatar, Spinner, Divider, Link, Tooltip);
  molecules (SearchInput, TabNav, Select, Menu, FilterChip, TableHeaderCell, Pagination,
  FilterControl); organisms (PageHeader, DataTable, BulkActionBar, Toolbar, FilterBar,
  FilterBuilder, SavedViews); ListPageTemplate; ReservationsPage (mock data, batch-staged
  multi-filter w/ live count, saved views via localStorage, sort, selection + bulk actions,
  pagination, light/dark). React Aria + Untitled UI tokens. build + eslint green. Committed.
  _Deviation: date filter uses native date inputs for now; production swaps to React Aria
  DateRangePicker._
- **Decision — adopt Storybook as the component/token catalog (resolves parked Q#9).** Installed
  Storybook 10 (Vite + React), wired to `src/tokens/globals.css` with a **light/dark toolbar
  toggle** (`.dark-mode`). Wrote Foundations stories (Colors, Typography, Elevation & Radius),
  atom/molecule/organism stories (co-located `*.stories.tsx`), and a fullscreen Reservations
  page story. _Surface strategy: Storybook is the catalog AND the Vite app still renders the live
  page — components built once in `src/`, consumed by both._ `build-storybook`, app build, eslint,
  tsc all green. Committed.
- **🔁 DECISION REVERSED — use real Untitled UI components (hard requirement).** Earlier we
  decided to "rebuild our own components on UUI tokens / don't lift their components." The user
  clarified this is a **hard requirement: use Untitled UI's actual components, not our own.**
  _Why the reversal: the brief says use Untitled UI as the component foundation; composing their
  real atoms/molecules into our documented organisms → template → page still satisfies the audit
  (the anti-pattern is lifting *organism-level* blocks with baked-in content, not using their
  primitives)._
  - Verified the needed components (table, pagination, base atoms) are **FREE** via the CLI — no
    PRO/payment. Ran `untitledui init` in-repo + `untitledui add` for button, badges, input,
    checkbox, avatar, table, tabs, select, dropdown, tooltip, pagination, date-picker.
  - Recomposed `ReservationsPage` + organisms + template onto UUI components; **removed the
    hand-built `src/atoms`, duplicate molecules, and generic `DataTable`.** Kept our genuinely-ours
    composition layer (FilterBuilder, FilterBar, BulkActionBar, SavedViews, Toolbar, PageHeader,
    FilterControl, FilterChip) + libs.
  - Integration notes: relaxed tsc `noUnused*` (ESLint enforces for our code); ESLint ignores
    vendored UUI dirs (`src/components/**`, `src/hooks/**`, CLI utils); one RA version-drift cast
    in vendored `calendar.tsx`. UUI `Button` uses `color` (not `variant`); UUI `Input` is a RAC
    TextField (`onChange` gives a string). build + eslint + storybook + dev server (HTTP 200) green.
  - _Note: `src/tokens/` (our copy) and `src/styles/` (CLI's) both exist; the app loads
    `src/tokens/globals.css`. Consider consolidating to one token dir. (parking lot)_
- **Storybook controls + autodocs.** Added `args`/`argTypes` + `autodocs` to catalog stories
  (Button, Badge, Avatar, Input, Checkbox). PageHeader story exposes all slots via Controls
  (toggle description/actions/tabs) + discrete stories (Full / TitleOnly / WithoutTabs /
  WithoutActions). Restored Input/Checkbox/Avatar as individual catalog stories.
- **Fixed Reservations story crash.** It threw `useTheme must be used within a ThemeProvider`
  (the page's `ListPageTemplate` toggle needs the provider). Fixed by wrapping all Storybook
  stories in `ThemeProvider` (driven by the theme toolbar). Verified light/dark/filter via a
  Playwright screenshot helper (`scripts/shot.mjs`).
- **Deliverable 3 written — `docs/roadmap.md`.** A 3–6 month adoption roadmap built on the user's
  audit: Phase 0 audit-the-rest → Phase 1 tokens+foundations → Phase 2 systematise core
  (Components/Patterns/Templates) → Phase 3 strangler-fig migration → Phase 4 adoption (design +
  eng + AI). Grounded in the audit's positions: token metadata, Foundations/Components/Patterns/
  Templates vocabulary, owned human+machine docs, Templates propagate change, lint kills Tailwind
  ambiguity, agents for drift + token migration, and the "redesign test" success metric.
