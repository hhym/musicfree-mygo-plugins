// 显示名：听友听书（tingyou）
// MusicFree plugin generated from MyGo Music plugin; source site: www.tingyou.fm
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
// 显示名：听友听书（tingyou）
const CFG = {
  id: "tingyou",
  name: "听友听书",
  base: "https://www.tingyou.fm",
  subtitle: "有声小说、评书、广播剧",
};

const BASE = CFG.base;
const API = BASE + "/listening-api";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
const REFERER = BASE + "/listening";
const SUGGEST_TTL = 10 * 60 * 1000;

const CATS = [
  { id: "2", name: "有声小说" },
  { id: "1", name: "评书" },
];
const SORTS = [
  { key: "popular", name: "播放最多" },
  { key: "new", name: "最新发布" },
  { key: "updated", name: "最近更新" },
];

const knownTracks = new Map();

function fail(code, message) { const e = new Error(message || code); e.code = code; return e; }
function stored(k, f) { const v = host.storage.get(k); return v === undefined || v === null ? f : v; }
function keep(k, v) { host.storage.set(k, v); }
function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }
function clean(s) { return String(s == null ? "" : s).replace(/[\s\u00a0]+/g, " ").trim(); }
function catName(id) { const c = CATS.find((x) => x.id === String(id)); return c ? c.name : "分类"; }
function sortName(key) { const s = SORTS.find((x) => x.key === key); return s ? s.name : "综合"; }

/* ---------------------------------------------------------------- api */

async function json(path, opts) {
  const o = opts || {};
  const url = path.startsWith("http") ? path : API + path;
  let last = "";
  for (let i = 0; i < 3; i++) {
    try {
      const headers = {
        "user-agent": UA,
        referer: o.referer || REFERER,
        accept: "application/json",
        "accept-language": "zh-CN,zh;q=0.9",
        "x-listening-timezone": "Asia/Shanghai",
      };
      if (o.body) headers["content-type"] = "application/json";
      const res = await fetch(url, {
        method: o.method || "GET",
        headers,
        body: o.body ? JSON.stringify(o.body) : undefined,
      });
      const text = await res.text();
      if (res.status >= 500) { last = "站点返回了 " + res.status; await wait(600 * (i + 1)); continue; }
      if (!res.ok) throw fail("unavailable", "接口返回了 " + res.status);
      try { return JSON.parse(text); } catch (e) { throw fail("unavailable", "接口返回的不是 JSON"); }
    } catch (e) {
      if (e && e.code) throw e;
      last = (e && e.message) || String(e);
      await wait(600 * (i + 1));
    }
  }
  throw fail("unavailable", last || "接口请求失败");
}

/* ---------------------------------------------------------------- models */

