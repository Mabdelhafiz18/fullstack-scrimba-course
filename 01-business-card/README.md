# 01 · Business Card

A single, responsive digital business card built with plain HTML and CSS.

## Design

A minimal, typographic card on warm paper with a single cobalt accent. Type is
the hero (Space Grotesk + Space Mono), the layout is left-aligned to a baseline,
and contact links sit in a hairline-divided list with an arrow that slides on
hover.

## Features

- Responsive card that works on mobile and desktop
- Monogram mark + "available for work" status
- Name, role, and one-line bio
- Contact links (email, GitHub, LinkedIn) with hover/focus states
- Light, restrained theme using CSS custom properties

## Concepts practiced

- Semantic HTML (`main`, `header`, `nav`)
- CSS variables and the `box-sizing` reset
- CSS Grid for the link rows; `clamp()` for fluid type and spacing
- Accessible focus styles (`:focus-visible`) and `prefers-reduced-motion`

## Run it

Open `index.html` in any browser, or serve the folder:

```bash
npx serve .
```

Edit the name, role, and links directly in `index.html` to make it yours.
