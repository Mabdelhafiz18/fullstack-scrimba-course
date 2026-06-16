import { useState } from "react";
import { languages, getRandomWord } from "./data.js";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

export default function App() {
  const [currentWord, setCurrentWord] = useState(getRandomWord);
  const [guessedLetters, setGuessedLetters] = useState([]);

  // Derived state — recomputed on every render from the two state values.
  const wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  // You have as many lives as there are non-Assembly languages.
  const maxWrongGuesses = languages.length - 1;

  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isGameLost = wrongGuessCount >= maxWrongGuesses;
  const isGameOver = isGameWon || isGameLost;

  function addGuessedLetter(letter) {
    setGuessedLetters((prev) =>
      prev.includes(letter) ? prev : [...prev, letter]
    );
  }

  function startNewGame() {
    setCurrentWord(getRandomWord());
    setGuessedLetters([]);
  }

  // Language "chips" — those past the wrong-guess count are eliminated.
  const languageChips = languages.map((lang, index) => {
    const isLost = index < wrongGuessCount;
    return (
      <span
        key={lang.name}
        className={`chip ${isLost ? "chip--lost" : ""}`}
        style={{ backgroundColor: lang.backgroundColor, color: lang.color }}
      >
        {lang.name}
      </span>
    );
  });

  // Reveal letters that have been guessed. After the game ends, reveal all.
  const letterElements = currentWord.split("").map((letter, index) => {
    const revealed = guessedLetters.includes(letter) || isGameLost;
    return (
      <span key={index} className="word__letter">
        {revealed ? letter.toUpperCase() : ""}
      </span>
    );
  });

  // On-screen keyboard.
  const keyboardElements = ALPHABET.split("").map((letter) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);

    let className = "key";
    if (isCorrect) className += " key--correct";
    if (isWrong) className += " key--wrong";

    return (
      <button
        key={letter}
        className={className}
        disabled={isGameOver}
        aria-label={`Letter ${letter}`}
        onClick={() => addGuessedLetter(letter)}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  return (
    <main className="game">
      <header className="game__header">
        <h1>Assembly: Endgame</h1>
        <p>Guess the word in under {maxWrongGuesses} attempts to keep the
          programming world safe from Assembly!</p>
      </header>

      <section
        className={`status ${
          isGameWon ? "status--won" : isGameLost ? "status--lost" : ""
        }`}
        role="status"
      >
        {isGameWon && <p>🎉 You win! Well played.</p>}
        {isGameLost && <p>💀 Game over! You lost to Assembly.</p>}
        {!isGameOver && <p>Keep guessing…</p>}
      </section>

      <section className="chips">{languageChips}</section>

      <section className="word">{letterElements}</section>

      <section className="keyboard">{keyboardElements}</section>

      {isGameOver && (
        <button className="new-game" onClick={startNewGame}>
          New Game
        </button>
      )}
    </main>
  );
}
