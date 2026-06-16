import { useState, useEffect, useRef } from "react";
import Die from "./components/Die.jsx";

// Generate a single die with a random value (1-6).
function generateDie() {
  return {
    id: crypto.randomUUID(),
    value: Math.ceil(Math.random() * 6),
    isHeld: false,
  };
}

// Create a fresh set of 10 dice.
function generateAllDice() {
  return Array.from({ length: 10 }, generateDie);
}

export default function App() {
  const [dice, setDice] = useState(generateAllDice);
  const [rollCount, setRollCount] = useState(0);

  // You win when every die is held AND shows the same value.
  const gameWon =
    dice.every((die) => die.isHeld) &&
    dice.every((die) => die.value === dice[0].value);

  // Move focus to the "New Game" button when the game is won (accessibility).
  const newGameButton = useRef(null);
  useEffect(() => {
    if (gameWon) {
      newGameButton.current?.focus();
    }
  }, [gameWon]);

  // Roll all dice that aren't held. If won, start a fresh game instead.
  function rollDice() {
    if (gameWon) {
      setDice(generateAllDice());
      setRollCount(0);
    } else {
      setDice((oldDice) =>
        oldDice.map((die) => (die.isHeld ? die : generateDie()))
      );
      setRollCount((count) => count + 1);
    }
  }

  // Toggle the held state of a single die.
  function holdDie(id) {
    setDice((oldDice) =>
      oldDice.map((die) =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      onClick={() => holdDie(die.id)}
    />
  ));

  return (
    <main className="game">
      <h1 className="game__title">Tenzies</h1>
      <p className="game__instructions">
        Roll until all dice are the same. Click a die to freeze it at its
        current value between rolls.
      </p>

      <div className="dice-grid">{diceElements}</div>

      <p className="game__rolls">Rolls: {rollCount}</p>

      <button
        ref={newGameButton}
        className="game__btn"
        onClick={rollDice}
      >
        {gameWon ? "New Game" : "Roll"}
      </button>

      {gameWon && (
        <p className="game__win" role="status">🎉 You won in {rollCount} rolls!</p>
      )}
    </main>
  );
}
