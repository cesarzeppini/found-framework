# Allowed customization

Anything not listed here is a violation. When unsure, list it and ask rather than assuming it is fine.

## Layout classes — always allowed on any component

These affect position and size only, never appearance:

- spacing: `m-*` `mx-*` `my-*` `mt-*` `mr-*` `mb-*` `ml-*` `p-*` `px-*` `py-*` `pt-*` `pr-*` `pb-*` `pl-*` `gap-*` `space-x-*` `space-y-*`
- box size: `w-*` `min-w-*` `max-w-*` `h-*` `min-h-*` `max-h-*` `size-*` `aspect-*`
- flex / grid: `flex` `inline-flex` `flex-*` `grid` `grid-cols-*` `grid-rows-*` `col-*` `row-*` `items-*` `justify-*` `self-*` `place-*` `order-*`
- position: `relative` `absolute` `fixed` `sticky` `inset-*` `top-*` `right-*` `bottom-*` `left-*` `z-*`
- flow: `block` `inline` `hidden` `overflow-*` `shrink-*` `grow-*` `basis-*` `truncate` `whitespace-*` `break-*`
- responsive and state prefixes on any of the above: `sm:` `md:` `lg:` `xl:` `2xl:` `hover:` `focus:` `data-[...]:`

## Props — allowed

- `variant` and `size`, limited to the values the component's own type union declares
- behavioral / a11y props the component declares: `disabled`, `type`, `asChild`, `open`, `onOpenChange`, `value`, `onValueChange`, `aria-*`, `id`, `name`, `placeholder`, `required`
- event handlers

## Not allowed

- appearance utilities on a design-system component: `bg-*` `text-<color>` `border-<color>` `ring-*` `shadow-*` `rounded-*` `font-*` `tracking-*` `opacity-*`
  - exception: semantic-token classes are allowed where the component has no variant covering the need. The token list is NOT maintained here — derive it at check time from `context/tokens.css`: every custom property defined there maps to an allowed utility (`--card` → `bg-card`, `--muted-foreground` → `text-muted-foreground`, and so on). If tokens.css doesn't define it, it isn't allowed.
- any raw value: `#hex`, `rgb()`, `hsl()`, `text-[...]`, `bg-[...]`, arbitrary values for color / font / radius / shadow
- non-token color utilities from Tailwind's default palette: `bg-white` `bg-black` `text-white` `text-black` `bg-gray-100` `text-slate-500` etc.
- `style={{ ... }}` for anything other than a computed dimension or transform
- `!important` / `!` prefixed utilities
- spreading unvalidated props (`{...rest}`) onto a design-system component to smuggle class or style through
- text size overrides that fight the component's typography — use the intended component or ask for a new variant

## Adding a legitimate exception

If a customization should be permanently allowed, add it to this file in the same task, so the next run does not re-flag it.
