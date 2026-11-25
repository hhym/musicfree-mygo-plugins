// 显示名：闪闪音乐（33ve）
// MusicFree plugin generated from MyGo Music plugin; source site: www.33ve.com
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
// 闪闪音乐网（33ve.com）— MyGo Music 插件
//
// 站点本身没有公开 API，插件的做法是读它的网页列表（搜索页 /so.php、榜单页、
// 专辑页、歌手页、歌单页），音频和歌词则来自播放接口 /style/js/play.php。
//
// 站点的网页有一道人机验证（勾选“我不是人机”），验证状态跟会话 Cookie 绑定。
// 插件的 fetch 不会自动保存 Cookie，所以这里自己记 PHPSESSID 和
// server_name_session：遇到验证页就取出 csrf_token 提交一次，再带着同一组
// Cookie 重新请求。验证状态站点声称保持 1 小时。

const BASE = "https://www.33ve.com";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const PAGE_TTL = 2 * 60 * 1000; // 网页缓存的存活时间
const SEARCH_PAGE_SIZE = 30; // 搜索结果每页 30 首
const PLAYLIST_PAGE_SIZE = 10; // 歌单每页 10 首

const t = (text) => host.t(text);
const CHECK_FAILED =
  "闪闪音乐网的人机验证没通过。请先在浏览器打开 www.33ve.com 勾选“我不是人机”，或在插件设置里粘贴浏览器的 Cookie。";

// An error with one of the codes the app knows: signIn, setup, unavailable,
// unsupported. Anything else shows its message.
function fail(code, message) {
  const error = new Error(message || code);
  error.code = code;
  return error;
}

// ---------------------------------------------------------------------------
// Storage

function stored(key, fallback) {
  const value = host.storage.get(key);
  return value === undefined || value === null ? fallback : value;
}

function keep(key, value) {
  host.storage.set(key, value);
}

// The site's HTML pages and the audio API, with the session cookie the robot
// check leaves behind.

let cookie = stored("cookie", "");

function manualCookie() {
  try {
    return ((host.setting && host.setting("cookie")) || "").trim();
  } catch (error) {
    return "";
  }
}

function mergeSetCookie(header) {
  if (!header) return;
  const jar = {};
  for (const piece of cookie.split("; ")) {
    const i = piece.indexOf("=");
    if (i > 0) jar[piece.slice(0, i)] = piece.slice(i + 1);
  }
  // "PHPSESSID=a; path=/, server_name_session=b; Max-Age=..." — split only
  // before a name, so a date's comma stays where it is.
  for (const piece of header.split(/,\s*(?=[^;,=\s]+=)/)) {
    const pair = piece.split(";")[0].trim();
    const i = pair.indexOf("=");
    if (i > 0) jar[pair.slice(0, i).trim()] = pair.slice(i + 1).trim();
  }
  cookie = Object.entries(jar)
    .filter(([name, value]) => name && value)
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
  keep("cookie", cookie);
}

async function send(url, { method = "GET", body, headers = {} } = {}) {
  const outgoing = {
    "user-agent": UA,
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.6",
    referer: `${BASE}/`,
    ...headers,
  };
  const session = manualCookie() || cookie;
  if (session) outgoing.cookie = session;
  const response = await fetch(url, { method, body, headers: outgoing });
  if (!manualCookie()) {
    let header = "";
    try {
      header = response.headers.get("set-cookie") || "";
    } catch (error) {
      header = "";
    }
    mergeSetCookie(header);
  }
  return response;
}

function isCheck(html) {
  return html.includes("human_check") || html.includes("安全验证");
}

async function read(url, options) {
  let response;
  try {
    response = await send(url, options);
  } catch (error) {
    throw new Error(`连不上闪闪音乐网：${error && error.message ? error.message : error}`);
  }
  return response.text();
}

async function passCheck(url, html) {
  const match = html.match(/name="csrf_token" value="([^"]+)"/);
  if (!match) return false;
  // No Referer here: the site's check refuses a form post that carries one.
  await read(url, {
    method: "POST",
    body: `csrf_token=${encodeURIComponent(match[1])}&human_check=on`,
    headers: { "content-type": "application/x-www-form-urlencoded" },
  });
  return true;
}

