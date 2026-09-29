# Interactive Birthday Surprise Website

A beautiful, romantic, fully animated birthday surprise built with HTML, CSS, and
vanilla JavaScript — balloon → gift → photo slideshow → candle wish → "party to
banti hai?" → thank you.

Runs out of the box with placeholder photos and the audio you provided. Everything
you'd want to personalize lives in one place: the `CONFIG` object at the top of
`script.js`.

## File Structure

```
birthday-surprise/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── images/
    │   ├── photo1.jpg   ← placeholder, replace with your own
    │   ├── photo2.jpg   ← placeholder, replace with your own
    │   ├── photo3.jpg   ← placeholder, replace with your own
    │   ├── photo4.jpg   ← placeholder, replace with your own
    │   └── photo5.jpg   ← placeholder, replace with your own
    ├── stickers/
    │   └── README.txt   ← put your own cartoon PNGs here (optional, see below)
    └── audio/
        ├── slideshow-music.mp3     ← included ("your song", plays during the slideshow)
        ├── candle-blow.mp3         ← included
        ├── party-popper.mp3        ← included
        ├── balloon-pop.mp3         ← included, but unused by default (balloons float away now)
        ├── sweet-background.mp3    ← optional, not included (a soft built-in music box plays instead)
        └── happy-birthday.mp3      ← optional, not included
```

## How to Run

Open the project through a local web server (the browser blocks audio autoplay when
opening `index.html` directly via `file://`). For example:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve
```

Then open `http://localhost:8000` in your browser. To actually deploy it (so you can
send her a link), any static host works — GitHub Pages, Netlify, Vercel, Cloudflare
Pages — just upload the whole folder, `index.html` and all.

## Adding Your Photos

Five placeholder images ship in `assets/images/` so the slideshow works immediately.
To use your own:

1. Drop your photos into `assets/images/`.
2. Name them `photo1.jpg` through `photo5.jpg` — that's it, no code changes needed.
   (Different filenames or a 6th/4th photo? Edit the `photo` paths in
   `CONFIG.slides` inside `script.js` instead.)

Each photo is shown full-bleed inside a card with its message laid over the bottom
of the picture (a soft gradient keeps the text readable on any photo). The card is
4:3, so landscape or portrait photos both work — `object-fit: cover` crops to fit,
so keep faces toward the middle. Each slide's message lives right next to its photo
path in the array:

```js
{
  photo: "assets/images/photo1.jpg",
  caption: "Every moment with you feels like a celebration. 🎂"
}
```

Add, remove, or rewrite entries freely — the dots, counter, and auto-advance timing
all adapt to however many slides are in the array.

## Sound

Music works in layers that hand off to each other, and everything is wired through
`CONFIG` in `script.js` — nothing is hardcoded in `index.html`.

| Moment | What plays |
|---|---|
| First tap (balloons let go) → gift | **Sweet background music** starts and keeps going |
| Photo slideshow | Sweet music **pauses**; **your song** (`slideshow-music.mp3`) plays instead |
| Leaving the slideshow → candle → party → thank-you | Sweet music **resumes** and runs to the end |
| Candle blown (only if you add `happy-birthday.mp3`) | The birthday song takes over from the sweet music |

Sound effects: `party-popper.mp3` when the gift opens and again on YES,
`candle-blow.mp3` when the candle goes out. Releasing the balloons has no burst
sound on purpose — the sweet music starting *is* the sound of that moment.
(`balloon-pop.mp3` is still in the folder and in `CONFIG` if you want to wire it
to something else.)

| CONFIG key | File | Notes |
|---|---|---|
| `sweetBackgroundMusic` | `assets/audio/sweet-background.mp3` | **Optional.** Not included. If missing, a soft original music-box lullaby generated in the browser plays instead, so this layer works out of the box. Add your own mp3 at this path to replace it. |
| `slideshowMusic` | `assets/audio/slideshow-music.mp3` | "Your song" — plays only during the slideshow |
| `birthdayMusic` | `assets/audio/happy-birthday.mp3` | **Optional.** If missing, the sweet music just continues |
| `candleBlowSound` | `assets/audio/candle-blow.mp3` | One-shot |
| `partyPopperSound` | `assets/audio/party-popper.mp3` | One-shot |
| `balloonPopSound` | `assets/audio/balloon-pop.mp3` | Unused by default |

