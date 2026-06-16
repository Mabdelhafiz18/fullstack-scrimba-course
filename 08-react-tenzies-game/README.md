# 08 · React Tenzies Game

The classic Scrimba **Tenzies** dice game, built with React and Vite. Roll until
all ten dice show the same number, freezing the ones you want to keep.

## Features

- Roll all unheld dice
- Click (or keyboard-activate) a die to hold it
- Win when all dice are held **and** show the same value
- Roll counter
- Button switches to **New Game** once you win
- Component-based structure (`App` + reusable `Die`)
- Focus moves to the New Game button on win (accessibility)

## Project structure

```
src/
  App.jsx              # Game state and logic
  components/
    Die.jsx            # A single accessible die button
  index.css            # Styles
  main.jsx             # React entry point
```

## Concepts practiced

- `useState`, `useEffect`, `useRef`
- Immutable state updates with `.map()`
- Lifting state up / passing callbacks as props
- Derived state (computing `gameWon` from `dice`)
- Accessible buttons (`aria-pressed`, `aria-label`)

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL. Build for production with `npm run build`.
