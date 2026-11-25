// 显示名：石头听书（shitou）
// MusicFree plugin generated from MyGo Music plugin; source site: www.shitou.club
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
// 显示名：石头听书（shitou）
// 站点自己不放音频：每本书是一篇文章(/p/<id>.html)，正文里嵌一个 B 站播放器 iframe，
// 音频要从 B 站 dash 取（m4s，AAC-LC）：应用自己就能读这种分片，直接交给它边下边播；
// 本机有 ffmpeg 时先重封装成 .m4a，拖动更快。
const CFG = {
  id: "shitou",
  name: "石头听书",
  base: "https://www.shitou.club",
  subtitle: "有声书、小说合集（音频来自 B 站）",
};

const BASE = CFG.base;
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
const BILI_REFERER = "https://www.bilibili.com/";
const PAGE_TTL = 5 * 60 * 1000;
const MAP_TTL = 6 * 60 * 60 * 1000;
const SEP = String(host.dir || "").indexOf("\\") >= 0 ? "\\" : "/";

const pageCache = new Map();
const knownTracks = new Map();

function fail(code, message) { const e = new Error(message || code); e.code = code; return e; }
function stored(k, f) { const v = host.storage.get(k); return v === undefined || v === null ? f : v; }
function keep(k, v) { host.storage.set(k, v); }
function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }
function clean(s) { return String(s == null ? "" : s).replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/[\s\u00a0]+/g, " ").trim(); }
function absolute(u) {
  const s = String(u || "").trim().replace(/\\\//g, "/");
  if (!s) return "";
  if (s.startsWith("//")) return "https:" + s;
  if (s.startsWith("/")) return BASE + s;
  return s;
}
function attr(tag, name) {
  const r = new RegExp(name + "\\s*=\\s*(\"([^\"]*)\"|'([^']*)')", "i");
  const m = r.exec(tag);
  return m ? (m[2] !== undefined ? m[2] : m[3]) : "";
}

async function getText(path, referer) {
  const url = path.startsWith("http") ? path : BASE + path;
  const cached = pageCache.get(url);
  if (cached && Date.now() - cached.at < PAGE_TTL) return cached.text;
  let last = "";
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          "user-agent": UA,
          referer: referer || BASE + "/",
          accept: "text/html,application/xhtml+xml",
          "accept-language": "zh-CN,zh;q=0.9",
        },
      });
      const text = await res.text();
      if (res.status >= 500 || text.length < 200) { last = "站点返回了 " + res.status; await wait(1500 * (i + 1)); continue; }
      if (!res.ok) throw fail("unavailable", "站点返回了 " + res.status);
      pageCache.set(url, { text, at: Date.now() });
      if (pageCache.size > 40) {
        const oldest = [...pageCache.entries()].sort((a, b) => a[1].at - b[1].at)[0];
        if (oldest) pageCache.delete(oldest[0]);
      }
      return text;
    } catch (e) {
      if (e && e.code) throw e;
      last = (e && e.message) || String(e);
      await wait(1500 * (i + 1));
    }
  }
  throw fail("unavailable", last || "连不上 " + BASE);
}

/* ---------------------------------------------------------------- bilibili */

async function biliJson(path) {
  const url = "https://api.bilibili.com" + path;
  let last = "";
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          "user-agent": UA,
          referer: BILI_REFERER,
          cookie: "buvid3=" + await buvid(),
          accept: "application/json",
        },
      });
      const text = await res.text();
      if (res.status === 412 || res.status >= 500) { last = "B 站返回了 " + res.status; await wait(1200 * (i + 1)); continue; }
      let data;
      try { data = JSON.parse(text); } catch (e) { throw fail("unavailable", "B 站返回的不是 JSON"); }
      if (data && data.code === -404) throw fail("invalid", "B 站上没有这个视频：" + (data.message || ""));
      if (data && data.code !== 0) throw fail("unavailable", "B 站：" + (data.message || data.code));
      return data.data;
    } catch (e) {
      if (e && e.code) throw e;
      last = (e && e.message) || String(e);
      await wait(1200 * (i + 1));
    }
  }
  throw fail("unavailable", last || "B 站接口请求失败");
}

async function buvid() {
  const cached = stored("buvid3", "");
  if (cached) return cached;
  try {
    const res = await fetch("https://api.bilibili.com/x/frontend/finger/spi", {
      headers: { "user-agent": UA, referer: BILI_REFERER },
    });
    const data = await res.json();
    const v = String((data && data.data && data.data.b_3) || "");
    if (v) keep("buvid3", v);
    return v;
  } catch (e) {
    return "";
  }
}

