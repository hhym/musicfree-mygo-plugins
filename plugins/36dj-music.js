// 显示名：36DJ舞曲（36dj-music）
// MusicFree plugin generated from MyGo Music plugin; source site: www.36dj.com
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
// 显示名：36DJ舞曲（36dj-music）
// MyGo Music plugin — 36DJ舞曲 (www.36dj.com)
//
// An old-style DJ site on EmpireCMS: list pages are plain HTML tables of links,
// and the detail page carries the audio path in a JS object.
//
//   GET  /                        newest uploads (mulist rows)
//   GET  /html/new/                newest, index_2.html ... index_12.html
//   GET  /html/good/               recommended
//   GET  /top/                     chart
//   GET  /xc/                      remix (411 pages), /myxc/ slow remix,
//        /zw/ Chinese, /my/ slow, /yw/ English
//   GET  /play/<id>.html          var info = { playurl: "2026/3611/...m4a" }
//   POST /e/search/index.php      classid=1, show=title, tempid=1, keyboard
//   GET  /e/search/result/index.php?page=N&searchid=<id>
//   GET  /js/lb/a.js              var vsid = '...'; var vsidExpire = <unix>
//
// The audio lives on https://tn2.72djapp.cn/36djwma7/<playurl> and refuses
// every request unless it carries ?vsid=<the token from a.js>, which expires
// roughly every ten minutes. stream() therefore asks a.js again on each
// play and verifies the result with a one-byte Range request before handing
// the URL over. With a valid vsid the CDN answers 206 with audio/mp4, so the
// App can seek; without one it answers 403 with an empty body.

const BASE = "https://www.36dj.com";
const AUDIO = "https://tn2.72djapp.cn/36djwma7/";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const HEAD = {
  "user-agent": UA,
  "accept-language": "zh-CN,zh;q=0.9,en;q=0.5",
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

const PER_PAGE = 25;
const t = (text) => host.t(text);

function fail(code, message) {
  const error = new Error(message || code);
  error.code = code;
  return error;
}

async function getHtml(path, options = {}) {
  const url = path.indexOf("http") === 0 ? path : BASE + path;
  const method = options.method || "GET";
  const headers = Object.assign({}, HEAD, options.headers || {});
  let body = options.body;
  if (body != null && !headers["content-type"]) {
    headers["content-type"] = "application/x-www-form-urlencoded";
  }

  const ms = options.timeout || 15000;
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  if (controller) options.signal = controller.signal;
  const timer = setTimeout(() => {
    if (controller) controller.abort();
  }, ms);

  try {
    const res = await fetch(url, { method, headers, body, signal: controller ? controller.signal : undefined });
    if (res.status >= 400) throw fail("unavailable", res.status + " " + url);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

const pageCache = new Map();

async function page(path, ttl) {
  const url = path.indexOf("http") === 0 ? path : BASE + path;
  const cached = pageCache.get(url);
  const life = (ttl == null ? 5 : ttl) * 60 * 1000;
  if (cached && Date.now() - cached.at < life) return cached.html;
  const html = await getHtml(path);
  pageCache.set(url, { at: Date.now(), html: html });
  return html;
}

/* ---------------------------------------------------------------- parsing */

function decode(text) {
  return String(text == null ? "" : text).replace(
    /&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp|hellip|middot);/gi,
    (match, entity) => {
      const name = entity.toLowerCase();
      if (name === "amp") return "&";
      if (name === "lt") return "<";
      if (name === "gt") return ">";
      if (name === "quot") return '"';
      if (name === "apos") return "'";
      if (name === "nbsp") return " ";
      if (name === "hellip") return "…";
      if (name === "middot") return "·";
      if (name.charAt(0) === "#") {
        const code = name.charAt(1) === "x" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
        return isNaN(code) ? match : String.fromCharCode(code);
      }
      return match;
    },
  );
}

function plain(html) {
  return decode(String(html || "").replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function maxPageOf(html) {
  let max = 1;
  const text = String(html || "");
  /* category pages page by file name (index_2.html); the search result
     pager pages by query (?page=2&searchid=...). Take the larger of the two. */
  for (const item of text.match(/index_(\d+)\.html/g) || []) {
    const n = parseInt(item.slice(6), 10);
    if (n > max) max = n;
  }
  for (const item of text.match(/page=(\d+)/g) || []) {
    const n = parseInt(item.slice(5), 10);
    if (n > max) max = n;
  }
  return max;
}

function siteTitle(html, fallback) {
  const match = /<title>([\s\S]*?)<\/title>/i.exec(html);
  if (!match) return fallback;
  return decode(match[1])
    .replace(/\s*[-_|]\s*36DJ舞曲网.*$/i, "")
    .replace(/\s*[-_|]\s*36DJ舞曲.*$/i, "")
    .replace(/[\s_-]+$/g, "")
    .trim() || fallback;
}

function nameOfTrack(label) {
  let name = decode(label || "").replace(/\s+/g, " ").trim();
  name = name.replace(/^[·\-–—|]\s*/, "").trim();
  return name || t("舞曲");
}

/* List pages come in two shapes: category pages repeat the checkbox row
   (input carrying the id, a title link, then 人气 / 上传时间 in <em>), while
   the search results and the chart keep a bare title link. In every shape
   each track also has small action anchors — 试听 / 收藏 / 下载 — which must
   not be mistaken for the name, so links are read in order and only the first
   one that carries a real title counts. */
const ACTIONS = /^(试听|收藏|下载|播放)$/;

function parseRows(html) {
  const tracks = [];
  const seen = new Set();
  const text = String(html || "");
  const re = /<a href="\/play\/(\d+)\.html"([^>]*)>([\s\S]*?)<\/a>/g;
  let match;
  while ((match = re.exec(text))) {
    const id = match[1];
    if (seen.has(id)) continue;

    const attrs = match[2] || "";
    const title = (/title="([^"]*)"/.exec(attrs) || [])[1] || "";
    const word = (plain(match[3]) || decode(title)).trim();
    if (!word) continue;
    if (ACTIONS.test(word)) continue;

    seen.add(id);
    tracks.push(trackOf(id, nameOfTrack(word)));
  }
  return tracks;
}

function trackOf(id, name) {
  return { id: String(id), name: name };
}

/* --------------------------------------------------------------- detail page */

function detailOf(html, id) {
  const musicName = /var music_name\s*=\s*"([^"]*)"/.exec(html);
  const play = /"playurl"\s*:\s*"([^"]+)"/.exec(html) || /playurl\s*:\s*'([^']+)'/.exec(html);
  const meta = /<meta name="Description" content="([^"]*)"/i.exec(html);
  return {
    id: String(id),
    name: musicName ? decode(musicName[1]).trim() : "",
    playurl: play ? decode(play[1]).trim() : "",
    intro: meta ? decode(meta[1]).trim() : "",
  };
}

