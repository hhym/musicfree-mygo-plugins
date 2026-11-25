// 显示名：听听网（tingting）
// MusicFree plugin generated from MyGo Music plugin; source site: www.ttw.cx
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
// 显示名：听听网（tingting）
// 听听网（www.ttw.cx）MyGo Music 插件
//
// 站点是同步渲染的 PHP 页面，全部内容都会被一层「安全验证」挡住：
// 先 GET 首页拿 csrf_token 与 PHPSESSID，再 POST csrf_token + human_check=on，
// 服务端把「已验证」写进 PHP session（靠 PHPSESSID 认人，有效期约 1 小时）。
// 插件里的 fetch 不会自动存 cookie，所以这里自己从 set-cookie 里抄下来再带回去，
// 撞到验证页就重走一遍验证流程。
//
// 音频：/js/play.php 返回加密过的 url，解不开也无需解 —— 它同时给出 lkid，
// 那就是酷我的 rid，直接用酷我 antiserver 换直链（mp3，206 可 Range）。
// 歌词：/plug/down.php?ac=music&lk=lrc&id=<单曲 id> 直接吐 LRC。

const BASE = "https://www.ttw.cx"
const KUWO = "https://antiserver.kuwo.cn/anti.s?type=convert_url&format=mp3&response=url&rid="
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"

const t = (s) => (typeof host !== "undefined" && host.t ? host.t(s) : s)

class PluginError extends Error {
  constructor(code, message) {
    super(message || code)
    this.code = code
  }
}

/* ---------- 会话验证 ---------- */

let cookie = ""
let sessionLoaded = false

async function loadSession() {
  if (sessionLoaded) return
  sessionLoaded = true
  try {
    if (typeof host !== "undefined" && host.storage) {
      const saved = await host.storage.get("ttw.cookie")
      if (saved && typeof saved === "string") cookie = saved
    }
  } catch (e) {
    /* 读不到就当没有 */
  }
}

async function saveSession() {
  try {
    if (typeof host !== "undefined" && host.storage) await host.storage.set("ttw.cookie", cookie)
  } catch (e) {
    /* 存不下也不影响本次会话 */
  }
}

