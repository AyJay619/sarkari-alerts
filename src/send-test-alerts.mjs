// Sends three 🧪 TEST alerts (with the "📥 Send to agents" button) to your Telegram, to try the listener for real:
//   1. a real SSC notice with a PDF   -> tap: the PDF lands in the inbox
//   2. a notice on a site that is NOT in sources.json -> tap: refused
//   3. an RRB page link (not a PDF)   -> tap: saved as link only
// Run:  npm run send-test-alerts     (needs TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env)
import fs from "node:fs";
import { fetchItems } from "./fetchers.mjs";
import { formatItem, formatGroup, makeSender } from "./telegram.mjs";

const { TELEGRAM_BOT_TOKEN: token, TELEGRAM_CHAT_ID: chatId } = process.env;
if (!token || !chatId) { console.error("Put TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in the .env file."); process.exit(1); }
const send = makeSender({ token, chatId, dryRun: false });
const sources = JSON.parse(fs.readFileSync(new URL("../sources.json", import.meta.url), "utf8"));
const test = html => send("🧪 <b>TEST</b>\n" + html, true);

const ssc = (await fetchItems({ ...sources.find(s => s.id === "ssc"), limit: 1 }))[0];
const results = [
  await test(formatItem("SSC", "Job", ssc.title, ssc.link)),
  await test(formatItem("SSC", "Job", "Test: a notice from a site that is not in sources.json", "https://example.com/not-allowed.pdf")),
  await test(formatGroup("RRB", "Other", "RRB CEN 03/2026: Exam Schedule", ["Patna"], 21, "https://rrb.indianrailways.gov.in/getdata?cennum=03/2026&loc=patna&category=Exam%20Schedule")),
];
console.log(results.every(Boolean) ? "Sent 3 test alerts. Tap the buttons in Telegram (the listener must be running)." : "Some messages failed to send.");
process.exit(results.every(Boolean) ? 0 : 1);