/* -------------------------------------------------------------------- vsid */

let vsidCache = { value: "", expire: 0, issued: 0 };

async function vsid(force) {
  const now = Math.floor(Date.now() / 1000);
  if (!force && vsidCache.value && vsidCache.expire - now > 90) return vsidCache.value;

  const js = await getHtml("/js/lb/a.js", { timeout: 10000 });
  const token = /vsid\s*=\s*'([^']+)'/.exec(js) || /vsid\s*=\s*"([^"]+)"/.exec(js);
  const expire = /vsidExpire\s*=\s*(\d+)/.exec(js);
  if (!token) throw fail("unavailable", t("音频令牌没取到"));

  vsidCache = {
    value: token[1],
    expire: expire ? parseInt(expire[1], 10) : now + 600,
    issued: Date.now(),
  };
  return vsidCache.value;
}

async function audioFor(playurl) {
  if (!playurl) throw fail("unavailable", t("这首没有音频地址"));
  const clean = playurl.replace(/^\/+/, "");
  const fresh = vsidCache.value && Date.now() - vsidCache.issued < 90 * 1000;
  let token = await vsid(false);

  /* A token we minted moments ago is already proven; the Range probe costs a
     CDN round trip, so skip it while the token is still young. */
  if (fresh) return { url: AUDIO + clean + "?vsid=" + encodeURIComponent(token) };

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const url = AUDIO + clean + "?vsid=" + encodeURIComponent(token);
    const res = await fetch(url, { headers: { "user-agent": UA, range: "bytes=0-1" }, method: "GET" });
    const range = res.headers.get("content-range");
    const size = range ? parseInt(range.split("/")[1], 10) : 0;
    if (res.status === 206 || res.status === 200) {
      try {
        await res.arrayBuffer();
      } catch (error) {
        /* the URL itself is fine even if the probe body fails */
      }
      return { url: url, size: size || undefined };
    }
    token = await vsid(true);
  }

  throw fail("unavailable", t("音频地址被拒绝，可能是令牌过期，稍后再试"));
}

/* ------------------------------------------------------------------- pages */

const CATEGORIES = {
  xc: "串烧舞曲",
  myxc: "慢摇串烧",
  zw: "中文舞曲",
  my: "慢摇舞曲",
  yw: "英文舞曲",
};

