// Optional AI classification of NEW notices. Switch and limits live in config.json; word lists in keywords.json.
// Nothing here runs unless aiEnabled is true (or the test command is used).
import fs from "node:fs";
import path from "node:path";
import { categorize } from "./categorize.mjs";
import { CATEGORIES, NEEDS_DATES, buildPrompt, detailLines, parseReply, pdfSnippet, todayIST } from "./extract.mjs";

const readJson = f => JSON.parse(fs.readFileSync(new URL("../" + f, import.meta.url), "utf8"));
export const loadConfig = () => readJson("config.json");
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
  async ask(title, text) {
    const prompt = buildPrompt({ title, text, today: todayIST(this.now()), rules: this.rules });
    const res = await fetch((process.env.ANTHROPIC_BASE_URL ?? "https://api.anthropic.com") + "/v1/messages", {
      method: "POST",
      headers: { "x-api-key": this.apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: this.cfg.model, max_tokens: this.cfg.maxTokens, messages: [{ role: "user", content: prompt }] }),
      signal: AbortSignal.timeout(30000),
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
    const category = verdict === "relevant" ? categorize(item.title) : data.category;
    const wantsDates = NEEDS_DATES.has(category);
    const extra = { body: wantsDates ? detailLines(data, today, { scanned }) : [], skip: data.verdict === "skip" ? (data.rule ?? "no rule named") : null };
    if (extra.skip) this.log(src, item, "ai-skip-marked", "AI says skip: " + extra.skip);
    return { send: true, category: verdict === "relevant" ? null : category, flag: scanned && !wantsDates ? "scanned" : null, extra, how: noText ? "AI (title only)" : "AI" };
  }

  // Returns { send, category (null = keep the keyword category), flag (null | "unchecked" | "capped" | "limit" | "scanned"),
  //           extra ({ body: lines shown under the title, skip: rule name or null }), how }
  // Job and Correction notices always get the AI read of the PDF (post, vacancies, dates); other kinds keep the old rules.
  async decide(src, item) {
    const verdict = keywordVerdict(item.title);
    const keywordCategory = categorize(item.title);
    if (!this.force) {
      if (verdict === "irrelevant") { this.log(src, item, "skipped", "keyword: clearly irrelevant"); return { send: false, how: "keywords" }; }
      if (verdict === "relevant" && !NEEDS_DATES.has(keywordCategory)) return { send: true, category: null, flag: null, how: "keywords" };
    }
    const isPdf = /\.pdf(\?|#|$)/i.test(item.link);
    const today = todayIST(this.now());

    const cached = this.cache[item.link];
    if (cached && typeof cached === "object" && cached.data) return this.fromEntry(src, item, cached, verdict);
    if (typeof cached === "string" && !NEEDS_DATES.has(cached)) {   // an older answer (category only) that needs no dates
      if (cached === "Not Relevant") this.log(src, item, "not-relevant", "cached AI answer");
      return { send: cached !== "Not Relevant", category: cached, flag: null, how: "cache" };
    }

    // A web page (not a PDF) cannot be read for dates. Titles the keywords already trust are not sent to the AI for that alone.
    if (!isPdf && verdict === "relevant") return { send: true, category: null, flag: null, extra: { body: detailLines(null, today, { notPdf: true }), skip: null }, how: "keywords" };

    if (this.broken) return { send: true, category: null, flag: "unchecked", how: "AI stopped" };
    if (this.calls >= this.cfg.maxAiCallsPerRun || this.usage.calls >= this.cfg.maxAiCallsPerDay)
      return { send: true, category: null, flag: verdict === "relevant" ? "limit" : "capped", how: "call limit reached" };

    let text = "", scanned = false, noText = false;
    if (isPdf) {
      try { ({ text, scanned } = await this.readPdf(item.link, this.cfg, src)); }
      catch (e) { noText = true; console.log(`  (PDF text unavailable for "${item.title.slice(0, 50)}": ${e.message}; using the title only)`); }
    } else noText = true;

    this.calls++; this.usage.calls++;
    try {
      const data = parseReply(await this.ask(item.title, text), today);
      if (!text) Object.assign(data, { start: null, last: null, oldLast: null });   // no document text: any date would be a guess
      const entry = { data, scanned, noText };
      this.cache[item.link] = entry;
      const d = this.fromEntry(src, item, entry, verdict);
      if (d.extra && noText && !isPdf) d.extra.body = detailLines(null, today, { notPdf: true });
      return d;
    } catch (e) {
      console.error(`  AI problem: ${e.message}`);
      // Bad key, no credit or rate limit: stop asking for the rest of this run; everything else goes out unchecked.
      if ([400, 401, 402, 403, 429].includes(e.status)) this.broken = e.message;
      return { send: true, category: null, flag: "unchecked", how: "AI error" };
    }
  }

  summary() {
    return `AI calls: ${this.calls}/${this.cfg.maxAiCallsPerRun} (today ${this.usage.calls}/${this.cfg.maxAiCallsPerDay}) | tokens in ${this.inTokens}, out ${this.outTokens} | approx cost $${this.cost.toFixed(5)}` +
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
