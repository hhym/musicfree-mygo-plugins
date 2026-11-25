// 显示名：恋听网（ting55）
// MusicFree plugin generated from MyGo Music plugin; source site: ting55.com
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
// 恋听网（ting55.com）— MyGo Music 插件
//
// 站点是有声小说站：一本书是专辑，每一集是曲目。书籍页直接列出全部集数；
// 播放地址不在页面里，而是章节页带着一次性 token 调 POST /nlinka 换取，
// 需要同时带上章节页的 xt 头和 l: 1。音频由 pp.ting55.com 提供。

const BASE = "https://ting55.com";
const MOBILE = "https://m.ting55.com";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const REFERER = BASE + "/";
const PAGE_TTL = 5 * 60 * 1000;
const LIKE_KEY = "ting55:liked";
const RECENT_KEY = "ting55:recent";

const t = (text) => host.t(text);
const pageCache = new Map();

const CATEGORIES = {
  1: "玄幻",
  2: "武侠",
  3: "都市",
  4: "言情",
  5: "穿越",
  6: "科幻",
  7: "推理",
  8: "恐怖",
  9: "惊悚",
  10: "历史",
  11: "经典",
  12: "相声",
  13: "百家讲坛",
  14: "评书",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fail(code, message) {
  const error = new Error(message || code);
  error.code = code;
  return error;
}

function clean(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
      const cp = parseInt(hex, 16);
      return cp > 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : "";
    })
    .replace(/&#(\d+);/g, (_, dec) => {
      const cp = parseInt(dec, 10);
      return cp > 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : "";
    })
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function absolute(url) {
  if (!url) return "";
  let value = url;
  if (value.startsWith("//")) value = "https:" + value;
  else if (value.startsWith("/")) value = BASE + value;
  return value.replace(/!120$/, "!300").replace(/!180$/, "!300").replace(/!240$/, "!300");
}

function imageFrom(block) {
  const match = /<img[^>]*src="([^"]+)"/i.exec(block);
  return match ? absolute(match[1]) : "";
}

function bookName(value) {
  return clean(value)
    .replace(/有声小说$/i, "")
    .replace(/\s+有声小说$/i, "")
    .trim();
}

function albumCard(id, name, imageUrl) {
  return { id: String(id), name: bookName(name) || t("未命名"), imageUrl: imageUrl || "" };
}

