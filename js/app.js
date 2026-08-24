import { games } from "../data/games.js";

const box = document.querySelector("#games");
const dots = document.querySelector("#dots");

// Games display
games.forEach((g, i) => {
  const card = document.createElement("article");

  card.className = "card";

  card.innerHTML = `
    <div class="art ${g.art}">${g.icon}</div>

    <span class="tag">
      ${String(i + 1).padStart(2, "0")} · ${g.category}
    </span>

    <h3>${g.name}</h3>

    <p>${g.description}</p>

    <div class="bottom">
      <span>${g.players}</span>
      <button class="play" data-game="${g.id}">
        PLAY NOW →
      </button>
    </div>
  `;

  box.appendChild(card);

  const dot = document.createElement("span");
  dot.className = `dot${i === 0 ? " active" : ""}`;
  dots.appendChild(dot);
});


// Carousel dots
const cards = [...document.querySelectorAll(".card")];
const dotElements = [...document.querySelectorAll(".dot")];

box.addEventListener(
  "scroll",
  () => {
    const center = box.scrollLeft + box.clientWidth / 2;

    let closest = 0;
    let distance = Infinity;

    cards.forEach((card, index) => {
      const cardCenter =
        card.offsetLeft + card.offsetWidth / 2;

      const difference = Math.abs(cardCenter - center);

      if (difference < distance) {
        distance = difference;
        closest = index;
      }
    });

    dotElements.forEach((dot, index) => {
      dot.classList.toggle("active", index === closest);
    });
  },
  { passive: true }
);


// PLAY NOW
document.querySelectorAll(".play").forEach(button => {

  button.addEventListener("click", () => {

    const game = games.find(
      item => item.id === button.dataset.game
    );

    if (!game) return;

    // Carrom
    if (game.id === "carrom") {
      window.location.href = "carrom.html";
      return;
    }

    // Other games — temporary
    alert(
      `${game.name}\n\n` +
      `Game mode selection coming next.`
    );

  });

});


// Sound button
const soundButton = document.querySelector("#sound");

if (soundButton) {
  soundButton.addEventListener("click", () => {
    soundButton.textContent =
      soundButton.textContent === "♫"
        ? "🔇"
        : "♫";
  });
}


// Bottom navigation
document.querySelectorAll("nav button").forEach(button => {

  button.addEventListener("click", () => {

    document
      .querySelectorAll("nav button")
      .forEach(item => {
        item.classList.remove("active");
      });

    button.classList.add("active");

  });

});
