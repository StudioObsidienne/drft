# DRFT

**Drum & bass for night drives, with a pixel-art Tokyo night visualizer. One HTML file.**

**▶ Live at [studioobsidienne.github.io/drft](https://studioobsidienne.github.io/drft/)**

DRFT plays real music from real artists, and nothing else: your own Spotify account, or your own WAV files. Hit play and let it run. Behind the music, a night drive in pixel art goes on forever.

## Three sources

- **Radio** (ラジオ): DRFT FM, a drum & bass station just for you, played through your Spotify (Premium required). It is built from your reference playlist (the one named **DRFT** by default, any of your playlists can be picked in the menu): half the tracks come from that playlist, half are similar tracks you may not know, other tracks by its artists, and artists Spotify files under the same styles, ranked by how many styles they share. Every track is checked (the right artist), instrumentals first, nothing heard recently, never the same artist twice in four tracks. The schedule runs with the clock, even while DRFT is closed: tune in and you land in the middle of whatever is on air. Shows change with the time of day, the next track is announced, and a short DRFT FM jingle and title card come every few tracks. Seeking, skipping or pausing takes you off air; **Back to live** rejoins the broadcast.
- **My playlist** (プレイリスト): one of your own Spotify playlists, shuffled, looping.
- **My WAVs** (ライブラリ): your own WAV, AIFF, FLAC or MP3 files, or a whole folder. Gapless playback, adjustable crossfade, stored in your browser and never uploaded.

## Connecting Spotify (once)

Spotify only lets a site play music through an app registered by its owner, so you create a free one in two minutes:

1. Open the [Spotify developer dashboard](https://developer.spotify.com/dashboard), log in, press **Create app**.
2. Any name and description. **Redirect URI**: `https://studioobsidienne.github.io/drft/` (exactly, with the final slash). Press Add.
3. Under “Which API/SDKs are you planning to use?” tick **Web API** and **Web Playback SDK**, accept the terms, Save.
4. In the app's settings, copy the **Client ID**. In DRFT: Menu › Music › paste it › **CONNECT**, then accept on the Spotify page.

If Spotify answers that the user isn't registered, open the app › **User Management** and add the email of your Spotify account.

The login uses PKCE: there is no secret and no server. The token stays in your browser and only talks to Spotify. **Disconnect** in the menu forgets it.

## Visuals

One endless night drive, seen from the driver's seat of a tuned race car, in dithered pixel art: the dark cockpit, the digital dash with the big gear number, shift lights and lap timer, the wheel and its lit buttons turning with the road, the wiper, the mirror.

- **The road never repeats.** It is generated as you drive and moves through expressway (sodium lamps, gantry signs, traffic to overtake), tunnels, mountain pass (hairpins, guardrails, cedars, a vending machine glowing at a pull-out), city (neon signs, crossings), suspension bridge over the bay and coast road. Curves, hills, speed and gear changes follow the road.
- **Weather.** Rain streaks toward the windshield and the drops climb up the glass as they would at speed, the wiper sweeps them away; snow, fog with headlight beams, storms with lightning. Moods change slowly on their own (Night, Rain, Fog, Sodium, Dawn, Snow, Storm), with calm, unified palettes; only real lights keep their colour.
- **Traffic and driving.** Cars and trucks to overtake, blinkers when they change lanes, headlights in the mirror; the car never touches anyone. The driver's eyes follow the corners, the view widens and lights streak as speed builds, an ETC toll now and then, the dazzle when leaving a tunnel, bridges over the city, the sun rising in the Dawn mood.
- **Every new track:** the driver looks back over his shoulder, a Japanese police car is far behind, red lights turning. He turns back and floors it, and the red glow fades in the cabin.

With Spotify nothing pretends to follow the beat (its audio can't be analysed); with your WAVs the speed reacts a little to the music.

## Controls

| Key | Action |
|---|---|
| Space | Play / pause |
| N or → | Next track |
| ← | Previous track |
| 1 / 2 / 3 | Radio / My playlist / My WAVs |
| L | Favorite (Spotify tracks) |
| P | Next mood |
| F | Fullscreen |
| M | Menu |
| ↑ ↓ | Volume |

The progress bar is a line with a playhead moving in real time: hover it to read the time, drag it to move through the track (or focus it and use ← →, 5 s steps). The volume bars can be dragged. Pause fades the sound out instead of cutting it; play brings it back where it stopped.

## Notes

- Spotify playback works in desktop Chrome, Edge and Firefox. Some ad blockers block Spotify's player script; allow it for this site if the player doesn't start.
- Spotify plays on one device at a time: starting music on your phone moves it away from DRFT, and DRFT shows it.
- Don't commit music files to the repository. GitHub rejects files over 100 MB, and the library already lives in your browser.

## Under the hood

Spotify Web Playback SDK and Web API (PKCE login, queue topped up through the API), Web Audio API for the library (analysis, crossfades, pause filter), Canvas 2D rendered at low resolution with 4×4 ordered dithering, IndexedDB for the library. Type: Dela Gothic One, Chakra Petch, Zen Kaku Gothic New.