async function videoInfo(bvid) {
  const key = "video:" + bvid;
  const cached = stored(key, null);
  if (cached && Date.now() - cached.at < MAP_TTL && cached.pages) return cached;
  const data = await biliJson("/x/web-interface/view?bvid=" + encodeURIComponent(bvid));
  const info = {
    at: Date.now(),
    bvid: bvid,
    title: clean(data.title || ""),
    pages: (data.pages || []).map((p) => ({ page: Number(p.page) || 0, cid: String(p.cid || ""), part: clean(p.part || ""), duration: Number(p.duration) || 0 })),
  };
  keep(key, info);
  return info;
}

async function audioUrl(bvid, cid) {
  const data = await biliJson("/x/player/playurl?bvid=" + encodeURIComponent(bvid) + "&cid=" + encodeURIComponent(cid) + "&fnval=16&fourk=1");
  const auds = (data && data.dash && data.dash.audio) || [];
  if (!auds.length) throw fail("unavailable", "B 站没有给这条视频的音频流");
  const sorted = auds.slice().sort((a, b) => (Number(b.bandwidth) || 0) - (Number(a.bandwidth) || 0));
  const best = sorted.find((a) => /mp4a/i.test(String(a.codecs || ""))) || sorted[0];
  const url = String(best.baseUrl || best.base_url || "");
  if (!/^https?:/i.test(url)) throw fail("unavailable", "B 站音频地址无效");
  return url;
}

/* ---------------------------------------------------------------- ffmpeg */

function fileFor(pid, page) {
  const dir = String(host.dataDir || "").replace(/[\\/]+$/, "");
  return dir + SEP + "shitou-" + pid + "-" + (page % 4) + ".m4a";
}
function toFileUrl(p) {
  return "file://" + p.split("/").map((part) => encodeURIComponent(part).replace(/%3A/gi, ":")).join("/");
}
function candidates() {
  const list = [];
  const custom = typeof host.setting === "function" ? host.setting("ffmpegPath") : "";
  if (custom) list.push(custom);
  const platform = host.platform || "";
  if (platform === "darwin") list.push("/opt/homebrew/bin/ffmpeg", "/usr/local/bin/ffmpeg", "/usr/bin/ffmpeg");
  else if (platform === "win32") list.push("ffmpeg.exe", "C:\\ffmpeg\\bin\\ffmpeg.exe");
  else list.push("/usr/bin/ffmpeg", "/usr/local/bin/ffmpeg", "/snap/bin/ffmpeg");
  list.push("ffmpeg");
  return [...new Set(list)];
}

async function remux(url, path, copyOnly) {
  if (typeof host.spawn !== "function") throw new Error("host.spawn is not available");
  let last = "";
  for (const bin of candidates()) {
    let p;
    const audioArgs = copyOnly ? ["-c:a", "copy"] : ["-c:a", "aac", "-b:a", "64k"];
    try {
      p = host.spawn(bin, [
        "-y", "-hide_banner", "-loglevel", "error",
        "-user_agent", UA,
        "-headers", "Referer: " + BILI_REFERER + "\r\n",
        "-i", url, "-vn", ...audioArgs,
        "-movflags", "+faststart", path,
      ]);
    } catch (e) { last = bin + ": " + e; continue; }
    if (!p) { last = bin + ": spawn refused"; continue; }
    let code = 0;
    try { code = await p.wait(); } catch (e) { last = bin + ": " + e; continue; }
    let said = "";
    try { said = (await p.errorOutput()) || ""; } catch (e) { said = ""; }
    if (code === undefined || code === null || code === 0) return;
    last = bin + ": " + (String(said).trim().slice(0, 160) || "exit " + code);
  }
  throw new Error(last || "ffmpeg not found");
}

/* ---------------------------------------------------------------- parcels */

function parseCards(html, limit) {
  const s = String(html || "");
  const out = [];
  const seen = new Set();
  for (const m of s.matchAll(/<a\s+href="\/p\/([0-9]+)\.html"[^>]*title="([^"]*)"/g)) {
    const id = m[1];
    if (seen.has(id)) continue;
    seen.add(id);
    const title = clean(m[2]);
    if (!title) continue;
    const around = s.slice(Math.max(0, m.index - 600), Math.min(s.length, m.index + 900));
    const coverRaw = (/data-original="([^"]+)"/.exec(around) || [])[1] || (/<img[^>]+src="([^"]+)"/.exec(around) || [])[1] || "";
    const cat = clean((/<a href="\/list\/cls\/[0-9]+\.html"[^>]*>([^<]*)<\/a>/.exec(around) || [])[1] || "");
    out.push({ id, name: title, cover: absolute(coverRaw), cat });
    if (out.length >= (limit || 40)) break;
  }
  return out;
}

