# Untitled UI as a baseline

When using these libraries, specifically Untitled UI, it's not a plug and play solution. It offers the main benefit of getting you up quickly, but you still need to do the work to get it to _**feel**_ like Hostaway.

Untitled UI uses Tailwind as a foundation. The issue I have with Tailwind based systems is that there are too many options. Take this example of adding a gap between elements:

```html
<div class="flex gap-4">        <!-- Dev A -->
<div class="flex space-x-4">    <!-- Dev B -->
<div class="flex gap-[16px]">   <!-- Dev C -->
```

All are visually correct, but it makes maintaining the codebase a bit of a nightmare since there's no **clear answer**.

Learning all the required classes can also be like learning a whole new language. For AI, this is a non-issue, but do we want to be *that* reliant on AI?

Components should also match your codebase. If you're not using Tailwind in product, then this would cause even more confusion because now the UI is a mix & match.

#### A real-world example: Updating your Design Language

At Miro, we've had two redesigns in the last 2 years. This meant massive overhauls to our components and elements all over the product. Let's say we needed to do that at Hostaway. How would that work with Untitled UI?

Let's say we wanted to change our buttons:
- update the bg color
- change the font weight to regular
- change the border radius

**Untitled UI:**

This is an example of the primary button:

```ts
colors: {
  primary: {
    root: [
      "bg-brand-solid text-white shadow-xs-skeuomorphic ring-1 ring-transparent ring-inset hover:bg-brand-solid_hover data-loading:bg-brand-solid_hover",
    ],
  }
}
```

Because the classes are shared amongst many elements, any change to the `bg-brand-solid` would create a lot of visual regression issues and need a TON of QA.

```ts
// change to tokens would impact EVERY element that uses this class
--bg-brand-solid: purple.500 
```

You would also have to change the code of the component to replace old classes with new ones. This would require updating ALL the instances of the component throughout the UI, adding a ton of overhead.

`font-semibold` -> `font-regular`

`rounded-lg` -> `rounded-xl`

```ts
// changes to component code
sizes: {
  xs: {
    root: [
      "rounded-xl text-sm font-regular",
    ]
  },
  md: {
    ...
  }
}
```

**Token based system:**

With a system that relies on tokens, we abstract the styling layer from the behavior layer. Allowing us to style the components without ever touching the actual functionality. To change the styles, we would just update the token values.

```ts
// tokens are scoped to button component
--button-bg: purple.500
--button-font-weight: fontWeight.regular
--button-radius: radius.16
```

This also means, the component code isn't touched and doesn't risk any issues with functionality or require any of the hundreds of imports to be touched.

```ts
// changes to component code
sizes: {
  xs: {
    root: [
      "button-radius text-sm button-font-weight",
    ]
  },
  md: {
    ...
  }
}
```

It's way more efficient and allows restyling elements to be multitudes faster because we're just updating one `json` file with our token definitions.

**Wouldn't this add a LOT more tokens?**

Yes, it would, but a token is **one line** of `json`. A long list of tokens is still more efficient than dipping into the codebase for every change.

**How would you know which token to use when?**

By creating semantic naming conventions, you could make the token names intuitive, but we can go further by adding metadata.

```json
{
  // general use tokens
  "bg-surface": {
    "value": "neutrals0",
    "usage": "Used for containers and elements that contain nested content.",
    "avoid": "Do not use for Cards (use card-bg-default), Panels (use panel-bg-default).",
  },

  // component specific tokens
  "input-bg-default": {
    "value": "neutrals0",
    "usage": "Used as the background color for inputs in their default state.",
    "avoid": "Do not use for a background for InputSearch or any containers that are not Inputs.",
    // we can scope token usage to specific components
    "scoped": ["Input", "TextArea", "InputPassword", "InputNumber", "Select"]
  },

  // how to manage deprecated tokens
  "background-branded-button": {
    "value": "purple.500",
    // add the deprecated prop
    "deprecated": true,
    // map to the replacement
    "replaceWith": "button-bg-primary"
  }
}
```

Not only is this metadata useful, it allows us to leverage agents to replace old tokens within the UI because they have all the information on how to handle them.

---

# Atomic design

I've used atomic design principles in the past but I've always found them a bit confusing as different people have a different opinion on what's an `atom`, `molucule`, etc. 

`atoms` are identified as things like buttons, inputs, etc. But what makes up the atoms? what do we call the tokens?

