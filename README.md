# DRFT

**A drum & bass radio inside Spotify, with a car cruising along a city bay at sunset. A Spicetify extension.**

![DRFT](spicetify/preview.png)

Install the extension and a **DRFT** button appears at the top of Spotify. Press it, press **LISTEN**: the DRFT playlist plays shuffled, in an endless loop, while a car cruises along the bay at sunset behind the music.

- **Back to Spotify:** **✕ SPOTIFY** at the top right, Esc, or the DRFT button again. The music keeps going and the radio keeps feeding the queue.
- **Play something else** in Spotify and DRFT steps aside, and your shuffle and repeat settings come back as they were. Press play in DRFT to bring the radio back.

No developer account, no Client ID, no login: DRFT uses your Spotify app as it is.

## Install

### From the Marketplace

1. Install [Spicetify](https://spicetify.app/docs/getting-started) and its [Marketplace](https://github.com/spicetify/marketplace).
2. In Spotify, open **Marketplace › Extensions**, search **DRFT**, press **Install**.

### By hand

1. Install [Spicetify](https://spicetify.app/docs/getting-started).
2. Download [`spicetify/dist/drft.js`](spicetify/dist/drft.js) and put it in Spicetify's `Extensions` folder:
   - Windows: `%appdata%\spicetify\Extensions\`
   - macOS / Linux: `~/.config/spicetify/Extensions/`
3. Run:
   ```
   spicetify config extensions drft.js
   spicetify apply
   ```

## The radio

One playlist, picked by DRFT, played by Spotify itself in shuffle and repeat: it never stops, whether DRFT is open or not, and your queue is left alone.

The playlist is the curator's choice: everyone who installs DRFT hears the same selection.

## Visuals

### Sunset (default)

A car cruising along a city bay at sunset, seen from the side, in an endless loop: a big sun between the towers, palm trees and street lights going by, the guardrail and the road rushing past. Everything is drawn live in the page, nothing is a video.

- **Film look.** Contrast-adaptive sharpening for a crisp, upscaled image, bloom and a little red halation around the lights, chromatic aberration toward the edges, an anamorphic streak across the sun, depth of field on the distant city and palms, a soft film curve, vignette and moving grain.
- **The scene.** Dense towers in several hazy layers with small lit windows, lit crowns, water towers, blinking antenna lights and a few windows switching on and off; a starry sky with twinkling stars and the odd shooting star; drifting clouds lit from below; palm trees with ringed trunks, dead fronds and coconuts that sway in the wind; dust floating in the backlight and out-of-focus specks passing in front of the lens.
- **Three cars**, each with see-through windows (driver and seats in silhouette), the horizon and passing lights reflected on the paint, brake discs and calipers behind the spokes, headlights on: a red 80s wedge supercar, a gloss-black Supra MK4 with its hoop wing, a red M3 E36 coupé. Change car with **C** or in Menu › Visuals: the old one speeds off, the new one drives in.
- **Weather.** Clear, Cloudy, Rain, Storm and Fog, with smooth transitions, each with its own colour grade so bad weather stays just as colourful: a golden hour under a violet ceiling, a neon blue and magenta rainy night with the city lit up, an electric violet storm, a pastel peach and lavender fog. In AUTO the sky changes on its own every two to four minutes. Rain falls in two layers, splashes on the road and sprays from the wheels; the wet road darkens and reflects the scenery, the lights and the car (it dries slowly once the rain stops); storms bring lightning and wind in the palms; fog swallows the city and widens every halo. Pick a sky with **W** or in Menu › Visuals.

### Abstract

Abstract motion design, a new composition every twenty seconds or so, swept in by a slanted colour band: orbits of dashed rings and arcs snapping round a quarter turn, stripes running against each other inside a big disc, a grid of shapes turning as a wave crosses it, stacked ridges under a flat sun, slow drifting gradients, Bauhaus tiles, two-ink halftone, and scrolling DRFT type. Flat print colours, on paper (risograph and poster inks) or on night ink, slightly uneven edges, paper texture, film grain at 24 frames per second, the odd speck of dust and a faint gate weave: printed, not plastic. **P** skips to the next composition.

## Controls

| Key | Action |
|---|---|
| Space | Play / pause |
| N or → | Next track |
| ← | Previous track |
| L | Favorite |
| C | Next car (Shift+C: previous) |
| W or P | Sunset: next sky (Shift: previous). Abstract: next composition |
| F | Fullscreen |
| M | Menu |
| ↑ ↓ | Volume |
| Esc | Back to Spotify |

The progress bar is a line with a playhead moving in real time: hover it to read the time, drag it to move through the track (or focus it and use ← →, 5 s steps). DRFT's volume is Spotify's volume. **OPEN ↗** on a track opens it in Spotify.

## Notes

- Spicetify modifies the Spotify desktop app, which Spotify's terms don't allow. Install it knowing that.
- Spotify updates sometimes break Spicetify for a few days; run `spicetify apply` again after an update.
- DRFT plays through the Spotify app and never calls Spotify's Web API for playback, so it isn't affected by its rate limits.

## Development

DRFT is one HTML file, [`index.html`](index.html). The extension is built from it:

```
node spicetify/build.mjs
```

- [`spicetify/config.json`](spicetify/config.json): the radio's playlist (its Spotify link).
- [`spicetify/host.js`](spicetify/host.js): runs inside DRFT in Spotify. It gives DRFT the Spotify app's session and player in place of the website's login and Web Playback SDK, and hides the website-only sources.
- [`spicetify/dist/drft.js`](spicetify/dist/drft.js): the built extension, the file the Marketplace installs. Rebuild and commit it after every change.
- [`spicetify/dev/mock.html`](spicetify/dev/mock.html): runs the extension against a fake Spicetify, outside Spotify. Serve the repository over HTTP and open `/spicetify/dev/mock.html#open`.

The Marketplace finds DRFT through the repository topic `spicetify-extensions` and [`manifest.json`](manifest.json).

### The website

`index.html` also runs on its own at [studioobsidienne.github.io/drft](https://studioobsidienne.github.io/drft/), with three sources: a DRFT FM radio built from your own playlist, one of your playlists, or your own WAV files. Its Spotify playback needs Premium and a Spotify developer app of your own (Client ID pasted in the menu, redirect URI `https://studioobsidienne.github.io/drft/`).
