// Reading the key facts (post, dates) of Job / Correction notices: the text sent to the AI, the reply, and the
// date verdict. The verdict is worked out HERE, in plain code, from the dates the AI found: the AI never judges "open or closed".
import { extractText, getDocumentProxy } from "unpdf";
import { PDFDocument } from "pdf-lib";
import { getBuffer } from "./fetchers.mjs";

// ---- today's date in India ----
export const todayIST = (now = Date.now()) => new Date(now + 5.5 * 3600 * 1000).toISOString().slice(0, 10);

// ---- the text sent to the AI: the start of the PDF + every line, anywhere in the PDF, that talks about dates ----
// English keywords alone must be enough: some PDFs have garbled Hindi (old font encoding), so the Hindi ones can never match there.
const DATE_WORDS = new RegExp([
  "last\\s*date", "closing\\s*date", "end\\s*date", "start\\s*date", "opening\\s*date", "due\\s*date", "commencement",
  "extended", "extension", "revised", "re-?opened", "corrigendum", "addendum", "on\\s+or\\s+before", "not\\s+later\\s+than",
  "apply\\s+online\\s+(from|between)", "registration\\s+(start|begin|open|commenc)\\w*", "(application|applications)\\s+(start|begin|open|commenc)\\w*", "\\b(starts?|opens?|begins?|commences?)\\s+(on|from)\\b", "date\\s+of\\s+(start|opening|commencement)", "online\\s+registration", "\\bfrom\\s+\\d", "online\\s+application[^.]{0,40}(from|till|upto|up\\s*to)",
  "अंतिम\\s*(तिथि|दिनांक|तारीख)", "आवेदन[^।.]{0,30}(प्रारंभ|शुरू|आरंभ)", "प्रारंभ\\s*(तिथि|दिनांक)", "आरंभ\\s*(तिथि|दिनांक)",
  "बढ़ा", "विस्तार", "संशोधित", "शुद्धिपत्र", "तक\\s*आवेदन",
].join("|"), "i");

// something that looks like a date: 06-10-2026, 6.10.26, 15th October 2026, October 15, 2026, or Devanagari digits (१५ ...)
const MON = "jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?";
const DATE_RE = new RegExp(`\\b\\d{1,2}\\s*[./-]\\s*\\d{1,2}\\s*[./-]\\s*\\d{2,4}\\b|\\b\\d{1,2}(?:st|nd|rd|th)?\\s+(?:${MON})\\.?,?\\s+\\d{2,4}|\\b(?:${MON})\\.?\\s+\\d{1,2}(?:st|nd|rd|th)?,?\\s+\\d{4}|[०-९]{1,2}\\s*[./-]\\s*[०-९]{1,2}\\s*[./-]\\s*[०-९]{2,4}`, "i");

const WINDOW = 130;      // a "line" longer than 2 windows (PDFs often come out as one long paragraph) is cut around the keyword
const CONTEXT_CUT = 400; // a long line shown only as context is cut to this

