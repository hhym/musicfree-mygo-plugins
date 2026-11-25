// 显示名：5nd音乐（5nd-music）
// MusicFree plugin generated from MyGo Music plugin; source site: www.5nd.com
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
// 显示名：5nd音乐（5nd-music）
// MyGo Music plugin — 5nd音乐 (www.5nd.com)
//
// The site is an ASP.NET music site. What the plugin uses:
//   home        GET  /
//   charts      GET  /paihang/            index of charts
//   chart       GET  /paihang/<slug>.htm  66 songs, one page
//   singers     GET  /singer/             recommended singers
//   albums      GET  /album/              recommended albums
//   search      GET  /so/kk_<kw>          songs + albums + singers
//               GET  /so/ss_<kw>[_<n>]    songs only, 20 a page
//               GET  /so/mm_<kw>          albums only
//               GET  /so/si_<kw>          singers only
//   song page   GET  /ting/<id>.html
//   all songs   GET  /all/<id>.htm        every song of a singer
//   singer      GET  /s/<id>.htm
//   singer alb. GET  /singerzj/<id>.htm
//   album       GET  /m/<id>.htm
//   lyrics      GET  /gecilrc/<id>.htm    (fallback)
//   api         GET  /gwapi/page/songs?t=100&_lrc=1&ids=<id>
//                    -> dsong.list[0] = {msongname, msingername, msongpath,
//                       msongpic, malbumvid, mpubdate, mtext (LRC), ...}
//   audio       https://mpge.5nd.com/<msongpath>
//
// Note on audio: mpge.5nd.com sits behind an anti-leech edge. A browser plays
// it; a bare HTTP client gets 302 to 127.0.0.1:1234. The edge only checks that
// an Hm_lpvt_* analytics cookie is present, not its value, so the plugin ships
// EDGE_COOKIE and App playback works without the user touching a browser.
// A cookie pasted in settings still wins, for the day the site renames it.

const BASE = "https://www.5nd.com";
const MEDIA = "https://mpge.5nd.com";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const HEAD = {
  "user-agent": UA,
  "accept-language": "zh-CN,zh;q=0.9,en;q=0.5",
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

/* 2026-11-24 实测：mpge.5nd.com 只检查有没有 Hm_lpvt_* 这个统计 Cookie，
   值是 1 也能拿到 206；不带就是 302 到 127.0.0.1:1234。 */
const EDGE_COOKIE = "Hm_lpvt_b0886cdce91635b40ead075af50a1bdf=1";

const t = (text) => host.t(text);

function fail(code, message) {
  const error = new Error(message || code);
  error.code = code;
  return error;
}

function manualCookie() {
  return String(host.setting("cookie") || "").trim();
}

function edgeCookie() {
  return manualCookie() || EDGE_COOKIE;
}

function deadline(promise, ms, label) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(fail("timeout", "timed out " + (label || ms + "ms"))), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

async function once(url, init, ms) {
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  if (controller) init.signal = controller.signal;
  const request = fetch(url, init);
  try {
    return await deadline(request, ms, url);
  } catch (error) {
    if (controller) controller.abort();
    throw error;
  }
}

async function request(path, options = {}) {
  const url = path.indexOf("http") === 0 ? path : BASE + path;
  const headers = Object.assign({}, HEAD, options.headers || {});
  headers.cookie = edgeCookie();
  const init = { method: options.method || "GET", headers: headers };
  if (options.body != null) init.body = options.body;
  const ms = options.timeout || 10000;
  try {
    return await once(url, init, ms);
  } catch (first) {
    return await once(url, Object.assign({}, init), ms);
  }
}

const pageCache = new Map();

async function page(path) {
  const url = path.indexOf("http") === 0 ? path : BASE + path;
  const cached = pageCache.get(url);
  if (cached && Date.now() - cached.at < 60 * 1000) return cached.html;
  const res = await request(url);
  const html = await res.text();
  if (res.status >= 400) throw fail("unavailable", res.status + " " + url);
  pageCache.set(url, { at: Date.now(), html: html });
  return html;
}

/* ------------------------------------------------------------------ */
/* Parsing helpers                                                     */
/* ------------------------------------------------------------------ */

function decode(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
    const name = entity.toLowerCase();
    if (name === "amp") return "&";
    if (name === "lt") return "<";
    if (name === "gt") return ">";
    if (name === "quot") return '"';
    if (name === "apos") return "'";
    if (name === "nbsp") return " ";
    if (name.charAt(0) === "#") {
      const code = name.charAt(1) === "x" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
      return code === code ? String.fromCodePoint(code) : match;
    }
    return match;
  });
}

