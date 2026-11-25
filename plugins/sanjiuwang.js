// 显示名：三九听书（sanjiuwang）
// MusicFree plugin generated from MyGo Music plugin; source site: sanjiuwang.com
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
// 显示名：三九听书（sanjiuwang）
const CFG = {
  id: "sanjiuwang",
  name: "三九听书",
  base: "https://sanjiuwang.com",
  details: ["mp3"],
  subtitle: "有声小说、评书",
};

const BASE = CFG.base;
const REFERER = BASE + "/";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
const PAGE_TTL = 5 * 60 * 1000;
const INDEX_TTL = 30 * 60 * 1000;

const detailRe = new RegExp("^(?:/" + CFG.details.join("/|/") + ")/[0-9]+\\.html$");
const playRe = /^\/play\/[0-9]+-[0-9]+-[0-9]+\.html$/;
const catRe = /^(\/[a-z0-9]+)\/([0-9]+)(?:-([0-9]+))?\.html$/;

const pageCache = new Map();
const knownTracks = new Map();

function fail(code, message) { const e = new Error(message || code); e.code = code; return e; }
function stored(k, f) { const v = host.storage.get(k); return v === undefined || v === null ? f : v; }
function keep(k, v) { host.storage.set(k, v); }
function unescapeHtml(s) {
  return String(s).replace(/&#x([0-9a-fA-F]+);/g, (m, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(Number(d)))
    .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (m, n) => ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " })[n])
    .replace(/&[a-zA-Z]+;/g, " ");
}
function clean(s) { return unescapeHtml(String(s || "").replace(/<[^>]+>/g, " ")).replace(/[\s\u00a0]+/g, " ").trim(); }
function absolute(u) {
  if (!u) return "";
  let x = String(u).trim().replace(/\\\//g, "/");
  if (x.startsWith("//")) return "https:" + x;
  if (x.startsWith("/")) return BASE + x;
  return x;
}
function attr(tag, name) {
  const r = new RegExp(name + "\\s*=\\s*(\"([^\"]*)\"|'([^']*)'|([^\\s>]+))", "i");
  const m = r.exec(tag);
  return m ? (m[2] !== undefined ? m[2] : m[3] !== undefined ? m[3] : m[4]) : "";
}
function imageFrom(html) {
  for (const m of [...String(html).matchAll(/<img\b([^>]*?)>/gi)]) {
    const src = attr(m[0], "data-original") || attr(m[0], "data-src") || attr(m[0], "src");
    if (src && !/none|blank|loading|lazy\.gif|placeholder|load\.png/i.test(src)) {
      const a = absolute(src);
      if (/\.(jpg|jpeg|png|webp)/i.test(a) || /xmcdn|img/i.test(a)) return a;
    }
  }
  return "";
}
function makeTrack(id, name, extra) {
  const e = extra || {};
  return {
    id: String(id),
    name: clean(name),
    artists: e.artists || [],
    album: e.album || { id: "", name: "", imageUrl: "" },
    duration: 0,
  };
}
function remember(list) { for (const t of list || []) if (t && t.id) knownTracks.set(String(t.id), t); }
function trackBy(id) { return knownTracks.get(String(id)) || stored("likedTracks", {})[id] || stored("historyTracks", {})[id] || null; }

async function request(path, options) {
  const o = options || {};
  const url = path.startsWith("http") ? path : BASE + path;
  let res;
  try {
    res = await fetch(url, {
      method: o.method || "GET",
      headers: {
        "user-agent": UA,
        referer: o.referer || REFERER,
        "accept-language": "zh-CN,zh;q=0.9",
        accept: "text/html,*/*",
      },
      body: o.body,
    });
  } catch (e) {
    throw fail("unavailable", "连不上 " + BASE + "：" + (e && e.message ? e.message : e));
  }
  if (!res.ok) throw fail("unavailable", BASE + " 返回了 " + res.status);
  return res;
}

async function html(path, options) {
  const o = options || {};
  const key = (path.startsWith("http") ? path : BASE + path) + "|" + (o.referer || "");
  const cached = pageCache.get(key);
  if (cached && Date.now() - cached.at < PAGE_TTL) return cached.text;
  const res = await request(path, o);
  const text = await res.text();
  if (/系统安全验证|请输入正确的验证码/.test(text)) throw fail("blocked", "站点要求验证码，这一页取不到");
  pageCache.set(key, { text, at: Date.now() });
  if (pageCache.size > 100) {
    const oldest = [...pageCache.entries()].sort((a, b) => a[1].at - b[1].at)[0];
    if (oldest) pageCache.delete(oldest[0]);
  }
  return text;
}

function cardList(page, limit) {
  const s = String(page || "");
  const out = [];
  const seen = new Set();
  for (const m of s.matchAll(/<a\b([^>]*)>([\s\S]{0,400}?)<\/a>/gi)) {
    const tag = m[1] || "";
    const href = attr(tag, "href");
    if (!href) continue;
    const path = href.startsWith("http") ? (href.indexOf(BASE) === 0 ? href.slice(BASE.length) : "") : href;
    if (!path || !detailRe.test(path) || seen.has(path)) continue;
    const name = clean(attr(tag, "title") || (m[2].match(/class="name"[^>]*>([^<]+)</) || [])[1] || m[2]);
    if (!name || name.length < 2 || name.length > 70) continue;
    if (/^(首页|分类|搜索|全部|更多|下一页|上一页|播放|收听|下载|排行)$/.test(name)) continue;
    seen.add(path);
    const around = s.slice(Math.max(0, (m.index || 0) - 400), Math.min(s.length, (m.index || 0) + 400));
    const cover = imageFrom(around);
    const track = makeTrack(path, name, { album: { id: path, name: CFG.name, imageUrl: cover } });
    knownTracks.set(String(track.id), track);
    out.push(track);
    if (limit && out.length >= limit) break;
  }
  return out;
}

function catList(page) {
  const s = String(page || "");
  const out = [];
  const seen = new Set();
  for (const m of s.matchAll(/<a\b([^>]*)>([^<]{1,12})<\/a>/gi)) {
    const href = attr(m[1] || "", "href");
    if (!href || href.indexOf("http") === 0) continue;
    const mm = catRe.exec(href);
    if (!mm || mm[3]) continue;
    const prefix = mm[1];
    if (CFG.details.indexOf(prefix.slice(1)) >= 0) continue;
    const name = clean(m[2]);
    if (!name || name.length < 2 || name.length > 8) continue;
    if (/^(首页|搜索|排行|全部|更多|下一页|上一页|登录|注册|最新|热门)$/.test(name)) continue;
    const key = prefix + "/" + mm[2];
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ id: key, name: name, prefix: prefix, tid: mm[2] });
  }
  return out.slice(0, 16);
}

