// 显示名：九天音乐（nine-sky）
// MusicFree plugin generated from MyGo Music plugin; source site: www.9sky.com
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
// 显示名：九天音乐（nine-sky）
// 九天音乐（9sky.com）插件
// 站点是老的 server-rendered 页面：搜索走 new.9sky.com 的 h5 接口，单曲信息与音频地址
// 藏在 /music?ids= 返回的 `var lists = formatSong([...])` 里，唱片页是 `var list = [...]`。

const WEB = "http://www.9sky.com"
const SEARCH_API = "http://new.9sky.com/api/h5/web/music/search"
const MEDIA = "http://sp.9sky.com"
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"

const t = (s) => (typeof host !== "undefined" && host.t ? host.t(s) : s)

class PluginError extends Error {
  constructor(code, message) {
    super(message || code)
    this.code = code
  }
}

async function getText(url) {
  const res = await fetch(url, { headers: { "user-agent": UA, referer: WEB + "/" } })
  if (!res.ok) throw new PluginError("response", `九天音乐返回 ${res.status}`)
  return res.text()
}

async function getJSON(url) {
  const res = await fetch(url, { headers: { "user-agent": UA, referer: WEB + "/" } })
  if (!res.ok) throw new PluginError("response", `九天音乐返回 ${res.status}`)
  return res.json()
}

/* ---------- 解析 ---------- */

function unescapeJS(s) {
  return s
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\")
}

// 把 `[{...},{...}]` 这种 JS 字面量拆成对象数组（不带引号的值也认）
function splitObjects(body) {
  const out = []
  let depth = 0
  let start = -1
  let quote = ""
  for (let i = 0; i < body.length; i++) {
    const ch = body[i]
    if (quote) {
      if (ch === "\\") i++
      else if (ch === quote) quote = ""
      continue
    }
    if (ch === "'" || ch === '"') { quote = ch; continue }
    if (ch === "{") {
      if (depth === 0) start = i
      depth++
    } else if (ch === "}") {
      depth--
      if (depth === 0 && start >= 0) {
        out.push(body.slice(start, i + 1))
        start = -1
      }
    }
  }
  return out
}

function fields(obj) {
  const map = {}
  // 键可能带引号（'songUrl':），值可能是 '...' / "..." / 数字 / null
  const re = /(?:'((?:\\.|[^'])*)'|"((?:\\.|[^"])*)"|([A-Za-z_][A-Za-z0-9_]*))\s*:\s*(?:'((?:\\.|[^'])*)'|"((?:\\.|[^"])*)"|(null|true|false|-?\d+(?:\.\d+)?))/g
  let m
  while ((m = re.exec(obj))) {
    const key = m[1] !== undefined ? unescapeJS(m[1]) : m[2] !== undefined ? unescapeJS(m[2]) : m[3]
    const val = m[4] !== undefined ? unescapeJS(m[4]) : m[5] !== undefined ? unescapeJS(m[5]) : m[6]
    map[key] = val === "null" ? null : val === "true" ? true : val === "false" ? false : val
  }
  return map
}

// marker 形如 `var lists = formatSong(` 或 `var list = `
function objectsIn(html, marker) {
  const at = html.indexOf(marker)
  if (at < 0) return []
  const start = html.indexOf("[", at)
  if (start < 0) return []
  const end = html.indexOf("];", start)
  const body = html.slice(start + 1, end < 0 ? undefined : end)
  return splitObjects(body).map(fields)
}

function msOf(text) {
  if (!text || typeof text !== "string") return 0
  const parts = text.split(":").map(Number)
  if (parts.some((n) => !Number.isFinite(n))) return 0
  if (parts.length === 2) return (parts[0] * 60 + parts[1]) * 1000
  if (parts.length === 3) return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000
  return 0
}