const pageCache = new Map();

async function pageHtml(path) {
  const url = path.startsWith("http") ? path : BASE + path;
  const cached = pageCache.get(url);
  if (cached && Date.now() - cached.at < PAGE_TTL) return cached.html;

  let html = await read(url);
  // 站点先用一个 110 字节的 JS 跳转壳下发 Cookie，再给“安全验证”页，
  // 通过后才返回正文。多请求几次，按响应逐步推进。
  for (let attempt = 0; attempt < 6; attempt++) {
    if (isCheck(html)) {
      if (!(await passCheck(url, html))) {
        html = await read(url);
        continue;
      }
      html = await read(url);
      continue;
    }
    if (html.length >= 1000 || html.includes("推荐音乐") || html.includes("热门歌单")) break;
    html = await read(url);
  }
  if (isCheck(html)) throw fail("setup", CHECK_FAILED);
  if (html.length < 1000) throw fail("unavailable", "闪闪音乐网没有返回页面内容，请稍后重试");

  pageCache.set(url, { html, at: Date.now() });
  if (pageCache.size > 80) {
    const oldest = [...pageCache.entries()].sort((a, b) => a[1].at - b[1].at)[0];
    if (oldest) pageCache.delete(oldest[0]);
  }
  return html;
}

// ---------------------------------------------------------------------------
// Reading HTML without a DOM

function unescapeHtml(text) {
  return text
    .replace(/&#x([0-9a-fA-F]+);/g, (m, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (m, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (m, name) => {
      switch (name) {
        case "amp":
          return "&";
        case "lt":
          return "<";
        case "gt":
          return ">";
        case "quot":
          return '"';
        case "apos":
          return "'";
        default:
          return " ";
      }
    });
}

function textOf(html) {
  return unescapeHtml(
    String(html)
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/[\s\u00a0]+/g, " ")
    .trim();
}

