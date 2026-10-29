# DRFT

**Real drum & bass for night drives, with a pixel-art Tokyo night visualizer. One HTML file.**

**▶ Live at [studioobsidienne.github.io/drft](https://studioobsidienne.github.io/drft/)**

DRFT is a drum & bass radio that only plays real music by real artists. Pick a source, hit play, and let it run: tracks are picked at random, the next one is preloaded, and songs blend into each other with a crossfade. Behind the music, dithered pixel scenes inspired by Tokyo street racing loop forever and react to the bass.

## Three sources, all real music

- **Discover** (ディスカバー): random drum & bass tracks from real artists and labels on [Audius](https://audius.co), pulled from the platform's trending charts and searches (jungle, liquid, neurofunk). Audius streams the music through its public API; DRFT never stores it. Each track links back to its page on Audius.
- **Live radio** (ライブ): a random live drum & bass station from a hand-checked list (Brokenbeats, DNB FM, Record Liquid Funk, Kool FM, Bassdrive, Jungle Planet…), topped up with stations found in real time in the public [Radio Browser](https://www.radio-browser.info) directory.
- **My library** (ライブラリ): your own WAV, AIFF, FLAC or MP3 files, or a whole folder. Gapless playback, adjustable crossfade, stored in your browser and never uploaded.

## Visuals

Five scenes plus a garage for your own car shots. They switch on their own every track and every ~25 seconds:

| Scene | |
|---|---|
| 首都高 Shutoko | Night expressway, sodium lamps streaking past, tail lights ahead |
| 峠 Touge drift | Mountain pass seen from above, a panda-liveried car drifting, tire marks and smoke |
| 全開 Gas gas | Manga speed lines and katakana slamming on the kicks |
| 回転計 Tacho | A giant rev counter, the gearbox shifting with the bass |
| 東京 Neon Tokyo | Street canyon with vertical neon signs reflected on wet asphalt |
| 車庫 Garage | Your own car screenshots, dithered |

Nine moods fade into each other: neon night, rain, storm, dawn, sunset, redline, dust, sodium, snow.

## Controls

| Key | Action |
|---|---|
| Space | Play / pause |
| N or → | Next track or station |
| ← | Previous track |
| 1 / 2 / 3 | Discover / Live radio / My library |
| L | Favorite (Discover tracks) |
| V | Next scene |
| P | Next mood |
| F | Fullscreen |
| M | Menu |
| ↑ ↓ | Volume |

The volume bars can be dragged. Pause closes the sound like a filter and fades it out instead of cutting it; play brings it back where it stopped.

## Notes

- Discover and Live radio need the hosted site (or any `https` page): some previews block outside audio.
- Live stations and Audius tracks are third-party streams. DRFT only plays them; it never records, stores or rebroadcasts them.
- Don't commit music files to the repository. GitHub rejects files over 100 MB, and the library already lives in your browser.

## Under the hood

Web Audio API (analysis, crossfades, pause filter), two alternating media decks for gapless streaming, Canvas 2D rendered at low resolution with 4×4 ordered dithering, IndexedDB for the library. Type: Dela Gothic One, Chakra Petch, Zen Kaku Gothic New.