function plain(html) {
  if (!html) return "";
  return decode(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function pick(html, regex) {
  const match = html.match(regex);
  return match ? plain(match[1]) : "";
}

function sized(url) {
  if (!url) return "";
  return decode(url).replace(/^\/\//, "https://").replace(/^http:\/\//i, "https://");
}

/* Every row of every list on the site is an <li> that links its song with
   /ting/<id>.html and, when the page knows it, its singer with /s/<id>.htm. */
function tracksFrom(html, artistName, artistId) {
  const out = [];
  const seen = new Set();
  const blockRe = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
  let block;
  while ((block = blockRe.exec(html))) {
    const row = block[1];
    const link = row.match(/href="\/ting\/(\d+)\.html"[^>]*>([\s\S]*?)<\/a>/i);
    if (!link) continue;
    const id = link[1];
    const name = plain(link[2]);
    if (!id || !name || seen.has(id)) continue;

    const singer = row.match(/href="\/s\/(\d+)\.htm"[^>]*>([\s\S]*?)<\/a>/i);
    let singerName = singer ? plain(singer[2]) : "";
    let title = name;
    // Many rows carry "Song - Artist" in one link instead of a singer link.
    if (!singerName) {
      const dash = name.lastIndexOf(" - ");
      if (dash > 0) {
        title = name.slice(0, dash).trim();
        singerName = name.slice(dash + 3).trim();
      }
    }

    const track = { id: id, name: title };
    if (singerName) {
      const artist = { name: singerName };
      if (singer && singer[1]) artist.id = singer[1];
      track.artists = [artist];
    } else if (artistName) {
      const artist = { name: artistName };
      if (artistId) artist.id = artistId;
      track.artists = [artist];
    }
    out.push(track);
    seen.add(id);
  }
  return out;
}

function uniqueTracks(tracks) {
  const seen = new Set();
  const out = [];
  for (const track of tracks) {
    if (!track || !track.id || seen.has(track.id)) continue;
    seen.add(track.id);
    out.push(track);
  }
  return out;
}

// Albums: <a href="/m/<id>.htm"><img src="..."></a> … <a href="/m/<id>.htm">Name</a>
function albumCards(html) {
  const out = [];
  const seen = new Set();
  const re = /<a\b[^>]*href="\/m\/(\d+)\.htm"[^>]*>\s*<img[^>]*src="([^"]+)"[^>]*>/gi;
  let match;
  while ((match = re.exec(html))) {
    const id = match[1];
    if (seen.has(id)) continue;
    const tail = html.slice(match.index, match.index + 1400);
    const nameMatch = tail.match(new RegExp('<a[^>]*href="/m/' + id + '\\.htm"[^>]*>([^<]{1,120})</a>'));
    let name = nameMatch ? decode(nameMatch[1]).trim() : "";
    if (!name) {
      const titleMatch = tail.match(/title="([^"]{1,120})"/);
      if (titleMatch) name = decode(titleMatch[1]).replace(/^专辑[：:]/, "").trim();
    }
    name = name.replace(/^《([\s\S]+)》$/, "$1").trim();
    if (!name) continue;
    out.push({ id: id, name: name, imageUrl: sized(match[2]) });
    seen.add(id);
  }
  return out;
}

