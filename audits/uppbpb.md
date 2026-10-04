# UPPRPB (UP Police Recruitment and Promotion Board)

## BATCH SUMMARY BLOCK
```
SITE: UPPRPB (UP Police Board) | VERDICT: FIX
PROPOSED: 1) keep uppbpb source as is (home page, 6 latest notices, https works, free). 2) add extraUrls ["https://uppbpb.gov.in/Home/Notice"] (27 notices, ~3 months, one page, no paging) so a burst of >6 notices between scans is not lost; limit 40. 3) add titleReplace to strip "LATEST NOTICE: " prefix and " [ Notice Board ]" suffix so the same PDF has the same title on both pages. 4) timeoutMs 15000. URL change => auto-rebaseline.
MISSING TODAY: home page shows only 6 notices (posting rate up to ~5-8 a day in PET season) so bursts can be missed; Result and Direct Recruitment pages are empty/menu-only (no PDFs).
ASK BATLEE: none (all notices are Hindi only; no English duplicate exists, so none are held as Hindi duplicates - recommend passing them).
```

Audited: 2026-10-04 | Group: FREE | Status: PROPOSAL (batch mode, config not changed)

## Pages watched and tested
| Page | URL | Fetch | Verdict |
|---|---|---|---|
| Home (current source) | https://uppbpb.gov.in/ | free fetchItems, 478 ms; http, www and https all work | FREE-OK, 6 items (5 plain + 1 "LATEST NOTICE:" prefixed) |
| Notice Board | https://uppbpb.gov.in/Home/Notice | free, 5/5 requests HTTP 200 | FREE-OK, 27 items dated 06-07-2026 to 03-10-2026, single page, no paging |
| Result | https://uppbpb.gov.in/Home/Result | free, loads | Empty: no PDF links (results are posted as notices) |
| Direct Recruitment | https://uppbpb.gov.in/Home/DirectRecruitment (and ?drId=7) | free, loads | Menu only, no PDFs |

Tender, Promotion, Government Orders, Manual pages exist; not watched (hold-type content).

## ScrapFly
Not needed. PDFs: direct links under /FilesUploaded/Notice/ (not downloaded in this audit; Hindi scanned images, so the sorter must open them).

## What the scanner catches vs misses
Home gives 6 links; the include "FilesUploaded/Notice" works. Notice page gives 27. Rate: roughly 27 notices in 3 months on average, but heavy bursts during PET/DV rounds (4 on 03-10 and 01-10). Limit 30 is enough. Links are stable (GUID filenames), no flood risk seen. Note: the 27 notice-page items already show a different title text than the home page (suffix), so identical PDFs would look new unless titleReplace is added; the PDF links in state/seen are the same.

## Label pattern
Titles are long Hindi sentences: "<Exam/Enrollment> के अन्तर्गत <what> का प्रकाशन". Parent = the part before "के अन्तर्गत", e.g. "आरक्षी नागरिक पुलिस एवं समकक्ष पदों पर सीधी भर्ती-2025" (Constable Civil Police Direct Recruitment 2025), "उप निरीक्षक नागरिक पुलिस ... सीधी भर्ती-2025" (SI 2025), "होमगार्ड्स एनरोलमेंट-2025", "मुख्य आरक्षी मोटर परिवहन", "कुशल खिलाड़ी भर्ती-2023". Type keywords: प्रवेश पत्र = Admit Card; परिणाम / चयन परिणाम / अर्ह अभ्यर्थियों की सूचना = Result; उत्तर कुंजी = Answer Key; तिथियों/केन्द्र/परिवर्तन = Update; शारीरिक दक्षता परीक्षा (PET) and DV/PST schedules = Update (current-cycle schedules pass). No advert number in filenames (random GUIDs).

