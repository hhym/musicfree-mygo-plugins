// 显示名：嗨瑶DJ（haiyaodj）
// MusicFree plugin generated from MyGo Music plugin; source site: 嗨瑶DJ
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
// 嗨瑶DJ站（haiyaodj.com）— MyGo Music 插件
//
// 站点是 PHP 服务端页面：首页 update-list 是最新上传，/cl/<分类>-0-0-<页>.html
// 是分类列表（每页 20 首），/zt/<slug>.html 是 DJ 歌单（通常 100 首）。
// 单曲详情 /music/<sname>.html 里的 FilePath 经过两层 Base64 + 一次 XOR，
// XOR 密钥固定为 "1121"；解出来的地址在 st.92kk.com，是公开 mp3 直链。
//
// 站点搜索 /search/so?key=... 目前经常返回空列表，search() 会先试站点搜索，
// 没有结果时再用近期目录做本地匹配。

const BASE = "https://www.haiyaodj.com";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const REFERER = BASE + "/";
const PAGE_TTL = 5 * 60 * 1000;

const CATEGORIES = [
  { id: "1", name: "串烧舞曲" },
  { id: "2", name: "中文Remix" },
  { id: "3", name: "外文Remix" },
  { id: "5", name: "酒吧套曲" },
  { id: "6", name: "车载音乐" },
  { id: "7", name: "伤感串烧" },
  { id: "8", name: "电音串烧" },
  { id: "9", name: "迪高串烧" },
  { id: "10", name: "连版串烧" },
  { id: "11", name: "酒吧串烧" },
  { id: "12", name: "劲爆串烧" },
  { id: "13", name: "中文Disco" },
  { id: "14", name: "中文EDM" },
  { id: "15", name: "中文FunkyHouse" },
  { id: "16", name: "中文Trap" },
  { id: "17", name: "中文Club" },
  { id: "18", name: "外文Disco" },
  { id: "19", name: "外文EDM" },
  { id: "20", name: "外文FunkyHouse" },
  { id: "21", name: "外文Trap" },
  { id: "22", name: "外文Club" },
  { id: "26", name: "AI音乐" },
];

const CATEGORY_MAP = new Map(CATEGORIES.map((item) => [item.id, item]));

// 首页「热门DJ专题」的 10 个固定歌单；每张歌单站点返回 50 首。
const PLAYLISTS = [
  { slug: "lmmasjbydjgcw", name: "林妹妹爱上贾宝玉dj广场舞" },
  { slug: "mp3gqdbmfxz", name: "mp3歌曲打包免费下载" },
  { slug: "mfgpzmp3xz", name: "免费高品质mp3下载" },
  { slug: "fxdg", name: "发泄的歌" },
  { slug: "syqtdg", name: "声音清甜的歌" },
  { slug: "qxnthdyddj", name: "前些年最火的印度dj" },
  { slug: "djybcyl", name: "dj摇摆纯音乐" },
  { slug: "xngqlc", name: "新年歌曲联唱" },
  { slug: "gyjjlkrssdgq", name: "关于即将离开人世时的歌曲" },
  { slug: "xlymbgm", name: "旋律优美bgm" },
];
const FLV_KEY = "1121";

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

function decodeUtf8(buffer) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    if (b < 0x80) {
      out += String.fromCharCode(b);
    } else if (b >= 0xC2 && b <= 0xDF && i + 1 < bytes.length && (bytes[i + 1] & 0xC0) === 0x80) {
      out += String.fromCharCode(((b & 0x1F) << 6) | (bytes[++i] & 0x3F));
    } else if (
      b >= 0xE0 &&
      b <= 0xEF &&
      i + 2 < bytes.length &&
      (bytes[i + 1] & 0xC0) === 0x80 &&
      (bytes[i + 2] & 0xC0) === 0x80
    ) {
      out += String.fromCharCode(((b & 0x0F) << 12) | ((bytes[i + 1] & 0x3F) << 6) | (bytes[i + 2] & 0x3F));
      i += 2;
    } else if (
      b >= 0xF0 &&
      b <= 0xF4 &&
      i + 3 < bytes.length &&
      (bytes[i + 1] & 0xC0) === 0x80 &&
      (bytes[i + 2] & 0xC0) === 0x80 &&
      (bytes[i + 3] & 0xC0) === 0x80
    ) {
      let code = ((b & 0x07) << 18) | ((bytes[i + 1] & 0x3F) << 12) | ((bytes[i + 2] & 0x3F) << 6) | (bytes[i + 3] & 0x3F);
      code -= 0x10000;
      out += String.fromCharCode(0xD800 + (code >> 10), 0xDC00 + (code & 0x3FF));
      i += 3;
    } else {
      out += "\uFFFD";
    }
  }
  return out;
}

