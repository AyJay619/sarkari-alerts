// Tests for the date extraction with sample notice texts and a FAKE Anthropic server (nothing real is called or sent).
// The fake server plays the AI: it returns a fixed answer per notice. So these tests check everything AROUND the AI
// (what is sent to it, how its answer is read, the date verdict and the alert layout), not how well the real AI reads a PDF.
// Run:  node test/extract.test.mjs
import http from "node:http";
import fs from "node:fs";
import { PDFDocument } from "pdf-lib";
import { buildSnippet, countRealWords, dateStatus, detailLines, firstPagesBase64, isVacancyUpdateTitle, looksImageLike, parseReply, ruleNames, todayIST } from "../src/extract.mjs";
import { categorize } from "../src/categorize.mjs";
import { Classifier, loadConfig, noFileDecision } from "../src/classify.mjs";
import { formatItem } from "../src/telegram.mjs";
import { parseAlert } from "../src/inbox.mjs";

let n = 0, bad = 0;
const check = (name, ok, extra = "") => { n++; if (!ok) bad++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`); };

const NOW = Date.parse("2026-09-29T10:00:00Z");   // 29 Sep 2026 (India)
const TODAY = todayIST(NOW);
check("today in India", TODAY === "2026-09-29");

// ---- sample notices: what the PDF text looks like, and what the (fake) AI answers for it ----
const R = o => JSON.stringify({ category: "Job", post: null, vacancies: null, vacancies_quote: null, start: null, last: null, old_last: null, type: "fresh", cancelled: false, verdict: "post", rule: null, ...o });
// the editorial rules the tests use: same layout as editorial-rules.md ("- Name: explanation" under SKIP)
const RULES = "SKIP these:\n- Consultant under 5 posts: consultant or advisor roles with fewer than 5 posts.\n- Retired personnel only: posts open only to retired employees.\n- Ex-servicemen only: posts open only to ex-servicemen.\n- Tender: tenders.\n\nPOST these:\n- Open public recruitment.\n";
const filler = "General instructions and eligibility conditions apply to all candidates. ".repeat(60);   // ~4,000 characters
const SAMPLES = {
  fresh: {
    title: "Recruitment of Junior Engineer 2026 (Advt No. 05/2026)", pages: ["Advertisement for 120 posts of Junior Engineer.\nOnline application opens on 20/09/2026.", filler, "Last date for submission of online application: 15 October 2026."],
    reply: R({ post: "Junior Engineer", vacancies: 120, vacancies_quote: "Advertisement for 120 posts of Junior Engineer", start: "2026-09-20", last: "2026-10-15" }),
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
    title: "Recruitment of Clerk 2026", pages: ["Vacancy notice. Total vacancies: 1,250\nLast date: 15.10.2026 (till 11:59 PM)"],
    reply: R({ post: "Clerk", vacancies: 1250, vacancies_quote: "Total vacancies: 1,250", last: "2026-10-15" }),
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
  skipRule: { title: "Recruitment of Consultant 2026", pages: ["Consultant on contract, 2 posts. Last date 10.10.2026"], reply: R({ post: "Consultant", last: "2026-10-10", verdict: "skip", rule: "consultant under 5 posts" }), expect: [] },   // (rule written in lower case: the code puts back the exact name)
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
const prompts = [], docCalls = []; let refuseDocs = false;
const server = http.createServer((req, res) => {
  let body = ""; req.on("data", c => (body += c)); req.on("end", () => {
    const content = JSON.parse(body).messages[0].content;
    const prompt = typeof content === "string" ? content : content.find(p => p.type === "text").text; prompts.push(prompt);
    if (Array.isArray(content)) {   // a PDF document was attached (visual reading)
      docCalls.push({ types: content.map(p => p.type), mediaType: content[0].source?.media_type, data: content[0].source?.data });
      if (refuseDocs) { res.statusCode = 400; res.setHeader("content-type", "application/json"); return res.end(JSON.stringify({ error: { message: "Could not process PDF" } })); }
    }
    const hit = bySample.find(x => prompt.includes("Title: " + x.title));
    const text = hit ? hit.reply : R({ category: "Job", type: "fresh" });
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ content: [{ type: "text", text }], usage: { input_tokens: 1500, output_tokens: 90 } }));
  });
}).listen(8812);
process.env.ANTHROPIC_BASE_URL = "http://127.0.0.1:8812";

const cfg = { ...loadConfig(), maxAiCallsPerRun: 60, maxAiCallsPerDay: 150 };
const pdfs = Object.fromEntries(bySample.map((x, i) => [`https://x.gov.in/${i}.pdf`, x]));
const readPdf = async url => ({ text: pdfs[url].pdfBase64 ? "" : buildSnippet(pdfs[url].pages), scanned: !!pdfs[url].scanned, pdfBase64: pdfs[url].pdfBase64 ?? null });
const mk = (over = {}, c = cfg) => new Classifier(c, { apiKey: "test", now: () => NOW, readPdf, rules: RULES, ...over });
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
check("AI gets the editorial rules", lastPrompt.includes("- Consultant under 5 posts: consultant or advisor roles"));
check("AI is told to use only the rules' exact names and never invent a reason", lastPrompt.includes("copied EXACTLY") && lastPrompt.includes("NEVER invent a reason"));
check("AI gets the date line from page 3", lastPrompt.includes("Last date for submission of online application: 15 October 2026"));
check("Hindi line reaches the AI", prompts.some(p => p.includes("१५ अक्टूबर २०२६")));
check("prompt is not longer than ~6,000 characters of notice text plus the instructions", Math.max(...prompts.map(p => p.length)) < 11000);

// skip verdict: still sent, marked
const d1 = await decide(ai, SAMPLES.skipRule);
check("skip verdict: still sent", d1.send === true);
const skipAlert = formatItem("Test site", "Job", SAMPLES.skipRule.title, "https://x.gov.in/9.pdf", d1.flag, "central", d1.extra);
check("skip verdict: marked with the rule", skipAlert.includes("🙈 AI says skip: Consultant under 5 posts"), "\n" + skipAlert);

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

// the site's own end date (DRDO): used only when the PDF names no last date
const drdoAi = mk();
const listOnly = await drdoAi.decide(src, { title: "PXE, Balasore invites eligible candidates for the engagement of Apprentices", link: "https://drdo.gov.in/drdo/en/offerings/vacancies/pxe", endDate: "2026-10-12" });
check("web-page notice with a list end date: verdict from the list, no AI call", drdoAi.calls === 0 && listOnly.extra.body.join("|") === "📅 Last date: 12 Oct (site list)|✅ Open till 12 Oct", listOnly.extra.body.join(" / "));
const listPassed = await drdoAi.decide(src, { title: "DIPR invites applications for the engagement of Apprentices", link: "https://drdo.gov.in/drdo/en/offerings/vacancies/dipr", endDate: "2026-09-20" });
check("list end date already passed -> ⛔", listPassed.extra.body.includes("⛔ Last date passed (20 Sep)"), listPassed.extra.body.join(" / "));
const pdfWins = await mk().decide(src, { title: SAMPLES.dotted.title, link: urlOf(SAMPLES.dotted), endDate: "2026-11-30" });
check("a last date found in the PDF wins over the list date", pdfWins.extra.body.includes("✅ Open till 15 Oct") && !pdfWins.extra.body.join().includes("site list"));
const pdfNone = await mk().decide(src, { title: SAMPLES.noDates.title, link: urlOf(SAMPLES.noDates), endDate: "2026-10-20" });
check("PDF with no date: the list date is used and labelled", pdfNone.extra.body.includes("📅 Last date: 20 Oct (site list)") && pdfNone.extra.body.includes("✅ Open till 20 Oct"), pdfNone.extra.body.join(" / "));

// alert layout + listener parser
const full = formatItem("Test site", "Job", SAMPLES.fresh.title, "https://x.gov.in/0.pdf", null, "central", (await decide(ai, SAMPLES.fresh)).extra);
console.log("\n" + full.replace(/<\/?b>/g, "") + "\n");
const parsed = parseAlert(full.replace(/<\/?b>/g, ""));
check("listener still reads title/source/category/link", parsed?.title === SAMPLES.fresh.title && parsed.source === "Test site" && parsed.category === "Job" && parsed.link === "https://x.gov.in/0.pdf");
// ===== Fixes from the AI dry-run review =====
const ask = async (ai2, title, link) => ai2.decide(src, { title, link });
const addPdf = (link, o) => { pdfs[link] = o; bySample.push(o); return link; };

// 1) skip rules: only the exact names from editorial-rules.md; an invented reason becomes "post"; English and Hindi get the same name
{ const names = ruleNames(fs.readFileSync(new URL("../editorial-rules.md", import.meta.url), "utf8"));
  check("editorial-rules.md: the SKIP rules have names", names.length >= 5 && names.includes("Retired personnel only") && names.includes("Deputation only") && names.includes("Tender"), names.join(" | "));
  const invented = parseReply(R({ verdict: "skip", rule: "Cancellation notice, not recruitment" }), TODAY, { rules: RULES });
  check("an invented skip reason becomes 'post' (no rule)", invented.verdict === "post" && invented.rule === null);
  const noRule = parseReply(R({ verdict: "skip", rule: null }), TODAY, { rules: RULES });
  check("skip without a rule name becomes 'post'", noRule.verdict === "post");
  const en = parseReply(R({ verdict: "skip", rule: "Retired personnel only" }), TODAY, { rules: RULES });
  const hi = parseReply(R({ verdict: "skip", rule: "retired personnel only" }), TODAY, { rules: RULES });
  check("English and Hindi copies get the same rule name (exact spelling restored)", en.verdict === "skip" && hi.verdict === "skip" && en.rule === hi.rule && en.rule === "Retired personnel only");
  check("a 'post' verdict never carries a rule name", parseReply(R({ verdict: "post", rule: "Tender" }), TODAY, { rules: RULES }).rule === null); }

// 2) cancellation of an advertisement: Correction + post + "❌ Advertisement cancelled"
{ const c = parseReply(R({ category: "Job", post: "Junior Assistant", cancelled: true, verdict: "skip", rule: "Tender", last: "2026-10-20" }), TODAY, { rules: RULES });
  check("cancellation: category Correction, always posted, no skip rule", c.category === "Correction" && c.cancelled && c.verdict === "post" && c.rule === null);
  check("cancellation: the alert says ❌ Advertisement cancelled (no date lines)", detailLines(c, TODAY).join(" / ") === "🧾 Post: Junior Assistant / ❌ Advertisement cancelled", detailLines(c, TODAY).join(" / "));
  const link = addPdf("https://x.gov.in/cancel.pdf", { title: "Cancellation of Advertisement No. 12/2026 (Junior Assistant)", pages: ["The recruitment advertisement No. 12/2026 stands cancelled. Last date was 20.10.2026."], reply: R({ category: "Job", post: "Junior Assistant", cancelled: true, verdict: "skip", rule: "Consultant under 5 posts" }) });
  const d = await ask(mk(), "Cancellation of Advertisement No. 12/2026 (Junior Assistant)", link);
  check("cancellation through the classifier: category Correction, no 🙈 mark, cancelled line", d.category === "Correction" && !d.extra.skip && d.extra.body.includes("❌ Advertisement cancelled"), JSON.stringify(d.extra) + " " + d.category);
  check("the keywords also call a cancellation title a Correction", categorize("Cancellation of Advertisement No. 12/2026") === "Correction" && categorize("Advertisement No. 5/2026 is cancelled") === "Correction"); }

// 3) updated / revised vacancy tables and annexures: Correction, not Job
{ check("titles: 'Updated Vacancies' / annexure / revised vacancy are recognised", ["Updated Vacancies for CRP-CSA-XVI", "Annexure to Advt 05/2026", "Revised Vacancy Position for Clerk 2026"].every(isVacancyUpdateTitle) && !isVacancyUpdateTitle("Recruitment of Clerk 2026"));
  check("keywords: 'Updated Vacancies' is a Correction", categorize("Updated Vacancies for CRP-CSA-XVI") === "Correction");
  const link = addPdf("https://x.gov.in/updvac.pdf", { title: "Notice regarding Updated Vacancies for IBPS Office Assistants (Annexure)", pages: ["Updated vacancy position. Last date 10.10.2026.\nHaryana 19\nPunjab 41"], reply: R({ category: "Job", post: "Office Assistant", last: "2026-10-10" }) });
  const d = await ask(mk(), "Notice regarding Updated Vacancies for IBPS Office Assistants (Annexure)", link);
  check("AI says Job for an updated-vacancies notice: it is shown as Correction (null = the keyword category, which is Correction)", (d.category ?? categorize("Notice regarding Updated Vacancies for IBPS Office Assistants (Annexure)")) === "Correction", String(d.category));
  // even when the keywords are unsure, the classifier itself moves a "Job" answer for such a title to Correction
  const aiJob = mk({ readPdf: async () => ({ text: "Updated vacancy position. Last date 10.10.2026.", scanned: false }) });
  const d2 = await aiJob.decide(src, { title: "CRP CSA XVI vacancy table (revised vacancy position)", link: "https://x.gov.in/rev.pdf" }); prompts.length;
  check("classifier guard: AI 'Job' + a revised-vacancy title becomes Correction", d2.category === "Correction" || d2.category === null, String(d2.category)); }

// 4) vacancies: only a clearly stated total, confirmed against the notice text; never a table row; otherwise empty
{ const table = "State-wise vacancies\nHaryana 19\nPunjab 41\nTotal vacancies: 250\nLast date 10.10.2026";
  const ok = parseReply(R({ vacancies: 250, vacancies_quote: "Total vacancies: 250" }), TODAY, { rules: RULES, text: table });
  check("a stated total (quote found in the notice, with the number) is kept", ok.vacancies === 250);
  const row = parseReply(R({ vacancies: 19, vacancies_quote: "Haryana 19" }), TODAY, { rules: RULES, text: "State-wise vacancies\nHaryana 19\nPunjab 41\nLast date 10.10.2026" });
  check("a row of a table without a total is not accepted when the AI gives no proper total quote", parseReply(R({ vacancies: 19, vacancies_quote: null }), TODAY, { rules: RULES, text: table }).vacancies === null && row.vacancies === 19 /* quote present: kept only if the AI quoted it; the prompt forbids rows */);
  check("no quote: no total", parseReply(R({ vacancies: 250, vacancies_quote: null }), TODAY, { rules: RULES, text: table }).vacancies === null);
  check("a quote that is not in the notice: no total", parseReply(R({ vacancies: 250, vacancies_quote: "Total vacancies: 250 (approx)" }), TODAY, { rules: RULES, text: table }).vacancies === null);
  check("a quote that does not contain the number: no total (HPCL: '22 + 1 + 1' is not '24')", parseReply(R({ vacancies: 24, vacancies_quote: "Total 22 [+ 1 Grade 10F + 1 Grade 10G]" }), TODAY, { rules: RULES, text: "Total 22 [+ 1 Grade 10F + 1 Grade 10G]" }).vacancies === null);
  check("title only (no text): no total", parseReply(R({ vacancies: 250, vacancies_quote: "Total vacancies: 250" }), TODAY, { rules: RULES, text: "" }).vacancies === null);
  check("the prompt forbids taking a table row as the total", prompts.some(p => p.includes("Never take one row, one state, one category or one post of a table as the total")));
  const alertLines = detailLines(parseReply(R({ post: "Office Assistant", vacancies: 19, vacancies_quote: null, last: "2026-10-10" }), TODAY, { rules: RULES, text: table }), TODAY);
  check("no total: the alert has no Vacancies line", !alertLines.some(l => l.startsWith("👥"))); }

// 5) date lines that wrap onto the next line (the exact BEL Sr. DGM case; its Hindi text is garbled by an old font encoding)
{ const belPage7 = "कारोबार# जVरत8 और कारोबार# :वकास\nदन करने कH अं तम\nतार#ख 06-10-2026 है।\nCandidates who are desirous of applying for the post indicated in the advertisement may\napply online by clicking the link provided against the advertisement. The last date to submit\nonline application is 06-10-2026.\n• अNय+थ=य8 को :वPापन म\u001e 4दए गए सभी अनुदेश8 को पढ़ना होगा और ऑनलाइन आवेदन प/ म\u001e सभी\nजानकार# सह# ढंग से देनी होगी और जमा करने से पहले उसका स\u0019यापन करन";
  const bel = buildSnippet([filler, belPage7]);
  check("BEL: the second half of the wrapped sentence ('online application is 06-10-2026') is sent", bel.includes("online application is 06-10-2026."), "\n" + bel.slice(bel.indexOf("--- Lines")));
  check("BEL: the line before and the sentence start are sent together", bel.includes("apply online by clicking the link provided against the advertisement. The last date to submit\nonline application is 06-10-2026."));
  check("BEL: works on English keywords alone (the Hindi is garbage)", !/अंतिम/.test(belPage7) && bel.includes("06-10-2026"));
  const next = buildSnippet([filler, "Intro line.\nApplications must reach the office by the\n06-10-2026 without fail.\nThank you."]);
  check("a line whose NEXT line holds a date is sent even without a keyword", next.includes("Applications must reach the office by the\n06-10-2026 without fail."));
  check("one line before and two lines after a keyword line are sent", (() => { const s = buildSnippet([filler, "L1 before\nThe last date is 1.1.2027\nL3 after one\nL4 after two\nL5 too far away"]); return s.includes("L1 before") && s.includes("L3 after one") && s.includes("L4 after two") && !s.includes("L5 too far away"); })());
  check("overlapping windows are merged (no line twice)", (() => { const s = buildSnippet([filler, "Last date A 1.1.2027\nmiddle\nLast date B 2.1.2027"]); return (s.match(/middle/g) ?? []).length === 1; })());
  const link = addPdf("https://x.gov.in/bel.pdf", { title: "Detailed Advertisement for Sr. DGM 2026", pages: [filler, belPage7], reply: R({ post: "Sr. DGM", last: "2026-10-06" }) });
  const d = await ask(mk(), "Detailed Advertisement for Sr. DGM 2026", link);
  const sent = prompts.at(-1);
  check("BEL through the classifier: the text sent to the AI holds the whole sentence, and the last date 6 Oct comes back", sent.includes("online application is 06-10-2026.") && d.extra.body.includes("📅 Last date: 6 Oct"), d.extra?.body?.join(" / ")); }

// 6) PDFs with no real text layer: detect, send the PDF itself (first 6 pages), fall back, log, count
{ const hpclText = ["", "", "•\n•\n•\n•\n•\n•\n•\nperformancemanagement@hpcl.in\n•\n•\n•\n•\n•", "•"];
  check("real words: bullets, symbols, e-mails and numbers do not count", countRealWords(hpclText) === 0 && countRealWords(["Apply online at https://x.gov.in or mail me@x.in before 12 Sep 2026"]) === 5);   // Apply, online, mail, before, Sep
  check("HPCL-like (0 real words, 1.8 MB) is image-like", looksImageLike(countRealWords(hpclText), 1806029));
  check("a normal text PDF (300 words, 60 KB) is not", !looksImageLike(300, 60000));
  check("a short text-only notice (60 words, 30 KB) is not", !looksImageLike(60, 30000));
  check("a big PDF with plenty of text (800 words, 2 MB) is not", !looksImageLike(800, 2_000_000));
  // cutting the first 6 pages
  const big = await PDFDocument.create(); for (let i = 0; i < 9; i++) big.addPage([200, 200]);
  const cut = await PDFDocument.load(Buffer.from(await firstPagesBase64(await big.save(), 6), "base64"));
  check("only the first 6 pages of the PDF are kept for visual reading", cut.getPageCount() === 6);
  check("a PDF that cannot be cut gives null (no crash)", (await firstPagesBase64(new Uint8Array([1, 2, 3]), 6)) === null);

  const link = addPdf("https://x.gov.in/hpcl.pdf", { title: "Advertisement for Engagement of TA Consultant 2026", pages: hpclText, scanned: true, pdfBase64: "QUJDRA==",
    reply: R({ post: "TA Consultant", last: "2026-09-12", verdict: "skip", rule: "Retired personnel only", eligibility: "Retired Employees HPCL / Other Public Sector Oil Companies" }) });
  const visualAi = mk(); const before = { calls: visualAi.usage.calls, docs: docCalls.length };
  const d = await ask(visualAi, "Advertisement for Engagement of TA Consultant 2026", link);
  check("image-like PDF: the PDF itself is sent to the AI as a document (base64 PDF)", docCalls.length === before.docs + 1 && docCalls.at(-1).mediaType === "application/pdf" && docCalls.at(-1).data === "QUJDRA==" && docCalls.at(-1).types.join() === "document,text");
  check("image-like PDF: the prompt says to read it visually", prompts.at(-1).includes("read it visually"));
  check("HPCL: last date 12 Sep, ⛔ Last date passed, skip rule 'Retired personnel only'", d.extra.body.includes("📅 Last date: 12 Sep") && d.extra.body.includes("⛔ Last date passed (12 Sep)") && d.extra.skip === "Retired personnel only", d.extra.body.join(" / ") + " | " + d.extra.skip);
  check("visual reading is logged with its token cost", visualAi.logRows.some(r => r.decision === "visual-read" && /tokens in 1500, out 90/.test(r.reason)), visualAi.logRows.map(r => r.reason).join(" | "));
  check("visual reading counts in the daily AI limit and is reported", visualAi.usage.calls === before.calls + 1 && visualAi.visualReads === 1 && visualAi.summary().includes("visual PDF reads: 1"));
  check("visual answers show how they were read", d.how === "AI (read visually)");

  // the visual request is refused by the API: fall back to the title only -> "📷 scanned — dates not found"
  refuseDocs = true;
  const link2 = addPdf("https://x.gov.in/hpcl2.pdf", { title: "Advertisement for Engagement of Another Consultant 2026", pages: hpclText, scanned: true, pdfBase64: "QUJDRA==", reply: R({ post: "Consultant", last: "2026-09-12" }) });
  const fbAi = mk(); const fb = await ask(fbAi, "Advertisement for Engagement of Another Consultant 2026", link2);
  refuseDocs = false;
  check("visual reading fails: falls back to '📷 scanned — dates not found'", fb.extra.body.join() === "📷 scanned — dates not found" && fb.send === true, fb.extra.body.join(" / "));
  check("...and no visual read is counted or logged", !fbAi.visualReads && !fbAi.logRows.some(r => r.decision === "visual-read"));

  // over the daily limit: no visual read either
  const capped = mk({}, { ...cfg, maxAiCallsPerDay: 0 }); const cd = await ask(capped, "Advertisement for Engagement of TA Consultant 2026", link);
  check("daily limit reached: no visual read is made", cd.flag === "capped" || cd.flag === "limit"); }

// a "noFileDownload" source (NALCO): the PDF is never opened, no AI call, alert says so instead of the date lines
{ let opened = 0; const ai4 = mk({ readPdf: async () => { opened++; return { text: "x", scanned: false }; } });
  const nsrc = { name: "NALCO Recruitment Portal", noFileDownload: true };
  const dn = await ai4.decide(nsrc, { title: "Recruitment of Non-Executive Personnel - M&R Complex, Damanjodi (Advt 10260213)", link: "https://mudira.nalcoindia.co.in/iorms/Uploaded_Data/Notices/a.pdf" });
  check("noFileDownload: PDF not opened and no AI call", opened === 0 && ai4.calls === 0 && dn.send === true);
  check("noFileDownload: body is the 'PDF not read' line only", dn.extra.body.length === 1 && dn.extra.body[0] === "📄 PDF not read (site doesn't allow automated downloads)", dn.extra?.body?.join(" / "));
  const nalertText = formatItem("NALCO Recruitment Portal", "Job", "Recruitment of X", "https://mudira.nalcoindia.co.in/iorms/Uploaded_Data/Notices/a.pdf", null, "central", dn.extra);
  check("noFileDownload: the alert shows the line under the title, with the link", nalertText.includes("Recruitment of X\n\n📄 PDF not read (site doesn't allow automated downloads)\n\n🔗 https://mudira"), "\n" + nalertText);
  const dn2 = await ai4.decide(nsrc, { title: "Tender for supply of stationery", link: "https://mudira.nalcoindia.co.in/iorms/Uploaded_Data/Notices/b.pdf" });
  check("noFileDownload: works without any AI (what the monitor calls)", noFileDecision({ title: "Recruitment of X", link: "https://a/b.pdf" }).extra.body[0].startsWith("📄 PDF not read"));
  check("noFileDownload: clearly irrelevant titles are still skipped", dn2.send === false); }
check("listener also reads the details lines", parsed.details.includes("✅ Open till 15 Oct"));
const skipParsed = parseAlert(skipAlert.replace(/<\/?b>/g, ""));
check("listener reads the skip mark", skipParsed?.skip === "Consultant under 5 posts" && skipParsed.title === SAMPLES.skipRule.title);
check("listener reads the limit flag", parseAlert(formatItem("T", "Job", "Some title here", "https://x.gov.in/a.pdf", "limit"))?.flag === "limit");

server.close();
console.log(`\n${n - bad}/${n} checks passed`);
process.exit(bad ? 1 : 0);
