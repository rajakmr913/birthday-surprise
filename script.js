/* ============================================================
   Interactive Birthday Surprise — script.js
   Vanilla JS. All personalization lives in CONFIG below.
   ============================================================ */

/* ============================================================
   CONFIG — edit everything here
   ============================================================ */
const CONFIG = {
  herName: "Shivanshi",

  greeting: [
    "Hey Shivanshi! ❤️",
    "Someone very special was born today, and that deserves a little magic.",
    "Ready for your surprise?"
  ],

  // Slideshow: each slide = { photo, caption }
  // Replace photo paths with your own files in assets/images/
slides: [
  {
    photo: "assets/images/photo1.png",
    caption: "You probably don't realize it, but there's something really special about you. ❤️"
  },
  {
    photo: "assets/images/photo2.png",
    caption: "I hope you always remember that you're doing better than you think. Be a little kinder to yourself. 🥰"
  },
  {
    photo: "assets/images/photo3.png",
    caption: "On the days when everything feels a little too much, I hope you know that you don't have to handle everything alone. 🤍"
  },
  {
    photo: "assets/images/photo4.png",
    caption: "You deserve the same happiness, kindness, and love that you so effortlessly bring into other people's lives. ✨"
  },
 {
  photo: "assets/images/photo5.jpg",
  caption: "So today, forget all the worries for a while... just smile and enjoy your day. And if I get to be a small part of your happiness, that's something I'll always cherish. ❤️✨"
}
],

  wishMessage: [
    "Happy Birthday, Shivanshi ❤️",
    "May your life always be filled with happiness, love, laughter, and beautiful surprises.",
    "Never stop smiling, because your smile makes everything brighter."
  ],

  // Every filename below lives in one place — this object. Nothing else in
  // index.html or script.js hardcodes an audio path, so renaming a file or
  // swapping in your own track only ever means editing the line here.
  //
  // Background music has three layers that hand off to one another:
  //   1. sweetBackgroundMusic plays from the very first click through to the
  //      end of the whole experience...
  //   2. ...EXCEPT during the photo slideshow, where it pauses and
  //      slideshowMusic ("your song") takes over instead.
  //   3. If you add birthdayMusic, it takes over from the sweet track the
  //      moment the candle is blown out. It's optional — if you don't add
  //      it, the sweet track just keeps playing, so nothing ever goes silent.
  sweetBackgroundMusic: "assets/audio/start-music.mp3", // OPTIONAL — you haven't added this file yet; see README. Runs start → end, pausing only during the slideshow.
  slideshowMusic:   "assets/audio/teri-galliyan-music.mp3", // "your song" — plays only during the slideshow
  birthdayMusic:    "assets/audio/happy-birthday.mp3",  // OPTIONAL — takes over from the sweet track once the candle's blown; if missing, the sweet track just continues
  balloonPopSound:  "assets/audio/balloon-pop.mp3",     // one-shot; not used by default anymore now that balloons float away instead of popping — kept here in case you want to wire it back to something
  candleBlowSound:  "assets/audio/candle-blow.mp3",     // one-shot, plays when the candle is blown out
  partyPopperSound: "assets/audio/party-popper.mp3",    // one-shot, plays when the gift opens and again when she taps YES

  // Relative volume (0 = silent, 1 = full). Music defaults to 30% so it sits
  // softly behind everything rather than overpowering it; sfx a bit higher
  // so pops/chimes still read clearly.
  volumes: {
    music: 0.3,
    sfx: 0.75
  },

  // Words shown on the balloons before they're released — a little "let go of
  // your worries" moment. Edit freely, or set to [] to turn this off (balloons
  // just show hearts/plain color instead).
  balloonWords: [
    "Depression", "Assignments", "Exams", "Anxiety", "Loneliness", "Sadness",
    "Stress", "Overthinking", "Pressure", "Deadlines", "Tension", "Worries",
    "Fear", "Bad Days", "Tiredness", "Problems"
  ],

  // Cartoon stickers YOU add (transparent PNG/WebP work best). Put the files in
  // assets/stickers/ and list them here — they float around every screen, e.g.
  //   stickers: ["assets/stickers/one.png", "assets/stickers/two.png"],
  // Leave empty for none. (The built-in cartoon cast is drawn in index.html.)
  stickers: [],

  slideDuration: 10000, // 10 seconds per slide

  // Email confirmation (EmailJS). See setup instructions.
email: {
  enabled: true,
  serviceID: "service_w6gm823",
  templateID: "template_wsyu1ri",
  publicKey: "2xHicCEGtl6ARevcn"
}
};