async function fetchText(path, cache = true) {
  const url = path.startsWith("http") ? path : BASE + path;
  const hit = pageCache.get(url);
  if (cache && hit && Date.now() - hit.at < PAGE_TTL) return hit.text;
  let lastError = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "user-agent": UA,
          referer: REFERER,
          accept: "text/html,application/xhtml+xml,*/*",
        },
      });
      if (response.ok) {
        const text = await response.text();
        if (cache) pageCache.set(url, { text, at: Date.now() });
        return text;
      }
      lastError = fail("unavailable", `站点返回 ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await sleep(500 + attempt * 600);
  }
  throw lastError || fail("unavailable", "站点暂时无法访问");
}

function parseBooks(html) {
  const out = [];
  const seen = new Set();
  for (const block of String(html).match(/<li[^>]*>[\s\S]*?<\/li>/gi) || []) {
    const link = /<a[^>]*href="\/book\/(\d+)"/i.exec(block);
    if (!link || seen.has(link[1])) continue;
    seen.add(link[1]);
    const anchor = link[0];
    const img = /<img[^>]*>/i.exec(block);
    const imgTag = img ? img[0] : "";
    const title =
      clean((/title="([^"]*)"/i.exec(anchor) || [])[1]) ||
      clean((/title="([^"]*)"/i.exec(imgTag) || [])[1]) ||
      clean((/alt="([^"]*)"/i.exec(imgTag) || [])[1]) ||
      clean((/<h[234][^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i.exec(block) || [])[1]) ||
      clean((/<a[^>]*href="\/book\/\d+"[^>]*>([\s\S]*?)<\/a>/i.exec(block) || [])[1]);
    const src = /src="([^"]+)"/i.exec(imgTag);
    out.push(albumCard(link[1], title, src ? absolute(src[1]) : ""));
  }
  if (!out.length) {
    for (const match of String(html).matchAll(/<a[^>]*href="\/book\/(\d+)"[^>]*title="([^"]*)"[^>]*>/gi)) {
      if (seen.has(match[1])) continue;
      seen.add(match[1]);
      out.push(albumCard(match[1], match[2], ""));
    }
  }
  return out;
}

function parseBookDetail(html, id) {
  const title = clean((/<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html) || [])[1]);
  const name = bookName(title) || t("有声小说");
  const img = /<div class="bimg"[^>]*>[\s\S]*?<img[^>]*src="([^"]+)"/i.exec(html);
  const artists = [];
  const seenArtists = new Set();
  const byBlock = /<p>\s*播音：([\s\S]*?)<\/p>/i.exec(html);
  if (byBlock) {
    for (const match of byBlock[1].matchAll(/<a[^>]*href="\/byy\/([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
      if (seenArtists.has(match[1])) continue;
      seenArtists.add(match[1]);
      artists.push({ id: match[1], name: clean(match[2]) });
    }
  }
  const intro = clean((/<div class="intro"[^>]*>([\s\S]*?)<\/div>/i.exec(html) || [])[1]);
  const released = clean((/<p>\s*时间：([\s\S]*?)<\/p>/i.exec(html) || [])[1]).slice(0, 10);
  const tracks = [];
  const seen = new Set();
  for (const match of String(html).matchAll(
    /<a[^>]*href="\/book\/(\d+)-(\d+)"[^>]*>([\s\S]*?)<\/a>/gi,
  )) {
    const key = `${match[1]}-${match[2]}`;
    if (seen.has(key)) continue;
    seen.add(key);
    tracks.push(makeTrack(key, `${t("第")}${match[2]}${t("集")}`, artists, {
      id: String(id),
      name,
      imageUrl: img ? absolute(img[1]) : "",
    }));
  }
  if (!tracks.length) {
    for (const match of String(html).matchAll(/href="\/book\/(\d+)-(\d+)"/gi)) {
      const key = `${match[1]}-${match[2]}`;
      if (seen.has(key)) continue;
      seen.add(key);
      tracks.push(makeTrack(key, `${t("第")}${match[2]}${t("集")}`, artists, {
        id: String(id),
        name,
        imageUrl: img ? absolute(img[1]) : "",
      }));
    }
  }
  const album = {
    id: String(id),
    name,
    imageUrl: img ? absolute(img[1]) : "",
    artists,
    released,
    description: intro,
  };
  return { album, tracks };
}

function makeTrack(id, name, artists, album) {
  return {
    id: String(id),
    name: clean(name) || t("未命名"),
    artists: (artists || []).map((item) => ({ id: String(item.id || ""), name: clean(item.name) })),
    album: {
      id: String(album.id || ""),
      name: clean(album.name),
      imageUrl: album.imageUrl || "",
    },
    duration: 0,
    url: `${BASE}/book/${id}`,
  };
}

function sectionByClass(html, cls) {
  const pattern = new RegExp(`<section[^>]*class="[^"]*${cls}[^"]*"[^>]*>[\\s\\S]*?<\\/section>`, "i");
  const match = pattern.exec(html);
  return match ? match[0] : "";
}

function parseHome(html) {
  const sections = [];
  const pic = sectionByClass(html, "pic");
  if (pic) {
    const title = clean((/<h2[^>]*>([\s\S]*?)<\/h2>/i.exec(pic) || [])[1]) || t("精品有声小说");
    const albums = parseBooks(pic);
    if (albums.length) sections.push({ title, albums, morePage: { page: "tuijian:1", pageTitle: t("推荐") } });
  }
  const latest = sectionByClass(html, "h-new");
  if (latest) {
    const albums = parseBooks(latest);
    if (albums.length) sections.push({ title: t("最新有声小说"), albums, morePage: { page: "tuijian:1", pageTitle: t("推荐") } });
  }
  const whole = sectionByClass(html, "h-whole");
  if (whole) {
    const albums = parseBooks(whole);
    if (albums.length) sections.push({ title: t("全本有声小说"), albums, morePage: { page: "tuijian:1", pageTitle: t("推荐") } });
  }
  for (const match of String(html).matchAll(/<section[^>]*class="[^"]*h-category[^"]*"[^>]*>[\s\S]*?<\/section>/gi)) {
    const block = match[0];
    const heading = clean((/<h2[^>]*>([\s\S]*?)<\/h2>/i.exec(block) || [])[1]);
    const albums = parseBooks(block);
    if (!albums.length) continue;
    const link = /<h2[^>]*>[\s\S]*?<a[^>]*href="\/category\/(\d+)"/i.exec(block);
    sections.push({
      title: heading || t("有声小说"),
      albums,
      morePage: link ? { page: `category:${link[1]}:1`, pageTitle: heading } : undefined,
    });
  }
  return { title: t("恋听网"), sections };
}

function listPath(kind, id, page) {
  const n = Math.max(1, Number(page) || 1);
  if (kind === "tuijian") return n === 1 ? "/tuijian" : `/tuijian/page/${n}`;
  if (kind === "paihang") return n === 1 ? `/paihang/${id}` : `/paihang/${id}/page/${n}`;
  return n === 1 ? `/category/${id}` : `/category/${id}/page/${n}`;
}

function leftBlock(html) {
  const start = String(html).indexOf('<div class="left"');
  if (start < 0) return String(html);
  const aside = String(html).indexOf("<aside", start);
  const right = String(html).indexOf('<div class="right"', start);
  let end = String(html).length;
  if (aside >= 0) end = Math.min(end, aside);
  if (right >= 0) end = Math.min(end, right);
  return String(html).slice(start, end);
}

function parseListPage(html, title, kind, id, page) {
  const albums = parseBooks(leftBlock(html));
  return {
    title,
    sections: [
      {
        title,
        albums,
        morePage: albums.length ? { page: `${kind}:${id}:${Number(page) + 1}`, pageTitle: title } : undefined,
        empty: albums.length ? "" : t("这一页没有内容"),
      },
    ],
  };
}

function parseSearch(html) {
  return parseBooks(leftBlock(html));
}

function chapterMeta(html) {
  const meta = (name) => {
    const match = new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]*)"`, "i").exec(html);
    return match ? match[1] : "";
  };
  return {
    token: meta("_c"),
    bookId: meta("_b"),
    page: meta("_cp"),
    isPay: meta("_p"),
    title: clean(meta("_t") || (/<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html) || [])[1]),
    bookTitle: clean(meta("_pt")),
  };
}

