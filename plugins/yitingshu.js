// 显示名：易听书网（yitingshu）
// MusicFree plugin generated from MyGo Music plugin; source site: www.yitingshu.com
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
const SITE = {"id": "yitingshu", "name": "易听书网", "base": "https://www.yitingshu.com", "homePath": "/", "categories": [{"name": "言情", "path": "/yi/1.html"}, {"name": "武侠", "path": "/yi/2.html"}, {"name": "悬疑", "path": "/yi/3.html"}, {"name": "历史", "path": "/yi/4.html"}, {"name": "军事", "path": "/yi/5.html"}, {"name": "评书", "path": "/yi/6.html"}, {"name": "相声小品", "path": "/yi/7.html"}, {"name": "商业财经", "path": "/yi/9.html"}], "search": {"method": "GET", "path": "/search.php", "field": "searchword"}};

const BASE = SITE.base;
const NAME = SITE.name;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const REFERER = BASE + "/";
const cache = new Map();
const known = new Map();
const TTL = 3 * 60 * 1000;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
function fail(code, message) { const e = new Error(message || code); e.code = code; return e; }
function clean(s) {
  return String(s || "").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, " ").trim();
}
function abs(u) {
  if (!u) return "";
  u = String(u).trim();
  if (/^https?:/i.test(u)) return u;
  if (u.startsWith("//")) return "https:" + u;
  return BASE + (u.startsWith("/") ? u : "/" + u);
}
function remember(list) { for (const a of list || []) if (a && a.id) known.set(a.id, a); }

async function fetchText(path, opts) {
  const rel = /^https?:/i.test(path) ? path.replace(/^https?:\/\/[^/]+/i, "") : path;
  const key = rel + "|" + ((opts && opts.method) || "GET") + "|" + ((opts && opts.body) || "");
  const hit = cache.get(key);
  if (hit && Date.now() - hit.t < TTL) return hit.v;
  let last = null;
  for (let i = 0; i < 5; i++) {
    try {
      const res = await fetch(BASE + rel, {
        method: (opts && opts.method) || "GET",
        headers: { "user-agent": UA, referer: REFERER, ...((opts && opts.headers) || {}) },
        body: opts && opts.body,
      });
      if (!res.ok) throw fail("upstream", `HTTP ${res.status}`);
      const text = await res.text();
      if (!text || text.length < 100) throw fail("upstream", "empty body");
      if (/系统安全验证|Just a moment/i.test(text)) throw fail("unavailable", "源站要求安全验证");
      cache.set(key, { t: Date.now(), v: text });
      return text;
    } catch (e) { last = e; await wait(500 + i * 700); }
  }
  throw last || fail("unavailable", `${NAME}暂时无法访问`);
}

const CAT_FALLBACK = SITE.categories || [];
function catLinks() {
  return CAT_FALLBACK.map((c) => ({ title: c.name, page: `cat:${encodeURIComponent(c.name + "|" + c.path)}:1` }));
}
function parseCats(html) {
  if (CAT_FALLBACK.length) return CAT_FALLBACK;
  const out = []; const seen = new Set();
  const add = (path, name) => {
    name = clean(name);
    if (!name || name.length > 12 || seen.has(path)) return;
    if (/首页|排行|全部|更多|登录|注册|收藏|地图|RSS|留言|搜索|最新|下载|手机版/.test(name)) return;
    seen.add(path); out.push({ name, path });
  };
  let m; let re;
  re = /<a[^>]+href="\/(fenlei|yi)\/(\d+)\.html"[^>]*>([^<]{1,12})<\/a>/gi;
  while ((m = re.exec(html))) add(`/${m[1]}/${m[2]}.html`, m[3]);
  if (!out.length) {
    re = /<a[^>]+href="\/book\/([a-z0-9_]+)\/lastupdate\.html"[^>]*>([^<]{1,12})<\/a>/gi;
    while ((m = re.exec(html))) add(`/book/${m[1]}/lastupdate.html`, m[2]);
  }
  if (!out.length) {
    re = /<a[^>]+href="\/([a-z][a-z0-9_]*)\/"[^>]*>([^<]{2,12})<\/a>/gi;
    while ((m = re.exec(html))) {
      if (/^(book|mp3|tingshu|play|yun|search|top|user|over|tingdan|boyin|fenlei|yi|public|template|uploads|xml|news|tag|special|list|html|gbook)$/i.test(m[1])) continue;
      add(`/${m[1]}/`, m[2]);
    }
  }
  return out.slice(0, 30);
}

