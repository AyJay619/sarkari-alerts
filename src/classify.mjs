// Optional AI classification of NEW notices. Switch and limits live in config.json; word lists in keywords.json.
// Nothing here runs unless aiEnabled is true (or the test command is used).
import fs from "node:fs";
import path from "node:path";
import { categorize } from "./categorize.mjs";
import { CATEGORIES, NEEDS_DATES, buildPrompt, detailLines, isVacancyUpdateTitle, parseReply, pdfSnippet, ruleNames, todayIST } from "./extract.mjs";

// Bump when the prompt or the reading of answers changes: older cached answers are then asked again instead of trusted.
export const CACHE_VERSION = 4;

const readJson = f => JSON.parse(fs.readFileSync(new URL("../" + f, import.meta.url), "utf8"));
// SARKARI_LEGACY_ALERTS=1 (set only by the old tests) runs the old way: alerts instead of catch files, AI check and button on.
export const loadConfig = () => {
  const cfg = readJson("config.json");
  return process.env.SARKARI_LEGACY_ALERTS === "1" ? { ...cfg, catchOnly: false, aiEnabled: true, sendToAgentsButton: true } : cfg;
};
const KEYWORDS = readJson("keywords.json");
const wordList = list =>
  new RegExp("(?:^|[^a-z])(?:" + list.map(w => w.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")(?:[^a-z]|$)", "i");
const RELEVANT = wordList(KEYWORDS.relevant), IRRELEVANT = wordList(KEYWORDS.irrelevant);

// Free check on the title. "relevant" -> alert without AI, "irrelevant" -> skip without AI, "unclear" -> ask the AI.
export function keywordVerdict(title) {
  const rel = RELEVANT.test(title), irr = IRRELEVANT.test(title);
  if (rel && !irr) return "relevant";
  if (irr && !rel) return "irrelevant";
  return "unclear";
}

// ---- free pre-check on the TITLE (and the link's file type), before any PDF download or AI call ----
// skipTitles (keywords.json): titles that clearly belong to a skip rule. formTitles: forms, not notices. Both editable there.
const SKIP_TITLES = (KEYWORDS.skipTitles ?? []).map(r => ({ rule: r.rule, patterns: r.patterns.map(p => new RegExp(p, "i")), unless: (r.unless ?? []).map(p => new RegExp(p, "i")) }));
const FORM_TITLES = (KEYWORDS.formTitles ?? []).map(p => new RegExp(p, "i"));
export const titleSkipRule = title => SKIP_TITLES.find(r => r.patterns.some(p => p.test(title)) && !r.unless.some(u => u.test(title)))?.rule ?? null;
export const isFormTitle = title => FORM_TITLES.some(p => p.test(title));
export const isWordExcelLink = link => /[.](docx?|xlsx?)([?#]|$)/i.test(String(link));
// -> null (go on), or a decision that is NOT sent: { send:false, how, skipped?: { rule, by } }
//   - a form / format / annexure title, or a .doc/.docx/.xls/.xlsx file whose title the keywords do not trust: Not Relevant
//   - a title that clearly matches a skip rule: skipped by that rule (recorded for the log and the daily digest)
export function preFilter(item) {
  if (isFormTitle(item.title)) return { send: false, how: "form", reason: "a form / format, not a notice" };
  const rule = titleSkipRule(item.title);
  if (rule) return { send: false, how: "title-rule", skipped: { rule, by: "title" }, reason: "title matches skip rule: " + rule };
  if (isWordExcelLink(item.link) && keywordVerdict(item.title) !== "relevant") return { send: false, how: "word-excel", reason: "Word/Excel file: a form, not a notice" };
  return null;
}

// ---- safety net for the two "exclusive" rules ----
// If the notice TEXT plainly says the post is exclusive (100% reservation for ex-servicemen, "(ESM)" in the post name, "eligible retired
// Scientist-G ...") but the AI answered "post", the verdict is turned into a skip. A quota inside a normal recruitment ("10% reserved
// for ex-servicemen") matches none of these.
const ESM_SIGNS = [
  /\(ESM\)/i,
  /reservation\s+(is|of|shall\s+be|will\s+be)\s+100\s*%[^.\n]{0,30}ex[- ]?servicem/i,
  /100\s*%\s+(of\s+(the\s+)?)?(vacancies|posts|seats)?\s*(is|are)?\s*(reserved\s+)?for\s+ex[- ]?servicem/i,
  /\bonly\s+(for\s+)?ex[- ]?servicem[ae]n\b/i,
];
const RETIRED_SIGNS = [
  /\b(interested\s+and\s+)?eligible\s+retired\s+[A-Z]/,
  /\bshould\s+have\s+retired\b/i,
  /\bonly\s+(the\s+)?retired\b/i,
];
export function exclusiveSignal(title, text) {
  const all = title + "\n" + (text ?? "");
  if (ESM_SIGNS.some(re => re.test(all))) return "Ex-servicemen only";
  if (RETIRED_SIGNS.some(re => re.test(all))) return "Retired personnel only";
  return null;
}

export const NO_FILE_LINE = "📄 PDF not read (site doesn't allow automated downloads)";

// A "noFileDownload" source (robots.txt forbids the files): title and link only, the PDF is never opened. Works with the AI off, too.
export function noFileDecision(item, force = false) {
  if (!force && keywordVerdict(item.title) === "irrelevant") return { send: false, how: "keywords" };
  return { send: true, category: null, flag: null, extra: { body: [NO_FILE_LINE], skip: null }, how: "keywords (file not read)" };
}

export class Classifier {
  // cacheFile / logFile: where the cache and the review log are kept (null = never write them; used by test mode)
  constructor(cfg, { apiKey, cacheFile = null, logFile = null, force = false, mergeCacheFrom = null, rules = null, now = Date.now, readPdf = pdfSnippet } = {}) {
    Object.assign(this, { cfg, apiKey, cacheFile, logFile, force, now, readPdf });   // now / readPdf: replaced only by the tests
    // editorial-rules.md: plain text the owner edits; sent to the AI with every question
    const rulesFile = new URL("../" + (cfg.editorialFile ?? "editorial-rules.md"), import.meta.url);
    this.rules = rules ?? (fs.existsSync(rulesFile) ? fs.readFileSync(rulesFile, "utf8").trim() : "(no rules file: answer \"post\" for every recruitment notice)");
    this.calls = 0; this.inTokens = 0; this.outTokens = 0;
    this.broken = null;   // reason the AI was switched off for the rest of this run (bad key, no credit, rate limit)
    this.logRows = [];
    this.cache = cacheFile && fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, "utf8")) : {};
    // one-time carry-over of another cache (the old cloud job's): what this cache already knows wins
    if (mergeCacheFrom && fs.existsSync(mergeCacheFrom)) this.cache = { ...JSON.parse(fs.readFileSync(mergeCacheFrom, "utf8")), ...this.cache };
  }

  get cost() {
    const p = this.cfg.pricePerMillionTokens;
    return (this.inTokens * p.input + this.outTokens * p.output) / 1e6;
  }

  // AI calls made today (Indian date), kept in the cache file so the daily limit survives restarts
  get usage() {
    const today = todayIST(this.now());
    if (this.cache.__usage?.date !== today) this.cache.__usage = { date: today, calls: 0 };
    return this.cache.__usage;
  }

  log(src, item, decision, reason) {
    console.log(`  [${decision}] ${src.name}: ${item.title.slice(0, 90)} (${reason})`);
    this.logRows.push({ time: new Date().toISOString(), source: src.name, title: item.title, link: item.link, decision, reason });
  }

  // One question to the AI. Returns its raw answer text.
  // pdfBase64 (optional): the notice's first pages as a PDF, sent to the AI as a document to read visually (for PDFs that are only pictures)
  async ask(title, text, pdfBase64 = null) {
    const prompt = buildPrompt({ title, text, today: todayIST(this.now()), rules: this.rules, visual: !!pdfBase64 });
    const content = pdfBase64 ? [{ type: "document", source: { type: "base64", media_type: "application/pdf", data: pdfBase64 } }, { type: "text", text: prompt }] : prompt;
    const res = await fetch((process.env.ANTHROPIC_BASE_URL ?? "https://api.anthropic.com") + "/v1/messages", {
      method: "POST",
      headers: { "x-api-key": this.apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: this.cfg.model, max_tokens: this.cfg.maxTokens, messages: [{ role: "user", content }] }),
      signal: AbortSignal.timeout(pdfBase64 ? 90000 : 30000),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw Object.assign(new Error(`API ${res.status}: ${body.error?.message ?? "unknown"}`), { status: res.status });
    this.inTokens += body.usage?.input_tokens ?? 0;
    this.outTokens += body.usage?.output_tokens ?? 0;
    return body.content?.[0]?.text ?? "";
  }

  // Turns what the AI found (a cache entry) into the decision for this notice.
  // "relevant" titles keep their keyword category (the AI cannot turn them into Not Relevant); "unclear" titles take the AI's.
  fromEntry(src, item, entry, verdict) {
    const { data, scanned, noText } = entry;
    const today = todayIST(this.now());
    if (data.category === "Not Relevant" && verdict !== "relevant") {
      this.log(src, item, "not-relevant", "AI said Not Relevant");
      return { send: false, how: "AI" };
    }
    let category = verdict === "relevant" ? categorize(item.title) : data.category;
    // a cancellation, or an updated/revised vacancy table or annexure of an existing recruitment, is a Correction (never a Job)
    const forceCorrection = data.cancelled || (category === "Job" && isVacancyUpdateTitle(item.title));
    if (forceCorrection) category = "Correction";
    const wantsDates = NEEDS_DATES.has(category);
    const skipRule = data.cancelled ? null : data.verdict === "skip" ? (data.rule ?? "no rule named") : null;
    const extra = { body: wantsDates ? detailLines(data, today, { scanned, listDate: item.endDate, listStart: item.startDate }) : [], skip: skipRule };
    if (skipRule) {   // skipped by an editorial rule: no alert. Logged here, and recorded for the daily digest by the caller.
      // (extra is kept so the test command can still show what the alert would have looked like)
      this.log(src, item, "ai-skip", "skipped by rule: " + skipRule);
      return { send: false, how: entry.visual ? "AI (read visually)" : "AI", skipped: { rule: skipRule, by: "AI" }, category: forceCorrection ? "Correction" : verdict === "relevant" ? null : category, extra };
    }
    return { send: true, category: forceCorrection ? "Correction" : verdict === "relevant" ? null : category, flag: scanned && !wantsDates ? "scanned" : null, extra, how: noText ? "AI (title only)" : entry.visual ? "AI (read visually)" : "AI" };
  }

  // Returns { send, category (null = keep the keyword category), flag (null | "unchecked" | "capped" | "limit" | "scanned"),
  //           extra ({ body: lines shown under the title, skip: rule name or null }), how }
  // Job and Correction notices always get the AI read of the PDF (post, dates); other kinds keep the old rules.
  async decide(src, item) {
    const verdict = keywordVerdict(item.title);
    const keywordCategory = categorize(item.title);
    // free pre-check on the title / file type: forms and clear skip-rule titles never reach the PDF download or the AI
    const pre = preFilter(item);
    if (pre) { this.log(src, item, pre.skipped ? "title-skip" : "not-relevant", pre.reason); return pre; }
    // "noFileDownload" sources (robots.txt forbids the files): never open the PDF, no AI read of it. Title and link only.
    if (src.noFileDownload) return noFileDecision(item, this.force);
    if (!this.force) {
      if (verdict === "irrelevant") { this.log(src, item, "skipped", "keyword: clearly irrelevant"); return { send: false, how: "keywords" }; }
      if (verdict === "relevant" && !NEEDS_DATES.has(keywordCategory)) return { send: true, category: null, flag: null, how: "keywords" };
    }
    const isPdf = /\.pdf(\?|#|$)/i.test(item.link);
    const today = todayIST(this.now());

    const cached = this.cache[item.link];
    if (cached && typeof cached === "object" && cached.data && cached.v === CACHE_VERSION) return this.fromEntry(src, item, cached, verdict);
    if (typeof cached === "string" && !NEEDS_DATES.has(cached)) {   // an older answer (category only) that needs no dates
      if (cached === "Not Relevant") this.log(src, item, "not-relevant", "cached AI answer");
      return { send: cached !== "Not Relevant", category: cached, flag: null, how: "cache" };
    }

    // A web page (not a PDF) cannot be read for dates. Titles the keywords already trust are not sent to the AI for that alone.
    if (!isPdf && verdict === "relevant") return { send: true, category: null, flag: null, extra: { body: detailLines(null, today, { notPdf: true, wordExcel: isWordExcelLink(item.link), listDate: item.endDate, listStart: item.startDate }), skip: null }, how: "keywords" };

    if (this.broken) return { send: true, category: null, flag: "unchecked", how: "AI stopped" };
    if (this.calls >= this.cfg.maxAiCallsPerRun || this.usage.calls >= this.cfg.maxAiCallsPerDay)
      return { send: true, category: null, flag: verdict === "relevant" ? "limit" : "capped", how: "call limit reached" };

    let text = "", scanned = false, noText = false, pdfBase64 = null;
    if (isPdf) {
      try { ({ text, scanned, pdfBase64 = null } = await this.readPdf(item.link, this.cfg, src)); }
      catch (e) { noText = true; console.log(`  (PDF text unavailable for "${item.title.slice(0, 50)}": ${e.message}; using the title only)`); }
    } else noText = true;

    this.calls++; this.usage.calls++;
    try {
      let raw, visual = false;
      if (pdfBase64 && !text) {
        // no real text layer (a scan / pictures): let the AI READ the first pages visually. Costs more tokens, counts in the daily limit.
        const in0 = this.inTokens, out0 = this.outTokens;
        try {
          raw = await this.ask(item.title, "", pdfBase64); visual = true;
          const c = this.cfg.pricePerMillionTokens, dIn = this.inTokens - in0, dOut = this.outTokens - out0;
          this.usage.visual = (this.usage.visual ?? 0) + 1; this.visualReads = (this.visualReads ?? 0) + 1;
          this.log(src, item, "visual-read", `PDF has no real text: first pages read visually; tokens in ${dIn}, out ${dOut}, approx $${((dIn * c.input + dOut * c.output) / 1e6).toFixed(5)}`);
        } catch (e) {
          if ([401, 402, 403, 429].includes(e.status)) throw e;
          console.log(`  (visual reading failed: ${e.message}; using the title only)`);   // -> "📷 scanned — dates not found"
          this.usage.calls++;   // the title-only question below is a second call
        }
      }
      if (raw === undefined) raw = await this.ask(item.title, text);
      const data = parseReply(raw, today, { rules: this.rules, text, visual });
      if (!text && !visual) Object.assign(data, { start: null, last: null, oldLast: null, advtDate: null });
      if (data.verdict !== "skip" && !data.cancelled) {   // the safety net (see exclusiveSignal)
        const sign = exclusiveSignal(item.title, text);
        if (sign && ruleNames(this.rules).includes(sign)) { data.verdict = "skip"; data.rule = sign; this.log(src, item, "exclusive-signal", "the text says so: " + sign); }
      }   // no document text: any date would be a guess
      if (visual) scanned = !data.last;   // read visually: only "scanned — dates not found" when it really found no last date
      const entry = { v: CACHE_VERSION, data, scanned, noText, ...(visual ? { visual: true } : {}) };
      this.cache[item.link] = entry;
      const d = this.fromEntry(src, item, entry, verdict);
      if (d.extra?.body.length && noText && !isPdf) d.extra.body = detailLines(data, today, { notPdf: true, wordExcel: isWordExcelLink(item.link), listDate: item.endDate, listStart: item.startDate });
      return d;
    } catch (e) {
      console.error(`  AI problem: ${e.message}`);
      // Bad key, no credit or rate limit: stop asking for the rest of this run; everything else goes out unchecked.
      if ([400, 401, 402, 403, 429].includes(e.status)) this.broken = e.message;
      return { send: true, category: null, flag: "unchecked", how: "AI error" };
    }
  }

  summary() {
    return `AI calls: ${this.calls}/${this.cfg.maxAiCallsPerRun} (today ${this.usage.calls}/${this.cfg.maxAiCallsPerDay}) | tokens in ${this.inTokens}, out ${this.outTokens} | approx cost $${this.cost.toFixed(5)}` + (this.visualReads ? ` | visual PDF reads: ${this.visualReads}` : "") +
      (this.broken ? ` | AI stopped: ${this.broken}` : "");
  }

  save() {
    if (this.cacheFile) {
      fs.mkdirSync(path.dirname(this.cacheFile), { recursive: true });
      fs.writeFileSync(this.cacheFile, JSON.stringify(this.cache, null, 1) + "\n");
    }
    if (this.logFile && this.logRows.length) {
      fs.mkdirSync(path.dirname(this.logFile), { recursive: true });
      const old = fs.existsSync(this.logFile) ? fs.readFileSync(this.logFile, "utf8").split("\n").filter(Boolean) : [];
      const all = [...old, ...this.logRows.map(r => JSON.stringify(r))].slice(-1000);   // keep the newest 1000 lines
      fs.writeFileSync(this.logFile, all.join("\n") + "\n");
    }
  }
}