/* ============================================================
   Helpers
   ============================================================ */
const $ = (id) => document.getElementById(id);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function clearTimers() {
  if (slideTimer) { clearTimeout(slideTimer); slideTimer = null; }
  if (heartTimer) { clearTimeout(heartTimer); heartTimer = null; }
}

/* ============================================================
   Screen management
   ============================================================ */
let currentScreen = "screen-balloon";

function showScreen(id) {
  if (id === currentScreen) return;
  const cur = $(currentScreen);
  const next = $(id);
  cur.classList.add("exit");
  setTimeout(() => {
    cur.classList.remove("active", "exit");
    next.classList.add("active");
    currentScreen = id;
    window.scrollTo(0, 0);
  }, 700);
}

/* ============================================================
   Background canvas — particles + glowing dots
   ============================================================ */
const bgCanvas = $("bg-canvas");
const bgCtx = bgCanvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  $("confetti-canvas").width = window.innerWidth;
  $("confetti-canvas").height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function initParticles() {
  particles = [];
  const count = window.innerWidth < 768 ? 40 : 80;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * bgCanvas.width,
      y: Math.random() * bgCanvas.height,
      r: Math.random() * 5 + 2,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.25 - 0.05,
      a: Math.random() * 0.4 + 0.25,
      tw: Math.random() * Math.PI * 2,
      hue: ["#ffffff", "#fff2a8", "#ffb3d6", "#bfe6ff", "#e3d0ff"][Math.floor(Math.random() * 5)]
    });
  }
}
initParticles();

function animateBg() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = bgCanvas.width;
    if (p.x > bgCanvas.width) p.x = 0;
    if (p.y < 0) p.y = bgCanvas.height;
    if (p.y > bgCanvas.height) p.y = 0;
    p.tw += 0.03;
    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    bgCtx.fillStyle = p.hue;
    bgCtx.globalAlpha = p.a * (0.65 + 0.35 * Math.sin(p.tw)); // gentle twinkle
    bgCtx.fill();
  }
  bgCtx.globalAlpha = 1;
  requestAnimationFrame(animateBg);
}
if (!reduceMotion) animateBg();

/* ============================================================
   Floating hearts
   ============================================================ */
const heartsLayer = $("hearts-layer");
const heartChars = ["❤️", "💕", "♥", "💖"];

function spawnHeart() {
  const h = document.createElement("div");
  h.className = "floating-heart";
  h.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = (Math.random() * 1 + 0.8) + "rem";
  h.style.animationDuration = (Math.random() * 4 + 6) + "s";
  heartsLayer.appendChild(h);
  setTimeout(() => h.remove(), 11000);
}
function burstHearts(n) {
  for (let i = 0; i < n; i++) setTimeout(spawnHeart, i * 60);
}
function startHearts() {
  spawnHeart();
  heartTimer = setTimeout(startHearts, 700);
}
let heartTimer = null;
startHearts();

/* ============================================================
   Confetti / party popper
   ============================================================ */
const confCanvas = $("confetti-canvas");
const confCtx = confCanvas.getContext("2d");
let confetti = [];
const confColors = ["#ff6fae", "#ffd166", "#7bdff2", "#b8f2c9", "#c9a7ff", "#ff8a65", "#ffffff"];

function launchConfetti(amount = 120, originX = null) {
  const ox = originX !== null ? originX : confCanvas.width / 2;
  const oy = confCanvas.height * 0.4;
  for (let i = 0; i < amount; i++) {
    confetti.push({
      x: ox, y: oy,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -14 - 4,
      g: 0.35,
      size: Math.random() * 8 + 4,
      color: confColors[Math.floor(Math.random() * confColors.length)],
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 12,
      round: Math.random() < 0.35,
      life: 1
    });
  }
  if (!confettiRunning) { confettiRunning = true; animateConfetti(); }
}
let confettiRunning = false;

function animateConfetti() {
  confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
  confetti = confetti.filter(c => c.life > 0 && c.y < confCanvas.height + 50);
  for (const c of confetti) {
    c.vy += c.g; c.x += c.vx; c.y += c.vy; c.rot += c.vr;
    c.life -= 0.008;
    confCtx.save();
    confCtx.translate(c.x, c.y);
    confCtx.rotate((c.rot * Math.PI) / 180);
    confCtx.fillStyle = c.color;
    confCtx.globalAlpha = Math.max(0, c.life);
    if (c.round) { confCtx.beginPath(); confCtx.arc(0, 0, c.size / 2.4, 0, Math.PI * 2); confCtx.fill(); }
    else confCtx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
    confCtx.restore();
  }
  confCtx.globalAlpha = 1;
  if (confetti.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiRunning = false;
  }
}

