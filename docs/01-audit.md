# Deliverable 1 — Audit of the Current State

> **One-pager.** How we read the situation: where the lifted, organism-based Untitled UI
> approach breaks down — what doesn't scale, what can't be reused, and what's missing in
> structure and documentation. _Working doc — add notes inline._

## The situation we inherited
The UI was built by lifting components **directly from Untitled UI** at the **organism level**.
They look right, but they were never structured as a system. The representative symptom: a
**page header shipped as one monolithic block** with `default / secondary / tertiary /
quaternary` variants, long titles **baked in**, and **no underlying atoms or molecules** beneath
it. What looks like a component library is really a folder of finished screenshots in code.

---

## Core diagnosis — the monolith pattern
The page header is the tell. The same failure repeats across every lifted organism:

- **Variants encode *layout*, not *meaning*.** `secondary` / `tertiary` / `quaternary` describe
  nothing — you can't predict what they do or pick the right one. Naming is positional, not
  semantic, so it can't be reasoned about or extended.
- **Content is baked into structure.** Titles, tab labels, and actions are hardcoded inside the
  block, so the "component" only fits the one screen it was lifted for.
- **No seams.** You can't swap the tab nav, add one action, or reuse the title treatment
  elsewhere — there are no atoms/molecules to recompose. It's all-or-nothing.
- **Combinatorial explosion.** Every new need spawns a *5th, 6th, 7th* variant instead of
  composing existing parts. Variant count grows with screens, not with primitives.

**The root cause:** the system starts at the *organism* layer. With no atoms or molecules
underneath, there's nothing to compose *from* and nothing to compose *into* — so the only lever
left is "add another variant."

---

## What doesn't scale / can't be reused
- **Copy-paste drift.** Reuse means duplicating an organism and tweaking it; fixes and changes
  don't propagate. N copies, N truths.
- **No single source of truth for foundations.** Colors, spacing, and type are hardcoded
  per-component, so a brand or spacing change is a manual hunt across the codebase.
- **Inconsistent, incomplete states.** Hover / focus / disabled / loading / empty / error are
  handled ad hoc (or missing) because there's no atom that owns the state once.
- **Accessibility is per-copy.** Keyboard, focus, and ARIA behavior live inside each lifted
  block, so quality varies screen to screen and regresses silently.

---

## What's missing structurally & in documentation
- **No token layer** — nothing maps design decisions (color/space/type) to a referenceable name.
- **No naming convention or layer model** — no shared vocabulary (atom/molecule/organism), so
  contributors can't agree on where a thing belongs.
- **No documented anatomy or API** — props, variants, do/don't, and composition rules are
  undocumented; the only "spec" is reading the source.
- **Nothing machine-readable** — no structured contract, so AI tooling (and new engineers) can't
  reliably discover or reuse anything; every task starts from zero.

---

## Enabling AI

Documentation for these white label libraries are really generic, but they're generic on purpose. They don't understand the context you're going to use these components, but you do. We should own the documentation and write things ourselves so that the components make sense for our use cases.

Because the documentation is bare bones, AI is going to have a hard time understanding when & where to use components. We need to enable docs for both humans & machines:

### for Humans

```md


```

### for Machines

```md


```

**But shouldn't they be the same?**

Sure. Eventually, humans may rely on AI for implementation, but we will still be the ones _writing_ the documentation, so it should always be clear and easy to understand. 

## Tips for clearer documentation

- Always say what you should & should **not** do. Any gaps will be filled in by the AI
- When writing, ask the AI if there are any open questions or conflicts before publishing
- Code samples and implentation examples are the **most valuable**
- Create an agent to manage documentation drift when new features or updates are done

---

## Worked example — the page header
**Today (monolithic):**
`<PageHeader variant="quaternary" />` → one block, hardcoded title/tabs/actions, opaque variant.

**Where it breaks:** need a header with a different action set, or no tabs, or a longer title? →
no path except a new variant or a fork.

**Target (composed — see Deliverable 2):**
`<PageHeader title={…} tabs={…} actions={…} />` built from `Title` + `TabNav` + `ActionGroup`,
all resting on tokens. Composition replaces variants; the variant list collapses to zero.

---

## Notes / open observations
_(Add findings, specific component examples, and screenshots here as we go.)_
- 
- 
- 