function chapterTrack(id, meta) {
  const parts = String(id).split("-");
  const bookId = parts[0];
  const page = parts[1] || "1";
  const artists = [];
  return makeTrack(id, meta.title || `${t("第")}${page}${t("集")}`, artists, {
    id: bookId,
    name: bookName(meta.bookTitle) || t("有声小说"),
    imageUrl: "",
  });
}

async function audioUrl(id) {
  const parts = String(id).split("-");
  const bookId = parts[0];
  const page = parts[1] || "1";
  const chapterPath = `/book/${bookId}-${page}`;
  const html = await fetchText(chapterPath, false);
  const meta = chapterMeta(html);
  if (!meta.token || meta.bookId !== String(bookId)) {
    throw fail("unavailable", t("这一集暂时无法播放"));
  }
  const body = `bookId=${encodeURIComponent(meta.bookId)}&isPay=${encodeURIComponent(
    meta.isPay || "0",
  )}&page=${encodeURIComponent(meta.page || page)}`;
  const headers = {
    "user-agent": UA,
    referer: BASE + chapterPath,
    origin: BASE,
    "content-type": "application/x-www-form-urlencoded",
    xt: meta.token,
    l: "1",
    accept: "application/json,text/plain,*/*",
  };
  try {
    const response = await fetch(BASE + "/nlinka", { method: "POST", headers, body });
    if (response.ok) {
      const data = await response.json();
      if (data && data.status !== -1) {
        const direct = data.ourl || "";
        if (direct) return direct;
        if (data.url) return data.url + (data.url.includes("?") ? "&" : "?") + "v=" + Date.now();
      }
    }
  } catch (error) {
    // 桌面接口不可用时继续尝试移动接口
  }
  const mobileHtml = await fetchText(`${MOBILE}/book/${bookId}-${page}`, false);
  const mobileMeta = chapterMeta(mobileHtml);
  if (!mobileMeta.token) throw fail("unavailable", t("这一集暂时无法播放"));
  const mobileBody = `bookId=${encodeURIComponent(bookId)}&isPay=${encodeURIComponent(
    mobileMeta.isPay || "0",
  )}&page=${encodeURIComponent(mobileMeta.page || page)}`;
  const mobileResponse = await fetch(MOBILE + "/glink", {
    method: "POST",
    headers: {
      "user-agent": "Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
      referer: `${MOBILE}/book/${bookId}-${page}`,
      origin: MOBILE,
      "content-type": "application/x-www-form-urlencoded",
      xt: mobileMeta.token,
      accept: "application/json,text/plain,*/*",
    },
    body: mobileBody,
  });
  if (!mobileResponse.ok) throw fail("unavailable", t("这一集暂时无法播放"));
  const mobileData = await mobileResponse.json();
  if (mobileData && mobileData.ourl) return mobileData.ourl;
  if (mobileData && mobileData.url) return mobileData.url + "?v=" + Date.now();
  throw fail("unavailable", t("这一集暂时没有可用的音频"));
}

