# PGIMER Chandigarh (pgimer)
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (works; one small limit change proposed)

## BATCH SUMMARY BLOCK
SITE: PGIMER Vacancies | VERDICT: FIX
PROPOSED: 1) raise limit 60 -> 80 (page now lists 67 rows, 7 oldest are cut off); everything else unchanged
MISSING TODAY: 7 oldest active rows (cut by limit 60; harmless as they are old); no results/admit-card page found (PGIMER posts interview lists inside the same vacancy page)
ASK BATLEE: Project/ad-hoc posts (Project Research Scientist, Project Nurse, Senior Resident adhoc, walk-ins) are contract roles, many per week; recommend PASS only regular posts (Nursing Officer, UPSC-routed Assistant Professors, Principal/Vice Principal) and HOLD project/ad-hoc/walk-in ones, as a "contract" rule - confirm
(Not a bug: URL parameter aflag=0/1/2/3 all return the identical page.)

## Pages watched and tested
| Page | URL | Fetch | Verdict |
|---|---|---|---|
| Vacancies (all active notices) | https://pgimer.edu.in/PGIMER_PORTAL/PGIMERPORTAL/Vacancies/JSP/VIEW_CALL.jsp?aflag=0 | free, https, needs extraCerts certs/letsencrypt-yr1-chain.pem (already set) | FREE-OK |

fetchItems: 4 runs, 60 items every time, 0.1-0.4 s, no failures. Page has 67 ViewAll.jsp rows (S.No + Title table). Cost: 0 credits. Each row opens ViewAll.jsp?record=<id> (a detail page with title, "Active" status and notice PDF links at /PGIMER_PORTAL/AbstractFilePath?FileType=E&FileName=...pdf&PathKey=VACANCY_PATH). Detail pages and PDFs are on the same free host (detail page fetched OK; PDF download not individually tested).
Link stability: record ids are permanent and sequential (15579 .. 15777), so no flood risk. Order is newest-first with occasional out-of-order rows (edited notices such as 15771, 15641). Page lists only active notices; old ones drop off, so the count moves (67 today).

## Label pattern
Titles are free sentences, no "Type:" prefix:
- "Applications are invited for the post of <Post> by the Dept. of <Dept>" = New Job (project/ad-hoc contract).
- "Walk-in Interview for ..." = New Job (walk-in).
- "RECRUITMENT NOTICE - To fill the N posts of <Post> ... advt. no. PGI/RC/..." = New Job (regular).
- "Advertisement reg. UPSC for recruitment of N posts ..." / "Vacancy Circular for ..." = New Job (routed via UPSC / Ministry).
- Prefix in brackets "(Date Extended)", "(Postponed)", "(Rescheduled)", "(Cancelled)", "(Addendum attached)" = Update.
- "Short listed candidate for interview for the post of ..." / "Interview for the post of ..." = Update (interview list).
- Parent = post + department (e.g. "Project Technical Support-II, Dept of Virology", "243 Nursing Officer, advt PGI/RC/055/2026"). Strip the bracket prefix to match an update to its job.

## Hold / pass rules (for sorter)
Hold (needs BatLee confirmation, see block): project-basis posts (Project Research Scientist, Project Technical Support, Project Nurse, JRF/SRF, Consultant, Project Coordinator), ad-hoc Senior/Junior Resident, Junior/Senior Demonstrator ad-hoc, walk-in contract posts. Consultant posts under programmes: Hold by standing rule.
Pass: regular posts (Nursing Officer 243), UPSC-routed Assistant Professor advertisement, Principal / Vice Principal circular, Scientist B/C regular-looking posts (check), all their corrigenda/extensions/cancellations, results and shortlists for passed jobs.
Standing note: no keyword filter in the script; current exclude regex (shortlisted|compassionate|qualified|roll no|unique id) drops "Short listed" only if spelled "shortlisted"; PGIMER spells it "Short listed", so those rows do come through (desired under the pass rule).

## Sample links (audit day, record ids)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Recruitment notice, 243 posts Nursing Officer regular (15641) | New Job | Nursing Officer advt PGI/RC/055/2026 | Pass |
| Advertisement reg. UPSC, 64 posts Specialist Grade-III Asst Professors Anatomy / Gen Medicine (15729) | New Job | UPSC CHS Asst Prof | Pass |
| Vacancy Circular Professor-cum-Principal / Vice Principal RAKCON (15655) | New Job | RAKCON Principal | Pass (check deputation wording) |
| 10 posts Senior Residents adhoc, Anaesthesia (15777) | New Job | SR Anaesthesia | Hold (ad-hoc, pending ask) |
| Project Research Scientist-I, Dept of Virology (15773) | New Job | PRS-I Virology | Hold (project) |
| Short listed candidates for interview PRS-III / PTS-III Neurosurgery (15771) | Update | PRS-III Neurosurgery | Hold (project) |
| Walk-in Interview PRS-II, Yoga Therapist, MTS, CCRYN (15763) | New Job | CCRYN | Hold |
| (Date Extended) Project Technical Support-II, Virology (15753) | Update | PTS-II Virology | Hold (project) |
| (Postponed) PRS-I, PTS-III, PTS-I Hepatology (15747) | Update | Hepatology posts | Hold |
| (Cancelled) Project Nurse-III, Pediatrics (15661) | Update | PN-III Pediatrics | Hold |
| (Addendum attached) PTS-III Community Medicine (15721) | Update | PTS-III CM | Hold |
| Walk-in Interview two Senior Residents adhoc, Pediatrics (15745) | New Job | SR Pediatrics | Hold |
| Consultant under National Tele Mental Health Programme, Psychiatry (15649) | New Job | Consultant Tele MH | Hold |
| Junior Research Fellow, Medical Microbiology (15659) | New Job | JRF Microbiology | Hold |
| Scientist B and Scientist C (Non-Medical) Regional VRDL Virology (15585) | New Job | Scientist B/C VRDL | Hold (project-funded, likely contract; confirm) |
| Project Clinical Research Coordinator, Urology (15587) | New Job | PCRC Urology | Hold |

## Proposed config
{
  "id": "pgimer", "name": "PGIMER Vacancies", "runner": "india", "tier": "FREE", "level": "central", "type": "html",
  "url": "https://pgimer.edu.in/PGIMER_PORTAL/PGIMERPORTAL/Vacancies/JSP/VIEW_CALL.jsp?aflag=0",
  "extraCerts": ["certs/letsencrypt-yr1-chain.pem"],
  "include": "ViewAll[.]jsp",
  "exclude": "shortlisted|compassionate|qualified|roll no|unique id",
  "limit": 80
}
Only change: limit 60 -> 80. The seen check needs no rebaseline for a limit change (older rows just become visible; they may arrive once as "new" if never seen, up to 7 old rows; acceptable, or rebaseline to avoid).

## Uncertain
- Volume: most rows are project/ad-hoc contract posts; if BatLee wants them passed, expect several alerts per week.
- Whether "shortlisted" in the exclude was meant to drop shortlist notices (standing rule says pass them); today it only matters for the spelling "Shortlisted".
- PDF direct download and a separate results page were not tested.