`molocules` and `organisms` feel too similar and can lead to lengthy conversations about classification, which really doesn't matter to anyone outside the Design System team.

> **molecules** - relatively simple groups of UI elements functioning together as a unit. For example, a form label, search input, and button can join together to create a search form molecule.

> **organisms** - relatively complex UI components composed of groups of molecules and/or atoms and/or other organisms. A header organism might consist of dissimilar elements such as a logo image, primary navigation list, and search form.

What I've found works better is a simpler system that most people are already familiar with:

- **Foundations** - base later that everything is built on
- **Components** - reusable elements that are built using foundations
- **Patterns** - a group of components that work together to create parts of the UI
- **Templates** - a contextual group of components & patterns usually for performing a specific task or present specific data
- **Pages** - a view within the application, usually comprised of patterns and templates 

**It's the same concept, just without that layer of subjectivity.**

Here's an example of what would live in this system:

**Foundations:**
- color tokens
- spacing tokens
- typography tokens
- motion, radius, elevation tokens
- iconography & illustrations

**Components:**
- buttons
- inputs
- checkboxes

**Patterns:**
- dialog
- table
- pageHeader

**Template:**
- Reservation table
- Registration form

**It's still based on atomic principles, just using the common words most people are familiar with.**

This way there's a clearer vision of what belongs where and you avoid all the conversations about the minutia of definitions.

# No one solution is perfect

Ultimately, no naming structure is perfect. There will always be edge cases, for example:

- is `buttonGroup` a pattern because it's composed of  `buttons`?
- is `breadcrumbs` a pattern because it's composed of `links`?

You could also split things up and add an **Events** category. Things like `Copy & Paste` or `Close` are things that are used plenty of times within the product. They could live within Patterns, but can be seperated if it makes more sense to the team.


**The real answer is: "Who cares?"**

Builders just want to build. Structure and organization are crucial but, the simpler the better. I like to base a system around the structure and vocabulary the team already uses internally. It helps adoption and allows us to reduce the learning curve or something feeling 'totally different'. At the end of the day, too many layers of abstraction will cause more confusion than needed.

**tldr;** - _Every system is different and requires personalized structure. I like to use vocabulary the team is already familiar with to reduce confusion and friction._

---

# Enabling builders

Documentation for these white label libraries are really generic, but they're generic on purpose. They don't understand the context you're going to use these components, but you do. We should own the documentation and write things ourselves so that the components make sense for our use cases.

**Designers or Engineers, who needs the documentation?**

A few months ago, I would have told you we needed two seperate sets of documentation to explain our system, but today it's a different story.

Documentation is becoming less and less for humans and more of a context tool. 

**Why open a whole new website to look up a component property when you can just ask AI?**

Documentation has changed from being something people use as a reference to something that builders expect the AI to know by default. **We should bring documentation to where the builders are, not have them go looking for it.**

**Empoweing AI**

AI will have a hard time understanding when & where to use components if it's not explicitly explained. We need to enable docs that are over explanatory while still ensuring they're human readable.

**Here's what a simple component guideline would look like:**

```md
## Input

**Use when:**
- default text field
- collecting a single line of generic text (a name, title, or freeform value)

**Prefer instead:**
- if data is an email use `InputEmail`
- if data is a password use `InputPassword`
- if data is a search query use `InputSearch`
- if data is multi-line text use `Textarea`

**Never for:**
- choosing from a fixed set of options (use `Select` / `Radio`)
- a boolean on/off (use `Switch` / `Checkbox`)
- a value dragged within a range (use `Slider`)
```

While this is a super basic overview, it answers a lot of open questions that many people may think the AI should _just know_. While AI is getting better every day, we can't expect it to read our minds...not yet at least.

**Tips for clearer documentation**

- Always say what you should & should **not** do. Any gaps will be filled in by the AI
- When writing, ask the AI if there are any open questions or conflicts before publishing
- Code samples and implentation examples are the **most valuable**
- Create an agent to manage documentation drift when new features or updates are done

---

# DESIGN.md

There are many projects now that propose having a DESIGN.md file that outlines your design system and design language. In my experience, this can be super useful but also doesn't solve the complete problem.

**AI can often ignore reccomendations in this file or they can easily become stale over time, causing more trouble.**

Instead, I like to treat is as a directory for where to look to find answers.

**Design Principles**

Guide the AI with some orverarching principles based on Hostaway's design language (these are placeholders).