// For every line that talks about dates: send that line, 1 line before it and 2 lines after it (a sentence often wraps onto the next
// line: "...The last date to submit" / "online application is 06-10-2026."). Overlaps are merged. Lines just before a line that
// contains a date are treated the same way (second priority: they come after the keyword ones if the space runs out).
export function buildSnippet(pages, { headChars = 3000, maxChars = 6000 } = {}) {
  const flat = s => s.replace(/\s+/g, " ").trim();
  const head = flat(pages.join("\n")).slice(0, headChars);
  const L = [];   // { t: text, kw: bool }
  for (const raw of pages.join("\n").split(/\n+/)) {
    const line = flat(raw);
    if (!line) continue;
    if (line.length > WINDOW * 2) {
      const ms = [...line.matchAll(new RegExp(DATE_WORDS.source, "gi"))].slice(0, 6);
      if (ms.length) { for (const m of ms) L.push({ t: line.slice(Math.max(0, m.index - WINDOW), m.index + WINDOW * 2), kw: true }); continue; }
    }
    L.push({ t: line.length > CONTEXT_CUT ? line.slice(0, CONTEXT_CUT) : line, kw: DATE_WORDS.test(line) });
  }
  const ranges = hits => {
    const out = [];
    for (const i of hits) {
      const a = Math.max(0, i - 1), b = Math.min(L.length - 1, i + 2);
      if (out.length && a <= out.at(-1)[1] + 1) out.at(-1)[1] = Math.max(out.at(-1)[1], b); else out.push([a, b]);
    }
    return out;
  };
  const kwHits = L.map((l, i) => (l.kw ? i : -1)).filter(i => i >= 0);
  const nxHits = L.map((l, i) => (!l.kw && i + 1 < L.length && DATE_RE.test(L[i + 1].t) ? i : -1)).filter(i => i >= 0);
  const kwR = ranges(kwHits);
  const covered = new Set(kwR.flatMap(([a, b]) => Array.from({ length: b - a + 1 }, (_, k) => a + k)));
  const nxR = ranges(nxHits.filter(i => !covered.has(i))).map(([a, b]) => { while (a <= b && covered.has(a)) a++; while (b >= a && covered.has(b)) b--; return [a, b]; }).filter(([a, b]) => a <= b);
  const blocks = [...kwR, ...nxR].map(([a, b]) => L.slice(a, b + 1).map(l => l.t).join("\n")).filter(t => !head.includes(flat(t)));
  let out = head;
  if (blocks.length) out += "\n\n--- Lines from the rest of the document that mention dates (with the lines around them) ---\n" + blocks.join("\n\n");
  return out.slice(0, maxChars);
}

// ---- "no real text": count only real words (letters), not bullets, symbols, numbers, e-mail addresses or web addresses ----
export function countRealWords(pages) {
  const t = pages.join(" ").replace(/\S+@\S+/g, " ").replace(/(https?:\/\/|www\.)\S+/gi, " ");
  return (t.match(/\p{L}{3,}/gu) ?? []).length;
}
// A PDF with fewer than ~200 real words that is big for so few words is really pictures (a scan): its "text" is bullets and an e-mail.
export const IMAGE_MAX_WORDS = 200, IMAGE_BYTES_PER_WORD = 1500;
export const looksImageLike = (realWords, fileBytes) => realWords < IMAGE_MAX_WORDS && fileBytes / (realWords + 1) > IMAGE_BYTES_PER_WORD;

// The first `maxPages` pages of a PDF as a new PDF (base64), to send to the AI for visual reading. null if it cannot be cut.
export async function firstPagesBase64(bytes, maxPages = 6) {
  try {
    const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const out = await PDFDocument.create();
    const n = Math.min(maxPages, src.getPageCount());
    for (const p of await out.copyPages(src, Array.from({ length: n }, (_, i) => i))) out.addPage(p);
    return Buffer.from(await out.save()).toString("base64");
  } catch { return null; }
}