const B64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function base64Bytes(input) {
  const text = String(input || "").replace(/[^A-Za-z0-9+/=]/g, "");
  const out = [];
  let buffer = 0;
  let bits = 0;
  for (const char of text) {
    if (char === "=") break;
    const value = B64_CHARS.indexOf(char);
    if (value < 0) continue;
    buffer = (buffer << 6) | value;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out.push((buffer >> bits) & 0xFF);
    }
  }
  return Uint8Array.from(out);
}

function decodeFilePath(value) {
  const first = decodeUtf8(base64Bytes(value));
  let mixed = "";
  for (let i = 0; i < first.length; i++) {
    mixed += String.fromCharCode(first.charCodeAt(i) ^ FLV_KEY.charCodeAt(i % FLV_KEY.length));
  }
  return decodeUtf8(base64Bytes(mixed));
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
        throw fail("unavailable", "嗨瑶DJ站返回 HTTP " + response.status + "：" + url);
      }
      let buffer = null;
      try {
        buffer = await response.arrayBuffer();
      } catch (_) {}
      const text = buffer ? decodeUtf8(buffer) : await response.text();
      if (text.includes("upstream connect error") || text.length < 160) {
        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, 600 + attempt * 500));
          continue;
        }
        throw fail("unavailable", "嗨瑶DJ站暂时无法访问，请稍后重试");
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
  throw lastError || fail("unavailable", "嗨瑶DJ站请求失败");
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

function durationMs(value) {
  const text = String(value || "").trim();
  if (!text) return 0;
  const parts = text.split(":").map((part) => Number(part));
  if (parts.some((part) => !Number.isFinite(part))) return 0;
  if (parts.length === 3) return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
  if (parts.length === 2) return (parts[0] * 60 + parts[1]) * 1000;
  return parts[0] * 1000;
}

function artistOf(title) {
  const text = String(title || "").trim();
  const head = text.split("_")[0].trim();
  if (head && head.length <= 24 && !head.includes("[") && !head.includes("（")) return head;
  const dash = text.indexOf("-");
  if (dash > 0) {
    const left = text.slice(0, dash).trim();
    if (left && left.length <= 24 && !left.includes("[")) return left;
  }
  const dj = head.match(/(?:Dj|DJ|dj)?[^\s_]{0,18}Dj[^\s_]{1,12}/);
  return dj ? dj[0].replace(/^Dj/, "DJ") : "";
}

function categoryOf(text) {
  const value = String(text || "");
  const match = value.match(/收录([^，。]+?)栏目专辑/);
  return match ? stripTags(match[1]) : "";
}

