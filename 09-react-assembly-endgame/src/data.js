// Programming languages used as the "lives" in the game. Guess wrong and the
// next language is eliminated. If you lose them all (except Assembly), the
// world falls to Assembly.
export const languages = [
  { name: "HTML", backgroundColor: "#E2680F", color: "#F9F4DA" },
  { name: "CSS", backgroundColor: "#328AF1", color: "#F9F4DA" },
  { name: "JavaScript", backgroundColor: "#F4EB13", color: "#1E1E1E" },
  { name: "React", backgroundColor: "#2ED3E9", color: "#1E1E1E" },
  { name: "TypeScript", backgroundColor: "#298EC6", color: "#F9F4DA" },
  { name: "Node.js", backgroundColor: "#599137", color: "#F9F4DA" },
  { name: "Python", backgroundColor: "#FFD43B", color: "#1E1E1E" },
  { name: "Ruby", backgroundColor: "#D02123", color: "#F9F4DA" },
  { name: "Assembly", backgroundColor: "#2D519F", color: "#F9F4DA" },
];

// A small word list for the guessing game.
export const words = [
  "react",
  "browser",
  "function",
  "variable",
  "component",
  "javascript",
  "keyboard",
  "developer",
  "interface",
  "promise",
];

// Pick a random word from the list.
export function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}