// Downloads a PDF and returns { text (the snippet above), scanned, imageLike, realWords, pdfBase64 }. Throws when the file cannot be used.
// imageLike PDFs come back with text "" and pdfBase64 = their first 6 pages, for visual reading.
// srcOpts: the source's own settings from sources.json, so sites that need extraCerts / a longer timeout also work here.
export async function pdfSnippet(url, cfg, srcOpts = {}) {
  const get = () => getBuffer(url, { optsFor: () => srcOpts, maxBytes: cfg.pdfMaxMegabytes * 1024 * 1024 });
  const { buf } = await get().catch(async () => { await new Promise(r => setTimeout(r, 3000)); return get(); });   // some sites drop the first try
  const fileBytes = buf.byteLength;   // (measured now: the PDF reader below takes over the array it is given and empties it)
  if (String.fromCharCode(...new Uint8Array(buf).slice(0, 4)) !== "%PDF") throw new Error("not a PDF");
  const pdf = await getDocumentProxy(new Uint8Array(buf));
  const { text } = await extractText(pdf, { mergePages: false });
  const pages = text.slice(0, cfg.pdfScanPages ?? 40);
  const realWords = countRealWords(pages);
  if (looksImageLike(realWords, fileBytes)) {
    const pdfBase64 = await firstPagesBase64(new Uint8Array(buf), cfg.pdfVisualPages ?? 6);
    return { text: "", scanned: true, imageLike: true, realWords, pdfBase64 };
  }
  const snippet = buildSnippet(pages, { headChars: cfg.pdfHeadChars ?? 3000, maxChars: cfg.pdfMaxChars ?? 6000 });
  return snippet.replace(/\s/g, "").length < 40 ? { text: "", scanned: true, imageLike: false, realWords } : { text: snippet, scanned: false, imageLike: false, realWords };
}

// ---- the question ----
export const CATEGORIES = ["Job", "Admit Card", "Result", "Answer Key", "Correction", "Not Relevant"];
export const NEEDS_DATES = new Set(["Job", "Correction"]);

// The names of the SKIP rules in editorial-rules.md: the bullets under "SKIP these", each written "- <Rule name>: <explanation>".
export function ruleNames(rulesText) {
  const names = []; let inSkip = false;
  for (const raw of String(rulesText ?? "").split("\n")) {
    const line = raw.trim();
    if (/^SKIP\b/i.test(line)) { inSkip = true; continue; }
    if (/^(POST|SPECIAL|If a notice)\b/i.test(line)) { inSkip = false; continue; }
    const m = inSkip && line.match(/^-\s*([^:]{2,80}):/);
    if (m) names.push(m[1].trim());
  }
  return names;
}

// A title that announces an updated / revised vacancy table or an annexure for an EXISTING recruitment: that is a Correction, not a Job.
export const isVacancyUpdateTitle = title => /\b(updated|revised)\s+(vacanc|posts?\b|position)|\bvacanc(y|ies)\s+(position\s+)?(updated|revised)|\bannexure\b/i.test(String(title));

export function buildPrompt({ title, text, today, rules, visual = false }) {
  return `You sort Indian government website notices for a job-alert service and read their key facts.
Today's date in India: ${today} (the year is ${today.slice(0, 4)}).

Title: ${title}
${visual ? "The notice is attached as a PDF document (its first pages): read it visually.\n" : text ? `Text of the notice (the start, then lines that mention dates, with the lines around them):\n${text}\n` : "(No document text is available: judge by the title only and use null for every fact.)\n"}
EDITORIAL RULES:
${rules}

HOW TO USE THE RULES:
- Each SKIP rule has a NAME: the words before the colon. Use "skip" ONLY when one of those SKIP rules clearly applies to this notice. Then "rule" must be that NAME copied EXACTLY, word for word, with nothing added or changed.
- If no SKIP rule clearly applies, "verdict" is "post" and "rule" is null. NEVER invent a reason or a new rule name. A notice is never skipped for a reason that is not in the list.
- The English and the Hindi version of one notice must get the same verdict and the same rule name.
- "Ex-servicemen only" and "Retired personnel only" apply ONLY when the post can be filled EXCLUSIVELY by such people. A normal public recruitment (SSC, RRB, banks, police, PSUs...) that merely RESERVES seats, a quota, age relaxation or preference for ex-servicemen / ex-Agniveers / retired persons is NOT covered by those rules: answer "post". The same holds for the other SKIP rules: they are for notices that are ONLY that kind (only deputation, only an internal exam), not for a recruitment that also has such a route.

Reply with ONLY one JSON object, no other text:
{"category": one of "Job", "Admit Card", "Result", "Answer Key", "Correction", "Not Relevant",
 "post": name of the post(s) as a short string, or null,
 "eligibility": the exact words of the notice about WHO may apply (eligibility, e.g. "Retired employees of ...", "Any graduate"), max 150 characters, or null. Find this BEFORE you decide the verdict, and compare it with every SKIP rule,
 "start": the date online applications / registration OPEN (start date, opening date, "registration starts", "commencement of online application", "apply online from ..."), "YYYY-MM-DD" or null. If the notice says applications are accepted "from X to Y" or "between X and Y", start is X. Always look for it,
 "last": last date to apply, "YYYY-MM-DD" or null,
 "old_last": for a corrigendum/extension only: the previous last date if the notice states it, else null,
 "type": one of "fresh" (a new advertisement), "corrigendum" (changes to an earlier notice), "extension" (only extends a date), "other",
 "cancelled": true if the notice cancels or withdraws an advertisement / recruitment, else false,
 "verdict": "post" or "skip",
 "rule": the exact NAME of the SKIP rule that decided a "skip", else null}

Meanings: Job = a NEW recruitment/vacancy/engagement advertisement. Correction = corrigendum/addendum/date extension/schedule change for an exam or recruitment,
and ALSO: a notice that CANCELS an advertisement, and an updated / revised vacancy table, annexure or revised vacancy list of an existing recruitment (never "Job").
Not Relevant = tenders, circulars, office orders, policies, anything not about recruitment or exams.
For a corrigendum or extension, "last" is the NEW last date. "last" is the last date for submitting the application, not for paying the fee.
Dates: write YYYY-MM-DD. Convert formats like 15.10.2026, 15/10/2026, "15th October 2026" and Hindi text or Devanagari digits (१५ अक्टूबर २०२६).
Use null for anything not clearly stated. NEVER guess or calculate a date; if the year is not written and not obvious, use null.`;
}

