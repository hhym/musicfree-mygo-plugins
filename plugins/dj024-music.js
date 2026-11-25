// 显示名：DJ024电音（dj024-music）
// MusicFree plugin generated from MyGo Music plugin; source site: www.dj024.com
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
// 显示名：DJ024电音（dj024-music）
// MyGo Music plugin — DJ024电音 (www.dj024.com)
//
// A Shenyang DJ site built on Laravel: list pages are plain HTML, and one
// JSON endpoint supplies what a player actually needs:
//
//   GET  /                          latest tracks (274 "track-line" rows)
//   GET  /cate/exclusive            the exclusive shelf
//   GET  /forum/category-<id>?page=<n>
//   GET  /albums/<id>?page=<n>      a themed collection (1385 tracks for 红番区)
//   GET  /authors/<id>?page=<n>     an uploader's shelf
//   GET  /searches?q=<kw>&page=<n>
//   GET  /api/tracks/media?ac=song&id=<id>
//        -> { data: { name, cover, user, category, isSole, low: { url, size } } }
//
// The `low` URL is an m4a on dns.dj024.vip with no hotlink check and Range
// support, so playback is plain `stream`. Non-exclusive tracks are served in
// full there; exclusive ones only carry a preview clip, which is the site's
// own rule ("独家舞曲只提供片段试听").

const BASE = "https://www.dj024.com";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const HEAD = {
  "user-agent": UA,
  "accept-language": "zh-CN,zh;q=0.9,en;q=0.5",
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

const PAGE_SIZE = 28; // the number of rows a list page carries
const t = (text) => host.t(text);

function fail(code, message) {
  const error = new Error(message || code);
  error.code = code;
  return error;
}

async function request(path, options = {}) {
  const url = path.indexOf("http") === 0 ? path : BASE + path;
  const headers = Object.assign({}, HEAD, options.headers || {});
  const init = { method: options.method || "GET", headers: headers };
  const ms = options.timeout || 15000;
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  if (controller) init.signal = controller.signal;
  const timer = setTimeout(() => {
    if (controller) controller.abort();
  }, ms);
  try {
    const res = await fetch(url, init);
    if (res.status === 404) throw fail("unavailable", t("站点没有这个页面"));
    if (res.status >= 500) throw fail("unavailable", t("站点暂时不可用（HTTP " + res.status + "）"));
    if (res.status === 403) throw fail("unavailable", t("站点拒绝了请求，请稍后再试"));
    return res;
  } finally {
    clearTimeout(timer);
  }
}

const pageCache = new Map();

async function html(path) {
  const url = path.indexOf("http") === 0 ? path : BASE + path;
  const cached = pageCache.get(url);
  if (cached && Date.now() - cached.at < 60 * 1000) return cached.html;
  const res = await request(url, { headers: { accept: "text/html,application/xhtml+xml,*/*;q=0.8" } });
  const text = await res.text();
  pageCache.set(url, { at: Date.now(), html: text });
  return text;
}

const jsonCache = new Map();

async function trackData(id) {
  const key = String(id);
  const cached = jsonCache.get(key);
  if (cached && Date.now() - cached.at < 5 * 60 * 1000) return cached.data;
  const res = await request("/api/tracks/media?ac=song&id=" + encodeURIComponent(key), {
    headers: { accept: "application/json", "x-requested-with": "XMLHttpRequest", referer: BASE + "/" },
  });
  let body;
  try {
    body = await res.json();
  } catch (error) {
    throw fail("unavailable", t("站点接口返回异常，请稍后再试"));
  }
  if (!body || !body.data) throw fail("unavailable", t("这首取不到播放信息"));
  jsonCache.set(key, { at: Date.now(), data: body.data });
  return body.data;
}

/* ------------------------------------------------------------------- parsing */

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function decode(text) {
  return String(text || "").replace(/&(#\d+|amp|lt|gt|quot|apos|nbsp);/g, (whole, name) => {
    if (name[0] === "#") {
      const code = Number(name.slice(1));
      return String.fromCharCode(code);
    }
    return ENTITIES[name] || whole;
  });
}

function secondsOf(text) {
  const found = /TIME\s*(\d+)\u5206(\d+)\u79d2|(\d+)\u5206(\d+)\u79d2/.exec(text || "");
  if (!found) return undefined;
  const minutes = Number(found[1] || found[3] || 0);
  const seconds = Number(found[2] || found[4] || 0);
  return (minutes * 60 + seconds) * 1000;
}

/* Titles look like "【独家发布】歌手 - 曲名（Mix）" or just "DJ杰森2026 圣诞".
   The singer before the dash is what the app shows as the artist. */
function artistsOf(name) {
  const clean = String(name || "").replace(/^\s*【[^】]*】\s*/, "").trim();
  const parts = clean.split(/\s+-\s+/);
  if (parts.length < 2) return [];
  const singer = parts[0].trim();
  return singer ? [{ name: singer }] : [];
}

function parseItems(page) {
  const pieces = String(page).split(/class="[^"]*track-list-item[^"]*"/).slice(1);
  const tracks = [];
  for (const chunk of pieces) {
    const id = (/select-input[^>]*value="(\d+)"/.exec(chunk) || [])[1];
    if (!id) continue;
    const name = decode((/track-list-name-text[^>]*title="([^"]*)"/.exec(chunk) || [])[1] || "");
    if (!name) continue;
    const cover = (/track-list-cover-img[^>]*data-src="([^"]+)"/.exec(chunk) || [])[1];
    const category = decode((/<a[^>]*target="_cat"[^>]*>([^<]*)</.exec(chunk) || [])[1] || "");
    const duration = secondsOf(chunk);
    tracks.push({
      id: id,
      name: name,
      artists: artistsOf(name),
      album: category ? { name: category } : undefined,
      duration: duration,
      imageUrl: cover && !/assets\/images\/cover\.png/.test(cover) ? cover : undefined,
    });
  }
  return tracks;
}

