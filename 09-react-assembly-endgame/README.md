# 09 · React Assembly: Endgame

A Hangman-style word-guessing game built with React and Vite. Every wrong guess
eliminates a programming language — lose them all and the world falls to
**Assembly**.

## Features

- Random word from a built-in word list
- On-screen keyboard (A–Z)
- Wrong-guess counter visualised as eliminated language chips
- Win/loss detection with status banner
- Reveals the answer on loss
- **New Game** button to play again

## Project structure

```
src/
  App.jsx       # Game state, derived win/loss logic, keyboard
  data.js       # Languages, word list, getRandomWord()
  index.css     # Styles
  main.jsx      # React entry point
```

## Concepts practiced

- Derived state (`wrongGuessCount`, `isGameWon`, `isGameLost`)
- Rendering lists with `.map()` and conditional classes
- Controlled UI with disabled states
- Keeping state minimal (only `currentWord` + `guessedLetters`)

## Run it

```bash
npm install
npm run dev
```
