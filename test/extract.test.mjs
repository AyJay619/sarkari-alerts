// Tests for the date extraction with sample notice texts and a FAKE Anthropic server (nothing real is called or sent).
// The fake server plays the AI: it returns a fixed answer per notice. So these tests check everything AROUND the AI
// (what is sent to it, how its answer is read, the date verdict and the alert layout), not how well the real AI reads a PDF.
// Run:  node test/extract.test.mjs
import http from "node:http";
import { buildSnippet, dateStatus, detailLines, parseReply, todayIST } from "../src/extract.mjs";
import { Classifier, loadConfig } from "../src/classify.mjs";
import { formatItem } from "../src/telegram.mjs";
import { parseAlert } from "../src/inbox.mjs";

let n = 0, bad = 0;
const check = (name, ok, extra = "") => { n++; if (!ok) bad++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`); };

const NOW = Date.parse("2026-09-29T10:00:00Z");   // 29 Sep 2026 (India)
const TODAY = todayIST(NOW);
check("today in India", TODAY === "2026-09-29");

// ---- sample notices: what the PDF text looks like, and what the (fake) AI answers for it ----
const R = o => JSON.stringify({ category: "Job", post: null, vacancies: null, start: null, last: null, old_last: null, type: "fresh", verdict: "post", rule: "open public recruitment", ...o });
const filler = "General instructions and eligibility conditions apply to all candidates. ".repeat(60);   // ~4,000 characters
const SAMPLES = {
  fresh: {
    title: "Recruitment of Junior Engineer 2026 (Advt No. 05/2026)", pages: ["Advertisement for 120 posts of Junior Engineer.\nOnline application opens on 20/09/2026.", filler, "Last date for submission of online application: 15 October 2026."],
    reply: R({ post: "Junior Engineer", vacancies: 120, start: "2026-09-20", last: "2026-10-15" }),
    expect: ["🧾 Post: Junior Engineer", "👥 Vacancies: 120", "📅 Start: 20 Sep · Last date: 15 Oct", "✅ Open till 15 Oct"],
  },
  extendsPassed: {
    title: "Corrigendum: extension of last date for Advt 03/2026", pages: ["Corrigendum. The last date to apply, earlier 12.09.2026, is extended up to 30.10.2026."],
    reply: R({ category: "Correction", type: "extension", old_last: "2026-09-12", last: "2026-10-30" }),
    expect: ["🔁 Last date extended: 12 Sep → 30 Oct ✅ Open again"],
  },
  newDatePassedToo: {
    title: "Corrigendum for Advt 07/2026 (revised last date)", pages: ["Revised last date of application is 20.09.2026 (earlier 05.09.2026)."],
    reply: R({ category: "Correction", type: "corrigendum", old_last: "2026-09-05", last: "2026-09-20" }),
    expect: ["🔁 Last date extended: 5 Sep → 20 Sep ⛔ Last date passed"],
  },
  hindi: {
    title: "Recruitment of Constable 2026 (Hindi notice)", pages: ["भर्ती विज्ञापन\nऑनलाइन आवेदन की अंतिम तिथि १५ अक्टूबर २०२६ है।"],
    reply: R({ post: "Constable", last: "2026-10-15" }),
    expect: ["📅 Last date: 15 Oct", "✅ Open till 15 Oct"],
  },
  dotted: {
    title: "Recruitment of Clerk 2026", pages: ["Vacancy notice.\nLast date: 15.10.2026 (till 11:59 PM)"],
    reply: R({ post: "Clerk", vacancies: 1250, last: "2026-10-15" }),
    expect: ["👥 Vacancies: 1,250", "✅ Open till 15 Oct"],
  },
  noDates: {
    title: "Recruitment of Assistant 2026", pages: ["Applications are invited for the post of Assistant. Details will be available on the website."],
    reply: R({ post: "Assistant" }),
    expect: ["🧾 Post: Assistant", "⚠️ Dates not found — check PDF"],
  },
  closesToday: { title: "Recruitment of Driver 2026 A", pages: ["Last date 29.09.2026"], reply: R({ last: "2026-09-29" }), expect: ["⏳ Closes today"] },
  closesSoon: { title: "Recruitment of Driver 2026 B", pages: ["Last date 01.10.2026"], reply: R({ last: "2026-10-01" }), expect: ["⚠️ Closes in 2 days (1 Oct)"] },
  passed: { title: "Recruitment of Driver 2026 C", pages: ["Last date 12.09.2026"], reply: R({ last: "2026-09-12" }), expect: ["⛔ Last date passed (12 Sep)"] },
  notOpenYet: { title: "Recruitment of Driver 2026 D", pages: ["Apply from 05.10.2026 to 25.10.2026"], reply: R({ start: "2026-10-05", last: "2026-10-25" }), expect: ["🕒 Not open yet — starts 5 Oct (till 25 Oct)"] },
  skipRule: { title: "Recruitment of Consultant 2026", pages: ["Consultant on contract, 2 posts. Last date 10.10.2026"], reply: R({ post: "Consultant", vacancies: 2, last: "2026-10-10", verdict: "skip", rule: "consultant under 5 posts" }), expect: [] },
  brokenJson: { title: "Recruitment of Peon 2026", pages: ["Some text about a peon post."], reply: "Sorry, here is what I found: post = peon" },
  guessedDate: { title: "Recruitment of Guard 2026", pages: ["Some text."], reply: R({ last: "2031-01-01", start: "2026-02-30" }), expect: ["⚠️ Dates not found — check PDF"] },
};
const bySample = Object.values(SAMPLES);

// ---- the pieces alone ----
const snip = buildSnippet(SAMPLES.fresh.pages);
check("snippet keeps the start of the PDF", snip.startsWith("Advertisement for 120 posts"));
check("snippet includes the date line found deep in the PDF (page 3)", snip.includes("Last date for submission of online application: 15 October 2026"));
check("snippet stays within ~6,000 characters", buildSnippet(["x ".repeat(20000), "Last date 15.10.2026"]).length <= 6000);
check("snippet catches a Hindi date line far from the start", buildSnippet([filler, "आवेदन की अंतिम तिथि १५ अक्टूबर २०२६"]).includes("अंतिम तिथि"));
check("snippet catches a long one-paragraph PDF", buildSnippet(["blah ".repeat(1500) + " last date is 15.10.2026 " + "blah ".repeat(200)]).includes("15.10.2026"));
check("status: passed / today / soon / open",
  [dateStatus("2026-09-28", TODAY).kind, dateStatus("2026-09-29", TODAY).kind, dateStatus("2026-10-02", TODAY).kind, dateStatus("2026-10-03", TODAY).kind].join() === "passed,today,soon,open");
check("a date in another year shows the year", detailLines({ last: "2027-01-05", type: "fresh" }, TODAY).includes("✅ Open till 5 Jan 2027"));
let threw = 0; for (const bad of ["", "no json", '{"category": "Banana"}', "{broken"]) try { parseReply(bad, TODAY); } catch { threw++; }
check("unusable AI answers are rejected", threw === 4);
check("a nonsense date becomes 'not found'", parseReply(SAMPLES.guessedDate.reply, TODAY).last === null && parseReply(SAMPLES.guessedDate.reply, TODAY).start === null);
check("scanned PDF", detailLines(parseReply(R({}), TODAY), TODAY, { scanned: true }).join() === "📷 scanned — dates not found");

// ---- the whole chain with a fake AI ----
const prompts = [];
const server = http.createServer((req, res) => {
  let body = ""; req.on("data", c => (body += c)); req.on("end", () => {
    const prompt = JSON.parse(body).messages[0].content; prompts.push(prompt);
    const hit = bySample.find(x => prompt.includes("Title: " + x.title));
    const text = hit ? hit.reply : R({ category: "Job", type: "fresh" });
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ content: [{ type: "text", text }], usage: { input_tokens: 1500, output_tokens: 90 } }));
  });
}).listen(8812);
process.env.ANTHROPIC_BASE_URL = "http://127.0.0.1:8812";

const cfg = { ...loadConfig(), maxAiCallsPerRun: 60, maxAiCallsPerDay: 150 };
const pdfs = Object.fromEntries(bySample.map((x, i) => [`https://x.gov.in/${i}.pdf`, x]));
const readPdf = async url => ({ text: buildSnippet(pdfs[url].pages), scanned: !!pdfs[url].scanned });
const mk = (over = {}, c = cfg) => new Classifier(c, { apiKey: "test", now: () => NOW, readPdf, rules: "SKIP: consultants under 5 posts.\nPOST: open public recruitment.", ...over });
const src = { name: "Test site" };
const urlOf = x => Object.keys(pdfs).find(u => pdfs[u] === x);
const decide = (ai, x) => ai.decide(src, { title: x.title, link: urlOf(x) });

const ai = mk();
for (const [name, x] of Object.entries(SAMPLES)) {
  if (name === "brokenJson" || name === "skipRule") continue;
  const d = await decide(ai, x);
  const lines = d.extra?.body ?? [];
  check(`${name}: shows ${x.expect.join(" | ")}`, x.expect.every(e => lines.includes(e)), lines.join(" / "));
}
const lastPrompt = prompts.find(p => p.includes("Title: " + SAMPLES.fresh.title));
check("AI is told today's date and year", lastPrompt.includes("Today's date in India: 2026-09-29") && lastPrompt.includes("year is 2026"));
check("AI gets the editorial rules", lastPrompt.includes("SKIP: consultants under 5 posts."));
check("AI gets the date line from page 3", lastPrompt.includes("Last date for submission of online application: 15 October 2026"));
check("Hindi line reaches the AI", prompts.some(p => p.includes("१५ अक्टूबर २०२६")));
check("prompt is not longer than ~6,000 characters of notice text", Math.max(...prompts.map(p => p.length)) < 9000);

// skip verdict: still sent, marked
const d1 = await decide(ai, SAMPLES.skipRule);
check("skip verdict: still sent", d1.send === true);
const skipAlert = formatItem("Test site", "Job", SAMPLES.skipRule.title, "https://x.gov.in/9.pdf", d1.flag, "central", d1.extra);
check("skip verdict: marked with the rule", skipAlert.includes("🙈 AI says skip: consultant under 5 posts"), "\n" + skipAlert);

// broken JSON -> old behaviour + unchecked
const d2 = await decide(ai, SAMPLES.brokenJson);
check("broken JSON: sent, tagged unchecked, keyword category kept", d2.send && d2.flag === "unchecked" && d2.category == null && !d2.extra);

// cache: the same link is not asked twice
const before = ai.calls; await decide(ai, SAMPLES.fresh);
check("answer is cached per link (no second AI call)", ai.calls === before);

// scanned PDF / unreadable PDF / web page
pdfs["https://x.gov.in/scan.pdf"] = { title: "Recruitment of Scanner 2026", pages: [""], scanned: true, reply: R({ post: "Scanner", last: "2026-10-10" }) }; bySample.push(pdfs["https://x.gov.in/scan.pdf"]);
const d3 = await ai.decide(src, { title: "Recruitment of Scanner 2026", link: "https://x.gov.in/scan.pdf" });
check("scanned PDF: '📷 scanned — dates not found' (AI's dates ignored)", d3.extra.body.join("|").endsWith("📷 scanned — dates not found") || d3.extra.body[0] === "📷 scanned — dates not found", d3.extra.body.join(" / "));
const ai2 = mk({ readPdf: async () => { throw new Error("HTTP 404"); } });
const d4 = await ai2.decide(src, { title: "Recruitment of Ghost 2026 (gone)", link: "https://x.gov.in/gone.pdf" });
check("PDF cannot be downloaded: title only, dates not found", d4.send && d4.extra.body.at(-1) === "⚠️ Dates not found — check PDF", d4.extra?.body?.join(" / "));
const calls0 = ai2.calls;
const d5 = await ai2.decide(src, { title: "Recruitment of Web 2026", link: "https://x.gov.in/page.html" });
check("web page link: no AI call, says dates not checked", ai2.calls === calls0 && d5.extra.body[0].startsWith("⚠️ Dates not checked"));

// other categories keep the old rules: no AI call
const ai3 = mk();
for (const t of ["Admit Card for Exam 2026", "Result of Exam 2026", "Answer Key of Exam 2026"]) await ai3.decide(src, { title: t, link: "https://x.gov.in/a.pdf" });
check("Admit Card / Result / Answer Key: no AI call", ai3.calls === 0);
check("irrelevant title skipped without AI", (await ai3.decide(src, { title: "Tender for supply of chairs", link: "https://x.gov.in/t.pdf" })).send === false && ai3.calls === 0);

// unclear title: the AI decides the category; Job gets dates, Not Relevant is skipped
const dU = await mk().decide(src, { title: "Important notice regarding posts", link: "https://x.gov.in/u.pdf" });
check("unclear title: AI's category is used", dU.send && dU.category === "Job");

// limits
const cfgSmall = { ...cfg, maxAiCallsPerDay: 2 };
const ai4 = mk({}, cfgSmall);
await decide(ai4, SAMPLES.fresh); await decide(ai4, SAMPLES.dotted);
const d6 = await decide(ai4, SAMPLES.noDates);
check("daily limit: alert still sent, flagged 'dates not checked (limit)'", d6.send && d6.flag === "limit" && formatItem("T", "Job", "x", "https://x", d6.flag).includes("🤖 dates not checked (limit)"));
const ai5 = mk({ now: () => NOW + 86400000 });
ai5.cache = ai4.cache;   // yesterday's counter
check("daily counter starts again the next day", (await decide(ai5, SAMPLES.closesSoon)).flag !== "limit");

// alert layout + listener parser
const full = formatItem("Test site", "Job", SAMPLES.fresh.title, "https://x.gov.in/0.pdf", null, "central", (await decide(ai, SAMPLES.fresh)).extra);
console.log("\n" + full.replace(/<\/?b>/g, "") + "\n");
const parsed = parseAlert(full.replace(/<\/?b>/g, ""));
check("listener still reads title/source/category/link", parsed?.title === SAMPLES.fresh.title && parsed.source === "Test site" && parsed.category === "Job" && parsed.link === "https://x.gov.in/0.pdf");
check("listener also reads the details lines", parsed.details.includes("✅ Open till 15 Oct"));
const skipParsed = parseAlert(skipAlert.replace(/<\/?b>/g, ""));
check("listener reads the skip mark", skipParsed?.skip === "consultant under 5 posts" && skipParsed.title === SAMPLES.skipRule.title);
check("listener reads the limit flag", parseAlert(formatItem("T", "Job", "Some title here", "https://x.gov.in/a.pdf", "limit"))?.flag === "limit");

server.close();
console.log(`\n${n - bad}/${n} checks passed`);
process.exit(bad ? 1 : 0);
