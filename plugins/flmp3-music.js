// 显示名：凤梨音乐（flmp3-music）
// MusicFree plugin generated from MyGo Music plugin; source site: www.flmp3.pro
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
// 显示名：凤梨音乐（flmp3-music）
// MyGo Music plugin — 凤梨音乐 (www.flmp3.pro)
//
// A small Chinese music site: every page is plain HTML, no account, no cookie.
// What the plugin uses:
//   home        GET  /index.html              22 latest cards
//   collections GET  /heji.html?page=<n>      12 collection cards a page
//   songs       GET  /song.html?page=<n>      12 song cards a page
//   search      GET  /search.html?keyword=<k>&page=<n>
//   song page   GET  /song/<id>.html          name, singer, cover, date, lyrics
//                                             and a "热门推荐" list
//   audio       GET  /api/playurl.php?id=<id> a plain text URL on *.kuwo.cn
//                                             (mp3 or aac, no hotlink check)
//   download    needs /api/captcha.php, so the plugin leaves it out.
//
// A page either holds one track (the player element <audio id="audioTag">) or a
// collection, which has no player and instead lists the songs it gathers; both
// live under /song/<id>.html, so the page itself tells which one it is.

const BASE = "https://www.flmp3.pro";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const HEAD = {
  "user-agent": UA,
  "accept-language": "zh-CN,zh;q=0.9,en;q=0.5",
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

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
  if (options.body != null) init.body = options.body;
  const ms = options.timeout || 12000;
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  if (controller) init.signal = controller.signal;
  const timer = setTimeout(() => {
    if (controller) controller.abort();
  }, ms);
  try {
    return await fetch(url, init);
  } finally {
    clearTimeout(timer);
  }
}

const pageCache = new Map();

async function page(path) {
  const url = path.indexOf("http") === 0 ? path : BASE + path;
  const cached = pageCache.get(url);
  if (cached && Date.now() - cached.at < 60 * 1000) return cached.html;
  const res = await request(url);
  if (res.status >= 400) throw fail("unavailable", res.status + " " + url);
  const html = await res.text();
  pageCache.set(url, { at: Date.now(), html: html });
  return html;
}

/* ------------------------------------------------------------------ */
/* Parsing                                                             */
/* ------------------------------------------------------------------ */

