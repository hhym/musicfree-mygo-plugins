// 显示名：米乐迪音乐（imelody）
// MusicFree plugin generated from MyGo Music plugin; source site: imelody.top
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
// 米乐迪音乐（imelody.top）— MyGo Music 插件
//
// 站点是 MelodyTimeline 华语乐坛编年史 SPA，数据由一个 JSON API 提供：
// POST https://melody-api.imelody.top  {action, data}
// 常用动作：getAllSongs / searchSongsInDB / getRandomSongs /
// getPlayableUrl / fetchLyrics。歌曲自带封面、发行年份和 LRC。

const SITE = "https://imelody.top";
const API = "https://melody-api.imelody.top";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const PAGE_SIZE = 30;
const CACHE_TTL = 5 * 60 * 1000;
const DECADES = [1960, 1970, 1980, 1990, 2000, 2010, 2020];

const t = (text) => host.t(text);

function fail(code, message) {
  const error = new Error(message || code);
  error.code = code;
  return error;
}

function stored(key, fallback) {
  const value = host.storage.get(key);
  return value === undefined || value === null ? fallback : value;
}

function keep(key, value) {
  host.storage.set(key, value);
}

const cache = new Map();

async function call(action, data = {}, attempt = 0) {
  let response;
  try {
    response = await fetch(API, {
      method: "POST",
      headers: {
        "user-agent": UA,
        "content-type": "application/json",
        accept: "application/json",
        origin: SITE,
        referer: SITE + "/",
      },
      body: JSON.stringify({ action, data }),
    });
  } catch (error) {
    if (attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      return call(action, data, attempt + 1);
    }
    throw new Error(`连不上米乐迪音乐 API：${error && error.message ? error.message : error}`);
  }
  if (!response.ok) {
    if (attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      return call(action, data, attempt + 1);
    }
    throw fail("unavailable", `米乐迪音乐 API 返回了 ${response.status}`);
  }
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    throw fail("unavailable", "米乐迪音乐 API 返回了无法解析的内容");
  }
}

function cached(key) {
  const item = cache.get(key);
  return item && Date.now() - item.at < CACHE_TTL ? item.value : null;
}

function remember(key, value) {
  cache.set(key, { value, at: Date.now() });
  if (cache.size > 30) {
    const oldest = [...cache.entries()].sort((a, b) => a[1].at - b[1].at)[0];
    if (oldest) cache.delete(oldest[0]);
  }
}

async function allSongs() {
  const hit = cached("all");
  if (hit) return hit;
  const songs = await call("getAllSongs");
  const list = Array.isArray(songs) ? songs : [];
  remember("all", list);
  rememberTracks(list.map(toTrack));
  return list;
}

