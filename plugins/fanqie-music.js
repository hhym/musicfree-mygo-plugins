// 显示名：番茄音乐（fanqie-music）
// MusicFree plugin generated from MyGo Music plugin; source site: www.novelfm.com
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
// 显示名：番茄音乐（fanqie-music）
// MyGo Music plugin — 番茄音乐 / novelfm.com
//
// 站点是番茄音乐的 PC 网页版，页面由 SSR 直出，数据在 window._ROUTER_DATA 里：
//   home     GET  /                 热门歌曲卡片（约 200 首）
//   song     GET  /music/<id>       页面数据：api_book_info + video_info.main_url + lyric_info
//   audio    https://v26-novelfm.novelfmvod.com/...  m4a（audio_mp4），Range 回 206
// 站点本身没有搜索接口，搜索在本地索引上做：首页 200 首按歌名 / 歌手 / 专辑匹配。

const BASE = "https://www.novelfm.com";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const HEAD = {
  "user-agent": UA,
  "accept-language": "zh-CN,zh;q=0.9,en;q=0.5",
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  referer: BASE + "/",
};

const t = (text) => host.t(text);

function fail(code, message) {
  const error = new Error(message || code);
  error.code = code;
  return error;
}

function decode(text) {
  return String(text || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
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
        return Number.isFinite(code) ? String.fromCharCode(code) : match;
      }
      return match;
    })
    .replace(/\s+/g, " ")
    .trim();
}