function absorbCookies(res) {
  let list = []
  try {
    if (res.headers && typeof res.headers.getSetCookie === "function") list = res.headers.getSetCookie()
  } catch (e) {
    list = []
  }
  if (!list || !list.length) return false
  const jar = new Map()
  for (const part of cookie.split(";")) {
    const s = part.trim()
    if (!s) continue
    const i = s.indexOf("=")
    if (i > 0) jar.set(s.slice(0, i), s.slice(i + 1))
  }
  for (const line of list) {
    const pair = String(line).split(";")[0].trim()
    const i = pair.indexOf("=")
    if (i > 0) {
      const name = pair.slice(0, i)
      const value = pair.slice(i + 1)
      if (value === "" || /deleted/i.test(String(line))) jar.delete(name)
      else jar.set(name, value)
    }
  }
  cookie = [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ")
  return true
}

function headers(extra) {
  const h = { "user-agent": UA, referer: BASE + "/", "accept-language": "zh-CN,zh" }
  if (cookie) h.cookie = cookie
  return Object.assign(h, extra || {})
}

function isWall(html) {
  if (!html) return false
  if (html.length > 6000) return false
  return /human_check/.test(html) || /安全验证/.test(html) || /verifyForm/.test(html)
}

async function verify() {
  // 站点有两层：先是一层 cookie 弹跳（403 + JS 重载，第一次会下发一个随机 cookie），
  // 再是「安全验证」页（csrf_token + human_check）。这里把两步连起来做两轮。
  for (let round = 0; round < 2; round++) {
    // 第一步：GET 首页，拿 csrf_token，同时记下服务端发的 cookie
    const r1 = await fetch(BASE + "/", { headers: headers(), redirect: "follow" })
    absorbCookies(r1)
    const page = await r1.text()
    const csrf = (page.match(/name="csrf_token"\s+value="([^"]+)"/) || [])[1]
    if (!csrf && !isWall(page)) {
      await saveSession()
      return true
    }
    if (!csrf) {
      await sleep(400)
      continue
    }
    // 第二步：勾上「我不是机器人」提交
    const body = `csrf_token=${encodeURIComponent(csrf)}&human_check=on`
    const r2 = await fetch(BASE + "/", {
      method: "POST",
      headers: headers({
        "content-type": "application/x-www-form-urlencoded",
        origin: BASE,
        referer: BASE + "/",
      }),
      body,
      redirect: "manual",
    })
    absorbCookies(r2)
    try {
      await r2.text()
    } catch (e) {
      /* 302 没有正文 */
    }
    await saveSession()
    // 第三步：确认真的放行了
    await sleep(300)
    const r3 = await fetch(BASE + "/", { headers: headers(), redirect: "follow" })
    absorbCookies(r3)
    const check = await r3.text()
    if (!isWall(check)) {
      await saveSession()
      return true
    }
    await sleep(600)
  }
  return false
}

// 站点没有会话时会先回一个 403 + JS 弹跳的小页面（顺手 set-cookie），
// 带上新 cookie 再请求一次就正常了，所以这里一律重试而不是直接报错。
function isBounce(html) {
  return !!html && html.length < 800 && /window\.location/.test(html)
}

async function request(url, extraHeaders) {
  await loadSession()
  let lastStatus = 0
  for (let i = 0; i < 4; i++) {
    let res
    let html = ""
    try {
      res = await fetch(url, { headers: headers(extraHeaders), redirect: "follow" })
      lastStatus = res.status
      html = await res.text()
    } catch (e) {
      // 网络层超时/断连：等一会儿再试，别直接把错误抛给用户
      await sleep(400 + i * 600)
      continue
    }
    absorbCookies(res)
    if (res.ok && html && !isWall(html) && !isBounce(html)) return html
    if (isWall(html)) {
      await verify()
      await sleep(400 + i * 500)
      continue
    }
    // 403 弹跳页 / 空 body：等下一步带上新 cookie
    await sleep(250 + i * 400)
  }
  throw new PluginError("response", `听听网返回 ${lastStatus || "超时"}，稍后再试`)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/* ---------- 小工具 ---------- */

function decodeEntities(s) {
  return String(s || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

function bigImage(url) {
  let u = String(url || "").trim()
  if (!u) return ""
  u = u
    .replace("/star/albumcover/120/", "/star/albumcover/500/")
    .replace("/star/starheads/300/", "/star/starheads/500/")
    .replace(/size=f\d+_\d+/, "size=f600_600")
  // 站里的图走 http，宿主是本地 http 页面，升级到 https 更稳
  if (u.startsWith("http://") && /kuwo\.cn|baidu\.com|5bb3\.com/.test(u)) u = "https://" + u.slice(7)
  return u
}

function msOf(mmss) {
  const m = /^(\d+):(\d+)$/.exec(String(mmss || "").trim())
  if (!m) return 0
  return (Number(m[1]) * 60 + Number(m[2])) * 1000
}

function splitTitle(title) {
  const s = decodeEntities(title)
  const i = s.indexOf(" - ")
  if (i < 0) return { artist: "", name: s }
  return { artist: s.slice(0, i).trim(), name: s.slice(i + 3).trim() }
}

/* ---------- 页面解析 ---------- */

function parseTracks(html) {
  const out = []
  const seen = new Set()
  const blocks = String(html || "").split("<li")
  for (const b of blocks) {
    if (b.indexOf('href="/t/') < 0) continue
    const href = /href="\/t\/([^"\/]+)\.html"[^>]*?title="([^"]*)"/.exec(b)
    if (!href) continue
    const id = href[1]
    if (seen.has(id)) continue
    seen.add(id)
    const head = splitTitle(href[2])
    const img = (/<img[^>]*src="([^"]+)"/.exec(b) || [])[1] || ""
    const time = (/class="playtime">([\d:]+)/.exec(b) || [])[1] || ""
    const singer = decodeEntities(
      (/class="singer"[^>]*>(?:<span[^>]*>)?([^<]*)</.exec(b) || [])[1] || ""
    )
    const singerId = (/href="\/singer\/([^"\/]+)\.html"[^>]*class="singer"/.exec(b) || [])[1] || ""
    const albumId = (/href="\/album\/([^"\/]+)\.html"/.exec(b) || [])[1] || ""
    out.push({
      id,
      name: head.name,
      artists: [{ id: singerId, name: head.artist || singer }],
      album: { id: albumId, name: "", imageUrl: bigImage(img) },
      duration: msOf(time),
    })
  }
  return out
}

function parseArtistCards(html) {
  const out = []
  const seen = new Set()
  for (const b of String(html || "").split("<li")) {
    const m = /href="\/singer\/([^"\/]+)\.html"[^>]*title="([^"]*)"/.exec(b)
    if (!m || seen.has(m[1])) continue
    seen.add(m[1])
    const img = (/<img[^>]*src="([^"]+)"/.exec(b) || [])[1] || ""
    out.push({ id: m[1], name: decodeEntities(m[2]), imageUrl: bigImage(img) })
  }
  return out
}