// Singers: <a href="/s|/all/<id>.htm"><img …><em>Name</em></a>, or a card with
// the name under the picture.
function artistCards(html) {
  const out = [];
  const seen = new Set();
  const re = /<a\b[^>]*href="\/(?:s|all)\/(\d+)\.htm"[^>]*>\s*<img[^>]*src="([^"]+)"[^>]*>/gi;
  let match;
  while ((match = re.exec(html))) {
    const id = match[1];
    if (seen.has(id)) continue;
    const tail = html.slice(match.index, match.index + 900);
    let name = "";
    const em = tail.match(/<em>([^<]{1,60})<\/em>/);
    if (em) name = em[1];
    if (!name) {
      const h4 = tail.match(/<h4>\s*<a[^>]*>([^<]{1,60})<\/a>/);
      if (h4) name = h4[1];
    }
    if (!name) {
      const btn = tail.match(/<div class="albumBtn">\s*<a[^>]*>([^<]{1,60})<\/a>/);
      if (btn) name = btn[1];
    }
    if (!name) {
      const title = tail.match(/title="歌手[：:]\s*([^"<]{1,40}?)\s*(?:歌手信息|全部歌曲|的图片)?/);
      if (title) name = title[1];
    }
    name = plain(name);
    name = name.replace(/^《([\s\S]+)》$/, "$1").trim();
    if (!name) continue;
    out.push({ id: id, name: name, imageUrl: sized(match[2]) });
    seen.add(id);
  }
  return out;
}

function hasNextPage(html, current) {
  return new RegExp('href="[^"]*_' + (current + 1) + '"').test(html) || new RegExp('href="[^"]*/' + (current + 1) + '"').test(html);
}

/* Tracks the listener has seen, so liked songs and history can be rebuilt
   from their ids alone. */
const index = host.storage.get("trackIndex") || {};
function remember(tracks) {
  let added = false;
  for (const track of tracks) {
    if (track && track.id && !index[track.id]) {
      index[track.id] = track;
      added = true;
    }
  }
  if (!added) return;
  const keys = Object.keys(index);
  if (keys.length > 3000) {
    for (const key of keys.slice(0, keys.length - 3000)) delete index[key];
  }
  host.storage.set("trackIndex", index);
}

function load(key, fallback) {
  const value = host.storage.get(key);
  return value === null || value === undefined ? fallback : value;
}
function save(key, value) {
  host.storage.set(key, value);
}

/* ------------------------------------------------------------------ */
/* The song API: name, singer, mp3 path and LRC in one request          */
/* ------------------------------------------------------------------ */

const infoCache = new Map();

async function infoFromApi(id) {
  const res = await request("/gwapi/page/songs?t=100&_lrc=1&ids=" + encodeURIComponent(id), {
    timeout: 12000,
    headers: {
      referer: BASE + "/ting/" + id + ".html",
      "x-requested-with": "XMLHttpRequest",
      accept: "application/json, text/plain, */*",
    },
  });
  const body = await res.text();
  const data = JSON.parse(body);
  const list = data && data.dsong && data.dsong.list;
  if (!list || !list.length || !list[0].msongpath) throw fail("unavailable", "no song in api");
  return list[0];
}

/* Every song page carries the mp3 path on the player element:
     <div id="kuPlayer" data-play="2014/2014-12-29/65396/1.mp3">
   so when the API is out of reach the page still answers, without the LRC
   header that only the API has. */
async function infoFromPage(id) {
  const html = await page("/ting/" + id + ".html");
  const play =
    html.match(/id="kuPlayer"[^>]*data-play="([^"]+)"/i) || html.match(/data-play="([^"]+\.mp3)"/i);
  if (!play) throw fail("unavailable", t("这首歌暂时播放不了"));
  const info = { msongvid: id, msongpath: decode(play[1]) };
  const singer = html.match(/歌手[：:]\s*<a[^>]*href="\/s\/(\d+)[^"]*"[^>]*>([^<]+)</i);
  if (singer) {
    info.msingervid = singer[1];
    info.msingername = plain(singer[2]);
  }
  const album = html.match(/所属专辑[：:]\s*<a[^>]*href="\/m\/(\d+)[^"]*"[^>]*>([^<]+)</i);
  if (album) {
    info.malbumvid = album[1];
    info.malbumname = plain(album[2]);
  }
  return info;
}

async function songInfo(id) {
  const cached = infoCache.get(id);
  if (cached && Date.now() - cached.at < 10 * 60 * 1000) return cached.data;

  let data = null;
  try {
    data = await infoFromApi(id);
  } catch (error) {
    console.log("[5nd] api failed for " + id + ": " + (error && error.message));
  }
  if (!data) data = await infoFromPage(id);

  infoCache.set(id, { at: Date.now(), data: data });
  return data;
}

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */

