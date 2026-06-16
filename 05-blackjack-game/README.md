# 05 · Blackjack Game

A simplified single-player Blackjack game built with HTML, CSS, and vanilla
JavaScript. Reach 21 without going over.

## Features

- **Start game** deals two random cards
- **New card** draws another card
- Random card logic (Ace = 11, face cards = 10)
- Live sum calculation
- Win / lose / keep-going messages
- Player chips display (win adds chips, bust loses chips)
- Animated card dealing

## How it works

- `getRandomCard()` returns a value 1–13, mapping Aces to 11 and face cards
  to 10.
- The game tracks `cards`, `sum`, `isAlive`, and `hasBlackjack` state.
- `renderGame()` redraws the cards and decides the outcome each turn.

## Concepts practiced

- Game state management with plain variables
- `Math.random()` for randomness
- Creating DOM elements dynamically
- Enabling/disabling controls based on state

## Run it

Open `index.html` in a browser. No build step required.