// ---- the reply ----
const validDate = (s, today) => {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(s + "T00:00:00Z");
  if (isNaN(d) || d.toISOString().slice(0, 10) !== s) return null;
  const diff = (d - new Date(today + "T00:00:00Z")) / 86400000;
  return diff < -400 || diff > 800 ? null : s;   // a year far away from today is a misreading, not a date
};


// Turns the AI's answer into a clean object. Throws when it is not usable (the caller then falls back to "unchecked").
// opts.rules: the editorial rules text: a "skip" is only kept when "rule" is the exact name of one of its SKIP rules.
export function parseReply(raw, today, { rules = null } = {}) {
  const m = String(raw).match(/\{[\s\S]*\}/);
  if (!m) throw new Error("no JSON in the answer");
  let j;
  try { j = JSON.parse(m[0]); } catch { throw new Error("broken JSON"); }
  let category = CATEGORIES.find(c => c.toLowerCase() === String(j.category ?? "").trim().toLowerCase());
  if (!category) throw new Error(`unexpected category "${String(j.category).slice(0, 30)}"`);
  let type = ["fresh", "corrigendum", "extension", "other"].includes(j.type) ? j.type : "other";
  const str = (s, n) => (typeof s === "string" && s.trim() ? s.trim().slice(0, n) : null);
  // the skip verdict: only with the exact name of a SKIP rule (when the rules can be read); anything else is "post"
  let verdict = String(j.verdict).toLowerCase() === "skip" ? "skip" : "post", rule = str(j.rule, 80);
  if (verdict === "skip") {
    const names = ruleNames(rules);
    const exact = names.find(n => n.toLowerCase() === (rule ?? "").toLowerCase());
    if (names.length && !exact) { verdict = "post"; rule = null; }   // an invented reason is not a reason
    else if (exact) rule = exact;
  } else rule = null;
  // a cancellation of an advertisement is a Correction and is always posted
  const cancelled = j.cancelled === true;
  if (cancelled) { category = "Correction"; type = "corrigendum"; verdict = "post"; rule = null; }
  return {
    category, type, post: str(j.post, 120), cancelled,
    start: validDate(j.start, today), last: validDate(j.last, today), oldLast: validDate(j.old_last, today),
    verdict, rule,
  };
}