function idFromHref(href) {
  let m = String(href || "").match(/^\/(book|mp3|tingshu)\/(\d+)\.html/i);
  if (m) return `album:${m[1].toLowerCase()}:${m[2]}`;
  m = String(href || "").match(/^\/([a-z0-9_]+)\/(\d+)\.html/i);
  if (m && !/^(fenlei|yi|list|book|mp3|tingshu|play|yun|search|top|user|over|tingdan|boyin|public|template|uploads|xml|news|tag|special|html)$/i.test(m[1])) return `album:cat:${m[1]}:${m[2]}`;
  return "";
}
function hrefFromId(id) {
  const m = String(id || "").match(/^album:(book|mp3|tingshu):(\d+)$/);
  if (m) return `/${m[1]}/${m[2]}.html`;
  const c = String(id || "").match(/^album:cat:([a-z0-9_]+):(\d+)$/i);
  if (c) return `/${c[1]}/${c[2]}.html`;
  return "";
}
function bidFromId(id) {
  const m = String(id || "").match(/(?:album:(?:book|mp3|tingshu|cat):(?:[a-z0-9_]+:)?)(\d+)/i);
  return m ? m[1] : "";
}
function makeCard(id, name, image) { return { id, name: clean(name) || "未命名专辑", imageUrl: abs(image), artists: [] }; }

function parseCards(html) {
  const out = []; const seen = new Set();
  const re = /<a\b([^>]*)>/gi;
  let m;
  while ((m = re.exec(html))) {
    const attrs = m[1];
    const href = (attrs.match(/href="([^"]+)"/i) || [])[1] || "";
    const id = idFromHref(href);
    if (!id || seen.has(id)) continue;
    const tail = html.slice(m.index, m.index + 750);
    const title = (attrs.match(/title="([^"]+)"/i) || [])[1] || "";
    const alt = (tail.match(/<img[^>]+alt="([^"]*)"/i) || [])[1] || "";
    const inner = clean((tail.slice(tail.indexOf(">") + 1).split("</a>")[0] || ""));
    const name = clean(title || alt || inner).replace(/\s*更至\s*\d+\s*集$/, "");
    if (!name) continue;
    const img = ((tail.match(/<img[^>]+(?:data-original|data-src|src)="([^"]+)"/i) || [])[1] || (tail.match(/<a[^>]+(?:data-original|data-src)="([^"]+)"/i) || [])[1] || "");
    seen.add(id); out.push(makeCard(id, name, img));
  }
  return out;
}
async function home() {
  const html = await fetchText(SITE.homePath || "/");
  const list = parseCards(html).slice(0, 30);
  const cats = parseCats(html).slice(0, 30);
  if (!list.length) throw fail("unavailable", "首页没有解析到内容，源站可能改版");
  remember(list);
  const sections = [{ title: "最新推荐", albums: list }];
  if (cats.length) sections.push({ title: "分类", links: cats.map((c) => ({ title: c.name, page: `cat:${encodeURIComponent(c.name + "|" + (c.path || ""))}:1` })) });
  return { title: NAME, subtitle: "有声小说 · 评书", sections };
}

