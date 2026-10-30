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

/* l'appareil Spotify Connect de ce client, pour que la lecture reste ici */
let localDevice = '';
async function findDevice(tok) {
  try {
    const st = S.Platform.ConnectAPI.state;
    const d = (st.devices || []).find(x => x.isLocal) || (st.activeDevice && st.activeDevice.isLocal ? st.activeDevice : null);
    if (d && d.id) return (localDevice = d.id);
  } catch (e) { /* ok */ }
  try {
    const r = await fetch('https://api.spotify.com/v1/me/player/devices', { headers: { Authorization: 'Bearer ' + tok } });
    const j = await r.json();
    const list = (j && j.devices) || [];
    const d = list.find(x => x.is_active && x.type === 'Computer') || list.find(x => x.type === 'Computer');
    if (d) localDevice = d.id;
  } catch (e) { /* ok */ }
  return localDevice;
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
  return list.map(track).filter(Boolean);
}
function state() {
  const d = S.Player.data;
  const cur = d && track(d.item || d.track);
  if (!cur) return null;
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
    const push = () => this.emit('player_state_changed', state());
    for (const ev of ['songchange', 'onplaypause']) { S.Player.addEventListener(ev, push); this.hooks.push([ev, push]); }
    // l'avancement n'émet rien : on resynchronise la position de temps en temps, comme le SDK
    this.timer = setInterval(push, 1000);
    const dev = await findDevice(await window.DRFT_HOST.token().catch(() => ''));
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

/* le plugin : pas de choix de source, pas de connexion, pas de WAV */
const css = document.createElement('style');
css.textContent = '#stations,#spBox,.pane[data-pane=music]>.acts,#dLib,#btnStartImport{display:none!important}';
document.head.appendChild(css);

/* refermer DRFT ramène à Spotify ; la musique et la radio continuent derrière */
const ext = () => window.parent.DRFT_EXT;
const close = document.createElement('button');
close.className = 'ib live'; close.id = 'btnHostClose'; close.type = 'button';
close.setAttribute('aria-label', 'Back to Spotify'); close.title = 'Back to Spotify (Esc)';
close.innerHTML = '<svg viewBox="0 0 16 16" data-i="close"></svg>';
close.addEventListener('click', () => { if (ext()) ext().hide(); });
const full = document.getElementById('btnFull');
if (full) full.after(close);
window.addEventListener('keydown', e => {
  const panel = document.getElementById('panel');
  if (e.key === 'Escape' && panel && panel.hidden && ext()) ext().hide();
});
})();
