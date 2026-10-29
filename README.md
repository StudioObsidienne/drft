# DRFT

**Drum & bass for night drives, with a pixel-art Tokyo night visualizer. One HTML file.**

**▶ Live at [studioobsidienne.github.io/drft](https://studioobsidienne.github.io/drft/)**

DRFT plays real music from real artists, and nothing else: your own Spotify account, or your own WAV files. Hit play and let it run. Behind the music, dithered pixel scenes inspired by Tokyo street racing loop forever and move with the beat.

## Two sources

- **Spotify** (スポティファイ): DRFT becomes a Spotify player named “DRFT” on your account (Premium required). Three ways to feed it:
  - **DRFT Mix**: an endless mix grown from the artists you choose (TURQUOISEDEATH by default). One track from those artists, then two from the same world: atmospheric jungle, dreamy DnB, liquid, and the 90s references (LTJ Bukem, Photek, PFM, Source Direct, Seba, Blu Mar Ten…). Tracks heard recently are held back, and the queue refills itself before it runs out.
  - **Liked songs**, shuffled.
  - **One of your playlists**, shuffled.
- **My library** (ライブラリ): your own WAV, AIFF, FLAC or MP3 files, or a whole folder. Gapless playback, adjustable crossfade, stored in your browser and never uploaded.

The **Digging** list in the menu collects classics and deep cuts: ▶ plays one on Spotify, BC and BP find the WAV on Bandcamp or Beatport.

## Connecting Spotify (once)

Spotify only lets a site play music through an app registered by its owner, so you create a free one in two minutes:

1. Open the [Spotify developer dashboard](https://developer.spotify.com/dashboard), log in, press **Create app**.
2. Any name and description. **Redirect URI**: `https://studioobsidienne.github.io/drft/` (exactly, with the final slash). Press Add.
3. Under “Which API/SDKs are you planning to use?” tick **Web API** and **Web Playback SDK**, accept the terms, Save.
4. In the app's settings, copy the **Client ID**. In DRFT: Menu › Music › paste it › **CONNECT**, then accept on the Spotify page.

If Spotify answers that the user isn't registered, open the app › **User Management** and add the email of your Spotify account.

The login uses PKCE: there is no secret and no server. The token stays in your browser and only talks to Spotify. **Disconnect** in the menu forgets it.

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

With your WAVs the visuals react to the real audio (bass, mids, highs). Spotify's audio is protected and can't be analysed, so with Spotify they follow a 172 BPM breakbeat grid locked to the track's position, with an intro, a breakdown every 32 bars and an outro.

## Controls

| Key | Action |
|---|---|
| Space | Play / pause |
| N or → | Next track |
| ← | Previous track |
| 1 / 2 | Spotify / My library |
| L | Favorite (Spotify tracks) |
| V | Next scene |
| P | Next mood |
| F | Fullscreen |
| M | Menu |
| ↑ ↓ | Volume |

The volume bars can be dragged. Pause fades the sound out instead of cutting it; play brings it back where it stopped.

## Notes

- Spotify playback works in desktop Chrome, Edge and Firefox. Some ad blockers block Spotify's player script; allow it for this site if the player doesn't start.
- Spotify plays on one device at a time: starting music on your phone moves it away from DRFT, and DRFT shows it.
- Don't commit music files to the repository. GitHub rejects files over 100 MB, and the library already lives in your browser.

## Under the hood

Spotify Web Playback SDK and Web API (PKCE login, queue topped up through the API), Web Audio API for the library (analysis, crossfades, pause filter), Canvas 2D rendered at low resolution with 4×4 ordered dithering, IndexedDB for the library. Type: Dela Gothic One, Chakra Petch, Zen Kaku Gothic New.