function parseCatPage(raw) {
  const m = String(raw || "").match(/^cat:([^:]+):(\d+)$/);
  if (!m) return null;
  const key = decodeURIComponent(m[1]);
  const [name, path] = key.split("|");
  return { name, path, page: Number(m[2]) || 1 };
}
async function browse({ page } = {}) {
  if (!page || page === "categories") {
    return { title: "分类", sections: [{ title: "全部分类", links: catLinks() }] };
  }
  const cat = parseCatPage(page);
  if (!cat) throw fail("unavailable", "没有这个页面");
  let path = cat.path;
  if (cat.page > 1) path = path.replace(/(\.html|\/)$/, `-${cat.page}$1`).replace(/-1\.html$/, ".html");
  const html = await fetchText(path);
  const list = parseCards(html);
  remember(list);
  return { title: cat.name, subtitle: `第 ${cat.page} 页`, sections: [{ title: `${cat.name} · 第 ${cat.page} 页`, albums: list }] };
}
async function search({ query, kind = "albums", offset = 0 } = {}) {
  const term = String(query || "").trim();
  if (!term) return { tracks: [], albums: [], more: false };
  if (kind && kind !== "albums" && kind !== "album") return { tracks: [], albums: [], more: false };
  const local = [...known.values()].filter((a) => a.name.toLowerCase().includes(term.toLowerCase())).slice(0, 30);
  if (local.length) return { albums: local, more: false };
  let found = [];
  try {
    const s = SITE.search;
    if (s && s.method === "POST") {
      const body = new URLSearchParams(); body.set(s.field || "searchword", term);
      const html = await fetchText(s.path, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: body.toString() });
      found = parseCards(html);
    } else {
      const field = (s && s.field) || "searchword";
      const html = await fetchText(`${(s && s.path) || "/search.php"}?${field}=${encodeURIComponent(term)}`);
      found = parseCards(html);
    }
  } catch (e) {}
  if (found.length) { remember(found); return { albums: found.slice(0, 30), more: false }; }
  const cats = CAT_FALLBACK.length ? CAT_FALLBACK : [];
  const all = []; const seen = new Set();
  if (cats.length) {
    const parts = await Promise.all(cats.slice(0, 10).map((c) => fetchText(c.path).then(parseCards).catch(() => [])));
    for (const p of parts) for (const a of p) { if (!seen.has(a.id)) { seen.add(a.id); all.push(a); } }
    const hits = all.filter((a) => a.name.toLowerCase().includes(term.toLowerCase()));
    return { albums: hits.slice(0, 30), more: false };
  }
  return { albums: [], more: false };
}
async function suggest({ query } = {}) { const r = await search({ query }); return r.albums || []; }

