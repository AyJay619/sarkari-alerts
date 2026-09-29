// Tests for the newer site-reading options against a FAKE local web server. Run:  node test/fetchers.test.mjs
import http from "node:http";
import { fetchItems } from "../src/fetchers.mjs";

let n = 0, bad = 0;
const check = (name, ok, extra = "") => { n++; if (!ok) bad++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`); };

let lastPost = null;
const server = http.createServer((req, res) => {
  let body = ""; req.on("data", c => (body += c)); req.on("end", () => {
    const send = (type, text) => { res.setHeader("content-type", type); res.end(text); };
    if (req.url === "/var") return send("text/html", `<script>var other = 1; var glblList = [{"t":"Recruitment of A [x]","u":"/a"},{"t":"Counsellor FLC post","u":"/b"},{"t":"Advt with \\"quote\\" and ] bracket","u":"/c"}]; var after = 2;</script>`);
    if (req.url === "/rsc") { lastPost = { method: req.method, action: req.headers["next-action"], body }; return send("text/x-component", `0:["$@1"]\n1:{"data":{"data":[{"value":"Notice one","_id":"1"},{"value":"Notice two","_id":"2"}]}}\n`); }
    if (req.url === "/rows") return send("text/html", `<table><tr><td>Advt for X</td><td>DETAILED ADVERTISEMENT (ENGLISH) Publish Date -: 20-Apr-2026 06:30 PM End Date -: 01-Jun-2026 File Size -: 1 MB</td></tr></table>
      <ul><li><a href="/p1.pdf">Engagement of graduate apprentices [NEW]</a></li><li><a href="/p2.pdf">Old notice about engagement of staff</a></li></ul>`);
    res.statusCode = 404; res.end("no");
  });
}).listen(8814);
const B = "http://127.0.0.1:8814";

// a list held in a JavaScript variable, with brackets and quotes inside strings
let items = await fetchItems({ type: "json", url: B + "/var", jsonInPage: "glblList", titleField: "t", linkField: "u", linkPrefix: B, exclude: "counsellor" });
check("list inside a page variable is read", items.length === 2 && items[0].title === "Recruitment of A [x]" && items[1].title.includes("] bracket"), JSON.stringify(items.map(i => i.title)));
check("exclude works on JSON titles", !items.some(i => /counsellor/i.test(i.title)));
try { await fetchItems({ type: "json", url: B + "/var", jsonInPage: "nope", titleField: "t" }); check("missing variable is an error", false); } catch (e) { check("missing variable is an error", /not found/.test(e.message)); }

// POST with a raw body and a "N:{json}" reply (Next.js server action, AIIMS)
items = await fetchItems({ type: "json", url: B + "/rsc", method: "POST", headers: { "Next-Action": "abc123" }, body: '["page=1"]', rscLine: "1", itemsPath: "data.data", titleField: "value", fallbackLink: B + "/notice" });
check("server-action reply is read", items.map(i => i.title).join() === "Notice one,Notice two" && items[0].link === B + "/notice");
check("the raw body and header were sent", lastPost.method === "POST" && lastPost.action === "abc123" && lastPost.body === '["page=1"]');

// titles
items = await fetchItems({ type: "html", url: B + "/rows", rowSelector: "tr", rowTitle: "td:nth-child(2)", titleReplace: ["\\s*Publish Date\\s*-?:?\\s*(\\d{1,2}-\\w{3}-\\d{4}).*$", " (published $1)"], pageLink: true, minTitle: 10 });
check("titleReplace shortens a row title", items[0].title === "DETAILED ADVERTISEMENT (ENGLISH) (published 20-Apr-2026)", items[0]?.title);
items = await fetchItems({ type: "html", url: B + "/rows", selector: "li a", minTitle: 10 });
check("a [NEW] badge is not part of the title", items[0].title === "Engagement of graduate apprentices", items[0]?.title);

server.closeAllConnections(); server.close();
console.log(`\n${n - bad}/${n} checks passed`);
process.exitCode = bad ? 1 : 0;