/* ============================================================
   Audio management
   ------------------------------------------------------------
   Three background layers share the stage, one at a time:
     'sweet'    — the ambient track, start to end, except during the slideshow
     'their'    — the slideshow's own song ("your song"), slideshow only
     'birthday' — optional, takes over once the candle is blown
   `activeTrack` tracks which one is currently meant to be playing so that
   tab-visibility changes know what to resume.
   ============================================================ */
const audioSweet = $("audio-sweet");
const audioSlideshow = $("audio-slideshow");
const audioBirthday = $("audio-birthday");
const sfxBalloon = $("sfx-balloon");
const sfxCandle = $("sfx-candle");
const sfxPopper = $("sfx-popper");

// Apply CONFIG as the single source of truth for sources + volumes.
// If a file 404s, the element simply stays silent (caught below) instead
// of breaking anything else on the page.
audioSweet.src = CONFIG.sweetBackgroundMusic;
audioSlideshow.src = CONFIG.slideshowMusic;
audioBirthday.src = CONFIG.birthdayMusic;
sfxBalloon.src = CONFIG.balloonPopSound;
sfxCandle.src = CONFIG.candleBlowSound;
sfxPopper.src = CONFIG.partyPopperSound;

[audioSweet, audioSlideshow, audioBirthday].forEach((a) => { a.volume = CONFIG.volumes.music; });
[sfxBalloon, sfxCandle, sfxPopper].forEach((a) => { a.volume = CONFIG.volumes.sfx; });

let activeTrack = null; // 'sweet' | 'their' | 'birthday' | null

/* ------------------------------------------------------------
   Built-in "sweet" music box (original, generated with Web Audio).
   Used automatically when CONFIG.sweetBackgroundMusic can't be loaded,
   so the sweet background layer works out of the box. Drop your own
   mp3 at that path and it replaces this seamlessly.
   ------------------------------------------------------------ */
const musicBox = (() => {
  // Gentle I–V–vi–IV progression in C, played as a soft arpeggio.
  const chords = [
    [261.63, 329.63, 392.0, 523.25],   // C
    [196.0, 293.66, 392.0, 493.88],    // G
    [220.0, 261.63, 329.63, 440.0],    // Am
    [174.61, 261.63, 349.23, 440.0]    // F
  ];
  const pattern = [0, 1, 2, 3, 2, 1, 2, 1]; // 8 eighth-notes per bar
  const eighth = 0.36;                      // seconds (~83 bpm)
  let ctx = null, master = null, timer = null, running = false;
  let nextTime = 0, bar = 0, beat = 0;

  function init() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    // A touch of echo makes it feel airy and dreamy
    const delay = ctx.createDelay(1.0);
    delay.delayTime.value = eighth * 1.5;
    const fb = ctx.createGain(); fb.gain.value = 0.32;
    const tone = ctx.createBiquadFilter(); tone.type = "lowpass"; tone.frequency.value = 3200;
    master.connect(ctx.destination);
    master.connect(delay); delay.connect(tone); tone.connect(fb); fb.connect(delay); tone.connect(ctx.destination);
    return true;
  }

  function note(freq, t, dur, peak) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    g.connect(master);
    [[freq, "triangle", 1], [freq * 2, "sine", 0.35]].forEach(([f, type, amt]) => {
      const o = ctx.createOscillator(); o.type = type; o.frequency.value = f;
      const og = ctx.createGain(); og.gain.value = amt;
      o.connect(og); og.connect(g);
      o.start(t); o.stop(t + dur + 0.05);
    });
  }

  function schedule() {
    while (nextTime < ctx.currentTime + 0.5) {
      const chord = chords[bar % chords.length];
      note(chord[pattern[beat]], nextTime, 1.3, 0.5);
      if (beat === 0) note(chord[3] * 2, nextTime, 2.4, 0.22); // high bell on the downbeat
      nextTime += eighth;
      if (++beat >= pattern.length) { beat = 0; bar++; }
    }
  }

  return {
    start() {
      if (running) return;
      if (!ctx && !init()) return;
      running = true;
      ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(CONFIG.volumes.music, ctx.currentTime, 0.4);
      nextTime = ctx.currentTime + 0.1;
      timer = setInterval(schedule, 100);
    },
    stop() {
      if (!running) return;
      running = false;
      clearInterval(timer);
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
      setTimeout(() => { if (!running) ctx.suspend(); }, 500);
    }
  };
})();