function dateOf(block) {
  const match =
    String(block).match(/<font[^>]*>(\d{4}-\d{2}-\d{2})<\/font>/i) ||
    String(block).match(/(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : "";
}

function makeTrack({ sname, title, image, category, duration, date, pageUrl }) {
  const name = stripTags(title);
  if (!sname || !name) return null;
  const artist = artistOf(name);
  const cover = absUrl(image, BASE);
  return {
    id: sname,
    name,
    artists: artist ? [{ id: "", name: artist }] : [],
    album: { id: "", name: category || "", imageUrl: cover },
    duration: durationMs(duration),
    url: pageUrl || BASE + "/music/" + sname + ".html",
    released: date || "",
  };
}

function parseTableTracks(html, options = {}) {
  const out = [];
  const seen = new Set();
  const blocks = String(html).split(/<tr[^>]*class="[^"]*p-tr[^"]*"[^>]*>/i).slice(1);
  for (const block of blocks) {
    const link = block.match(/href=["']\/music\/([A-Za-z0-9_-]+)\.html["']/i);
    if (!link) continue;
    const sname = link[1];
    if (seen.has(sname)) continue;
    const title =
      stripTags((block.match(/<a[^>]*class="[^"]*p-box-ab[^"]*"[^>]*>([\s\S]*?)<\/a>/i) || [])[1]) ||
      stripTags((block.match(/<img[^>]*alt=["']([^"']*)["']/i) || [])[1]);
    const image = (block.match(/<img[^>]*src=["']([^"']+)["']/i) || [])[1] || "";
    const duration = (block.match(/icon-time2[^>]*><\/i>([^<]+)/i) || [])[1] || "";
    const item = makeTrack({
      sname,
      title,
      image,
      category: options.category || "",
      duration,
      date: dateOf(block),
      pageUrl: BASE + "/music/" + sname + ".html",
    });
    if (!item) continue;
    seen.add(sname);
    out.push(item);
  }
  return out;
}

function parseUpdateTracks(html) {
  const out = [];
  const seen = new Set();
  const blocks = String(html).split(/<li[^>]*class="[^"]*update-li[^"]*"[^>]*>/i).slice(1);
  for (const block of blocks) {
    const link = block.match(/href=["']\/music\/([A-Za-z0-9_-]+)\.html["']/i);
    if (!link) continue;
    const sname = link[1];
    if (seen.has(sname)) continue;
    const title = stripTags((block.match(/<a[^>]*class="[^"]*update-div-a[^"]*"[^>]*>([\s\S]*?)<\/a>/i) || [])[1]);
    const image = (block.match(/<img[^>]*src=["']([^"']+)["']/i) || [])[1] || "";
    const category = stripTags(
      (block.match(/<span[^>]*class="[^"]*bg-yellow-350[^"]*"[^>]*>([\s\S]*?)<\/span>/i) || [])[1]
    );
    const duration = (block.match(/icon-time2[^>]*><\/i>([^<]+)/i) || [])[1] || "";
    const item = makeTrack({
      sname,
      title,
      image,
      category,
      duration,
      date: dateOf(block),
      pageUrl: BASE + "/music/" + sname + ".html",
    });
    if (!item) continue;
    seen.add(sname);
    out.push(item);
  }
  return out;
}

function parseCollectionCards(html, className) {
  const out = [];
  const seen = new Set();
  const pattern = new RegExp(
    '<li[^>]*class="[^"]*' + className + '[^"]*"[^>]*>([\\s\\S]*?)</li>',
    "gi"
  );
  let match;
  while ((match = pattern.exec(String(html)))) {
    const block = match[1];
    const link = block.match(/href=["']\/zt\/([A-Za-z0-9_-]+)\.html["']/i);
    if (!link) continue;
    const slug = link[1];
    const id = "zt:" + slug;
    if (seen.has(id)) continue;
    const title =
      stripTags((block.match(/<a[^>]*class="[^"]*album-title[^"]*"[^>]*>([\s\S]*?)<\/a>/i) || [])[1]) ||
      stripTags((block.match(/<img[^>]*alt=["']([^"']*)["']/i) || [])[1]);
    if (!title) continue;
    const image = (block.match(/<img[^>]*src=["']([^"']+)["']/i) || [])[1] || "";
    seen.add(id);
    out.push({ id, name: title, imageUrl: absUrl(image, BASE), artists: [], released: "" });
  }
  return out;
}

function playlistCards(html) {
  const cards = parseCollectionCards(html, "index-dj-li");
  const byId = new Map(cards.map((item) => [item.id, item]));
  return PLAYLISTS.map((meta) => {
    const id = "zt:" + meta.slug;
    const hit = byId.get(id);
    return hit || { id, name: meta.name, imageUrl: "", artists: [], released: "" };
  });
}

function parsePlaylist(html, slug) {
  const title = stripTags((html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]) || "DJ歌单";
  const image =
    (html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i) || [])[1] ||
    (html.match(/<img[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["']/i) || [])[1] ||
    "";
  const tracks = parseTableTracks(html, { category: title });
  return {
    album: {
      id: "zt:" + slug,
      name: title,
      imageUrl: absUrl(image, BASE + "/zt/" + slug + ".html"),
      artists: [],
      released: "",
    },
    tracks,
  };
}

function parseDetail(html, sname) {
  const title =
    stripTags((html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i) || [])[1]) ||
    stripTags((html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [])[1]).replace(/在线试听.*$/, "").trim() ||
    sname;
  const image =
    (html.match(/<img[^>]*class="[^"]*info_img[^"]*"[^>]*src=["']([^"']+)["']/i) || [])[1] ||
    (html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i) || [])[1] ||
    "";
  const timeTag = (html.match(/<[^>]*class="[^"]*totalTime[^"]*"[^>]*>/i) || [])[0] || "";
  const rawDuration = (timeTag.match(/data-time=["'](\d+)["']/i) || [])[1] || "";
  const description = (html.match(/<meta[^>]*name=["']Description["'][^>]*content=["']([^"']*)["']/i) || [])[1] || "";
  const category = categoryOf(description);
  const date = (description.match(/(\d{4})年(\d{2})月(\d{2})日/) || []).slice(1).join("-");
  const filePath = (html.match(/(?:var|let|const)\s+FilePath\s*=\s*["']([^"']+)["']/) || [])[1] || "";
  const did = (html.match(/(?:var|let|const)\s+did\s*=\s*["']([^"']+)["']/) || [])[1] || "";
  return {
    sname,
    did,
    title,
    image: absUrl(image, BASE + "/music/" + sname + ".html"),
    category,
    date,
    duration: rawDuration ? Number(rawDuration) * 1000 : 0,
    filePath,
  };
}

function pageInfo(html, id, page) {
  let last = page;
  const matches = [...String(html).matchAll(new RegExp("/cl/" + id + "-0-0-(\\d+)\\.html", "g"))];
  for (const match of matches) last = Math.max(last, Number(match[1]));
  return { page, last, hasPrev: page > 1, hasNext: page < last };
}

function categoryLinks() {
  return CATEGORIES.map((item) => ({ title: item.name, page: "list:" + item.id + ":1" }));
}

async function searchCatalog() {
  if (catalogCache && Date.now() - catalogAt < PAGE_TTL) return catalogCache;
  const jobs = [];
  for (let page = 1; page <= 3; page++) jobs.push({ id: "1", page });
  for (const id of ["2", "3"]) {
    for (let page = 1; page <= 2; page++) jobs.push({ id, page });
  }
  for (const id of ["5", "6", "7", "8", "9", "10", "11", "12"]) jobs.push({ id, page: 1 });

  const batches = [];
  for (let i = 0; i < jobs.length; i += 5) batches.push(jobs.slice(i, i + 5));
  const lists = [];
  for (const batch of batches) {
    const results = await Promise.all(
      batch.map(async (job) => {
        try {
          const html = await pageHtml("/cl/" + job.id + "-0-0-" + job.page + ".html");
          return parseTableTracks(html, { category: CATEGORY_MAP.get(job.id)?.name || "" });
        } catch (_) {
          return [];
        }
      })
    );
    lists.push(...results);
  }

  const playlistLists = [];
  for (let i = 0; i < PLAYLISTS.length; i += 5) {
    const batch = PLAYLISTS.slice(i, i + 5);
    const results = await Promise.all(
      batch.map(async (meta) => {
        try {
          const html = await pageHtml("/zt/" + meta.slug + ".html");
          return parsePlaylist(html, meta.slug).tracks;
        } catch (_) {
          return [];
        }
      })
    );
    playlistLists.push(...results);
  }

  let latest = [];
  try {
    latest = parseUpdateTracks(await pageHtml("/"));
  } catch (_) {}

  const seen = new Set();
  const all = [];
  for (const track of lists.flat().concat(playlistLists.flat()).concat(latest)) {
    if (seen.has(track.id)) continue;
    seen.add(track.id);
    all.push(track);
  }
  catalogCache = all;
  catalogAt = Date.now();
  return all;
}

function trackAsAlbum(track) {
  return {
    id: track.id,
    name: track.name,
    imageUrl: track.album?.imageUrl || "",
    artists: track.artists || [],
    released: track.released || "",
  };
}
async function home() {
  const html = await pageHtml("/");
  const latest = parseUpdateTracks(html).slice(0, 20);
  const allAlbums = playlistCards(html);

  return {
    title: "嗨瑶DJ站",
    subtitle: "酒吧舞曲 · 中文/外文 Remix · 车载串烧",
    description:
      "嗨瑶DJ站（原海妖DJ）在线舞曲目录。单曲直接播放，DJ歌单按整张合集展开；部分合集超过 100 首时以站点实际列表为准。",
    sections: [
      { title: "最新上传", tracks: latest, empty: "最新上传暂时为空" },
      { title: "热门DJ歌单", albums: allAlbums, empty: "歌单暂时为空" },
      { title: "分类浏览", links: categoryLinks() },
      {
        title: "歌单与分类",
        links: [{ title: "全部DJ歌单", subtitle: "10 张 · 每张 50 首", page: "playlists" }].concat(
          categoryLinks()
        ),
      },
    ],
  };
}
async function browse({ page } = {}) {
  const raw = String(page || "latest");
  if (raw === "latest") {
    const latest = parseUpdateTracks(await pageHtml("/")).slice(0, 20);
    return {
      title: "最新上传",
      subtitle: latest.length + " 首",
      sections: [{ title: "最新上传", tracks: latest, empty: "最新上传暂时为空" }],
    };
  }

  if (raw === "playlists") {
    const html = await pageHtml("/");
    const albums = playlistCards(html);
    return {
      title: "DJ歌单",
      subtitle: albums.length + " 张歌单 · 每张 50 首",
      sections: [{ title: "全部DJ歌单", albums, empty: "没有解析到歌单" }],
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
    const html = await pageHtml("/cl/" + id + "-0-0-" + p + ".html");
    const tracks = parseTableTracks(html, { category: meta.name });
    if (!tracks.length) throw fail("unavailable", meta.name + " 第 " + p + " 页没有解析到曲目");
    const info = pageInfo(html, id, p);
    const links = [];
    if (info.hasPrev) links.push({ title: "上一页", page: "list:" + id + ":" + (p - 1) });
    if (info.hasNext) links.push({ title: "下一页", page: "list:" + id + ":" + (p + 1) });
    links.push({ title: "返回全部分类", page: "categories" });
    return {
      title: meta.name + (p > 1 ? " · 第 " + p + " 页" : ""),
      subtitle: tracks.length + " 首 · 共 " + info.last + " 页",
      sections: [{ title: meta.name, tracks }, { title: "翻页", links }],
    };
  }

  throw fail("unavailable", "未知页面：" + raw);
}
async function album({ id } = {}) {
  const albumId = String(id || "");
  if (albumId.startsWith("zt:")) {
    const slug = albumId.slice(3);
    if (!/^[A-Za-z0-9_-]+$/.test(slug)) throw fail("unavailable", "歌单编号不正确：" + albumId);
    const html = await pageHtml("/zt/" + slug + ".html");
    const parsed = parsePlaylist(html, slug);
    if (!parsed.tracks.length) throw fail("unavailable", "这个歌单没有解析到曲目");
    return parsed;
  }

  if (!/^[A-Za-z0-9_-]+$/.test(albumId)) throw fail("unavailable", "单曲编号不正确：" + albumId);
  const html = await pageHtml("/music/" + albumId + ".html");
  const detail = parseDetail(html, albumId);
  if (!detail.title) throw fail("unavailable", "没有找到这首舞曲：" + albumId);
  const albumMeta = {
    id: albumId,
    name: detail.title,
    imageUrl: detail.image || "",
    artists: artistOf(detail.title) ? [{ id: "", name: artistOf(detail.title) }] : [],
    released: detail.date || "",
  };
  return {
    album: albumMeta,
    tracks: [
      {
        id: albumId,
        name: detail.title,
        artists: albumMeta.artists,
        album: albumMeta,
        duration: detail.duration || 0,
        url: BASE + "/music/" + albumId + ".html",
      },
    ],
  };
}
async function search({ query, kind, offset = 0 } = {}) {
  const term = String(query || "").trim();
  if (!term) {
    const latest = parseUpdateTracks(await pageHtml("/")).slice(0, 20);
    return {
      tracks: latest,
      albums: latest.map(trackAsAlbum),
      artists: [],
      playlists: [],
      shows: [],
      more: false,
    };
  }
  if (offset > 0) return { tracks: [], albums: [], artists: [], playlists: [], shows: [], more: false };

  let tracks = [];
  try {
    const html = await pageHtml("/search/so?key=" + encodeURIComponent(term));
    tracks = parseTableTracks(html);
  } catch (_) {}
  if (!tracks.length) {
    const catalog = await searchCatalog();
    const needle = term.toLowerCase();
    tracks = catalog.filter((track) => track.name.toLowerCase().includes(needle));
  }
  tracks = tracks.slice(0, 60);
  const albums = tracks.map(trackAsAlbum);

  if (kind === "albums") return { albums, more: false };
  if (kind === "tracks") return { tracks, more: false };
  return { tracks, albums, artists: [], playlists: [], shows: [], more: false };
}
async function suggest({ query } = {}) {
  const term = String(query || "").trim().toLowerCase();
  if (!term) return [];
  try {
    const latest = parseUpdateTracks(await pageHtml("/"));
    const hits = latest.filter((track) => track.name.toLowerCase().includes(term));
    if (hits.length) return hits.slice(0, 10).map((track) => track.name);
    const catalog = await searchCatalog();
    return catalog
      .filter((track) => track.name.toLowerCase().includes(term))
      .slice(0, 10)
      .map((track) => track.name);
  } catch (_) {
    return [];
  }
}
async function stream({ id } = {}) {
  const sname = String(id || "");
  if (!/^[A-Za-z0-9_-]+$/.test(sname)) throw fail("unavailable", "单曲编号不正确：" + sname);
  const html = await pageHtml("/music/" + sname + ".html");
  const detail = parseDetail(html, sname);
  if (!detail.filePath) throw fail("unavailable", "这首舞曲暂时没有可用的播放地址");

  let raw;
  try {
    raw = decodeFilePath(detail.filePath);
  } catch (_) {
    throw fail("unavailable", "播放地址解码失败，站点可能改了加密方式");
  }
  raw = String(raw || "").trim().replace(/&amp;/g, "&");
  if (!raw) throw fail("unavailable", "播放地址为空");
  if (raw.startsWith("//")) raw = "https:" + raw;
  raw = raw.replace(/^(https?:\/\/[^/]+)\/{2,}/i, "$1/");

  let url;
  try {
    url = new URL(raw, BASE).toString();
  } catch (_) {
    throw fail("unavailable", "播放地址格式不正确");
  }

  const path = url.split("?")[0].toLowerCase();
  let type = "mp3";
  if (path.endsWith(".m4a")) type = "m4a";
  else if (path.endsWith(".flac")) type = "flac";
  else if (path.endsWith(".aac")) type = "aac";
  else if (path.endsWith(".ogg")) type = "ogg";
  else if (path.endsWith(".mp4")) type = "mp4";

  return {
    url,
    type,
    headers: {
      referer: BASE + "/music/" + sname + ".html",
      "user-agent": UA,
    },
  };
}
return { home, browse, album, search, suggest, stream };
})(__mfRuntime.host, __mfRuntime.fetch, __mfRuntime.TextDecoder, __mfRuntime.atob, __mfRuntime.btoa, __mfRuntime.URL, __mfRuntime.URLSearchParams);
module.exports = __mfRuntime.makePlugin(__mfPlugin, {"id": "haiyaodj", "name": "嗨瑶DJ", "version": "1.1.0", "site": "嗨瑶DJ", "searchTypes": ["music", "album"]});