function parsePlaylistCards(html) {
  const out = []
  const seen = new Set()
  for (const b of String(html || "").split("<li")) {
    const m = /href="\/playlist\/([^"\/]+)\.html"[^>]*title="([^"]*)"/.exec(b)
    if (!m || seen.has(m[1])) continue
    seen.add(m[1])
    const img = (/<img[^>]*src="([^"]+)"/.exec(b) || [])[1] || ""
    out.push({ id: m[1], name: decodeEntities(m[2]), imageUrl: bigImage(img) })
  }
  return out
}

function parseAlbumCards(html) {
  const out = []
  const seen = new Set()
  for (const b of String(html || "").split("<li")) {
    const m = /href="\/album\/([^"\/]+)\.html"[^>]*title="([^"]*)"/.exec(b)
    if (!m || seen.has(m[1])) continue
    seen.add(m[1])
    const img = (/<img[^>]*src="([^"]+)"/.exec(b) || [])[1] || ""
    out.push({ id: m[1], name: decodeEntities(m[2]), imageUrl: bigImage(img) })
  }
  return out
}

function pageTitle(html, fallback) {
  // 榜单/歌单页真正的标题在列表区的 <div class="title"><h1> 里，
  // 页面最上面的 <h1> 往往是导航（"热门榜单" 之类）
  const at = html.indexOf('class="video_list')
  const zone = at >= 0 ? html.slice(at) : html
  const m = /<h1>([^<]{1,80})<\/h1>/.exec(zone) || /<h1>([^<]{1,80})<\/h1>/.exec(html)
  return decodeEntities(m ? m[1] : fallback || "")
}

// 分页：尾页链接里带最大页码
function lastPage(html, prefix) {
  const re = new RegExp(`href="\\/?${prefix}/(\\d+)\\.html"`, "g")
  let max = 1
  let m
  while ((m = re.exec(html))) max = Math.max(max, Number(m[1]))
  return max
}

function pageOfPath(path) {
  const m = /^(.*?)\/(\d+)\.html$/.exec(String(path || ""))
  if (!m) return { base: path, page: 1 }
  return { base: m[1], page: Number(m[2]) }
}

/* ---------- 首页 / 浏览 ---------- */

const CHARTS = [
  ["top", "音乐飙升榜"],
  ["new", "网络最新榜"],
  ["hot", "网络红歌榜"],
  ["douyin", "抖音热歌榜"],
  ["kuaishou", "快手热歌榜"],
  ["kuwo", "酷我热歌榜"],
  ["ktvtop", "KTV点唱榜"],
  ["djwuqu", "DJ舞曲榜"],
]

