// JSON sources: how the link of each item is built (full addresses kept, relative ones resolved or prefixed). Run:  node test/jsonlinks.test.mjs
import http from "node:http";
import { fetchItems } from "../src/fetchers.mjs";

let n = 0, bad = 0;
const check = (name, ok, extra = "") => { n++; if (!ok) bad++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`); };

const feed = [
  { t: "Relative PDF notice", u: "./assets/notice1.pdf" },
  { t: "Full address notice", u: "https://login.example.org/apply" },
  { t: "Backslash path notice", u: "assets\\notice3.pdf" },
  { t: "Notice without a link", u: "" },
];
const server = http.createServer((req, res) => { res.setHeader("content-type", "application/json"); res.end(JSON.stringify(feed)); }).listen(8841);
const B = "http://127.0.0.1:8841";
await new Promise(r => setTimeout(r, 200));

const base = { id: "j", name: "J", type: "json", url: B + "/cgcat/getScrollJson", titleField: "t", linkField: "u", minTitle: 3 };
let items = await fetchItems(base);
check("a relative link is resolved against the source's own address", items[0].link === B + "/cgcat/assets/notice1.pdf", items[0].link);
check("a full address is kept as it is", items[1].link === "https://login.example.org/apply", items[1].link);
check("backslashes are turned into slashes before resolving", items[2].link === B + "/cgcat/assets/notice3.pdf", items[2].link);
check("an item with no link falls back to the source url", items[3].link === base.url, items[3].link);

items = await fetchItems({ ...base, linkPrefix: "https://files.example.org/", fallbackLink: "https://home.example.org/" });
check("with linkPrefix a relative link gets the prefix (old behaviour)", items[0].link === "https://files.example.org/./assets/notice1.pdf", items[0].link);
check("with linkPrefix a FULL address is no longer prefixed (mixed feeds)", items[1].link === "https://login.example.org/apply", items[1].link);
check("fallbackLink still used for an empty link", items[3].link === "https://home.example.org/", items[3].link);

server.closeAllConnections(); server.close();
console.log(`\n${n - bad}/${n} checks passed`);
process.exitCode = bad ? 1 : 0;
