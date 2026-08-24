import { games } from "../data/games.js";

const box = document.querySelector("#games");
const dots = document.querySelector("#dots");

games.forEach((g, i) => {
  const c = document.createElement("article");

  c.className = "card";

  c.innerHTML = `
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

  box.append(c);

  const d = document.createElement("span");

  d.className = `dot${i === 0 ? " active" : ""}`;

  dots.append(d);
});


/* ---------------- CAROUSEL ---------------- */

const cards = [...document.querySelectorAll(".card")];
const ds = [...document.querySelectorAll(".dot")];

box.addEventListener(
  "scroll",
  () => {
    let mid = box.scrollLeft + box.clientWidth / 2;
    let best = 0;
    let distance = Infinity;

    cards.forEach((c, i) => {
      const q = Math.abs(
        c.offsetLeft + c.offsetWidth / 2 - mid
      );

      if (q < distance) {
        distance = q;
        best = i;
      }
    });

    ds.forEach((d, i) => {
      d.classList.toggle("active", i === best);
    });
  },
  { passive: true }
);


/* ---------------- GAME NAVIGATION ---------------- */

document.querySelectorAll(".play").forEach(button => {

  button.addEventListener("click", () => {

    const game = games.find(
      g => g.id === button.dataset.game
    );

    if (!game) return;


    /*
      CARROM
    */

    if (game.id === "carrom") {
      window.location.href = "carrom.html";
      return;
    }


    /*
      Future game pages
    */

    if (game.id === "ludo") {
      window.location.href = "ludo.html";
      return;
    }

    if (game.id === "chess") {
      window.location.href = "chess.html";
      return;
    }

    if (game.id === "pool") {
      window.location.href = "pool.html";
      return;
    }

  });

});


/* ---------------- SOUND ---------------- */

const soundButton = document.querySelector("#sound");

if (soundButton) {
  soundButton.addEventListener("click", e => {
    e.currentTarget.textContent =
      e.currentTarget.textContent === "♫"
        ? "🔇"
        : "♫";
  });
}


/* ---------------- BOTTOM NAV ---------------- */

document.querySelectorAll("nav button").forEach(button => {

  button.addEventListener("click", () => {

    document
      .querySelectorAll("nav button")
      .forEach(x => x.classList.remove("active"));

    button.classList.add("active");

  });

});
