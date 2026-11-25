// 显示名：囧贼听书（jiongzei）
// MusicFree plugin generated from MyGo Music plugin; source site: 囧贼听书
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
// 囧贼听书（jiongzei.com）— MyGo Music 插件
//
// 站点是 UTF-8 的听书站：首页、分类 /jiongzei/<分类>.html（第 1 页）和
// /jiongzei/<分类>-<页>.html（第 2 页起），每页 16 部。
// 专辑 /tingshu/<id>.html 内含完整章节列表，单集 /play/<vid>-0-<part>.html
// 里的 var now 就是 CDN 音频直链；多数是 m4a，也有 mp3。
// 站内搜索 /search.php 会触发系统安全验证，插件改用分类首页 + 首页的本地目录搜索。

const BASE = "https://jiongzei.com";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const REFERER = BASE + "/";
const PAGE_TTL = 5 * 60 * 1000;

const CATEGORIES = [
  { id: "61", name: "言情" },
  { id: "62", name: "武侠" },
  { id: "63", name: "悬疑" },
  { id: "64", name: "历史" },
  { id: "65", name: "军事" },
  { id: "66", name: "评书" },
  { id: "67", name: "相声小品" },
  { id: "68", name: "百家讲坛" },
  { id: "69", name: "商业财经" },
  { id: "610", name: "健康养生" },
];

const CATEGORY_MAP = new Map(CATEGORIES.map((item) => [item.id, item]));

let pageCache = new Map();
let catalogCache = null;
let catalogAt = 0;

function fail(code, message) {
  const error = new Error(message || code);
  error.code = code;
  return error;
}

function stripTags(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();
}

function absUrl(value, base) {
  if (!value) return "";
  try {
    return new URL(String(value).replace(/&amp;/g, "&"), base || REFERER).toString();
  } catch (_) {
    return "";
  }
}

async function request(url, referer) {
  let lastError = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "user-agent": UA,
          referer: referer || REFERER,
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.6",
        },
        redirect: "follow",
      });
      if (!response.ok) {
        if ([408, 425, 429, 500, 502, 503, 504].includes(response.status) && attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, 600 + attempt * 500));
          continue;
        }
        throw fail("unavailable", "囧贼听书返回 HTTP " + response.status + "：" + url);
      }
      const text = await response.text();
      if (!text || text.length < 160 || text.includes("系统安全验证")) {
        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, 600 + attempt * 500));
          continue;
        }
        throw fail("unavailable", "囧贼听书页面被安全验证拦截，请稍后重试");
      }
      return text;
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 600 + attempt * 500));
        continue;
      }
    }
  }
  throw lastError || fail("unavailable", "囧贼听书请求失败");
}

async function pageHtml(path, referer) {
  const url = path.startsWith("http") ? path : BASE + path;
  const hit = pageCache.get(url);
  if (hit && Date.now() - hit.at < PAGE_TTL) return hit.html;
  const html = await request(url, referer || REFERER);
  pageCache.set(url, { html, at: Date.now() });
  if (pageCache.size > 80) {
    const oldest = [...pageCache.entries()].sort((a, b) => a[1].at - b[1].at)[0];
    if (oldest) pageCache.delete(oldest[0]);
  }
  return html;
}

