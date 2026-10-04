// A link text cut off with ".." is replaced by the link's title attribute when that attribute is the full wording. Run:  node test/titleattr.test.mjs
import http from "node:http";
import { fetchItems, fullTitle } from "../src/fetchers.mjs";

let n = 0, bad = 0;
const check = (name, ok, extra = "") => { n++; if (!ok) bad++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`); };

// the function itself
check("cut-off text + full title attribute -> the full title", fullTitle("Recruitment of Assistant Engineer (Civil) in the Irri..", "Recruitment of Assistant Engineer (Civil) in the Irrigation Department, 2026") === "Recruitment of Assistant Engineer (Civil) in the Irrigation Department, 2026");
check("a unicode ellipsis counts as a cut-off", fullTitle("Notice for the post of Junior Engineer in the Elec…", "Notice for the post of Junior Engineer in the Electrical Wing") !== "");
check("text that is not cut off is never replaced", fullTitle("Short notice about the exam", "Completely different long title for that link") === "");
check("a title attribute that does not continue the shown text is ignored", fullTitle("Recruitment of Assistant Engineer in the Irri..", "Tender for supply of stationery to all offices") === "");
check("a title attribute that is not longer is ignored", fullTitle("Recruitment of Assistant Engineer..", "Recruitment of Assistant") === "");
check("a very short stub is not trusted", fullTitle("Notice..", "Notice of the examination schedule") === "");
check("no title attribute -> nothing", fullTitle("Recruitment of Assistant Engineer in the Irri..", "") === "");

// through fetchItems
const page = `<ul>
<li><a href="/a.pdf" title="Recruitment of Assistant Engineer (Civil) in the Irrigation Department 2026">Recruitment of Assistant Engineer (Civil) in the Irri..</a></li>
<li><a href="/b.pdf" title="A different tooltip that must be ignored">Advertisement for the post of Stenographer 2026</a></li>
<li><a href="/c.pdf">Notice about the written examination schedule</a></li>
</ul>`;
const server = http.createServer((req, res) => { res.setHeader("content-type", "text/html"); res.end(page); }).listen(8843);
await new Promise(r => setTimeout(r, 200));
const items = await fetchItems({ id: "t", name: "T", type: "html", url: "http://127.0.0.1:8843/", minTitle: 10 });
check("the cut-off link gets its full title and is marked fromTitleAttr", items[0].title === "Recruitment of Assistant Engineer (Civil) in the Irrigation Department 2026" && items[0].fromTitleAttr === true, items[0].title);
check("the other links keep their shown text and are not marked", items[1].title === "Advertisement for the post of Stenographer 2026" && !items[1].fromTitleAttr && !items[2].fromTitleAttr, JSON.stringify(items.slice(1)));
server.closeAllConnections(); server.close();
console.log(`\n${n - bad}/${n} checks passed`);
process.exitCode = bad ? 1 : 0;