## Hold / pass rules for the sorter
Hold: भूतपूर्व सैनिक only notices (ex-servicemen special notices), मृतक आश्रित (dependent of deceased employee) recruitment/PET, normalised-marks (प्रसामान्यीकृत अंक) notices, "चयन परिणाम" of old cycles (e.g. 2020-2025 motor transport, if clearly old), weather/rain notices only if they just cancel without dates (otherwise Pass as Update), tenders, promotion/departmental notices.
Pass: new recruitment advertisements, admit cards (PET, DV/PST, written), results and final selection results, answer keys, PET/DV dates and centre changes, cancellations.

## Sample links (audit day)
| Title (short) | Type | Parent | Pass/Hold |
|---|---|---|---|
| होमगार्ड्स एनरोलमेंट-2025 अन्तिम चयन परिणाम | Result | Homeguard Enrolment 2025 | Pass |
| आरक्षी ना.पु. 2025 PET केन्द्रों एवं तिथियों की सूचना | Update | Constable Civil Police 2025 | Pass |
| आरक्षी ना.पु. 2025 PET की तिथियों की सूचना | Update | Constable Civil Police 2025 | Pass |
| आरक्षी 2025 भूतपूर्व सैनिक श्रेणी महत्वपूर्ण सूचना | Update | Constable Civil Police 2025 | Hold (ESM-only) |
| आरक्षी 2025 PET प्रवेश पत्र डाउनलोड सूचना | Admit Card | Constable Civil Police 2025 | Pass |
| आरक्षी 2025 PET प्रक्रिया | Update | Constable Civil Police 2025 | Pass |
| होमगार्ड्स 2025 संतकबीरनगर PET लखनऊ में परिवर्तित | Update | Homeguard Enrolment 2025 | Pass |
| होमगार्ड्स 2025 PET प्रवेश पत्र | Admit Card | Homeguard Enrolment 2025 | Pass |
| होमगार्ड्स 2025 वर्षा के कारण PET स्थगित | Update | Homeguard Enrolment 2025 | Pass |
| आरक्षी 2025 DV/PST प्रवेश पत्र एवं आवेदन पत्र | Admit Card | Constable Civil Police 2025 | Pass |
| आरक्षी 2025 लिखित परीक्षा (8-10 जून) अन्तिम उत्तर कुंजी | Answer Key | Constable Civil Police 2025 | Pass |
| आरक्षी 2025 DV/PST हेतु अर्ह अभ्यर्थी | Result | Constable Civil Police 2025 | Pass |
| उप निरीक्षक 2025 प्रसामान्यीकृत अंक | Update | SI Civil Police 2025 | Hold (normalisation) |
| मृतक आश्रित SI/प्लाटून कमाण्डर PET | Update | Dependent of deceased | Hold |
| उपनिरीक्षक 2025 अन्तिम चयन परिणाम | Result | SI Civil Police 2025 | Pass |
| कुशल खिलाड़ी भर्ती-2023 चयन परिणाम | Result | Sportsperson 2023 | Pass |
| मुख्य आरक्षी मोटर परिवहन 176 पद चयन परिणाम | Result | Head Constable Motor Transport | Pass |

## Proposed config (not applied)
```json
{
  "id": "uppbpb", "name": "UPPRPB (UP Police Board)", "runner": "india", "tier": "FREE", "level": "state",
  "type": "html", "url": "https://uppbpb.gov.in/",
  "extraUrls": ["https://uppbpb.gov.in/Home/Notice"],
  "include": "FilesUploaded/Notice", "minTitle": 15, "limit": 40, "timeoutMs": 15000,
  "titleReplace": [["^LATEST NOTICE:\s*", ""], ["\s*\[\s*Notice Board\s*\]\s*$", ""]]
}
```
The exact titleReplace syntax must be checked against README/other sources in sources.json before applying (not verified here).

## Uncertain
- titleReplace format not verified; if unsupported, drop item 3 (duplicates then only appear once at rebaseline, since the seen check keys on title|link).
- Notice page dates are visible in the page (dd-mm-yyyy) but not in the extracted title.
- PDFs are scanned images; the sorter cannot rely on text extraction.

## BatLee's corrections
none yet

## Repairs
none
