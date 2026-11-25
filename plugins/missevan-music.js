// 显示名：猫耳FM（missevan-music）
// MusicFree plugin generated from MyGo Music plugin; source site: www.missevan.com
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
// 显示名：猫耳FM（missevan-music）
// MyGo Music plugin — 猫耳FM (www.missevan.com)
//
// A Chinese audio site (radio plays, drama episodes, music sheets) whose API is
// plain JSON and needs no account:
//   search sounds   GET /sound/getsearch?s=<kw>&p=<n>&type=3&page_size=30
//   sound sheets    GET /explore/tagalbum?order=0&tid=<tag>&p=<n>
//   sheet contents  GET /sound/soundalllist?albumid=<id>   sounds carry a CDN m4a
//   tags            GET /malbum/recommand                  groups of [id, name]
//   one sound       GET /sound/getsound?soundid=<id>       HLS only, see below
//
// The catch: newer sounds only come back from getsound as an HLS playlist
// encrypted with SAMPLE-AES and a Widevine key, which no third-party player can
// decode, so the plugin never hands one over. Sounds listed inside a sheet still
// carry their old plain .m4a on maoercdn, and those do play — the sheet is where
// the plugin listens from.

const BASE = "https://www.missevan.com";
const PAGE_SIZE = 30;

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const HEAD = {
  "user-agent": UA,
  "accept-language": "zh-CN,zh;q=0.9,en;q=0.5",
  accept: "application/json",
  referer: BASE + "/sound/search",
};

const t = (text) => host.t(text);

function fail(code, message) {
  const error = new Error(message || code);
  error.code = code;
  return error;
}

