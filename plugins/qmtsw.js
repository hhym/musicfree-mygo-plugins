// 显示名：我听评书网（qmtsw）
// MusicFree plugin generated from MyGo Music plugin; source site: www.qmtsw.com
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
const BASE = "https://www.qmtsw.com";
const NAME = "我听评书网";
const DETAIL = "show";
const LIST = "book";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const REFERER = BASE + "/";
const cache = new Map();
const TTL = 3 * 60 * 1000;
const known = new Map();
const waiting = (ms) => new Promise((r) => setTimeout(r, ms));

function fail(code, message) { const e = new Error(message || code); e.code = code; return e; }
function clean(s) {
  return String(s || "").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, " ").trim();
}
function abs(u) { if (!u) return ""; if (/^https?:/i.test(u)) return u; if (u.startsWith("//")) return "https:" + u; return BASE + (u.startsWith("/") ? u : "/" + u); }
function idOf(v) { const m = String(v || "").match(/(?:mp3|show|book|info|ting|yun)\/?(\d+)|album:(\d+)|\b(\d+)\b/); return m ? (m[1] || m[2] || m[3]) : ""; }
function card(id, name, image) { return { id: `album:${id}`, name: clean(name) || "未命名专辑", imageUrl: abs(image), artists: [] }; }
function remember(list) { for (const t of list || []) { const a = t.album || t; if (a && a.id) known.set(a.id, a); } }

async function fetchText(path, opts) {
  const rel = /^https?:/i.test(path) ? path.replace(/^https?:\/\/[^/]+/i, "") : path;
  const ck = rel + "|" + ((opts && opts.method) || "GET");
  const hit = cache.get(ck);
  if (hit && Date.now() - hit.t < TTL) return hit.v;
  let last = null;
  for (let i = 0; i < 4; i++) {
    try {
      const res = await fetch(BASE + rel, {
        method: (opts && opts.method) || "GET",
        headers: { "user-agent": UA, referer: REFERER, ...(opts && opts.headers || {}) },
        body: opts && opts.body,
      });
      if (!res.ok) throw fail("upstream", `HTTP ${res.status}`);
      const text = await res.text();
      if (!text || text.length < 120) throw fail("upstream", "empty body");
      if (text.includes("系统安全验证")) throw fail("unavailable", "站点要求安全验证");
      cache.set(ck, { t: Date.now(), v: text });
      return text;
    } catch (e) { last = e; await waiting(240 + i * 420); }
  }
  throw last || fail("unavailable", `${NAME}暂时无法访问`);
}