// One handle for the sweet layer: the mp3 if it exists, otherwise the music box.
const sweet = {
  fileMissing: false,
  play() {
    if (this.fileMissing) { musicBox.start(); return; }
    audioSweet.play().catch((err) => {
      if (err && err.name === "NotAllowedError") return; // autoplay blocked — not a missing file
      this.fileMissing = true;
      musicBox.start();
    });
  },
  pause() { audioSweet.pause(); musicBox.stop(); },
  stop() { audioSweet.pause(); audioSweet.currentTime = 0; musicBox.stop(); }
};
audioSweet.addEventListener("error", () => { sweet.fileMissing = true; });

function playSweetMusic() {
  activeTrack = "sweet";
  sweet.play();
}

function stopAllMusic() {
  sweet.stop();
  audioSlideshow.pause(); audioSlideshow.currentTime = 0;
  audioBirthday.pause(); audioBirthday.currentTime = 0;
  activeTrack = null;
  musicPlaying = false;
  updateMusicButton(false);
}

function playSfx(audio) {
  try { audio.currentTime = 0; audio.play().catch(() => {}); } catch (e) {}
}

/* ============================================================
   Balloons — a bouquet to release, a sky full of them, and a
   steady drift of balloons through the background everywhere
   ============================================================ */
const BALLOON_COLORS = ["#ff6fae", "#7bdff2", "#ffd166", "#b8f2c9", "#c9a7ff", "#ff8a65", "#8fb8ff", "#ff9bb3"];
const balloonsLayer = $("balloons-layer");
const rand = (a, b) => a + Math.random() * (b - a);
let skyBalloonCount = 0;

// Shuffled-bag picker: hands out every word once (in random order) before
// any word repeats, so the 12-balloon bouquet never shows a duplicate.
const nextBalloonWord = (() => {
  let bag = [];
  return () => {
    const words = CONFIG.balloonWords;
    if (!words || !words.length) return "";
    if (!bag.length) bag = [...words].sort(() => Math.random() - 0.5);
    return bag.pop();
  };
})();

// One balloon rising through the sky layer.
function spawnSkyBalloon({ w = rand(34, 60), dur = rand(14, 24), delay = 0, opacity = 0.9, heart = false, themed = false } = {}) {
  const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
  const word = themed ? nextBalloonWord() : "";
  const el = document.createElement("div");
  el.className = "sky-balloon";
  el.style.setProperty("--w", w + "px");
  el.style.setProperty("--x", rand(2, 92) + "vw");
  el.style.setProperty("--dur", dur + "s");
  el.style.setProperty("--delay", delay + "s");
  el.style.setProperty("--o", opacity);
  el.style.setProperty("--c", color);
  el.style.setProperty("--sway", rand(10, 34) + "px");
  el.style.setProperty("--sway-t", rand(3, 5.5) + "s");
  const bodyClass = "sb-body" + (word ? "" : (heart ? " has-heart" : ""));
  const label = word ? '<span class="balloon-label">' + word + "</span>" : "";
  el.innerHTML = '<div class="sb-sway"><div class="' + bodyClass + '">' + label + '</div><div class="sb-knot"></div><div class="sb-string"></div></div>';
  el.addEventListener("animationend", (e) => {
    if (e.animationName === "skyRise") { el.remove(); skyBalloonCount--; }
  });
  balloonsLayer.appendChild(el);
  skyBalloonCount++;
}

// "So many": a big wave of balloons fills the sky when the bouquet is let go.
function balloonFlood(n = 44) {
  for (let i = 0; i < n; i++) {
    spawnSkyBalloon({
      w: rand(44, 96),
      dur: rand(5.5, 10),
      delay: i * 0.07 + rand(0, 0.25),
      opacity: 1,
      heart: Math.random() < 0.25,
      themed: true
    });
  }
}

// Quietly keeps a few balloons drifting up on every screen.
function ambientBalloons() {
  if (!reduceMotion && !document.hidden && skyBalloonCount < 14) {
    const onBalloonScreen = currentScreen === "screen-balloon";
    spawnSkyBalloon({ w: rand(30, 58), dur: rand(16, 26), heart: Math.random() < 0.2, themed: onBalloonScreen });
  }
  setTimeout(ambientBalloons, 1700);
}
ambientBalloons();
for (let i = 0; i < 5; i++) spawnSkyBalloon({ dur: rand(14, 22), delay: -rand(0, 12), themed: currentScreen === "screen-balloon" }); // a few already mid-air at load