// ---- the verdict (plain code) ----
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const day = s => Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) / 86400000;
export const fmtDate = (s, today) => `${+s.slice(8, 10)} ${MONTHS[+s.slice(5, 7) - 1]}${s.slice(0, 4) === today.slice(0, 4) ? "" : " " + s.slice(0, 4)}`;

// -> "passed" | "today" | "soon" (1-3 days) | "open", plus the number of days left
export function dateStatus(last, today) {
  const left = day(last) - day(today);
  return { left, kind: left < 0 ? "passed" : left === 0 ? "today" : left <= 3 ? "soon" : "open" };
}

// data: parseReply() result; opts: { scanned, notPdf, wordExcel, listDate, listStart }. Returns the lines shown under the alert title:
//   🟢 Start date: 25 Sep
//   🔴 Last date: 19 Oct
//   [🔁 Extended: 12 Sep → 30 Oct]      (corrigendum / extension only)
//   ✅ Open · 19 days left    (or ⚠️ Closing · N days left / ⏳ Closes today / ⛔ Closed on 12 Sep / 🕒 Starts 5 Oct)
// A date that was not found shows "?". Both missing: "⚠️ Dates not found — check PDF" (or the scanned / web page / Word-Excel line).
// listDate / listStart: the "end date" / "start date" the site itself shows next to the notice; used only when the PDF names none.
export function detailLines(data, today, { scanned = false, notPdf = false, wordExcel = false, listDate = null, listStart = null } = {}) {
  data = data ?? { type: "fresh" };
  if (data.cancelled) return [...(data.post ? [`🧾 Post: ${data.post}`] : []), "❌ Advertisement cancelled"];
  let lastFromList = false, startFromList = false;
  if (!data.last && listDate) { data = { ...data, last: listDate }; lastFromList = true; }
  if (!data.start && listStart) { data = { ...data, start: listStart }; startFromList = true; }
  const lines = [];
  if (!data.last && !data.start && wordExcel) return ["📄 Word/Excel file — not read"];
  if (!data.last && !data.start && notPdf) return ["⚠️ Dates not checked — the link is a web page, not a PDF"];
  if (!data.last && !data.start && scanned) return ["📷 scanned — dates not found"];
  if (data.post) lines.push(`🧾 Post: ${data.post}`);
  if (!data.last && !data.start) { lines.push("⚠️ Dates not found — check PDF"); return lines; }

  const shown = (d, fromList) => (d ? fmtDate(d, today) + (fromList ? " (site list)" : "") : "?");
  lines.push(`🟢 Start date: ${shown(data.start, startFromList)}`);
  lines.push(`🔴 Last date: ${shown(data.last, lastFromList)}`);

  const changed = data.type === "corrigendum" || data.type === "extension";
  if (changed && data.last) lines.push(data.oldLast && data.oldLast !== data.last ? `🔁 Extended: ${fmtDate(data.oldLast, today)} → ${fmtDate(data.last, today)}` : `🔁 New last date: ${fmtDate(data.last, today)}`);

  if (!data.last) {   // only a start date is known
    lines.push(data.start && day(data.start) > day(today) ? `🕒 Starts ${fmtDate(data.start, today)}` : "⚠️ Last date not found — check PDF");
    return lines;
  }
  const { left, kind } = dateStatus(data.last, today);
  if (kind === "passed") lines.push(`⛔ Closed on ${fmtDate(data.last, today)}`);
  else if (kind === "today") lines.push("⏳ Closes today");
  else if (data.start && day(data.start) > day(today)) lines.push(`🕒 Starts ${fmtDate(data.start, today)}`);
  else if (kind === "soon") lines.push(`⚠️ Closing · ${left} day${left === 1 ? "" : "s"} left`);
  else lines.push(`✅ Open · ${left} days left`);
  return lines;
}