function storedList(key) {
  const value = host.storage.get(key);
  return Array.isArray(value) ? value : [];
}

function trackFromStored(item) {
  return makeTrack(item.id, item.name, item.artists || [], {
    id: item.albumId || String(item.id).split("-")[0],
    name: item.albumName || t("有声小说"),
    imageUrl: item.imageUrl || "",
  });
}

async function describe(id) {
  const parts = String(id).split("-");
  const html = await fetchText(`/book/${parts[0]}-${parts[1] || "1"}`, false);
  const meta = chapterMeta(html);
  return {
    id: String(id),
    name: meta.title || `${t("第")}${parts[1] || "1"}${t("集")}`,
    albumId: parts[0],
    albumName: bookName(meta.bookTitle) || t("有声小说"),
    imageUrl: "",
    artists: [],
  };
}
async function home() {
  return parseHome(await fetchText("/", false));
}
async function browse({ page } = {}) {
  const value = String(page || "home");
  if (!value || value === "home") return home();
  const parts = value.split(":");
  const kind = parts[0];
  if (kind === "tuijian" || kind === "category" || kind === "paihang") {
    const id = kind === "tuijian" ? "" : parts[1] || "1";
    const pageNo = Math.max(1, parseInt(parts[2] || "1", 10) || 1);
    const title =
      kind === "tuijian" ? t("推荐") : `${CATEGORIES[id] || t("有声小说")}${kind === "paihang" ? t("排行榜") : ""}`;
    const html = await fetchText(listPath(kind, id, pageNo));
    return parseListPage(html, title, kind, id, pageNo);
  }
  return home();
}
async function search({ query, kind, offset } = {}) {
  const keyword = String(query || "").trim();
  if (!keyword) return { tracks: [], albums: [], more: false };
  const html = await fetchText(`/search/${encodeURIComponent(keyword)}`, false);
  const albums = parseSearch(html);
  if (kind === "albums") return { albums, more: false };
  if (kind === "artists" || kind === "playlists" || kind === "shows") {
    return { tracks: [], albums, more: false };
  }
  const tracks = [];
  for (const item of albums.slice(0, 6)) {
    try {
      const detail = parseBookDetail(await fetchText(`/book/${item.id}`, false), item.id);
      if (detail.tracks.length) {
        tracks.push({
          ...detail.tracks[0],
          name: item.name,
          album: { id: item.id, name: item.name, imageUrl: item.imageUrl || "" },
        });
      }
    } catch (error) {
      // 个别书籍页打不开时略过
    }
  }
  return { tracks, albums, more: false };
}
async function suggest({ query } = {}) {
  if (!String(query || "").trim()) return [];
  const result = await search({ query, kind: "albums" });
  return (result.albums || []).slice(0, 8).map((item) => item.name);
}
async function album({ id } = {}) {
  const html = await fetchText(`/book/${id}`);
  return parseBookDetail(html, id);
}
async function artist({ id } = {}) {
  const html = await fetchText(`/byy/${id}`);
  const bread = clean((/<div class="bread"[^>]*>([\s\S]*?)<\/div>/i.exec(html) || [])[1]);
  const title = clean((/<title>([^<]*)<\/title>/i.exec(html) || [])[1]);
  const name = bread.split(">").pop().trim() || title.split("_")[0];
  return {
    artist: { id: String(id), name, imageUrl: "", description: "" },
    tracks: [],
    albums: parseBooks(leftBlock(html)),
  };
}
async function lyrics() {
  return {};
}
async function stream({ id } = {}) {
  const url = await audioUrl(id);
  const chapterPath = `/book/${id}`;
  return { url, type: "mp3", headers: { referer: `${BASE}${chapterPath}` }, size: 0, gain: 0, peak: 0 };
}
async function like({ id, on } = {}) {
  const items = storedList(LIKE_KEY);
  const key = String(id);
  let next = items.filter((item) => item.id !== key);
  if (on) {
    try {
      next.unshift(await describe(key));
    } catch (error) {
      next.unshift({ id: key, name: `${t("第")}${key.split("-")[1] || "1"}${t("集")}`, albumId: key.split("-")[0], albumName: t("有声小说") });
    }
  }
  host.storage.set(LIKE_KEY, next);
  return { on: Boolean(on) };
}
async function isLiked({ ids } = {}) {
  const set = new Set(storedList(LIKE_KEY).map((item) => item.id));
  const result = {};
  for (const id of ids || []) result[String(id)] = set.has(String(id));
  return result;
}
async function liked({ offset } = {}) {
  const start = Math.max(0, Number(offset) || 0);
  return { tracks: storedList(LIKE_KEY).slice(start, start + 40).map(trackFromStored), more: false };
}
async function played({ id } = {}) {
  const items = storedList(RECENT_KEY);
  const key = String(id);
  let next = items.filter((item) => item.id !== key);
  try {
    next.unshift(await describe(key));
  } catch (error) {
    next.unshift({ id: key, name: `${t("第")}${key.split("-")[1] || "1"}${t("集")}`, albumId: key.split("-")[0], albumName: t("有声小说") });
  }
  host.storage.set(RECENT_KEY, next.slice(0, 40));
  return {};
}
async function recent() {
  return storedList(RECENT_KEY).map(trackFromStored);
}
return { home, browse, search, suggest, album, artist, lyrics, stream, like, isLiked, liked, played, recent };
})(__mfRuntime.host, __mfRuntime.fetch, __mfRuntime.TextDecoder, __mfRuntime.atob, __mfRuntime.btoa, __mfRuntime.URL, __mfRuntime.URLSearchParams);
module.exports = __mfRuntime.makePlugin(__mfPlugin, {"id": "ting55", "name": "恋听网", "version": "1.0.0", "site": "ting55.com", "searchTypes": ["music", "album", "artist"]});
