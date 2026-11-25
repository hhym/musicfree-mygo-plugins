// 显示名：一起听歌吧（jusic-room）
// MusicFree plugin generated from MyGo Music plugin; source site: happy.alang.run
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
// 显示名：一起听歌吧（jusic-room）
// MyGo Music plugin — 一起听歌吧 (happy.alang.run / Jusic-Serve-Houses)
//
// 这个站点不是曲库，是「一起听歌房」：前端只是房间界面，内容全部来自后端
// https://tx.alang.run/api 的 SockJS + STOMP（后端开源在
// github.com/JumpAlang/Jusic-Serve-Houses）。插件按「跟随房间」实现：
//
//   REST（公开，带 AccessToken: token）
//     POST /house/search   房间列表
//   STOMP（先进房间，匿名即可）
//     SEND /music/search           搜索，只回元数据（id/歌名/歌手/专辑封面/时长）
//
//   进房间的瞬间服务端就推：MUSIC（正在播放，带 mp3 直链和整首 LRC）、
//   PICK（待播队列，每条也带直链）、ONLINE、ANNOUNCEMENT。
//
// 关键结论（读后端源码确认过）：直链只在「点歌入队」那一刻由服务端签出来，
// 搜索接口、房间默认歌单（/music/defaultPlaylist，231 首）都只有元数据、
// 没有 url；站内也没有音频代理路径，/music/* 的 REST 一律 401。
// 所以本插件只读跟随：正在播放与队列里的歌能在 App 里直接播，
// 搜索结果能浏览但点播放会明确告诉你「要先在房间里点歌」。
// 不发送 /music/pick，不会往房间里投歌，不影响房间里其他人。

const BASE = "https://tx.alang.run/api";
const HOME = "https://happy.alang.run/";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const TOKEN = "token"; // 前端自己用的那个公开令牌

const t = (text) => host.t(text);

function fail(code, message) {
  const error = new Error(message || code);
  error.code = code;
  return error;
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

/* ------------------------------------------------------------------ */
/* REST: the room list                                                 */
/* ------------------------------------------------------------------ */

async function rest(path, payload) {
  const res = await once(
    BASE + path,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        "user-agent": UA,
        AccessToken: TOKEN,
      },
      body: JSON.stringify(payload || {}),
    },
    12000
  );
  if (res.status >= 400) throw fail("unavailable", path + " " + res.status);
  const data = await res.json();
  if (String(data.code) !== "20000") throw fail("unavailable", data.message || path);
  return data.data;
}

async function roomList() {
  const list = await rest("/house/search", {});
  const sorted = (list || []).slice().sort((a, b) => (Number(b.population) || 0) - (Number(a.population) || 0));
  const out = sorted.slice(0, 80).map((room) => ({
    id: String(room.id),
    name: String(room.name || room.id),
    imageUrl: "",
    description: [
      room.desc ? String(room.desc) : "",
      room.needPwd ? t("需要密码") : t("公开房间"),
      room.population != null ? room.population + " " + t("人在线") : "",
    ]
      .filter(Boolean)
      .join(" · "),
    _room: room,
  }));
  return out;
}

/* ------------------------------------------------------------------ */
/* SockJS (xhr transport) + STOMP                                     */
/* ------------------------------------------------------------------ */

function randomId(length) {
  let out = "";
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
  return out;
}