function parseCats(html) {
  const out = new Map();
  for (const m of String(html || "").matchAll(/<a href="\/list\/cls\/([0-9]+)\.html"[^>]*>([^<]{1,20})<\/a>/g)) {
    const id = m[1];
    const name = clean(m[2]);
    if (!name || name.length < 2) continue;
    if (!out.has(id)) out.set(id, name);
  }
  return [...out.entries()].map(([id, name]) => ({ id, name }));
}

function parseAlbum(html, id) {
  const s = String(html || "");
  const titleTag = (/<title>([\s\S]*?)<\/title>/i.exec(s) || [])[1] || "";
  const title = clean(titleTag);
  const book = (title.match(/《([^》]+)》/) || [])[1] || clean(title.split(" - ")[0]);
  const author = (title.match(/作者[：:]\s*([^）)】]+)/) || [])[1] || "";
  const cat = (title.match(/【([^】]+)】/) || [])[1] || "";
  const bvid = ((/player\.bilibili\.com\/player\.html\?[^"']*bvid=([A-Za-z0-9]+)/.exec(s) || [])[1] || (/bvid=([A-Za-z0-9]+)/.exec(s) || [])[1] || "");
  const desc = clean((/<meta name="description" content="([^"]*)"/.exec(s) || [])[1] || "");
  let cover = "";
  for (const m of s.matchAll(/data-original="([^"]+)"/g)) {
    const u = absolute(m[1]);
    if (/hdslb\.com/i.test(u)) { cover = u.split("@")[0]; break; }
  }
  return { id, title: clean(book), author: clean(author), cat: clean(cat), bvid, desc, cover };
}

function trackOf(a, page, part, duration) {
  const t = {
    id: a.id + ":" + page,
    name: clean(part || ("第 " + page + " 集")),
    artists: a.author ? [{ name: a.author }] : [],
    album: { id: a.id, name: a.title, imageUrl: a.cover || "" },
    duration: Number(duration || 0),
  };
  knownTracks.set(t.id, t);
  return t;
}
function remember(list) { for (const t of list || []) if (t && t.id) knownTracks.set(String(t.id), t); }
function trackBy(id) { return knownTracks.get(String(id)) || stored("likedTracks", {})[id] || stored("historyTracks", {})[id] || null; }

function albumEntry(c) {
  const rec = stored("albums", {});
  if (c && c.id) {
    rec[c.id] = { name: c.name, cover: c.cover || "", cat: c.cat || "" };
    const keys = Object.keys(rec);
    if (keys.length > 400) for (const k of keys.slice(0, keys.length - 400)) delete rec[k];
    keep("albums", rec);
  }
  return {
    id: c.id,
    name: c.name,
    artists: [],
    album: { id: c.id, name: c.name, imageUrl: c.cover || "" },
    duration: 0,
  };
}

/* ---------------------------------------------------------------- views */
async function home() {
  const html = await getText("/list/cls/10042.html");
  const list = parseCards(html, 40);
  const cats = parseCats(html);
  remember(list.map((c) => ({ id: c.id, name: c.name, artists: [], album: { id: c.id, name: c.name, imageUrl: c.cover || "" }, duration: 0 })));
  const sections = [];
  if (list.length) sections.push({ title: "有声书 · 最新", tracks: list.map(albumEntry) });
  if (cats.length) sections.push({ title: "分类", links: cats.map((c) => ({ title: c.name, page: "cat:" + c.id + ":1" })) });
  return { title: CFG.name, subtitle: CFG.subtitle, sections };
}
async function browse(args) {
  const raw = String((args && args.page) || "");
  if (!raw || raw === "categories") {
    const cats = parseCats(await getText("/list/cls/10042.html"));
    return {
      title: CFG.name + "分类",
      sections: [{ title: "分类", links: cats.map((c) => ({ title: c.name, page: "cat:" + c.id + ":1" })) }],
    };
  }
  const m = /^cat:([0-9]+):([0-9]+)$/.exec(raw);
  if (!m) throw fail("unavailable", "没有这个页面");
  const tid = m[1], pageNo = Number(m[2]) || 1;
  const html = await getText("/list/cls/" + tid + ".html" + (pageNo > 1 ? "?page=" + pageNo : ""));
  const list = parseCards(html, 40);
  const cats = parseCats(html);
  const term = clean((/<h1 class="term-title">([^<]*)<\/h1>/.exec(html) || [])[1] || "分类");
  const tracks = list.map(albumEntry);
  const links = [];
  if (list.length >= 10) links.push({ title: "下一页", page: "cat:" + tid + ":" + (pageNo + 1) });
  for (const c of cats.slice(0, 6)) links.push({ title: c.name, page: "cat:" + c.id + ":1" });
  return {
    title: term,
    subtitle: CFG.name + " · 第 " + pageNo + " 页",
    sections: [{ title: term, tracks }].concat(links.length ? [{ title: "更多", links }] : []),
  };
}
async function album(args) {
  const raw = String((args && args.id) || "");
  const pid = raw.split(":")[0];
  if (!/^[0-9]+$/.test(pid)) throw fail("invalid", "没有这本书");
  const info = parseAlbum(await getText("/p/" + pid + ".html"), pid);
  if (!info.bvid) throw fail("unavailable", "这一页没有 B 站视频，播不了");
  const video = await videoInfo(info.bvid);
  const a = { id: pid, title: info.title || video.title, author: info.author, cover: info.cover, cat: info.cat };
  const list = video.pages.map((p) => trackOf(a, p.page, p.part, p.duration));
  remember(list);
  const notes = [
    info.author ? "作者：" + info.author : "",
    info.cat ? "分类：" + info.cat : "",
    "共 " + list.length + " 集（音频取自 B 站：" + info.bvid + "）",
  ].filter(Boolean).join(" · ");
  return {
    album: {
      id: pid,
      name: a.title,
      imageUrl: a.cover || undefined,
      artists: a.author ? [{ name: a.author }] : undefined,
      description: [info.desc, notes].filter(Boolean).join("\n"),
    },
    tracks: list,
  };
}
async function stream(args) {
  const raw = String((args && args.id) || "");
  const parts = raw.split(":");
  let pid = parts[0];
  let pageNo = Number(parts[1] || 0);
  if (!/^[0-9]+$/.test(pid)) throw fail("invalid", "没有这一集");
  if (!pageNo) {
    const t = trackBy(raw);
    if (t && /^[0-9]+:[0-9]+$/.test(t.id)) { pid = t.id.split(":")[0]; pageNo = Number(t.id.split(":")[1]); }
  }
  if (!pageNo) pageNo = 1;
  const info = parseAlbum(await getText("/p/" + pid + ".html"), pid);
  if (!info.bvid) throw fail("unavailable", "这一页没有 B 站视频，播不了");
  const video = await videoInfo(info.bvid);
  const item = video.pages.find((p) => p.page === pageNo) || video.pages[0];
  if (!item || !item.cid) throw fail("unavailable", "B 站视频里没有第 " + pageNo + " 集");
  const src = await audioUrl(info.bvid, item.cid);
  const title = (trackBy(pid + ":" + pageNo) || {}).name || item.part || "";

  /* 应用读得懂 B 站的 m4s（fMP4 里的 AAC-LC），可以直接边下边播；本机有 ffmpeg 时
     先重封装一份到本地，换到可拖动的文件。没有 ffmpeg、或插件没有运行程序的权限，
     就别拦着——把 dash 地址原样交出去。 */
  const direct = { url: src, type: "m4a", headers: { "user-agent": UA, referer: BILI_REFERER }, title };
  if (typeof host.spawn !== "function") return direct;

  const path = fileFor(pid, pageNo);
  const file = { url: toFileUrl(path), type: "m4a", headers: { "user-agent": UA, referer: BILI_REFERER }, title };
  try {
    await remux(src, path, true);
    return file;
  } catch (e) {
    try { await remux(src, path, false); return file; } catch (e2) { return direct; }
  }
}
async function search(args) {
  const query = String((args && args.query) || "").trim();
  const kind = (args && args.kind) || "tracks";
  const offset = Number((args && args.offset) || 0);
  if (kind !== "tracks" && kind !== "track") return { tracks: [], more: false };
  if (!query) return { tracks: [], more: false };
  const pageNo = 1 + Math.floor(offset / 20);
  const html = await getText("/?s=" + encodeURIComponent(query) + (pageNo > 1 ? "&paged=" + pageNo : ""));
  const list = parseCards(html, 40);
  const tracks = list.map(albumEntry);
  return { tracks, more: list.length >= 20 };
}
function suggest(args) {
  const query = String((args && args.query) || "").trim();
  if (!query) return [];
  const rec = stored("albums", {});
  const core = query.replace(/[《》\s]/g, "").toLowerCase();
  const names = [];
  for (const k of Object.keys(rec)) {
    const n = String(rec[k] && rec[k].name || "");
    if (!n) continue;
    if (n.replace(/\s/g, "").toLowerCase().indexOf(core) < 0) continue;
    if (names.indexOf(n) >= 0) continue;
    names.push(n);
    if (names.length >= 6) break;
  }
  return names;
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
module.exports = __mfRuntime.makePlugin(__mfPlugin, {"id": "shitou", "name": "石头听书", "version": "0.2.0", "site": "www.shitou.club", "searchTypes": ["music", "album"]});
