# DESIGN.md

Entry point to the Hostaway design system — for engineers, designers, and AI tooling. This file is a
**map, not the manual**: it tells you where things live and how to pull the detail on demand. Don't
inline component APIs or token values here; query the MCP or Storybook so you always get current data.

> **First move for any UI work:** check the MCP is connected (below). Never guess a token name,
> component prop, or import path — resolve it through the MCP.

---

## The MCP (source of truth)

The system is exposed over an MCP server, `hostaway-design-system`. Prefer it over reading source —
it returns current props, variants, import paths, token values, and usage rules.

**Tools**

| Tool | Use it to |
|------|-----------|
| `list_components()` | list every Component + one-line description |
| `get_component(name)` | full API for a Component: props, types, variants, import path, example, a11y notes |
| `list_patterns()` | list Patterns (PageHeader, FilterBuilder, ViewTabs, …) |
| `get_pattern(name)` | a Pattern's slots, composition, props, and example |
| `search_tokens(query, category?)` | find tokens by name/category (`color`, `spacing`, `radius`, `typography`) |
| `get_token(name)` | resolve one token: value, `usage`, `avoid`, `deprecated`/`replaceWith`, scope |

**Workflow:** unsure of a name → `list_components` / `list_patterns` first, then `get_*`. If
`get_component` returns null the component doesn't exist — compose from primitives + tokens, don't
reach for a third-party lib. If a token is `deprecated`, use its `replaceWith`.

**If the MCP isn't connected,** add it to your Claude Code MCP settings (`~/.claude/settings.json`)
and replace the placeholders:

```json
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

Get a token from the Design System team's onboarding page, then restart Claude Code and run
`list_components()` to confirm the connection.

---

## Where things live

The vocabulary is **Foundations → Components → Patterns → Templates → Pages** (see
[`docs/01-audit.md`](docs/01-audit.md) for the why).

| Layer | In the repo | Ask the MCP |
|-------|-------------|-------------|
| **Foundations** (tokens) | [`src/styles/`](src/styles/) — `theme.css`, `typography.css` | `search_tokens`, `get_token` |
| **Components** | [`src/components/base/`](src/components/base/), [`src/components/application/`](src/components/application/) | `list_components`, `get_component` |
| **Patterns** | [`src/organisms/`](src/organisms/), [`src/molecules/`](src/molecules/) | `list_patterns`, `get_pattern` |
| **Templates** | [`src/templates/`](src/templates/) | — read source |
| **Pages** | [`src/pages/`](src/pages/) | — read source |
| **Filtering model** | [`src/lib/filtering.ts`](src/lib/filtering.ts) — `FieldDef`, `AppliedFilter`, `applyFilters` | — |

**Visual catalog:** Storybook — `npm run storybook` (every Component and Pattern with live controls).

---

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

---

## Build with the system — don't reinvent

> **Default to the system. Do not introduce new elements.** Before you build anything, assume it
> already exists and go find it.

- **Search first.** `list_components` / `list_patterns` (or Storybook) before writing any UI. Nine
  times out of ten the thing exists — use it.
- **No net-new one-offs.** Don't hand-roll a button, input, modal, chip, etc. Don't pull in a
  third-party UI library. If a primitive is truly missing, compose it from existing
  Components + tokens.
- **Extend, don't fork.** Need a tweak? Add a token or use a Pattern's slot. Never copy a component
  to modify it — that's how variant sprawl and drift start (see [`docs/01-audit.md`](docs/01-audit.md)).
- **Gap → propose, don't patch.** If the system genuinely lacks something, raise it with the Design
  System team so it's added once, for everyone — not solved ad hoc on your screen.
- **Match the conventions below.** New work should be indistinguishable from existing work.

---

## Conventions (the rules that matter)

1. **Token-first.** Style with semantic tokens (`bg-primary`, `text-secondary`, `rounded-lg`). Never
   raw hex, arbitrary spacing (`gap-[16px]`), or a primitive scale (`bg-gray-900`) in product code.
2. **Compose, don't add variants.** Reach for a Pattern before a raw Component; extend a Pattern via
   its slots, not new `default|secondary|tertiary` flags. Configured combinations become Templates.
3. **Document with rules, not prose.** Every Component/Pattern carries a *Use when / Prefer instead /
   Never for* block (served by the MCP) — say what you should and should **not** do, so AI has no gap
   to fill by guessing.
4. **Code samples are the most valuable docs.** Each entry ships an import + minimal usage example.

---

## Reference

- Audit (why the lifted system fails) — [`docs/01-audit.md`](docs/01-audit.md)
- Adoption roadmap — [`docs/roadmap.md`](docs/roadmap.md)
- Untitled UI baseline reference — [`docs/UNTITLED_UI_REFERENCE.md`](docs/UNTITLED_UI_REFERENCE.md)
- Live: [Reservations screen](https://eddiemachado.github.io/hostaway-take-home/) · [Slide deck](https://eddiemachado.github.io/hostaway-take-home/site.html)
