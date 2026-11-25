// 显示名：听澜书阁（ysxs1）
// MusicFree plugin generated from MyGo Music plugin; source site: 听澜书阁
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
const BASE = "https://ysxs1.com.cn";
const HOME_URL = BASE + "/";

const SECTION_META = {
  hot: { key: "hot", title: "热播有声小说精选" },
  new: { key: "new", title: "新书上架 · 有声小说每日更新" },
  short: { key: "short", title: "短剧速听 · 一集十分钟" },
  dman: { key: "dman", title: "动漫广播剧 · 二次元必听" },
  pick: { key: "pick", title: "编辑私藏 · 冷门但好听" },
};

const PREFIX_SECTION = { w: "hot", n: "new", s: "short", d: "dman", p: "pick" };

const CATEGORY_LINKS = [
  { title: "悬疑有声小说", page: "category:悬疑" },
  { title: "玄幻有声小说", page: "category:玄幻" },
  { title: "都市有声小说", page: "category:都市" },
  { title: "言情有声小说", page: "category:言情" },
  { title: "历史有声小说", page: "category:历史" },
  { title: "科幻有声小说", page: "category:科幻" },
  { title: "刑侦推理", page: "category:刑侦" },
  { title: "短剧广播剧", page: "category:短剧" },
  { title: "动漫广播剧", page: "category:动漫" },
];

const NOTICE = "站点为展示示例，页面没有真实音频；插件只提供目录浏览，不提供播放。";

let cache = null;
let cacheAt = 0;

function decodeEntities(value) {
  return String(value || "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;|&apos;/g, "'");
}

function stripTags(value) {
  return decodeEntities(String(value || "").replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function attr(attrs, name) {
  const m = attrs.match(new RegExp(name + "\\s*=\\s*\"([^\"]*)\"", "i"));
  return m ? decodeEntities(m[1]) : "";
}

function absUrl(value) {
  if (!value) return "";
  try {
    return new URL(decodeEntities(value), BASE).toString();
  } catch (_) {
    return "";
  }
}

function sectionOf(id) {
  return PREFIX_SECTION[String(id || "").charAt(0)] || "hot";
}

function parseCatalog(html) {
  const items = [];
  const seen = new Set();
  const re = /<article\b([^>]*)>([\s\S]*?)<\/article>/gi;
  let m;
  while ((m = re.exec(html))) {
    const attrs = m[1];
    const body = m[2];
    const cls = attr(attrs, "class");
    if (!/\b(acard|row-item)\b/.test(cls)) continue;

    const id = attr(attrs, "data-work") || ("id-" + items.length);
    if (seen.has(id)) continue;
    seen.add(id);

    const name = stripTags((body.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/i) || [])[1]);
    if (!name) continue;

    const imgTag = (body.match(/<img\b([^>]*)>/i) || [])[1] || "";
    const imageUrl = absUrl(attr(imgTag, "data-src") || attr(imgTag, "src"));

    const cardMeta = stripTags((body.match(/<p\b[^>]*class="[^"]*card-meta[^"]*"[^>]*>([\s\S]*?)<\/p>/i) || [])[1]);
    const chips = [];
    const chipRe = /<span\b[^>]*class="[^"]*chip[^"]*"[^>]*>([\s\S]*?)<\/span>/gi;
    let c;
    while ((c = chipRe.exec(body))) {
      const text = stripTags(c[1]);
      if (text) chips.push(text);
    }

    const rowText = stripTags((body.match(/<p\b(?![^>]*card-meta)[^>]*>([\s\S]*?)<\/p>/i) || [])[1]);
    const badge = stripTags((body.match(/<span\b[^>]*class="[^"]*badge[^"]*"[^>]*>([\s\S]*?)<\/span>/i) || [])[1]);

    let category = "";
    let episodes = 0;
    const episodeText = cardMeta || chips[chips.length - 1] || "";
    const em = episodeText.match(/(\d+)\s*集/);
    if (em) episodes = Number(em[1]);

    if (cardMeta) {
      const parts = cardMeta.split(/[·|]/).map((x) => x.trim()).filter(Boolean);
      category = parts[0] || "";
    } else if (chips.length) {
      category = chips[0];
      if (/\d+\s*集/.test(category)) category = "";
    }

    const section = sectionOf(id);
    items.push({
      id,
      name,
      imageUrl,
      category,
      episodes,
      section,
      badge,
      description: rowText || cardMeta,
      tags: chips.filter((x) => !/\d+\s*集/.test(x)),
    });
  }
  return items;
}

async function catalog() {
  if (cache && Date.now() - cacheAt < 10 * 60 * 1000) return cache;
  const res = await fetch(HOME_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; MyGoMusic/1.0)" },
  });
  if (!res.ok) throw fail("unavailable", "听澜书阁首页请求失败：HTTP " + res.status);
  cache = parseCatalog(await res.text());
  cacheAt = Date.now();
  if (!cache.length) throw fail("unavailable", "听澜书阁首页没有解析到作品");
  return cache;
}