function absMedia(url) {
  if (!url) return ""
  if (/^https?:/.test(url)) return url
  if (url.startsWith("//")) return "http:" + url
  return MEDIA + "/" + url.replace(/^\//, "")
}

function artistOf(name, id) {
  const clean = String(name || "").replace(/^\s*\|\s*/, "").trim()
  if (!clean) return []
  // 「群星 / 某某」这类用斜杠并列的，拆成多个
  return clean.split(/\s*[\/、,，]\s*/).filter(Boolean).map((n, i) => ({
    id: i === 0 && id ? String(id) : "",
    name: n,
  }))
}

function trackOf(o, extra = {}) {
  const id = String(o.id ?? o.songId ?? o.song_id ?? "")
  return {
    id,
    name: String(o.songName ?? o.song_name ?? o.name ?? ""),
    artists: artistOf(o.musician ?? o.musicianName ?? o.musician_name ?? o.misicianName, o.musicianId ?? o.misicianId ?? o.user_id),
    album: {
      id: String(o.discId ?? extra.albumId ?? ""),
      name: String(extra.albumName ?? ""),
      imageUrl: absMedia(o.discCoverUrl || extra.cover || ""),
    },
    duration: msOf(o.duration),
  }
}

function songCandidates(html) {
  const a = objectsIn(html, "var lists = formatSong(")
  return a.length ? a : objectsIn(html, "var list = ")
}

/* ---------- 批量取详情 ---------- */

// /music?ids=1,2,3 一次能拿多首，曲目页里带 discCoverUrl / duration / songUrl
async function detailsFor(ids) {
  const wanted = ids.map(String).filter(Boolean)
  if (!wanted.length) return new Map()
  const html = await getText(`${WEB}/music?ids=${wanted.map(encodeURIComponent).join(",")}`)
  const songs = objectsIn(html, "var lists = formatSong(")
  const map = new Map()
  for (const s of songs) {
    const id = String(s.id || "")
    if (!id) continue
    map.set(id, {
      id,
      name: String(s.songName || ""),
      artist: String(s.musician || ""),
      artistId: String(s.musicianId || ""),
      albumId: String(s.discId || ""),
      cover: absMedia(s.discCoverUrl || ""),
      duration: msOf(s.duration),
      url: absMedia(s.songUrl || ""),
    })
  }
  return map
}

/** 把一批 Track 用详情补齐封面/时长（失败就算了，别让首页整页挂掉） */
async function withDetails(tracks) {
  if (!tracks.length) return tracks
  try {
    const map = await detailsFor(tracks.map((x) => x.id))
    return tracks.map((t) => {
      const d = map.get(t.id)
      if (!d) return t
      return {
        ...t,
        name: t.name || d.name,
        artists: t.artists?.length ? t.artists : artistOf(d.artist, d.artistId),
        album: {
          id: d.albumId || t.album?.id || "",
          name: t.album?.name || "",
          imageUrl: t.album?.imageUrl || d.cover || "",
        },
        duration: t.duration || d.duration,
      }
    })
  } catch {
    return tracks
  }
}

/* ---------- 歌曲详情缓存 ---------- */

const songCache = new Map()

async function songDetail(id) {
  id = String(id)
  if (songCache.has(id)) return songCache.get(id)
  const html = await getText(`${WEB}/music?ids=${encodeURIComponent(id)}`)
  const songs = objectsIn(html, "var lists = formatSong(")
  const hit = songs.find((s) => String(s.id) === id) || songs[0]
  if (!hit) throw new PluginError("unavailable", t("这首歌在九天音乐上找不到了"))
  const detail = {
    id,
    name: String(hit.songName || ""),
    artist: String(hit.musician || ""),
    artistId: String(hit.musicianId || ""),
    albumId: String(hit.discId || ""),
    cover: absMedia(hit.discCoverUrl || ""),
    duration: msOf(hit.duration),
    url: absMedia(hit.songUrl || ""),
  }
  songCache.set(id, detail)
  return detail
}

/* ---------- 搜索 ---------- */
async function search({ query, kind, offset }) {
  if (offset > 0) return { [kind]: [], more: false }
  if (!query || !query.trim()) throw new PluginError("unsupported", t("请输入关键词"))
  const data = await getJSON(`${SEARCH_API}?content=${encodeURIComponent(query.trim())}`)
  const items = Array.isArray(data?.data) ? data.data : []

  if (kind === "tracks") {
    const tracks = items
      .filter((x) => x.type === "song")
      .map((x) => ({
        id: String(x.id),
        name: String(x.label || ""),
        artists: artistOf(x.musician),
        album: { id: "", name: "", imageUrl: "" },
        duration: 0,
      }))
    return { tracks: await withDetails(tracks), more: false }
  }
  if (kind === "albums") {
    const albums = items
      .filter((x) => x.type === "disc")
      .map((x) => ({
        id: String(x.id),
        name: String(x.label || ""),
        artists: artistOf(x.musician),
      }))
    return { albums, more: false }
  }
  if (kind === "artists") {
    const artists = items
      .filter((x) => x.type === "musician")
      .map((x) => ({ id: String(x.id), name: String(x.label || "") }))
    return { artists, more: false }
  }
  return { [kind]: [], more: false }
}

/* ---------- 首页 ---------- */

async function hotSongs() {
  const data = await getJSON(`${WEB}/main/listening/index`)
  const list = data?.data?.list || []
  const tracks = list.map((x) =>
    trackOf({
      songId: x.songId,
      songName: x.songName,
      musicianName: x.musicianName,
      musicianId: x.musicianId,
      songUrl: x.songUrl,
    })
  )
  return withDetails(tracks)
}

async function recommendDiscs() {
  const data = await getJSON(`${WEB}/main/recommend/list`)
  const list = data?.data?.free_disclist || []
  return list.map((x) => ({
    id: String(x.disc_id),
    name: String(x.disc_name || ""),
    imageUrl: absMedia(x.disc_img_url || ""),
    artists: artistOf(x.musician_name, x.musician_id),
  }))
}

async function charts() {
  const data = await getJSON(`${WEB}/main/top/disc/list`)
  return (data?.data?.list || []).map((c) => ({
    id: String(c.sort),
    name: String(c.top || ""),
    songs: (c.list || []).map((s) => ({
      id: String(s.song_id),
      name: String(s.song_name || ""),
      artists: artistOf(s.musician_name, s.user_id),
      album: { id: String(s.user_id || ""), name: "", imageUrl: absMedia(s.song_img_url || "") },
      duration: 0,
    })),
  }))
}
async function home() {
  const [hot, discs, boards] = await Promise.all([hotSongs(), recommendDiscs(), charts()])
  return {
    title: t("九天音乐"),
    subtitle: t("免费高品质原创音乐"),
    sections: [
      {
        title: t("正在热听"),
        subtitle: t("大家最近在听的"),
        tracks: hot,
        morePage: "charts",
      },
      { title: t("推荐唱片"), albums: discs },
      {
        title: t("排行榜"),
        links: boards.map((b) => ({ title: b.name, subtitle: `${b.songs.length} 首`, page: `chart:${b.id}` })),
      },
    ],
  }
}
async function browse({ page }) {
  if (page === "charts" || page === "" || page == null) {
    const boards = await charts()
    return {
      title: t("排行榜"),
      sections: boards.map((b) => ({ title: b.name, tracks: b.songs, pageTitle: b.name })),
    }
  }
  const m = /^chart:(\d+)$/.exec(page)
  if (m) {
    const boards = await charts()
    const board = boards.find((b) => b.id === m[1])
    if (!board) throw new PluginError("unavailable", t("没有这个榜单"))
    return { title: board.name, sections: [{ tracks: board.songs }] }
  }
  throw new PluginError("unsupported", t("没有这一页"))
}

/* ---------- 唱片 / 音乐人 ---------- */

function discMeta(html) {
  const name = (html.match(/class="album_name">([^<]*)</) || [])[1] || (html.match(/<title>([^<|]*)/) || [])[1] || ""
  const cover = (html.match(/src="(http:\/\/sp\.9sky\.com\/disc\/cover\/[^"?]+)/) || [])[1] || ""
  // 唱片页的音乐人是 <a href="/musician/detail?id=…"><img …/><i>名字</i></a>
  const musician = (html.match(/musician\/detail\?id=(\d+)"[^>]*>(?:[\s\S]{0,200}?<i>([^<]*)<\/i>|([^<]*)<\/a>)/) || [])
  return {
    name: name.trim(),
    cover,
    artistId: musician[1] || "",
    artistName: (musician[2] || musician[3] || "").trim(),
  }
}
async function album({ id }) {
  const html = await getText(`${WEB}/disc/detail?id=${encodeURIComponent(id)}`)
  const meta = discMeta(html)
  const songs = objectsIn(html, "var list = ")
  if (!meta.name && !songs.length) throw new PluginError("unavailable", t("这张唱片在九天音乐上找不到了"))
  const albumInfo = {
    id: String(id),
    name: meta.name,
    imageUrl: absMedia(meta.cover),
    artists: artistOf(meta.artistName, meta.artistId),
  }
  const tracks = songs.map((s) =>
    trackOf(s, { albumId: String(id), albumName: meta.name, cover: meta.cover })
  )
  return { album: albumInfo, tracks }
}
async function artist({ id }) {
  const html = await getText(`${WEB}/musician/detail?id=${encodeURIComponent(id)}`)
  const name = (html.match(/class="ian_name">([^<]*)</) || [])[1] || ""
  if (!name) throw new PluginError("unavailable", t("这位音乐人在九天音乐上找不到了"))
  const image = (html.match(/src="(http:\/\/sp\.9sky\.com\/musician\/poster\/[^"]+)"/) || [])[1] || ""
  const albums = []
  const re = /href="\/disc\/detail\?id=(\d+)">\s*<img[^>]*src="([^"]+)"\s*\/>\s*<span>([^<]*)<\/span>/g
  let m
  while ((m = re.exec(html))) {
    albums.push({
      id: m[1],
      name: m[3],
      imageUrl: absMedia(m[2]),
      artists: [{ id: String(id), name }],
    })
  }
  return {
    artist: { id: String(id), name, imageUrl: absMedia(image) },
    tracks: [],
    albums,
  }
}