let catCache = null;
async function categories() {
  if (catCache) return catCache;
  const cats = catList(await html(CFG.homePath || "/"));
  if (cats.length) catCache = cats;
  return cats;
}

function catLinks() {
  return [];
}

async function bookInfo(path) {
  const page = await html(path);
  const title = clean(
    (page.match(/<title>《(.+?)》/) || [])[1] ||
    (page.match(/<em>([^<]{2,60})<\/em>/) || [])[1] ||
    ""
  );
  const cover = imageFrom(page) || (page.match(/https?:\/\/imagev2\.xmcdn\.com[^\s"'<>]+\.(?:jpg|png|webp)/i) || [])[0] || "";
  const anchor = clean((page.match(/播讲：<\/span>(?:<a[^>]*>)?([^<]{1,20})/) || [])[1] || (page.match(/主播[:：]<\/?[^>]*>([^<]{1,20})/) || [])[1] || "");
  const author = clean((page.match(/作者：<\/span>(?:<a[^>]*>)?([^<]{1,20})/) || [])[1] || "");
  const type = clean((page.match(/类型：<\/span>([^<]{1,12})/) || [])[1] || "");
  const desc = clean((page.match(/<meta\s+name="description"\s+content="([^"]+)"/i) || [])[1] || "");
  const chapters = [];
  const seen = new Set();
  for (const m of page.matchAll(/<a\b([^>]*)>([\s\S]{0,120}?)<\/a>/gi)) {
    const href = attr(m[1] || "", "href");
    if (!href) continue;
    const p = href.startsWith("http") ? (href.indexOf(BASE) === 0 ? href.slice(BASE.length) : "") : href;
    if (!playRe.test(p) || seen.has(p)) continue;
    seen.add(p);
    const name = clean(m[2]);
    if (!name) continue;
    chapters.push({ path: p, name: name });
  }
  return { title: title || "未命名", cover: absolute(cover), anchor: anchor, author: author, type: type, desc: desc, chapters: chapters };
}

function chaptersToTracks(path, info) {
  const albumId = path;
  return info.chapters.map((c, i) =>
    makeTrack(c.path, c.name || "第 " + (i + 1) + " 集", {
      album: { id: albumId, name: info.title, imageUrl: info.cover },
      artists: info.anchor ? [{ name: info.anchor, id: "" }] : [],
    })
  );
}

async function audioOf(path) {
  const page = await html(path);
  const now = (page.match(/var\s+now\s*=\s*["']([^"']+)["']/) || [])[1];
  if (now) return { url: absolute(now), referer: BASE + path };
  const audios = [...page.matchAll(/https?:\/\/[^\s"'<>\\]+\.(?:m4a|mp3)(?:\?[^\s"'<>\\]*)?/gi)].map((m) => m[0]);
  const uniq = [];
  for (const a of audios) if (uniq.indexOf(a) < 0) uniq.push(a);
  if (uniq.length) return { url: uniq[0], referer: BASE + path };
  return null;
}

/* ---------------------------------------------------------------- search index */

const INDEX_KEY = "searchIndex";

async function scanIndex() {
  const cached = stored(INDEX_KEY, null);
  if (cached && cached.at && Date.now() - cached.at < INDEX_TTL && (cached.items || []).length) return cached.items;
  const cats = await categories();
  const items = [];
  const seen = new Set();
  for (const c of cats.slice(0, 8)) {
    for (let page = 1; page <= 2; page++) {
      try {
        const path = page === 1 ? c.prefix + "/" + c.tid + ".html" : c.prefix + "/" + c.tid + "-" + page + ".html";
        const list = cardList(await html(path), 30);
        for (const t of list) if (!seen.has(t.id)) { seen.add(t.id); items.push({ id: t.id, name: t.name, imageUrl: t.album && t.album.imageUrl }); }
      } catch (e) { /* 单页失败不影响索引 */ }
    }
  }
  if (items.length) keep(INDEX_KEY, { at: Date.now(), items: items.slice(0, 1200) });
  return items;
}
async function search(args) {
  const query = String((args && args.query) || "").trim();
  const kind = (args && args.kind) || "tracks";
  const offset = Number((args && args.offset) || 0);
  if (kind !== "tracks" && kind !== "track") return { tracks: [], more: false };
  if (!query) return { tracks: [], more: false };
  if (/\d{2,}/.test(query) && query.length < 4) {
    return { tracks: [], more: false };
  }
  const items = await scanIndex();
  const core = query.replace(/[《》\s]/g, "").toLowerCase();
  const hits = items
    .filter((it) => it.name.replace(/\s/g, "").toLowerCase().indexOf(core) >= 0)
    .slice(0, 60);
  const tracks = hits.map((it) => makeTrack(it.id, it.name, { album: { id: it.id, name: CFG.name, imageUrl: it.imageUrl || "" } }));
  remember(tracks);
  return { tracks: tracks.slice(offset, offset + 20), more: tracks.length > offset + 20 };
}
function suggest(args) {
  const query = String((args && args.query) || "").trim();
  if (!query) return [];
  const items = (stored(INDEX_KEY, { items: [] }).items || []);
  const core = query.replace(/[《》\s]/g, "").toLowerCase();
  return items.filter((it) => it.name.replace(/\s/g, "").toLowerCase().indexOf(core) >= 0).slice(0, 6).map((it) => it.name);
}

/* ---------------------------------------------------------------- views */
async function home() {
  const page = await html(CFG.homePath || "/");
  const list = cardList(page, 40);
  const cats = catList(page);
  if (cats.length) catCache = cats;
  remember(list);
  const sections = [];
  if (list.length) sections.push({ title: "最新更新", tracks: list, pageTitle: CFG.name });
  if (cats.length) sections.push({ title: "分类", links: cats.map((c) => ({ title: c.name, page: "cat:" + c.prefix + ":" + c.tid + ":1" })) });
  return { title: CFG.name, subtitle: CFG.subtitle, sections: sections };
}
async function browse(args) {
  const raw = String((args && args.page) || "");
  const cats = await categories();
  const links = cats.map((c) => ({ title: c.name, page: "cat:" + c.prefix + ":" + c.tid + ":1" }));
  if (!raw || raw === "categories") return { title: CFG.name + "分类", sections: [{ title: "分类", links: links }] };
  const m = /^cat:(\/[a-z0-9]+):([0-9]+):([0-9]+)$/.exec(raw);
  if (!m) throw fail("unavailable", "没有这个页面");
  const prefix = m[1], tid = m[2], pageNo = Number(m[3]) || 1;
  const name = (cats.find((c) => c.prefix === prefix && c.tid === tid) || {}).name || "分类";
  const path = pageNo === 1 ? prefix + "/" + tid + ".html" : prefix + "/" + tid + "-" + pageNo + ".html";
  const list = cardList(await html(path), 40);
  const next = pageNo < 40 && list.length >= 10 ? [{ title: "下一页", page: "cat:" + prefix + ":" + tid + ":" + (pageNo + 1) }] : [];
  return {
    title: name,
    subtitle: CFG.name + " · 第 " + pageNo + " 页",
    sections: [{ title: name, tracks: list }].concat(next.length ? [{ title: "更多", links: next.concat(links.slice(0, 6)) }] : [{ title: "分类", links: links }]),
  };
}
async function album(args) {
  let key = String((args && args.id) || "");
  if (!key.startsWith("/")) {
    const t = trackBy(key);
    if (t) key = t.id;
  }
  if (!key.startsWith("/")) throw fail("invalid", "没有这本专辑");
  const info = await bookInfo(key);
  const tracks = chaptersToTracks(key, info);
  remember(tracks);
  const notes = [
    info.anchor ? "播讲：" + info.anchor : "",
    info.author ? "作者：" + info.author : "",
    info.type ? "类型：" + info.type : "",
    info.chapters.length ? "共 " + info.chapters.length + " 集" : "",
  ].filter(Boolean).join(" · ");
  return {
    album: {
      id: key,
      name: info.title,
      imageUrl: info.cover || undefined,
      artists: info.anchor ? [{ name: info.anchor }] : undefined,
      description: [info.desc, notes].filter(Boolean).join("\n"),
    },
    tracks: tracks,
  };
}
async function stream(args) {
  const raw = String((args && args.id) || "");
  let path = raw;
  if (!path.startsWith("/")) {
    const t = trackBy(raw);
    if (t) path = t.id;
  }
  if (!path.startsWith("/")) throw fail("invalid", "没有这一集");
  let target = path;
  if (!playRe.test(path)) {
    const info = await bookInfo(path);
    if (!info.chapters.length) throw fail("unavailable", "这本书没有可播的章节");
    target = info.chapters[0].path;
  }
  const audio = await audioOf(target);
  if (!audio) throw fail("unavailable", "播放页里没有找到音频地址");
  return {
    url: audio.url,
    type: /\.mp3(?:$|\?)/i.test(audio.url) ? "mp3" : "m4a",
    headers: { referer: audio.referer, "user-agent": UA },
    title: (trackBy(raw) || {}).name || "",
  };
}
function lyrics() { return { lrc: "" }; }
function like(args) {
  const k = String((args && args.id) || "");
  const ids = new Set(stored("liked", []));
  const data = stored("likedTracks", {});
  if (args && args.on) {
    ids.add(k);
    const t = trackBy(k);
    if (t) { data[k] = t; keep("likedTracks", data); }
  } else ids.delete(k);
  keep("liked", [...ids]);
}
function isLiked(args) {
  const s = new Set(stored("liked", []));
  const out = {};
  for (const id of (args && args.ids) || []) out[id] = s.has(String(id));
  return out;
}
function liked(args) {
  const offset = Number((args && args.offset) || 0);
  const ids = stored("liked", []).slice().reverse();
  const d = stored("likedTracks", {});
  const t = ids.map((id) => d[id]).filter(Boolean).slice(offset, offset + 60);
  return { tracks: t, more: ids.length > offset + 60 };
}
function played(args) {
  const k = String((args && args.id) || "");
  const h = stored("history", []).filter((x) => x !== k);
  h.push(k);
  keep("history", h.slice(-40));
  const t = knownTracks.get(k);
  if (t) {
    const d = stored("historyTracks", {});
    d[k] = t;
    for (const o of Object.keys(d)) if (h.slice(-40).indexOf(o) < 0) delete d[o];
    keep("historyTracks", d);
  }
}
function recent() {
  const ids = stored("history", []).slice(-40).reverse();
  const d = stored("historyTracks", {});
  return ids.map((id) => d[id] || knownTracks.get(id)).filter(Boolean).slice(0, 20);
}
return { search, suggest, home, browse, album, stream, lyrics, like, isLiked, liked, played, recent };
})(__mfRuntime.host, __mfRuntime.fetch, __mfRuntime.TextDecoder, __mfRuntime.atob, __mfRuntime.btoa, __mfRuntime.URL, __mfRuntime.URLSearchParams);
module.exports = __mfRuntime.makePlugin(__mfPlugin, {"id": "sanjiuwang", "name": "三九听书", "version": "0.1.0", "site": "sanjiuwang.com", "searchTypes": ["music", "album"]});