function albumOf(it) {
  const src = it || {};
  return {
    id: String(src.id != null ? src.id : (src.album_id != null ? src.album_id : "")),
    name: clean(src.title || src.name || "未命名专辑"),
    author: clean(src.author || ""),
    teller: clean(src.teller || ""),
    cover: String(src.cover_url || src.cover || "").replace(/\\\//g, "/"),
    count: Number(src.count || 0),
    type: clean(src.type || ""),
    cat: clean(src.cat || ""),
    status: Number(src.status != null ? src.status : 0),
    updated: Number(src.updated_at || 0),
    synopsis: clean(src.synopsis || src.description || src.intro || ""),
  };
}

function albumTrack(a) {
  const t = {
    id: a.id,
    name: a.name,
    artists: a.teller ? [{ name: a.teller }] : [],
    album: { id: a.id, name: a.name, imageUrl: a.cover || "" },
    duration: 0,
  };
  knownTracks.set(t.id, t);
  return t;
}

function trackOf(a, idx, title, duration) {
  const t = {
    id: a.id + ":" + idx,
    name: clean(title || ("第 " + idx + " 集")),
    artists: a.teller ? [{ name: a.teller }] : [],
    album: { id: a.id, name: a.name, imageUrl: a.cover || "" },
    duration: Number(duration || 0),
  };
  knownTracks.set(t.id, t);
  return t;
}

function remember(list) { for (const t of list || []) if (t && t.id) knownTracks.set(String(t.id), t); }
function trackBy(id) { return knownTracks.get(String(id)) || stored("likedTracks", {})[id] || stored("historyTracks", {})[id] || null; }

function noteOf(a) {
  return [
    a.teller ? "播讲：" + a.teller : "",
    a.author ? "作者：" + a.author : "",
    [a.type, a.cat].filter(Boolean).join(" · "),
    a.count ? "共 " + a.count + " 集" : "",
  ].filter(Boolean).join(" · ");
}

function albumCard(id, name, imageUrl) {
  return { id: id, name: name, artists: [], album: { id: id, name: name, imageUrl: imageUrl || "" }, duration: 0 };
}

/* ---------------------------------------------------------------- views */
async function home() {
  const sections = [];
  let latest = null;
  try { latest = await json("/rank?section=latest&page=1"); } catch (e) { latest = null; }
  const latestList = (latest && latest.items ? latest.items : []).map(albumOf).filter((a) => a.id);
  if (latestList.length) sections.push({ title: "最新更新", tracks: latestList.map(albumTrack) });
  let hot = null;
  try { hot = await json("/rank?section=hot&page=1"); } catch (e) { hot = null; }
  const hotList = [];
  const hotIds = new Set(latestList.map((a) => a.id));
  for (const a of (hot && hot.items) || []) {
    const al = albumOf(a);
    if (!al.id || hotIds.has(al.id)) continue;
    hotIds.add(al.id);
    hotList.push(al);
  }
  if (hotList.length) sections.push({ title: "热门播放", tracks: hotList.map(albumTrack) });
  sections.push({
    title: "分类",
    links: [{ title: "有声小说", page: "cat:2:popular:1" }, { title: "评书", page: "cat:1:popular:1" }, { title: "全部分类", page: "categories" }],
  });
  return { title: CFG.name, subtitle: CFG.subtitle, sections };
}
async function browse(args) {
  const raw = String((args && args.page) || "");
  if (!raw || raw === "categories") {
    const sections = [];
    for (const c of CATS) {
      sections.push({ title: c.name, links: SORTS.map((s) => ({ title: s.name, page: "cat:" + c.id + ":" + s.key + ":1" })) });
    }
    sections.push({ title: "榜单", links: [{ title: "最新更新", page: "rank:latest:1" }, { title: "热门播放", page: "rank:hot:1" }] });
    return { title: CFG.name + "分类", sections };
    }

  const cat = /^cat:([0-9]+):([a-z]+):([0-9]+)$/.exec(raw);
  if (cat) {
    const catId = cat[1], sort = cat[2], pageNo = Number(cat[3]) || 1;
    const data = await json("/category?category=" + encodeURIComponent(catId) + "&sort=" + encodeURIComponent(sort) + "&page=" + pageNo);
    const items = (data.data || data.items || []).map(albumOf).filter((a) => a.id);
    remember(items.map(albumTrack));
    const pages = Number(data.pages || 1);
    const sections = [{ title: catName(catId), tracks: items.map(albumTrack) }];
    const more = [];
    if (pageNo < pages) more.push({ title: "下一页", page: "cat:" + catId + ":" + sort + ":" + (pageNo + 1) });
    more.push({ title: "播放最多", page: "cat:" + catId + ":popular:1" }, { title: "最新发布", page: "cat:" + catId + ":new:1" }, { title: "全部分类", page: "categories" });
    sections.push({ title: "更多", links: more });
    return { title: catName(catId), subtitle: CFG.name + " · " + sortName(sort) + " · 第 " + pageNo + " 页", sections };
  }

  const rank = /^rank:([a-z]+):([0-9]+)$/.exec(raw);
  if (rank) {
    const section = rank[1], pageNo = Number(rank[2]) || 1;
    const data = await json("/rank?section=" + encodeURIComponent(section) + "&page=" + pageNo);
    const items = (data.items || []).map(albumOf).filter((a) => a.id);
    const label = section === "hot" ? "热门播放" : "最新更新";
    const sections = [{ title: label, tracks: items.map(albumTrack) }];
    const links = [{ title: "全部分类", page: "categories" }];
    if (data.has_more) links.unshift({ title: "下一页", page: "rank:" + section + ":" + (pageNo + 1) });
    sections.push({ title: "更多", links });
    return { title: label, subtitle: CFG.name + " · 第 " + pageNo + " 页", sections };
  }

  throw fail("unavailable", "没有这个页面");
}
async function album(args) {
  const raw = String((args && args.id) || "");
  const albumId = raw.split(":")[0];
  if (!/^[0-9]+$/.test(albumId)) throw fail("invalid", "没有这本专辑");
  const info = albumOf(await json("/album/" + albumId));
  const chs = await json("/chapters/" + albumId);
  const list = (chs.chapters || [])
    .map((c) => trackOf(info, Number(c.index) || 1, c.title, c.duration))
    .sort((a, b) => Number(a.id.split(":")[1]) - Number(b.id.split(":")[1]));
  remember(list);
  return {
    album: {
      id: info.id,
      name: info.name,
      imageUrl: info.cover || undefined,
      artists: info.teller ? [{ name: info.teller }] : undefined,
      description: [info.synopsis, noteOf(info)].filter(Boolean).join("\n"),
    },
    tracks: list,
  };
}
async function stream(args) {
  const raw = String((args && args.id) || "");
  const parts = raw.split(":");
  let albumId = parts[0];
  let idx = Number(parts[1] || 0);
  if (!/^[0-9]+$/.test(albumId)) throw fail("invalid", "没有这一集");
  if (!idx) {
    const t = trackBy(raw);
    if (t && /^[0-9]+:[0-9]+$/.test(t.id)) { albumId = t.id.split(":")[0]; idx = Number(t.id.split(":")[1]); }
  }
  if (!idx) {
    const chs = await json("/chapters/" + albumId);
    const first = (chs.chapters || [])[0];
    idx = Number(first && first.index) || 1;
  }
  const res = await json("/play", { method: "POST", body: { album_id: albumId, chapter_idx: idx } });
  const url = String(res.play_url || "").replace(/\\\//g, "/");
  if (!/^https?:/i.test(url)) throw fail("unavailable", "接口没有给播放地址");
  const a = trackBy(albumId + ":" + idx);
  return {
    url: url,
    type: "mp3",
    headers: { referer: BASE + "/", "user-agent": UA },
    title: (a && a.name) || "",
  };
}
async function search(args) {
  const query = String((args && args.query) || "").trim();
  const kind = (args && args.kind) || "tracks";
  const offset = Number((args && args.offset) || 0);
  if (kind !== "tracks" && kind !== "track") return { tracks: [], more: false };
  if (!query) return { tracks: [], more: false };
  const pageNo = 1 + Math.floor(offset / 20);
  const data = await json("/search", { method: "POST", body: { keyword: query, page: pageNo }, referer: BASE + "/listening" });
  const items = (data.results || data.items || []).map(albumOf).filter((a) => a.id);
  remember(items);
  const tracks = items.map(albumTrack);
  if (tracks.length) {
    const c = stored("suggestCache", {});
    c[query] = { at: Date.now(), names: tracks.slice(0, 8).map((t) => t.name) };
    const keys = Object.keys(c).sort((x, y) => c[y].at - c[x].at).slice(0, 40);
    const pick = {};
    for (const k of keys) pick[k] = c[k];
    keep("suggestCache", pick);
  }
  return { tracks: tracks, more: !!data.has_more };
}
function suggest(args) {
  const query = String((args && args.query) || "").trim();
  if (!query) return [];
  const c = stored("suggestCache", {});
  const hit = c[query];
  if (hit && Date.now() - hit.at < SUGGEST_TTL) return hit.names || [];
  const core = query.replace(/[《》\s]/g, "").toLowerCase();
  const pool = [];
  const liked = stored("likedTracks", {});
  for (const k of Object.keys(liked)) pool.push(liked[k]);
  for (const t of knownTracks.values()) pool.push(t);
  const seen = new Set();
  const names = [];
  for (const t of pool) {
    if (!t || !t.name || !/^[0-9]+$/.test(String(t.id))) continue;
    const n = t.name.replace(/\s/g, "").toLowerCase();
    if (n.indexOf(core) < 0 || seen.has(t.name)) continue;
    seen.add(t.name);
    names.push(t.name);
    if (names.length >= 6) break;
  }
  return names;
}
function lyrics() { return { lrc: "" }; }

/* ---------------------------------------------------------------- library */
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
  keep("history", h.slice(-60));
  const t = knownTracks.get(k);
  if (t) {
    const d = stored("historyTracks", {});
    d[k] = t;
    for (const o of Object.keys(d)) if (h.slice(-60).indexOf(o) < 0) delete d[o];
    keep("historyTracks", d);
  }
}
function recent() {
  const ids = stored("history", []).slice(-40).reverse();
  const d = stored("historyTracks", {});
  return ids.map((id) => d[id] || knownTracks.get(id)).filter(Boolean).slice(0, 20);
}
return { home, browse, album, stream, search, suggest, lyrics, like, isLiked, liked, played, recent };
})(__mfRuntime.host, __mfRuntime.fetch, __mfRuntime.TextDecoder, __mfRuntime.atob, __mfRuntime.btoa, __mfRuntime.URL, __mfRuntime.URLSearchParams);
module.exports = __mfRuntime.makePlugin(__mfPlugin, {"id": "tingyou", "name": "听友听书", "version": "0.1.0", "site": "www.tingyou.fm", "searchTypes": ["music", "album"]});