/* ---------- 电台式榜单 ---------- */
async function stations() {
  const boards = await charts()
  return boards.map((b) => ({
    id: `chart:${b.id}`,
    name: b.name,
    description: t("九天音乐排行榜，持续播放"),
    imageUrl: b.songs[0]?.album?.imageUrl || "",
  }))
}

const served = new Set()
async function stationNext({ id }) {
  const m = /^chart:(\d+)$/.exec(String(id || ""))
  if (!m) throw new PluginError("unsupported", t("不支持的榜单"))
  if (served.has(m[1])) return []
  served.add(m[1])
  const boards = await charts()
  const board = boards.find((b) => b.id === m[1])
  return board ? withDetails(board.songs) : []
}

/* ---------- 歌词 / 播放 ---------- */
async function lyrics({ id }) {
  const data = await getJSON(`${WEB}/main/musician/song/lyric?id=${encodeURIComponent(id)}`)
  const lrc = (data?.data?.lyric || "").trim()
  if (!lrc) throw new PluginError("unavailable", t("这首歌没有歌词"))
  return { lrc }
}
async function stream({ id, quality }) {
  const detail = await songDetail(id)
  if (!detail.url) throw new PluginError("unavailable", t("这首歌在九天音乐上没有试听地址"))
  return { url: detail.url, type: "mp3", quality }
}
return { search, home, browse, album, artist, stations, stationNext, lyrics, stream };
})(__mfRuntime.host, __mfRuntime.fetch, __mfRuntime.TextDecoder, __mfRuntime.atob, __mfRuntime.btoa, __mfRuntime.URL, __mfRuntime.URLSearchParams);
module.exports = __mfRuntime.makePlugin(__mfPlugin, {"id": "nine-sky", "name": "九天音乐", "version": "1.0.1", "site": "www.9sky.com", "searchTypes": ["music", "album", "artist"]});