async function request(url, options = {}) {
  const init = {
    method: "GET",
    headers: Object.assign({}, HEAD, options.headers || {}),
  };
  const ms = options.timeout || 15000;
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  if (controller) init.signal = controller.signal;
  const timer = setTimeout(() => {
    if (controller) controller.abort();
  }, ms);
  try {
    const res = await fetch(url, init);
    if (res.status >= 400) throw fail("unavailable", res.status + " " + url);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function get(path, params) {
  const query = Object.keys(params || {})
    .filter((key) => params[key] != null && params[key] !== "")
    .map((key) => key + "=" + encodeURIComponent(params[key]))
    .join("&");
  return request(BASE + path + (query ? "?" + query : ""));
}

/* ------------------------------------------------------------------ mapping */

function seconds(ms) {
  const value = Number(ms);
  return value > 0 ? Math.round(value / 1000) : undefined;
}

function trackOf(sound) {
  if (!sound || !sound.id) return null;
  const track = {
    id: "s" + sound.id,
    name: sound.soundstr || sound.name || "",
  };
  if (sound.username) track.artists = [{ name: sound.username }];
  if (sound.front_cover) track.imageUrl = sound.front_cover;
  const length = seconds(sound.duration);
  if (length) track.duration = length;
  return track.name ? track : null;
}

function albumOf(sheet) {
  const album = { id: "m" + sheet.id, name: sheet.title || "" };
  if (sheet.front_cover) album.imageUrl = sheet.front_cover;
  if (sheet.username) album.artists = [{ name: sheet.username }];
  return album;
}

/* ------------------------------------------------------------------ search */

const searchCache = new Map();

async function searchSounds(keyword, pageNo) {
  const key = keyword + "#" + pageNo;
  const cached = searchCache.get(key);
  if (cached && Date.now() - cached.at < 10 * 60 * 1000) return cached.data;

  const body = await get("/sound/getsearch", {
    s: keyword,
    p: pageNo,
    type: 3,
    page_size: PAGE_SIZE,
  });
  const info = body && body.info;
  const list = (info && info.Datas) || [];
  const pager = (info && info.pagination) || {};
  const data = {
    tracks: list
      .filter((sound) => sound && (sound.pay_type == null || String(sound.pay_type) === "0"))
      .map(trackOf)
      .filter(Boolean),
    total: Number(pager.maxpage) || 0,
  };
  searchCache.set(key, { at: Date.now(), data: data });
  return data;
}
async function search({ query, offset, kind }) {
  const keyword = String(query || "").trim();
  if (!keyword) throw fail("invalid", t("请输入搜索内容"));
  if (kind && kind !== "tracks") {
    /* Drama search is closed to guests and sheets cannot be searched by word. */
    return { albums: [], more: false };
  }

  const start = Math.max(0, Number(offset) || 0);
  const pageNo = Math.floor(start / PAGE_SIZE) + 1;
  const data = await searchSounds(keyword, pageNo);
  const tracks = data.tracks.slice(start % PAGE_SIZE);
  remember(tracks);
  return { tracks: tracks, more: pageNo < data.total };
}

const COMMON_TAGS = [
  "广播剧",
  "古风",
  "翻唱",
  "电音",
  "治愈",
  "热血",
  "二次元",
  "同人音乐",
  "游戏原声",
  "作业向",
  "OP",
  "ED",
];

let warming = false;
function suggest({ query }) {
  const words = String(query || "").trim().toLowerCase();
  let names = COMMON_TAGS;

  if (tagCache) {
    const all = [];
    for (const key of Object.keys(tagCache.groups)) {
      for (const tag of tagCache.groups[key]) {
        if (all.indexOf(tag.name) < 0) all.push(tag.name);
      }
    }
    if (all.length) names = all;
  } else if (!warming) {
    /* Fill the cache in the background; the list below answers this call. */
    warming = true;
    tagGroups()
      .catch(() => {})
      .then(() => {
        warming = false;
      });
  }

  return words ? names.filter((name) => name.toLowerCase().indexOf(words) >= 0).slice(0, 10) : names.slice(0, 10);
}

/* ------------------------------------------------------------------ sheets */

const sheetCache = new Map();

async function sheets(pageNo, tagId) {
  const key = (tagId || "0") + "#" + pageNo;
  const cached = sheetCache.get(key);
  if (cached && Date.now() - cached.at < 10 * 60 * 1000) return cached.data;

  const body = await get("/explore/tagalbum", { order: 0, tid: tagId || 0, p: pageNo });
  const list = (body && body.albums) || [];
  const pager = (body && body.pagination) || {};
  const data = {
    albums: list.filter((sheet) => sheet && sheet.id && sheet.title).map(albumOf),
    total: Number(pager.maxpage) || 0,
  };
  sheetCache.set(key, { at: Date.now(), data: data });
  return data;
}

async function sheet(id) {
  const cached = sheetDetail.get(id);
  if (cached && Date.now() - cached.at < 10 * 60 * 1000) return cached.data;

  const body = await get("/sound/soundalllist", { albumid: id });
  const info = body && body.info;
  if (!info || !info.album) throw fail("unavailable", t("没有这个音单"));

  const sounds = (info.sounds || []).filter((sound) => sound && sound.id);
  const tracks = [];
  for (const sound of sounds) {
    const track = trackOf(sound);
    if (!track) continue;
    track.album = { id: "m" + id, name: info.album.title || "" };
    if (sound.soundurl) saveMedia(sound.id, sound.soundurl);
    tracks.push(track);
  }

  const data = {
    album: {
      id: "m" + id,
      name: info.album.title || "",
      imageUrl: info.album.front_cover || undefined,
      artists: info.album.username ? [{ name: info.album.username }] : undefined,
      description: [stripTags(info.album.intro || ""), t("共 %d 首").replace("%d", tracks.length)]
        .filter(Boolean)
        .join("\n"),
    },
    tracks: tracks,
  };
  sheetDetail.set(id, { at: Date.now(), data: data });
  remember(tracks);
  return data;
}

const sheetDetail = new Map();

/* ------------------------------------------------------------------ tags */

let tagCache = null;

async function tagGroups() {
  if (tagCache && Date.now() - tagCache.at < 30 * 60 * 1000) return tagCache.groups;
  const body = await get("/malbum/recommand", {});
  const info = (body && body.info) || {};
  const groups = {};
  for (const key of Object.keys(info)) {
    const list = info[key];
    if (!Array.isArray(list)) continue;
    groups[key] = list
      .filter((item) => Array.isArray(item) && item.length >= 2)
      .map((item) => ({ id: String(item[0]), name: String(item[1]) }));
  }
  tagCache = { at: Date.now(), groups: groups };
  return groups;
}

async function tagNames() {
  try {
    const groups = await tagGroups();
    const names = [];
    for (const key of Object.keys(groups)) {
      for (const tag of groups[key]) {
        if (names.indexOf(tag.name) < 0) names.push(tag.name);
      }
    }
    return names;
  } catch (error) {
    return [];
  }
}

async function tagName(id) {
  try {
    const groups = await tagGroups();
    for (const key of Object.keys(groups)) {
      const found = groups[key].find((tag) => tag.id === String(id));
      if (found) return found.name;
    }
  } catch (error) {
    /* a tag page still works without its name */
  }
  return "";
}

/* ------------------------------------------------------------------ pages */
async function home() {
  const [recommended, tagPage] = await Promise.all([
    sheets(1, 0).catch(() => ({ albums: [], total: 0 })),
    sheets(1, 5).catch(() => ({ albums: [], total: 0 })),
  ]);

  const sections = [];
  if (recommended.albums.length) {
    sections.push({
      title: t("推荐音单"),
      albums: recommended.albums.slice(0, 18),
      morePage: recommended.total > 1 ? "sheets/2" : undefined,
    });
  }
  if (tagPage.albums.length) {
    sections.push({
      title: t("古风音单"),
      albums: tagPage.albums.slice(0, 12),
      morePage: "tag/5/2",
    });
  }
  if (!sections.length) throw fail("unavailable", t("站点没有返回内容"));
  return { title: t("猫耳FM"), sections: sections };
}

function splitPage(value) {
  const clean = String(value || "").replace(/^\/+|\/+$/g, "");
  const numbered = /^(.*?)\/(\d+)$/.exec(clean);
  if (numbered) {
    if (numbered[1] === "sheets") return { base: "sheets", page: parseInt(numbered[2], 10) || 1 };
    if (/^tag\/\d+$/.test(numbered[1])) return { base: numbered[1], page: parseInt(numbered[2], 10) || 1 };
  }
  return { base: clean, page: 1 };
}
async function browse({ page }) {
  const split = splitPage(page);
  const pageNo = split.page || 1;

  if (split.base === "sheets") {
    const data = await sheets(pageNo, 0);
    return {
      title: t("推荐音单"),
      sections: [
        {
          title: t("推荐音单"),
          albums: data.albums,
          morePage: pageNo < data.total ? "sheets/" + (pageNo + 1) : undefined,
        },
      ],
    };
  }

  const tag = /^tag\/(\d+)$/.exec(split.base);
  if (tag) {
    const data = await sheets(pageNo, tag[1]);
    const name = (await tagName(tag[1])) || t("标签");
    return {
      title: name,
      sections: [
        {
          title: name,
          albums: data.albums,
          morePage: pageNo < data.total ? "tag/" + tag[1] + "/" + (pageNo + 1) : undefined,
        },
      ],
    };
  }

  const sheetPath = /^sheet\/(\d+)$/.exec(split.base);
  if (sheetPath) {
    const detail = await sheet(sheetPath[1]);
    return {
      title: detail.album.name,
      description: detail.album.description,
      sections: [{ title: t("音单曲目"), tracks: detail.tracks }],
    };
  }

  const soundPath = /^sound\/(\d+)$/.exec(split.base);
  if (soundPath) {
    const sound = await soundInfo(soundPath[1]);
    const track = trackOf(sound);
    if (!track) throw fail("unavailable", t("没有这个声音"));
    remember([track]);
    return {
      title: track.name,
      sections: [{ title: t("声音"), tracks: [track] }],
    };
  }

  throw fail("unavailable", t("没有这个页面"));
}

/* ---------------------------------------------------------------- album */
async function album({ id }) {
  const key = String(id || "");
  const sheetMatch = /^m(\d+)$/.exec(key);
  if (sheetMatch) {
    const detail = await sheet(sheetMatch[1]);
    return { album: detail.album, tracks: detail.tracks };
  }

  const soundMatch = /^s(\d+)$/.exec(key);
  if (soundMatch) {
    const sound = await soundInfo(soundMatch[1]);
    const track = trackOf(sound);
    if (!track) throw fail("unavailable", t("没有这个声音"));
    remember([track]);
    return {
      album: {
        id: key,
        name: track.name,
        imageUrl: track.imageUrl,
        artists: track.artists,
        description: stripTags(sound.intro || ""),
      },
      tracks: [track],
    };
  }

  throw fail("unavailable", t("没有这个条目"));
}
async function artist({ id }) {
  const raw = String(id || "");
  let name = raw;
  try {
    name = decodeURIComponent(raw);
  } catch (error) {
    /* keep the raw name */
  }
  const data = await searchSounds(name, 1);
  const keeps = data.tracks.filter((track) => {
    const author = (track.artists && track.artists[0] && track.artists[0].name) || "";
    return author === name || author.indexOf(name) >= 0;
  });
  const tracks = keeps.length ? keeps : data.tracks.slice(0, 10);
  remember(tracks);
  return {
    artist: {
      id: raw,
      name: name,
      imageUrl: tracks.length ? tracks[0].imageUrl : undefined,
    },
    tracks: tracks.slice(0, 30),
    albums: [],
  };
}

/* ------------------------------------------------------------------ sound */

const soundCache = new Map();

async function soundInfo(id) {
  const cached = soundCache.get(id);
  if (cached && Date.now() - cached.at < 10 * 60 * 1000) return cached.data;
  const body = await get("/sound/getsound", { soundid: id });
  const sound = body && body.info && body.info.sound;
  if (!sound) throw fail("unavailable", t("没有这个声音"));
  soundCache.set(id, { at: Date.now(), data: sound });
  return sound;
}

/* The sheet pages hand out plain .m4a links; they are kept so that a played
   track can be resolved again later without asking the API. */
const media = host.storage.get("mediaIndex") || {};

function saveMedia(id, url) {
  if (!id || !url) return;
  if (!/^https?:\/\//.test(url)) return;
  if (!/\.(m4a|mp3|aac)(\?|$)/i.test(url)) return;
  if (media[id] === url) return;
  media[id] = url;
  host.storage.set("mediaIndex", media);
}

function directLink(url) {
  const clean = String(url || "");
  if (!/^https?:\/\//.test(clean)) return "";
  if (!/\.(m4a|mp3|aac)(\?|$)/i.test(clean)) return "";
  return clean;
}

const TYPE_OF = { m4a: "m4a", mp3: "mp3", aac: "aac" };

async function probe(url) {
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timer = setTimeout(() => controller && controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      headers: { "user-agent": UA, range: "bytes=0-1023", accept: "*/*" },
      signal: controller ? controller.signal : undefined,
    });
    return { status: res.status, type: res.headers.get("content-type") || "", size: res.headers.get("content-length") };
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------ qingting fallback
   The Widevine HLS cannot be played here, and a bare "failed" leaves the user
   with no way out. With the qtFallback switch turned on, the same programme
   name is looked up on Qingting FM and its audio is played instead; the source
   is written into the title so it is never mistaken for a missevan track.
   Off by default: the plugin would rather refuse than swap the source quietly. */

const QT_SEARCH = "https://search.qtfm.cn";
const QT_API = "https://webapi.qtfm.cn";
const QT_WEB = "https://m.qtfm.cn";
const QT_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Mobile Safari/537.36";

function qtEnabled() {
  try {
    return String((host.setting && host.setting("qtFallback")) || "off") === "on";
  } catch (error) {
    return false;
  }
}

function qtCore(name) {
  return String(name || "")
    .replace(/[《》<>【】\[\]（）()：:·\-—_、，,。.!！?？\s]/g, "")
    .replace(/(长篇|短篇|袍带|评书|有声|小说|经典|全集|在线听|mp3)/gi, "");
}

function qtScore(a, b) {
  const left = qtCore(a);
  const right = qtCore(b);
  if (!left || !right) return 0;
  /* A short name sitting inside a longer title is the same book far more often
     than a coincidental character overlap — "盗墓笔记" inside "盗墓笔记 蛇沼鬼城
     第一集" should win over "北派盗墓笔记", which merely shares four characters. */
  if (left.includes(right) || right.includes(left)) return 0.6;
  const leftSet = [...left];
  const rightSet = new Set([...right]);
  let hit = 0;
  for (const ch of leftSet) if (rightSet.has(ch)) hit++;
  return hit / Math.max(leftSet.length, rightSet.size);
}

async function qtJson(url) {
  const res = await fetch(url, {
    headers: { "user-agent": QT_UA, origin: QT_WEB, referer: QT_WEB + "/", accept: "application/json,*/*" },
  });
  if (!res.ok) throw fail("unavailable", "蜻蜓FM " + res.status);
  return res.json();
}

async function qtEpisode(chid, pid, title) {
  const res = await fetch(QT_WEB + "/vchannels/" + chid + "/programs/" + pid + "/", {
    headers: { "user-agent": QT_UA, referer: QT_WEB + "/" },
  });
  if (!res.ok) return null;
  const page = await res.text();
  if (/用户未购买/.test(page)) return null;
  const found = /"audioUrl":"([^"]+)"/.exec(page);
  if (!found) return null;
  const url = found[1].replace(/\\\//g, "/");
  if (!/^https?:\/\//i.test(url)) return null;
  return {
    url: url,
    type: /\.m4a(\?|$)/i.test(url) ? "m4a" : "mp3",
    headers: { referer: QT_WEB + "/", "user-agent": UA },
    title: title,
  };
}

async function qtChannelEpisode(chid) {
  const meta = await qtJson(QT_API + "/api/mobile/channels/" + chid);
  const channel = (meta && meta.channel) || {};
  const version = String(channel.v || "");
  if (!version) return null;
  const list = await qtJson(
    QT_API + "/api/mobile/channels/" + chid + "/programs?version=" + version + "&page_index=1",
  );
  const programs = (list && list.programs) || [];
  const free = programs.filter(
    (item) => item.isFree === true || item.saleStatus === "free" || Number(item.fee) === 0,
  );
  /* The first free item is often a trailer ("片花"), which is 40 seconds of
     nothing. Skip those and start from the earliest real episode. */
  const junk = /片花|预告|试听|花絮|主题曲|宣传|福利|彩蛋|先导/;
  const picks = free.length ? free : programs;
  const clean = picks.filter((item) => !junk.test(String(item.title || "")));
  const pool = (clean.length ? clean : picks).slice();
  pool.sort((a, b) => Number(a.programId || 0) - Number(b.programId || 0));
  const first = pool[0];
  if (!first) return null;
  return qtEpisode(chid, first.programId, first.title || "");
}

async function qtByName(name) {
  const keyword = String(name || "").trim();
  if (!keyword) return null;
  const body = await qtJson(
    QT_SEARCH + "/v3/search?include=channel&k=" + encodeURIComponent(keyword) + "&page=1&pagesize=20",
  );
  const docs = (((body || {}).data || {}).data || {}).docs || [];
  for (const doc of docs) {
    if (!doc || !doc.id) continue;
    if (qtScore(doc.title || "", keyword) < 0.4) continue;
    const type = String(doc.type || "");
    if (type.includes("channel")) {
      const hit = await qtChannelEpisode(doc.id);
      if (hit) return hit;
    } else if (type.includes("program") && doc.parent_id) {
      const hit = await qtEpisode(doc.parent_id, doc.id, doc.title || "");
      if (hit) return hit;
    }
  }
  return null;
}
async function stream({ id }) {
  const key = String(id || "");
  const sid = key.indexOf("s") === 0 ? key.slice(1) : key;
  if (!/^\d+$/.test(sid)) throw fail("invalid", t("没有这个声音"));

  const known = directLink(media[sid]);
  if (known) {
    const ext = (known.split("?")[0].match(/\.([a-z0-9]+)$/i) || [])[1] || "m4a";
    return { url: known, type: TYPE_OF[ext.toLowerCase()] || "m4a" };
  }

  /* Not seen in any sheet yet: ask the API. A plain file can be played, but a
     hls.m3u8 means the Widevine copy, and that one stays unplayed. */
  let sound = null;
  let apiError = null;
  try {
    sound = await soundInfo(sid);
  } catch (error) {
    apiError = error;
  }
  const url = sound ? directLink(sound.soundurl) || directLink(sound.soundurl_128) : "";
  if (url) {
    saveMedia(sid, url);
    const ext = (url.split("?")[0].match(/\.([a-z0-9]+)$/i) || [])[1] || "m4a";
    return { url: url, type: TYPE_OF[ext.toLowerCase()] || "m4a" };
  }

  if (qtEnabled()) {
    const name = trackById(key).name;
    if (name && name !== key) {
      const alt = await qtByName(name).catch(() => null);
      if (alt) {
        return { url: alt.url, type: alt.type, headers: alt.headers, title: name + " · 蜻蜓FM" };
      }
    }
  }

  if (apiError) throw apiError;
  throw fail(
    "unavailable",
    t("这条声音在站点里是 Widevine 加密的 HLS，第三方播放器解不了；请在猫耳FM 客户端收听，或换音单里的曲目"),
  );
}
function lyrics() {
  return { lrc: "" };
}

/* ------------------------------------------------------------------ library */

const index = host.storage.get("trackIndex") || {};

function remember(tracks) {
  let changed = false;
  for (const track of tracks) {
    if (!track || !track.id) continue;
    const entry = {
      id: track.id,
      name: track.name,
      artists: track.artists,
      imageUrl: track.imageUrl,
      duration: track.duration,
    };
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
  return liked[id] || { id: id, name: id };
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

/* ------------------------------------------------------------------ helpers */

function stripTags(html) {
  return String(html || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#(\d+);/g, (match, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}
return { search, suggest, home, browse, album, artist, stream, lyrics, played, recent, like, liked, isLiked };
})(__mfRuntime.host, __mfRuntime.fetch, __mfRuntime.TextDecoder, __mfRuntime.atob, __mfRuntime.btoa, __mfRuntime.URL, __mfRuntime.URLSearchParams);
module.exports = __mfRuntime.makePlugin(__mfPlugin, {"id": "missevan-music", "name": "猫耳FM", "version": "1.1.1", "site": "www.missevan.com", "searchTypes": ["music", "album", "artist"]});