/* ============================================================
   SCREEN 1 — Balloon bouquet
   ============================================================ */
const balloon = $("balloon");
const popBtn = $("pop-btn");
const greeting = $("greeting");
const toGiftBtn = $("to-gift-btn");
let balloonsReleased = false;

// [center x %, center y %, width %] — a rounded bunch of 12, strings tied at the bottom.
const BOUQUET = [
  [50, 15, 25], [27, 23, 23], [73, 23, 23],
  [12, 41, 21], [38, 38, 26], [63, 40, 25], [88, 42, 21],
  [24, 58, 22], [50, 57, 23], [77, 59, 22],
  [37, 72, 19], [64, 73, 19]
];

function buildBouquet() {
  balloon.innerHTML = "";
  // The bouquet gets its own shuffled set so its 12 balloons never repeat a
  // word, independent of whatever the ambient/flood balloons are drawing.
  const bouquetWords = CONFIG.balloonWords && CONFIG.balloonWords.length
    ? [...CONFIG.balloonWords].sort(() => Math.random() - 0.5)
    : [];
  const NS = "http://www.w3.org/2000/svg";
  // Strings run from each balloon's knot to the shared tie point.
  const strings = document.createElementNS(NS, "svg");
  strings.setAttribute("class", "bq-strings");
  strings.setAttribute("viewBox", "0 0 100 100");
  strings.setAttribute("preserveAspectRatio", "none");
  BOUQUET.forEach(([x, y, s]) => {
    const line = document.createElementNS(NS, "line");
    line.setAttribute("x1", x); line.setAttribute("y1", y + s * 0.6);
    line.setAttribute("x2", 50); line.setAttribute("y2", 95);
    line.setAttribute("stroke", "rgba(91,38,80,.45)");
    line.setAttribute("stroke-width", "1.3");
    line.setAttribute("vector-effect", "non-scaling-stroke");
    strings.appendChild(line);
  });
  balloon.appendChild(strings);

  BOUQUET.forEach(([x, y, s], i) => {
    const b = document.createElement("div");
    b.className = "bq-balloon";
    b.style.setProperty("--x", x);
    b.style.setProperty("--y", y);
    b.style.setProperty("--s", s);
    b.style.setProperty("--c", BALLOON_COLORS[i % BALLOON_COLORS.length]);
    b.style.setProperty("--d", (-i * 0.31).toFixed(2) + "s");
    b.style.setProperty("--delay", (i * 0.06 + rand(0, 0.15)).toFixed(2) + "s");
    b.style.setProperty("--dur", rand(3.2, 4.6).toFixed(2) + "s");
    b.style.setProperty("--drift", ((x - 50) * 2.4 + rand(-30, 30)).toFixed(0) + "px");
    b.style.setProperty("--rot", ((x - 50) * 0.5 + rand(-10, 10)).toFixed(0) + "deg");
    const word = bouquetWords[i % bouquetWords.length] || "";
    const bodyClass = "sb-body" + (word ? "" : (i % 4 === 0 ? " has-heart" : ""));
    const label = word ? '<span class="balloon-label">' + word + "</span>" : "";
    b.innerHTML = '<div class="' + bodyClass + '" style="--w:80px">' + label + '</div><div class="sb-knot"></div><div class="bq-tail"></div>';
    balloon.appendChild(b);
  });

  // A little bow where the strings meet.
  const bow = document.createElementNS(NS, "svg");
  bow.setAttribute("class", "bq-bow");
  bow.setAttribute("viewBox", "0 0 100 100");
  bow.innerHTML =
    '<path d="M50 96 C38 88 32 100 45 101 Z" fill="#ff5aa5" stroke="#5b2650" stroke-width="1"/>' +
    '<path d="M50 96 C62 88 68 100 55 101 Z" fill="#ff5aa5" stroke="#5b2650" stroke-width="1"/>' +
    '<circle cx="50" cy="97" r="2.4" fill="#ffd166" stroke="#5b2650" stroke-width="1"/>' +
    '<path d="M48.5 99 L44 107 M51.5 99 L56 107" stroke="#5b2650" stroke-width="1" stroke-linecap="round" fill="none"/>';
  balloon.appendChild(bow);
}
buildBouquet();