const TRACK_SECTIONS = {
  "最新歌曲推荐": 20,
  "推荐流行歌曲": 20,
  "好听的歌曲": 20,
  "最新网络歌曲": 20,
  "伤感歌曲": 20,
  "影视歌曲": 20,
  "DJ舞曲": 20,
  "最新歌曲": 20,
};

const ALBUM_SECTIONS = { "歌曲首发": true, "专辑推荐": true };

function chartLinks() {
  return [
    { title: "最热歌曲排行榜", page: "chart/liuxinggequ" },
    { title: "最新歌曲", page: "chart/xinge" },
    { title: "好听的歌", page: "chart/tuijiangequ" },
    { title: "经典老歌", page: "chart/jingdian" },
    { title: "伤感歌曲", page: "chart/107" },
    { title: "全部榜单", page: "charts" },
    { title: t("歌手"), page: "singers" },
    { title: t("专辑"), page: "albums" },
  ];
}
async function home() {
  let html;
  try {
    html = await page("/");
  } catch (error) {
    console.log("[5nd] home failed:", error && error.message);
    return {
      title: "5nd音乐",
      sections: [{ title: t("榜单"), links: chartLinks() }],
    };
  }

  const heads = [];
  const headRe = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  let head;
  while ((head = headRe.exec(html))) {
    heads.push({ title: plain(head[1]), start: headRe.lastIndex, tag: head.index });
  }

  const sections = [];
  const seen = new Set();
  for (let i = 0; i < heads.length; i++) {
    const title = heads[i].title;
    if (!title) continue;
    const end = i + 1 < heads.length ? heads[i + 1].tag : Math.min(html.length, heads[i].start + 40000);
    const body = html.slice(heads[i].start, end);

    if (TRACK_SECTIONS[title]) {
      const fresh = tracksFrom(body).filter((track) => !seen.has(track.id));
      for (const track of fresh) seen.add(track.id);
      if (!fresh.length) continue;
      remember(fresh);
      sections.push({ title: title, tracks: fresh.slice(0, TRACK_SECTIONS[title]) });
      continue;
    }
    if (ALBUM_SECTIONS[title]) {
      const albums = albumCards(body);
      if (albums.length) sections.push({ title: title, albums: albums });
      continue;
    }
    if (title === "热门歌手") {
      const artists = artistCards(body);
      if (artists.length) sections.push({ title: title, artists: artists });
    }
  }

  sections.push({ title: t("榜单"), links: chartLinks() });

  return {
    title: "5nd音乐",
    subtitle: pick(html, /歌曲更新：\s*([\d-]+)/),
    sections: sections,
  };
}

/* ------------------------------------------------------------------ */
/* Pages of the site's own                                             */
/* ------------------------------------------------------------------ */

async function chartPage(slug) {
  const html = await page("/paihang/" + slug + ".htm");
  const indexHtml = await page("/paihang/").catch(() => "");
  const known = new RegExp('href="/paihang/' + slug + '\\.htm"[^>]*>([^<]{1,40})<', "i").exec(indexHtml);
  const title = known ? plain(known[1]) : pick(html, /<h1>([\s\S]*?)<\/h1>/);
  const tracks = uniqueTracks(tracksFrom(html));
  remember(tracks);
  return {
    title: title || slug,
    subtitle: "",
    sections: tracks.length ? [{ title: title || slug, tracks: tracks }] : [],
  };
}

async function chartsPage() {
  const html = await page("/paihang/");
  const links = [];
  const seen = new Set();
  const re = /href="\/paihang\/([a-z0-9]+)\.htm"[^>]*>([^<]{1,40})</gi;
  let match;
  while ((match = re.exec(html))) {
    if (seen.has(match[1])) continue;
    const title = plain(match[2]);
    if (!title) continue;
    seen.add(match[1]);
    links.push({ title: title, page: "chart/" + match[1] });
  }
  return { title: t("榜单"), subtitle: "", sections: [{ title: t("榜单"), links: links }] };
}