const TRACK_RES = [
  /href=['"](\/play\/[0-9]+-0-[0-9]+\.html)['"][^>]*>([\s\S]*?)<\/a>/gi,
  /href=['"](\/[a-z0-9_]+\/[0-9]+\/0-[0-9]+\.html)['"][^>]*>([\s\S]*?)<\/a>/gi,
  /href=['"](\/tingshu\/[0-9]+\/[0-9]+\.html)['"][^>]*>([\s\S]*?)<\/a>/gi,
  /href=['"](\/book\/[0-9]+\/[0-9]+\.html)['"][^>]*>([\s\S]*?)<\/a>/gi,
  /href=['"](\/yun\/[0-9]+-0-[0-9]+\.html)['"][^>]*>([\s\S]*?)<\/a>/gi,
];
function parseTracks(html, bid, name, cover, speaker) {
  const tracks = []; const seen = new Set();
  for (const re of TRACK_RES) {
    re.lastIndex = 0; let m;
    while ((m = re.exec(html))) {
      const link = m[1];
      if (seen.has(link)) continue;
      if (bid && !link.includes(`/${bid}/`) && !link.includes(`-${bid}-`) && !new RegExp(`/${bid}-`).test(link) && !new RegExp(`/${bid}/`).test(link)) continue;
      seen.add(link);
      const tag = m[0].slice(0, m[0].indexOf(">") + 1);
      const title = (tag.match(/title=["']([^"']*)["']/) || [])[1] || "";
      let nm = clean(title) || clean(m[2]) || `第 ${tracks.length + 1} 集`;
      nm = nm.replace(/^.*?章节[_-]/, "").replace(/在线收听$/, "").trim();
      if (nm === "开始收听") nm = `第 ${tracks.length + 1} 集`;
      else if (/^(立即播放|播放|下载|查看全部章节)$/.test(nm)) continue;
      tracks.push({ id: link, name: nm, artists: speaker ? [{ id: "", name: speaker }] : [], album: { id: `album:${bid}`, name, imageUrl: cover }, duration: 0 });
    }
  }
  return tracks;
}
async function album({ id } = {}) {
  const path = hrefFromId(id);
  if (!path) throw fail("unavailable", "没有这个专辑");
  const html = await fetchText(path);
  let name = clean((html.match(/<h1[^>]*>([^<]*)/i) || [])[1]);
  if (!name) name = clean((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]).split(/[-_|]/)[0];
  name = name.replace(/有声小说|全集/g, "").trim();
  const parsedCover = abs((html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i) || html.match(/<img[^>]+(?:class="(?:imgd|lazyload|imga|bookimg)"|data-original|data-src)[^>]+(?:src|data-original|data-src)="([^"]+)"/i) || html.match(/<img[^>]+src="([^"]+)"/i) || [])[1] || "");
  const cover = (known.get(id) && known.get(id).imageUrl) || parsedCover;
  const speaker = clean((html.match(/(?:播音|演播|主播)[：:]\s*(?:<[^>]+>)*\s*([^<<\s]{1,20})/i) || [])[1] || "");
  const desc = clean((html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i) || [])[1] || "");
  const bid = bidFromId(id);
  let tracks = parseTracks(html, bid, name, cover, speaker);
  const dir = (html.match(/href="(\/bookdir\/[^"]+\.html)"/i) || [])[1];
  if (tracks.length < 30 && dir) {
    try {
      const more = await fetchText(dir);
      const t2 = parseTracks(more, bid, name, cover, speaker);
      const seen = new Set(tracks.map((t) => t.id));
      for (const t of t2) if (!seen.has(t.id)) { seen.add(t.id); tracks.push(t); }
    } catch (e) {}
  }
  if (!tracks.length) throw fail("unavailable", "这个专辑没有可播放章节");
  known.set(id, { id, name, imageUrl: cover, artists: speaker ? [{ id: "", name: speaker }] : [] });
  return { album: { id, name, imageUrl: cover, artists: speaker ? [{ id: "", name: speaker }] : [], description: desc }, tracks };
}

function decodeNow(s) { return String(s || "").split("*").filter(Boolean).map((n) => String.fromCharCode(Number(n))).join(""); }
function audioType(u) { if (/\.mp3(?:$|\?)/i.test(u)) return "mp3"; if (/\.m4a(?:$|\?)/i.test(u)) return "m4a"; if (/\.aac(?:$|\?)/i.test(u)) return "aac"; return "mp3"; }
function looksAudio(u) {
  if (!u) return false;
  if (!/^\.|^https?:|^\/|^\/\//i.test(String(u))) return false;
  if (/\.(?:m4a|mp3|aac|ogg|wav)(?:[?#]|$)/i.test(u)) return true;
  return false;
}
function extractAudio(html) {
  let m;
  m = html.match(/var\s+now\s*=\s*FonHen_JieMa\(["']([^"']*)["']\)/i); if (m) return decodeNow(m[1]);
  for (const re of [
    /var\s+(?:now|url|mp3|audio|playurl)\s*=\s*["']([^"']+)["']/i,
    /["'](?:url|audio|mp3|playurl)["']\s*:\s*["']([^"']+)["']/i,
    /<audio[^>]+src=["']([^"']+)["']/i,
    /<source[^>]+src=["']([^"']+)["']/i,
  ]) { m = html.match(re); if (m && looksAudio(m[1])) return m[1]; }
  m = html.match(/https?:\/\/[^"'\s<>]+\.(?:m4a|mp3|aac|ogg|wav)(?:\?[^"'\s<>]*)?/i); if (m) return m[0];
  return "";
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
function fileFor(slot) { return `${String(host.dataDir).replace(/[\\/]+$/, "")}${isWindows() ? "\\" : "/"}${SITE.id}-${slot}.m4a`; }
function fileURL(path) { let p = String(path).replace(/\\/g, "/"); if (!p.startsWith("/")) p = "/" + p; return "file://" + p.split("/").map((x) => encodeURIComponent(x).replace(/%3A/gi, ":")).join("/"); }
function transcodeOn() { const v = host.setting("transcode"); return v == null || v === "" ? true : String(v) !== "0"; }
async function transcode(url, path, referer) {
  let last = "";
  for (const bin of [...(host.setting("ffmpegPath") ? [host.setting("ffmpegPath")] : []), "ffmpeg", ...(FFMPEG[host.platform] || [])]) {
    try {
      const p = host.spawn(bin, ["-y", "-hide_banner", "-loglevel", "error", "-headers", `Referer: ${referer}\r\n`, "-user_agent", UA, "-i", url, "-vn", "-c:a", "aac", "-b:a", "64k", "-movflags", "+faststart", path]);
      const code = await p.wait(); const err = await p.errorOutput();
      if ((code == null || code === 0) && !err) return;
      last = `${bin}: ${String(err).slice(0, 160) || code}`;
    } catch (e) { last = `${bin}: ${e && e.message ? e.message : e}`; }
  }
  throw new Error(last || "ffmpeg not found");
}
async function stream({ id } = {}) {
  let target = String(id || "");
  if (!/^\//.test(target)) {
    const a = await album({ id: target });
    if (!a.tracks.length) throw fail("unavailable", "这个专辑没有章节");
    target = a.tracks[0].id;
  }
  let page = await fetchText(target);
  let u = extractAudio(page);
  if (!u) {
    const iframe = (page.match(/<iframe[^>]+src="([^"]+)"/i) || [])[1];
    if (iframe) {
      const p2 = await fetchText(abs(iframe));
      u = extractAudio(p2);
    }
  }
  if (!u) throw fail("unavailable", "源站没有返回音频地址，该站可能已关闭在线播放");
  u = abs(u);
  const type = audioType(u);
  const headers = { referer: abs(target), "user-agent": UA };
  if (type === "mp3" || type === "aac") return { url: u, type, headers, title: "" };
  if (!transcodeOn()) return { url: u, type, headers, title: "" };
  const all = slots(); let slot = all.indexOf(target);
  if (slot < 0) { slot = all.findIndex((x) => !x); if (slot < 0) slot = slotOf(target); }
  try {
    const path = fileFor(slot);
    await transcode(u, path, abs(target));
    all[slot] = target; saveSlots(all);
    return { url: fileURL(path), type: "m4a", title: "" };
  } catch (e) { throw fail("setup", `本段需要 ffmpeg 转码：${e && e.message ? e.message : e}`); }
}
function lyrics() { return {}; }
function stored(k, d) { try { const v = host.storage.get(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
function like({ id, on } = {}) { const s = new Set(stored("liked", [])); if (on) s.add(String(id)); else s.delete(String(id)); host.storage.set("liked", JSON.stringify([...s])); return { id: String(id), liked: !!on }; }
function isLiked({ ids } = {}) { const s = new Set(stored("liked", [])); const o = {}; for (const id of ids || []) o[id] = s.has(String(id)); return o; }
function liked({ offset = 0 } = {}) { const all = stored("liked", []).map((id) => known.get(id)).filter(Boolean); return { tracks: all.slice(offset, offset + 60), more: all.length > offset + 60 }; }
function played({ id } = {}) { if (!id) return {}; const list = stored("history", []).filter((x) => x !== id); list.push(String(id)); host.storage.set("history", JSON.stringify(list.slice(-100))); return {}; }
function recent() { return stored("history", []).slice().reverse().map((id) => known.get(id)).filter(Boolean).slice(0, 20); }
return { home, browse, search, suggest, album, stream, lyrics, like, isLiked, liked, played, recent };
})(__mfRuntime.host, __mfRuntime.fetch, __mfRuntime.TextDecoder, __mfRuntime.atob, __mfRuntime.btoa, __mfRuntime.URL, __mfRuntime.URLSearchParams);
module.exports = __mfRuntime.makePlugin(__mfPlugin, {"id": "yitingshu", "name": "易听书网", "version": "0.1.0", "site": "www.yitingshu.com", "searchTypes": ["music", "album"]});
