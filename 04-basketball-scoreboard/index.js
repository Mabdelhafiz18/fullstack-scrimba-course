// Basketball Scoreboard
// Track scores for two teams and highlight whoever is leading.

const scores = {
  home: 0,
  guest: 0,
};

const scoreEls = {
  home: document.getElementById("home-score"),
  guest: document.getElementById("guest-score"),
};

const teamEls = {
  home: document.getElementById("home-team"),
  guest: document.getElementById("guest-team"),
};

// One listener handles every +1 / +2 / +3 button via data attributes.
document.querySelectorAll(".team__buttons button").forEach((button) => {
  button.addEventListener("click", () => {
    const team = button.dataset.team;
    const points = Number(button.dataset.points);
    scores[team] += points;
    render();
  });
});

document.getElementById("reset-btn").addEventListener("click", () => {
  scores.home = 0;
  scores.guest = 0;
  render();
});

// Update the displayed numbers and highlight the leading team.
function render() {
  scoreEls.home.textContent = scores.home;
  scoreEls.guest.textContent = scores.guest;

  teamEls.home.classList.remove("team--leading");
  teamEls.guest.classList.remove("team--leading");

  if (scores.home > scores.guest) {
    teamEls.home.classList.add("team--leading");
  } else if (scores.guest > scores.home) {
    teamEls.guest.classList.add("team--leading");
  }
  // Tie (including 0–0): no team highlighted.
}

render();