async function singIndexPage() {
  const html = await page("/singer/");
  const artists = artistCards(html);
  return {
    title: t("歌手"),
    subtitle: pick(html, /共\s*(\d+)\s*位歌手/),
    sections: artists.length ? [{ title: t("歌手"), artists: artists }] : [],
  };
}

async function albumIndexPage() {
  const html = await page("/album/");
  const albums = albumCards(html);
  return {
    title: t("专辑"),
    subtitle: "",
    sections: albums.length ? [{ title: t("专辑"), albums: albums }] : [],
  };
}
async function browse({ page: name }) {
  const parts = String(name || "").split("/");
  if (parts[0] === "chart" && parts[1]) return chartPage(parts[1]);
  if (parts[0] === "charts") return chartsPage();
  if (parts[0] === "singers") return singIndexPage();
  if (parts[0] === "albums") return albumIndexPage();
  throw fail("unavailable", t("没有这个页面"));
}

/* ------------------------------------------------------------------ */
/* Search                                                              */
/* ------------------------------------------------------------------ */

function searchPath(kind, query, number) {
  const prefix = kind === "albums" ? "mm" : kind === "artists" ? "si" : kind === "all" ? "kk" : "ss";
  const base = "/so/" + prefix + "_" + encodeURIComponent(query);
  return number > 1 ? base + "_" + number : base;
}
async function search({ query, kind, offset }) {
  const text = String(query || "").trim();
  const key = kind || "tracks";
  if (!text) {
    if (key === "albums") return { albums: [], more: false };
    if (key === "artists") return { artists: [], more: false };
    return { tracks: [], more: false };
  }

  if (key === "albums") {
    const html = await page(searchPath("albums", text, 1));
    return { albums: albumCards(html), more: false };
  }
  if (key === "artists") {
    const html = await page(searchPath("artists", text, 1));
    return { artists: artistCards(html), more: false };
  }
  if (key !== "tracks") return { tracks: [], more: false };

  const number = offset > 0 ? Math.floor(Number(offset) / 20) + 1 : 1;
  const html = await page(searchPath("tracks", text, number));
  const tracks = uniqueTracks(tracksFrom(html));
  remember(tracks);
  const more = html.indexOf('class="pages"') >= 0 && hasNextPage(html, number);
  return { tracks: tracks, more: more };
}
async function suggest({ query }) {
  const text = String(query || "").trim();
  if (!text) return [];
  try {
    const html = await page(searchPath("tracks", text, 1));
    const names = [];
    for (const track of uniqueTracks(tracksFrom(html))) {
      const label = track.artists && track.artists.length ? track.artists[0].name + " - " + track.name : track.name;
      names.push(label);
    }
    return names.slice(0, 10);
  } catch (error) {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Albums, artists, lyrics, audio                                      */
/* ------------------------------------------------------------------ */
async function album({ id }) {
  const html = await page("/m/" + id + ".htm");
  let name = pick(html, /<h1>([\s\S]*?)<\/h1>/) || id;
  name = name.replace(/^《([\s\S]+)》$/, "$1").trim();

  const artistMatch = html.match(/艺人：<\/span>\s*<span>\s*<a[^>]*href="\/s\/(\d+)\.htm"[^>]*>([\s\S]*?)<\/a>/);
  const artist = artistMatch ? { id: artistMatch[1], name: plain(artistMatch[2]) } : null;

  const tracks = uniqueTracks(tracksFrom(html, artist ? artist.name : "", artist ? artist.id : ""));
  remember(tracks);

  const album = {
    id: id,
    name: name,
    imageUrl: sized(pick(html, /<div class="songAboutPic[^"]*"[\s\S]{0,400}?<img[^>]*src="([^"]+)"/)),
    description: plain(pick(html, /<div class="albumAbout[\s\S]{0,800}?<p>([\s\S]*?)<\/p>/)),
  };
  if (artist) album.artists = [artist];
  const released = pick(html, /发行时间：<\/span>\s*<span>([\d-]+)/);
  if (released) album.released = released;
  album.trackCount = tracks.length;
  album.saved = load("savedAlbums", []).indexOf(id) >= 0;

  const objects = load("albumObjects", {});
  objects[id] = album;
  save("albumObjects", objects);

  return { album: album, tracks: tracks };
}

async function artistByName(name) {
  const html = await page(searchPath("tracks", name, 1));
  const tracks = uniqueTracks(tracksFrom(html)).filter((track) => {
    const people = track.artists || [];
    return people.some((person) => person.name === name);
  });
  remember(tracks);
  return {
    artist: { id: "n:" + name, name: name },
    tracks: tracks,
    albums: [],
  };
}
async function artist({ id }) {
  if (String(id).indexOf("n:") === 0) return artistByName(String(id).slice(2));

  const profile = await page("/s/" + id + ".htm");
  const name = pick(profile, /<h1>([\s\S]*?)<\/h1>/) || String(id);
  const imageUrl = sized(pick(profile, /<div class="singerAboutPic">\s*<img[^>]*src="([^"]+)"/));

  const all = await page("/all/" + id + ".htm").catch(() => profile);
  const tracks = uniqueTracks(tracksFrom(all, name, String(id)));
  remember(tracks);

  const albumsHtml = await page("/singerzj/" + id + ".htm").catch(() => "");
  let albums = albumCards(albumsHtml);
  if (!albums.length) albums = albumCards(profile);

  return {
    artist: { id: String(id), name: name, imageUrl: imageUrl },
    tracks: tracks,
    albums: albums,
  };
}
async function lyrics({ id }) {
  try {
    const info = await deadline(songInfo(id), 8000, "song " + id).catch(() => null);
    if (info && info.mtext) return { lrc: String(info.mtext).replace(/\r\n/g, "\n").trim() };
  } catch (error) {
    /* fall through to the lyric page */
  }
  try {
    const html = await page("/gecilrc/" + id + ".htm");
    const block = html.match(/<li>([\s\S]*?\[00:[\s\S]*?)<\/li>/);
    if (!block) return { lrc: "" };
    const lrc = plainLines(block[1].replace(/<br\s*\/?>/gi, "\n"));
    const from = lrc.search(/\[\d{1,2}:\d{1,2}/);
    return { lrc: from > 0 ? lrc.slice(from) : lrc };
  } catch (error) {
    return { lrc: "" };
  }
}

function plainLines(text) {
  return decode(text.replace(/<[^>]*>/g, ""))
    .split("\n")
    .map((line) => line.replace(/\s+$/g, ""))
    .filter((line) => line.length > 0)
    .join("\n");
}

const playableCache = new Map();

/* mpge.5nd.com sits behind an edge that lets a browser in and turns most
   other clients away (302 to 127.0.0.1:1234, sometimes a 502). Asking for
   one byte first tells us which of the two we are on this machine, so the
   listener gets a sentence instead of the app's "HTTP 502" line. */
async function playable(url) {
  const cached = playableCache.get(url);
  if (cached && Date.now() - cached.at < 5 * 60 * 1000) return cached;
  let ok = false;
  let size = 0;
  try {
    const res = await once(
      url,
      {
        headers: Object.assign({}, HEAD, {
          referer: BASE + "/",
          cookie: edgeCookie(),
          range: "bytes=0-1",
        }),
      },
      6000
    );
    ok = res.status === 206 || res.status === 200;
    if (ok) {
      /* Range 命中时 content-length 是这 2 个字节，总大小在 content-range 里。 */
      const range = res.headers.get("content-range") || "";
      const total = Number((range.match(/\/\s*(\d+)/) || [])[1]);
      size = total > 0 ? total : Number(res.headers.get("content-length")) || 0;
    }
    if (ok && res.body && typeof res.body.cancel === "function") res.body.cancel().catch(() => {});
  } catch (error) {
    ok = false;
  }
  const probe = { at: Date.now(), ok: ok, size: size };
  playableCache.set(url, probe);
  return probe;
}

const openedTabs = new Map();

// 整张专辑连播时，一首歌一个标签页会刷屏，所以 45 秒内同一首歌只开一次
function openInBrowser(id, page) {
  const key = String(id);
  const last = openedTabs.get(key);
  if (last && Date.now() - last < 45000) return true;
  try {
    if (typeof host.openURL !== "function") return false;
    host.openURL(page);
    openedTabs.set(key, Date.now());
    return true;
  } catch (error) {
    console.log("[5nd] openURL failed: " + (error && error.message));
    return false;
  }
}
async function stream({ id }) {
  const info = await songInfo(id);
  const headers = {
    referer: BASE + "/ting/" + id + ".html",
    "user-agent": UA,
  };
  headers.cookie = edgeCookie();
  const url = MEDIA + "/" + String(info.msongpath).replace(/^\/+/, "");

  const probe = await playable(url);
  if (!probe.ok) {
    const page = BASE + "/ting/" + id + ".html";
    // 内置 EDGE_COOKIE 之后 mpge 一般会放行；仍然 302 说明该出口被单独拦了，
    // 这时才走浏览器兜底，设置里关掉即只在 App 内尝试。
    const preference = String(host.setting("browser") || "").trim();
    if (preference !== "off") {
      const opened = openInBrowser(id, page);
      if (opened) {
        throw fail("unavailable", t("5nd 音频被拒，已在浏览器打开这首歌"));
      }
      throw fail("unavailable", t("5nd 音频被拒，App 内播不了，这台机器也没法打开浏览器"));
    }
    throw fail("unavailable", t("5nd 音频被拒，App 内播不了。插件设置里把「音频被拒时用浏览器打开」调回默认即可自动开浏览器"));
  }

  return { url: url, type: "mp3", headers: headers, size: probe.size || undefined };
}

/* ------------------------------------------------------------------ */
/* Library kept on this device                                         */
/* ------------------------------------------------------------------ */

function trackById(id) {
  if (index[id]) return index[id];
  const saved = load("likedTracks", {});
  return saved[id] || { id: id, name: id };
}
function recent() {
  return load("recent", [])
    .map(trackById)
    .filter(Boolean)
    .slice(0, 10);
}
function played({ id }) {
  if (!id) return;
  const ids = load("recent", []).filter((item) => item !== id);
  ids.unshift(id);
  save("recent", ids.slice(0, 20));
}
function liked() {
  const ids = load("liked", []);
  const tracks = ids.map(trackById).filter(Boolean);
  remember(tracks);
  return { tracks: tracks, more: false };
}
function isLiked({ ids }) {
  const set = new Set(load("liked", []));
  const out = {};
  for (const id of ids || []) out[id] = set.has(id);
  return out;
}
function like({ id, on }) {
  const set = new Set(load("liked", []));
  if (on) {
    set.add(id);
    if (index[id]) {
      const saved = load("likedTracks", {});
      saved[id] = index[id];
      save("likedTracks", saved);
    }
  } else {
    set.delete(id);
  }
  save("liked", [...set]);
}
function savedAlbums() {
  const ids = load("savedAlbums", []);
  const objects = load("albumObjects", {});
  const out = [];
  for (const id of ids) {
    const album = objects[id] || { id: id, name: id };
    out.push({
      id: album.id,
      name: album.name,
      imageUrl: album.imageUrl,
      artists: album.artists,
      trackCount: album.trackCount,
      saved: true,
    });
  }
  return { albums: out, more: false };
}
function saveAlbum({ id, on }) {
  const saved = new Set(load("savedAlbums", []));
  if (on) saved.add(id);
  else saved.delete(id);
  save("savedAlbums", [...saved]);
}
function setSetting({ key, value }) {
  if (key === "cookie") console.log(value ? "cookie set by hand" : "cookie cleared");
}
return { home, browse, search, suggest, album, artist, lyrics, stream, recent, played, liked, isLiked, like, savedAlbums, saveAlbum, setSetting };
})(__mfRuntime.host, __mfRuntime.fetch, __mfRuntime.TextDecoder, __mfRuntime.atob, __mfRuntime.btoa, __mfRuntime.URL, __mfRuntime.URLSearchParams);
module.exports = __mfRuntime.makePlugin(__mfPlugin, {"id": "5nd-music", "name": "5nd音乐", "version": "1.6.2", "site": "www.5nd.com", "searchTypes": ["music", "album", "artist"]});
