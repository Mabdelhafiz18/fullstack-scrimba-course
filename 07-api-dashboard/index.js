// API Dashboard
// Demonstrates fetch + async/await with error handling across three widgets:
// a live clock, weather (Open-Meteo, no key), and random quotes.

// Fall back to defaults if the user hasn't created a config.js.
const config = window.APP_CONFIG || {
  city: { name: "Lisbon", latitude: 38.72, longitude: -9.14 },
};

/* ----------------------------- Clock ----------------------------- */

function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString();
  document.getElementById("date").textContent = now.toLocaleDateString(
    undefined,
    { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  );
}

updateClock();
setInterval(updateClock, 1000);

/* ---------------------------- Weather ---------------------------- */

// Open-Meteo weather codes mapped to short descriptions.
const WEATHER_CODES = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Rime fog",
  51: "Light drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  80: "Rain showers",
  95: "Thunderstorm",
};

async function loadWeather() {
  const cityEl = document.getElementById("weather-city");
  const tempEl = document.getElementById("weather-temp");
  const descEl = document.getElementById("weather-desc");
  const { name, latitude, longitude } = config.city;

  cityEl.textContent = name;

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}` +
    `&longitude=${longitude}&current=temperature_2m,weather_code`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Request failed (${response.status})`);

    const data = await response.json();
    const temp = Math.round(data.current.temperature_2m);
    const code = data.current.weather_code;

    tempEl.textContent = `${temp}°C`;
    descEl.textContent = WEATHER_CODES[code] || "Unknown conditions";
  } catch (error) {
    tempEl.textContent = "—";
    descEl.textContent = "Couldn't load weather.";
    descEl.classList.add("is-error");
    console.error("Weather error:", error);
  }
}

/* ----------------------------- Quotes ---------------------------- */

// Bundled fallback quotes so the widget always has something to show,
// even offline.
const FALLBACK_QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
];

async function loadQuote() {
  const textEl = document.getElementById("quote-text");
  const authorEl = document.getElementById("quote-author");
  textEl.classList.remove("is-error");

  try {
    // Free, key-less quotes API.
    const response = await fetch("https://api.quotable.io/random");
    if (!response.ok) throw new Error(`Request failed (${response.status})`);

    const data = await response.json();
    textEl.textContent = `"${data.content}"`;
    authorEl.textContent = `— ${data.author}`;
  } catch (error) {
    // Network/API failure: fall back to a local quote.
    const random =
      FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
    textEl.textContent = `"${random.text}"`;
    authorEl.textContent = `— ${random.author}`;
    console.info("Using fallback quote:", error.message);
  }
}

document.getElementById("new-quote-btn").addEventListener("click", loadQuote);

/* --------------------------- Initialise -------------------------- */

loadWeather();
loadQuote();
