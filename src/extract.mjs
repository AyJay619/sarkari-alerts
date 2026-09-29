// Reading the key facts (post, vacancies, dates) of Job / Correction notices: the text sent to the AI, the reply, and the
// date verdict. The verdict is worked out HERE, in plain code, from the dates the AI found: the AI never judges "open or closed".
import { extractText, getDocumentProxy } from "unpdf";
import { getBuffer } from "./fetchers.mjs";

// ---- today's date in India ----
export const todayIST = (now = Date.now()) => new Date(now + 5.5 * 3600 * 1000).toISOString().slice(0, 10);

// ---- the text sent to the AI: the start of the PDF + every line, anywhere in the PDF, that talks about dates ----
const DATE_WORDS = new RegExp([
  "last\\s*date", "closing\\s*date", "end\\s*date", "start\\s*date", "opening\\s*date", "due\\s*date", "commencement",
  "extended", "extension", "revised", "re-?opened", "corrigendum", "addendum", "on\\s+or\\s+before", "not\\s+later\\s+than",
  "apply\\s+online\\s+(from|between)", "online\\s+application[^.]{0,40}(from|till|upto|up\\s*to)",
  "अंतिम\\s*(तिथि|दिनांक|तारीख)", "आवेदन[^।.]{0,30}(प्रारंभ|शुरू|आरंभ)", "प्रारंभ\\s*(तिथि|दिनांक)", "आरंभ\\s*(तिथि|दिनांक)",
  "बढ़ा", "विस्तार", "संशोधित", "शुद्धिपत्र", "तक\\s*आवेदन",
].join("|"), "i");

const WINDOW = 130;   // a "line" longer than 2 windows (PDFs often come out as one long paragraph) is cut around the keyword

export function buildSnippet(pages, { headChars = 3000, maxChars = 6000 } = {}) {
  const flat = s => s.replace(/\s+/g, " ").trim();
  const head = flat(pages.join("\n")).slice(0, headChars);
  const seen = new Set(), lines = [];
  for (const raw of pages.join("\n").split(/\n+/)) {
    const line = flat(raw);
    if (!line) continue;
    const parts = [];
    if (line.length <= WINDOW * 2) { if (DATE_WORDS.test(line)) parts.push(line); }
    else for (const m of line.matchAll(new RegExp(DATE_WORDS.source, "gi"))) {
      parts.push(line.slice(Math.max(0, m.index - WINDOW), m.index + WINDOW * 2));
      if (parts.length >= 6) break;
    }
    for (const p of parts) if (!seen.has(p) && !head.includes(p)) { seen.add(p); lines.push(p); }
  }
  let out = head;
  if (lines.length) out += "\n\n--- Lines from the rest of the document that mention dates ---\n" + lines.join("\n");
  return out.slice(0, maxChars);
}

// Downloads a PDF and returns { text (the snippet above), scanned }. Throws when the file cannot be used.
// srcOpts: the source's own settings from sources.json, so sites that need extraCerts / a longer timeout also work here.
export async function pdfSnippet(url, cfg, srcOpts = {}) {
  const get = () => getBuffer(url, { optsFor: () => srcOpts, maxBytes: cfg.pdfMaxMegabytes * 1024 * 1024 });
  const { buf } = await get().catch(async () => { await new Promise(r => setTimeout(r, 3000)); return get(); });   // some sites drop the first try
  const bytes = new Uint8Array(buf);
  if (String.fromCharCode(...bytes.slice(0, 4)) !== "%PDF") throw new Error("not a PDF");
  const pdf = await getDocumentProxy(bytes);
  const { text } = await extractText(pdf, { mergePages: false });
  const pages = text.slice(0, cfg.pdfScanPages ?? 40);
  const snippet = buildSnippet(pages, { headChars: cfg.pdfHeadChars ?? 3000, maxChars: cfg.pdfMaxChars ?? 6000 });
  return snippet.replace(/\s/g, "").length < 40 ? { text: "", scanned: true } : { text: snippet, scanned: false };
}

// ---- the question ----
export const CATEGORIES = ["Job", "Admit Card", "Result", "Answer Key", "Correction", "Not Relevant"];
export const NEEDS_DATES = new Set(["Job", "Correction"]);