```md
## Design principles

The ethos we inherit from Untitled UI and hold ourselves to. When a decision is ambiguous, these
break the tie.

1. **Clarity over cleverness.** The obvious solution wins. Interfaces should be understood at a
   glance — never make someone decode a control.
2. **Content leads, chrome follows.** Minimal borders, restrained colour, generous space. The UI
   recedes so the data (reservations, guests, money) is what stands out.
3. **Consistent by default.** There is one right way to do a thing. Same spacing scale, same tokens,
   same patterns everywhere — predictability is a feature.
4. **Accessible, always.** WCAG AA contrast, full keyboard paths, visible focus, labelled controls.
   Built on React Aria; accessibility is the floor, not an add-on.
5. **Composable, not bespoke.** Small pieces snap together. We extend through slots and tokens, not
   one-off variants or forks.
6. **Tokens are the contract.** Look and feel lives in tokens, behaviour lives in components. Restyle
   by changing tokens — never by editing component internals.
```

**MCP & tooling**

First we want to ensure that AI understands what tools to use to get the information. If there's an MCP, we outline how to use the MCP and get the data it needs.

```md

## The MCP (source of truth)

The system is exposed over an MCP server, `hostaway-design-system`. Prefer it over reading source —
it returns current props, variants, import paths, token values, and usage rules.

**Tools**

`list_components()` - list every Component + one-line description 
`get_component(name)` - full API for a Component: props, types, variants, import path, example, a11y notes 
`list_patterns()` - list Patterns (PageHeader, FilterBuilder, ViewTabs, …) 
`get_pattern(name)` - a Pattern's slots, composition, props, and example 
`search_tokens(query, category?)` - find tokens by name/category (`color`, `spacing`, `radius`, `typography`) 
`get_token(name)` - resolve one token: value, `usage`, `avoid`, `deprecated`/`replaceWith`, scope 

**Workflow:** unsure of a name → `list_components` / `list_patterns` first, then `get_*`. If
`get_component` returns null the component doesn't exist — compose from primitives + tokens, don't
reach for a third-party lib. If a token is `deprecated`, use its `replaceWith`.

**If the MCP isn't connected,** add it to your Claude Code MCP settings (`~/.claude/settings.json`)
and replace the placeholders:

{
  "mcpServers": {
    "hostaway-design-system": {
      "type": "http",
      "url": "https://design.hostaway.com/api/mcp",
      "headers": {
        "Authorization": "Bearer <your-access-token>",
        "X-User-Email": "you@hostaway.com"
      }
    }
  }
}
```

**General guardrails**

We don't want the AI to ever hallucinate or guess, if we've got all the elements it needs to build out UI.

```md
## Build with the system — don't reinvent

> **Default to the system. Do not introduce new elements.** Before you build anything, assume it
> already exists and go find it.

- **Search first.** `list_components` / `list_patterns` (or Storybook) before writing any UI. Nine
  times out of ten the thing exists — use it.
- **No net-new one-offs.** Don't hand-roll a button, input, modal, chip, etc. Don't pull in a
  third-party UI library. If a primitive is truly missing, compose it from existing
  Components + tokens.
- **Extend, don't fork.** Need a tweak? Add a token or use a Pattern's slot. Never copy a component
  to modify it — that's how variant sprawl and drift start.
- **Gap → propose, don't patch.** If the system genuinely lacks something, raise it with the Design
  System team so it's added once, for everyone — not solved ad hoc on your screen.
- **Match the conventions below.** New work should be indistinguishable from existing work.
```




**Where our Design system lives**

Then we want to point to where our tokens, components, patterns, etc live so it doesn't have to waste tokens searching for answers.

```md
## Where things live

**Foundations** (tokens) - [`src/styles/`](src/foundations/) | `search_tokens`, `get_token` 
**Components** - [`src/components/base/`](src/components/) | `list_components`, `get_component` 
**Patterns** - [`src/organisms/`](src/patterns/) | `list_patterns`, `get_pattern` 
**Templates** - [`src/templates/`](src/templates/) | — read source 
**Pages** - [`src/pages/`](src/pages/) | — read source 

```

Essentially, if we put some base rules here that change very infrequently and point it to the data that does change frequently, then it's unlikely to get stale and the system will run smoother.

---

# Leveraging Agents

Once we have documentation and our foundations in place, agents stop being a gimmick and start doing real work. That documentation becomes instructional material for agents to take action and keep our system running.

**Expanding the team:**

- **Doc maintenance:** — When we update components, this agent reviews the PR and updates our documentation based on recent changes. This way we never have stale documentation.