function categoryOf(block) {
  const href = String(block).match(/href=["']\/jiongzei\/(\d+)\.html["'][^>]*>([\s\S]*?)<\/a>/i);
  if (!href) return { id: "", name: "" };
  return { id: href[1], name: stripTags(href[2]).replace(/^\[|\]$/g, "") };
}

function authorOf(block) {
  const text = String(block);
  const patterns = [
    /icon-user[^>]*><\/i>\s*<a[^>]*>([\s\S]*?)<\/a>/i,
    /作者：\s*<a[^>]*>([\s\S]*?)<\/a>/i,
    /作者：([^<，。]+)/i,
    /icon-user[^>]*><\/i>\s*([^<]+)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;
    const name = stripTags(match[1]);
    if (name) return name;
  }
  return "";
}

function episodesOf(block) {
  const match = String(block).match(/(?:连载|完结|更新至)[，,\s]*(\d+)\s*集/);
  return match ? Number(match[1]) : 0;
}

function parseCards(html, categoryName) {
  const out = [];
  const seen = new Set();
  const blocks = String(html).split(/<li[^>]*class="[^"]*col-[^"]*"[^>]*>/i).slice(1);
  for (const block of blocks) {
    const link = block.match(/href=["']\/tingshu\/(\d+)\.html["']/i);
    if (!link) continue;
    const id = link[1];
    if (seen.has(id)) continue;
    const image = (block.match(/<img[^>]*src=["']([^"']+)["']/i) || [])[1] || "";
    const alt = (block.match(/<img[^>]*alt=["']([^"']*)["']/i) || [])[1] || "";
    const title =
      stripTags((block.match(/<a[^>]*class="[^"]*f-bold[^"]*"[^>]*>([\s\S]*?)<\/a>/i) || [])[1]) ||
      stripTags(alt);
    if (!title) continue;
    const cat = categoryOf(block);
    const author = authorOf(block);
    const description = stripTags((block.match(/<p[^>]*class="[^"]*f-gray[^"]*"[^>]*>([\s\S]*?)<\/p>/i) || [])[1]);
    seen.add(id);
    out.push({
      id,
      name: title,
      imageUrl: absUrl(image, BASE),
      artists: author ? [{ id: "", name: author }] : [],
      released: "",
      category: cat.name || categoryName || "",
      description,
      total: episodesOf(block),
    });
  }
  return out;
}

function browseUrl(id, page) {
  return page <= 1 ? "/jiongzei/" + id + ".html" : "/jiongzei/" + id + "-" + page + ".html";
}

function pageInfo(html, id, page) {
  let last = page;
  for (const match of String(html).matchAll(new RegExp("/jiongzei/" + id + "-(\\d+)\\.html", "g"))) {
    last = Math.max(last, Number(match[1]));
  }
  return { page, last, hasNext: page < last };
}

async function catalog() {
  if (catalogCache && Date.now() - catalogAt < PAGE_TTL) return catalogCache;
  const batches = [];
  for (let i = 0; i < CATEGORIES.length; i += 5) batches.push(CATEGORIES.slice(i, i + 5));
  const lists = [];
  for (const batch of batches) {
    const results = await Promise.all(
      batch.map(async (meta) => {
        try {
          return parseCards(await pageHtml(browseUrl(meta.id, 1)), meta.name);
        } catch (_) {
          return [];
        }
      })
    );
    lists.push(...results);
  }
  let home = [];
  let latest = [];
  try {
    const html = await pageHtml("/");
    home = parseCards(html);
    latest = latestSection(html);
  } catch (_) {}
  const seen = new Set();
  const all = [];
  for (const item of lists.flat().concat(home, latest)) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    all.push(item);
  }
  const byId = new Map(all.map((item) => [item.id, item]));
  for (const item of latest) {
    const card = byId.get(item.id);
    if (card && card.imageUrl && !item.imageUrl) item.imageUrl = card.imageUrl;
  }
  catalogCache = all;
  catalogAt = Date.now();
  return all;
}

function categoryLinks() {
  return CATEGORIES.map((meta) => ({ title: meta.name, page: "list:" + meta.id + ":1" }));
}

function parseLatest(html) {
  const out = [];
  const seen = new Set();
  const rows = String(html).split(/<li[^>]*class="[^"]*clearfix[^"]*"[^>]*>/i).slice(1);
  for (const row of rows) {
    const link = row.match(/href=["']\/tingshu\/(\d+)\.html["'][^>]*class=["'][^"']*tx-c1[^"']*["'][^>]*>([\s\S]*?)<\/a>/i) ||
      row.match(/<a[^>]*href=["']\/tingshu\/(\d+)\.html["'][^>]*>([\s\S]*?)<\/a>/i);
    if (!link) continue;
    const id = link[1];
    if (seen.has(id)) continue;
    const title = stripTags(link[2]);
    if (!title) continue;
    const cat = categoryOf(row);
    const total = episodesOf(row);
    seen.add(id);
    out.push({
      id,
      name: title,
      imageUrl: "",
      artists: [],
      released: "",
      category: cat.name || "",
      description: "",
      total,
    });
  }
  return out;
}

function latestSection(html) {
  const start = html.indexOf("推荐小说列表");
  if (start < 0) return [];
  const end = html.indexOf("猜你喜欢", start);
  const chunk = html.slice(start, end > start ? end : start + 24000);
  return parseLatest(chunk);
}
async function home() {
  const html = await pageHtml("/");
  const all = parseCards(html);
  const latest = latestSection(html);
  const byId = new Map(all.map((item) => [item.id, item]));
  for (const item of latest) {
    const card = byId.get(item.id);
    if (card && card.imageUrl && !item.imageUrl) item.imageUrl = card.imageUrl;
  }
  const seen = new Set();
  const picks = all.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  return {
    title: "囧贼听书",
    subtitle: "评书 · 相声小品 · 有声小说 · 百家讲坛",
    description:
      "囧贼听书在线目录。首页与分类页每页 16 部，专辑页一次列出全部章节；播放地址从单集页的 var now 读取。站内搜索有安全验证，插件用本地目录搜索。",
    sections: [
      { title: "推荐收听", albums: picks.slice(0, 24), empty: "推荐内容暂时为空" },
      { title: "最新上架", albums: latest.slice(0, 24), empty: "最新上架暂时为空" },
      { title: "分类浏览", links: categoryLinks() },
    ],
  };
}
async function browse({ page } = {}) {
  const raw = String(page || "latest");
  if (raw === "latest") {
    const html = await pageHtml("/");
    const latest = latestSection(html);
    return {
      title: "最新上架",
      subtitle: latest.length + " 部",
      sections: [{ title: "最新上架", albums: latest, empty: "最新上架暂时为空" }],
    };
  }

  if (raw === "categories") {
    return {
      title: "分类浏览",
      subtitle: CATEGORIES.length + " 个分类",
      sections: [{ title: "全部分类", links: categoryLinks() }],
    };
  }

  const match = raw.match(/^list:([0-9]+):([0-9]+)$/);
  if (match) {
    const id = match[1];
    const p = Math.max(1, Number(match[2]));
    const meta = CATEGORY_MAP.get(id);
    if (!meta) throw fail("unavailable", "未知分类：" + id);
    const html = await pageHtml(browseUrl(id, p));
    const albums = parseCards(html, meta.name);
    if (!albums.length) throw fail("unavailable", meta.name + " 第 " + p + " 页没有解析到专辑");
    const info = pageInfo(html, id, p);
    const links = [];
    if (p > 1) links.push({ title: "上一页", page: "list:" + id + ":" + (p - 1) });
    if (info.hasNext) links.push({ title: "下一页", page: "list:" + id + ":" + (p + 1) });
    links.push({ title: "返回全部分类", page: "categories" });
    return {
      title: meta.name + (p > 1 ? " · 第 " + p + " 页" : ""),
      subtitle: albums.length + " 部 · 共 " + info.last + " 页",
      sections: [{ title: meta.name, albums }, { title: "翻页", links }],
    };
  }

  throw fail("unavailable", "未知页面：" + raw);
}
async function album({ id } = {}) {
  const bookId = String(id || "");
  if (!/^\d+$/.test(bookId)) throw fail("unavailable", "专辑编号不正确：" + bookId);
  const url = "/tingshu/" + bookId + ".html";
  const html = await pageHtml(url);
  const title = stripTags((html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]) || "未命名专辑";
  const image = (html.match(/<span[^>]*class="[^"]*img-box[^"]*"[^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["']/i) || [])[1] ||
    (html.match(/<img[^>]*class="[^"]*img-box[^"]*"[^>]*src=["']([^"']+)["']/i) || [])[1] ||
    (html.match(/<img[^>]*src=["']([^"']+)["'][^>]*alt=/i) || [])[1] || "";
  const place = (html.match(/<div[^>]*class="[^"]*place[^"]*"[^>]*>([\s\S]*?)<\/div>/i) || [])[1] || "";
  const cat = categoryOf(place);
  const author = authorOf(html);
  const announcer = stripTags((html.match(/由\s*<a[^>]*>([\s\S]*?)<\/a>[\s\S]{0,40}?播音/i) || [])[1]);
  const description = stripTags((html.match(/内容介绍：([\s\S]*?)<\/p>/i) || [])[1]);

  const albumMeta = {
    id: bookId,
    name: title,
    imageUrl: absUrl(image, BASE + url),
    artists: author ? [{ id: "", name: author }] : [],
    released: "",
    category: cat.name || "",
    description,
    announcer,
  };

  const tracks = [];
  const seen = new Set();
  const re = /<a\b[^>]*title=["']([^"']*)["'][^>]*href=["']\/play\/(\d+)-0-(\d+)\.html["']/gi;
  let match;
  while ((match = re.exec(html))) {
    const name = stripTags(match[1]);
    const vid = match[2];
    const part = Number(match[3]);
    const idKey = vid + "-" + part;
    if (!name || seen.has(idKey)) continue;
    seen.add(idKey);
    tracks.push({ id: idKey, name, vid, part });
  }

  if (!tracks.length) {
    const fallback = /<a\b[^>]*href=["']\/play\/(\d+)-0-(\d+)\.html["'][^>]*>([\s\S]*?)<\/a>/gi;
    while ((match = fallback.exec(html))) {
      const vid = match[1];
      const part = Number(match[2]);
      const name = stripTags(match[3]);
      const idKey = vid + "-" + part;
      if (!name || name === "开始收听" || seen.has(idKey)) continue;
      seen.add(idKey);
      tracks.push({ id: idKey, name, vid, part });
    }
  }

  tracks.sort((a, b) => a.part - b.part);

  return {
    album: albumMeta,
    tracks: tracks.map((track) => ({
      id: track.id,
      name: track.name,
      artists: announcer ? [{ id: "", name: announcer }] : albumMeta.artists,
      album: albumMeta,
      duration: 0,
      url: BASE + "/play/" + track.vid + "-0-" + track.part + ".html",
    })),
  };
}
async function search({ query, kind } = {}) {
  const term = String(query || "").trim().toLowerCase();
  const all = await catalog();
  const list = term
    ? all.filter((item) => item.name.toLowerCase().includes(term) || (item.description || "").toLowerCase().includes(term))
    : all.slice(0, 48);
  const albums = list.slice(0, 60);

  if (kind === "tracks") return { tracks: [], more: false };
  if (kind === "albums") return { albums, more: list.length > 60 };
  return { tracks: [], albums, artists: [], playlists: [], shows: [], more: list.length > 60 };
}
async function suggest({ query } = {}) {
  const term = String(query || "").trim().toLowerCase();
  if (!term) return [];
  try {
    const home = parseCards(await pageHtml("/"));
    const hits = home.filter((item) => item.name.toLowerCase().includes(term));
    if (hits.length) return hits.slice(0, 10).map((item) => item.name);
    const all = await catalog();
    return all
      .filter((item) => item.name.toLowerCase().includes(term))
      .slice(0, 10)
      .map((item) => item.name);
  } catch (_) {
    return [];
  }
}
async function stream({ id } = {}) {
  const trackId = String(id || "");
  const match = trackId.match(/^(\d+)-(\d+)$/);
  if (!match) throw fail("unavailable", "章节编号不正确：" + trackId);
  const url = BASE + "/play/" + match[1] + "-0-" + match[2] + ".html";
  const html = await pageHtml(url);
  const now = (html.match(/(?:var|let|const)\s+now\s*=\s*["']([^"']+)["']/i) || [])[1] || "";
  if (!now) throw fail("unavailable", "这一集没有可用的播放地址");
  let audio = now.replace(/&amp;/g, "&").trim();
  if (audio.startsWith("//")) audio = "https:" + audio;
  let finalUrl;
  try {
    finalUrl = new URL(audio, BASE).toString();
  } catch (_) {
    throw fail("unavailable", "播放地址格式不正确");
  }
  const path = finalUrl.split("?")[0].toLowerCase();
  let type = "mp3";
  if (path.endsWith(".m4a")) type = "m4a";
  else if (path.endsWith(".aac")) type = "aac";
  else if (path.endsWith(".flac")) type = "flac";
  else if (path.endsWith(".ogg")) type = "ogg";
  return {
    url: finalUrl,
    type,
    headers: {
      referer: url,
      "user-agent": UA,
    },
  };
}
return { home, browse, album, search, suggest, stream };
})(__mfRuntime.host, __mfRuntime.fetch, __mfRuntime.TextDecoder, __mfRuntime.atob, __mfRuntime.btoa, __mfRuntime.URL, __mfRuntime.URLSearchParams);
module.exports = __mfRuntime.makePlugin(__mfPlugin, {"id": "jiongzei", "name": "囧贼听书", "version": "1.0.0", "site": "囧贼听书", "searchTypes": ["music", "album"]});