function albumOf(item) {
  return {
    id: item.id,
    name: item.name,
    imageUrl: item.imageUrl,
    artists: [],
    released: "",
  };
}

function albumsFor(items) {
  return items.map(albumOf);
}

function fail(code, message) {
  const err = new Error(message);
  err.code = code;
  return err;
}

function haystack(item) {
  return [item.name, item.category, item.section, item.badge, ...(item.tags || [])]
    .join(" ")
    .toLowerCase();
}

function filterCategory(items, keyword) {
  const q = String(keyword || "").trim().toLowerCase();
  if (!q) return items;
  return items.filter((item) => haystack(item).includes(q));
}

function sectionPage(sectionKey, items) {
  const meta = SECTION_META[sectionKey] || { title: "听澜书阁" };
  return {
    title: meta.title,
    subtitle: items.length + " 部作品",
    description: NOTICE,
    sections: [
      {
        title: meta.title,
        albums: albumsFor(items),
        empty: "这一栏暂时没有作品",
      },
    ],
  };
}
async function home() {
  const items = await catalog();
  const sections = [];
  for (const key of ["hot", "new", "short", "dman", "pick"]) {
    const list = items.filter((x) => x.section === key);
    if (!list.length) continue;
    sections.push({
      title: SECTION_META[key].title,
      albums: albumsFor(list),
      morePage: "section:" + key,
    });
  }
  sections.push({
    title: "分类栏目",
    links: CATEGORY_LINKS,
  });
  return {
    title: "听澜书阁",
    subtitle: "有声小说展示目录 · " + items.length + " 部作品",
    description: NOTICE,
    sections,
  };
}
async function browse({ page } = {}) {
  const items = await catalog();
  const key = String(page || "all");

  if (key.startsWith("section:")) {
    const sectionKey = key.slice(8);
    return sectionPage(sectionKey, items.filter((x) => x.section === sectionKey));
  }

  if (key.startsWith("category:")) {
    const keyword = decodeURIComponent(key.slice(9));
    const list = filterCategory(items, keyword);
    return {
      title: keyword + "有声小说",
      subtitle: list.length + " 部作品",
      description: NOTICE,
      sections: [
        {
          title: keyword + " · 筛选结果",
          albums: albumsFor(list),
          empty: "没有找到“" + keyword + "”相关作品",
        },
        { title: "换个分类", links: CATEGORY_LINKS },
      ],
    };
  }

  const sections = [];
  for (const sectionKey of ["hot", "new", "short", "dman", "pick"]) {
    const list = items.filter((x) => x.section === sectionKey);
    if (!list.length) continue;
    sections.push({
      title: SECTION_META[sectionKey].title,
      albums: albumsFor(list),
      morePage: "section:" + sectionKey,
    });
  }
  sections.push({ title: "分类栏目", links: CATEGORY_LINKS });
  return {
    title: "全部作品",
    subtitle: items.length + " 部有声小说 / 广播剧",
    description: NOTICE,
    sections,
  };
}
async function search({ query, kind } = {}) {
  const items = await catalog();
  const q = String(query || "").trim();
  const list = q
    ? items.filter((item) => haystack(item).includes(q.toLowerCase()))
    : items;

  if (kind === "albums") {
    return { albums: albumsFor(list), more: false };
  }
  if (kind === "tracks") {
    return { tracks: [], more: false };
  }
  return {
    tracks: [],
    albums: albumsFor(list),
    artists: [],
    playlists: [],
    shows: [],
    more: false,
  };
}
async function suggest({ query } = {}) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return [];
  const items = await catalog();
  return items
    .filter((item) => haystack(item).includes(q))
    .slice(0, 10)
    .map((item) => item.name);
}
async function album({ id } = {}) {
  const items = await catalog();
  const item = items.find((x) => x.id === id);
  if (!item) throw fail("unavailable", "没有找到这部作品：" + id);
  return {
    album: albumOf(item),
    tracks: [
      {
        id: item.id + "-notice",
        name: "作品说明 · 本站暂无音频",
        artists: [],
        album: albumOf(item),
        duration: 0,
        unavailable: true,
        url: BASE + "/",
        description: NOTICE,
      },
    ],
  };
}
async function stream() {
  throw fail("unsupported", "听澜书阁是展示示例页，没有真实音源");
}
return { home, browse, search, suggest, album, stream };
})(__mfRuntime.host, __mfRuntime.fetch, __mfRuntime.TextDecoder, __mfRuntime.atob, __mfRuntime.btoa, __mfRuntime.URL, __mfRuntime.URLSearchParams);
module.exports = __mfRuntime.makePlugin(__mfPlugin, {"id": "ysxs1", "name": "听澜书阁", "version": "1.0.0", "site": "听澜书阁", "searchTypes": ["music", "album"]});
