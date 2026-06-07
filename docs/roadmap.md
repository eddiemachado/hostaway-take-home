# Adoption Roadmap (3–6 months)

> A realistic plan to get from where the system is today to where it needs to be:
> how we'd audit the rest of the UI/infrastructure, how we'd **systematise** it (not solve it
> ad hoc), how we'd drive adoption across design **and** engineering, plus a timeline and
> milestones.
>
> This builds directly on [01-audit.md](./01-audit.md). Read that first — the roadmap is the
> "how we get there" for the problems diagnosed there.

---

## Where we are → where we need to be

**Today.** The UI was stood up fast by lifting Untitled UI components. That got us moving, but
(per the audit) it isn't plug-and-play: styling lives as scattered Tailwind classes with *no
clear answer* (`gap-4` vs `space-x-4` vs `gap-[16px]`), there's no token layer abstracting style
from code, no owned documentation, and no shared vocabulary. Restyling means editing component
code across hundreds of call sites.

**Target.** A **token-driven, documented system** — organised as **Foundations → Components →
Patterns → Templates** — that *feels like Hostaway*, can be **restyled by changing tokens, not
code**, and is usable by **designers, engineers, and AI** from the same source of truth.

### Guiding principles (from the audit)
1. **Token-first.** Abstract styling out of the codebase into scoped, semantic tokens with
   metadata (`usage` / `avoid` / `scoped` / `deprecated` / `replaceWith`).
2. **One clear answer.** Kill Tailwind ambiguity with tokens + lint, so there's a single correct
   way to express spacing/color/type.
3. **Own the docs.** White-label docs are generic on purpose; we write context-specific docs for
   **humans and machines** (*Use when / Prefer instead / Never for*), with code samples as the
   most valuable artefact.
4. **Familiar vocabulary.** Foundations / Components / Patterns / Templates — not the subjective
   atom/molecule/organism split. *Who cares about edge cases — reduce friction.*
5. **Systematise, don't firefight.** Every fix is encoded once (token, lint rule, codemod, agent)
   so it propagates, rather than being applied screen-by-screen.
6. **Templates propagate change.** Common configurations are wrapped as Templates
   (`TemplateReservation`), so a change to a Button cascades through ButtonGroup → PageHeader →
   FilterBar → Table everywhere it's used.

---

## Phase 0 — Audit the rest of the UI & infrastructure · Weeks 1–3

*Goal: a complete, prioritized picture before touching anything else.*

**How we'd audit it:**
- **Automated inventory scan.** A script/agent crawls the codebase and catalogs: every UI surface,
  which Untitled UI components were lifted, and all raw Tailwind usage. It flags the audit's
  specific smells — hardcoded color/spacing values, ambiguous class patterns
  (`gap-*` vs `space-x-*` vs arbitrary `[16px]`), duplicated/forked components, and variant sprawl.
- **Token-gap analysis.** Map raw values → proposed tokens; quantify how many distinct
  colors/spacings/radii are actually in use (usually far fewer than the code implies).
- **Severity tagging.** Rank surfaces by *reuse frequency × inconsistency × migration effort* to
  find the highest-leverage targets (Reservations, Listings, Calendar, Settings…).
- **Baseline metrics.** Establish day-0 numbers we'll drive down: % surfaces on the system, count
  of raw/arbitrary classes, count of component variants, doc coverage.

**Output:** an audit report, a prioritized migration backlog, and a coverage baseline dashboard.

---

## Phase 1 — Foundations & tokens · Weeks 3–6

*Goal: the source of truth everything else hangs off.*

- **Define the token layer** — primitive → semantic → component-scoped tokens, each carrying the
  metadata from the audit (`value`, `usage`, `avoid`, `scoped`, `deprecated`, `replaceWith`).
  Tokens live in one JSON source of truth and compile to CSS variables → the Tailwind theme.
- **Lock the vocabulary & naming** — Foundations / Components / Patterns / Templates, with
  semantic, intuitive token names.
- **Enforce "one clear answer"** — lint rules that ban arbitrary values and raw color/spacing,
  requiring tokenised utilities. This is what stops the Tailwind ambiguity from returning.
- **Stand up the docs system** — the doc template (human + machine: *Use when / Prefer instead /
  Never for* + code samples) and where it lives (Storybook + co-located MD).

**Milestone:** tokens + conventions + lint live; docs structure + first 3 components documented.

---

## Phase 2 — Systematise the core · Weeks 6–12

*Goal: the most-used Components and Patterns, done the right way, once.*

- **Components** — migrate high-traffic Components to token-driven + documented: Button, Input,
  Checkbox, Select, Badge, Avatar… Each ships with: scoped tokens, a doc (use/avoid/never + code
  sample), and a Storybook story.
