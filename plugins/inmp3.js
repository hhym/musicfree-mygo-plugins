// 显示名：IN音乐网（inmp3）
// MusicFree plugin generated from MyGo Music plugin; source site: inmp3.com
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
const SITE = {
  "id": "inmp3",
  "name": "IN音乐网",
  "version": "0.1.0",
  "base": "https://inmp3.com",
  "kind": "hi",
  "subtitle": "热门歌曲在线试听与 MP3 下载",
  "note": "首页、搜索、详情与 base64 音频地址均已实测可用。",
  "deadHome": false,
  "allowFallback": true,
  "localDefault": false,
  "nav": [
    {
      "title": "飙升榜",
      "path": "/biaosheng/"
    },
    {
      "title": "新歌榜",
      "path": "/xinge/"
    },
    {
      "title": "热歌榜",
      "path": "/rege/"
    },
    {
      "title": "粤语歌曲",
      "path": "/yueyu/"
    },
    {
      "title": "经典老歌",
      "path": "/jdhj/"
    }
  ],
  "detailPrefix": "/song/",
  "homeExtra": "/xinge/",
  "searchPath": "/so/{q}/1/",
  "detailPattern": "^/song/\\d+/?$"
};
const BASE = SITE.base;
const NAME = SITE.name;
const KIND = SITE.kind;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const TTL = 3 * 60 * 1000;
const cache = new Map();
const known = new Map();

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
function fail(code, message) { const e = new Error(message || code); e.code = code; return e; }

function clean(s) {
  return String(s || "")
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
function abs(u) {
  if (!u) return "";
  u = String(u).trim().replace(/\\\//g, "/");
  if (/^https?:/i.test(u)) return u;
  if (u.startsWith("//")) return "https:" + u;
  return BASE + (u.startsWith("/") ? u : "/" + u);
}
function pathOf(href) {
  if (!href) return "";
  try {
    if (/^https?:/i.test(href)) {
      const u = new URL(href);
      return u.pathname + u.search;
    }
  } catch (e) {}
  if (!href.startsWith("/")) return "";
  return href;
}
function artistOf(name) {
  const i = String(name || "").indexOf("-");
  if (i < 1) return [];
  return [{ id: "", name: clean(name.slice(0, i)) }];
}
function songName(raw) {
  return clean(raw)
    .replace(/mp3免费下载.*$/i, "")
    .replace(/歌曲免费下载.*$/i, "")
    .replace(/mp3下载.*$/i, "")
    .replace(/歌曲下载.*$/i, "")
    .replace(/在线试听.*$/i, "")
    .replace(/_?免费音乐下载网.*$/i, "")
    .replace(/\s*[-|_]\s*(世纪音乐网|Hi歌曲音乐网|IN音乐网|歌曲海.*|放屁网.*|7082音乐网.*)$/i, "")
    .replace(/_?\s*MP3歌曲免费下载.*$/i, "")
    .replace(/\s*歌曲免费下载.*$/i, "")
    .replace(/\s*MP3\s*$/i, "")
    .replace(/🔥+/g, "")
    .trim();
}
function shijiParts(raw) {
  const t = clean(raw);
  if (/\s+-\s+/.test(t)) {
    const parts = t.split(/\s+-\s+/);
    return { name: parts[0].trim(), artist: parts.slice(1).join(" - ").trim() };
  }
  const i = t.indexOf("-");
  if (i > 0) return { artist: t.slice(0, i).trim(), name: t.slice(i + 1).trim() };
  return { name: t, artist: "" };
}
function makeAlbum(path, name, imageUrl, artist) {
  return {
    id: path,
    name: clean(name) || "未命名歌曲",
    imageUrl: abs(imageUrl || ""),
    artists: artist ? [{ id: "", name: clean(artist) }] : artistOf(name),
  };
}
function makeTrack(path, name, imageUrl, artist, duration) {
  const album = makeAlbum(path, name, imageUrl, artist);
  return {
    id: path,
    name: album.name,
    artists: album.artists,
    album,
    duration: Number(duration) || 0,
  };
}
function remember(a) { if (a && a.id) known.set(a.id, a); }
function isJunk(name) {
  return /^(首页|最近更新|华语音乐|欧美音乐|日韩音乐|DJ舞曲|精选合集|合集打包|全部|更多|排行榜|搜索|登录|注册|下载|免责声明|联系我们|热门搜索|热门推荐|最新推荐|最新歌曲|新歌榜|热歌榜|飙升榜|歌手|歌单|歌曲|音乐|播放|试听|详情|下一页|上一页)$/.test(String(name || "").trim());
}

async function fetchText(pathOrUrl, opts) {
  opts = opts || {};
  const rel = /^https?:/i.test(pathOrUrl)
    ? pathOrUrl.replace(/^https?:\/\/[^/]+/i, "")
    : pathOrUrl;
  const key = rel + "|" + (opts.method || "GET") + "|" + (opts.body || "");
  const hit = cache.get(key);
  if (hit && Date.now() - hit.t < TTL) return hit.v;
  let last = null;
  const tries = opts.method === "POST" ? 1 : 3;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(BASE + rel, {
        method: opts.method || "GET",
        redirect: "follow",
        headers: {
          "user-agent": UA,
          referer: opts.referer || (BASE + "/"),
          accept: "text/html,application/json;q=0.9,*/*;q=0.8",
          ...(opts.headers || {}),
        },
        body: opts.body,
      });
      const text = await res.text();
      if (!res.ok) throw fail("upstream", `源站 HTTP ${res.status}`);
      if (!text || text.length < 80) throw fail("upstream", "源站返回空页面");
      if (/upstream connect error|系统安全验证|滑动验证|Just a moment|访问异常/i.test(text) && text.length < 4000) {
        throw fail("unavailable", `${NAME}源站需要验证或暂时不可用`);
      }
      if (text.length < 600 && /window\.location\.href\s*=/.test(text)) {
        throw fail("unavailable", `${NAME}源站返回了跳转挑战页`);
      }
      cache.set(key, { t: Date.now(), v: text });
      return text;
    } catch (e) {
      last = e;
      await wait(450 + i * 650);
    }
  }
  throw last || fail("unavailable", `${NAME}暂时无法访问`);
}