// A cover at the size the app shows it: its image servers make 120, 400 and
// 600 pixels across from the same path.
function sizedImage(url) {
  if (!url) return "";
  let out = String(url).split("?")[0].trim();
  if (out.startsWith("//")) out = "https:" + out;
  return out.replace(/\/(100|120|200|400|600)\//, "/{size}/");
}

function parseDuration(block) {
  const match = block.match(/class=["'](?:stime|playtime)["'][^>]*>\s*(\d{1,2}):(\d{2})/i);
  if (!match) return 0;
  return (Number(match[1]) * 60 + Number(match[2])) * 1000;
}

function blockList(html) {
  return String(html).split(/<li[\s>]/i).slice(1);
}

function blockOf(piece) {
  return piece.split(/<\/li>/i)[0];
}

// Each row of a song list: its /mp3/<hash>.html link, the cover in it, the
// time it runs, and "歌手 - 歌名" or the two apart.
function parseTracks(html, options = {}) {
  const list = [];
  const seen = new Set();
  for (const piece of blockList(html)) {
    const block = blockOf(piece);
    const hit = block.match(/\/mp3\/([0-9a-f]{32})\.html/i);
    if (!hit) continue;
    const id = hit[1].toLowerCase();
    if (seen.has(id)) continue;

    // The "mv" link nested in the title anchor would read as part of the title.
    const clean = block.replace(/<a[^>]*class=["']mv["'][^>]*>[\s\S]*?<\/a>/gi, "");
    const image = (block.match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] || "";
    const singerMatch = clean.match(/<a[^>]*class=["']singer["'][^>]*>([\s\S]*?)<\/a>/i);
    const singer = singerMatch ? textOf(singerMatch[1]) : "";
    const singerId = singerMatch
      ? (singerMatch[0].match(/\/singer\/(\d+)\//) || [])[1] || ""
      : "";
    const titleMatch =
      clean.match(/<a[^>]*class=["']url["'][^>]*>([\s\S]*?)<\/a>/i) ||
      clean.match(/<a[^>]*href=["']\/mp3\/[^"']+["'][^>]*>([\s\S]*?)<\/a>/i);
    let title = titleMatch ? textOf(titleMatch[1]) : "";
    let artist = singer;
    if (artist && title.startsWith(artist + " - ")) title = title.slice(artist.length + 3).trim();
    if (!artist) {
      const dash = title.indexOf(" - ");
      if (dash > 0) {
        artist = title.slice(0, dash).trim();
        title = title.slice(dash + 3).trim();
      }
    }
    if (!title) continue;

    const track = {
      id,
      name: title,
      artists: artist ? [{ id: singerId, name: artist }] : [],
      album: options.album || { id: "", name: "", imageUrl: sizedImage(image) },
      duration: parseDuration(block),
      url: `${BASE}/mp3/${id}.html`,
    };
    list.push(track);
    seen.add(id);
  }
  rememberTracks(list);
  return list;
}

function parsePlaylistCards(html) {
  const list = [];
  const seen = new Set();
  for (const piece of blockList(html)) {
    const block = blockOf(piece);
    const hit = block.match(/\/playlist\/(\d+)\.html/);
    if (!hit || seen.has(hit[1])) continue;
    const nameAnchor =
      block.match(/<div[^>]*class=["']name["'][^>]*>[\s\S]*?<a[^>]*title=["']([^"']*)["']/i) ||
      block.match(/<div[^>]*class=["']name["'][^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i);
    const name = nameAnchor ? textOf(nameAnchor[1]) : "";
    const image = (block.match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] || "";
    if (!name) continue;
    list.push({ id: hit[1], name, imageUrl: sizedImage(image) });
    seen.add(hit[1]);
  }
  return list;
}

function parseSingerCards(html) {
  const list = [];
  const seen = new Set();
  for (const piece of blockList(html)) {
    const block = blockOf(piece);
    const hit = block.match(/\/singer\/(\d+)\/1\.html/);
    if (!hit || seen.has(hit[1])) continue;
    const anchor =
      block.match(/<div[^>]*class=["']name["'][^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i) ||
      block.match(/<a[^>]*title=["']([^"']*)["'][^>]*>[\s\S]*?<\/a>/i);
    const name = anchor ? textOf(anchor[1]) : "";
    const image = (block.match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] || "";
    if (!name) continue;
    list.push({ id: hit[1], name, imageUrl: sizedImage(image) });
    seen.add(hit[1]);
  }
  return list;
}

function parseAlbumCards(html) {
  const list = [];
  const seen = new Set();
  for (const piece of blockList(html)) {
    const block = blockOf(piece);
    const hit = block.match(/\/album\/(\d+)\.html/);
    if (!hit || seen.has(hit[1])) continue;
    const anchor =
      block.match(/<a[^>]*title=["']([^"']*)["'][^>]*>[\s\S]*?<\/a>/i) ||
      block.match(/<div[^>]*class=["']name["'][^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i);
    const name = anchor ? textOf(anchor[1]) : "";
    const image = (block.match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] || "";
    if (!name) continue;
    list.push({ id: hit[1], name, imageUrl: sizedImage(image) });
    seen.add(hit[1]);
  }
  return list;
}

// The heading of an album, artist or playlist page: its name, picture and
// description, from the block above its songs.
function parseProfile(html) {
  const start = html.indexOf('class="singer_info"');
  const block = start < 0 ? html : html.slice(start, start + 1200);
  const heading = block.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const image = block.match(/<img[^>]+src=["']([^"']+)["']/i);
  let description = "";
  const info = block.match(/<div[^>]*class=["']info["'][^>]*>([\s\S]*?)<\/div>/i);
  if (info) description = textOf(info[1]);
  return {
    name: heading ? textOf(heading[1]) : "",
    imageUrl: sizedImage(image ? image[1] : ""),
    description,
  };
}

function parseTotal(html) {
  const match = html.match(/共有\s*<span>\s*(\d+)\s*<\/span>\s*(?:首|个)/);
  return match ? Number(match[1]) : 0;
}

// The part of a page under an <h1> such as 推荐音乐, up to its </ul>.
function sectionHtml(html, title) {
  const pattern = new RegExp("<h1[^>]*>[^<]*" + title + "[^<]*</h1>", "i");
  const heading = pattern.exec(html);
  if (!heading) return "";
  const start = html.indexOf("<ul", heading.index + heading[0].length);
  if (start < 0) return "";
  const end = html.indexOf("</ul>", start);
  return end < 0 ? "" : html.slice(start, end);
}

// ---------------------------------------------------------------------------
// What was parsed lately, so a song liked now can be listed later without
// asking the site again. Only likes, saved albums and history are written to
// storage; the rest stays in memory for the session.

const knownTracks = new Map();
const knownAlbums = new Map();

function rememberTracks(tracks) {
  for (const track of tracks || []) {
    if (track && track.id) knownTracks.set(track.id, track);
  }
}

function rememberAlbum(album) {
  if (album && album.id) knownAlbums.set(album.id, album);
}

function trackById(id) {
  return knownTracks.get(id) || stored("likedTracks", {})[id] || stored("historyTracks", {})[id] || null;
}

function albumById(id) {
  return knownAlbums.get(id) || stored("albumData", {})[id] || null;
}

// ---------------------------------------------------------------------------
// The site's shelves

const CHARTS = [
  { slug: "top", title: "TOP排行榜", path: (page) => (page === 1 ? "/list/top.html" : `/list/top/${page}.html`) },
  { slug: "ustop", title: "欧美榜单", path: (page) => (page === 1 ? "/list/ustop.html" : `/list/ustop/${page}.html`) },
  { slug: "ndtop", title: "内地榜单", path: (page) => (page === 1 ? "/list/ndtop.html" : `/list/ndtop/${page}.html`) },
  { slug: "love", title: "恋爱的歌", path: (page) => (page === 1 ? "/list/love.html" : `/list/love/${page}.html`) },
];

function chartOf(slug) {
  const chart = CHARTS.find((item) => item.slug === slug);
  if (!chart) throw fail("unavailable", "没有这个榜单");
  return chart;
}

function hasNextPage(html, page) {
  const next = page + 1;
  return new RegExp(`href=["'][^"']*\\/${next}\\.html["']`).test(html) || html.includes(`/${next}.html`);
}

function pageLinks(page, kind, slug) {
  const links = [];
  if (page > 1) {
    links.push({ title: t("Previous"), subtitle: `第 ${page - 1} 页`, page: `${kind}:${slug}:${page - 1}` });
  }
  return links;
}

async function chartBrowse(slug, page) {
  const chart = chartOf(slug);
  const html = await pageHtml(chart.path(page));
  const heading = html.match(/<div[^>]*class=["']play_list[^"']*["'][^>]*>[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const tracks = parseTracks(html);
  const sections = [{ title: heading ? textOf(heading[1]) : chart.title, tracks }];
  const links = pageLinks(page, "chart", slug);
  if (hasNextPage(html, page)) {
    links.push({ title: t("Next"), subtitle: `第 ${page + 1} 页`, page: `chart:${slug}:${page + 1}` });
  }
  if (links.length) sections.push({ title: t("Pages"), links });
  return {
    title: heading ? textOf(heading[1]) : chart.title,
    subtitle: `第 ${page} 页`,
    sections,
  };
}

async function playlistBrowse(slug, page) {
  const path =
    slug === "index"
      ? page === 1
        ? "/gdlist/index.html"
        : `/gdlist/index/${page}.html`
      : page === 1
        ? `/gdlist/${slug}.html`
        : `/gdlist/${slug}/${page}.html`;
  const html = await pageHtml(path);
  const heading = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const playlists = parsePlaylistCards(html);
  const sections = [{ title: heading ? textOf(heading[1]) : t("Playlists"), playlists }];
  const links = pageLinks(page, "gdlist", slug);
  if (hasNextPage(html, page)) {
    links.push({ title: t("Next"), subtitle: `第 ${page + 1} 页`, page: `gdlist:${slug}:${page + 1}` });
  }
  if (links.length) sections.push({ title: t("Pages"), links });
  return { title: heading ? textOf(heading[1]) : t("Playlists"), subtitle: `第 ${page} 页`, sections };
}

function gdlistCategories(html) {
  const list = [];
  const seen = new Set();
  const pattern = /<a[^>]*href=["']\/gdlist\/([a-z0-9]+)\.html["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const slug = match[1];
    const name = textOf(match[2]);
    if (!name || slug === "index" || seen.has(slug)) continue;
    seen.add(slug);
    list.push({ title: name, page: `gdlist:${slug}:1` });
  }
  return list;
}

// ---------------------------------------------------------------------------
// Exports
async function home() {
  const html = await pageHtml("/");
  const recommended = parseTracks(sectionHtml(html, "推荐音乐"));
  const listening = parseTracks(sectionHtml(html, "网友在听"));
  const playlists = parsePlaylistCards(sectionHtml(html, "热门歌单")).slice(0, 18);
  const artists = parseSingerCards(sectionHtml(html, "推荐歌手")).slice(0, 18);

  const sections = [];
  if (recommended.length) {
    sections.push({
      title: "推荐音乐",
      tracks: recommended.slice(0, 30),
      morePage: "recommend",
      pageTitle: "每日推荐",
      subtitle: "闪闪音乐网推荐，每天更新",
    });
  }
  if (listening.length) {
    sections.push({ title: "网友在听", tracks: listening.slice(0, 20), morePage: "listening" });
  }
  if (playlists.length) {
    sections.push({ title: "热门歌单", playlists, morePage: "playlists" });
  }
  if (artists.length) {
    sections.push({ title: "推荐歌手", artists, morePage: "singers:1" });
  }
  sections.push({
    title: t("Charts"),
    links: CHARTS.map((chart) => ({ title: chart.title, page: `chart:${chart.slug}:1` })),
  });

  return { title: "闪闪音乐", subtitle: "免费 MP3 歌曲试听", sections };
}
async function browse({ page }) {
  const chart = page.match(/^chart:([a-z]+):(\d+)$/);
  if (chart) return chartBrowse(chart[1], Number(chart[2]));
  const gdlist = page.match(/^gdlist:([a-z0-9]+):(\d+)$/);
  if (gdlist) return playlistBrowse(gdlist[1], Number(gdlist[2]));
  const singers = page.match(/^singers:(\d+)$/);
  if (singers) return singersBrowse(Number(singers[1]));
  if (page === "charts") return chartsOverview();
  if (page === "playlists") return playlistsOverview();
  if (page === "recommend" || page === "listening") return shelfPage(page);
  throw fail("unavailable", "没有这个页面");
}

async function chartsOverview() {
  const sections = [];
  for (const chart of CHARTS.slice(0, 3)) {
    try {
      const html = await pageHtml(chart.path(1));
      sections.push({
        title: chart.title,
        tracks: parseTracks(html).slice(0, 12),
        morePage: `chart:${chart.slug}:1`,
      });
    } catch (error) {
      // A chart that can't be read now shouldn't take the page with it.
    }
  }
  sections.push({
    title: "全部榜单",
    links: CHARTS.map((chart) => ({ title: chart.title, page: `chart:${chart.slug}:1` })),
  });
  return { title: t("Charts"), subtitle: "本站热门、欧美、内地等榜单", sections };
}

async function playlistsOverview() {
  const html = await pageHtml("/gdlist/index.html");
  const categories = gdlistCategories(html);
  const playlists = parsePlaylistCards(html).slice(0, 24);
  const sections = [];
  if (categories.length) sections.push({ title: t("Categories"), links: categories });
  sections.push({ title: "推荐歌单", playlists, morePage: "gdlist:index:1" });
  return { title: t("Playlists"), subtitle: "按主题整理的音乐歌单", sections };
}

async function singersBrowse(page) {
  const html = await pageHtml(page === 1 ? "/singers/index/index.html" : `/singers/index/index/${page}.html`);
  const artists = parseSingerCards(html);
  const sections = [{ title: "全部 歌手列表", artists }];
  const links = page > 1 ? [{ title: t("Previous"), subtitle: `第 ${page - 1} 页`, page: `singers:${page - 1}` }] : [];
  if (hasNextPage(html, page)) {
    links.push({ title: t("Next"), subtitle: `第 ${page + 1} 页`, page: `singers:${page + 1}` });
  }
  if (links.length) sections.push({ title: t("Pages"), links });
  return { title: t("Singers"), subtitle: `第 ${page} 页`, sections };
}

async function shelfPage(page) {
  const html = await pageHtml("/");
  if (page === "recommend") {
    return {
      title: "每日推荐",
      subtitle: "闪闪音乐网推荐，每天更新",
      sections: [{ title: "推荐音乐", tracks: parseTracks(sectionHtml(html, "推荐音乐")) }],
    };
  }
  return {
    title: "网友在听",
    sections: [{ title: "网友在听", tracks: parseTracks(sectionHtml(html, "网友在听")) }],
  };
}
async function search({ query, kind, offset = 0 }) {
  const wanted = kind || "tracks";
  if (wanted !== "tracks") return { [wanted]: [], more: false };
  const term = String(query || "").trim();
  if (!term) return { tracks: [], more: false };

  const page = Math.floor(offset / SEARCH_PAGE_SIZE) + 1;
  const html = await pageHtml(`/so.php?wd=${encodeURIComponent(term)}&page=${page}`);
  if (html.includes("没有找到该关键词")) return { tracks: [], more: false };

  const tracks = parseTracks(html);
  const total = parseTotal(html);
  const got = offset + tracks.length;
  return { tracks, more: total > 0 ? got < total : tracks.length >= SEARCH_PAGE_SIZE };
}
async function suggest({ query }) {
  const term = String(query || "").trim();
  if (!term) return [];
  const html = await pageHtml(`/so.php?wd=${encodeURIComponent(term)}&page=1`);
  if (html.includes("没有找到该关键词")) return [];
  const tracks = parseTracks(html);
  const out = [];
  for (const track of tracks) {
    const label = track.artists.length ? `${track.artists[0].name} - ${track.name}` : track.name;
    if (!out.includes(label)) out.push(label);
    if (out.length >= 10) break;
  }
  return out;
}
async function album({ id }) {
  const html = await pageHtml(`/album/${id}.html`);
  const profile = parseProfile(html);
  const saved = stored("savedAlbums", []).includes(id);
  const record = {
    id,
    name: profile.name,
    imageUrl: profile.imageUrl,
    released: "",
    saved,
  };
  const tracks = parseTracks(html, { album: record });
  rememberAlbum(record);
  return { album: record, tracks };
}
async function artist({ id }) {
  const html = await pageHtml(`/singer/${id}/1.html`);
  const profile = parseProfile(html);
  const all = parseTracks(sectionHtml(html, "最新歌曲") || html);
  const own = all.filter((track) => track.artists.some((artist) => artist.name === profile.name)).slice(0, 10);
  const tracks = own.length ? own : all;
  let albums = [];
  try {
    albums = parseAlbumCards(await pageHtml(`/singer/album/${id}.html`)).slice(0, 24);
  } catch (error) {
    albums = [];
  }
  const record = { id, name: profile.name || id, imageUrl: profile.imageUrl };
  return { artist: record, tracks, albums };
}
async function playlist({ id }) {
  const first = await pageHtml(`/playlist/${id}.html`);
  const profile = parseProfile(first);
  const total = parseTotal(first);
  const tracks = parseTracks(first);
  const pages = 1; // 站点的翻页链接指向第 1 页内容，详情页只取首屏 10 首
  for (let page = 2; page <= pages; page++) {
    try {
      tracks.push(...parseTracks(await pageHtml(`/playlist/${id}/${page}.html`)));
    } catch (error) {
      break;
    }
  }
  const unique = [];
  const seen = new Set();
  for (const track of tracks) {
    if (!seen.has(track.id)) {
      seen.add(track.id);
      unique.push(track);
    }
  }
  return {
    id,
    name: profile.name,
    imageUrl: profile.imageUrl,
    description: profile.description,
    trackCount: unique.length,
    tracks: unique,
  };
}
async function lyrics({ id }) {
  const data = await playData(id);
  let lrc = String(data.lrc || "");
  lrc = lrc
    .split("\n")
    .filter((line) => {
      const text = line.replace(/\[[^\]]*\]/g, "").trim();
      return text && !text.includes("闪闪音乐网") && !text.includes("33ve.com");
    })
    .join("\n")
    .trim();
  return lrc ? { lrc } : {};
}
async function stream({ id }) {
  const data = await playData(id);
  return { url: data.url, type: "mp3" };
}

// The site's own play API: POST id and type, answering the title, cover, audio
// URL and LRC. "dance" is what its song pages ask for; some tracks only answer
// another type, so try them in turn.
const playCache = new Map();

async function playData(id) {
  const cached = playCache.get(id);
  if (cached && Date.now() - cached.at < 3 * 60 * 1000) return cached.data;
  const types = ["dance", "mp3", "music", "song"];
  for (const type of types) {
    const body = `id=${encodeURIComponent(id)}&type=${type}`;
    let text = "";
    try {
      text = await read(`${BASE}/style/js/play.php`, {
        method: "POST",
        body,
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "x-requested-with": "XMLHttpRequest",
          referer: `${BASE}/mp3/${id}.html`,
        },
      });
    } catch (error) {
      continue;
    }
    try {
      const data = JSON.parse(text);
      if (data && data.url) {
        playCache.set(id, { data, at: Date.now() });
        if (playCache.size > 80) {
          const oldest = [...playCache.entries()].sort((a, b) => a[1].at - b[1].at)[0];
          if (oldest) playCache.delete(oldest[0]);
        }
        return data;
      }
    } catch (error) {
      // not JSON: the next type may be.
    }
  }
  throw fail("unavailable", "这首歌暂时没有可用的音频");
}

// ---------------------------------------------------------------------------
// The listener's own shelf: likes, saved albums and history, kept by the plugin
// itself, as the site has no accounts.
function like({ id, on }) {
  const ids = new Set(stored("liked", []));
  const kept = stored("likedTracks", {});
  if (on) {
    ids.add(id);
    const track = trackById(id);
    if (track) {
      kept[id] = track;
      keep("likedTracks", kept);
    }
  } else {
    ids.delete(id);
  }
  keep("liked", [...ids]);
  const objects = Object.keys(kept);
  if (objects.length > 300) {
    for (const key of objects) if (!ids.has(key)) delete kept[key];
    keep("likedTracks", kept);
  }
}
function isLiked({ ids }) {
  const liked = new Set(stored("liked", []));
  return Object.fromEntries(ids.map((id) => [id, liked.has(id)]));
}
function liked({ offset = 0 }) {
  const ids = stored("liked", []).slice().reverse();
  const objects = stored("likedTracks", {});
  const tracks = ids
    .map((id) => objects[id])
    .filter(Boolean)
    .slice(offset, offset + 60);
  return { tracks, more: ids.length > offset + 60 };
}
function saveAlbum({ id, on }) {
  const ids = new Set(stored("savedAlbums", []));
  const data = stored("albumData", {});
  if (on) {
    ids.add(id);
    const album = albumById(id);
    if (album) {
      data[id] = album;
      keep("albumData", data);
    }
  } else {
    ids.delete(id);
  }
  keep("savedAlbums", [...ids]);
}
function savedAlbums({ offset = 0 }) {
  const ids = stored("savedAlbums", []).slice().reverse();
  const data = stored("albumData", {});
  const albums = ids
    .map((id) => {
      const saved = data[id];
      return saved ? { ...saved, saved: true } : { id, name: id, imageUrl: "" };
    })
    .slice(offset, offset + 60);
  return { albums, more: ids.length > offset + 60 };
}
function played({ id }) {
  const history = stored("history", []).filter((entry) => entry !== id);
  history.push(id);
  keep("history", history.slice(-40));
  const track = knownTracks.get(id);
  if (track) {
    const data = stored("historyTracks", {});
    data[id] = track;
    const keepIds = new Set(history.slice(-40));
    for (const key of Object.keys(data)) if (!keepIds.has(key)) delete data[key];
    keep("historyTracks", data);
  }
}
function recent() {
  const ids = stored("history", []).slice().reverse();
  const data = stored("historyTracks", {});
  return ids
    .map((id) => data[id] || knownTracks.get(id))
    .filter(Boolean)
    .slice(0, 20);
}
return { home, browse, search, suggest, album, artist, playlist, lyrics, stream, like, isLiked, liked, saveAlbum, savedAlbums, played, recent };
})(__mfRuntime.host, __mfRuntime.fetch, __mfRuntime.TextDecoder, __mfRuntime.atob, __mfRuntime.btoa, __mfRuntime.URL, __mfRuntime.URLSearchParams);
module.exports = __mfRuntime.makePlugin(__mfPlugin, {"id": "33ve", "name": "闪闪音乐", "version": "1.0.0", "site": "www.33ve.com", "searchTypes": ["music", "album", "artist", "sheet"]});
