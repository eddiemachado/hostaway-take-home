# Untitled UI Audit

> Diagnose what’s wrong with the components as they exist today. Where does the current
organism-based, Untitled-UI-lifted approach break down? What doesn’t scale, what can’t be reused,
and what’s missing in terms of structure and documentation? Show us how you read the situation.

### Untitled UI as a baseline

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

#### A real-world example: Updating a Design Language

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

With a system that relies on tokens, we abstract the styling layer from the codebase. Allowing us to style the components without ever touching the actual functionality. To change the styles, we would just update the token values.

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

- **Foundations** - base later that everything is built on
- **Fomponents** - reusable elements that are built using foundations
- **Patterns** - a group of components that work together to create parts of the UI
- **Templates** - a page comprising of components & patterns, all built off the foundations

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

### Enabling builders

> Be explicit about how three audiences would use this system:
>- Designers how they compose and extend it
>- Engineers how it maps to implementation
>- AI tooling how the documented language lets AI pick up and reuse the system reliably

Documentation for these white label libraries are really generic, but they're generic on purpose. They don't understand the context you're going to use these components, but you do. We should own the documentation and write things ourselves so that the components make sense for our use cases.

Because the documentation is bare bones, AI is going to have a hard time understanding when & where to use components. We need to enable docs for both humans & machines:

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

### Tips for clearer documentation

- Always say what you should & should **not** do. Any gaps will be filled in by the AI
- When writing, ask the AI if there are any open questions or conflicts before publishing
- Code samples and implentation examples are the **most valuable**
- Create an agent to manage documentation drift when new features or updates are done

---

### Working example — Page header

The `PageHeader` is actually a really great `Pattern` to have, we just need to make it ours and we absolutely need to ensure it's using our `components` within.

Out of the box, it actually supports different customizations. For example, here's the full `PageHeader`:

```ts
<PageHeader 
  title="Reservations" 
  description="Manage bookings across every channel."
  actions={...} 
  tabs={...}
  />
```

You can remove the buttons by removing the actions prop:

```ts
<PageHeader 
  title="Reservations" 
  description="Manage bookings across every channel."
  tabs={...} 
/>
```

You can remove the tabs by removing the tabs prop:
```ts
<PageHeader 
  title="Reservations" 
  description="Manage bookings across every channel."
  actions={...} 
/>
```

Now, instead of using the `primary` | `secondary` variants, we can wrap common configurations as `Templates`.

So for the Reservation Page we could create a Template that has all the configured `components` and `patterns`:

```ts
// page header
<PageHeader 
  title="Reservations" 
  description="Manage bookings across every channel."
  actions={...} 
/>
// filter bar
<FilterBar
  prop="value"
/>
// reservation table
<Table 
  prop="value"
/>
```

This way, when I load a template: `TemplateReservation` it has all these things already preconfigured. If changes are made in the future, everything is connected.

**A change in the button is reflected in:**
- inside the `ButtonGroup`
- inside the `PageHeader`
- inside the `FilterBar`
- inside the `Table`

Everything is connected and updated.

---