// ================================================================
//   YOUR SLIDES LIVE IN THIS FILE.
//   This is the ONLY file you need to edit.
// ================================================================

// The text shown on the browser tab.
const DECK = {
  browserTitle: "A Visit to the Hospital"
};

// ----------------------------------------------------------------
// HOW TO WRITE A SLIDE
// ----------------------------------------------------------------
//   {
//     image: "images/02-waiting-room.jpg",   <- photo in the images/ folder
//     title: "Waiting room",                 <- optional
//     text:  "What happened here."           <- optional
//   },
//
// RULES
//  - Slides play in the order they are listed, top to bottom.
//  - Each slide is wrapped in { }, and followed by a comma.
//  - Leave out "image" and you get a big text-only slide
//    (good for the first slide, the last slide, or a chapter break).
//  - "title" and "text" are both optional.
//  - Use \n inside the text for a line break.
//  - To reorder slides: cut and paste a whole { ... }, block.
//  - The slide numbers (No. 01, 02...) are automatic.
//  - Photos of any shape work — they are shown whole, never cropped.
// ----------------------------------------------------------------

const SLIDES = [

  // Slide 1: no image = big title slide
  {
    title: "A Visit to the Hospital",
    text: "A story in photos."
  },

  {
    image: "images/01-arrival.jpg",
    title: "Arrival",
    text: "Replace this with what happened when you first walked in."
  },

  {
    image: "images/02-waiting-room.jpg",
    title: "The waiting room",
    text: "Replace this text with your own.\nA second line, if you want one."
  },

  {
    image: "images/03-consultation.jpg",
    title: "Consultation",
    text: "Replace this text with your own."
  },

  {
    image: "images/04-tests.jpg",
    title: "Tests",
    text: "Replace this text with your own."
  },

  {
    image: "images/05-recovery.jpg",
    title: "Heading home",
    text: "Replace this text with your own."
  },

  // Last slide: no image = big closing slide
  {
    title: "The End",
    text: "Thanks for coming along."
  }

];
