// Tests for the newer site-reading options against a FAKE local web server. Run:  node test/fetchers.test.mjs
import http from "node:http";
import { fetchItems, isoDate } from "../src/fetchers.mjs";
import { emptyReminder } from "../src/emptycheck.mjs";

let n = 0, bad = 0;
const check = (name, ok, extra = "") => { n++; if (!ok) bad++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`); };

let lastPost = null;
const server = http.createServer((req, res) => {
  let body = ""; req.on("data", c => (body += c)); req.on("end", () => {
    const send = (type, text) => { res.setHeader("content-type", type); res.end(text); };
    if (req.url === "/var") return send("text/html", `<script>var other = 1; var glblList = [{"t":"Recruitment of A [x]","u":"/a"},{"t":"Counsellor FLC post","u":"/b"},{"t":"Advt with \\"quote\\" and ] bracket","u":"/c"}]; var after = 2;</script>`);
    if (req.url === "/rsc") { lastPost = { method: req.method, action: req.headers["next-action"], body }; return send("text/x-component", `0:["$@1"]\n1:{"data":{"data":[{"value":"Notice one","_id":"1"},{"value":"Notice two","_id":"2"}]}}\n`); }
    if (req.url === "/end") return send("text/html", `<ul><li class="b"><span class="t">Engagement of apprentices</span><span class="d">Start 01/09/2026</span><span class="e"> 15/10/2026 </span><a href="/x1">More</a></li><li class="b"><span class="t">Walk-in interview for JRF</span><span class="e">31.02.2026</span><a href="/x2">More</a></li></ul>`);
    if (req.url === "/js") return send("text/html", `<button id="b">English</button><div id="out"></div><script>setTimeout(() => { document.getElementById("b").onclick = () => { document.getElementById("out").innerHTML = '<div class="box"><h2>Built by JavaScript after a click</h2><a href="/f.pdf">file</a></div>'; }; }, 200);</script>`);
    if (req.url === "/rows") return send("text/html", `<table><tr><td>Advt for X</td><td>DETAILED ADVERTISEMENT (ENGLISH) Publish Date -: 20-Apr-2026 06:30 PM End Date -: 01-Jun-2026 File Size -: 1 MB</td></tr></table>
      <ul><li><a href="/p1.pdf">Engagement of graduate apprentices [NEW]</a></li><li><a href="/p2.pdf">Old notice about engagement of staff</a></li></ul>`);
    if (req.url === "/h4") return send("text/html", `<div class="c"><h4>Recruitment of Economists</h4><ul><li><a href="/e1.pdf">Recruitment Notification</a></li></ul><h4>Apprentices 2026</h4><ul><li><a href="/e2.pdf">Apprenticeship Notification</a></li><li><a href="/e3.pdf">List of shortlisted candidates</a></li></ul></div><a href="/nav.pdf">Menu item outside</a>`);
    if (req.url === "/generic") return send("text/html", `<ul><li><a href="/files/2026-09-Advt%20Dir%20Mktg.pdf">Click Here</a></li><li><a href="/files/Secretarial_advertisement.pdf">Click Here</a></li></ul>`);
    if (req.url === "/empty") return send("text/html", `<ul><li>nothing posted</li></ul>`);
    if (req.url === "/pageA") return send("text/html", `<ul><li><a href="/a1.pdf">Notice from page A about engagement</a></li></ul>`);
    if (req.url === "/pageB") return send("text/html", `<ul><li><a href="/b1.pdf">Notice from page B about engagement</a></li></ul>`);
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

// heading-above-the-list pages (Bank of Maharashtra), links that all say "Click Here" (RCF, IDBI), and notices split over several pages
items = await fetchItems({ type: "html", url: B + "/h4", selector: "div.c a[href]", contextPrev: "h4", exclude: "shortlisted", minTitle: 8 });
check("contextPrev puts the heading above the list in front of the link text", items.map(i => i.title).join() === "Recruitment of Economists: Recruitment Notification,Apprentices 2026: Apprenticeship Notification", JSON.stringify(items.map(i => i.title)));
items = await fetchItems({ type: "html", url: B + "/generic", include: "/files/", titleFromHref: true, minTitle: 6 });
check("titleFromHref names a 'Click Here' link after its file", items.map(i => i.title).join() === "2026 09 Advt Dir Mktg,Secretarial advertisement", JSON.stringify(items.map(i => i.title)));
items = await fetchItems({ type: "html", url: B + "/pageA", extraUrls: [B + "/pageB"], selector: "li a", minTitle: 10 });
check("extraUrls merges several pages into one list", items.map(i => i.link).join() === B + "/a1.pdf," + B + "/b1.pdf", JSON.stringify(items.map(i => i.link)));
try { await fetchItems({ type: "html", url: B + "/pageA", extraUrls: [B + "/missing"], selector: "li a", minTitle: 10 }); check("a failing extra page fails the whole source", false); } catch (e) { check("a failing extra page fails the whole source", /404/.test(e.message)); }

// an empty list: a failure normally, fine with allowEmpty; real errors still fail either way
try { await fetchItems({ type: "html", url: B + "/empty", include: "[.]pdf" }); check("an empty list is a failure by default", false); } catch (e) { check("an empty list is a failure by default", /no notices were found/.test(e.message)); }
items = await fetchItems({ type: "html", url: B + "/empty", include: "[.]pdf", allowEmpty: true });
check("allowEmpty: an empty list is fine", Array.isArray(items) && items.length === 0);
try { await fetchItems({ type: "html", url: B + "/missing", allowEmpty: true }); check("allowEmpty does not hide real errors", false); } catch (e) { check("allowEmpty does not hide real errors", /404/.test(e.message)); }

// the 60-day reminder for allowEmpty sources
{ const st = {}; const d0 = new Date("2026-01-01T00:00:00Z"), day = n => new Date(d0.getTime() + n * 86400000);
  check("empty list: no reminder on day 0 or day 59", !emptyReminder(st, 0, day(0)).remind && !emptyReminder(st, 0, day(59)).remind);
  const r = emptyReminder(st, 0, day(60)); check("empty list: reminder on day 60", r.remind && r.days === 60);
  check("empty list: not again the next day, but again after another 60 days", !emptyReminder(st, 0, day(61)).remind && emptyReminder(st, 0, day(120)).remind);
  check("a notice clears the reminder state", !emptyReminder(st, 3, day(130)).remind && st.emptySince === undefined && st.emptyRemindedAt === undefined); }

// the site's own end date per list entry
check("isoDate reads three formats and rejects impossible dates", isoDate("15/10/2026") === "2026-10-15" && isoDate(" 5-1-2027 ") === "2027-01-05" && isoDate("31.02.2026") === null && isoDate("soon") === null);
items = await fetchItems({ type: "html", url: B + "/end", rowSelector: "li.b", rowTitle: ".t", rowLink: "a", rowEndDate: ".e", minTitle: 10 });
check("rowEndDate is read from each entry (bad date -> none)", items[0].endDate === "2026-10-15" && items[1].endDate === undefined, JSON.stringify(items.map(i => i.endDate)));

// the site's own start date per list entry, next to the end date (DRDO)
items = await fetchItems({ type: "html", url: B + "/end", rowSelector: "li.b", rowTitle: ".t", rowLink: "a", rowStartDate: ".d", rowEndDate: ".e", minTitle: 10 });
check("rowStartDate is read from each entry too ('Start 01/09/2026' has no clean date: none; the end date still works)", items[0].endDate === "2026-10-15" && items[0].startDate === "2026-09-01" && items[1].startDate === undefined, JSON.stringify(items.map(i => [i.startDate, i.endDate])));
// a page whose list only exists after JavaScript ran and a button was clicked (FCI), read with the pinned Chromium (falling back to Chrome, then Edge)
try {
  items = await fetchItems({ type: "html", url: B + "/js", render: true, clickText: "English", waitFor: ".box", rowSelector: ".box", rowTitle: "h2", rowLink: "a", minTitle: 10 });
  check("render: true reads a JavaScript-built list after a click", items.length === 1 && items[0].title === "Built by JavaScript after a click" && items[0].link === B + "/f.pdf", JSON.stringify(items));
} catch (e) { check("render: true reads a JavaScript-built list after a click", /browser could not start/.test(e.message), "skipped: " + e.message.slice(0, 80)); }

server.closeAllConnections(); server.close();
console.log(`\n${n - bad}/${n} checks passed`);
process.exitCode = bad ? 1 : 0;
