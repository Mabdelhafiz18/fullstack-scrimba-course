# 07 · API Dashboard

A small dashboard that pulls live data from free public APIs using the Fetch
API and `async/await`, with graceful error handling.

## Widgets

- **🕒 Local Time** — updates every second from the browser clock.
- **🌤️ Weather** — current temperature and conditions from
  [Open-Meteo](https://open-meteo.com) (**free, no API key required**).
- **💬 Random Quote** — fetched from a free quotes API, with a bundled fallback
  list if the request fails or you're offline.

## No keys, no paid APIs

Every data source here is free and key-less by default. If you choose to swap in
a provider that needs a key, use the documented placeholder in
`config.example.js` — **never hardcode real keys**.

## Optional config

```bash
cp config.example.js config.js
```

Then edit `config.js` to change the weather city/coordinates. `config.js` is
gitignored. The app runs fine without it (it falls back to Lisbon).

## Error handling

- Every `fetch` checks `response.ok` and throws on non-2xx responses.
- Failures are caught, logged, and shown in the UI (weather shows an error
  state; quotes fall back to a local list).

## Concepts practiced

- `fetch` + `async/await`
- `try/catch` error handling and response validation
- `setInterval` for the live clock
- Reading optional runtime config from a global

## Run it

Open `index.html` in a browser, or `npx serve .`. (Serving is recommended so
the `fetch` calls run from an `http://` origin rather than `file://`.)