function releaseBalloons() {
  if (balloonsReleased) return;
  balloonsReleased = true;
  balloon.classList.add("released");
  popBtn.classList.add("vanish");
  setTimeout(() => { popBtn.hidden = true; }, 450);
  // The sweet background track begins right here — its arrival IS the sound
  // of this moment, so no separate release sfx is needed.
  playSweetMusic();
  balloonFlood(44);
  burstHearts(10);
  launchConfetti(90);
  setTimeout(() => {
    greeting.hidden = false;
    toGiftBtn.hidden = false;
  }, 1300);
  // Once the bouquet has flown off, fold its space away so the greeting sits nicely.
  setTimeout(() => balloon.classList.add("gone"), 3400);
}

balloon.addEventListener("click", releaseBalloons);
balloon.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); releaseBalloons(); } });
popBtn.addEventListener("click", releaseBalloons);

toGiftBtn.addEventListener("click", () => {
  showScreen("screen-gift");
});

/* ============================================================
   SCREEN 2 — Gift box
   ============================================================ */
const gift = $("gift");
const openGiftBtn = $("open-gift-btn");
let giftOpened = false;

function openGift() {
  if (giftOpened) return;
  giftOpened = true;
  gift.classList.add("opening");
  playSfx(sfxPopper);
  // Emit sparkles from the box center
  const rect = gift.getBoundingClientRect();
  launchConfetti(80, rect.left + rect.width / 2);
  setTimeout(() => {
    showScreen("screen-slideshow");
    initSlideshow();
  }, 900);
}

gift.addEventListener("click", openGift);
gift.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openGift(); } });
openGiftBtn.addEventListener("click", openGift);

/* ============================================================
   SCREEN 3 — Slideshow
   ============================================================ */
const slidePhoto = $("slide-photo");
const slideFallback = document.querySelector(".slide-photo-fallback");
const slideCaption = $("slide-caption");
const slideCounter = $("slide-counter");
const slideDots = $("slide-dots");
const slideCard = $("slide-card");
const prevBtn = $("prev-btn");
const nextBtn = $("next-btn");
const musicToggle = $("music-toggle");
const musicIcon = $("music-icon");
const musicLabel = $("music-label");
const toCandleBtn = $("to-candle-btn");

let currentSlide = 0;
let slideTimer = null;
let userInteracted = false;
let musicPlaying = false;

function initSlideshow() {
  sweet.pause();
  buildDots();
  showSlide(0, true);
  tryStartMusic();
}

function buildDots() {
  slideDots.innerHTML = "";
  CONFIG.slides.forEach((_, i) => {
    const d = document.createElement("span");
    d.className = "dot" + (i === 0 ? " active" : "");
    d.addEventListener("click", () => { userInteracted = true; showSlide(i); });
    slideDots.appendChild(d);
  });
}

function showSlide(index, instant = false) {
  if (index < 0 || index >= CONFIG.slides.length) return;
  currentSlide = index;
  const slide = CONFIG.slides[index];

  // Flip transition
  if (!instant && !reduceMotion) {
    slideCard.classList.add("flip-out");
    setTimeout(() => {
      renderSlide(slide);
      slideCard.classList.remove("flip-out");
    }, 300);
  } else {
    renderSlide(slide);
  }

  // Counter
  slideCounter.textContent = `${index + 1} / ${CONFIG.slides.length}`;

  // Dots
  [...slideDots.children].forEach((d, i) => d.classList.toggle("active", i === index));

  // Nav button states
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === CONFIG.slides.length - 1;

  // Reset timer (only auto-advance if user hasn't interacted OR always continue)
  resetSlideTimer();

  // Show "continue" button on last slide
  if (index === CONFIG.slides.length - 1) {
    setTimeout(() => { toCandleBtn.hidden = false; }, 800);
  } else {
    toCandleBtn.hidden = true;
  }
}

function renderSlide(slide) {
  slideCaption.classList.remove("show");
  slidePhoto.style.opacity = 0;
  slidePhoto.onerror = () => {
    slidePhoto.hidden = true;
    slideFallback.hidden = false;
    // Photo missing/misnamed? The message must still appear on every slide.
    setTimeout(() => slideCaption.classList.add("show"), 200);
  };
  slidePhoto.onload = () => {
    slidePhoto.hidden = false;
    slideFallback.hidden = true;
    slidePhoto.style.opacity = 1;
    setTimeout(() => slideCaption.classList.add("show"), 200);
  };
  slidePhoto.src = slide.photo;
  slideCaption.textContent = slide.caption;
  // If image is cached, onload may not fire
  if (slidePhoto.complete && slidePhoto.naturalWidth) {
    slidePhoto.onload();
  }
}

