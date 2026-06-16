// Leads Tracker
// Save links to localStorage and render them as a list.
// Works both as a Chrome extension popup and as a normal browser page.

const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const tabBtn = document.getElementById("tab-btn");
const deleteBtn = document.getElementById("delete-btn");
const ulEl = document.getElementById("ul-el");

// Load any previously saved leads from localStorage.
let leads = JSON.parse(localStorage.getItem("leads")) || [];

render(leads);

// Save the URL typed into the input.
inputBtn.addEventListener("click", () => {
  const value = inputEl.value.trim();
  if (!value) return;
  leads.push(value);
  inputEl.value = "";
  save();
});

// Save the current tab's URL.
// Uses the Chrome extension API when available, otherwise falls back to
// the current page URL so the button still works in a normal browser.
tabBtn.addEventListener("click", () => {
  if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      leads.push(tabs[0].url);
      save();
    });
  } else {
    // Browser-page fallback
    leads.push(window.location.href);
    save();
  }
});

// Delete all leads (double-click to confirm).
deleteBtn.addEventListener("dblclick", () => {
  localStorage.removeItem("leads");
  leads = [];
  render(leads);
});

function save() {
  localStorage.setItem("leads", JSON.stringify(leads));
  render(leads);
}

function render(items) {
  ulEl.innerHTML = items
    .map(
      (lead) => `
        <li>
          <a target="_blank" rel="noopener" href="${lead}">${lead}</a>
        </li>`
    )
    .join("");
}
