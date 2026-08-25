import { games } from "../data/games.js";

const box = document.querySelector("#games");
const dots = document.querySelector("#dots");

// ==============================
// GAMES DISPLAY
// ==============================

if (box && dots) {
  games.forEach((g, i) => {
    const card = document.createElement("article");
    card.className = "game-card";

    const playControl =
      g.id === "carrom"
        ? `<a class="play-button" href="./carrom.html">
             PLAY NOW <b>→</b>
           </a>`
        : `<button class="play-button" data-game="${g.id}">
             PLAY NOW <b>→</b>
           </button>`;

    card.innerHTML = `
      <div class="game-image ${g.art}">
        <div class="image-shade"></div>

        <div class="game-art">
          ${g.icon}
        </div>
      </div>

      <div class="game-card-content">

        <span class="game-number">
          ${String(i + 1).padStart(2, "0")}
        </span>

        <span class="game-type">
          ${g.category}
        </span>

        <h3>${g.name}</h3>

        <p>${g.description}</p>

        <div class="game-card-bottom">
          <span>${g.players}</span>
          ${playControl}
        </div>

      </div>
    `;

    box.appendChild(card);

    const dot = document.createElement("button");

    dot.className = `dot${i === 0 ? " active" : ""}`;
    dot.type = "button";
    dot.dataset.index = i;

    dots.appendChild(dot);
  });
}


// ==============================
// CAROUSEL
// ==============================

const cards = [...document.querySelectorAll(".game-card")];
const dotElements = [...document.querySelectorAll(".dot")];

function updateActiveDot() {
  if (!box || !cards.length) return;

  const center =
    box.scrollLeft + box.clientWidth / 2;

  let closest = 0;
  let distance = Infinity;

  cards.forEach((card, index) => {
    const cardCenter =
      card.offsetLeft + card.offsetWidth / 2;

    const difference =
      Math.abs(cardCenter - center);

    if (difference < distance) {
      distance = difference;
      closest = index;
    }
  });

  dotElements.forEach((dot, index) => {
    dot.classList.toggle(
      "active",
      index === closest
    );
  });
}

if (box) {
  box.addEventListener(
    "scroll",
    updateActiveDot,
    { passive: true }
  );
}


// ==============================
// DOT CLICK
// ==============================

dotElements.forEach((dot, index) => {
  dot.addEventListener("click", () => {

    const card = cards[index];

    if (!card || !box) return;

    card.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });
  });
});


// ==============================
// OTHER GAME BUTTONS
// ==============================

document
  .querySelectorAll(".play-button[data-game]")
  .forEach(button => {

    button.addEventListener("click", () => {

      const game = games.find(
        item => item.id === button.dataset.game
      );

      if (!game) return;

      alert(
        `${game.name}\n\n` +
        `Game mode selection coming next.`
      );
    });

  });


// ==============================
// SOUND BUTTON
// ==============================

const soundButton =
  document.querySelector("#sound");

if (soundButton) {

  soundButton.addEventListener("click", () => {

    const isOn =
      soundButton.dataset.sound !== "off";

    if (isOn) {
      soundButton.textContent = "🔇";
      soundButton.dataset.sound = "off";
    } else {
      soundButton.textContent = "♫";
      soundButton.dataset.sound = "on";
    }

  });

}


// ==============================
// BOTTOM NAVIGATION
// ==============================

const navButtons =
  document.querySelectorAll(".bottom-nav .nav-item");

navButtons.forEach(button => {

  button.addEventListener("click", () => {

    navButtons.forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");

  });

});


// ==============================
// INITIAL STATE
// ==============================

updateActiveDot();