async function request(url, ms = 15000) {
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timer = setTimeout(() => controller && controller.abort(), ms);
  try {
    const res = await fetch(url, { headers: HEAD, signal: controller ? controller.signal : undefined });
    if (res.status >= 400) throw fail("unavailable", res.status + " " + url);
    return await res.text();
  } catch (error) {
    if (error && error.name === "AbortError") throw fail("timeout", "请求超时");
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function routerData(html) {
  const match = html.match(/window\._ROUTER_DATA\s*=\s*(\{[\s\S]*?\})\s*;?\s*<\/script>/);
  if (!match) throw fail("unavailable", t("页面结构变了，取不到数据"));
  try {
    return JSON.parse(match[1]);
  } catch (error) {
    throw fail("unavailable", t("页面数据解析失败"));
  }
}

function pageDataOf(html) {
  const data = routerData(html);
  const loader = (data && data.loaderData) || {};
  const page = loader["music_(id)/page"] || loader["music_(id)/layout"] || null;
  const payload = page && (page.pageData || page);
  if (!payload) throw fail("unavailable", t("这首歌暂时播放不了"));
  return payload;
}

/* ------------------------------------------------------------------ */
/* 首页与索引                                                          */
/* ------------------------------------------------------------------ */

const CARD_RE = /<a class="pc-music-card-grid-item" href="\/music\/(\d+)">([\s\S]*?)<\/a>/g;

function cardsFrom(html) {
  const out = [];
  let match;
  CARD_RE.lastIndex = 0;
  while ((match = CARD_RE.exec(html))) {
    const body = match[2];
    const name = decode((body.match(/pc-music-card-grid-name">([\s\S]*?)<\/div>/) || [])[1]);
    if (!name) continue;
    const subtitle = decode((body.match(/pc-music-card-grid-subtitle-text">([\s\S]*?)<\/span>/) || [])[1]);
    const cover = decode((body.match(/data-src="([^"]+)"/) || [])[1] || "").replace(/^http:/, "https:");
    const listeners = decode((body.match(/pc-music-card-grid-listeners-num">([\s\S]*?)<\/span>/) || [])[1]);
    let artist = "";
    let album = "";
    if (subtitle) {
      const sep = subtitle.indexOf(" · ");
      artist = (sep >= 0 ? subtitle.slice(0, sep) : subtitle).trim();
      album = sep >= 0 ? subtitle.slice(sep + 3).trim() : "";
    }
    out.push({
      id: match[1],
      name: name,
      artists: artist ? [{ id: "n:" + artist, name: artist }] : [],
      album: album ? { id: match[1], name: album } : undefined,
      imageUrl: cover,
      listeners: listeners || undefined,
    });
  }
  return out;
}

function trackOf(card) {
  return {
    id: card.id,
    name: card.name,
    artists: card.artists,
    album: card.album,
    imageUrl: card.imageUrl || undefined,
  };
}

function homeCache() {
  const raw = host.storage.get("home");
  if (raw && Date.now() - raw.at < 30 * 60 * 1000 && raw.tracks && raw.tracks.length) return raw.tracks;
  return null;
}

async function homeTracks() {
  const cached = homeCache();
  if (cached) return cached;
  const html = await request(BASE + "/");
  const cards = cardsFrom(html);
  if (!cards.length) throw fail("unavailable", t("首页没有解析到歌曲"));
  host.storage.set("home", { at: Date.now(), tracks: cards });
  return cards;
}
async function home() {
  const cards = await homeTracks();
  const tracks = cards.map(trackOf);
  return {
    sections: [
      { title: t("热门歌曲"), more: false, tracks: tracks.slice(0, 100) },
      { title: t("更多热门"), more: false, tracks: tracks.slice(100) },
    ],
  };
}
async function charts() {
  const cards = await homeTracks();
  return {
    sections: [{ title: t("热门歌曲"), tracks: cards.map(trackOf) }],
    title: t("热门歌曲"),
  };
}
async function search({ keyword, page = 1 }) {
  const query = String(keyword || "").trim().toLowerCase();
  if (!query) return { tracks: [], albums: [], artists: [], more: false };
  const cards = homeCache() || (await homeTracks());
  if (!cards.length) throw fail("unavailable", t("首页没有解析到歌曲"));
  const matched = cards.filter((card) => {
    const title = card.name.toLowerCase();
    const artist = (card.artists[0] && card.artists[0].name ? card.artists[0].name : "").toLowerCase();
    const album = (card.album && card.album.name ? card.album.name : "").toLowerCase();
    return title.indexOf(query) >= 0 || artist.indexOf(query) >= 0 || album.indexOf(query) >= 0;
  });
  return {
    tracks: page === 1 ? matched.slice(0, 50) : [],
    albums: [],
    artists: [],
    more: false,
    note: t("番茄网页版没有搜索接口，结果来自首页热门歌曲索引"),
  };
}
async function album({ id }) {
  const songId = String(id).replace(/^al:/, "");
  const payload = await songDetail(songId);
  const info = payload.api_book_info || {};
  const track = trackFromPayload(songId, payload);
  return {
    album: {
      id: songId,
      name: info.album_title || info.book_name || track.name,
      imageUrl: info.thumb_url || undefined,
      description: info.abstract || undefined,
    },
    tracks: [track],
  };
}
async function artist({ id }) {
  const name = String(id).replace(/^n:/, "");
  const cards = homeCache() || (await homeTracks());
  const matched = cards.filter((card) => {
    const artist = card.artists[0] && card.artists[0].name ? card.artists[0].name : "";
    return artist.indexOf(name) >= 0 || name.indexOf(artist) >= 0;
  });
  return {
    artist: { id: "n:" + name, name: name },
    tracks: matched.map(trackOf),
  };
}

/* ------------------------------------------------------------------ */
/* 歌曲详情 / 歌词 / 播放                                               */
/* ------------------------------------------------------------------ */

const detailCache = new Map();

async function songDetail(id) {
  const key = String(id);
  const cached = detailCache.get(key);
  if (cached && Date.now() - cached.at < 10 * 60 * 1000) return cached.data;
  const html = await request(BASE + "/music/" + encodeURIComponent(key));
  const payload = pageDataOf(html);
  detailCache.set(key, { at: Date.now(), data: payload });
  return payload;
}

function trackFromPayload(id, payload) {
  const info = payload.api_book_info || {};
  return {
    id: String(id),
    name: info.book_name || info.album_title || String(id),
    artists: info.author ? [{ id: "n:" + info.author, name: info.author }] : [],
    album: {
      id: String(id),
      name: info.album_title || info.book_name || "",
      imageUrl: info.thumb_url || undefined,
    },
    imageUrl: info.thumb_url || undefined,
  };
}
async function song({ id }) {
  const payload = await songDetail(id);
  return { track: trackFromPayload(id, payload) };
}
async function lyrics({ id }) {
  const payload = await songDetail(id);
  const raw = String(payload.lyric_info || "");
  if (!raw) return { lrc: "" };
  const lines = [];
  for (const line of raw.split("\n")) {
    const match = line.match(/^\[(\d+),(\d+)\](.*)$/);
    if (!match) continue;
    const start = Number(match[1]);
    const text = match[3].replace(/<\d+,\d+,\d+>/g, "").trim();
    if (!text) continue;
    lines.push({ at: start, text: text });
  }
  lines.sort((a, b) => a.at - b.at);
  const lrc = lines
    .map((line) => {
      const seconds = line.at / 1000;
      const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
      const ss = String(Math.floor(seconds % 60)).padStart(2, "0");
      const cs = String(Math.floor((seconds % 1) * 100)).padStart(2, "0");
      return "[" + mm + ":" + ss + "." + cs + "]" + line.text;
    })
    .join("\n");
  return { lrc: lrc };
}

async function audioSize(url) {
  try {
    const res = await fetch(url, {
      headers: Object.assign({}, HEAD, { range: "bytes=0-1" }),
    });
    if (!res.ok && res.status !== 206) return 0;
    const range = res.headers.get("content-range") || "";
    const total = Number((range.match(/\/\s*(\d+)/) || [])[1]);
    if (total > 0) return total;
    return Number(res.headers.get("content-length")) || 0;
  } catch (error) {
    return 0;
  }
}
async function stream({ id }) {
  const payload = await songDetail(id);
  const video = payload.video_info || {};
  const url = video.main_url || video.back_url || "";
  if (!url) throw fail("unavailable", t("这首歌没有可播放的地址"));
  const size = await audioSize(url);
  return {
    url: url,
    type: "m4a",
    size: size || undefined,
    headers: { referer: BASE + "/", "user-agent": UA },
  };
}
return { home, charts, search, album, artist, song, lyrics, stream };
})(__mfRuntime.host, __mfRuntime.fetch, __mfRuntime.TextDecoder, __mfRuntime.atob, __mfRuntime.btoa, __mfRuntime.URL, __mfRuntime.URLSearchParams);
module.exports = __mfRuntime.makePlugin(__mfPlugin, {"id": "fanqie-music", "name": "番茄音乐", "version": "1.0.0", "site": "www.novelfm.com", "searchTypes": ["music", "album", "artist"]});