function decode(text) {
  return String(text)
    .replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
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

function plain(text) {
  return decode(String(text).replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function absolute(url) {
  if (!url) return "";
  const text = decode(url).trim();
  if (text.indexOf("//") === 0) return "https:" + text;
  if (text.indexOf("/") === 0) return BASE + text;
  return text.replace(/^http:\/\//i, "https://");
}

/* Cards are <li><a href="/song/<id>.html"> cover, h3 name, p singer, date. */
function cards(html) {
  const items = [];
  const itemRe = /<li>\s*<a href="\/song\/(\d+)\.html"[^>]*>([\s\S]*?)<\/a>\s*<\/li>/gi;
  let match;
  while ((match = itemRe.exec(html))) {
    const id = match[1];
    const body = match[2];
    const title = plain((/<h3[^>]*>([\s\S]*?)<\/h3>/i.exec(body) || [])[1] || "");
    const singer = plain((/<p[^>]*>([\s\S]*?)<\/p>/i.exec(body) || [])[1] || "");
    if (!title) continue;
    const cover = absolute(((/<img[^>]+src="([^"]+)"/i.exec(body) || [])[1] || "").replace(/&amp;/g, "&"));
    const date = plain((/<div class="date">([\s\S]*?)<\/div>/i.exec(body) || [])[1] || "");
    const item = { id: id, name: title, imageUrl: cover, subtitle: singer, date: date };
    if (singer) item.artists = [{ name: singer }];
    items.push(item);
  }
  return items;
}

function toTrack(item) {
  const track = { id: item.id, name: item.name };
  if (item.artists) track.artists = item.artists;
  if (item.imageUrl) track.imageUrl = item.imageUrl;
  return track;
}

function toAlbum(item) {
  return { id: item.id, name: item.name, imageUrl: item.imageUrl, artists: item.artists };
}

function hotWords(html) {
  const words = [];
  const re = /<li>\s*<a href="\/search\.html\?keyword=[^"]*"><i>\d+<\/i>([^<]+)<\/a>/g;
  let match;
  while ((match = re.exec(html))) words.push(plain(match[1]));
  return words;
}

/* ------------------------------------------------------------------ */
/* Song page                                                           */
/* ------------------------------------------------------------------ */

function songPage(html, id) {
  const title = plain((/<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html) || [])[1] || "");
  if (!title) return null;

  const singerMatch = /歌手[：:]\s*<a[^>]*>([^<]+)<\/a>/i.exec(html);
  const singer = singerMatch ? plain(singerMatch[1]) : "";
  const cover = absolute(((/<div class="pic"><img[^>]+src="([^"]+)"/i.exec(html) || [])[1] || ""));
  const dateMatch = /<div class="c flex">[\s\S]*?<p>\s*(\d{4}-\d{1,2}-\d{1,2})\s*<\/p>/i.exec(html);
  const date = dateMatch ? dateMatch[1] : "";
  const hasPlayer = /<audio id="audioTag"/i.test(html);

  let lyrics = "";
  const lyricsBox = /<div class="lyrics">([\s\S]*?)<\/div>/i.exec(html);
  if (lyricsBox) {
    const lines = [];
    const re = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let match;
    while ((match = re.exec(lyricsBox[1]))) {
      const line = plain(match[1]);
      if (line) lines.push(line);
    }
    lyrics = lines.join("\n");
  }

  const related = cards((/<div class="list">[\s\S]*$/i.exec(html) || [""])[0]);

  return {
    id: id,
    title: title,
    singer: singer,
    cover: cover,
    date: date,
    hasPlayer: hasPlayer,
    lyrics: lyrics,
    related: related.filter((item) => item.id !== id),
  };
}

const songCache = new Map();

async function song(id) {
  const cached = songCache.get(id);
  if (cached && Date.now() - cached.at < 10 * 60 * 1000) return cached.data;
  const html = await page("/song/" + id + ".html");
  const data = songPage(html, id);
  if (!data) throw fail("unavailable", t("没有这个页面"));
  songCache.set(id, { at: Date.now(), data: data });
  return data;
}

function trackOf(info) {
  const track = { id: info.id, name: info.title, album: { id: info.id, name: info.title } };
  if (info.singer) track.artists = [{ name: info.singer }];
  if (info.cover) track.imageUrl = info.cover;
  return track;
}

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */
async function home() {
  let html = "";
  try {
    html = await page("/index.html");
  } catch (error) {
    console.log("[flmp3] home failed: " + (error && error.message));
  }

  const sections = [];
  const latest = cards(html);
  if (latest.length) {
    remember(latest.map(toTrack));
    sections.push({
      title: "最新音乐",
      subtitle: "刚上传的歌",
      tracks: latest.map(toTrack).slice(0, 20),
    });
  }

  try {
    const collections = cards(await page("/heji.html"));
    if (collections.length) {
      sections.push({
        title: "音乐合集",
        subtitle: "整张专辑与精选集",
        albums: collections.map(toAlbum).slice(0, 12),
        morePage: "collections",
      });
    }
  } catch (error) {
    console.log("[flmp3] collections failed: " + (error && error.message));
  }

  const links = [
    { title: "全部歌曲", page: "songs" },
    { title: "音乐合集", page: "collections" },
  ];
  const hot = hotWords(html);
  if (hot.length) {
    for (const word of hot.slice(0, 8)) links.push({ title: "热搜 · " + word, page: "search/" + word });
  }
  sections.push({ title: "更多", links: links });

  return { title: "凤梨音乐", subtitle: "无损音乐 · 在线试听", sections: sections };
}

/* ------------------------------------------------------------------ */
/* Browse pages                                                        */
/* ------------------------------------------------------------------ */

function pageNumber(parts, index) {
  const n = parseInt(parts[index] || "1", 10);
  return n > 0 ? n : 1;
}
async function browse({ page: pageId }) {
  const parts = String(pageId || "").split("/");
  const head = parts[0];

  if (head === "songs") {
    const n = pageNumber(parts, 1);
    const html = await page("/song.html?page=" + n);
    const items = cards(html);
    remember(items.map(toTrack));
    let more = false;
    try {
      more = cards(await page("/song.html?page=" + (n + 1))).length > 0;
    } catch (error) {
      more = false;
    }
    return {
      title: "全部歌曲",
      subtitle: "第 " + n + " 页",
      sections: [{ title: "全部歌曲", tracks: items.map(toTrack), morePage: more ? "songs/" + (n + 1) : "" }],
    };
  }

  if (head === "collections") {
    const n = pageNumber(parts, 1);
    const html = await page("/heji.html?page=" + n);
    const items = cards(html);
    return {
      title: "音乐合集",
      subtitle: "第 " + n + " 页",
      sections: [{ title: "音乐合集", albums: items.map(toAlbum) }],
    };
  }

  if (head === "search") {
    const keyword = parts.slice(1).join("/");
    const html = await page("/search.html?keyword=" + encodeURIComponent(keyword));
    const items = cards(html);
    return {
      title: "搜索 · " + keyword,
      sections: items.length
        ? [{ title: "找到 " + items.length + " 首", tracks: items.map(toTrack) }]
        : [{ title: "搜索 · " + keyword, empty: "没有找到相关歌曲" }],
    };
  }

  throw fail("unavailable", t("没有这个页面"));
}

/* ------------------------------------------------------------------ */
/* Search                                                              */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 12;
async function search({ query, kind, offset }) {
  const keyword = String(query || "").trim();
  if (!keyword) return { tracks: [], more: false };

  const start = Math.max(0, parseInt(offset || 0, 10) || 0);
  const first = Math.floor(start / PAGE_SIZE) + 1;
  const skip = start % PAGE_SIZE;

  const items = [];
  let pageNo = first;
  let guard = 0;
  while (items.length < PAGE_SIZE && guard < 3) {
    let html = "";
    try {
      html = await page("/search.html?keyword=" + encodeURIComponent(keyword) + "&page=" + pageNo);
    } catch (error) {
      break;
    }
    const found = cards(html);
    if (!found.length) {
      guard = 3;
      break;
    }
    for (const item of found.slice(skip)) items.push(item);
    pageNo += 1;
    guard += 1;
  }

  const sliced = items.slice(0, PAGE_SIZE);
  remember(sliced.map(toTrack));
  let more = items.length > sliced.length;
  if (!more && sliced.length === PAGE_SIZE) {
    try {
      more = cards(await page("/search.html?keyword=" + encodeURIComponent(keyword) + "&page=" + pageNo)).length > 0;
    } catch (error) {
      more = false;
    }
  }
  if (kind === "albums") {
    return { albums: sliced.map(toAlbum), more: more };
  }
  if (kind === "artists") {
    const map = new Map();
    for (const item of sliced) {
      const name = (item.artists && item.artists[0] && item.artists[0].name) || "";
      if (!name) continue;
      const key = "n:" + name;
      if (!map.has(key)) map.set(key, { id: key, name: name, imageUrl: item.imageUrl });
    }
    return { artists: Array.from(map.values()), more: false };
  }
  return { tracks: sliced.map(toTrack), more: more };
}
async function suggest({ query }) {
  const keyword = String(query || "").trim();
  let html = "";
  try {
    html = await page("/index.html");
  } catch (error) {
    return [];
  }
  const hot = hotWords(html);
  if (!keyword) return hot.slice(0, 8);
  const lower = keyword.toLowerCase();
  const hits = hot.filter((word) => word.toLowerCase().indexOf(lower) >= 0);
  if (hits.length) return hits.slice(0, 8);
  try {
    const items = cards(await page("/search.html?keyword=" + encodeURIComponent(keyword)));
    return items.slice(0, 8).map((item) => item.name);
  } catch (error) {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Album (a collection page) and artist                                */
/* ------------------------------------------------------------------ */
async function album({ id }) {
  const info = await song(String(id));

  if (info.hasPlayer) {
    return {
      album: {
        id: info.id,
        name: info.title,
        imageUrl: info.cover,
        artists: info.singer ? [{ name: info.singer }] : undefined,
        description: info.singer || "",
      },
      tracks: [trackOf(info)],
    };
  }

  /* A collection gathers songs into an archive on a net disk: the page lists
     the titles it holds but has no player of its own, so there is nothing to
     hand the queue. Its description says so instead of leaving an empty page. */
  const names = [];
  for (const line of String(info.lyrics || "").split("\n")) {
    const found = /^\s*\d{1,3}\s*[.、]?\s*(\S.*)$/.exec(line);
    if (found) names.push(found[1].trim());
  }
  const note = names.length
    ? "合集 · 共 " + names.length + " 首，站点只提供打包下载，没有单曲播放\n" + names.slice(0, 20).join("、")
    : "合集，站点只提供打包下载，没有单曲播放";

  return {
    album: {
      id: info.id,
      name: info.title,
      imageUrl: info.cover,
      artists: info.singer ? [{ name: info.singer }] : undefined,
      description: note,
    },
    tracks: [],
  };
}
async function artist({ id }) {
  const key = String(id || "");
  const name = key.indexOf("n:") === 0 ? key.slice(2) : key;
  const items = cards(await page("/search.html?keyword=" + encodeURIComponent(name)));
  const tracks = items
    .filter((item) => {
      const singer = (item.artists && item.artists[0] && item.artists[0].name) || "";
      return !name || singer.indexOf(name) >= 0 || item.name.indexOf(name) >= 0;
    })
    .map(toTrack);
  return {
    artist: { id: key, name: name, imageUrl: items.length ? items[0].imageUrl : "" },
    tracks: tracks.slice(0, 30),
    albums: [],
  };
}

/* ------------------------------------------------------------------ */
/* Play, lyric and the library kept on this device                     */
/* ------------------------------------------------------------------ */

const TYPES = {
  mp3: "mp3",
  m4a: "m4a",
  aac: "aac",
  flac: "flac",
  ogg: "ogg",
  wav: "wav",
};

const urlCache = new Map();

async function playUrl(id) {
  const cached = urlCache.get(id);
  if (cached && Date.now() - cached.at < 5 * 60 * 1000) return cached.url;
  const res = await request("/api/playurl.php?id=" + encodeURIComponent(id), {
    timeout: 15000,
    headers: { referer: BASE + "/song/" + id + ".html", accept: "*/*" },
  });
  const body = (await res.text()).trim();
  if (!/^https?:\/\/\S+$/i.test(body)) {
    throw fail("unavailable", t("这首是合集，没有可以单独播放的音频"));
  }
  urlCache.set(id, { at: Date.now(), url: body });
  return body;
}
async function stream({ id }) {
  const url = await playUrl(String(id));
  const ext = (url.split("?")[0].match(/\.([a-z0-9]+)$/i) || [])[1] || "mp3";
  const type = TYPES[ext.toLowerCase()] || "mp3";
  return { url: url, type: type };
}
async function lyrics({ id }) {
  const info = await song(String(id));
  if (!info.lyrics) return { lrc: "" };
  return { lrc: info.lyrics };
}

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
return { home, browse, search, suggest, album, artist, stream, lyrics, played, recent, like, liked, isLiked };
})(__mfRuntime.host, __mfRuntime.fetch, __mfRuntime.TextDecoder, __mfRuntime.atob, __mfRuntime.btoa, __mfRuntime.URL, __mfRuntime.URLSearchParams);
module.exports = __mfRuntime.makePlugin(__mfPlugin, {"id": "flmp3-music", "name": "凤梨音乐", "version": "1.0.0", "site": "www.flmp3.pro", "searchTypes": ["music", "album", "artist"]});
