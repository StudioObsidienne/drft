/* Construit l'extension Spicetify à partir de index.html : node spicetify/build.mjs
   Sortie : spicetify/dist/drft.js, le fichier que le Marketplace installe (ou à copier dans Extensions). */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const dist = join(here, 'dist');

// la playlist de la radio : son lien ou son identifiant
const config = JSON.parse(readFileSync(join(here, 'config.json'), 'utf8'));
const pl = String(config.playlist || '').trim();
const playlist = (pl.match(/playlist[/:]([A-Za-z0-9]{22})/) || pl.match(/^([A-Za-z0-9]{22})$/) || [])[1] || '';
if (!playlist) console.warn('! spicetify/config.json: no playlist set, the radio will have nothing to play');

let html = readFileSync(join(root, 'index.html'), 'utf8').replace(/\r\n/g, '\n');
const host = readFileSync(join(here, 'host.js'), 'utf8').replace('__DRFT_PLAYLIST__', playlist);

// l'adaptateur passe avant le script de DRFT, qui lit window.DRFT_HOST au démarrage
const anchor = '<script>\n(() => {';
const at = html.indexOf(anchor);
if (at < 0) throw new Error('index.html: script principal introuvable');
html = html.slice(0, at) + '<script>\n' + host + '</script>\n' + html.slice(at);

const icon = '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M2 3h7l3 3v4l-3 3H2zm2 2v6h4l2-2V7L8 5z"/><path d="M13 3h1v10h-1z"/></svg>';

const ext = `/* DRFT pour Spicetify : fichier généré par spicetify/build.mjs depuis index.html, ne pas modifier à la main */
(function drft() {
  var S = window.Spicetify;
  if (!S || !S.Player || !S.Platform || !(S.Topbar || S.Playbar)) { setTimeout(drft, 300); return; }

  var HTML = ${JSON.stringify(html)};
  var ICON = ${JSON.stringify(icon)};

  /* DRFT s'affiche par-dessus Spotify, dans une iframe de même origine (son CSS et ses raccourcis restent chez elle).
     Refermée, l'iframe reste chargée : la radio continue de remplir la file de Spotify. */
  var layer = null, frame = null;
  function show() {
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'drft-layer';
      layer.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:#05030f';
      frame = document.createElement('iframe');
      frame.title = 'DRFT'; frame.allow = 'autoplay; fullscreen';
      frame.style.cssText = 'width:100%;height:100%;border:0;display:block';
      frame.srcdoc = HTML;
      layer.appendChild(frame);
      document.body.appendChild(layer);
    }
    layer.style.display = 'block';
    setTimeout(function () { try { frame.focus(); } catch (e) {} }, 50);
  }
  function hide() { if (layer) layer.style.display = 'none'; }
  window.DRFT_EXT = { show: show, hide: hide, toggle: function () { layer && layer.style.display !== 'none' ? hide() : show(); } };

  if (S.Topbar && S.Topbar.Button) new S.Topbar.Button('DRFT radio', ICON, show);
  else new S.Playbar.Button('DRFT radio', ICON, show);
})();
`;

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
writeFileSync(join(dist, 'drft.js'), ext);
console.log('DRFT Spicetify extension: ' + join(dist, 'drft.js') + ' (' + Math.round(ext.length / 1024) + ' KB)' + (playlist ? ', playlist ' + playlist : ''));