function anchors(html) {
  const out = [];
  const re = /<a\b((?:"[^"]*"|'[^']*'|[^>"'])*)>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    const attrs = m[1];
    const hm = attrs.match(/href=(?:"([^"]*)"|'([^']*)')/i) || [];
    const tm = attrs.match(/title=(?:"([^"]*)"|'([^']*)')/i) || [];
    out.push({ href: hm[1] || hm[2] || "", title: clean(tm[1] || tm[2] || ""), text: clean(m[2]), html: m[2] });
  }
  return out;
}

function detailRe() {
  if (SITE.detailPattern) return new RegExp(SITE.detailPattern, "i");
  if (KIND === "shiji") return /^\/thread\/\d+\.html$/i;
  if (KIND === "hi") return /^\/(?:player|song)\/\d+\/?$/i;
  if (KIND === "gequ") return /^\/play\/\d+$/i;
  if (KIND === "7082") return /^\/play\/\d+\.html$/i;
  if (KIND === "fangpi") return /^\/music\/\d+$/i;
  return /^\/(?:play|music|song|thread|post|mp3|audio|sound|listen|detail|info)\/\d+(?:\.html|\.php|\/)?$/i;
}
function isDetail(path) { return !!path && detailRe().test(path); }

function parseAutoCards(html, limit) {
  const out = [];
  const seen = new Set();
  for (const a of anchors(html)) {
    const path = pathOf(a.href);
    if (!path || !isDetail(path) || seen.has(path)) continue;
    const name = songName(a.title || a.text);
    if (!name || name.length < 2 || isJunk(name)) continue;
    seen.add(path);
    out.push(makeAlbum(path, name, "", ""));
    if (out.length >= (limit || 60)) break;
  }
  return out;
}