function parseCards(html) {
  const out = []; const seen = new Set();
  const re = /<a\b([^>]*)>/gi;
  let m;
  while ((m = re.exec(html))) {
    const attrs = m[1];
    const href = (attrs.match(/href="([^"]+)"/i) || [])[1] || "";
    const idm = href.match(/(?:mp3|show|info|ting)\/([0-9]+)\./i);
    if (!idm) continue;
    const id = idm[1];
    if (seen.has(id)) continue;
    const tail = html.slice(m.index, m.index + 700);
    const title = (attrs.match(/title="([^"]+)"/i) || [])[1] || "";
    const alt = (tail.match(/<img[^>]+alt="([^"]*)"/i) || [])[1] || "";
    const inner = clean((tail.slice(tail.indexOf(">") + 1).split("</a>")[0] || ""));
    const name = clean(title || alt || inner);
    if (!name) continue;
    const img = (tail.match(/<img[^>]+src="([^"]+)"/i) || [])[1] || "";
    seen.add(id); out.push(card(id, name, img));
  }
  return out;
}
let catCache = null;
function parseCats(html) {
  const out = []; const seen = new Set();
  const re = /<a[^>]+href="(?:https?:\/\/[^/]+)?\/(?:html|list|book|category|type)\/([0-9]+)\.html"[^>]*>([^<]{1,18})<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    const id = m[1]; if (seen.has(id)) continue;
    const name = clean(m[2]);
    if (!name) continue;
    seen.add(id); out.push({ id, name });
  }
  return out;
}
async function categories() {
  if (catCache) return catCache;
  const html = await fetchText("/");
  catCache = parseCats(html).slice(0, 40);
  return catCache;
}
async function home() {
  const html = await fetchText("/");
  let list = parseCards(html).slice(0, 30);
  const cats = parseCats(html).slice(0, 40);
  if (!list.length && cats.length) {
    const parts = await Promise.all(cats.slice(0, 4).map((c) => fetchText(`/${LIST}/${c.id}.html`).then(parseCards).catch(() => [])));
    const seen = new Set();
    list = [];
    for (const p of parts) for (const a of p) { if (seen.has(a.id)) continue; seen.add(a.id); list.push(a); }
  }
  if (!list.length) throw fail("unavailable", "首页没有解析到内容，源站可能改版或暂时不可用");
  remember(list);
  const sections = [{ title: "最新推荐", albums: list, pageTitle: NAME }];
  if (cats.length) sections.push({ title: "分类", links: cats.map((c) => ({ title: c.name, page: `cat:${c.id}:1` })) });
  return { title: NAME, subtitle: "有声小说 · 评书", sections };
}
async function browse({ page } = {}) {
  const raw = String(page || "categories");
  if (raw === "categories") {
    const cats = await categories();
    return { title: "分类", sections: [{ title: "全部分类", links: cats.map((c) => ({ title: c.name, page: `cat:${c.id}:1` })) }] };
  }
  if (raw === "home:2") return { title: "最新推荐", sections: [{ title: "最新推荐", albums: parseCards(await fetchText("/")) }] };
  const m = raw.match(/^cat:([0-9]+):(\d+)$/);
  if (!m) throw fail("unavailable", "没有这个页面");
  const id = m[1]; const pageNo = Math.max(1, Number(m[2]) || 1);
  const cats = await categories();
  const info = cats.find((c) => c.id === id);
  if (!info) throw fail("unavailable", "没有这个分类");
  const path = pageNo === 1 ? `/${LIST}/${id}.html` : `/${LIST}/${id}-${pageNo}.html`;
  const html = await fetchText(path);
  const list = parseCards(html);
  remember(list);
  let max = pageNo;
  const re = new RegExp(`/${LIST}/${id}-(\\d+)\\.html`, "g");
  for (const mm of html.matchAll(re)) max = Math.max(max, Number(mm[1]) || 1);
  return {
    title: info.name,
    subtitle: `第 ${pageNo} 页`,
    sections: [
      { title: `${info.name} · 第 ${pageNo} 页`, albums: list, morePage: pageNo < max ? `cat:${id}:${pageNo + 1}` : "" },
      { title: "分类", links: cats.map((c) => ({ title: c.name, page: `cat:${c.id}:1` })) },
    ],
  };
}
async function search({ query, kind = "albums", offset = 0 } = {}) {
  const term = String(query || "").trim();
  if (!term) return { tracks: [], albums: [], more: false };
  if (kind && kind !== "albums" && kind !== "album") return { tracks: [], albums: [], more: false };
  const hits = [...known.values()].filter((a) => a.name.toLowerCase().includes(term.toLowerCase()));
  if (hits.length) return { albums: hits.slice(0, 30), more: false };
  let cats = [];
  try { cats = await categories(); } catch (e) {}
  const lists = await Promise.all(cats.map((c) => fetchText(`/${LIST}/${c.id}.html`).then(parseCards).catch(() => [])));
  const all = []; const seen = new Set();
  for (const l of lists) for (const a of l) {
    if (seen.has(a.id)) continue;
    if (!a.name.toLowerCase().includes(term.toLowerCase())) continue;
    seen.add(a.id); all.push(a); known.set(a.id, a);
  }
  return { albums: all.slice(0, 60), more: false };
}
async function suggest({ query } = {}) {
  const term = String(query || "").trim();
  if (!term) return [];
  return [...known.values()].filter((a) => a.name.toLowerCase().includes(term.toLowerCase())).slice(0, 8).map((a) => a.name);
}