function resetSlideTimer() {
  if (slideTimer) clearTimeout(slideTimer);
  slideTimer = setTimeout(() => {
    if (currentSlide < CONFIG.slides.length - 1) {
      showSlide(currentSlide + 1);
    }
  }, CONFIG.slideDuration);
}

prevBtn.addEventListener("click", () => {
  userInteracted = true;
  if (currentSlide > 0) showSlide(currentSlide - 1);
});
nextBtn.addEventListener("click", () => {
  userInteracted = true;
  if (currentSlide < CONFIG.slides.length - 1) showSlide(currentSlide + 1);
});

toCandleBtn.addEventListener("click", () => {
  // Hand off from "your song" back to the sweet ambient track as we leave
  // the slideshow.
  audioSlideshow.pause();
  audioSlideshow.currentTime = 0;
  musicPlaying = false;
  updateMusicButton(false);
  playSweetMusic();
  showScreen("screen-candle");
});

/* ---- Music ---- */
function tryStartMusic() {
  activeTrack = "their";
  audioSlideshow.play().then(() => {
    musicPlaying = true;
    updateMusicButton(true);
  }).catch(() => {
    // Autoplay blocked — show tap-to-play
    updateMusicButton(false);
  });
}

function updateMusicButton(playing) {
  if (playing) {
    musicToggle.classList.add("playing");
    musicIcon.textContent = "🔊";
    musicLabel.textContent = "Music on 🎵";
  } else {
    musicToggle.classList.remove("playing");
    musicIcon.textContent = "🔇";
    musicLabel.textContent = "Tap to play music 🎵";
  }
}

musicToggle.addEventListener("click", () => {
  if (musicPlaying) {
    audioSlideshow.pause();
    musicPlaying = false;
    updateMusicButton(false);
  } else {
    audioSlideshow.play().then(() => {
      musicPlaying = true;
      updateMusicButton(true);
    }).catch(() => updateMusicButton(false));
  }
});

/* ============================================================
   SCREEN 4 — Candle
   ============================================================ */
const candle = $("candle");
const flame = $("flame");
const smoke = $("smoke");
const blowBtn = $("blow-btn");
const wishBlock = $("wish-block");
const wishMessage = $("wish-message");
const toPartyBtn = $("to-party-btn");
let candleBlown = false;

function blowCandle() {
  if (candleBlown) return;
  candleBlown = true;
  // Only the flame goes out — the candle and the cake stay right where they are.
  flame.classList.add("out");
  candle.classList.add("blown");
  // The "make a wish" prompt and BLOW ME have done their job: fold them away.
  wishBlock.classList.add("gone");
  setTimeout(() => { wishBlock.hidden = true; }, 850);
  smoke.hidden = false;
  smoke.classList.add("rising");
  setTimeout(() => { smoke.hidden = true; smoke.classList.remove("rising"); }, 1800);

  // Hand off from the sweet ambient track to the birthday song. The birthday
  // track is optional (see CONFIG.birthdayMusic) — if it isn't there or
  // can't play, the sweet track (already playing since we left the
  // slideshow) simply continues rather than cutting to silence.
  audioBirthday.currentTime = 0;
  audioBirthday.play().then(() => {
    sweet.stop();
    activeTrack = "birthday";
  }).catch(() => {
    activeTrack = "sweet";
    sweet.play();
  });

  // Confetti + sound
  launchConfetti(160);
  playSfx(sfxCandle);

  // Reveal wish message
  setTimeout(() => {
    wishMessage.hidden = false;
    toPartyBtn.hidden = false;
  }, 800);
}

candle.addEventListener("click", blowCandle);
candle.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); blowCandle(); } });
blowBtn.addEventListener("click", blowCandle);

toPartyBtn.addEventListener("click", () => {
  showScreen("screen-party");
});

/* ============================================================
   SCREEN 5 — Party To Banti Hai
   ============================================================ */
const yesBtn = $("yes-btn");
const noBtn = $("no-btn");
const noPopup = $("no-popup");
const partyTitle = $("party-title");

const noMessages = [
  "Pleaseeee 🥺",
  "Please, please, please! ❤️",
  "Are you really saying NO? 😭",
  "Ek baar YES toh kar do! 😂",
  "No button is feeling shy 🙈",
  "Aww, try again? 🥹",
  "Ye galat hai! 😜",
  "Dil se YES bolo! ❤️"
];
let noPopupTimer = null;

