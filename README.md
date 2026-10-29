# DRFT

**An endless drum & bass radio with a pixel-art racing visualizer, built as a single HTML file.**

DRFT turns your browser into a late-night radio station. Tune into real drum & bass stations broadcasting live, play your own WAV files, or let it compose tracks on the fly. Behind the music, low-resolution pixel scenes loop forever and react to the bass.

**Live radio.** One tap picks a random station from a hand-checked list of live drum & bass radios (Brokenbeats, DNB FM, Record Liquid Funk, Kool FM, Bassdrive, Jungle Planet and more), topped up with stations found in real time in the public [Radio Browser](https://www.radio-browser.info) directory. Real DJs and real rotations, nothing to upload. Skip to land on another station at random.

**Your music, in WAV.** Load WAV, AIFF, FLAC or MP3 files, or a whole folder. They play back-to-back with no gaps and smooth crossfades, because the next track is decoded in advance. Your library is saved in the browser and never uploaded anywhere.

**Generated radio.** No files, no connection? DRFT composes drum & bass in real time across five stations: Retro Racer, Liquid, Jungle, Neurofunk and Atmospheric. Any track you like can be saved and replayed exactly.

**Visuals.** A car on a neon highway, drifting through a mountain pass, cruising past a city skyline, lapping a circuit seen from above, or racing through a tunnel. You can also drop in your own car screenshots. The weather changes on its own and the colors fade from one mood to the next: rain turns the screen grey, storms flash lightning on the kicks, sunsets glow pink, snow drifts down.

**Echo-out pause.** Pause doesn't cut the sound: the music echoes out and dissolves into a tail before going quiet. Files resume exactly where they stopped; live radio comes back on air.

No build step, no dependencies, no server. Open `index.html` or host it on GitHub Pages.

## Keyboard shortcuts

| Key | Action |
|---|---|
| Space | Play / pause |
| N or → | Next track or station |
| ← | Previous track |
| 1 to 8 | Stations (2 = live radio) |
| L | Favorite |
| V | Next scene |
| P | Next mood |
| F | Fullscreen |
| M | Menu |
| ↑ ↓ | Volume |

The volume bars can be dragged: press and slide.

## Host it on GitHub Pages

In the repository, go to **Settings › Pages**, set **Source** to **Deploy from a branch**, pick `main` and `/ (root)`. The site goes live at `https://<your-username>.github.io/drft/`.

Live radio needs the hosted version (or any `https` page): some previews block outside audio streams.

## Live radio notes

- Only `https` streams are used, so they play on a secure page.
- When a station allows it (most do), the visuals react to the real audio. Otherwise DRFT plays the stream as is and the visuals follow a simulated 174 BPM pulse.
- If a station is offline, DRFT moves on to another one automatically.
- Stations are third-party broadcasts. DRFT only plays their public streams and never records or rebroadcasts them.

## Copyright

Don't commit commercial tracks to the repository: a public repo would let anyone download them. Every visitor imports their own files, and those files stay on their device.

## Under the hood

Web Audio API for synthesis, compression, reverb, crossfades and the echo-out pause. Canvas 2D rendered at low resolution and scaled up without smoothing, with 4×4 ordered dithering. IndexedDB for the music library.