- **Token updater:** Reads our token data and the codebase to find deprecated tokens and create PRs updating them to the right tokens.

- **Auditor:** Scans the codebase for hardcoded values or custom code that could be using our DS assets. This doesn't fix anything, just locates it so other agents can.

- **Bug fixer:** Picks up any tasks labeled with `AI-ready` and automatically fixes them and creates a PR. This allows us to work in tandem with AI to improve our codebase.

- **a11y reviewer:** Review any severe accessibility issues that can be fixed using our DS. 

**Not everything needs an LLM.**

We don't want to ever run into a situation where we run out of tokens and are blocked from doing any work. This is why we want the agents to be supportive but never a blocker.

**Keep it tool-agnostic.**

The instructions for these agents live as plain markdown prompt files in the repo, so any assistant (Claude, ChatGPT, Hermes, etc) can use them. This way we're not married into an ecosystem.

**Guardrails matter.**

Give each agent the least access it needs: the doc writer only touches docs, drift detection is read-only, and the migration agent opens a PR. Targeted, focused, and never overreaching. This way we know what to expect, always.

---

# Working example — Page header

The `PageHeader` is actually a really great `Pattern` to have, we just need to make it ours and we absolutely need to ensure it's using our `components` within.

Out of the box, it actually supports different customizations. For example, here's the full `PageHeader`:

```ts
<PageHeader
  title="Page title"
  description="Short description of the page"
  actions={
  <>
    <Button color="secondary" size="md" iconLeading={UploadCloud02}>
      Import
    </Button>
    <Button color="primary" size="md" iconLeading={Plus}>
      New reservation
    </Button>
  </>
  }
  tabs={
    <Tabs selectedKey={tab} onSelectionChange={(key: Key) => setTab(String(key))}>
      <Tabs.List type="underline" aria-label="Reservation views">
        <Tabs.Item id="all" label="All" badge={36} />
        <Tabs.Item id="upcoming" label="Upcoming" badge={14} />
        <Tabs.Item id="cancelled" label="Cancelled" badge={7} />
      </Tabs.List>
    </Tabs>
  }
/>
```

You can remove the buttons by removing the actions prop:

```ts
<PageHeader 
  title="Page title" 
  description="Short description of the page"
  tabs={...} 
/>
```

You can remove the tabs by removing the tabs prop:
```ts
<PageHeader 
  title="Page title" 
  description="Short description of the page"
  actions={...} 
/>
```

Now, instead of using the `primary` | `secondary` | `tertiary` | `quarternary` variants, we can wrap a common configurations as a `Template`.

So for the Reservation Page we could create a Template that has all the configured settings:

```ts
export function ReservationsHeader({
    ... 
    // all the stuff to make it pass data through is here
    {
    return (
        <PageHeader
            title="Reservations"
            description="Manage bookings across every channel."
            actions={
                <>
                    <Button color="secondary" size="md" iconLeading={UploadCloud02} onPress={onImport}>Import</Button>
                    <Button color="primary" size="md" iconLeading={Plus} onPress={onCreate}>New reservation</Button>
                </>
            }
            tabs={
                <Tabs selectedKey={tab} onSelectionChange={(k: Key) => setTab(String(k))}>
                    <Tabs.List type="underline" aria-label="Reservation views">
                        <Tabs.Item id="all" label="All" badge={counts.all} />
                        <Tabs.Item id="upcoming" label="Upcoming" badge={counts.upcoming} />
                        <Tabs.Item id="cancelled" label="Cancelled" badge={counts.cancelled} />
                    </Tabs.List>
                </Tabs>
            }
        />
    );
}
```

This way, when I load a template: `ReservationsHeader` it has all these things already preconfigured. If changes are made in the future, everything is connected.

```ts
// you can wrap all your custom settings and just call the ReservationsHeader
<ReservationsHeader counts={{ all: 36, upcoming: 14, cancelled: 7 }} onCreate={openCreateModal} />
```

**If a change in the primary color of the button is needed...**

1. the token `button-background-primary` is changed and published
2. this token change is reflected in the `primary` variant of the `Button`
3. the `primary` variant is updated inside the `ButtonGroup`
4. the `ButtonGroup` is updated inside the `PageHeader`
5. the `Button` is updated inside the `FilterBar`
6. the `Button` is inside the `Table`

Everything is connected and updated just based on one value change, with *no code changes needed*. 

---