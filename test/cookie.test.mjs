// "cookieUrl": a source first visits a small address and sends the cookie it gets along with the page request (REC serves a stale Hindi page without it). Run:  node test/cookie.test.mjs
import http from "node:http";
import { fetchItems } from "../src/fetchers.mjs";

let n = 0, bad = 0;
const check = (name, ok, extra = "") => { n++; if (!ok) bad++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`); };

let hits = [];
const server = http.createServer((req, res) => {
  hits.push(req.url + (req.headers.cookie ? " cookie=" + req.headers.cookie : ""));
  if (req.url.startsWith("/ajax")) { res.setHeader("set-cookie", ["lang=en; Path=/; HttpOnly", "sid=abc123; Path=/"]); return res.end("ok"); }
  res.setHeader("content-type", "text/html");
  const english = /lang=en/.test(req.headers.cookie ?? "");
  res.end(english ? '<a href="/en1.pdf">Advertisement for the post of Manager 2026</a>' : '<a href="/hi1.pdf">पुरानी हिंदी सूचना पुरानी हिंदी सूचना</a>');
}).listen(8842);
const B = "http://127.0.0.1:8842";
await new Promise(r => setTimeout(r, 200));

const base = { id: "rec", name: "REC", type: "html", url: B + "/careers", minTitle: 10 };
let items = await fetchItems(base);
check("without cookieUrl the site answers with the stale copy", /पुरानी/.test(items[0].title), items[0].title);

hits = [];
items = await fetchItems({ ...base, cookieUrl: B + "/ajax.php?lang=en" });
check("with cookieUrl the page is read with the cookie and the English copy arrives", /Advertisement for the post of Manager/.test(items[0].title), items[0].title);
check("the cookie address is visited first, then the page with BOTH cookies", hits[0].startsWith("/ajax") && /^\/careers cookie=lang=en; sid=abc123$/.test(hits[1]), hits.join(" | "));

server.closeAllConnections(); server.close();
console.log(`\n${n - bad}/${n} checks passed`);
process.exitCode = bad ? 1 : 0;
