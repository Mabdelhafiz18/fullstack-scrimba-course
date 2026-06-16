// Configuration example for the API Dashboard.
//
// This project works WITHOUT any API key out of the box:
//   - Weather uses Open-Meteo (https://open-meteo.com), which is free and
//     requires no key.
//   - The clock uses the browser's local time.
//   - Quotes come from a bundled list (with an optional live API fetch).
//
// To customise things, copy this file to `config.js` and edit the values.
// `config.js` is gitignored so you never commit secrets.
//
//   cp config.example.js config.js
//
// If you swap in a weather provider that DOES require a key (e.g.
// OpenWeatherMap), put it here as a placeholder — never hardcode a real key
// into index.js or commit it.

window.APP_CONFIG = {
  // The city shown in the weather widget, with its coordinates for Open-Meteo.
  city: {
    name: "Lisbon",
    latitude: 38.72,
    longitude: -9.14,
  },

  // Optional: only needed if you replace Open-Meteo with a key-based provider.
  // Leave as an empty placeholder by default.
  weatherApiKey: "YOUR_API_KEY_HERE",
};