function sizedImage(url) {
  if (!url) return "";
  let out = String(url).trim();
  if (out.startsWith("//")) out = "https:" + out;
  out = out.replace(/\/300\/300(?:[/?#]|$)/, "/__SIZE__/__SIZE__");
  out = encodeURI(out).replace(/__SIZE__/g, "{size}");
  return out;
}

function yearOf(song) {
  const match = String(song.release_date || "").match(/(\d{4})/);
  return match ? Number(match[1]) : 0;
}

function toTrack(song) {
  return {
    id: String(song.id),
    name: String(song.title || "").trim(),
    artists: song.artist ? [{ id: "", name: String(song.artist).trim() }] : [],
    album: {
      id: "",
      name: "MelodyTimeline",
      imageUrl: sizedImage(song.cover_url || ""),
      released: String(song.release_date || ""),
    },
    duration: 0,
    url: SITE + "/",
  };
}

const knownTracks = new Map();

function rememberTracks(tracks) {
  for (const track of tracks || []) {
    if (track && track.id) knownTracks.set(track.id, track);
  }
}

function trackBy(id) {
  return knownTracks.get(id) || stored("likedTracks", {})[id] || stored("historyTracks", {})[id] || null;
}

function songBy(id) {
  const fromCache = cached("songsById");
  if (fromCache && fromCache[id]) return fromCache[id];
  return null;
}

function indexSongs(songs) {
  const byId = {};
  for (const song of songs || []) byId[String(song.id)] = song;
  remember("songsById", byId);
  rememberTracks(songs.map(toTrack));
  return byId;
}

function hash(text) {
  let value = 0;
  for (let i = 0; i < String(text).length; i++) value = (value * 31 + String(text).charCodeAt(i)) >>> 0;
  return value;
}

function paged(tracks, page, kind, title, subtitle) {
  const start = (page - 1) * PAGE_SIZE;
  const slice = tracks.slice(start, start + PAGE_SIZE);
  const sections = [{ title, tracks: slice }];
  const links = [];
  if (page > 1) links.push({ title: t("Previous"), subtitle: `第 ${page - 1} 页`, page: `${kind}:${page - 1}` });
  if (start + PAGE_SIZE < tracks.length) {
    links.push({ title: t("Next"), subtitle: `第 ${page + 1} 页`, page: `${kind}:${page + 1}` });
  }
  if (links.length) sections.push({ title: t("Pages"), links });
  return { title, subtitle: subtitle || `第 ${page} 页`, sections };
}

function sorted(kind, songs) {
  const list = songs.slice();
  if (kind === "popular") {
    list.sort((a, b) => Number(b.popularity || 0) - Number(a.popularity || 0));
  } else if (kind === "latest") {
    list.sort((a, b) => String(b.release_date || "").localeCompare(String(a.release_date || "")));
  } else {
    list.sort((a, b) => hash(a.id) - hash(b.id));
  }
  return list;
}
async function home() {
  let songs;
  try {
    songs = await allSongs();
  } catch (error) {
    // 全量接口失败时用随机 300 首兜底，首页仍能出来。
    songs = await call("getRandomSongs", { limit: 300 });
  }
  indexSongs(songs);
  const latest = sorted("latest", songs).slice(0, 20).map(toTrack);
  const popular = sorted("popular", songs).slice(0, 20).map(toTrack);
  const random = sorted("random", songs).slice(0, 20).map(toTrack);
  const sections = [];
  if (latest.length) {
    sections.push({
      title: "最新收录",
      tracks: latest,
      morePage: "chart:latest:1",
      pageTitle: "最新收录",
      subtitle: "按发行日期排序",
    });
  }
  if (popular.length) {
    sections.push({
      title: "热门经典",
      tracks: popular,
      morePage: "chart:popular:1",
      pageTitle: "热门经典",
      subtitle: "按站内热度排序",
    });
  }
  if (random.length) {
    sections.push({
      title: "随机漫游",
      tracks: random,
      morePage: "chart:random:1",
      pageTitle: "随机漫游",
      subtitle: "从编年史里随机挑选",
    });
  }
  sections.push({
    title: "年代",
    links: DECADES.map((year) => ({ title: `${year} 年代`, page: `decade:${year}:1` })).concat([
      { title: "全部年代", page: "years" },
    ]),
  });
  return { title: "米乐迪音乐", subtitle: "华语乐坛编年史", sections };
}
async function browse({ page }) {
  if (page === "years") {
    const songs = await allSongs();
    const sections = DECADES.map((year) => {
      const count = songs.filter((song) => yearOf(song) >= year && yearOf(song) < year + 10).length;
      return { title: `${year} 年代`, subtitle: `${count} 首`, page: `decade:${year}:1` };
    });
    return { title: "年代", subtitle: "按十年划分的华语流行史", sections: [{ title: "全部年代", links: sections }] };
  }
  const decade = page.match(/^decade:(\d{4}):(\d+)$/);
  if (decade) {
    const startYear = Number(decade[1]);
    const index = Number(decade[2]);
    const songs = await allSongs();
    const list = songs
      .filter((song) => {
        const year = yearOf(song);
        return year >= startYear && year < startYear + 10;
      })
      .sort((a, b) => String(b.release_date || "").localeCompare(String(a.release_date || "")))
      .map(toTrack);
    return paged(list, index, `decade:${startYear}`, `${startYear} 年代`);
  }
  const chart = page.match(/^chart:(popular|latest|random):(\d+)$/);
  if (chart) {
    const kind = chart[1];
    const index = Number(chart[2]);
    const songs = index === 1 ? await allSongs() : await allSongs();
    const titles = { popular: "热门经典", latest: "最新收录", random: "随机漫游" };
    const list = sorted(kind, songs).map(toTrack);
    return paged(list, index, `chart:${kind}`, titles[kind]);
  }
  if (page === "charts") {
    const songs = await allSongs();
    const sections = [];
    for (const kind of ["popular", "latest", "random"]) {
      const titles = { popular: "热门经典", latest: "最新收录", random: "随机漫游" };
      sections.push({ title: titles[kind], tracks: sorted(kind, songs).slice(0, 10).map(toTrack), morePage: `chart:${kind}:1` });
    }
    sections.push({
      title: "全部榜单",
      links: ["popular", "latest", "random"].map((kind) => ({
        title: { popular: "热门经典", latest: "最新收录", random: "随机漫游" }[kind],
        page: `chart:${kind}:1`,
      })),
    });
    return { title: t("Charts"), subtitle: "热度、发行日期与随机漫游", sections };
  }
  throw fail("unavailable", "没有这个页面");
}
async function search({ query, kind, offset = 0 }) {
  if ((kind || "tracks") !== "tracks") return { tracks: [], more: false };
  const term = String(query || "").trim();
  if (!term) return { tracks: [], more: false };
  const limit = Math.max(PAGE_SIZE, offset + PAGE_SIZE + 1);
  let songs;
  try {
    songs = await call("searchSongsInDB", { query: term, limit });
  } catch (error) {
    songs = [];
  }
  const list = Array.isArray(songs) ? songs : [];
  rememberTracks(list.map(toTrack));
  const tracks = list.slice(offset, offset + PAGE_SIZE).map(toTrack);
  return { tracks, more: list.length > offset + PAGE_SIZE };
}
async function suggest({ query }) {
  const term = String(query || "").trim();
  if (!term) return [];
  try {
    const songs = await call("searchSongsInDB", { query: term, limit: 10 });
    return (Array.isArray(songs) ? songs : [])
      .map((song) => (song.artist ? `${song.artist} - ${song.title}` : song.title))
      .filter(Boolean)
      .slice(0, 10);
  } catch (error) {
    return [];
  }
}
async function lyrics({ id }) {
  const songs = await allSongs();
  indexSongs(songs);
  const song = songBy(String(id));
  const lrc = String((song && song.lyrics) || "").trim();
  // 只有带时间轴的 LRC 才交给播放器；纯文本简介不冒充歌词。
  return /\[\d{1,2}:\d{2}/.test(lrc) ? { lrc } : {};
}
async function stream({ id }) {
  const songs = await allSongs();
  indexSongs(songs);
  const song = songBy(String(id));
  if (!song) throw fail("unavailable", "这首歌暂时无法读取");

  let url = "";
  if (song.file_id) {
    try {
      const fresh = await call("getPlayableUrl", { fileKey: String(song.file_id) });
      if (typeof fresh === "string" && /^https?:/.test(fresh)) url = fresh;
    } catch (error) {
      url = "";
    }
  }
  if (!url) url = String(song.audio_url || "");
  if (!url) throw fail("unavailable", "这首歌暂时没有可用的音频");

  let type = "mp3";
  const path = url.split("?")[0].toLowerCase();
  if (path.endsWith(".flac")) type = "flac";
  else if (path.endsWith(".m4a")) type = "m4a";
  else if (path.endsWith(".ogg")) type = "ogg";
  return { url, type };
}
function like({ id, on }) {
  const ids = new Set(stored("liked", []));
  const kept = stored("likedTracks", {});
  if (on) {
    ids.add(id);
    const track = trackBy(id);
    if (track) {
      kept[id] = track;
      keep("likedTracks", kept);
    }
  } else {
    ids.delete(id);
  }
  keep("liked", [...ids]);
}
function isLiked({ ids }) {
  const liked = new Set(stored("liked", []));
  return Object.fromEntries(ids.map((id) => [id, liked.has(id)]));
}
function liked({ offset = 0 }) {
  const ids = stored("liked", []).slice().reverse();
  const data = stored("likedTracks", {});
  const tracks = ids.map((id) => data[id]).filter(Boolean).slice(offset, offset + 60);
  return { tracks, more: ids.length > offset + 60 };
}
function played({ id }) {
  const history = stored("history", []).filter((entry) => entry !== id);
  history.push(id);
  keep("history", history.slice(-40));
  const track = knownTracks.get(id);
  if (track) {
    const data = stored("historyTracks", {});
    data[id] = track;
    const ids = new Set(history.slice(-40));
    for (const key of Object.keys(data)) if (!ids.has(key)) delete data[key];
    keep("historyTracks", data);
  }
}
function recent() {
  const ids = stored("history", []).slice().reverse();
  const data = stored("historyTracks", {});
  return ids.map((id) => data[id] || knownTracks.get(id)).filter(Boolean).slice(0, 20);
}
return { home, browse, search, suggest, lyrics, stream, like, isLiked, liked, played, recent };
})(__mfRuntime.host, __mfRuntime.fetch, __mfRuntime.TextDecoder, __mfRuntime.atob, __mfRuntime.btoa, __mfRuntime.URL, __mfRuntime.URLSearchParams);
module.exports = __mfRuntime.makePlugin(__mfPlugin, {"id": "imelody", "name": "米乐迪音乐", "version": "1.0.0", "site": "imelody.top", "searchTypes": ["music", "album"]});