/* The home page carries its newest rows in a slimmer "track-line" shape. */
function parseLines(page) {
  const re = /track-line-name[^"]*"[^>]*href="[^"]*\/topics\/(\d+)"[^>]*title="([^"]*)"/g;
  const tracks = [];
  let match;
  while ((match = re.exec(page))) {
    const name = decode(match[2]);
    if (!name) continue;
    tracks.push({ id: match[1], name: name, artists: artistsOf(name) });
  }
  return tracks;
}

/* A browse page may carry its page number as a trailing segment:
   "category/37/2". The middle segment is the id, never the page. */
function splitPage(path) {
  const clean = String(path || "").replace(/\s+$/, "");
  const found = /^(.*)\/(\d+)$/.exec(clean);
  if (!found) return { base: clean, page: 0 };
  if (/^(category|album|author|song|search|latest|exclusive|albums)$/.test(found[1])) {
    return { base: clean, page: 0 };
  }
  return { base: found[1], page: Number(found[2]) };
}

function hasNext(page, pageNo) {
  const next = pageNo + 1;
  return new RegExp("page=" + next + "(?!\\d)").test(page);
}

/* ------------------------------------------------------------------ browsing */

const HOT = ["中文舞曲", "现场串烧", "HOUSE", "慢摇", "英文舞曲", "抖音"];
async function home() {
  const sections = [];

  const front = await html("/");
  const latest = parseLines(front).slice(0, 20);
  if (latest.length) {
    remember(latest);
    sections.push({ title: t("最新发布"), tracks: latest, morePage: "latest" });
  }

  try {
    const shelf = await html("/cate/exclusive");
    const exclusive = parseItems(shelf).slice(0, 20);
    if (exclusive.length) {
      remember(exclusive);
      sections.push({ title: t("独家舞曲"), tracks: exclusive, morePage: "exclusive" });
    }
  } catch (error) {
    /* The shelf is a secondary row; its failure must not empty Home. */
  }

  sections.push({
    title: t("分类"),
    links: [
      { title: t("最新发布"), page: "latest" },
      { title: t("独家舞曲"), page: "exclusive" },
      { title: t("中文舞曲"), page: "category/3" },
      { title: t("现场串烧"), page: "category/37" },
      { title: t("HOUSE中文"), page: "category/51" },
      { title: t("经典怀旧"), page: "category/33" },
      { title: t("专辑"), page: "albums" },
    ],
  });

  return {
    title: t("DJ024电音"),
    subtitle: t("沈阳DJ024电音传媒 · 舞曲串烧"),
    sections: sections,
  };
}
async function browse({ page }) {
  const path = String(page || "");
  const parts = splitPage(path);
  const pageNo = parts.page;
  const base = parts.base;

  if (base === "latest" || base === "") {
    const front = await html("/");
    const tracks = parseLines(front);
    const chunk = tracks.slice(0, 60);
    remember(chunk);
    return { title: t("最新发布"), sections: [{ title: t("最新发布"), tracks: chunk }] };
  }

  if (base === "exclusive") {
    const shelf = await html("/cate/exclusive");
    const tracks = parseItems(shelf);
    remember(tracks);
    return {
      title: t("独家舞曲"),
      description: t("独家舞曲只提供片段试听，下载为完整版。"),
      sections: [{ title: t("独家舞曲"), tracks: tracks }],
    };
  }

  const cat = /^category\/(\d+)$/.exec(base);
  if (cat) {
    const url = "/forum/category-" + cat[1] + (pageNo > 1 ? "?page=" + pageNo : "");
    const data = await html(url);
    const tracks = parseItems(data);
    remember(tracks);
    const title =
      decode((/breadcrumb-item active[^>]*>([^<]*)</.exec(data) || [])[1] || "") || t("分类");
    return {
      title: title,
      sections: [
        {
          title: title,
          tracks: tracks,
          morePage: hasNext(data, pageNo || 1) ? "category/" + cat[1] + "/" + ((pageNo || 1) + 1) : undefined,
        },
      ],
    };
  }

  const al = /^album\/(\d+)$/.exec(base);
  if (al) {
    const sheet = await album({ id: al[1], page: pageNo });
    return {
      title: sheet.album.name,
      imageUrl: sheet.album.imageUrl,
      description: sheet.album.description,
      sections: [
        {
          title: t("歌曲"),
          tracks: sheet.tracks,
          morePage: sheet.more ? "album/" + al[1] + "/" + ((pageNo || 1) + 1) : undefined,
        },
      ],
    };
  }

  const au = /^author\/(\d+)$/.exec(base);
  if (au) {
    const info = await artist({ id: au[1], page: pageNo });
    return {
      title: info.artist.name,
      description: info.artist.description,
      sections: [
        {
          title: t("歌曲"),
          tracks: info.tracks,
          morePage: info.more ? "author/" + au[1] + "/" + ((pageNo || 1) + 1) : undefined,
        },
      ],
    };
  }

  if (base === "albums") {
    const data = await html("/albums");
    const chunks = String(data).split(/class="[^"]*album-list-item[^"]*"/).slice(1);
    const albums = [];
    for (const chunk of chunks) {
      const id = (/\/albums\/(\d+)/.exec(chunk) || [])[1];
      const name = decode((/<p[^>]*>([^<]+)</.exec(chunk) || [])[1] || "");
      const cover = (/data-src="([^"]+)"/.exec(chunk) || [])[1];
      if (!id || !name) continue;
      albums.push({
        id: id,
        name: name,
        imageUrl: cover && !/assets\/images\/cover\.png/.test(cover) ? cover : undefined,
      });
    }
    return { title: t("专辑"), sections: [{ title: t("专辑"), albums: albums }] };
  }

  const song = /^song\/(\d+)$/.exec(base);
  if (song) {
    const info = await trackData(song[1]);
    const track = trackOf(info);
    remember([track]);
    return { title: track.name, sections: [{ title: t("歌曲"), tracks: [track] }] };
  }

  const searchPath = /^search\/(.+)$/.exec(base);
  if (searchPath) {
    const keyword = decodeURIComponent(searchPath[1]);
    const result = await search({ query: keyword, offset: 0 });
    return { title: keyword, sections: [{ title: t("歌曲"), tracks: result.tracks }] };
  }

  throw fail("unavailable", t("没有这个页面"));
}

/* ------------------------------------------------------------------- search */
async function search({ query, offset, kind }) {
  const keyword = String(query || "").trim();
  if (!keyword) throw fail("invalid", t("请输入搜索内容"));
  if (kind && kind !== "tracks") return { albums: [], more: false };

  const start = Math.max(0, Number(offset) || 0);
  const pageNo = Math.floor(start / PAGE_SIZE) + 1;
  const skip = start % PAGE_SIZE;

  const data = await html("/searches?q=" + encodeURIComponent(keyword) + (pageNo > 1 ? "&page=" + pageNo : ""));
  const tracks = parseItems(data).slice(skip, skip + PAGE_SIZE);
  remember(tracks);
  return { tracks: tracks, more: tracks.length > 0 && hasNext(data, pageNo) };
}
function suggest({ query }) {
  const word = String(query || "").trim();
  if (!word) return HOT.slice(0, 6);
  return HOT.filter((item) => item.indexOf(word) >= 0 || word.indexOf(item) >= 0).slice(0, 6);
}

/* -------------------------------------------------------------- album/artist */

function albumMeta(data) {
  const name = decode((/album-detail-name[^"]*"[^>]*>([^<]*)</.exec(data) || [])[1] || "");
  const cover = (/album-detail-cover[^>]*data-src="([^"]+)"/.exec(data) || [])[1];
  const intro = /(?:专辑简介|简介)：([^<]{0,600})/.exec(data);
  return {
    name: name || t("专辑"),
    imageUrl: cover && !/assets\/images\/cover\.png/.test(cover) ? cover : undefined,
    description: intro ? decode(intro[1]).trim() : undefined,
  };
}
async function album({ id, page }) {
  const pageNo = Number(page) || 1;
  const data = await html("/albums/" + encodeURIComponent(String(id)) + (pageNo > 1 ? "?page=" + pageNo : ""));
  const meta = albumMeta(data);
  const tracks = parseItems(data);
  remember(tracks);
  return {
    album: { id: String(id), name: meta.name, imageUrl: meta.imageUrl, description: meta.description },
    tracks: tracks,
    more: hasNext(data, pageNo),
  };
}
async function artist({ id, page }) {
  const pageNo = Number(page) || 1;
  const data = await html("/authors/" + encodeURIComponent(String(id)) + (pageNo > 1 ? "?page=" + pageNo : ""));
  const name = decode((/album-detail-name[^"]*"[^>]*>([^<]*)</.exec(data) || [])[1] || "");
  const tracks = parseItems(data);
  remember(tracks);
  return {
    artist: { id: String(id), name: name || t("作者") },
    tracks: tracks,
    more: hasNext(data, pageNo),
  };
}

/* ------------------------------------------------------------------- playing */

function trackOf(info) {
  const uploader = (info.user && info.user.name) || "";
  const artists = artistsOf(info.name);
  if (!artists.length && uploader) artists.push({ name: uploader });
  return {
    id: String(info.id),
    name: info.name || t("舞曲"),
    artists: artists,
    album: info.category && info.category.title ? { name: info.category.title } : undefined,
    imageUrl: info.cover || undefined,
    duration: info.low && info.low.duration ? info.low.duration * 1000 : undefined,
  };
}
async function stream({ id }) {
  const info = await trackData(id);
  const url = info.low && info.low.url;
  if (!url) throw fail("unavailable", t("这首没有可播放的地址"));
  return {
    url: url,
    type: "m4a",
    size: info.low.size,
  };
}
function lyrics() {
  return { lrc: "" };
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
module.exports = __mfRuntime.makePlugin(__mfPlugin, {"id": "dj024-music", "name": "DJ024电音", "version": "1.0.0", "site": "www.dj024.com", "searchTypes": ["music", "album", "artist"]});
