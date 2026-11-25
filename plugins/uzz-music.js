// 显示名：优折美音乐（uzz-music）
// MusicFree plugin generated from MyGo Music plugin; source site: m.uzz.me
/* MusicFree plugin runtime — generated from MyGo Music plugin. */
const __mfRuntime = (() => {
  const memory = new Map();

  function readStored(key) {
    try {
      if (typeof localStorage !== "undefined") {
        const raw = localStorage.getItem("mf-mygo:" + key);
        if (raw != null) return JSON.parse(raw);
      }
    } catch (e) {}
    return memory.get(key);
  }

  function writeStored(key, value) {
    memory.set(key, value);
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("mf-mygo:" + key, JSON.stringify(value));
      }
    } catch (e) {}
  }

  function userVars() {
    try {
      if (typeof env !== "undefined" && env && typeof env.getUserVariables === "function") {
        return env.getUserVariables() || {};
      }
    } catch (e) {}
    return {};
  }
  const vars = userVars();

  function setting(name) {
    if (vars[name] != null && String(vars[name]).trim() !== "") return String(vars[name]);
    if (name === "transcode") return "0";
    if (name === "ffmpegPath") return "";
    return "";
  }

  const host = {
    storage: {
      get(key) { return readStored(String(key)); },
      set(key, value) { writeStored(String(key), value); },
      remove(key) { memory.delete(String(key)); try { if (typeof localStorage !== "undefined") localStorage.removeItem("mf-mygo:" + key); } catch (e) {} },
    },
    setting,
    t(text) { return text; },
    language() { return "zh-CN"; },
    platform: "android",
    dataDir: "",
    ffmpegPath: "",
    spawn() { throw new Error("MusicFree 不支持本地 spawn/ffmpeg，请用源站直链"); },
    openURL() {},
  };

  function headerBag(headers) {
    const lower = {};
    if (headers && typeof headers.forEach === "function") {
      headers.forEach((v, k) => { lower[String(k).toLowerCase()] = v; });
    } else if (headers) {
      Object.keys(headers).forEach((k) => { lower[String(k).toLowerCase()] = headers[k]; });
    }
    return {
      get(name) {
        const value = lower[String(name).toLowerCase()];
        if (Array.isArray(value)) return value.join(", ");
        return value == null ? null : String(value);
      },
      has(name) { return lower[String(name).toLowerCase()] != null; },
    };
  }

  function toArrayBuffer(data) {
    if (data instanceof ArrayBuffer) return data;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView && ArrayBuffer.isView(data)) {
      return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    }
    if (typeof data === "string") {
      let text = data;
      if (text.indexOf("base64,") >= 0) text = text.slice(text.indexOf("base64,") + 7);
      try {
        const bin = atobFn(text);
        const out = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i) & 255;
        return out.buffer;
      } catch (e) {
        return new TextEncoder().encode(text).buffer;
      }
    }
    return new ArrayBuffer(0);
  }

  function makeFetch() {
    if (typeof fetch === "function") return fetch.bind(globalThis || this);
    let axios = null;
    try { if (typeof require === "function") axios = require("axios"); } catch (e) {}
    if (!axios) return async function () { throw new Error("MusicFree 宿主没有 fetch 或 axios"); };
    return async function (input, init = {}) {
      const res = await axios.request({
        url: typeof input === "string" ? input : input.url,
        method: init.method || "GET",
        headers: init.headers || {},
        data: init.body,
        responseType: "arraybuffer",
        validateStatus: () => true,
        maxRedirects: init.redirect === "manual" ? 0 : 5,
        timeout: init.timeout || 0,
      });
      const body = toArrayBuffer(res.data);
      const headers = headerBag(res.headers);
      return {
        ok: res.status >= 200 && res.status < 300,
        status: res.status,
        url: (res.request && res.request.responseURL) || (res.request && res.request._response && res.request._response.responseURL) || (typeof input === "string" ? input : input.url),
        headers,
        async text() { return new TextDecoder("utf-8").decode(body); },
        async json() { return JSON.parse(new TextDecoder("utf-8").decode(body)); },
        async arrayBuffer() { return body; },
      };
    };
  }

  const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  function b64decode(text) {
    let s = String(text || "").replace(/[^A-Za-z0-9+/=]/g, "");
    let out = "";
    for (let i = 0; i < s.length; i += 4) {
      const a = B64.indexOf(s[i]);
      const b = B64.indexOf(s[i + 1]);
      const c = s[i + 2] === "=" ? 64 : B64.indexOf(s[i + 2]);
      const d = s[i + 3] === "=" ? 64 : B64.indexOf(s[i + 3]);
      if (a < 0 || b < 0) break;
      out += String.fromCharCode((a << 2) | (b >> 4));
      if (c !== 64) out += String.fromCharCode(((b & 15) << 4) | (c >> 2));
      if (d !== 64) out += String.fromCharCode(((c & 3) << 6) | d);
    }
    return out;
  }
  function b64encode(binary) {
    let out = "";
    for (let i = 0; i < binary.length; i += 3) {
      const a = binary.charCodeAt(i);
      const b = i + 1 < binary.length ? binary.charCodeAt(i + 1) : null;
      const c = i + 2 < binary.length ? binary.charCodeAt(i + 2) : null;
      out += B64[a >> 2];
      out += B64[((a & 3) << 4) | (b == null ? 0 : b >> 4)];
      out += b == null ? "=" : B64[((b & 15) << 2) | (c == null ? 0 : c >> 6)];
      out += c == null ? "=" : B64[c & 63];
    }
    return out;
  }

  const atobFn = typeof atob === "function" ? atob : b64decode;
  const btoaFn = typeof btoa === "function" ? btoa : b64encode;

  let TD = typeof TextDecoder !== "undefined" ? TextDecoder : null;
  if (!TD) {
    TD = class {
      constructor(enc) { this.encoding = String(enc || "utf-8").toLowerCase(); }
      decode(buffer) {
        if (this.encoding !== "utf-8" && this.encoding !== "utf8") throw new Error("unsupported encoding: " + this.encoding);
        const bytes = new Uint8Array(buffer instanceof ArrayBuffer ? buffer : toArrayBuffer(buffer));
        let out = "";
        for (let i = 0; i < bytes.length; i++) out += "%" + (bytes[i] < 16 ? "0" : "") + bytes[i].toString(16);
        try { return decodeURIComponent(out); } catch (e) { return String.fromCharCode.apply(null, bytes); }
      }
    };
  }

  class TinyURL {
    constructor(input, base) {
      let href = String(input || "");
      if (!/^[a-z][a-z0-9+.-]*:/i.test(href) && base) {
        try { href = new TinyURL(base).href.replace(/[^/]*$/, "") + href.replace(/^\.\//, ""); } catch (e) {}
      }
      this.href = href;
      const m = href.match(/^([a-z][a-z0-9+.-]*:)\/\/([^/?#]*)([^?#]*)(\?[^#]*)?/i);
      this.protocol = m ? m[1] : "";
      this.hostname = m ? m[2].replace(/:\d+$/, "") : "";
      this.pathname = m ? m[3] : href;
      this.search = (m && m[4]) || "";
    }
    toString() { return this.href; }
  }

  class TinyUSP {
    constructor(init) {
      this.map = new Map();
      if (init && typeof init === "object") {
        if (typeof init.forEach === "function" && !Array.isArray(init)) init.forEach((v, k) => this.set(k, v));
        else Object.keys(init).forEach((k) => this.set(k, init[k]));
      } else if (typeof init === "string") {
        init.replace(/^\?/, "").split("&").forEach((pair) => {
          if (!pair) return;
          const at = pair.indexOf("=");
          const k = at < 0 ? pair : pair.slice(0, at);
          const v = at < 0 ? "" : pair.slice(at + 1);
          this.set(decodeURIComponent(k), decodeURIComponent(v));
        });
      }
    }
    set(k, v) { this.map.set(String(k), String(v)); }
    get(k) { const v = this.map.get(String(k)); return v == null ? null : v; }
    toString() { const out = []; this.map.forEach((v, k) => out.push(encodeURIComponent(k) + "=" + encodeURIComponent(v))); return out.join("&"); }
  }

  const URLClass = typeof URL !== "undefined" ? URL : TinyURL;
  const USPClass = typeof URLSearchParams !== "undefined" ? URLSearchParams : TinyUSP;

  function textOf(value) {
    if (value == null) return "";
    if (Array.isArray(value)) return value.map(textOf).filter(Boolean).join(" / ");
    if (typeof value === "object") return String(value.name || value.title || value.nickname || "");
    return String(value);
  }

  function artworkOf(item) {
    if (!item) return "";
    return item.artwork || item.imageUrl || item.cover || item.pic || item.avatar || item.albumArtwork ||
      (item.album && (item.album.imageUrl || item.album.artwork || item.album.cover)) || "";
  }

  function secondsOf(value) {
    let n = Number(value);
    if (!isFinite(n) || n <= 0) return 0;
    if (n > 3600) n = Math.round(n / 1000);
    return n;
  }

  function mfMusic(track) {
    if (!track) return null;
    const album = typeof track.album === "object" && track.album ? track.album : {};
    const id = track.id != null ? track.id : (track.trackId != null ? track.trackId : track.songId);
    if (id == null) return null;
    return {
      id: String(id),
      title: textOf(track.name || track.title || track.songname || "未命名"),
      artist: textOf(track.artists || track.artist || track.singer || track.author),
      album: textOf(album.name || track.albumName || ""),
      artwork: artworkOf(track),
      duration: secondsOf(track.duration),
    };
  }

  function mfAlbum(album) {
    if (!album) return null;
    if (album.id == null) return null;
    return {
      id: String(album.id),
      title: textOf(album.name || album.title || "未命名专辑"),
      artist: textOf(album.artists || album.artist || album.author),
      artwork: artworkOf(album),
      description: textOf(album.description || album.intro || ""),
    };
  }

  function mfPlaylist(item) {
    if (!item || item.id == null) return null;
    return {
      id: String(item.id),
      title: textOf(item.name || item.title || "未命名歌单"),
      artist: textOf(item.artists || item.artist || item.creator || item.author),
      artwork: artworkOf(item),
      description: textOf(item.description || item.intro || ""),
    };
  }

  function mfArtist(item) {
    if (!item || item.id == null) return null;
    return {
      id: String(item.id),
      title: textOf(item.name || item.title || "未命名歌手"),
      avatar: artworkOf(item),
      description: textOf(item.description || item.intro || ""),
    };
  }

  function tracksOf(source) {
    if (!source) return [];
    const list = source.tracks || source.musicList || source.data || [];
    return list.map(mfMusic).filter(Boolean);
  }

  function makePlugin(plugin, meta) {
    const topCache = new Map();
    const empty = { isEnd: true, data: [] };

    async function search(query, page, type) {
      if (typeof plugin.search !== "function") return empty;
      const p = Math.max(1, Number(page) || 1);
      const offset = (p - 1) * 20;
      const kind = type === "album" ? "albums" : type === "artist" ? "artists" : type === "sheet" ? "playlists" : "tracks";
      let result;
      try {
        result = await plugin.search({ query: String(query == null ? "" : query), kind, type: kind, offset, limit: 20, page: p });
      } catch (error) {
        throw new Error(meta.name + "：搜索失败 — " + (error && error.message ? error.message : error));
      }
      if (!result) return empty;
      let data = [];
      if (type === "album") data = (result.albums || result.playlists || []).map(mfAlbum);
      else if (type === "artist") data = (result.artists || []).map(mfArtist);
      else if (type === "sheet") data = (result.playlists || []).map(mfPlaylist);
      else data = tracksOf(result);
      return { isEnd: !(result.more === true), data: data.filter(Boolean) };
    }

    async function getMediaSource(musicItem) {
      if (!musicItem || musicItem.id == null) throw new Error("缺少曲目 ID");
      if (typeof plugin.stream !== "function") throw new Error(meta.name + "：没有播放接口");
      let result;
      try {
        result = await plugin.stream({ id: musicItem.id });
      } catch (error) {
        throw new Error(meta.name + "：取流失败 — " + (error && error.message ? error.message : error));
      }
      if (!result || !result.url) throw new Error(meta.name + "：没有可播放地址");
      let url = String(result.url);
      if (url.indexOf("//") === 0) url = "https:" + url;
      return {
        url,
        headers: result.headers && typeof result.headers === "object" ? result.headers : undefined,
        size: Number(result.size) || undefined,
      };
    }

    async function getLyric(musicItem) {
      const fn = plugin.lyrics || plugin.lyric;
      if (typeof fn !== "function" || !musicItem || musicItem.id == null) return { rawLrc: "" };
      let result;
      try { result = await fn({ id: musicItem.id }); } catch (e) { return { rawLrc: "" }; }
      if (typeof result === "string") return { rawLrc: result };
      if (!result) return { rawLrc: "" };
      return { rawLrc: String(result.rawLrc || result.lrc || result.lyric || result.raw || "") };
    }

    async function albumInfo(albumItem) {
      if (!albumItem || albumItem.id == null || typeof plugin.album !== "function") {
        return { isEnd: true, musicList: [] };
      }
      try {
        const result = await plugin.album({ id: albumItem.id });
        return { isEnd: !(result && result.more === true), musicList: tracksOf(result) };
      } catch (error) {
        throw new Error(meta.name + "：读取专辑失败 — " + (error && error.message ? error.message : error));
      }
    }

    async function getArtistWorks(artistItem, page, type) {
      if (!artistItem || artistItem.id == null || typeof plugin.artist !== "function") return empty;
      const p = Math.max(1, Number(page) || 1);
      try {
        const result = await plugin.artist({ id: artistItem.id, page: p, offset: (p - 1) * 20 });
        if (!result) return empty;
        const data = type === "album" ? (result.albums || []).map(mfAlbum) : tracksOf(result);
        return { isEnd: !(result.more === true), data: data.filter(Boolean) };
      } catch (error) {
        throw new Error(meta.name + "：读取歌手失败 — " + (error && error.message ? error.message : error));
      }
    }

    async function getTopLists() {
      if (typeof plugin.home !== "function") return [];
      let home;
      try { home = await plugin.home(); } catch (e) { return []; }
      const sections = (home && (home.sections || home.cards)) || [];
      const groups = [];
      sections.forEach((section, index) => {
        if (!section) return;
        const data = [];
        const title = textOf(section.title || section.name || "推荐");
        const tracks = section.tracks || [];
        if (tracks.length) {
          const id = "mygo-tracks-" + index;
          topCache.set(id, { kind: "tracks", data: tracks });
          data.push({ id, title, cover: artworkOf(tracks[0]) || "" });
        }
        (section.albums || []).forEach((album) => {
          const item = mfAlbum(album);
          if (!item) return;
          const rawId = item.id;
          item.id = "mygo-album-" + index + "-" + rawId;
          item._mfKind = "album";
          topCache.set(item.id, { kind: "album", id: rawId });
          data.push(item);
        });
        (section.playlists || []).forEach((playlist) => {
          const item = mfPlaylist(playlist);
          if (!item) return;
          const rawId = item.id;
          item.id = "mygo-sheet-" + index + "-" + rawId;
          item._mfKind = "playlist";
          topCache.set(item.id, { kind: "playlist", id: rawId });
          data.push(item);
        });
        (section.artists || []).forEach((artist) => {
          const item = mfArtist(artist);
          if (!item) return;
          const rawId = item.id;
          item.id = "mygo-artist-" + index + "-" + rawId;
          item._mfKind = "artist";
          topCache.set(item.id, { kind: "artist", id: rawId });
          data.push(item);
        });
        if (data.length) groups.push({ title, data });
      });
      return groups;
    }

    async function getTopListDetail(topListItem, page) {
      const p = Math.max(1, Number(page) || 1);
      if (!topListItem || p > 1) return { isEnd: true, musicList: [] };
      const cached = topCache.get(topListItem.id);
      if (cached && cached.kind === "tracks") {
        return { isEnd: true, musicList: cached.data.map(mfMusic).filter(Boolean) };
      }
      const kind = topListItem._mfKind || (cached && cached.kind);
      if (kind === "album") return albumInfo({ id: (cached && cached.id) || topListItem.id });
      if (kind === "playlist" && typeof plugin.playlist === "function") {
        const r = await plugin.playlist({ id: (cached && cached.id) || topListItem.id });
        return { isEnd: !(r && r.more === true), musicList: tracksOf(r) };
      }
      if (kind === "artist" && typeof plugin.artist === "function") {
        const r = await plugin.artist({ id: (cached && cached.id) || topListItem.id, page: p, offset: (p - 1) * 20 });
        return { isEnd: !(r && r.more === true), musicList: tracksOf(r) };
      }
      return { isEnd: true, musicList: [] };
    }

    async function getRecommendSheetTags() {
      return { data: [{ title: "电台 / 推荐", data: [{ id: "home", title: "首页推荐" }] }] };
    }

    async function getRecommendSheetsByTag(tag, page) {
      if (Number(page) > 1) return empty;
      const groups = await getTopLists();
      const data = [];
      groups.forEach((group) => {
        (group.data || []).forEach((item) => {
          if (item._mfKind === "album" || item._mfKind === "playlist") data.push(item);
        });
      });
      return { isEnd: true, data };
    }

    async function getMusicSheetInfo(sheetItem, page) {
      if (!sheetItem || Number(page) > 1) return { isEnd: true, musicList: [] };
      const cached = topCache.get(sheetItem.id);
      if (cached && cached.kind === "tracks") {
        return { isEnd: true, musicList: cached.data.map(mfMusic).filter(Boolean) };
      }
      if ((sheetItem._mfKind === "album" || (cached && cached.kind === "album")) && cached && cached.id) return albumInfo({ id: cached.id });
      if (typeof plugin.playlist === "function") {
        try {
          const r = await plugin.playlist({ id: (cached && cached.id) || sheetItem.id });
          return { isEnd: !(r && r.more === true), musicList: tracksOf(r) };
        } catch (e) {}
      }
      return { isEnd: true, musicList: [] };
    }

    return {
      platform: meta.name,
      author: "hhym",
      version: meta.version || "0.1.0",
      description: "由 MyGo Music 插件 " + meta.id + " 转换，站点：" + meta.site,
      cacheControl: "no-cache",
      supportedSearchType: meta.searchTypes || ["music", "album"],
      search,
      getMediaSource,
      getLyric,
      getAlbumInfo: albumInfo,
      getArtistWorks,
      getTopLists,
      getTopListDetail,
      getRecommendSheetTags,
      getRecommendSheetsByTag,
      getMusicSheetInfo,
    };
  }

  return { host, fetch: makeFetch(), TextDecoder: TD, atob: atobFn, btoa: btoaFn, URL: URLClass, URLSearchParams: USPClass, makePlugin };
})();

const __mfPlugin = (function(host, fetch, TextDecoder, atob, btoa, URL, URLSearchParams) {
// 显示名：优折美音乐（uzz-music）
// MyGo Music plugin — 优折美音乐 (m.uzz.me)
//
// The site is an MKOnlineMusicPlayer front end: one static shell page plus a
// PHP data bridge. Everything — search, song URL, cover, lyric, playlist —
// comes from that bridge as JSONP:
//
//   GET  /api.php?types=search&count=10&source=netease&pages=<n>&name=<kw>
//   GET  /api.php?types=url&id=<url_id>&source=<source>       -> { url }
//   GET  /api.php?types=pic&id=<pic_id>&source=<source>       -> { url }
//   GET  /api.php?types=lyric&id=<lyric_id>&source=<source>   -> { lyric, tlyric }
//   GET  /api.php?types=playlist&id=<netease playlist id>     -> { playlist: {...} }
//
// Two quirks shape the code below:
//
//   1. The host sits behind a CloudFront "verify you are a browser" gate. A
//      plain GET answers 503 with a tiny page that, after five seconds and a
//      HEAD probe carrying ?_callback=<ts>, hands out a waf_token cookie. We
//      replay that dance once and keep the cookie for later requests.
//   2. A song is not addressable by one number: the search hit carries
//      id/url_id/pic_id/lyric_id, and the bridge wants the matching one for
//      each call. Track ids therefore pack all four, joined by |.

const BASE = "https://m.uzz.me";
const API = BASE + "/api.php";
const SOURCE = "netease";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const PAGE = 10;
const CACHE_TTL = 5 * 60 * 1000;
const TOKEN_TTL = 45 * 60 * 1000;

const t = (text) => host.t(text);

function fail(code, message) {
  const error = new Error(message || code);
  error.code = code;
  return error;
}

/* ---------------------------------------------------------------- transport */

/* Cookies live in memory for the life of the plugin process; the waf_token is
   also mirrored into storage so a restart inside the token window skips the
   five second gate. */
const jar = new Map();

function loadJar() {
  if (jar.size) return;
  const saved = host.storage.get("waf");
  if (!saved || !saved.cookies) return;
  for (const pair of saved.cookies) jar.set(pair[0], pair[1]);
}

function saveJar() {
  host.storage.set("waf", {
    at: Date.now(),
    cookies: Array.from(jar.entries()),
  });
}

function cookieHeader() {
  if (!jar.size) return "";
  return Array.from(jar.entries())
    .map((pair) => pair[0] + "=" + pair[1])
    .join("; ");
}

function absorb(res) {
  let lines = [];
  if (typeof res.headers.getSetCookie === "function") {
    lines = res.headers.getSetCookie();
  } else {
    const raw = res.headers.get("set-cookie");
    if (raw) lines = raw.split(/,(?=[^;]+=)/);
  }
  for (const line of lines || []) {
    const pair = String(line).split(";")[0];
    const at = pair.indexOf("=");
    if (at < 1) continue;
    jar.set(pair.slice(0, at).trim(), pair.slice(at + 1).trim());
  }
  if (lines.length) saveJar();
}

function headers(extra) {
  const base = {
    "user-agent": UA,
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.5",
    accept: "*/*",
    referer: BASE + "/",
  };
  const cookie = cookieHeader();
  if (cookie) base.cookie = cookie;
  return Object.assign(base, extra || {});
}

async function send(url, method, extra, ms) {
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const init = { method: method || "GET", headers: headers(extra), redirect: "manual" };
  if (controller) init.signal = controller.signal;
  const timer = setTimeout(() => {
    if (controller) controller.abort();
  }, ms || 25000);
  try {
    return await fetch(url, init);
  } finally {
    clearTimeout(timer);
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function isChallenge(status, body) {
  return status === 503 && body.indexOf("安全验证") >= 0;
}

function isBlocked(status, body) {
  if (status !== 403) return false;
  const lower = String(body).toLowerCase();
  return lower.indexOf("403") >= 0 && lower.indexOf("<html") >= 0;
}

let verifiedAt = 0;

/* Pass the CloudFront gate: one HEAD with ?_callback, five seconds, then the
   original request again. Runs at most once per token window. */
async function verify(url) {
  if (Date.now() - verifiedAt < TOKEN_TTL && jar.has("waf_token")) return;
  const stamp = String(Date.now());
  try {
    const head = await send(BASE + "/?_callback=" + stamp, "HEAD", null, 15000);
    absorb(head);
  } catch (error) {
    /* The probe often reports its own 503; the cookie is what matters. */
  }
  await sleep(5300);
  verifiedAt = Date.now();
}

/* The host answers bursts with a blanket 403, so every request goes through
   one queue that keeps a gap between calls and lets a refused one cool down
   before trying again. */
let queue = Promise.resolve();
let lastCall = 0;
const GAP = 1800;

function paced(task) {
  const run = queue.then(async () => {
    const wait = lastCall + GAP - Date.now();
    if (wait > 0) await sleep(wait);
    try {
      return await task();
    } finally {
      lastCall = Date.now();
    }
  });
  queue = run.catch(() => {});
  return run;
}

async function fetchText(url, options = {}) {
  loadJar();
  return paced(async () => {
    let lastStatus = 0;
    for (let attempt = 0; attempt < 3; attempt++) {
      let res;
      try {
        res = await send(url, options.method || "GET", options.headers, options.timeout);
      } catch (error) {
        if (attempt === 2) throw fail("unavailable", t("连接站点失败，请稍后再试"));
        await sleep(2000 * (attempt + 1));
        continue;
      }
      absorb(res);
      const body = await res.text();
      lastStatus = res.status;

      if (isChallenge(res.status, body)) {
        await verify(url);
        continue;
      }
      if (isBlocked(res.status, body)) {
        if (attempt === 2) throw fail("unavailable", t("站点正在限流或拒绝访问，请过几分钟再试"));
        await sleep(6000 * (attempt + 1));
        continue;
      }
      if (res.status >= 500) {
        if (attempt === 2) throw fail("unavailable", t("站点接口暂时不可用（HTTP " + res.status + "）"));
        await sleep(3000 * (attempt + 1));
        continue;
      }
      if (res.status === 404) throw fail("unavailable", t("站点没有这个接口"));
      return body;
    }
    throw fail("unavailable", t("站点接口暂时不可用（HTTP " + lastStatus + "）"));
  });
}

/* --------------------------------------------------------------- json bridge */

function unwrap(text) {
  const trimmed = String(text || "").trim();
  const at = trimmed.indexOf("(");
  const end = trimmed.lastIndexOf(")");
  if (at > 0 && end > at) return trimmed.slice(at + 1, end);
  return trimmed;
}

const apiCache = new Map();

async function api(params, ttl) {
  const query = Object.keys(params)
    .filter((key) => params[key] != null && params[key] !== "")
    .map((key) => key + "=" + encodeURIComponent(String(params[key])))
    .join("&");
  const url = API + "?" + query + "&callback=mygo_" + Date.now();
  const cached = apiCache.get(query);
  if (cached && Date.now() - cached.at < (ttl || CACHE_TTL)) return cached.data;

  const body = await fetchText(url, { timeout: 25000 });
  let data;
  try {
    data = JSON.parse(unwrap(body));
  } catch (error) {
    throw fail("unavailable", t("站点接口返回异常，请稍后再试"));
  }
  apiCache.set(query, { at: Date.now(), data: data });
  return data;
}

/* --------------------------------------------------------------------- tracks */

function pack(item) {
  return [item.source || SOURCE, item.id, item.url_id || item.id, item.pic_id, item.lyric_id].join("|");
}

function unpack(id) {
  const parts = String(id).split("|");
  return {
    source: parts[0] || SOURCE,
    id: parts[1] || "",
    urlId: parts[2] || parts[1] || "",
    picId: parts[3] || "",
    lyricId: parts[4] || parts[1] || "",
  };
}

function toTrack(item) {
  if (!item || !item.id) return null;
  const artists = Array.isArray(item.artist) ? item.artist : item.artist ? [item.artist] : [];
  return {
    id: pack(item),
    name: item.name || "未知歌曲",
    artists: artists.map((name) => ({ name: String(name) })),
    album: item.album ? { name: String(item.album) } : undefined,
    imageUrl: item.pic || undefined,
  };
}

function listOf(items) {
  return (items || []).map(toTrack).filter(Boolean);
}

/* ---------------------------------------------------------------- navigation */
async function home() {
  const sections = [];

  /* One chart is enough for the landing page: the site throttles bursts, so
     the plugin spends its first request on the heat list and nothing else. */
  try {
    const sheet = await playlist("3778678");
    remember(sheet.tracks);
    if (sheet.tracks.length) {
      sections.push({
        title: t("热歌榜"),
        albums: [
          {
            id: "p:3778678",
            name: sheet.album.name,
            imageUrl: sheet.album.imageUrl,
            description: sheet.album.description,
          },
        ],
      });
      sections.push({ title: t("热歌榜 · 歌曲"), tracks: sheet.tracks.slice(0, 10) });
    }
  } catch (error) {
    sections.push({
      title: t("榜单暂时取不到"),
      links: [{ title: t("重试热歌榜"), page: "playlist/3778678" }],
    });
  }

  sections.push({
    title: "搜索",
    links: HOT.map((word) => ({ title: word, page: "search/" + word })),
  });

  return {
    title: t("优折美音乐"),
    subtitle: t("在线播放 · 网易云曲库"),
    sections: sections,
  };
}

const HOT = ["周杰伦", "林俊杰", "陈奕迅", "邓紫棋", "薛之谦", "毛不易", "五月天", "告五人"];

async function playlist(id) {
  const data = await api({ types: "playlist", id: id, source: SOURCE });
  const sheet = data && data.playlist ? data.playlist : {};
  const tracks = [];
  for (const item of sheet.tracks || []) {
    const artist = (item.ar && item.ar[0] && item.ar[0].name) || (item.artists && item.artists[0] && item.artists[0].name);
    const album = (item.al && item.al.name) || (item.album && item.album.name);
    const pic = (item.al && item.al.picUrl) || (item.album && item.album.picture);
    const mapped = toTrack({
      id: item.id,
      name: item.name,
      artist: artist ? [artist] : [],
      album: album,
      source: SOURCE,
      url_id: item.id,
      pic_id: null,
      lyric_id: item.id,
      pic: pic ? pic + "?param=300y300" : null,
    });
    if (mapped) tracks.push(mapped);
  }
  return {
    album: {
      id: "p:" + id,
      name: sheet.name || t("歌单"),
      imageUrl: sheet.coverImgUrl ? sheet.coverImgUrl + "?param=300y300" : undefined,
      description: sheet.creator && sheet.creator.nickname ? t("歌单 · ") + sheet.creator.nickname : t("歌单"),
    },
    tracks: tracks,
  };
}
async function browse({ page }) {
  const path = String(page || "");

  if (path === "hot") {
    return {
      title: t("热门搜索"),
      sections: [
        { title: t("热门搜索"), links: HOT.map((word) => ({ title: word, page: "search/" + word })) },
      ],
    };
  }

  const searchMatch = /^search\/(.+)$/.exec(path);
  if (searchMatch) {
    const keyword = decodeURIComponent(searchMatch[1]);
    const result = await search({ query: keyword, offset: 0 });
    return {
      title: keyword,
      sections: [{ title: t("歌曲"), tracks: result.tracks, more: result.more }],
    };
  }

  const listMatch = /^playlist\/(\d+)$/.exec(path);
  if (listMatch) {
    const sheet = await playlist(listMatch[1]);
    remember(sheet.tracks);
    return {
      title: sheet.album.name,
      sections: [{ title: t("歌曲"), tracks: sheet.tracks }],
    };
  }

  throw fail("unavailable", t("没有这个页面"));
}

/* ------------------------------------------------------------------- search */
async function search({ query, offset }) {
  const keyword = String(query || "").trim();
  if (!keyword) throw fail("invalid", t("请输入搜索内容"));

  const start = Math.max(0, Number(offset) || 0);
  const first = Math.floor(start / PAGE) + 1;
  const skip = start % PAGE;

  const items = [];
  let more = false;
  for (let pageNo = first; ; pageNo++) {
    const data = await api(
      { types: "search", count: PAGE, source: SOURCE, pages: pageNo, name: keyword },
      CACHE_TTL,
    );
    const rows = Array.isArray(data) ? data : [];
    if (!rows.length) {
      more = false;
      break;
    }
    items.push.apply(items, rows);
    if (items.length > skip + PAGE) {
      more = true;
      break;
    }
    if (rows.length < PAGE) {
      more = false;
      break;
    }
  }

  const tracks = listOf(items.slice(skip, skip + PAGE));
  remember(tracks);
  return { tracks: tracks, more: tracks.length === PAGE && more };
}
function suggest({ query }) {
  const word = String(query || "").trim();
  if (!word) return [];
  return HOT.filter((item) => item === word || item.indexOf(word) === 0 || item.indexOf(word) > 0).slice(0, 6);
}

/* -------------------------------------------------------------------- albums */
async function album({ id }) {
  const raw = String(id);
  if (raw.indexOf("p:") === 0) {
    const sheet = await playlist(raw.slice(2));
    return { album: sheet.album, tracks: sheet.tracks };
  }
  const item = unpack(raw);
  const track = toTrack({
    id: item.id,
    name: t("歌曲"),
    artist: [],
    source: item.source,
    url_id: item.urlId,
    pic_id: item.picId,
    lyric_id: item.lyricId,
  });
  return {
    album: { id: raw, name: t("单曲") },
    tracks: track ? [track] : [],
  };
}

/* -------------------------------------------------------------------- stream */

const TYPES = { mp3: "mp3", m4a: "m4a", aac: "aac", flac: "flac" };
async function stream({ id }) {
  const item = unpack(id);
  const data = await api({ types: "url", id: item.urlId, source: item.source }, 30 * 60 * 1000);
  const url = data && data.url ? String(data.url) : "";
  if (!url || url === "err") throw fail("unavailable", t("这首暂时没有可播放的地址"));
  const ext = (url.split("?")[0].match(/\.([a-z0-9]+)$/i) || [])[1] || "mp3";
  return { url: url, type: TYPES[ext.toLowerCase()] || "mp3" };
}
async function lyrics({ id }) {
  const item = unpack(id);
  const data = await api({ types: "lyric", id: item.lyricId, source: item.source }, 30 * 60 * 1000);
  const main = (data && data.lyric) || "";
  if (!main) return { lrc: "" };
  return { lrc: main };
}

/* ------------------------------------------------------------- local library */

const index = host.storage.get("trackIndex") || {};

function remember(tracks) {
  let changed = false;
  for (const track of tracks) {
    if (!track || !track.id) continue;
    const entry = { id: track.id, name: track.name, artists: track.artists, imageUrl: track.imageUrl };
    const old = index[track.id];
    if (!old || old.name !== entry.name) {
      index[track.id] = entry;
      changed = true;
    }
  }
  if (changed) host.storage.set("trackIndex", index);
}

function load(key, fallback) {
  const value = host.storage.get(key);
  return value == null ? fallback : value;
}

function trackById(id) {
  if (index[id]) return index[id];
  const liked = load("likedTracks", {});
  return liked[id] || { id: id, name: t("歌曲") };
}
function played({ id }) {
  if (!id) return;
  const ids = load("recent", []).filter((item) => item !== id);
  ids.unshift(id);
  host.storage.set("recent", ids.slice(0, 20));
}
function recent() {
  return load("recent", []).map(trackById).filter(Boolean).slice(0, 10);
}
function like({ id, on }) {
  const ids = load("liked", []).filter((item) => item !== id);
  if (on) ids.unshift(id);
  host.storage.set("liked", ids);

  const set = load("likedSet", {});
  if (on) set[id] = true;
  else delete set[id];
  host.storage.set("likedSet", set);

  const tracks = load("likedTracks", {});
  if (on) tracks[id] = trackById(id);
  else delete tracks[id];
  host.storage.set("likedTracks", tracks);
}
function liked() {
  const ids = load("liked", []);
  return { tracks: ids.map(trackById), more: false };
}
function isLiked({ ids }) {
  const set = load("likedSet", {});
  const answer = {};
  for (const id of ids || []) answer[id] = !!set[id];
  return answer;
}
return { home, browse, search, suggest, album, stream, lyrics, played, recent, like, liked, isLiked };
})(__mfRuntime.host, __mfRuntime.fetch, __mfRuntime.TextDecoder, __mfRuntime.atob, __mfRuntime.btoa, __mfRuntime.URL, __mfRuntime.URLSearchParams);
module.exports = __mfRuntime.makePlugin(__mfPlugin, {"id": "uzz-music", "name": "优折美音乐", "version": "1.0.0", "site": "m.uzz.me", "searchTypes": ["music", "album"]});
