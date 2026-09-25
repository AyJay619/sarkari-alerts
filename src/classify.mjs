// Optional AI classification of NEW notices. Switch and limits live in config.json; word lists in keywords.json.
// Nothing here runs unless aiEnabled is true (or the test command is used).
import fs from "node:fs";
import path from "node:path";
import { extractText, getDocumentProxy } from "unpdf";

const readJson = f => JSON.parse(fs.readFileSync(new URL("../" + f, import.meta.url), "utf8"));
export const loadConfig = () => readJson("config.json");
const KEYWORDS = readJson("keywords.json");
const wordList = list =>
  new RegExp("(?:^|[^a-z])(?:" + list.map(w => w.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")(?:[^a-z]|$)", "i");
const RELEVANT = wordList(KEYWORDS.relevant), IRRELEVANT = wordList(KEYWORDS.irrelevant);

const CATEGORIES = ["Job", "Admit Card", "Result", "Answer Key", "Correction", "Not Relevant"];

// Free check on the title. "relevant" -> alert without AI, "irrelevant" -> skip without AI, "unclear" -> ask the AI.
export function keywordVerdict(title) {
  const rel = RELEVANT.test(title), irr = IRRELEVANT.test(title);
  if (rel && !irr) return "relevant";
  if (irr && !rel) return "irrelevant";
  return "unclear";
}

// Downloads a PDF and returns the text of its first pages (trimmed). Only this text is ever sent to the AI, never the file.
async function pdfText(url, cfg) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(25000),
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0 Safari/537.36" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = new Uint8Array(await res.arrayBuffer());
  if (buf.length > cfg.pdfMaxMegabytes * 1024 * 1024) throw new Error("PDF too large");
  if (String.fromCharCode(...buf.slice(0, 4)) !== "%PDF") throw new Error("not a PDF");
  const pdf = await getDocumentProxy(buf);
  const { text } = await extractText(pdf, { mergePages: false });
  return text.slice(0, cfg.pdfPages).join("\n").replace(/\s+/g, " ").trim().slice(0, cfg.pdfMaxChars);
}

export class Classifier {
  // cacheFile / logFile: where the cache and the review log are kept (null = never write them; used by test mode)
  constructor(cfg, { apiKey, cacheFile = null, logFile = null, force = false, mergeCacheFrom = null } = {}) {
    Object.assign(this, { cfg, apiKey, cacheFile, logFile, force });
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

  log(src, item, decision, reason) {
    console.log(`  [${decision}] ${src.name}: ${item.title.slice(0, 90)} (${reason})`);
    this.logRows.push({ time: new Date().toISOString(), source: src.name, title: item.title, link: item.link, decision, reason });
  }

  async ask(title, text) {
    const prompt = `You sort Indian government website notices for a job-alert service.
Title: ${title}
${text ? `Start of the document:\n${text}\n` : "(No document text available: judge by the title only.)\n"}
Answer with exactly one of: Job, Admit Card, Result, Answer Key, Correction, Not Relevant.
Job = recruitment/vacancy/engagement advertisement. Correction = corrigendum/addendum/date extension/schedule change for an exam or recruitment.
Not Relevant = tenders, circulars, office orders, policies, anything not about recruitment or exams.`;
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
    const answer = (body.content?.[0]?.text ?? "").trim().toLowerCase();
    const cat = CATEGORIES.find(c => answer.startsWith(c.toLowerCase()));
    if (!cat) throw new Error(`unexpected answer "${answer.slice(0, 30)}"`);
    return cat;
  }

  // Returns { send, category (null = keep the keyword category), flag (null | "unchecked" | "capped" | "scanned"), how }
  async decide(src, item) {
    const verdict = keywordVerdict(item.title);
    if (!this.force) {
      if (verdict === "relevant") return { send: true, category: null, flag: null, how: "keywords" };
      if (verdict === "irrelevant") { this.log(src, item, "skipped", "keyword: clearly irrelevant"); return { send: false, how: "keywords" }; }
    }

    const cached = this.cache[item.link];
    if (cached) {
      if (cached === "Not Relevant") this.log(src, item, "not-relevant", "cached AI answer");
      return { send: cached !== "Not Relevant", category: cached, flag: null, how: "cache" };
    }
    if (this.broken) return { send: true, category: null, flag: "unchecked", how: "AI stopped" };
    if (this.calls >= this.cfg.maxAiCallsPerRun) return { send: true, category: null, flag: "capped", how: "call limit reached" };

    let text = "", scanned = false;
    if (/\.pdf(\?|#|$)/i.test(item.link)) {
      try {
        text = await pdfText(item.link, this.cfg);
        scanned = text.length < 40;   // (almost) no text = a scanned image
        if (scanned) text = "";
      } catch (e) {
        console.log(`  (PDF text unavailable for "${item.title.slice(0, 50)}": ${e.message}; using the title only)`);
      }
    }

    this.calls++;
    try {
      const category = await this.ask(item.title, text);
      this.cache[item.link] = category;
      if (category === "Not Relevant") this.log(src, item, "not-relevant", "AI said Not Relevant");
      return { send: category !== "Not Relevant", category, flag: scanned ? "scanned" : null, how: "AI" };
    } catch (e) {
      console.error(`  AI problem: ${e.message}`);
      // Bad key, no credit or rate limit: stop asking for the rest of this run; everything else goes out unchecked.
      if ([400, 401, 402, 403, 429].includes(e.status)) this.broken = e.message;
      return { send: true, category: null, flag: "unchecked", how: "AI error" };
    }
  }

  summary() {
    return `AI calls: ${this.calls}/${this.cfg.maxAiCallsPerRun} | tokens in ${this.inTokens}, out ${this.outTokens} | approx cost $${this.cost.toFixed(5)}` +
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
