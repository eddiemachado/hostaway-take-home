# Untitled UI Audit

> Diagnose what’s wrong with the components as they exist today. Where does the current
organism-based, Untitled-UI-lifted approach break down? What doesn’t scale, what can’t be reused,
and what’s missing in terms of structure and documentation? Show us how you read the situation.

### Untitled UI as a baseline

When using these libraries, specifically Untitled UI, it's not a plug and play solution. It offers the main benefit of getting you up quickly, but you still need to do the work to get it to _**feel**_ like Hostaway.

---

### Atomic design

> Rebuild the screen the right way using atomic design. We’d expect to see the full stack:
>- Atoms, molecules, and organisms that compose into the components above
>- A template that the screen sits within, and the resulting page
>- A documented design language: e.g. a markdown / MD file that defines the system so it can be
read and used consistently

I've used atomic design principles in the past but I've always found them a bit confusing as different people have a different opinion on what's an atom, molucule, etc. 

For example:
- `atoms` are identified as things like buttons, inputs, etc. But what makes up the atoms? what do we call the tokens?
- `molocules` and `organisms` are too similar. It feels very subjective and redundant

What I've found works better is a simpler system that most people are already familiar with:

- **foundations** - base later that everything is built on
- **components** - reusable elements that are built using foundations
- **patterns** - a group of components that work together to create parts of the UI
- **templates** - a page comprising of components & patterns, all built off the foundations

**It's the same concept, just without that layer of subjectivity.**

Here's an example of what would live in this system:

#### Foundations
- design tokens
- typography styles
- motion principles

#### Components
- buttons
- inputs
- checkboxes

#### Patterns
- dialog
- copy/paste
- table
- page header

#### Template
- reservations view
- settings view

### Why _any_ system isn't perfect

Ultimately, no naming structure is perfect. There will always be edge cases, for example:

- is `buttonGroup` a pattern because it's composed of  `buttons`?
- is `breadcrumbs` a pattern because it's composed of `links`?

**Personally, I would categorize these as components, but the real answer is: `Who cares?`**

Builders just want to build, sure it's helpful to categorize and organize your tools, but IMO, the simpler the better. At the end of the day, too many layers of abstraction will cause more confusion than needed.

**tldr;** - _use vocabulary the team is already familiar with to reduce confusion and reduce friction._


---

### So what's missing?

- **Tokens** — Untitled UI actually has tokens, but they aren't clearly documented. They're basically [the same tokens Tailwind]() uses. 

- **No naming convention or layer model** — no shared vocabulary (atom/molecule/organism), so
  contributors can't agree on where a thing belongs.

- **Documentation** — props, variants, do/don't, and composition rules are
  undocumented; the only "spec" is reading the source.

- **AI-enablement** — Untitled isn't natively built with AI support because it doesn't know _how_ you will use the system. We need to manually add this content.

---

### What doesn't scale / can't be reused


```html
<!-- tag component -->
<div 
  class="flex cursor-default items-center gap-0.75 rounded-md bg-primary text-secondary ring-1 ring-primary outline-focus-ring transition duration-50 ease-linear ring-inset focus-visible:outline-2 focus-visible:outline-offset-2 px-2.25 py-0.5 text-sm font-medium pr-0.75" 
  data-rac="" 
  tabindex="0" data-collection="react-aria9034651726-_r_5lf_" 
  data-key="react-aria-1" 
  id="react-aria9034651726-_r_5la_-react-aria-1" 
  role="row" 
  aria-label="Label">
    ...
  </div>
```
- **Copy-paste drift.** Reuse means duplicating an organism and tweaking it; fixes and changes
  don't propagate. N copies, N truths.
- **No single source of truth for foundations.** Colors, spacing, and type are hardcoded
  per-component, so a brand or spacing change is a manual hunt across the codebase.
- **Inconsistent, incomplete states.** Hover / focus / disabled / loading / empty / error are
  handled ad hoc (or missing) because there's no atom that owns the state once.
- **Accessibility is per-copy.** Keyboard, focus, and ARIA behavior live inside each lifted
  block, so quality varies screen to screen and regresses silently.

---

### Enabling builders

> Be explicit about how three audiences would use this system:
- Designers how they compose and extend it
- Engineers how it maps to implementation
- AI tooling how the documented language lets AI pick up and reuse the system reliably

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

## Working example — Page header


**Today (monolithic):**
`<PageHeader variant="quaternary" />` → one block, hardcoded title/tabs/actions, opaque variant.

**Where it breaks:** need a header with a different action set, or no tabs, or a longer title? →
no path except a new variant or a fork.

**Target (composed — see Deliverable 2):**
`<PageHeader title={…} tabs={…} actions={…} />` built from `Title` + `TabNav` + `ActionGroup`,
all resting on tokens. Composition replaces variants; the variant list collapses to zero.

---

---

### Core diagnosis — the monolith pattern
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