function sliceByH1(html, title) {
  const at = html.indexOf(`<h1>${title}</h1>`)
  if (at < 0) return ""
  const next = html.indexOf("<h1>", at + 5)
  return html.slice(at, next > 0 ? next : undefined)
}
async function home() {
  const html = await request(BASE + "/")
  const sections = []

  const fresh = sliceByH1(html, "新歌排行")
  if (fresh) {
    sections.push({
      title: t("新歌排行"),
      tracks: parseTracks(fresh),
      morePage: "list/new.html",
      pageTitle: t("新歌排行"),
      empty: !parseTracks(fresh).length,
    })
  }

  const playlists = parsePlaylistCards(sliceByH1(html, "推荐歌单"))
  if (playlists.length) {
    sections.push({
      title: t("推荐歌单"),
      playlists: playlists.map((p) => ({
        id: "playlist:" + p.id,
        name: p.name,
        imageUrl: p.imageUrl,
        owner: { name: "听听网" },
      })),
      morePage: "playtype/index.html",
      pageTitle: t("推荐歌单"),
    })
  }

  const old = sliceByH1(html, "经典怀旧")
  if (old) {
    sections.push({
      title: t("经典怀旧"),
      tracks: parseTracks(old),
      pageTitle: t("经典怀旧"),
    })
  }

  const singers = parseArtistCards(sliceByH1(html, "推荐歌手"))
  if (singers.length) {
    sections.push({
      title: t("推荐歌手"),
      artists: singers.slice(0, 12),
      morePage: "singerlist/index/index/index/index.html",
      pageTitle: t("推荐歌手"),
    })
  }

  sections.push({
    title: t("排行榜"),
    links: CHARTS.map(([slug, name]) => ({ title: name, page: `list/${slug}.html` })),
    pageTitle: t("排行榜"),
  })

  return {
    title: "听听网",
    subtitle: t("免费 MP3、LRC 歌词"),
    description: t("歌曲来自搜索引擎，站点不存储音频"),
    sections,
  }
}