async function albumHtml(bid) {
  const paths = [`/${DETAIL}/${bid}.html`, `/book/${bid}.html`, `/info/${bid}.html`, `/ting/${bid}.html`].filter((p, i, a) => a.indexOf(p) === i);
  for (const p of paths) {
    try {
      const html = await fetchText(p);
      if (html.includes(`/play/${bid}-`)) return { html, path: p };
    } catch (e) {}
  }
  throw fail("unavailable", "这个专辑暂时取不到内容");
}
async function album({ id } = {}) {
  const bid = idOf(id);
  if (!bid) throw fail("unavailable", "没有这个专辑");
  const got = await albumHtml(bid);
  const html = got.html;
  let name = clean((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]);
  if (!name) name = clean((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]).split(/[-_|]/)[0];
  const cover = abs((html.match(/<div class="(?:img-100|pic)[^>]*>[\s\S]{0,300}?<img[^>]+src="([^"]+)"/i) || html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i) || [])[1] || "");
  const author = clean((html.match(/作者[：:]\s*<a[^>]*>([\s\S]*?)<\/a>/i) || [])[1] || "");
  const speaker = clean((html.match(/由\s*<a[^>]*>([\s\S]*?)<\/a>[\s\S]{0,20}?播音/i) || [])[1] || "");
  const desc = clean((html.match(/(?:内容介绍|简介)[：:]\s*([\s\S]*?)<\/p>/i) || [])[1] || "");
  const tracks = []; const seen = new Set();
  const re = new RegExp(`<a[^>]+href="(\\/play\\/${bid}-[0-9]+-[0-9]+\\.html)"[^>]*>([\\s\\S]*?)<\\/a>`, "gi");
  let m;
  while ((m = re.exec(html))) {
    const link = m[1]; if (seen.has(link)) continue; seen.add(link);
    const tag = m[0].slice(0, m[0].indexOf(">") + 1);
    const title = (tag.match(/title="([^"]*)"/) || [])[1] || "";
    tracks.push({ id: link, name: clean(title) || clean(m[2]) || `第 ${tracks.length + 1} 集`, artists: speaker ? [{ id: "", name: speaker }] : [], album: { id: `album:${bid}`, name: name || "未命名专辑", imageUrl: cover }, duration: 0 });
  }
  known.set(`album:${bid}`, { id: `album:${bid}`, name, imageUrl: cover, artists: speaker ? [{ id: "", name: speaker }] : [] });
  return { album: { id: `album:${bid}`, name: name || "未命名专辑", imageUrl: cover, artists: speaker ? [{ id: "", name: speaker }] : [], description: [author && `作者：${author}`, desc].filter(Boolean).join(" · ") }, tracks };
}

function decodeNow(enc) { return String(enc || "").split("*").filter(Boolean).map((n) => String.fromCharCode(Number(n))).join(""); }
function audioType(u) { return /\.mp3(?:$|\?)/i.test(u) ? "mp3" : "m4a"; }
const isWindows = () => /win/i.test(host.platform || "");
function fileFor(slot) { return `${String(host.dataDir).replace(/[\\/]+$/, "")}${isWindows() ? "\\" : "/"}qmtsw-${slot}.m4a`; }
function fileURL(path) {
  let p = String(path).replace(/\\/g, "/");
  if (/^[A-Za-z]:/.test(p)) p = "/" + p;
  if (!p.startsWith("/")) p = "/" + p;
  return "file://" + p.split("/").map((x) => encodeURIComponent(x).replace(/%3A/gi, ":")).join("/");
}
const FFMPEG_DIRS = {
  darwin: ["/opt/homebrew/bin/ffmpeg", "/usr/local/bin/ffmpeg", "/usr/bin/ffmpeg"],
  linux: ["/usr/bin/ffmpeg", "/usr/local/bin/ffmpeg", "/snap/bin/ffmpeg"],
  win32: ["ffmpeg.exe", "C:\\ffmpeg\\bin\\ffmpeg.exe", "C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe"],
};
function candidates() {
  const set = host.setting("ffmpegPath"); const list = [];
  if (set) list.push(String(set));
  list.push(isWindows() ? "ffmpeg.exe" : "ffmpeg", "ffmpeg");
  for (const p of FFMPEG_DIRS[isWindows() ? "win32" : host.platform] || []) list.push(p);
  return [...new Set(list)];
}
function transcodeOn() { const v = host.setting("transcode"); return v === undefined || v === null || v === "" ? true : String(v) !== "0"; }
async function transcode(url, path, referer) {
  if (typeof host.spawn !== "function") throw new Error("host.spawn is not available");
  let last = "";
  for (const bin of candidates()) {
    let p;
    try { p = host.spawn(bin, ["-y", "-hide_banner", "-loglevel", "error", "-headers", `Referer: ${referer}\r\n`, "-user_agent", UA, "-i", url, "-vn", "-c:a", "aac", "-b:a", "64k", "-movflags", "+faststart", path]); }
    catch (e) { last = `${bin}: ${e}`; continue; }
    if (!p) { last = `${bin}: spawn refused`; continue; }
    let code = 0;
    try { code = await p.wait(); } catch (e) { last = `${bin}: ${e}`; continue; }
    let said = "";
    try { said = (await p.errorOutput()) || ""; } catch {}
    if ((code === undefined || code === null || code === 0) && !said) return;
    last = `${bin}: ${String(said).trim().slice(0, 160) || `exit ${code}`}`;
  }
  throw new Error(last || "ffmpeg not found");
}
const SLOTS = 8;
const slotOf = (id) => { let h = 0; for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) % SLOTS; return h; };
async function stream({ id } = {}) {
  let target = String(id || "");
  if (!/\/play\//.test(target)) {
    const bid = idOf(target);
    if (!bid) throw fail("unavailable", "没有这个音频");
    const detail = await fetchText(`/show/${bid}.html`);
    const first = detail.match(/href="(\/play\/[0-9]+-[0-9]+-[0-9]+\.html)"/);
    if (!first) throw fail("unavailable", "这个专辑没有可播放的章节");
    target = first[1];
  }
  const page = await fetchText(target);
  let u = "";
  const fn = page.match(/var\s+now\s*=\s*FonHen_JieMa\("([^"]*)"\)/i);
  if (fn) u = decodeNow(fn[1]);
  if (!u) u = (page.match(/var\s+now\s*=\s*"([^"]+)"/i) || [])[1] || "";
  if (!u) throw fail("unavailable", "源站没有返回音频地址");
  const type = audioType(u);
  if (type === "mp3") return { url: u, type: "mp3", headers: { referer: abs(target), "user-agent": UA }, title: "" };
  if (!transcodeOn()) return { url: u, type: "m4a", headers: { referer: abs(target), "user-agent": UA }, title: "" };
  const slots = stored("qmtsw:slots", []);
  const key = String(target);
  let slot = slots.indexOf(key);
  if (slot < 0) { slot = slots.findIndex((k) => !k); if (slot < 0) slot = slotOf(key); }
  const path = fileFor(slot);
  try {
    await transcode(u, path, abs(target));
    slots[slot] = key; save("qmtsw:slots", slots);
    return { url: fileURL(path), type: "m4a", title: "" };
  } catch (e) { throw fail("setup", `这一段是 HE-AAC，需要本机安装 ffmpeg 并允许插件运行它 — ${e && e.message ? e.message : e}`); }
}
function lyrics() { return {}; }
function stored(k, d) { try { const v = host.storage.get(k); return v == null ? d : (typeof v === "string" ? JSON.parse(v) : v); } catch (e) { return d; } }
function save(k, v) { host.storage.set(k, JSON.stringify(v)); }
function like({ id, on } = {}) { const s = new Set(stored("qmtsw:liked", [])); const k = String(id); if (on) s.add(k); else s.delete(k); save("qmtsw:liked", [...s]); return { id: k, liked: !!on }; }
function isLiked({ ids } = {}) { const s = new Set(stored("qmtsw:liked", [])); const o = {}; for (const id of ids || []) o[id] = s.has(String(id)); return o; }
function liked({ offset = 0 } = {}) { const all = stored("qmtsw:liked", []).map((id) => known.get(id)).filter(Boolean); return { tracks: all.slice(offset, offset + 60), more: all.length > offset + 60 }; }
function played({ id } = {}) { if (!id) return {}; const list = stored("qmtsw:history", []).filter((x) => x !== id); list.push(String(id)); save("qmtsw:history", list.slice(-100)); return {}; }
function recent() { return stored("qmtsw:history", []).slice().reverse().map((id) => known.get(id)).filter(Boolean).slice(0, 20); }
return { home, browse, search, suggest, album, stream, lyrics, like, isLiked, liked, played, recent };
})(__mfRuntime.host, __mfRuntime.fetch, __mfRuntime.TextDecoder, __mfRuntime.atob, __mfRuntime.btoa, __mfRuntime.URL, __mfRuntime.URLSearchParams);
module.exports = __mfRuntime.makePlugin(__mfPlugin, {"id": "qmtsw", "name": "我听评书网", "version": "0.1.0", "site": "www.qmtsw.com", "searchTypes": ["music", "album"]});
