# DRFT

**A personal drum & bass radio with a pixel-art racing visualizer, built as a single HTML file.**

DRFT turns the browser into a late-night radio station: live drum & bass stations, your own WAV library, or tracks composed on the fly. Behind the music, low-resolution pixel scenes loop forever and react to the bass.

> Private project, for personal use.

## What it does

- **Live radio.** Picks a random live drum & bass station from a hand-checked list (Brokenbeats, DNB FM, Record Liquid Funk, Kool FM, Bassdrive, Jungle Planet and more), topped up with stations found in real time in the public [Radio Browser](https://www.radio-browser.info) directory. Skip to land on another station at random.
- **WAV library.** Import files or a whole folder (WAV, AIFF, FLAC, MP3, OGG, M4A). Tracks play back-to-back with no gaps and adjustable crossfades (0, 2, 4 or 8 s). The library is stored in the browser and never uploaded.
- **Generated radio.** Five styles composed in real time: Retro Racer, Liquid, Jungle, Neurofunk, Atmospheric, plus a Mix. The heart saves a generated track so it can be replayed exactly.
- **Visuals.** Six scenes (highway, mountain pass, ring road, top-down circuit, tunnel, and a garage that shows your own car shots) and eight moods that fade into each other: neon night, rain, storm, dawn, sunset, redline, dust, snow.
- **Echo-out pause.** The music echoes out instead of cutting. Files resume exactly where they stopped; live radio comes back on air.
- **Smooth by design.** Audio runs independently of the visuals, and the pixel size adapts automatically if rendering gets heavy.

## Run it

Open `index.html` in Chrome, Edge, Firefox or Safari. That's it: no build step, no dependencies.

If the browser blocks something when the file is opened directly, serve the folder locally instead:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Controls

| Key | Action |
|---|---|
| Space | Play / pause |
| N or → | Next track or station |
| ← | Previous track |
| 1 to 8 | Stations (1 = my library, 2 = live radio) |
| L | Favorite |
| V | Next scene |
| P | Next mood |
| F | Fullscreen |
| M | Menu |
| ↑ ↓ | Volume |

The volume bars can be dragged: press and slide. Everything else lives in the menu (Music, Visuals, Settings).

## Live radio notes

- Only `https` streams are used.
- When a station allows it (most do), the visuals react to the real audio. Otherwise the stream plays as is and the visuals follow a simulated 174 BPM pulse.
- Offline stations are skipped automatically.
- Stations are third-party broadcasts: DRFT only plays their public streams. It never records, stores or rebroadcasts them.

## Music files

Keep WAVs out of the repository. GitHub rejects files over 100 MB, and the app already keeps your library in the browser.

## Under the hood

- Web Audio API: synthesis, compression, reverb, crossfades, echo-out pause, live analysis.
- Canvas 2D rendered at low resolution and scaled up without smoothing, with 4×4 ordered dithering.
- IndexedDB for the music library and car images, localStorage for settings and favorites.