**Volume** is set in `CONFIG.volumes`: `music: 0.3` (30%) for all background music,
`sfx: 0.75` for the sound effects. Raise or lower either on a 0–1 scale.

Browsers won't play sound until the visitor interacts, so the music begins on the
very first tap ("LET THEM GO") — that's as early as it can start.

## Personalizing Messages

Everything is in the `CONFIG` object at the top of `script.js`:

- `herName` — her name
- `greeting` — the message shown after popping the balloon
- `slides` — array of `{ photo, caption }` for the slideshow
- `wishMessage` — the message shown after blowing the candle
- `slideDuration` — how long each slide stays on screen (default `10000` = 10s)

## Look & feel

- **Theme:** a bright cartoon sky — cotton-candy pink and blue, drifting clouds, a
  sunny sun, rolling hills, chunky outlined toys, and candy-style buttons. Fonts are
  Pacifico (titles) and Fredoka (everything else), loaded from Google Fonts. Colors
  are CSS variables at the top of `style.css` (`--pink-500`, `--sky-200`, `--ink`, …).
- **Worry balloons:** before you let them go, each balloon in the bouquet (and
  the ones that fly up with them) carries a word — "Stress", "Exams", "Anxiety"
  and so on — so releasing them means letting go of them. Edit the list in
  `CONFIG.balloonWords` at the top of `script.js`, or set it to `[]` to turn the
  words off (balloons just show hearts/plain color instead).
- **Balloons — so many:** the first screen is a bouquet of 12 balloons. Tap it (or
  the button) and they all float away while a wave of ~44 more fills the sky. A few
  balloons also keep drifting up through the background on every screen. Tune the
  colors in `BALLOON_COLORS`, the bunch in `BOUQUET`, and the size of the wave in
  `balloonFlood(44)` inside `script.js`.
- **Cartoon cast:** six original characters (cat, bear, bunny, panda, penguin,
  chick) drawn as SVG in `index.html`. They sway, hop, and peek over the photo card,
  and all line up together on the last screen. To remove one, delete its
  `<svg class="mascot …">` line; to recolor, edit the shapes inside `<defs>`.
- **Your own cartoon stickers:** the built-in cast is original artwork. If you want
  other characters, add your own transparent PNGs to `assets/stickers/` and list
  them in `CONFIG.stickers` in `script.js` — they float around every screen. Use
  only images you have the right to use.
- **Candle & cake:** the wish screen shows a candle standing on a two-tier cake
  (an SVG in `index.html`, class `cake`). When BLOW ME is pressed, the "make a wish"
  prompt and the button fold away and the birthday message appears — the candle and
  cake stay put, and only the flame goes out.
- **Screen changes:** each screen pops in with a bouncy fade and drifts out with a
  soft blur. Tune it in the `screenIn` / `screenOut` keyframes in `style.css`.

## Email Confirmation Setup (EmailJS)

When she clicks **YES**, the site tries to send a confirmation email to
`rajakmr913@gmail.com`. This uses **EmailJS** so no private credentials are
exposed in the frontend.

### Steps

1. Create a free account at **https://www.emailjs.com**.
2. Add an **Email Service** (Gmail, Outlook, etc.) and copy the **Service ID**.
3. Create an **Email Template** with these variable placeholders:
   - `{{to_email}}`
   - `{{subject}}`
   - `{{message}}`
   - `{{response}}`
   - `{{date_time}}`
4. Copy the **Template ID**.
5. Go to **Account → API Keys** and copy your **Public Key**.
6. Open `script.js` and fill in the `CONFIG.email` object:

```js
email: {
  enabled: true,
  serviceID: "your_service_id",
  templateID: "your_template_id",
  publicKey: "your_public_key"
}
```

Set `enabled: true` and the site will send the confirmation email automatically
when she clicks YES. If email sending fails or is not configured, a friendly
message is shown instead — the birthday experience still works perfectly.

> The **Public Key** is safe to include in frontend code (it is not a secret).
> Never put your EmailJS **Private Key** or email password in the frontend.
