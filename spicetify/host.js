/* DRFT dans Spotify (Spicetify). Ce script est injecté dans la page DRFT, qui tourne dans une iframe
   de l'extension : il remplace la connexion PKCE par la session du client Spotify et le Web Playback SDK
   par le lecteur du client lui-même. index.html n'en voit que window.DRFT_HOST et un faux window.Spotify.Player.
   Le plugin n'a qu'une source : la playlist DRFT (spicetify/config.json), mélangée en boucle. */
(() => {
'use strict';
const S = window.parent && window.parent.Spicetify;
if (!S || !S.Player) return;

const waitMs = ms => new Promise(r => setTimeout(r, ms));
const call = f => { try { return Promise.resolve(f()); } catch (e) { return Promise.reject(e); } };

/* jeton du client : il le renouvelle lui-même, on le relit à chaque appel */
function accessToken() {
  const P = S.Platform || {};
  try { if (P.Session && P.Session.accessToken) return P.Session.accessToken; } catch (e) { /* ok */ }
  try { const t = P.AuthorizationAPI && P.AuthorizationAPI.getState().token; if (t && t.accessToken) return t.accessToken; } catch (e) { /* ok */ }
  return '';
}

/* l'appareil Spotify Connect de ce client (seulement pour les appels Web API qui restent) */
let localDevice = '';
function findDevice() {
  try {
    const st = S.Platform.ConnectAPI.state;
    const d = (st.devices || []).find(x => x.isLocal) || (st.activeDevice && st.activeDevice.isLocal ? st.activeDevice : null);
    if (d && d.id) localDevice = d.id;
  } catch (e) { /* ok */ }
  return localDevice;
}

/* La radio, c'est la playlist DRFT jouée par Spotify lui-même, en aléatoire et en boucle (répétition de la playlist) :
   Spotify enchaîne tout seul, sans fin, que DRFT soit ouvert ou non.
   Tes réglages d'aléatoire et de répétition sont gardés de côté, et remis dès que tu joues autre chose. */
const radioUri = () => 'spotify:playlist:' + window.DRFT_HOST.playlist;
let saved = null;
async function playRadio(first) {
  if (!saved) { try { saved = { shuffle: S.Player.getShuffle(), repeat: S.Player.getRepeat() }; } catch (e) { saved = null; } }
  try { S.Player.setShuffle(true); } catch (e) { /* ok */ }
  const ctx = { uri: radioUri() }, opts = first ? { skipTo: { uri: first } } : {};
  if (S.Platform.PlayerAPI && S.Platform.PlayerAPI.play) await S.Platform.PlayerAPI.play(ctx, {}, opts);
  else await S.Player.playUri(ctx.uri, {}, opts);
  try { S.Player.setShuffle(true); S.Player.setRepeat(1); } catch (e) { /* ok */ }
}
function restoreModes() {
  if (!saved) return;
  try { S.Player.setShuffle(saved.shuffle); S.Player.setRepeat(saved.repeat); } catch (e) { /* ok */ }
  saved = null;
}

/* Le jeton du client est très vite limité sur la Web API : lecture, file et profil passent par le client.
   Renvoie undefined pour laisser DRFT appeler la Web API. */
async function api(method, path, body) {
  const [route, query] = path.split('?');
  const q = new URLSearchParams(query || '');
  if (method === 'PUT' && route === '/me/player/play' && body && body.uris && body.uris.length) {
    await playRadio(body.uris[0]);
    if (body.position_ms > 0) setTimeout(() => S.Player.seek(body.position_ms), 400);
    return null;
  }
  // la playlist tourne déjà en boucle dans Spotify : rien à mettre dans ta file
  if (method === 'POST' && route === '/me/player/queue') return null;
  if (method === 'GET' && route === '/me') { const u = (S.Platform && S.Platform.username) || ''; return { id: u, display_name: u }; }
  if (method === 'GET' && route === '/me/playlists') return { items: [], next: null };
  return undefined;
}

/* morceaux de la playlist DRFT, lus par le client (aucune limite d'appels) ; null : DRFT passera par la Web API */
async function playlistItems(id, trackItem) {
  try {
    const r = await S.Platform.PlaylistAPI.getContents('spotify:playlist:' + id, { limit: 5000 });
    const items = ((r && r.items) || []).filter(t => t && /^spotify:track:/.test(t.uri) && t.isPlayable !== false);
    if (!items.length) return null;
    return items.map(t => trackItem({
      uri: t.uri, name: t.name, explicit: !!t.isExplicit,
      duration_ms: +(t.duration && t.duration.milliseconds) || 0,
      artists: (t.artists || []).map(a => ({ name: a.name, id: artistId(a.uri) }))
    }));
  } catch (e) { return null; }
}

window.DRFT_HOST = {
  name: 'spicetify',
  playlist: '__DRFT_PLAYLIST__',
  playlistItems,
  api,
  volume() { try { const v = S.Player.getVolume(); return typeof v === 'number' ? v : -1; } catch (e) { return -1; } },
  onShow: null,
  async token() {
    for (let i = 0; i < 20; i++) { const t = accessToken(); if (t) return t; await waitMs(250); }
    const e = new Error('nologin'); e.status = 401; throw e;
  },
  /* sans appareil connu, on laisse Spotify choisir l'appareil actif (ce client, en pratique) */
  path(p) { return localDevice ? p.replace(/device_id=(null|undefined)?(?=&|$)/, 'device_id=' + encodeURIComponent(localDevice)) : p.replace(/[?&]device_id=[^&]*/, m => (m[0] === '?' ? '?' : '')).replace('?&', '?'); }
};

/* état au format du Web Playback SDK, construit depuis le lecteur du client */
const artistId = uri => (String(uri || '').match(/^spotify:artist:(.+)$/) || [])[1] || '';
function track(it) {
  if (!it) return null;
  const t = it.contextTrack || it, m = t.metadata || {};
  if (!t.uri || !/^spotify:(track|episode|local):/.test(t.uri)) return null;
  let artists = Array.isArray(t.artists) ? t.artists.map(a => ({ name: a.name, uri: a.uri, id: artistId(a.uri) })) : [];
  if (!artists.length) for (let i = 0; i < 10; i++) {
    const k = i ? ':' + i : '', n = m['artist_name' + k];
    if (!n) break;
    artists.push({ name: n, uri: m['artist_uri' + k] || '', id: artistId(m['artist_uri' + k]) });
  }
  const img = (t.images && t.images[0] && t.images[0].url) || m.image_xlarge_url || m.image_large_url || m.image_url || '';
  return {
    uri: t.uri, id: t.uri.split(':').pop(), name: t.name || m.title || '', artists,
    album: { name: (t.album && t.album.name) || m.album_title || '', images: img ? [{ url: img }] : [] },
    duration_ms: +(t.duration && t.duration.milliseconds) || +m.duration || 0
  };
}
function queueOf(key, alt) {
  const d = S.Player.data || {}, q = S.Queue || {};
  const list = d[key] || q[alt] || [];
  // la lecture automatique de Spotify n'est pas la file de DRFT : sans elle, DRFT voit la fin de sa liste et la relance
  return list.filter(it => !it || it.provider !== 'autoplay').map(track).filter(Boolean);
}
/* tant que Spotify joue la playlist DRFT, c'est la radio ; un autre contexte (album, playlist, artiste…)
   veut dire que tu as lancé autre chose. Sans contexte connu, on considère que c'est la radio. */
function contextUri(d) { return (d.context && d.context.uri) || d.context_uri || ''; }
function foreign() { const d = S.Player.data, c = d && contextUri(d); return !!c && c.indexOf(window.DRFT_HOST.playlist) < 0; }
function state() {
  const d = S.Player.data;
  const cur = d && track(d.item || d.track);
  // pour DRFT c'est comme si la lecture était partie ailleurs : il s'efface au lieu de reprendre la main
  if (!cur || foreign()) return null;
  return {
    paused: !S.Player.isPlaying(),
    position: Math.max(0, S.Player.getProgress() || 0),
    duration: S.Player.getDuration() || cur.duration_ms,
    track_window: { current_track: cur, next_tracks: queueOf('nextItems', 'nextTracks'), previous_tracks: queueOf('previousItems', 'prevTracks') }
  };
}

/* faux Spotify.Player : même interface que le SDK, branché sur Spicetify.Player */
class Player {
  constructor() { this.ls = {}; this.hooks = []; this.timer = 0; }
  addListener(ev, fn) { (this.ls[ev] = this.ls[ev] || []).push(fn); return true; }
  removeListener(ev, fn) { this.ls[ev] = fn ? (this.ls[ev] || []).filter(f => f !== fn) : []; return true; }
  emit(ev, arg) { for (const f of this.ls[ev] || []) { try { f(arg); } catch (e) { console.warn('[drft]', e); } } }
  async connect() {
    let ours = false;
    const push = () => {
      const st = state();
      if (st) ours = true;
      else if (ours && foreign()) { ours = false; restoreModes(); }
      this.emit('player_state_changed', st);
    };
    for (const ev of ['songchange', 'onplaypause']) { S.Player.addEventListener(ev, push); this.hooks.push([ev, push]); }
    // l'avancement n'émet rien : on resynchronise la position de temps en temps, comme le SDK
    this.timer = setInterval(push, 1000);
    const dev = findDevice();
    setTimeout(() => { this.emit('ready', { device_id: dev }); push(); }, 0);
    return true;
  }
  disconnect() {
    clearInterval(this.timer);
    for (const [ev, f] of this.hooks) { try { S.Player.removeEventListener(ev, f); } catch (e) { /* ok */ } }
    this.hooks = [];
  }
  getCurrentState() { return Promise.resolve(state()); }
  getVolume() { return call(() => S.Player.getVolume()); }
  setVolume(v) { return call(() => S.Player.setVolume(Math.max(0, Math.min(1, v)))); }
  pause() { return call(() => S.Player.pause()); }
  resume() { return call(() => S.Player.play()); }
  togglePlay() { return call(() => S.Player.togglePlay()); }
  /* Spicetify lit une valeur ≤ 1 comme un pourcentage */
  seek(ms) { ms = Math.round(ms); return call(() => S.Player.seek(ms > 1 ? ms : 0)); }
  nextTrack() { return call(() => S.Player.next()); }
  previousTrack() { return call(() => S.Player.back()); }
  activateElement() { return Promise.resolve(); }
}

window.Spotify = { Player };
/* si la page DRFT est déchargée (rechargement du client…), on décroche ses écouteurs du lecteur, qui lui continue */
window.addEventListener('pagehide', () => { const sp = window.__slipstream && window.__slipstream.Sp; if (sp && sp.player && sp.player.disconnect) sp.player.disconnect(); });

/* le plugin : pas de choix de source, pas de connexion, pas de WAV ; fondu et réaction ne servent qu'aux WAV */
const css = document.createElement('style');
css.textContent = '#stations,#spBox,.pane[data-pane=music]>.acts,#dLib,#btnStartImport,.set:has(#xfadeSeg),.set:has(#reactSeg){display:none!important}'
  + '.host-r{display:flex;align-items:center;gap:6px}';
document.head.appendChild(css);
const keys = document.querySelector('.keys');
if (keys) keys.textContent = 'SPACE PLAY · N NEXT · DRAG THE BAR TO SEEK · P MOOD · F FULLSCREEN · M MENU · ESC BACK TO SPOTIFY';

/* refermer DRFT ramène à Spotify ; la musique et la radio continuent derrière */
const ext = () => window.parent.DRFT_EXT;
const back = () => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); if (ext()) ext().hide(); };
const close = document.createElement('button');
close.className = 'btn sm live'; close.id = 'btnHostClose'; close.type = 'button';
close.textContent = '✕ SPOTIFY'; close.title = 'Back to Spotify (Esc)';
close.addEventListener('click', back);
const full = document.getElementById('btnFull');
if (full) { const r = document.createElement('div'); r.className = 'host-r'; full.replaceWith(r); r.append(full, close); }
window.addEventListener('keydown', e => {
  const panel = document.getElementById('panel');
  if (e.key === 'Escape' && panel && panel.hidden && !document.fullscreenElement) back();
});

/* les liens open.spotify.com (titre en cours, favoris, historique) s'ouvrent dans Spotify, pas dans le navigateur */
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[href^="https://open.spotify.com/"]');
  if (!a || !S.Platform || !S.Platform.History) return;
  e.preventDefault();
  S.Platform.History.push(new URL(a.href).pathname);
  back();
}, true);
})();