export function buildPrompt({ title, text, today, rules }) {
  return `You sort Indian government website notices for a job-alert service and read their key facts.
Today's date in India: ${today} (the year is ${today.slice(0, 4)}).

Title: ${title}
${text ? `Text of the notice (the start, then lines that mention dates):\n${text}\n` : "(No document text is available: judge by the title only and use null for every fact.)\n"}
EDITORIAL RULES (decide "post" or "skip" with these):
${rules}

Reply with ONLY one JSON object, no other text:
{"category": one of "Job", "Admit Card", "Result", "Answer Key", "Correction", "Not Relevant",
 "post": name of the post(s) as a short string, or null,
 "vacancies": total number of vacancies as an integer, or null,
 "start": date online applications open, "YYYY-MM-DD" or null,
 "last": last date to apply, "YYYY-MM-DD" or null,
 "old_last": for a corrigendum/extension only: the previous last date if the notice states it, else null,
 "type": one of "fresh" (a new advertisement), "corrigendum" (changes to an earlier notice), "extension" (only extends a date), "other",
 "verdict": "post" or "skip",
 "rule": the short name (max 8 words) of the editorial rule that decided the verdict}

Meanings: Job = recruitment/vacancy/engagement advertisement. Correction = corrigendum/addendum/date extension/schedule change for an exam or recruitment.
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
export function parseReply(raw, today) {
  const m = String(raw).match(/\{[\s\S]*\}/);
  if (!m) throw new Error("no JSON in the answer");
  let j;
  try { j = JSON.parse(m[0]); } catch { throw new Error("broken JSON"); }
  const category = CATEGORIES.find(c => c.toLowerCase() === String(j.category ?? "").trim().toLowerCase());
  if (!category) throw new Error(`unexpected category "${String(j.category).slice(0, 30)}"`);
  const type = ["fresh", "corrigendum", "extension", "other"].includes(j.type) ? j.type : "other";
  const str = (s, n) => (typeof s === "string" && s.trim() ? s.trim().slice(0, n) : null);
  const vac = Number.isInteger(j.vacancies) && j.vacancies > 0 && j.vacancies < 10_000_000 ? j.vacancies : null;
  return {
    category, type, post: str(j.post, 120), vacancies: vac,
    start: validDate(j.start, today), last: validDate(j.last, today), oldLast: validDate(j.old_last, today),
    verdict: String(j.verdict).toLowerCase() === "skip" ? "skip" : "post", rule: str(j.rule, 80),
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

// data: parseReply() result; opts: { scanned, notPdf }. Returns the lines shown under the alert title.
export function detailLines(data, today, { scanned = false, notPdf = false } = {}) {
  const lines = [];
  if (notPdf) return ["⚠️ Dates not checked — the link is a web page, not a PDF"];
  if (scanned) return ["📷 scanned — dates not found"];
  if (data.post) lines.push(`🧾 Post: ${data.post}`);
  if (data.vacancies) lines.push(`👥 Vacancies: ${data.vacancies.toLocaleString("en-IN")}`);
  const dates = [data.start && `Start: ${fmtDate(data.start, today)}`, data.last && `Last date: ${fmtDate(data.last, today)}`].filter(Boolean);
  if (dates.length) lines.push("📅 " + dates.join(" · "));

  if (!data.last) { lines.push("⚠️ Dates not found — check PDF"); return lines; }
  const { left, kind } = dateStatus(data.last, today);
  const last = fmtDate(data.last, today);
  if (data.type === "corrigendum" || data.type === "extension") {
    const change = data.oldLast && data.oldLast !== data.last ? `Last date extended: ${fmtDate(data.oldLast, today)} → ${last}` : `New last date: ${last}`;
    lines.push(`🔁 ${change} ` + (kind === "passed" ? "⛔ Last date passed" : kind === "today" ? "⏳ Closes today" : "✅ Open again"));
  } else if (kind === "passed") lines.push(`⛔ Last date passed (${last})`);
  else if (kind === "today") lines.push("⏳ Closes today");
  else if (data.start && day(data.start) > day(today)) lines.push(`🕒 Not open yet — starts ${fmtDate(data.start, today)} (till ${last})`);
  else if (kind === "soon") lines.push(`⚠️ Closes in ${left} day${left === 1 ? "" : "s"} (${last})`);
  else lines.push(`✅ Open till ${last}`);
  return lines;
}
