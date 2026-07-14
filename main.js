// main.js - little bits of life for the site
// nothing fancy, just vanilla js. runs on every page.

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---- theme toggle (notebook <-> blueprint) ----
// remember what the visitor picked last time
const root = document.documentElement;
const saved = localStorage.getItem("theme");
if (saved) root.setAttribute("data-theme", saved);

function currentTheme() {
  return root.getAttribute("data-theme") || "notebook";
}

const themeBtn = document.getElementById("theme-btn");
function paintThemeBtn() {
  if (!themeBtn) return;
  const isNight = currentTheme() === "blueprint";
  const label = isNight ? "notebook mode" : "blueprint mode";
  themeBtn.textContent = label;
  // keep the visible text inside the accessible name (WCAG 2.5.3 Label in Name)
  themeBtn.setAttribute("aria-label", "switch to " + label);
}
paintThemeBtn();

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const next = currentTheme() === "blueprint" ? "notebook" : "blueprint";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    paintThemeBtn();
  });
}

// ---- tiny clock (my local time) ----
const clock = document.getElementById("clock");
function tick() {
  if (!clock) return;
  const now = new Date();
  const t = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  clock.textContent = "my time: " + t;
}
tick();
setInterval(tick, 1000 * 20);

// ---- typewriter tagline (home page only) ----
// the home tagline has id="type"; other pages keep their own static line.
const tag = document.getElementById("type");
if (tag) {
  const lines = [
    "developer / builder / rocket guy",
    "i make things, then i launch things",
    "student, and always mid-project",
  ];

  if (reduceMotion) {
    // no animation: just show the first line, no blinking cursor
    tag.textContent = lines[0];
  } else {
    let li = 0;   // which line
    let ci = 0;   // which character
    let erasing = false;

    function type() {
      const line = lines[li];
      if (!erasing) {
        ci++;
        if (ci > line.length) {
          erasing = true;
          drawTag(line);
          setTimeout(type, 1400); // pause on the full line
          return;
        }
      } else {
        ci--;
        if (ci === 0) {
          erasing = false;
          li = (li + 1) % lines.length;
        }
      }
      drawTag(line.slice(0, ci));
      setTimeout(type, erasing ? 40 : 75);
    }

    function drawTag(txt) {
      tag.innerHTML = txt + '<span class="cursor" aria-hidden="true">_</span>';
    }

    type();
  }
}

// ---- project filters ----
// buttons carry a data-filter, cards carry data-tags (space separated)
const filterBtns = document.querySelectorAll(".filters button");
if (filterBtns.length) {
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const want = btn.dataset.filter;

      // move the "on" highlight + tell screen readers which is active
      filterBtns.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("on", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });

      document.querySelectorAll("[data-tags]").forEach((card) => {
        const tags = card.dataset.tags.split(" ");
        const show = want === "all" || tags.includes(want);
        card.classList.toggle("hide", !show);
      });
    });
  });
}

// ---- visitor counter ----
// not a real global counter (that needs a backend). just counts YOUR visits,
// which is honestly the neocities spirit anyway.
const hits = document.getElementById("hits");
if (hits) {
  let n = parseInt(localStorage.getItem("hits") || "0", 10) + 1;
  localStorage.setItem("hits", n);
  hits.textContent = n;
}

// ---- konami code: launch a rocket ----
const code = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
let progress = 0;
document.addEventListener("keydown", (e) => {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  progress = key === code[progress] ? progress + 1 : 0;
  if (progress === code.length) {
    launchRocket();
    progress = 0;
  }
});

function launchRocket() {
  const r = document.createElement("div");
  r.id = "rocket";
  r.textContent = "🚀";
  document.body.appendChild(r);
  // let the element exist for a frame before animating
  requestAnimationFrame(() => r.classList.add("launch"));
  setTimeout(() => r.remove(), 1800);
}