- **Patterns** — build the key Patterns from our Components: PageHeader, FilterBar, Table, Dialog.
- **Templates** — wrap common configurations as Templates (e.g. `TemplateReservation`) so screens
  inherit pre-wired Patterns and changes propagate automatically.
- **Governance (not ad hoc)** — contribution rules + a definition-of-done: *uses tokens, has a
  doc, has a story, passes lint*. Encoded as CI gates, not reviewer goodwill.
- **Automation / agents** — a **doc-drift agent** (keeps docs in sync with code) and a
  **token-migration agent** that uses the `deprecated`/`replaceWith` metadata to swap old tokens
  safely. Deterministic checks (lint, schema, drift) are the enforcement layer; agents do the
  judgment work. *(Defense-in-depth: humans sign off on token/foundation changes — highest blast
  radius.)*

**Milestone:** core Components + key Patterns systematised; `TemplateReservation` shipped;
governance + agents in place.

---

## Phase 3 — Migrate surfaces (strangler-fig) · Weeks 10–20 *(overlaps Phase 2)*

*Goal: move the product onto the system surface-by-surface, never ad hoc.*

- **New screens must use the system** — enforced by the definition-of-done.
- **Migrate highest-traffic surfaces first**, one at a time, using codemods + the token-migration
  agent + `replaceWith` metadata to do the mechanical work; humans handle judgment.
- **Track the coverage metric climbing** and raw-class / variant counts trending to zero.

**Milestone:** 50%+ of high-traffic surfaces migrated; coverage target hit.

---

## Phase 4 — Drive adoption (design + engineering) · Ongoing, Weeks 1–24

*Goal: make the system the path of least resistance for both crafts.*

**Designers — compose & extend:**
- A Figma library mirrors the tokens/Components/Patterns 1:1; designers compose from Patterns and
  extend by adding Foundations, never by forking.
- Design reviews require system usage; office hours + a request path for new Patterns.

**Engineers — map to implementation:**
- 1:1 mapping: doc → folder → Component → props; tokens → Tailwind theme.
- CI gates (lint/drift/DoD) make non-system code fail the build; paired migrations to upskill.

**Both:**
- A design-systems working group + champions per squad; a public changelog; a metrics dashboard;
  regular demos. The system has to be *easier than rolling your own* or adoption stalls.

**AI tooling — reliable pickup & reuse:**
- The owned docs (human + machine) + a generated component manifest let AI scaffold and migrate
  screens reliably; the drift + token-migration agents keep it honest. *(AI assists; deterministic
  gates and human-authored docs remain the source of truth — we don't want to be over-reliant.)*

---

## Timeline & milestones

| When | Milestone |
|---|---|
| **End Wk 3** | Full audit + baseline coverage metric + prioritized migration backlog |
| **End Wk 6** | Token layer + naming conventions + lint live; docs structure + first 3 Components documented |
| **End Wk 12** | Core Components + key Patterns systematised; `TemplateReservation` shipped; governance + agents in place |
| **End Wk 20** | 50%+ of high-traffic surfaces migrated (strangler-fig) |
| **End Wk 24** | Adoption embedded (DoD + CI gates + champions); raw-class & variant debt down sharply; **"redesign test" passes** — a restyle ships by changing tokens, not code |

---

## How we measure success
- **Coverage** — % of surfaces on the system (the headline metric).
- **Consistency debt** — count of raw/arbitrary Tailwind values → trending to **0**.
- **Variant sprawl** — count of component variants → trending **down**.
- **Time-to-restyle** — the audit's "two redesigns in two years" test: changing brand color /
  weight / radius should be a **token edit**, not a code migration.
- **Doc coverage** — % of Components with *Use when / Prefer instead / Never for* + a code sample.
- **Drift caught** — issues blocked by CI before merge (system staying honest).

## Risks & mitigations
| Risk | Mitigation |
|---|---|
| Tailwind ambiguity creeps back | Tokens + lint enforce "one clear answer"; codemods clean existing drift |
| Adoption stalls | DoD + CI gates + champions; make the system the easiest path |
| Token sprawl | Metadata + scoping + semantic naming keep tokens discoverable |
| A future redesign breaks everything | Token abstraction (change values, not code) + visual-regression tests |
| Over-reliance on AI | Docs are human-authored truth; AI assists, deterministic gates enforce |

---

*Outcome: in 3–6 months Hostaway moves from lifted, hard-to-change Untitled UI components to a
token-driven, documented system that feels like Hostaway, restyles in minutes, and is equally
usable by designers, engineers, and AI.*