function splitPage(value) {
  const clean = String(value || "").replace(/^\/+|\/+$/g, "");
  const numbered = /^(.*?)\/(\d+)$/.exec(clean);
  if (numbered) return { base: numbered[1], page: parseInt(numbered[2], 10) || 1 };
  return { base: clean, page: 1 };
}

function listPath(base, pageNo) {
  const suffix = pageNo > 1 ? "index_" + pageNo + ".html" : "";
  if (base === "latest") return "/html/new/" + suffix;
  if (base === "new") return "/html/new/" + suffix;
  if (base === "good") return "/html/good/" + suffix;
  if (base === "rank") return "/top/" + suffix;
  const category = /^category\/([a-z]+)$/.exec(base);
  if (category && CATEGORIES[category[1]]) return "/" + category[1] + "/" + suffix;
  return "";
}
async function home() {
  const sections = [];

  const front = await page("/");
  const latest = parseRows(front).slice(0, 20);
  if (latest.length) {
    remember(latest);
    sections.push({ title: t("最新上传"), tracks: latest, morePage: "latest" });
  }

  try {
    const chart = await page("/top/");
    const rank = parseRows(chart).slice(0, 10);
    if (rank.length) {
      remember(rank);
      sections.push({ title: t("DJ舞曲榜"), tracks: rank, morePage: "rank" });
    }
  } catch (error) {
    /* the chart row must not empty Home */
  }

  sections.push({
    title: t("分类"),
    links: [
      { title: t("串烧舞曲"), page: "category/xc" },
      { title: t("慢摇串烧"), page: "category/myxc" },
      { title: t("中文舞曲"), page: "category/zw" },
      { title: t("慢摇舞曲"), page: "category/my" },
      { title: t("英文舞曲"), page: "category/yw" },
      { title: t("推荐舞曲"), page: "good" },
      { title: t("最新上传"), page: "latest" },
    ],
  });

  return {
    title: t("36DJ舞曲"),
    subtitle: t("DJ舞曲 · 串烧 · 车载大碟"),
    sections: sections,
  };
}
async function browse({ page: pageId }) {
  const split = splitPage(pageId);
  const pageNo = split.page || 1;

  const list = listPath(split.base, pageNo);
  if (list) {
    const html = await page(list);
    const tracks = parseRows(html);
    if (!tracks.length) throw fail("unavailable", t("这一页没有舞曲"));
    remember(tracks);

    const category = /^category\/([a-z]+)$/.exec(split.base);
    const title =
      category
        ? t(CATEGORIES[category[1]])
        : split.base === "good"
          ? t("推荐舞曲")
          : split.base === "rank"
            ? t("DJ舞曲榜")
            : split.base === "latest" || split.base === "new"
              ? t("最新上传")
              : siteTitle(html, t("舞曲"));

    const max = maxPageOf(html);
    return {
      title: title,
      sections: [
        {
          title: title,
          tracks: tracks,
          morePage: pageNo < max ? split.base + "/" + (pageNo + 1) : undefined,
        },
      ],
    };
  }

  const track = /^track\/(\d+)$/.exec(split.base);
  if (track) {
    const one = await album({ id: track[1] });
    return {
      title: one.album.name,
      description: one.album.description,
      sections: [{ title: t("舞曲"), tracks: one.tracks }],
    };
  }

  throw fail("unavailable", t("没有这个页面"));
}

/* ------------------------------------------------------------------- search */

function searchState() {
  const value = host.storage.get("searchState");
  return value || null;
}

/* The site's own search is EmpireCMS: a POST lands on a result page that
   remembers the query by searchid, and paging reads that id back. */
async function searchFirst(keyword) {
  const body = "classid=1&show=title&tempid=1&submit=&keyboard=" + encodeURIComponent(keyword);
  const html = await getHtml("/e/search/index.php", { method: "POST", body: body, timeout: 18000 });
  const sid = /searchid=(\d+)/.exec(html);
  if (sid) {
    host.storage.set("searchState", { keyword: keyword, id: sid[1], at: Date.now() });
  }
  return { html: html, id: sid ? sid[1] : "" };
}

