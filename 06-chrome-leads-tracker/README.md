# 06 · Chrome Leads Tracker

A "leads" (link) tracker that saves URLs to `localStorage`. It runs as a Chrome
extension popup **and** as a normal browser page.

## Features

- Save a typed URL with the **Save** button
- **Save current tab** — uses the Chrome `tabs` API in the extension, and falls
  back to the current page URL when run as a plain web page
- **Delete all** (double-click to confirm)
- Persists data in `localStorage`
- Renders saved links as a clickable list

## Run it as a normal web page

Open `index.html` in a browser, or run `npx serve .`. Everything works except
the "current tab" feature, which falls back to the page's own URL.

## Run it as a Chrome extension

1. Visit `chrome://extensions`
2. Enable **Developer mode** (top-right)
3. Click **Load unpacked** and select this folder
4. Pin the extension and click its icon to open the popup

## Concepts practiced

- `localStorage` (get / set / remove, with `JSON.stringify` / `parse`)
- Feature detection (`chrome.tabs` may not exist)
- Rendering arrays to HTML with `map().join("")`
- Chrome Manifest V3 basics

## Notes

- The `tabs` permission is only used inside the extension context.
- Double-click **Delete all** is intentional, to avoid accidental wipes.
