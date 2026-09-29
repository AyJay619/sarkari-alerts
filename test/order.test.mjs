// Dry test: prints the messages a run would send, in order, without touching Telegram.  Run: node test/order.test.mjs
import { buildPlan, levelOf } from "../src/order.mjs";
import { formatItem, formatGroup } from "../src/telegram.mjs";
import { parseAlert } from "../src/inbox.mjs";

let fails = 0;
const check = (name, ok) => { console.log((ok ? "PASS " : "FAIL ") + name); if (!ok) fails++; };
const show = plan => plan.forEach((m, i) => console.log(`\n#${i + 1}${m.alert ? " [button]" : ""}\n` + m.html.replace(/<\/?b>/g, "").replace(/&amp;/g, "&")));
const A = (level, category, src, title) => ({ level, category, html: formatItem(src, category, title, "https://example.gov.in/x.pdf", null, level) });

check("no level defaults to central", levelOf({}) === "central" && levelOf(undefined) === "central" && levelOf({ level: "bogus" }) === "central");
check("nothing new -> nothing sent", buildPlan([]).length === 0);

// Case 1: only central, only some categories (arrives in mixed order)
const plan = buildPlan([
  A("central", "Result", "UPSC", "Result of X"), A("central", "Job", "SSC", "Advt 1"), A("central", "Admit Card", "IBPS", "Admit card Y"),
  A("central", "Job", "SBI", "Advt 2"), A("central", "Answer Key", "SSC", "Answer key Z"), A("central", "Job", "ISRO", "Advt 3"),
]);
console.log("===== CASE 1: 6 central alerts, 0 state ====="); show(plan);
const order = plan.filter(m => m.alert).map(m => m.alert.category);
check("order Jobs, Admit, Results, Other", order.join() === "Job,Job,Job,Admit Card,Result,Answer Key");
check("summary first", plan[0].html.startsWith("📋"));
check("state header present with 0 and all zero lines", plan.some(m => m.html.includes("STATE GOVT — 0 new") && m.html.includes("Jobs: 0 — none") && m.html.includes("Other: 0 — none")));

// Case 2: both levels, incl. a grouped RRB alert
const rrb = { level: "central", category: "Other", html: formatGroup("RRB", "Other", "RRB CEN 03/2026: Exam Schedule", ["Patna", "Ranchi"], 21, "https://rrb.indianrailways.gov.in/x", null, "central") };
const plan2 = buildPlan([A("state", "Job", "UPPSC", "State advt"), rrb, A("central", "Job", "SSC", "Advt")]);
console.log("\n===== CASE 2: mixed levels ====="); show(plan2);
check("central before state", plan2.filter(m => m.alert).map(m => m.alert.level).join() === "central,central,state");

// Listener parsing still works with the new tag
const plain = h => h.replace(/<\/?b>/g, "");
const p = parseAlert(plain(A("state", "Job", "UPPSC", "State advt").html));
check("listener reads tagged alert", p?.category === "Job" && p.source === "UPPSC" && p.title === "State advt" && p.link === "https://example.gov.in/x.pdf");
const pg = parseAlert(plain(rrb.html));
check("listener reads tagged group alert", pg?.category === "Other" && pg.source === "RRB");
check("listener still reads old untagged alert", parseAlert("💼 Job · SSC\n\nOld one\n\n🔗 https://ssc.gov.in/a.pdf")?.source === "SSC");
process.exit(fails ? 1 : 0);