async function searchPage(keyword, pageNo) {
  if (pageNo <= 1) return (await searchFirst(keyword)).html;
  let state = searchState();
  if (!state || state.keyword !== keyword || !state.id) {
    state = { keyword: keyword, id: (await searchFirst(keyword)).id, at: Date.now() };
  }
  if (!state.id) return (await searchFirst(keyword)).html;
  try {
    return await page(
      "/e/search/result/index.php?page=" + pageNo + "&searchid=" + state.id,
      2,
    );
  } catch (error) {
    const again = await searchFirst(keyword);
    if (!again.id) return again.html;
    return page("/e/search/result/index.php?page=" + pageNo + "&searchid=" + again.id, 2);
  }
}
async function search({ query, offset, kind }) {
  const keyword = String(query || "").trim();
  if (!keyword) throw fail("invalid", t("请输入搜索内容"));
  if (kind && kind !== "tracks") return { albums: [], more: false };

  const start = Math.max(0, Number(offset) || 0);
  const pageNo = Math.floor(start / PER_PAGE) + 1;
  const skip = start % PER_PAGE;

  const html = await searchPage(keyword, pageNo);
  if (!html || /没有搜索到|没有找到/.test(html)) return { tracks: [], more: false };

  const tracks = parseRows(html).slice(skip, skip + PER_PAGE);
  if (!tracks.length) return { tracks: [], more: false };
  remember(tracks);

  const max = maxPageOf(html);
  return { tracks: tracks, more: pageNo < max };
}
function suggest({ query }) {
  const words = String(query || "").trim();
  const hot = [t("车载"), t("串烧"), t("慢摇"), t("中文"), t("英文"), t("电音"), t("抖音"), t("情歌")];
  if (!words) return hot.slice(0, 6);
  return hot.filter((item) => item.indexOf(words) >= 0 || words.indexOf(item) >= 0).slice(0, 6);
}

/* -------------------------------------------------------------- album/artist */
async function album({ id }) {
  const key = String(id || "").replace(/^t:/, "");
  if (!/^\d+$/.test(key)) throw fail("invalid", t("没有这首舞曲"));

  const html = await page("/play/" + key + ".html");
  const info = detailOf(html, key);
  if (!info.name) throw fail("unavailable", t("这首舞曲不存在"));

  const track = trackOf(key, info.name);
  remember([track]);

  return {
    album: {
      id: "t:" + key,
      name: info.name,
      description: info.intro || undefined,
    },
    tracks: [track],
  };
}

/* The site has no artist field; names carry the uploader like "DJ小启", so
   artist() answers with a search on the name instead. */
async function artist({ id }) {
  const raw = String(id || "");
  let name = raw.indexOf("a:") === 0 ? raw.slice(2) : raw;
  try {
    name = decodeURIComponent(name);
  } catch (error) {
    /* keep the raw name */
  }
  name = name.trim() || t("舞曲");

  let tracks = [];
  try {
    const html = await searchPage(name, 1);
    tracks = parseRows(html).slice(0, PER_PAGE);
    remember(tracks);
  } catch (error) {
    tracks = [];
  }

  return {
    artist: { id: "a:" + encodeURIComponent(name), name: name },
    tracks: tracks,
  };
}

/* ------------------------------------------------------------------- playing */
async function stream({ id }) {
  const key = String(id || "").replace(/^t:/, "");
  if (!/^\d+$/.test(key)) throw fail("invalid", t("没有这首舞曲"));

  const html = await page("/play/" + key + ".html", 10);
  const info = detailOf(html, key);
  const audio = await audioFor(info.playurl);
  return { url: audio.url, type: "m4a", size: audio.size };
}
function lyrics() {
  return { lrc: "" };
}

/* ------------------------------------------------------------- local library */

const trackIndex = host.storage.get("trackIndex") || {};

function remember(tracks) {
  let changed = false;
  for (const track of tracks) {
    if (!track || !track.id) continue;
    const entry = { id: track.id, name: track.name };
    const old = trackIndex[track.id];
    if (!old || old.name !== entry.name) {
      trackIndex[track.id] = entry;
      changed = true;
    }
  }
  if (changed) host.storage.set("trackIndex", trackIndex);
}

function load(key, fallback) {
  const value = host.storage.get(key);
  return value == null ? fallback : value;
}

function trackById(id) {
  if (trackIndex[id]) return trackIndex[id];
  const liked = load("likedTracks", {});
  return liked[id] || { id: id, name: t("舞曲") };
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
return { home, browse, search, suggest, album, artist, stream, lyrics, played, recent, like, liked, isLiked };
})(__mfRuntime.host, __mfRuntime.fetch, __mfRuntime.TextDecoder, __mfRuntime.atob, __mfRuntime.btoa, __mfRuntime.URL, __mfRuntime.URLSearchParams);
module.exports = __mfRuntime.makePlugin(__mfPlugin, {"id": "36dj-music", "name": "36DJ舞曲", "version": "1.0.0", "site": "www.36dj.com", "searchTypes": ["music", "album", "artist"]});