function tracksSection(title, html, basePath, page) {
  const tracks = parseTracks(html)
  const total = lastPage(html, basePath)
  const more = page < total
  return {
    title,
    sections: [
      {
        title,
        tracks,
        morePage: more ? `${basePath}/${page + 1}.html` : undefined,
        pageTitle: title,
        empty: !tracks.length,
      },
    ],
  }
}
async function browse({ page }) {
  const raw = String(page || "").trim()
  if (!raw || raw === "home" || raw === "index.html") return home()

  const path = raw.replace(/^\//, "")

  if (path === "charts") {
    return {
      title: t("排行榜"),
      sections: [{ title: t("排行榜"), links: CHARTS.map(([slug, name]) => ({ title: name, page: `list/${slug}.html` })) }],
    }
  }

  if (path.startsWith("list/")) {
    const { base, page: n } = pageOfPath(path)
    const slug = base.replace(/^list\//, "").replace(/\.html$/, "")
    const label = (CHARTS.find(([s]) => s === slug) || [])[1] || t("排行榜")
    const html = await request(`${BASE}/${base}${n > 1 ? "/" + n : ""}.html`)
    let title = pageTitle(html, label)
    // 榜单页的 h1 常是一长串 SEO 文案，太长就用导航里的榜名
    if (!title || title.length > 24) title = label
    return tracksSection(title, html, base.replace(/\.html$/, ""), n)
  }

  if (path.startsWith("singerlist")) {
    const html = await request(`${BASE}/${path}`)
    const artists = parseArtistCards(html)
    return {
      title: t("推荐歌手"),
      sections: [{ title: t("推荐歌手"), artists, pageTitle: t("推荐歌手"), empty: !artists.length }],
    }
  }

  if (path.startsWith("playtype") || path.startsWith("playlist")) {
    const html = await request(`${BASE}/${path}`)
    const cards = parsePlaylistCards(html)
    const single = path.startsWith("playlist")
    if (single) {
      const meta = playlistMeta(html, path.replace(/^playlist\//, "").replace(/\.html$/, ""))
      const tracks = parseTracks(html)
      return {
        title: meta.name,
        subtitle: meta.description,
        imageUrl: meta.imageUrl,
        sections: [{ title: meta.name, tracks, pageTitle: meta.name, empty: !tracks.length }],
      }
    }
    return {
      title: t("歌单"),
      sections: [
        {
          title: t("歌单"),
          playlists: cards.map((p) => ({
            id: "playlist:" + p.id,
            name: p.name,
            imageUrl: p.imageUrl,
            owner: { name: "听听网" },
          })),
          pageTitle: t("歌单"),
          empty: !cards.length,
        },
      ],
    }
  }

  if (path.startsWith("albumlist")) {
    const html = await request(`${BASE}/${path}`)
    const albums = parseAlbumCards(html)
    return {
      title: t("新碟"),
      sections: [{ title: t("新碟"), albums, pageTitle: t("新碟"), empty: !albums.length }],
    }
  }

  if (path.startsWith("singer/")) {
    const { base, page: n } = pageOfPath(path)
    const html = await request(`${BASE}/${base}${n > 1 ? "/" + n : ""}.html`)
    const meta = singerMeta(html, base.replace(/^singer\//, ""))
    return {
      title: meta.name,
      subtitle: meta.description,
      imageUrl: meta.imageUrl,
      sections: [
        {
          title: meta.name,
          tracks: parseTracks(html),
          pageTitle: meta.name,
          morePage: n < lastPage(html, base) ? `${base}/${n + 1}.html` : undefined,
        },
      ],
    }
  }

  if (path.startsWith("album/")) {
    const { base } = pageOfPath(path)
    const html = await request(`${BASE}/${base}.html`)
    const meta = albumMeta(html)
    return {
      title: meta.name,
      imageUrl: meta.imageUrl,
      sections: [{ title: meta.name, tracks: parseTracks(html), pageTitle: meta.name }],
    }
  }

  throw new PluginError("unsupported", t("没有这一页"))
}

/* ---------- 搜索 ---------- */

function searchUrl(query, page) {
  const enc = encodeURIComponent(query)
  return page <= 1 ? `${BASE}/so/${enc}.html` : `${BASE}/so/${enc}/${page}.html`
}
async function search({ query, kind, offset }) {
  const q = String(query || "").trim()
  if (!q) throw new PluginError("unsupported", t("请输入关键词"))
  const page = Math.floor((Number(offset) || 0) / 50) + 1
  const html = await request(searchUrl(q, page))
  const more = page < lastPage(html, `/so/${encodeURIComponent(q)}`)

  if (!kind || kind === "tracks") return { tracks: parseTracks(html), more }

  if (kind === "artists") {
    // 搜索结果里歌手是 <a href="/singer/…" class="singer">名字</a>
    const out = []
    const seen = new Set()
    const re = /href="\/singer\/([^"\/]+)\.html"[^>]*class="singer"[^>]*>(?:<span[^>]*>)?([^<]*)</g
    let m
    while ((m = re.exec(html))) {
      if (seen.has(m[1])) continue
      seen.add(m[1])
      out.push({ id: m[1], name: decodeEntities(m[2]) })
    }
    return { artists: out.slice(0, 20), more: false }
  }
  if (kind === "playlists") {
    const playlists = parsePlaylistCards(html).map((p) => ({
      id: "playlist:" + p.id,
      name: p.name,
      imageUrl: p.imageUrl,
    }))
    return { playlists, more: false }
  }
  if (kind === "albums") return { albums: parseAlbumCards(html), more: false }
  return { [kind]: [], more: false }
}

/* ---------- 歌手 / 专辑 / 歌单 ---------- */

function singerMeta(html, id) {
  const at = html.indexOf('class="singer_info"')
  const block = at >= 0 ? html.slice(at) : html
  const name = decodeEntities((/<h1>([^<]*)<\/h1>/.exec(block) || [])[1] || "")
  const image = bigImage((/<img[^>]*src="([^"]+)"/.exec(block) || [])[1] || "")
  const info = decodeEntities((/<div class="info">[\s\S]{0,40}?<p[^>]*>([\s\S]*?)<\/p>/.exec(block) || [])[1] || "")
  return { id: String(id || ""), name, imageUrl: image, description: info.replace(/<[^>]+>/g, "") }
}

function albumMeta(html) {
  const i = html.indexOf('class="singer_info"')
  const block = i >= 0 ? html.slice(i) : html
  const name = decodeEntities((/<h1>([^<]*)<\/h1>/.exec(block) || [])[1] || "")
  const image = bigImage((/<img[^>]*src="([^"]+)"/.exec(block) || [])[1] || "")
  const info = decodeEntities((/<div class="info">[\s\S]{0,40}?<p[^>]*>([\s\S]*?)<\/p>/.exec(block) || [])[1] || "")
  const artist = decodeEntities((/href="\/singer\/([^"\/]+)\.html"[^>]*>([^<]*)</.exec(block) || [])[2] || "")
  const released = (/发行时间：<span>([^<]*)<\/span>/.exec(html) || [])[1] || ""
  return {
    name,
    imageUrl: image,
    description: info.replace(/<[^>]+>/g, "").trim(),
    artist: artist,
    released,
  }
}

function playlistMeta(html, id) {
  const i = html.indexOf('class="singer_info"')
  const block = i >= 0 ? html.slice(i) : html
  const name = decodeEntities((/<h1>([^<]*)<\/h1>/.exec(block) || [])[1] || "")
  const image = bigImage((/<img[^>]*src="([^"]+)"/.exec(block) || [])[1] || "")
  const info = decodeEntities((/<div class="info">([\s\S]*?)<\/div>/.exec(block) || [])[1] || "")
  const count = Number((/共有<span>(\d+)<\/span>/.exec(html) || [])[1] || 0)
  return {
    id: "playlist:" + String(id || ""),
    name,
    imageUrl: image,
    description: info.replace(/<[^>]+>/g, "").trim(),
    trackCount: count,
  }
}
async function artist({ id }) {
  const html = await request(`${BASE}/singer/${encodeURIComponent(id)}.html`)
  const meta = singerMeta(html, id)
  if (!meta.name) throw new PluginError("unavailable", t("这位歌手在听听网上找不到了"))
  const tracks = parseTracks(html)
  return {
    artist: { id: String(id), name: meta.name, imageUrl: meta.imageUrl },
    tracks,
    albums: [],
  }
}
async function album({ id }) {
  const raw = String(id || "")
  const pid = raw.replace(/^playlist:/, "")
  const isPlaylist = raw.startsWith("playlist:") || raw.startsWith("playlist/")
  const clean = pid.replace(/^playlist\//, "").replace(/\.html$/, "")
  if (isPlaylist) {
    const html = await request(`${BASE}/playlist/${encodeURIComponent(clean)}.html`)
    const meta = playlistMeta(html, clean)
    if (!meta.name) throw new PluginError("unavailable", t("这个歌单在听听网上找不到了"))
    return {
      album: {
        id: "playlist:" + clean,
        name: meta.name,
        imageUrl: meta.imageUrl,
        description: meta.description,
        artists: [{ name: "听听网" }],
      },
      tracks: parseTracks(html),
    }
  }
  const html = await request(`${BASE}/album/${encodeURIComponent(clean)}.html`)
  const meta = albumMeta(html)
  if (!meta.name) throw new PluginError("unavailable", t("这张专辑在听听网上找不到了"))
  return {
    album: {
      id: clean,
      name: meta.name,
      imageUrl: meta.imageUrl,
      description: meta.description,
      artists: meta.artist ? [{ name: meta.artist }] : [],
      released: meta.released,
    },
    tracks: parseTracks(html),
  }
}

/* ---------- 歌词 / 播放 ---------- */
async function lyrics({ id }) {
  await loadSession()
  const url = `${BASE}/plug/down.php?ac=music&lk=lrc&id=${encodeURIComponent(id)}`
  const res = await fetch(url, { headers: headers(), redirect: "follow" })
  if (!res.ok) throw new PluginError("response", `听听网返回 ${res.status}`)
  const text = await res.text()
    if (isWall(text)) throw new PluginError("response", t("听听网的人机验证没过去，稍后再试"))
  const lrc = text
    .split(/\r?\n/)
    .filter((line) => !/^\[[^\]]*\].*欢迎来访听听网/.test(line.trim()))
    .join("\n")
    .trim()
  if (!lrc) throw new PluginError("unavailable", t("这首歌没有歌词"))
  return { lrc }
}
async function stream({ id, quality }) {
  await loadSession()
  const body = `id=${encodeURIComponent(id)}&type=music`
  const res = await fetch(`${BASE}/js/play.php`, {
    method: "POST",
    headers: headers({
      "content-type": "application/x-www-form-urlencoded",
      referer: `${BASE}/t/${encodeURIComponent(id)}.html`,
    }),
    body,
  })
  let data = null
  try {
    data = await res.json()
  } catch (e) {
    data = null
  }
  if (!data || Number(data.msg) !== 1 || !data.lkid) {
    throw new PluginError("unavailable", t("这首歌在听听网上没有试听地址"))
  }
  const rid = "MUSIC_" + String(data.lkid)
  const url = await kuwoUrl(rid)
  if (!url) throw new PluginError("unavailable", t("酷我没有给出这首歌的播放地址"))
  return { url, type: "mp3", quality }
}

async function kuwoUrl(rid) {
  try {
    const res = await fetch(KUWO + encodeURIComponent(rid), { headers: { "user-agent": UA } })
    const text = (await res.text()).trim()
    if (text.startsWith("http")) return text
  } catch (e) {
    /* 下面再试一次 */
  }
  try {
    const res = await fetch(`http://antiserver.kuwo.cn/anti.s?type=convert_url&format=mp3&response=url&rid=${encodeURIComponent(rid)}`, {
      headers: { "user-agent": UA },
    })
    const text = (await res.text()).trim()
    if (text.startsWith("http")) return text
  } catch (e) {
    /* 放弃 */
  }
  return ""
}

/* ---------- 榜单（stations 形式） ---------- */
async function stations() {
  const thumb = ""
  return CHARTS.map(([slug, name]) => ({
    id: `list:${slug}`,
    name,
    description: t("听听网排行榜，持续播放"),
    imageUrl: thumb,
  }))
}

const served = new Set()
async function stationNext({ id }) {
  const m = /^list:([a-z]+)$/.exec(String(id || ""))
  if (!m) throw new PluginError("unsupported", t("不支持的榜单"))
  if (served.has(id)) return []
  served.add(id)
  const html = await request(`${BASE}/list/${m[1]}.html`)
  return parseTracks(html)
}
async function suggest({ query }) {
  const q = String(query || "").trim()
  if (!q) return []
  try {
    const html = await request(searchUrl(q, 1))
    return parseTracks(html).slice(0, 8).map((x) => x.name)
  } catch (e) {
    return []
  }
}
return { home, browse, search, artist, album, lyrics, stream, stations, stationNext, suggest };
})(__mfRuntime.host, __mfRuntime.fetch, __mfRuntime.TextDecoder, __mfRuntime.atob, __mfRuntime.btoa, __mfRuntime.URL, __mfRuntime.URLSearchParams);
module.exports = __mfRuntime.makePlugin(__mfPlugin, {"id": "tingting", "name": "听听网", "version": "1.0.1", "site": "www.ttw.cx", "searchTypes": ["music", "album", "artist"]});