function moveNoButton() {
  const pad = 20;
  const btnRect = noBtn.getBoundingClientRect();
  const maxX = window.innerWidth - btnRect.width - pad;
  const maxY = window.innerHeight - btnRect.height - pad;
  const newX = Math.random() * (maxX - pad) + pad;
  const newY = Math.random() * (maxY - pad) + pad;
  noBtn.style.position = "fixed";
  noBtn.style.left = newX + "px";
  noBtn.style.top = newY + "px";
  noBtn.style.zIndex = 65;
}

function showNoPopup() {
  const msg = noMessages[Math.floor(Math.random() * noMessages.length)];
  noPopup.textContent = msg;
  noPopup.hidden = false;
  // force reflow then show
  void noPopup.offsetWidth;
  noPopup.classList.add("show");
  if (noPopupTimer) clearTimeout(noPopupTimer);
  noPopupTimer = setTimeout(() => {
    noPopup.classList.remove("show");
    setTimeout(() => { noPopup.hidden = true; }, 300);
  }, 1400);
}

noBtn.addEventListener("mouseenter", () => { moveNoButton(); showNoPopup(); });
noBtn.addEventListener("mouseover", () => { moveNoButton(); });
// Mobile: move on touchstart so tap can't register
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveNoButton();
  showNoPopup();
}, { passive: false });
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  moveNoButton();
  showNoPopup();
});

yesBtn.addEventListener("click", () => {
  launchConfetti(220);
  playSfx(sfxPopper);
  sendConfirmationEmail();
  setTimeout(() => showScreen("screen-thanks"), 600);
});

/* ============================================================
   Email confirmation via EmailJS
   ============================================================ */
async function sendConfirmationEmail() {
  if (!CONFIG.email.enabled) return;

  try {
    if (typeof emailjs === "undefined") {
      await loadScript("https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js");
    }

    emailjs.init({ publicKey: CONFIG.email.publicKey });

    const params = {
      to_email: "anujkumr08112022@gmail.com",
      subject: "Birthday Confirmation",
      message: "She clicked YES! The birthday party is confirmed! 🥳❤️",
      response: "YES",
      date_time: new Date().toLocaleString()
    };

    await emailjs.send(
      CONFIG.email.serviceID,
      CONFIG.email.templateID,
      params
    );

    console.log("Confirmation email sent successfully.");
  } catch (err) {
    console.error("Failed to send confirmation email:", err);
  }
}
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

/* ============================================================
   SCREEN 6 — Thank you / restart
   ============================================================ */
$("restart-btn").addEventListener("click", () => {
  // Reset all state
  stopAllMusic();
  balloonsReleased = false;
  giftOpened = false;
  candleBlown = false;
  currentSlide = 0;
  userInteracted = false;
  balloon.classList.remove("released", "gone");
  buildBouquet();
  popBtn.hidden = false;
  popBtn.classList.remove("vanish");
  gift.classList.remove("opening");
  flame.classList.remove("out");
  candle.classList.remove("blown");
  wishBlock.hidden = false;
  wishBlock.classList.remove("gone");
  wishMessage.hidden = true;
  toPartyBtn.hidden = true;
  toCandleBtn.hidden = true;
  greeting.hidden = true;
  toGiftBtn.hidden = true;
  noBtn.style.position = "";
  noBtn.style.left = "";
  noBtn.style.top = "";
  $("email-status").hidden = true;
  showScreen("screen-balloon");
});

/* ============================================================
   Prevent accidental double-trigger of audio
   ============================================================ */
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    sweet.pause();
    audioSlideshow.pause();
    audioBirthday.pause();
  } else if (activeTrack === "sweet") {
    sweet.play();
  } else if (activeTrack === "their" && musicPlaying) {
    audioSlideshow.play().catch(() => {});
  } else if (activeTrack === "birthday" && !audioBirthday.ended) {
    audioBirthday.play().catch(() => {});
  }
});

/* ============================================================
   Optional cartoon stickers (CONFIG.stickers) floating around the page
   ============================================================ */
(function buildStickers() {
  const layer = $("stickers-layer");
  const spots = [
    { left: "2%", top: "12%" }, { right: "2%", top: "22%" },
    { left: "3%", bottom: "28%" }, { right: "3%", bottom: "24%" },
    { left: "14%", top: "5%" }, { right: "14%", top: "6%" }
  ];
  (CONFIG.stickers || []).forEach((src, i) => {
    const img = new Image();
    img.className = "sticker";
    img.alt = "";
    img.src = src;
    Object.assign(img.style, spots[i % spots.length], { animationDelay: -(i * 0.7) + "s" });
    img.onerror = () => img.remove(); // wrong path? just skip it
    layer.appendChild(img);
  });
})();
