// Ordering and grouping of a run's alerts: Central then State; Jobs, Admit Cards, Results, Other. Pure functions, no I/O.
export const LEVELS = [
  { key: "central", icon: "🏛️", label: "Central", title: "CENTRAL GOVT" },
  { key: "state", icon: "🗺️", label: "State", title: "STATE GOVT" },
];
export const BUCKETS = [
  { key: "jobs", icon: "💼", name: "Jobs" },
  { key: "admit", icon: "🎫", name: "Admit Cards" },
  { key: "results", icon: "📊", name: "Results" },
  { key: "other", icon: "📝", name: "Other" },   // Answer Key, Correction, Other
];

// A source without a (valid) level counts as central.
export const levelOf = src => (src?.level === "state" ? "state" : "central");
export const bucketOf = category => category === "Job" ? "jobs" : category === "Admit Card" ? "admit" : category === "Result" ? "results" : "other";
export const levelInfo = key => LEVELS.find(l => l.key === key) ?? LEVELS[0];

// The tag that starts the first line of every alert, e.g. "🏛️ Central".
export const levelTag = key => { const l = levelInfo(key); return `${l.icon} ${l.label}`; };

// alerts: [{ level, category, ... }]. Returns the messages to send, in order: [{ html, alert? }]
// (alert is set for the notice messages, which get the "Send to agents" button).
export function buildPlan(alerts) {
  if (!alerts.length) return [];   // nothing new: send nothing at all
  const count = (lvl, b) => alerts.filter(a => a.level === lvl && bucketOf(a.category) === b).length;
  const line = (b, n) => `${b.icon} ${b.name}: ${n}` + (n ? "" : " — none");
  const plan = [];

  const parts = l => BUCKETS.map(b => `${b.icon} ${b.name} ${count(l.key, b.key)}`).join(" · ");
  plan.push({ html: [`📋 <b>New this run: ${alerts.length}</b>`, ...LEVELS.map(l => `${l.icon} ${l.label} Govt: ${alerts.filter(a => a.level === l.key).length} (${parts(l)})`)].join("\n") });

  for (const l of LEVELS) {
    const total = alerts.filter(a => a.level === l.key).length;
    const empty = BUCKETS.filter(b => !count(l.key, b.key));
    // The level header carries the empty categories, so they cost no extra messages
    plan.push({ html: [`${l.icon} <b>${l.title} — ${total} new</b>`, ...empty.map(b => line(b, 0))].join("\n") });
    for (const b of BUCKETS) {
      const n = count(l.key, b.key);
      if (!n) continue;
      plan.push({ html: `${b.icon} <b>${b.name}: ${n}</b>` });
      for (const a of alerts.filter(a => a.level === l.key && bucketOf(a.category) === b.key)) plan.push({ html: a.html, alert: a });
    }
  }
  return plan;
}