// SockJS 的 xhr 帧：o 打开、h 心跳、c 关闭、a[...] 一组消息
function framesFrom(text) {
  const raw = String(text || "").trim();
  if (!raw) return [];
  if (raw.charAt(0) === "o" || raw.charAt(0) === "h") return [];
  if (raw.charAt(0) === "c") throw fail("unavailable", t("房间连接被服务端关闭"));
  if (raw.charAt(0) !== "a") return [];
  try {
    const parsed = JSON.parse(raw.slice(1));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function stompFrame(text) {
  const index = text.indexOf("\n\n");
  if (index < 0) return null;
  return {
    type: text.slice(0, index).split("\n")[0],
    body: text.slice(index + 2).replace(/\u0000$/, ""),
  };
}

// 服务端把歌词里的换行原样塞进 JSON 字符串，严格 JSON.parse 会在这里失败
function parseJson(body) {
  try {
    return JSON.parse(body);
  } catch (error) {
    try {
      return JSON.parse(body.replace(/\r/g, "").replace(/\n/g, "\\n"));
    } catch (second) {
      return null;
    }
  }
}

class Session {
  constructor(houseId, housePwd) {
    this.houseId = String(houseId || "DEFAULT");
    this.housePwd = String(housePwd || "");
    this.server = "000";
    this.sid = randomId(8);
    this.closed = false;
  }

  url(path, query) {
    return BASE + "/server/" + this.server + "/" + this.sid + "/" + path + (query ? "?" + query : "");
  }

  async open() {
    const query =
      "houseId=" + encodeURIComponent(this.houseId) +
      "&housePwd=" + encodeURIComponent(this.housePwd) +
      "&connectType=enter";
    const res = await once(
      this.url("xhr", query),
      { method: "POST", headers: { "content-type": "text/plain;charset=UTF-8", "user-agent": UA } },
      12000
    );
    if (res.status >= 400) throw fail("unavailable", t("房间连接失败") + " " + res.status);
    await res.text();
    await this.send(["CONNECT\naccept-version:1.0,1.1,1.2\nheart-beat:0,0\n\n\u0000"]);
    return this;
  }

  async send(frames) {
    const res = await once(
      this.url("xhr_send"),
      {
        method: "POST",
        headers: { "content-type": "text/plain;charset=UTF-8", "user-agent": UA },
        body: JSON.stringify(frames),
      },
      10000
    );
    if (res.status >= 400) throw fail("unavailable", t("房间连接失败") + " " + res.status);
    await res.text();
  }

  async poll() {
    if (this.closed) return [];
    try {
      const res = await once(
        this.url("xhr"),
        { method: "POST", headers: { "content-type": "text/plain;charset=UTF-8", "user-agent": UA } },
        8000
      );
      if (res.status >= 400) return [];
      return framesFrom(await res.text());
    } catch (error) {
      return [];
    }
  }

  // 收消息直到超时或 stop 说够了
  async collect(ms, stop) {
    const messages = [];
    const until = Date.now() + ms;
    let cold = true;
    while (Date.now() < until) {
      const frames = await this.poll();
      if (!frames.length) {
        if (!cold) break;
        cold = false;
        continue;
      }
      cold = false;
      for (const text of frames) {
        const frame = stompFrame(text);
        if (!frame) continue;
        messages.push(frame);
        if (stop && stop(frame, messages)) return messages;
      }
    }
    return messages;
  }

  stop() {
    this.closed = true;
    try {
      const res = once(
        this.url("xhr"),
        { method: "POST", headers: { "content-type": "text/plain;charset=UTF-8" } },
        4000
      );
      if (res && typeof res.catch === "function") res.catch(() => {});
    } catch (error) {
      /* the session times out on its own */
    }
  }
}

function roomOf() {
  return {
    houseId: String(host.setting("houseId") || "DEFAULT").trim() || "DEFAULT",
    housePwd: String(host.setting("housePwd") || "").trim(),
  };
}

function openSession() {
  const room = roomOf();
  return new Session(room.houseId, room.housePwd).open();
}

/* ------------------------------------------------------------------ */
/* Shape helpers                                                       */
/* ------------------------------------------------------------------ */

function decode(text) {
  if (!text) return "";
  return String(text).replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
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

function clean(text) {
  return decode(String(text || "").replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
}

function https(url) {
  const raw = String(url || "").trim();
  if (!raw) return "";
  return raw.replace(/^http:\/\//i, "https://").replace(/^\/\//, "https://");
}

function toTrack(item, withState) {
  if (!item || !item.id) return null;
  const name = clean(item.name || item.title || "");
  if (!name) return null;
  const track = {
    id: String(item.id),
    name: name,
    album: {
      name: clean(item.album && item.album.name ? item.album.name : item.album || ""),
      imageUrl: https(item.pictureUrl || (item.album && item.album.pictureUrl) || ""),
    },
  };
  const artist = clean(item.artist || item.nickName || "");
  if (artist) track.artists = [{ name: artist }];
  if (item.duration) track.duration = Number(item.duration);
  const url = https(item.url);
  if (withState) {
    if (url) urlCache.set(String(item.id), url);
    else {
      track.unavailable = true;
      track.description = t("房间只给正在播放和队列里的歌签直链，这首要点进房间才能播");
    }
  }
  if (item.lyric) lrcCache.set(String(item.id), normalizeLrc(item.lyric));
  return track;
}

function normalizeLrc(text) {
  const lrc = decode(String(text || "").replace(/<br\s*\/?>/gi, "\n"));
  return /\[[\d]{1,2}:[\d]{1,2}/.test(lrc) ? lrc.trim() : "";
}

const urlCache = new Map();
const lrcCache = new Map();
const roomCache = new Map();

/* ------------------------------------------------------------------ */
/* Follow the room                                                     */
/* ------------------------------------------------------------------ */

async function snapshot(ms) {
  const room = roomOf();
  const key = room.houseId + "|" + room.housePwd;
  const cached = roomCache.get(key);
  if (cached && Date.now() - cached.at < 60 * 1000) return cached.value;

  const session = await openSession();
  let now = null;
  let queue = [];
  let online = 0;
  let announcement = "";
  try {
    await session.collect(ms || 6000, (frame) => {
      if (frame.type !== "MUSIC" && frame.type !== "PICK" && frame.type !== "ONLINE" && frame.type !== "ANNOUNCEMENT") return false;
      const data = parseJson(frame.body);
      const body = data && data.data;
      if (frame.type === "MUSIC" && body) now = body;
      if (frame.type === "PICK" && Array.isArray(body)) queue = body;
      if (frame.type === "ONLINE" && body && body.count != null) online = Number(body.count) || 0;
      if (frame.type === "ANNOUNCEMENT" && body && body.content) announcement = String(body.content);
      return Boolean(now && queue.length);
    });
  } catch (error) {
    if (!now && !queue.length) throw fail("unavailable", t("房间连不上，稍后重试"));
  } finally {
    session.stop();
  }

  const value = {
    houseId: room.houseId,
    now: now ? toTrack(now, true) : null,
    queue: queue.map((item) => toTrack(item, true)).filter(Boolean),
    online: online,
    announcement: announcement,
    at: Date.now(),
  };
  roomCache.set(key, { at: Date.now(), value: value });
  remember([value.now].concat(value.queue).filter(Boolean));
  return value;
}
async function home() {
  let room;
  try {
    room = await snapshot(6500);
  } catch (error) {
    console.log("[jusic] home failed:", error && error.message);
    return {
      title: t("一起听歌吧"),
      subtitle: t("房间连不上，稍后刷新"),
      sections: [{ title: t("房间"), links: [{ title: t("打开房间列表"), page: "rooms" }] }],
    };
  }

  const sections = [];
  if (room.now) {
    sections.push({
      title: t("正在播放"),
      subtitle: room.now.artists && room.now.artists.length ? room.now.artists[0].name : "",
      tracks: [room.now],
      morePage: "now",
    });
  }
  if (room.queue.length) {
    const playable = room.queue.filter((track) => !track.unavailable);
    sections.push({
      title: t("待播队列"),
      subtitle: t("房间里排着的歌，每首都能在 App 里直接放"),
      tracks: playable.length ? playable : room.queue,
      morePage: "queue",
    });
  }
  sections.push({
    title: t("房间"),
    links: [
      { title: t("打开房间列表"), subtitle: t("换一个房间就是在设置里改房间 ID"), page: "rooms" },
    ],
  });

  return {
    title: t("一起听歌吧"),
    subtitle:
      t("房间") +
      " " +
      room.houseId +
      (room.online ? " · " + room.online + " " + t("人在线") : "") +
      (room.announcement ? " · " + room.announcement : ""),
    description: t("只读跟随房间：正在播放和队列里的歌在这里同步播放，不往房间投歌。"),
    sections: sections,
  };
}
async function browse({ page: name }) {
  const key = String(name || "");
  if (key === "rooms") {
    const list = await roomList();
    return {
      title: t("房间列表"),
      subtitle: t("按在线人数排的前 80 个房间；把想要的 ID 填进设置里的「房间 ID」就能换过去"),
      sections: [
        {
          title: t("公开与密码房间"),
          links: list.map((room) => ({ title: room.name, subtitle: room.description, page: "rooms" })),
        },
      ],
    };
  }
  if (key === "now") {
    const room = await snapshot(5000);
    if (!room.now) throw fail("unavailable", t("房间里现在没有在放的歌"));
    return { title: t("正在播放"), sections: [{ title: t("正在播放"), tracks: [room.now] }] };
  }
  if (key === "queue") {
    const room = await snapshot(5000);
    const playable = room.queue.filter((track) => !track.unavailable);
    return {
      title: t("待播队列"),
      subtitle: room.queue.length ? room.queue.length + " " + t("首") : "",
      sections: [{ title: t("待播队列"), tracks: playable.length ? playable : room.queue }],
    };
  }
  throw fail("unavailable", t("没有这个页面"));
}

/* ------------------------------------------------------------------ */
/* Search (the room's own search: metadata only)                       */
/* ------------------------------------------------------------------ */

async function searchRoom(text) {
  const source = String(host.setting("source") || "wy").trim() || "wy";
  const session = await openSession();
  const tracks = [];
  try {
    let connected = false;
    await session.collect(1500, (frame) => {
      if (frame.type === "CONNECTED") connected = true;
      return connected;
    });
    const body = {
      name: text,
      source: source,
      pageIndex: 1,
      pageSize: 30,
      sendTime: Date.now(),
    };
    await session.send(["SEND\ndestination:/music/search\ncontent-type:application/json\n\n" + JSON.stringify(body) + "\u0000"]);
    const messages = await session.collect(8000, (frame) => frame.type === "SEARCH" || frame.type === "NOTICE");
    const search = messages.filter((frame) => frame.type === "SEARCH").pop();
    if (!search) throw fail("unavailable", t("房间里搜不到结果，稍后重试"));
    const data = parseJson(search.body);
    const page = data && data.data;
    const items = page && page.data;
    if (!Array.isArray(items)) return [];
    for (const item of items) {
      const track = toTrack(item, true);
      if (track) tracks.push(track);
    }
  } finally {
    session.stop();
  }
  remember(tracks);
  return tracks;
}
async function search({ query, kind }) {
  const text = String(query || "").trim();
  const key = kind || "tracks";
  if (!text) {
    if (key === "albums") return { albums: [], more: false };
    if (key === "artists") return { artists: [], more: false };
    return { tracks: [], more: false };
  }
  if (key === "albums") return { albums: [], more: false };
  if (key === "artists") {
    const tracks = await searchRoom(text);
    const names = [];
    const seen = new Set();
    for (const track of tracks) {
      for (const artist of track.artists || []) {
        if (!artist.name || seen.has(artist.name)) continue;
        seen.add(artist.name);
        names.push({ id: "n:" + artist.name, name: artist.name, imageUrl: track.album.imageUrl });
      }
    }
    return { artists: names.slice(0, 20), more: false };
  }
  if (key !== "tracks") return { tracks: [], more: false };
  return { tracks: await searchRoom(text), more: false };
}
async function suggest({ query }) {
  const text = String(query || "").trim();
  if (!text) return [];
  try {
    const tracks = await searchRoom(text);
    return tracks
      .slice(0, 10)
      .map((track) => {
        const singer = track.artists && track.artists.length ? track.artists[0].name : "";
        return singer ? singer + " - " + track.name : track.name;
      });
  } catch (error) {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Audio and lyrics                                                   */
/* ------------------------------------------------------------------ */
async function stream({ id }) {
  const key = String(id);
  let url = urlCache.get(key);
  if (!url) {
    try {
      await snapshot(5000);
    } catch (error) {
      /* fall through to the error below */
    }
    url = urlCache.get(key);
  }
  if (!url) throw fail("unavailable", t("房间只给正在播放和队列里的歌签直链，这首要点进房间才能播"));
  return { url: url, type: /\.flac/i.test(url) ? "flac" : "mp3" };
}
async function lyrics({ id }) {
  const key = String(id);
  const lrc = lrcCache.get(key);
  if (lrc) return { lrc: lrc };
  try {
    await snapshot(5000);
  } catch (error) {
    /* ignore */
  }
  return { lrc: lrcCache.get(key) || "" };
}

/* ------------------------------------------------------------------ */
/* Library kept on this device                                         */
/* ------------------------------------------------------------------ */

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

function trackById(id) {
  if (index[id]) return index[id];
  const saved = load("likedTracks", {});
  return saved[id] || { id: String(id), name: String(id), album: { name: "" } };
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
  ids.unshift(String(id));
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
  for (const id of ids || []) out[id] = set.has(String(id));
  return out;
}
function like({ id, on }) {
  const set = new Set(load("liked", []));
  if (on) {
    set.add(String(id));
    if (index[id]) {
      const saved = load("likedTracks", {});
      saved[id] = index[id];
      save("likedTracks", saved);
    }
  } else {
    set.delete(String(id));
  }
  save("liked", [...set]);
}
return { home, browse, search, suggest, stream, lyrics, recent, played, liked, isLiked, like };
})(__mfRuntime.host, __mfRuntime.fetch, __mfRuntime.TextDecoder, __mfRuntime.atob, __mfRuntime.btoa, __mfRuntime.URL, __mfRuntime.URLSearchParams);
module.exports = __mfRuntime.makePlugin(__mfPlugin, {"id": "jusic-room", "name": "一起听歌吧", "version": "1.0.0", "site": "happy.alang.run", "searchTypes": ["music", "album"]});
