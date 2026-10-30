# DRFT

**A drum & bass radio inside Spotify, with a pixel-art Tokyo night drive. A Spicetify extension.**

![DRFT](spicetify/preview.png)

Install the extension and a **DRFT** button appears at the top of Spotify. Press it, press **LISTEN**: the DRFT playlist plays shuffled, in an endless loop, while a night drive in pixel art goes on behind the music. Close DRFT and the music keeps going in Spotify; the radio keeps feeding the queue.

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

One playlist, picked by DRFT, played shuffled and looping:

- never a track heard recently;
- never the same artist twice in four tracks;
- when the queue runs low, DRFT adds the next tracks on its own.

The playlist is the curator's choice: everyone who installs DRFT hears the same selection.

## Visuals

One endless night drive, seen from the driver's seat of a tuned race car, in dithered pixel art: the dark cockpit, the digital dash with the big gear number, shift lights and lap timer, the wheel and its lit buttons turning with the road, the wiper, the mirror.

- **The road never repeats.** It is generated as you drive and moves through expressway (sodium lamps, gantry signs, traffic to overtake), tunnels, mountain pass (hairpins, guardrails, cedars, a vending machine glowing at a pull-out), city (neon signs, crossings), suspension bridge over the bay and coast road. Curves, hills, speed and gear changes follow the road.
- **Weather.** Rain streaks toward the windshield and the drops climb up the glass as they would at speed, the wiper sweeps them away; snow, fog with headlight beams, storms with lightning. Moods change slowly on their own (Night, Rain, Fog, Sodium, Dawn, Snow, Storm), with calm, unified palettes; only real lights keep their colour.
- **Traffic and driving.** Cars and trucks to overtake, blinkers when they change lanes, headlights in the mirror; the car never touches anyone. The driver's eyes follow the corners, the view widens and lights streak as speed builds, an ETC toll now and then, the dazzle when leaving a tunnel, bridges over the city, the sun rising in the Dawn mood.
- **Every new track:** the driver looks back over his shoulder, a Japanese police car is far behind, red lights turning. He turns back and floors it, and the red glow fades in the cabin.

## Controls

| Key | Action |
|---|---|
| Space | Play / pause |
| N or → | Next track |
| ← | Previous track |
| L | Favorite |
| P | Next mood |
| F | Fullscreen |
| M | Menu |
| ↑ ↓ | Volume |
| Esc | Back to Spotify |

The progress bar is a line with a playhead moving in real time: hover it to read the time, drag it to move through the track (or focus it and use ← →, 5 s steps). Pause fades the sound out instead of cutting it.

## Notes

- Spicetify modifies the Spotify desktop app, which Spotify's terms don't allow. Install it knowing that.
- Spotify updates sometimes break Spicetify for a few days; run `spicetify apply` again after an update.
- DRFT's fades move Spotify's own volume.

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
