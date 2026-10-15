// ================================================================
//  This file runs the slideshow. You shouldn't need to edit it —
//  write your slides in slides.js instead.
// ================================================================

document.title = DECK.browserTitle;

const slideEl     = document.getElementById("slide");
const photoImg    = document.getElementById("photo-img");
const photoBg     = document.getElementById("photo-bg");
const titleEl     = document.getElementById("slide-title");
const textEl      = document.getElementById("slide-text");
const decoLayer   = document.getElementById("deco-layer");
const progressBar = document.getElementById("progress-bar");
const prevBtn     = document.getElementById("prev");
const nextBtn     = document.getElementById("next");

let index = 0;
const last = SLIDES.length - 1;

// ---- Decorations (pills, hearts, crosses...) ----
// The icons are defined in index.html. Each slide gets its own
// arrangement, which stays the same every time you view it.
const ICON_NAMES = ["cross", "heart", "pill", "bear", "stethoscope",
                    "bandage", "pulse", "thermometer", "syringe", "tablet"];

// Small seeded random generator (same slide number = same layout)
function seededRandom(seed) {
  let a = seed;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildDecor(hasPhoto, slideNumber) {
  const rand = seededRandom(slideNumber * 9301 + 49297);

  // Photo slides: icons sit at the far left and far right of the caption bar.
  // Text-only slides: icons are spread around, leaving the middle free for text.
  const cols = hasPhoto ? 12 : 5;
  const rows = hasPhoto ? 1 : 3;
  const keep = (r, c) =>
    hasPhoto ? (c <= 1 || c >= cols - 2) : !(r === 1 && c >= 1 && c <= 3);
  const sizeMin = hasPhoto ? 38 : 44;
  const sizeMax = hasPhoto ? 54 : 74;

  const order = ICON_NAMES.slice().sort(() => rand() - 0.5);
  let html = "";
  let n = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!keep(r, c)) continue;
      const size = Math.round(sizeMin + rand() * (sizeMax - sizeMin));
      const x = ((c + 0.15 + rand() * 0.7) / cols) * 100;
      const y = ((r + 0.2 + rand() * 0.6) / rows) * 100;
      const rot = Math.round(rand() * 40 - 20);
      const name = order[n % order.length];
      n++;
      html += '<svg class="deco" style="left:' + x + '%;top:' + y + '%;' +
              'width:' + size + 'px;height:' + size + 'px;' +
              'transform:translate(-50%,-50%) rotate(' + rot + 'deg)">' +
              '<use href="#i-' + name + '"/></svg>';
    }
  }

  // A heartbeat line along the bottom of text-only slides
  if (!hasPhoto) {
    html += '<svg class="ecg"><use href="#i-ecg"/></svg>';
  }

  decoLayer.innerHTML = html;
}

// ---- Show one slide ----
// dir: 1 = moving forward, -1 = moving back, 0 = no animation
function show(i, dir) {
  index = Math.max(0, Math.min(last, i));
  const s = SLIDES[index];

  // Restart the slide-in animation
  slideEl.classList.remove("enter-next", "enter-prev");
  if (dir) {
    void slideEl.offsetWidth;
    slideEl.classList.add(dir > 0 ? "enter-next" : "enter-prev");
  }

  // Photo (or text-only slide)
  const hasImage = Boolean(s.image);
  slideEl.classList.toggle("no-photo", !hasImage);
  if (hasImage) {
    photoImg.src = s.image;
    photoImg.alt = s.title || "";
    photoBg.style.backgroundImage = 'url("' + s.image + '")';
  }

  // Text
  titleEl.textContent = s.title || "";
  titleEl.hidden = !s.title;
  textEl.textContent = s.text || "";
  textEl.hidden = !s.text;

  // Decorations
  buildDecor(hasImage, index + 1);

  // Progress bar and buttons
  progressBar.style.width = ((index + 1) / SLIDES.length) * 100 + "%";
  prevBtn.disabled = index === 0;
  nextBtn.textContent = index === last ? "↺" : "→";
  nextBtn.setAttribute("aria-label", index === last ? "Start over" : "Next slide");

  // Remember the slide number in the address (#3), so a refresh keeps your place
  try { history.replaceState(null, "", "#" + (index + 1)); } catch (e) {}

  // Preload the next photo so it appears instantly
  const upcoming = SLIDES[index + 1];
  if (upcoming && upcoming.image) new Image().src = upcoming.image;
}

function next() { index === last ? show(0, -1) : show(index + 1, 1); }
function prev() { show(index - 1, -1); }

nextBtn.addEventListener("click", next);
prevBtn.addEventListener("click", prev);

// Keyboard: arrows, Page Up/Down, Home/End
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "PageDown") next();
  else if (e.key === "ArrowLeft" || e.key === "PageUp") prev();
  else if (e.key === "Home") show(0, -1);
  else if (e.key === "End") show(last, 1);
});

// Phone: swipe left/right
let touchX = null;
slideEl.addEventListener("touchstart", (e) => {
  touchX = e.changedTouches[0].clientX;
}, { passive: true });
slideEl.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  touchX = null;
  if (Math.abs(dx) < 50) return;
  if (dx < 0 && index < last) next();
  if (dx > 0) prev();
});

// Start on the slide from the address (#3), or slide 1
const startAt = parseInt(location.hash.slice(1), 10);
show(Number.isInteger(startAt) ? startAt - 1 : 0, 0);
