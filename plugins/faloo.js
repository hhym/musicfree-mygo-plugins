// 显示名：飞卢听书（faloo）
// MusicFree plugin generated from MyGo Music plugin; source site: ts.faloo.com
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
// 显示名：飞卢听书（faloo）
const CFG = {
  "name": "飞卢听书",
  "base": "http://ts.faloo.com",
  "mode": "book",
  "seed": "有声小说",
  "detail": "/listen/[0-9]+\\.html",
  "homePath": "/",
  "cats": [],
  "subtitle": "飞卢小说有声版",
  "charset": "gbk"
};

const BASE = CFG.base;
const REFERER = BASE + "/";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const PAGE_TTL = 2 * 60 * 1000;
const CATS = CFG.cats || [];
const DETAIL = CFG.detailRegex || CFG.detail || "NEVERMATCH";
const QT_SEARCH = "https://search.qtfm.cn";
const QT_API = "https://webapi.qtfm.cn";
const QT_WEB = "https://m.qtfm.cn";
const QT_HEAD = { "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Mobile", origin: QT_WEB, referer: QT_WEB + "/", accept: "application/json,*/*" };

const pageCache = new Map();
const knownTracks = new Map();
const qtChannelCache = new Map();

function fail(code, message) { const e = new Error(message || code); e.code = code; return e; }
function stored(k, f) { const v = host.storage.get(k); return v === undefined || v === null ? f : v; }
function keep(k, v) { host.storage.set(k, v); }
function unescapeHtml(s) {
  return String(s).replace(/&#x([0-9a-fA-F]+);/g, (m, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(Number(d)))
    .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (m, n) => ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " })[n]).replace(/&[a-zA-Z]+;/g, " ");
}
function clean(s) { return unescapeHtml(String(s || "")).replace(/<[^>]+>/g, " ").replace(/[\s\u00a0]+/g, " ").trim(); }
function absolute(u) { if (!u) return ""; let x = String(u).trim().replace(/\\\//g, "/").replace(/&amp;/g, "&"); if (x.startsWith("//")) return "https:" + x; if (x.startsWith("/")) return BASE + x; return x; }
function toPath(u) { const x = absolute(u); return x.startsWith(BASE) ? x.slice(BASE.length) || "/" : x; }
function attr(tag, name) { const r = new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"); const m = r.exec(tag); return m ? (m[2] !== undefined ? m[2] : m[3] !== undefined ? m[3] : m[4]) : ""; }
function imageFrom(html) {
  for (const m of [...String(html).matchAll(/<img\b([^>]*?)>/gi)].reverse()) {
    const src = attr(m[0], "data-original") || attr(m[0], "data-src") || attr(m[0], "src");
    if (src && !/none|blank|loading|lazy\.gif|placeholder/i.test(src)) return absolute(src);
  }
  return "";
}
function makeTrack(id, name, extra = {}) {
  return { id: String(id), name: clean(name), artists: extra.artists || [], album: extra.album || { id: "", name: "", imageUrl: "" }, duration: Number(extra.duration) || 0 };
}
function remember(list) { for (const t of list || []) if (t && t.id) knownTracks.set(String(t.id), t); }
function trackBy(id) { return knownTracks.get(String(id)) || stored("likedTracks", {})[id] || stored("historyTracks", {})[id] || null; }

async function request(path, options = {}) {
  const url = path.startsWith("http") ? path : BASE + path;
  let res;
  try {
    res = await fetch(url, { method: options.method || "GET", headers: { "user-agent": UA, referer: options.referer || REFERER, "accept-language": "zh-CN,zh;q=0.9", accept: "text/html,application/json,*/*", ...(options.body ? { "content-type": "application/x-www-form-urlencoded" } : {}), ...(options.headers || {}) }, body: options.body });
  } catch (e) { throw fail("unavailable", `连不上 ${BASE}：${e && e.message ? e.message : e}`); }
  if (!res.ok) throw fail("unavailable", `${BASE} 返回了 ${res.status}`);
  return res;
}
async function html(path, options = {}) {
  const key = (path.startsWith("http") ? path : BASE + path) + (options.body || "");
  const c = pageCache.get(key);
  if (c && Date.now() - c.at < PAGE_TTL) return c.text;
  const res = await request(path, options);
  let text;
  if (CFG.charset === "gbk") {
    try { text = new TextDecoder("gbk").decode(await res.arrayBuffer()); } catch (e) { text = await res.text(); }
  } else text = await res.text();
  pageCache.set(key, { text, at: Date.now() });
  if (pageCache.size > 80) { const old = [...pageCache.entries()].sort((a, b) => a[1].at - b[1].at)[0]; if (old) pageCache.delete(old[0]); }
  return text;
}

function blockStart(s, i) {
  let start = Math.max(0, i - 2500);
  for (const m of ["<li", "<article", "<tr", "<dd", "<div class=\"item", "<div class='item", "<div class=\"book"]) {
    const at = s.lastIndexOf(m, i - 1);
    if (at > start) start = at;
  }
  return start;
}

function parseList(page) {
  const s = String(page || "");
  let re;
  try { re = new RegExp(DETAIL, "i"); } catch (e) { return []; }
  const out = [], seen = new Set();
  const catPaths = new Set(CATS.map((c) => String(c.path || "").replace("{id}", String(c.id))));
  for (const m of s.matchAll(/<a\b([^>]*)>([\s\S]{0,200}?)<\/a>/gi)) {
    const tag = m[1] || "", href = attr(tag, "href");
    if (!href || !re.test(href)) continue;
    const name = clean(attr(tag, "title") || m[2]);
    if (!name || name.length < 2 || name.length > 80) continue;
    if (/^(首页|登录|注册|搜索|全部|更多|下一页|上一页|尾页|播放|收听|继续播放|主站|手机版|客户端|排行榜|分类|推荐|最新)$/.test(name)) continue;
    if (/收藏|加入|打赏|排行|书名|作者|主播|搜索|投稿|直播|下载|APP|客户端|登录|注册|首页|更多|全部|主站|评论|标签|频道|专题|手机|恋听网|听小说|建立剧集|资源位|申请|飞卢听书网|搜书|充值|活动|如何|制作|素材|按人气|末页|下一页/i.test(name)) continue;
    if (name === CFG.name) continue;
    const path = toPath(href);
    if (catPaths.has(path)) continue;
    if (seen.has(path)) continue;
    seen.add(path);
    const start = blockStart(s, m.index || 0);
    const chunk = s.slice(start, Math.min(s.length, (m.index || 0) + 300));
    const track = makeTrack(path, name, { album: { id: path, name: CFG.name, imageUrl: imageFrom(chunk) } });
    track._detail = absolute(href);
    knownTracks.set(String(track.id), track);
    out.push(track);
  }
  return out.slice(0, 60);
}

// ---- qtfm fallback ----
function qtCore(n) { return String(n || "").replace(/[《》<>【】\[\]（）()：:·\-—_、，,。.!！?？\s]/g, "").replace(/(长篇|短篇|袍带|评书|有声|小说|经典|全集|在线听|mp3)/gi, ""); }
function qtScore(a, b) { const x = [...qtCore(a)], y = new Set([...qtCore(b)]); if (!x.length || !y.size) return 0; let c = 0; for (const ch of x) if (y.has(ch)) c++; return c / Math.max(x.length, y.size); }
async function qtJson(url) {
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Mobile", origin: QT_WEB, referer: QT_WEB + "/", accept: "application/json,*/*" } });
  if (!res.ok) throw fail("unavailable", `蜻蜓FM ${res.status}`);
  return res.json();
}
async function qtDocs(term) {
  const k = String(term || "").trim(); if (!k) return [];
  const body = await qtJson(`${QT_SEARCH}/v3/search?include=channel&k=${encodeURIComponent(k)}&page=1&pagesize=20`);
  return (((body || {}).data || {}).data || {}).docs || [];
}
async function qtPrograms(chid) {
  const meta = await qtJson(`${QT_API}/api/mobile/channels/${chid}`);
  const ch = (meta || {}).channel || {}; const v = String(ch.v || ""); if (!v) return [];
  const list = [];
  for (let p = 1; p <= Math.min(4, Math.ceil(Number(ch.program_count || 0) / 30) || 1); p++) {
    const d = await qtJson(`${QT_API}/api/mobile/channels/${chid}/programs?version=${v}&page_index=${p}`);
    const arr = (d || {}).programs || []; if (!arr.length) break; list.push(...arr);
  }
  const free = list.filter((x) => x.isFree === true || x.saleStatus === "free" || Number(x.fee) === 0);
  return (free.length ? free : list).sort((a, b) => Number(a.programId || 0) - Number(b.programId || 0));
}
async function qtProg(chid, pid, title = "") {
  /* 2026-11 起 m.qtfm.cn/vchannels/<chid>/programs/<pid>/ 变成了 SPA 空壳，
     页面里不再有 audioUrl。音频地址改由 webapi 的 programInfo 给出，而且是
     先回 302 再跳到带 auth_key 的签名 m4a；宿主不一定跟随 302，所以这里把
     location 解出来，直接把最终地址交出去。 */
  let res;
  try {
    res = await fetch(`${QT_API}/api/mobile/channels/${chid}/programs/${pid}`, { headers: QT_HEAD });
  } catch (error) {
    return null;
  }
  if (!res.ok) return null;
  let body;
  try {
    body = await res.json();
  } catch (error) {
    return null;
  }
  const info = (body && body.programInfo) || {};
  const raw = String(info.audioUrl || "").replace(/\\\//g, "/");
  if (!raw) return null;

  let url = raw;
  try {
    const head = await fetch(url, { headers: QT_HEAD, redirect: "manual" });
    const loc = head.headers.get("location");
    if (loc) url = new URL(loc, url).href;
  } catch (error) {
    /* 解不出 302 就交原地址，宿主若会跟随也能播 */
  }

  return { url: url, type: /\.m4a(?:$|\?)/i.test(url) ? "m4a" : "mp3", headers: { referer: QT_WEB + "/", "user-agent": "Mozilla/5.0" }, title: clean(title) };
}

async function qtChannelStream(chid, ep = 1) { const p = await qtPrograms(chid); if (!p.length) return null; const i = Math.min(Math.max(Number(ep) || 1, 1), p.length) - 1; return qtProg(chid, p[i].programId, p[i].title || ""); }
async function qtByName(name, ep = 1) {
  const docs = await qtDocs(name);
  for (const d of docs) {
    if (!d || qtScore(d.title || "", name) < 0.3) continue;
    if (String(d.type || "").includes("channel")) { const r = await qtChannelStream(d.id, ep); if (r) return r; }
    else if (String(d.type || "").includes("program") && d.parent_id) { const r = await qtProg(d.parent_id, d.id, d.title || ""); if (r) return r; }
  }
  return null;
}
async function qtTracks(term, limit = 16, dedupe = false) {
  const docs = await qtDocs(term); const out = [], seen = new Set(), albums = new Set();
  for (const d of docs) {
    if (out.length >= limit) break; if (!d || !d.id) continue;
    const typ = String(d.type || ""); const isCh = typ.includes("channel"); const isProg = typ.includes("program") && d.parent_id;
    if (!isCh && !isProg) continue;
    const id = isProg ? `qtfm-prog:${d.parent_id}:${d.id}` : `qtfm:${d.id}:1`;
    const alb = d.parent_id ? String(d.parent_id) : String(d.id);
    if (seen.has(id) || (dedupe && albums.has(alb))) continue;
    seen.add(id); albums.add(alb);
    const cover = d.cover || d.coverUrl || d.thumbnail || "";
    const t = makeTrack(id, d.title || d.name || "有声节目", { artists: [{ name: d.podcaster || d.nickname || "蜻蜓FM", id: "" }], album: { id: `qtfm:${alb}`, name: "蜻蜓FM 兜底", imageUrl: absolute(cover).replace(/^http:/i, "https:") } });
    knownTracks.set(String(t.id), t); out.push(t);
  }
  return out;
}

// ---- audio finder ----
function audioUrl(v) {
  const u = absolute(String(v || "").trim()); if (!/^https?:\/\//i.test(u)) return "";
  if (/\.(jpg|jpeg|png|gif|webp|css|js|html?|php|json)(\?|$)/i.test(u)) return "";
  if (/\.(mp3|m4a|aac|m4s|flac|ogg|wav|m3u8)(\?|#|$)/i.test(u)) return u;
  if (/audiostream|audio\.|\/audio|mp3|m4a/i.test(u)) return u;
  return "";
}
function findAudio(t) {
  const s = String(t || ""); const out = [];
  const add = (v) => { const u = audioUrl(v); if (u) out.push(u); };
  for (const m of s.matchAll(/<audio\b[^>]*>/gi)) add(attr(m[0], "src"));
  for (const m of s.matchAll(/<source\b[^>]*>/gi)) add(attr(m[0], "src"));
  for (const m of s.matchAll(/<(video|div|a)\b[^>]*>/gi)) {
    for (const n of ["data-src", "data-url", "data-audio", "data-mp3", "data-play", "data-file", "href"]) {
      if (n === "href" && !/play|listen|audio|mp3/i.test(m[0])) continue;
      add(attr(m[0], n));
    }
  }
  for (const m of s.matchAll(/(?:videourl|audioUrl|playUrl|mp3|m4a|source|src)\s*[:=]\s*["']([^"']+)["']/gi)) add(m[1]);
  for (const m of s.matchAll(/https?:\/\/[^\s"'<>\\]+?\.(?:mp3|m4a|aac|m4s|flac|ogg|m3u8)(?:\?[^\s"'<>\\]*)?/gi)) add(m[0]);
  return out[0] || "";
}
function streamType(u) { return /\.m4a(?:$|\?)/i.test(u) ? "m4a" : /\.m3u8(?:$|\?)/i.test(u) ? "hls" : /\.flac(?:$|\?)/i.test(u) ? "flac" : "mp3"; }
async function detailAudio(url) {
  const pageUrl = /^https?:\/\//.test(url) ? url : absolute(url);
  const page = await html(pageUrl);
  const a = findAudio(page); if (a) return { url: a, referer: pageUrl };
  for (const m of page.matchAll(/<iframe\b[^>]*src\s*=\s*["']([^"']+)["']/gi)) {
    const inner = await html(absolute(m[1])); const x = findAudio(inner); if (x) return { url: x, referer: absolute(m[1]) };
  }
  return null;
}

// ---- ting55 nlinka ----
async function ting55Audio(url) {
  let page = await html(url);
  let book = (page.match(/meta\s+name="_b"\s+content="([^"]+)"/i) || [])[1];
  let pageNo = (page.match(/meta\s+name="_cp"\s+content="([^"]+)"/i) || [])[1];
  if (!book) { const b = page.match(/\/book\/([0-9]+)/); book = b && b[1]; }
  if (!pageNo) { const c = page.match(/\/book\/[0-9]+-([0-9]+)/); pageNo = c && c[1]; }
  if (book && !pageNo) {
    page = await html(`/book/${book}-1`);
    pageNo = (page.match(/meta\s+name="_cp"\s+content="([^"]+)"/i) || [])[1] || "1";
  }
  if (!book) return null;
  if (!pageNo) pageNo = "1";
  const xt = (page.match(/meta\s+name="_c"\s+content="([^"]+)"/i) || [])[1] || "";
  const l = (page.match(/meta\s+name="_l"\s+content="([^"]+)"/i) || [])[1] || "1";
  const res = await fetch(BASE + "/nlinka", { method: "POST", headers: { "user-agent": UA, referer: absolute(url), "content-type": "application/x-www-form-urlencoded", xt, l }, body: `bookId=${encodeURIComponent(book)}&isPay=0&page=${encodeURIComponent(pageNo)}` });
  if (!res.ok) return null;
  const data = await res.json();
  const u = data.ourl || data.url;
  if (!u) return null;
  return { url: absolute(u), referer: absolute(url) };
}

async function missevanAudio(url) {
  const m = String(url).match(/sound\/([0-9]+)|soundid=([0-9]+)/);
  if (!m) return null;
  const id = m[1] || m[2];
  const res = await fetch(`https://www.missevan.com/sound/getsound?soundid=${id}`, { headers: { "user-agent": UA, referer: "https://www.missevan.com/" } });
  if (!res.ok) return null;
  const data = await res.json();
  const snd = (((data || {}).info || {}).sound) || {};
  const u = snd.soundurl_128 || snd.soundurl || snd.videourl;
  if (!u) return null;
  return { url: u, referer: "https://www.missevan.com/" };
}

// ---- exports ----
async function home() {
  const sections = [];
  if (CFG.mode !== "qtfm") {
    try {
      const list = parseList(await html(CFG.homePath || "/"));
      if (list.length) {
        remember(list);
        sections.push({ title: "最新更新", tracks: list.slice(0, 30), pageTitle: CFG.name });
        if (CATS.length) sections.push({ title: "分类", links: CATS.map((c) => ({ title: c.name, page: `cat:${encodeURIComponent(c.id)}:1` })) });
        return { title: CFG.name, subtitle: CFG.subtitle || "", sections };
      }
    } catch (e) {}
  }
  const fallback = await qtTracks(CFG.seed || "有声小说", 16, true);
  if (fallback.length) sections.push({ title: "推荐收听", subtitle: "源站暂时不可用，以下为蜻蜓FM同书兜底", tracks: fallback, pageTitle: "蜻蜓FM" });
  if (CATS.length) sections.push({ title: "分类", links: CATS.map((c) => ({ title: c.name, page: `cat:${encodeURIComponent(c.id)}:1` })) });
  return { title: CFG.name, subtitle: CFG.subtitle || "", sections };
}
async function browse({ page }) {
  const raw = String(page || "");
  if (raw === "categories" || !raw) return { title: `${CFG.name}分类`, sections: [{ title: "分类", links: CATS.map((c) => ({ title: c.name, page: `cat:${encodeURIComponent(c.id)}:1` })) }] };
  const m = raw.match(/^cat:([^:]+):(\d+)$/); if (!m) throw fail("unavailable", "没有这个页面");
  const cat = CATS.find((c) => String(c.id).toLowerCase() === decodeURIComponent(m[1]).toLowerCase());
  if (!cat) throw fail("unavailable", "没有这个分类");
  let list = [];
  try { list = parseList(await html((cat.path || CFG.catPath || "").replace("{id}", encodeURIComponent(cat.id)))); } catch (e) {}
  if (list.length) { remember(list); return { title: cat.name, subtitle: CFG.name, sections: [{ title: cat.name, tracks: list }, { title: "分类", links: CATS.map((c) => ({ title: c.name, page: `cat:${encodeURIComponent(c.id)}:1` })) }] }; }
  const fb = await qtTracks(cat.query || cat.name, 16, true);
  return { title: cat.name, subtitle: "源站暂时不可用，以下为蜻蜓FM兜底", sections: [{ title: cat.name, subtitle: "蜻蜓FM 兜底", tracks: fb }, { title: "分类", links: CATS.map((c) => ({ title: c.name, page: `cat:${encodeURIComponent(c.id)}:1` })) }] };
}
async function search({ query, kind = "tracks", offset = 0 }) {
  if (kind && kind !== "tracks" && kind !== "track") return { tracks: [], more: false };
  const term = String(query || "").trim(); if (!term) return { tracks: [], more: false };
  if (CFG.searchPath) {
    try {
      const list = parseList(await html(CFG.searchPath.replace("{q}", encodeURIComponent(term))));
      if (list.length) { remember(list); return { tracks: list, more: false }; }
    } catch (e) {}
  }
  return { tracks: await qtTracks(term, 20), more: false };
}
async function suggest({ query }) {
  try { return (await qtTracks(String(query || ""), 6)).map((t) => t.name); } catch (e) { return []; }
}
async function stream({ id }) {
  const raw = String(id || "");
  const prog = raw.match(/^qtfm-prog:(\d+):(\d+)$/);
  if (prog) { const r = await qtProg(prog[1], prog[2]); if (!r) throw fail("unavailable", "蜻蜓FM兜底音频暂时取不到"); return r; }
  const qt = raw.match(/^qtfm:(\d+):(\d+)$/);
  if (qt) { const r = await qtChannelStream(qt[1], Number(qt[2]) || 1); if (!r) throw fail("unavailable", "蜻蜓FM兜底音频暂时取不到"); return r; }

  const track = trackBy(raw);
  const url = (track && track._detail) || raw;
  let r = null;
  try {
    if (CFG.mode === "ting55") r = await ting55Audio(url);
    else if (CFG.mode === "missevan") r = await missevanAudio(url);
    else r = await detailAudio(url);
  } catch (e) { r = null; }
  if (r) return { url: r.url, type: streamType(r.url), headers: { referer: r.referer || REFERER, "user-agent": UA }, title: track ? track.name : "" };

  if (track && track.name) { const fb = await qtByName(track.name, 1); if (fb) return fb; }
  throw fail("unavailable", "这段音频暂时播不了：源站地址未解析到，蜻蜓FM也没有找到同名音频");
}
function lyrics() { return {}; }
function like({ id, on }) {
  const k = String(id), ids = new Set(stored("liked", [])), data = stored("likedTracks", {});
  if (on) { ids.add(k); const t = trackBy(k); if (t) { data[k] = t; keep("likedTracks", data); } } else ids.delete(k);
  keep("liked", [...ids]);
}
function isLiked({ ids }) { const s = new Set(stored("liked", [])); const o = {}; for (const id of ids) o[id] = s.has(String(id)); return o; }
function liked({ offset = 0 }) { const ids = stored("liked", []).slice().reverse(); const d = stored("likedTracks", {}); const t = ids.map((id) => d[id]).filter(Boolean).slice(offset, offset + 60); return { tracks: t, more: ids.length > offset + 60 }; }
function played({ id }) {
  const k = String(id), h = stored("history", []).filter((x) => x !== k); h.push(k); keep("history", h.slice(-40));
  const t = knownTracks.get(k); if (t) { const d = stored("historyTracks", {}); d[k] = t; for (const o of Object.keys(d)) if (!h.slice(-40).includes(o)) delete d[o]; keep("historyTracks", d); }
}
function recent() { const ids = stored("history", []).slice(-40).reverse(); const d = stored("historyTracks", {}); return ids.map((id) => d[id] || knownTracks.get(id)).filter(Boolean).slice(0, 20); }
return { home, browse, search, suggest, stream, lyrics, like, isLiked, liked, played, recent };
})(__mfRuntime.host, __mfRuntime.fetch, __mfRuntime.TextDecoder, __mfRuntime.atob, __mfRuntime.btoa, __mfRuntime.URL, __mfRuntime.URLSearchParams);
module.exports = __mfRuntime.makePlugin(__mfPlugin, {"id": "faloo", "name": "飞卢听书", "version": "0.1.1", "site": "ts.faloo.com", "searchTypes": ["music", "album"]});
