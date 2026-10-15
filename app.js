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
const progressBar = document.getElementById("progress-bar");
const prevBtn     = document.getElementById("prev");
const nextBtn     = document.getElementById("next");

let index = 0;
const last = SLIDES.length - 1;

function pad(n) {
  return String(n).padStart(2, "0");
}

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

  // Counter, progress bar, buttons
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