function parseShiji(html, limit) {
  const out = [];
  const seen = new Set();
  for (const a of anchors(html)) {
    const path = pathOf(a.href);
    if (!path || !/^\/thread\/\d+\.html$/i.test(path) || seen.has(path)) continue;
    const cell = (a.html.match(/class="col-25[^"]*"[^>]*>([\s\S]*?)<\/div>/i) || [])[1];
    const raw = songName(cell || a.title || a.text);
    if (!raw || raw.length < 2 || isJunk(raw)) continue;
    const parts = shijiParts(raw);
    const name = parts.name;
    if (!name || name.length < 2) continue;
    seen.add(path);
    out.push(makeAlbum(path, name, "", parts.artist));
    if (out.length >= (limit || 60)) break;
  }
  return out;
}

function parseTrending(html) {
  const out = [];
  const seen = new Set();
  for (const block of String(html).split(/class="trending-item"/i).slice(1)) {
    const rid = (block.match(/onclick="go(?:Player|song)\('(\d+)'\)/i) || [])[1];
    if (!rid) continue;
    const title = clean((block.match(/class="trending-title">([\s\S]*?)<\/div>/i) || [])[1] || "");
    const artist = clean((block.match(/class="trending-artist">([\s\S]*?)<\/div>/i) || [])[1] || "");
    if (!title) continue;
    const path = `${SITE.detailPrefix}${rid}/`;
    if (seen.has(path)) continue;
    seen.add(path);
    out.push(makeAlbum(path, title, "", artist));
  }
  return out;
}

function parseHiResults(html) {
  const out = [];
  const seen = new Set();
  for (const block of String(html).split(/class="result-item"/i).slice(1)) {
    const rid = (block.match(/data-rid="(\d+)"/i) || [])[1];
    if (!rid) continue;
    const title = clean((block.match(/class="result-title">([\s\S]*?)<\/div>/i) || [])[1] || "");
    const artist = clean((block.match(/class="result-artist">([\s\S]*?)<\/div>/i) || [])[1] || "");
    if (!title) continue;
    const path = `${SITE.detailPrefix}${rid}/`;
    if (seen.has(path)) continue;
    seen.add(path);
    out.push(makeAlbum(path, title, "", artist));
  }
  return out;
}

function parseGequ(html, limit) {
  const out = [];
  const seen = new Set();
  for (const block of String(html).split(/<tr\b/i).slice(1)) {
    const m = block.match(/href="\/play\/(\d+)"[^>]*>([\s\S]*?)<\/a>/i);
    if (!m) continue;
    const path = `/play/${m[1]}`;
    if (seen.has(path)) continue;
    const name = songName(m[2]);
    if (!name || isJunk(name)) continue;
    const img = (block.match(/<img[^>]+src=(?:"([^"]+)"|'([^']+)')/i) || []);
    const artist = clean((block.match(/<td[^>]*color:\s*#666[^>]*>([\s\S]*?)<\/td>/i) || [])[1] || "");
    seen.add(path);
    out.push(makeAlbum(path, name, img[1] || img[2] || "", artist));
    if (out.length >= (limit || 60)) break;
  }
  return out;
}

function parse7082(html, limit) {
  const out = [];
  const seen = new Set();
  for (const a of anchors(html)) {
    const path = pathOf(a.href);
    if (!path || !/^\/play\/\d+\.html$/i.test(path) || seen.has(path)) continue;
    const name = songName(a.title || a.text);
    if (!name || name.length < 2 || isJunk(name)) continue;
    seen.add(path);
    out.push(makeAlbum(path, name, "", ""));
    if (out.length >= (limit || 60)) break;
  }
  return out;
}

function parseFangpi(html, limit) {
  const out = [];
  const seen = new Set();
  for (const a of anchors(html)) {
    const path = pathOf(a.href);
    if (!path || !/^\/music\/\d+$/i.test(path) || seen.has(path)) continue;
    let raw = a.title || a.text;
    let name = raw;
    let artist = "";
    const dash = raw.lastIndexOf(" - ");
    if (dash > 0) { name = raw.slice(0, dash); artist = raw.slice(dash + 3); }
    name = songName(name);
    if (!name || name.length < 2 || isJunk(name)) continue;
    seen.add(path);
    out.push(makeAlbum(path, name, "", artist));
    if (out.length >= (limit || 60)) break;
  }
  return out;
}

function homeLink(path, title) { return { title, page: `cat:${encodeURIComponent(path)}:1` }; }
async function home() {
  try {
    let items = [];
    let extra = [];
    if (KIND === "shiji") {
      items = parseShiji(await fetchText("/"), 40);
    } else if (KIND === "hi") {
      const html = await fetchText("/");
      items = parseTrending(html);
      try { extra = parseHiResults(await fetchText(SITE.homeExtra || "/xinge/"), 40); } catch (e) {}
    } else if (KIND === "gequ") {
      items = parseGequ(await fetchText("/top/new"), 40);
    } else if (KIND === "7082") {
      items = parse7082(await fetchText("/"), 40);
    } else if (KIND === "fangpi") {
      items = parseFangpi(await fetchText("/hot-music"), 40);
    } else {
      items = parseAutoCards(await fetchText("/"), 40);
    }
    const all = [];
    const seen = new Set();
    for (const a of [...items, ...extra]) {
      if (!a || seen.has(a.id)) continue;
      seen.add(a.id);
      all.push(a);
    }
    if (!all.length) throw fail("unavailable", `${NAME}首页没有解析到歌曲，源站可能改版或尚未恢复`);
    for (const a of all) remember(a);
    const sections = [];
    if (KIND === "hi") {
      sections.push({ title: "热门搜索", albums: items });
      if (extra.length) sections.push({ title: "最新歌曲", albums: extra });
    } else {
      sections.push({ title: "最新推荐", albums: all });
    }
    if (SITE.nav && SITE.nav.length) {
      sections.push({ title: "分类", links: SITE.nav.map((c) => homeLink(c.path, c.title)) });
    }
    return { title: NAME, subtitle: SITE.subtitle || "音乐在线试听", sections };
  } catch (e) {
    if (SITE.allowFallback) return fallbackPage(e && e.message ? e.message : String(e));
    throw e;
  }
}

function fallbackPage(reason) {
  return {
    title: NAME,
    subtitle: BASE,
    description: SITE.note || "源站当前无法访问。",
    sections: [
      { title: "站点状态", empty: `${SITE.note || "暂时无法访问"}（${reason}）`, tracks: [] },
      { title: "站点入口", links: [{ title: `打开 ${BASE}`, page: "about" }] },
    ],
  };
}

function pagePath(path, n) {
  if (n <= 1) return path;
  if (KIND === "shiji") return path.replace(/\.html$/i, `_${n}.html`);
  if (KIND === "7082") return path.replace(/(\d+)\.html$/i, `${n}.html`);
  if (KIND === "gequ" || KIND === "fangpi") return path + (path.includes("?") ? "&" : "?") + "page=" + n;
  if (KIND === "hi") return path.endsWith("/") ? `${path}${n}/` : `${path}/${n}/`;
  return path + (path.includes("?") ? "&" : "?") + "page=" + n;
}
async function browse({ page } = {}) {
  if (!page || page === "categories") {
    if (!SITE.nav || !SITE.nav.length) {
      return {
        title: "分类",
        subtitle: NAME,
        sections: [{ title: "站点说明", empty: SITE.note || "该站点没有公开分类。", tracks: [] }],
      };
    }
    return { title: "分类", sections: [{ title: "全部分类", links: SITE.nav.map((c) => homeLink(c.path, c.title)) }] };
  }
  if (page === "about") {
    return {
      title: NAME,
      subtitle: BASE,
      description: SITE.note || "",
      sections: [{ title: "站点状态", empty: SITE.note || "请在浏览器中打开站点查看。", tracks: [] }],
    };
  }
  const m = String(page).match(/^cat:(.+):(\d+)$/);
  if (!m) throw fail("unavailable", "没有这个页面");
  const path = decodeURIComponent(m[1]);
  const n = Number(m[2]) || 1;
  const html = await fetchText(pagePath(path, n));
  let items = [];
  if (KIND === "shiji") items = parseShiji(html);
  else if (KIND === "hi") items = parseHiResults(html);
  else if (KIND === "gequ") items = parseGequ(html);
  else if (KIND === "7082") items = parse7082(html);
  else if (KIND === "fangpi") items = parseFangpi(html);
  else items = parseAutoCards(html);
  for (const a of items) remember(a);
  const nav = (SITE.nav || []).find((c) => c.path === path);
  const title = nav ? nav.title : "歌曲列表";
  return {
    title,
    subtitle: `第 ${n} 页`,
    sections: items.length
      ? [{ title: `${title} · 第 ${n} 页`, albums: items }]
      : [{ title, empty: "这一页没有歌曲。", tracks: [] }],
  };
}

async function trySearch(path) {
  try {
    const html = await fetchText(path);
    if (KIND === "hi") return parseHiResults(html);
    if (KIND === "gequ") return parseGequ(html);
    if (KIND === "7082") return parse7082(html);
    if (KIND === "fangpi") return parseFangpi(html);
    if (KIND === "shiji") return parseShiji(html);
    let items = parseAutoCards(html);
    if (!items.length) items = parseGequ(html);
    return items;
  } catch (e) { return []; }
}
async function search({ query, kind = "albums", offset = 0 } = {}) {
  const term = String(query || "").trim();
  if (!term) return { albums: [], tracks: [], more: false };
  if (kind === "artists" || kind === "playlists" || kind === "shows") {
    return { [kind]: [], more: false };
  }
  let items = [];
  if (KIND === "shiji") {
    items = await trySearch(`/search.php?q=${encodeURIComponent(term)}`);
  } else if (KIND === "hi") {
    const tpl = SITE.searchPath || "/s/{q}/1/";
    items = await trySearch(tpl.replace("{q}", encodeURIComponent(term)));
  } else if (KIND === "gequ") {
    items = await trySearch(`/search?s=${encodeURIComponent(term)}`);
  } else if (KIND === "7082") {
    items = await trySearch(`/include/search.php?ac=play&key=${encodeURIComponent(term)}`);
  } else if (KIND === "fangpi") {
    items = await trySearch(`/s/${encodeURIComponent(term)}`);
  } else if (!SITE.deadHome) {
    for (const p of [
      `/search.php?q=${encodeURIComponent(term)}`,
      `/search?keyword=${encodeURIComponent(term)}`,
      `/search?q=${encodeURIComponent(term)}`,
      `/s?kw=${encodeURIComponent(term)}`,
      `/so/${encodeURIComponent(term)}`,
    ]) {
      items = await trySearch(p);
      if (items.length) break;
    }
  }
  const off = Math.max(0, Number(offset) || 0);
  const page = items.slice(off, off + 40);
  for (const a of page) remember(a);
  if (kind === "tracks") {
    return { tracks: page.map((a) => makeTrack(a.id, a.name, a.imageUrl, (a.artists[0] || {}).name || "")), more: items.length > off + 40 };
  }
  return { albums: page, more: items.length > off + 40 };
}
async function suggest({ query } = {}) {
  const r = await search({ query });
  return (r.albums || []).slice(0, 8).map((a) => a.name);
}

function metaImage(html) {
  const m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  return m ? abs(m[1]) : "";
}
function titleTag(html) { return clean((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || ""); }
function durationMs(txt) {
  const m = String(txt || "").match(/(\d{1,2}):(\d{2})/);
  return m ? ((Number(m[1]) * 60 + Number(m[2])) * 1000) : 0;
}
function splitSongArtist(s) {
  const t = clean(s);
  const i = t.lastIndexOf(" - ");
  if (i > 0) return { name: t.slice(0, i).trim(), artist: t.slice(i + 3).trim() };
  const j = t.indexOf("-");
  if (j > 0) return { name: t.slice(0, j).trim(), artist: t.slice(j + 1).trim() };
  return { name: t, artist: "" };
}

function parseAppData(html) {
  const m = html.match(/window\.appData\s*=\s*JSON\.parse\('([\s\S]*?)'\)\s*;/i);
  if (!m) return null;
  let raw = m[1].replace(/\\\\/g, "\\").replace(/\\u0022/g, '"').replace(/\\'/g, "'");
  try { return JSON.parse(raw); } catch (e) { return null; }
}

function parseAlbumMeta(html, path) {
  let name = "";
  let artist = "";
  let audioTitle = "";
  let imageUrl = metaImage(html);
  let duration = 0;
  let app = null;
  if (KIND === "hi") {
    const t = clean((html.match(/<h1[^>]+id="music-title"[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || "");
    const s = splitSongArtist(t);
    name = s.name; artist = s.artist; audioTitle = t;
    const img = html.match(/<img[^>]+id="album-cover"[^>]+src=(?:"([^"]+)"|'([^']+)')/i) || [];
    if (img[1] || img[2]) imageUrl = img[1] || img[2];
  } else if (KIND === "gequ") {
    name = clean((html.match(/window\.mp3_title\s*=\s*'([^']*)'/i) || [])[1] || "");
    artist = clean((html.match(/window\.mp3_author\s*=\s*'([^']*)'/i) || [])[1] || "");
    audioTitle = `${artist}-${name}`;
    const c = (html.match(/window\.mp3_cover\s*=\s*'([^']*)'/i) || [])[1];
    if (c) imageUrl = c;
  } else if (KIND === "7082") {
    name = clean((html.match(/class="djname"[^>]*>([\s\S]*?)<\/div>/i) || [])[1] || "");
    audioTitle = name;
  } else if (KIND === "fangpi") {
    app = parseAppData(html);
    if (app) {
      name = clean(app.mp3_title || "");
      artist = clean(app.mp3_author || "");
      audioTitle = `${name}-${artist}`;
      imageUrl = app.mp3_cover || imageUrl;
      duration = durationMs(app.mp3_duration);
    }
  } else {
    const esc = (html.match(/(?:const|var|let)\s+escapedTitle\s*=\s*'([^']*)'/i) || [])[1];
    if (esc) {
      const full = esc.replace(/&amp;/g, "&");
      audioTitle = full;
      const parts = shijiParts(full);
      artist = clean(parts.artist);
      name = songName(parts.name);
    }
  }
  if (!name) {
    const tag = titleTag(html);
    const s = splitSongArtist(songName(tag.split(/[_|]/)[0]));
    name = s.name; artist = artist || s.artist;
    if (!audioTitle) audioTitle = s.name;
  }
  if (!name) name = (known.get(path) || {}).name || "未命名歌曲";
  if (!isJunk(name)) {
    const s = splitSongArtist(name);
    if (s.artist && !artist) artist = s.artist;
    name = s.name;
  }
  return { name, artist, audioTitle: audioTitle || name, imageUrl: abs(imageUrl), duration, app, description: clean((html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i) || [])[1] || "") };
}
async function album({ id } = {}) {
  const p0 = String(id || "");
  if (SITE.deadHome) throw fail("unavailable", SITE.note || "该站点当前没有可播放内容");
  const path = isDetail(p0) ? p0 : (known.get(p0) || {}).id || p0;
  if (!path || !isDetail(path)) throw fail("unavailable", "没有这个歌曲");
  const html = await fetchText(path);
  const meta = parseAlbumMeta(html, path);
  const a = makeAlbum(path, meta.name, meta.imageUrl, meta.artist);
  remember(a);
  return {
    album: { ...a, description: meta.description || "" },
    tracks: [makeTrack(path, meta.name, meta.imageUrl, meta.artist, meta.duration)],
  };
}

function b64decode(s) {
  s = String(s || "").replace(/[^A-Za-z0-9+/=]/g, "");
  try { if (typeof atob === "function") return atob(s); } catch (e) {}
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let out = "";
  for (let i = 0; i < s.length; i += 4) {
    const a = chars.indexOf(s[i]);
    const b = chars.indexOf(s[i + 1]);
    const c = chars.indexOf(s[i + 2]);
    const d = chars.indexOf(s[i + 3]);
    if (a < 0 || b < 0) break;
    out += String.fromCharCode((a << 2) | (b >> 4));
    if (c >= 0) out += String.fromCharCode(((b & 15) << 4) | (c >> 2));
    if (d >= 0) out += String.fromCharCode(((c & 3) << 6) | d);
  }
  return out;
}

function extractAudio(html, name) {
  const cands = [];
  let m;
  const b64 = (html.match(/encodedUrl\s*=\s*"([^"]+)"/i) || [])[1];
  if (b64) {
    try { const u = b64decode(b64); if (/^https?:/i.test(u)) cands.push(u); } catch (e) {}
  }
  m = html.match(/<audio[^>]+src=(?:"([^"]+)"|'([^']+)')/i); if (m) cands.push(m[1] || m[2]);
  m = html.match(/<source[^>]+src=(?:"([^"]+)"|'([^']+)')/i); if (m) cands.push(m[1] || m[2]);
  for (const re of [/url\s*:\s*'([^']+)'/i, /url\s*:\s*"([^"]+)"/i, /url\s*:\s*`([^`]+)`/i, /"url"\s*:\s*"([^"]+)"/i, /play_url\s*[:=]\s*['"]([^'"]+)['"]/i]) {
    m = html.match(re); if (m) cands.push(m[1]);
  }
  m = html.match(/https?:\/\/[^"'\s<>\\]+\.(?:mp3|m4a|aac|flac)(?:\?[^"'\s<>]*)?/i); if (m) cands.push(m[0]);
  const title = String(name || "").replace(/`/g, "");
  for (let u of cands) {
    if (!u) continue;
    u = String(u).replace(/\\\//g, "/").replace(/&amp;/g, "&");
    if (u.includes("${encodedTitle}")) u = u.replace(/\$\{encodedTitle\}/g, encodeURIComponent(title));
    else if (u.includes("${title}")) u = u.replace(/\$\{title\}/g, encodeURIComponent(title));
    u = abs(u);
    if (/^https?:/i.test(u)) return u;
  }
  return "";
}

function audioType(u) {
  if (/\.m4a(?:[?#]|$)/i.test(u)) return "m4a";
  if (/\.flac(?:[?#]|$)/i.test(u)) return "flac";
  if (/\.aac(?:[?#]|$)/i.test(u)) return "aac";
  return "mp3";
}

const isWindows = () => /win/i.test(host.platform || "");
const FFMPEG = {
  darwin: ["/opt/homebrew/bin/ffmpeg", "/usr/local/bin/ffmpeg"],
  linux: ["/usr/bin/ffmpeg", "/usr/local/bin/ffmpeg"],
  win32: ["ffmpeg.exe", "C:\\ffmpeg\\bin\\ffmpeg.exe", "C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe"],
};
const slots = () => { try { return JSON.parse(host.storage.get("slots") || "[]"); } catch (e) { return []; } };
const saveSlots = (v) => host.storage.set("slots", JSON.stringify(v));
const slotOf = (id) => { let h = 0; for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) % 8; return h; };
function fileFor(slot, ext) { return `${String(host.dataDir).replace(/[\\/]+$/, "")}${isWindows() ? "\\" : "/"}${SITE.id}-${slot}.${ext}`; }
function fileURL(path) {
  let p = String(path).replace(/\\/g, "/");
  if (!p.startsWith("/")) p = "/" + p;
  return "file://" + p.split("/").map((x) => encodeURIComponent(x).replace(/%3A/gi, ":")).join("/");
}
function localOn() {
  const v = host.setting("localCache");
  return v == null || v === "" ? !!SITE.localDefault : String(v) === "1";
}
async function toLocal(url, target, referer) {
  let last = "";
  for (const bin of [...(host.setting("ffmpegPath") ? [host.setting("ffmpegPath")] : []), "ffmpeg", ...(FFMPEG[host.platform] || [])]) {
    try {
      const p = host.spawn(bin, ["-y", "-hide_banner", "-loglevel", "error", "-headers", `Referer: ${referer}\r\n`, "-user_agent", UA, "-i", url, "-vn", "-c:a", "copy", target]);
      const code = await p.wait();
      const err = await p.errorOutput();
      if ((code == null || code === 0) && !err) return;
      last = `${bin}: ${String(err).slice(0, 160) || code}`;
    } catch (e) { last = `${bin}: ${e && e.message ? e.message : e}`; }
  }
  throw new Error(last || "ffmpeg not found");
}

async function resolveAudio(html, path) {
  const meta = parseAlbumMeta(html, path);
  if (KIND === "hi") {
    const u = extractAudio(html, meta.audioTitle || meta.name);
    if (!u) throw fail("unavailable", "歌曲页没有返回音频地址");
    return u;
  }
  if (KIND === "gequ") {
    const inline = (html.match(/window\.mp3_url\s*=\s*'([^']*)'/i) || [])[1];
    if (inline && /^https?:/i.test(inline)) return inline;
    const playId = (html.match(/window\.play_id\s*=\s*'([^']*)'/i) || [])[1];
    const type = (html.match(/window\.mp3_type\s*=\s*(\d+)/i) || [])[1] || "0";
    if (!playId) throw fail("unavailable", "歌曲页缺少播放参数");
    const res = await fetch(BASE + "/api/music", {
      method: "POST",
      headers: {
        "user-agent": UA,
        referer: BASE + path,
        origin: BASE,
        "x-requested-with": "http",
        "x-custom-header": "Key",
        "content-type": "application/x-www-form-urlencoded",
      },
      body: `id=${encodeURIComponent(playId)}&type=${encodeURIComponent(type)}`,
    });
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch (e) {}
    if (!json || json.code !== 200 || !json.data || !json.data.url) {
      throw fail("unavailable", (json && json.msg) || "源站没有返回音频地址");
    }
    return json.data.url;
  }
  if (KIND === "7082") {
    const args = html.match(/lei_play\(\s*"(\d+)"\s*,\s*"([^"]+)"\s*\)/i);
    if (!args) throw fail("unavailable", "歌曲页缺少播放参数");
    const res = await fetch(BASE + "/skin/xle_dj197/play.php", {
      method: "POST",
      headers: {
        "user-agent": UA,
        referer: BASE + path,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: `id=${encodeURIComponent(args[1])}&type=${encodeURIComponent(args[2])}`,
    });
    const json = await res.json().catch(() => null);
    if (!json || json.code !== "1" || !json.url) throw fail("unavailable", (json && json.msg) || "源站没有返回音频地址");
    return json.url;
  }
  if (KIND === "fangpi") {
    const app = parseAppData(html);
    if (!app || !app.play_id) throw fail("unavailable", "歌曲页缺少播放参数");
    const res = await fetch(BASE + "/member/common-play-url", {
      method: "POST",
      headers: {
        "user-agent": UA,
        referer: BASE + path,
        origin: BASE,
        "x-requested-with": "XMLHttpRequest",
        "content-type": "application/x-www-form-urlencoded",
      },
      body: `id=${encodeURIComponent(app.play_id)}&purpose=play`,
    });
    const json = await res.json().catch(() => null);
    if (!json || json.code !== 1 || !json.data || !json.data.url) {
      throw fail("unavailable", (json && json.msg) || "源站没有返回音频地址");
    }
    return json.data.url;
  }
  const u = extractAudio(html, meta.audioTitle || meta.name);
  if (!u) throw fail("unavailable", "歌曲页没有返回音频地址");
  return u;
}
async function stream({ id } = {}) {
  const p0 = String(id || "");
  if (SITE.deadHome) throw fail("unavailable", SITE.note || "该站点当前没有可播放内容");
  const path = isDetail(p0) ? p0 : (known.get(p0) || {}).id || p0;
  if (!path || !isDetail(path)) throw fail("unavailable", "没有这个歌曲");
  const html = await fetchText(path);
  let u;
  try { u = await resolveAudio(html, path); } catch (e) { throw e.code ? e : fail("unavailable", e.message || "音频解析失败"); }
  u = abs(u);
  const type = audioType(u);
  const headers = { referer: BASE + path, "user-agent": UA };
  if (!localOn()) return { url: u, type, headers, title: "" };
  const all = slots();
  let slot = all.indexOf(path);
  if (slot < 0) { slot = all.findIndex((x) => !x); if (slot < 0) slot = slotOf(path); }
  const ext = type === "flac" ? "flac" : type === "m4a" ? "m4a" : "mp3";
  try {
    const target = fileFor(slot, ext);
    await toLocal(u, target, BASE + path);
    all[slot] = path;
    saveSlots(all);
    return { url: fileURL(target), type: ext === "flac" ? "flac" : ext === "m4a" ? "m4a" : "mp3", title: "" };
  } catch (e) {
    return { url: u, type, headers, title: "" };
  }
}
function lyrics() { return {}; }

function stored(k, d) { try { const v = host.storage.get(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
function like({ id, on } = {}) {
  const s = new Set(stored("liked", []));
  if (on) s.add(String(id)); else s.delete(String(id));
  host.storage.set("liked", JSON.stringify([...s]));
  return { id: String(id), liked: !!on };
}
function isLiked({ ids } = {}) {
  const s = new Set(stored("liked", []));
  const o = {};
  for (const id of ids || []) o[id] = s.has(String(id));
  return o;
}
function liked({ offset = 0 } = {}) {
  const all = stored("liked", []).map((id) => known.get(id)).filter(Boolean).map((a) => makeTrack(a.id, a.name, a.imageUrl, (a.artists[0] || {}).name || ""));
  return { tracks: all.slice(offset, offset + 60), more: all.length > offset + 60 };
}
function played({ id } = {}) {
  if (!id) return {};
  const list = stored("history", []).filter((x) => x !== id);
  list.push(String(id));
  host.storage.set("history", JSON.stringify(list.slice(-100)));
  return {};
}
function recent() {
  return stored("history", []).slice().reverse().map((id) => known.get(id)).filter(Boolean).map((a) => makeTrack(a.id, a.name, a.imageUrl, (a.artists[0] || {}).name || "")).slice(0, 20);
}
return { home, browse, search, suggest, album, stream, lyrics, like, isLiked, liked, played, recent };
})(__mfRuntime.host, __mfRuntime.fetch, __mfRuntime.TextDecoder, __mfRuntime.atob, __mfRuntime.btoa, __mfRuntime.URL, __mfRuntime.URLSearchParams);
module.exports = __mfRuntime.makePlugin(__mfPlugin, {"id": "inmp3", "name": "IN音乐网", "version": "0.1.0", "site": "inmp3.com", "searchTypes": ["music", "album"]});
