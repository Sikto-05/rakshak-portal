# Rakshak — Integrated Criminal Network Analysis System
> Smart India Hackathon 2024 · Law Enforcement Intelligence Portal

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Netlify-00C7B7?style=flat&logo=netlify)](https://rakshak-sih.netlify.app)

---

## 🛡️ About

**Rakshak** is a professional-grade criminal network analysis portal built for law enforcement agencies. It enables investigators to analyse entity relationships, trace evidence-backed connections, and uncover hidden criminal networks using AI-assisted tools — with full human oversight and verification at every step.

> ⚠️ **DISCLAIMER:** All data in this system is completely synthetic and de-identified. No real persons, criminal records, or case information are represented. Not connected to live CCTNS, ICJS, NAFIS, or any government database. For demonstration and evaluation purposes only.

---

## 🔑 Demo Login Credentials

| Username | Password | Role |
|---|---|---|
| `inv.sharma` | `rakshak@2024` | Investigator |
| `si.verma` | `rakshak@2024` | Sr. Investigator |
| `supt.khan` | `rakshak@2024` | Supervisor |
| `analyst.nair` | `rakshak@2024` | Analyst |
| `admin.sys` | `rakshak@2024` | Admin |

---

## 🚀 Core Features

1. **Entity Search & Resolution** — Fuzzy search across 5,000+ entities. Recognises "Mohammad Arif Sheikh", "Md. Arif", and "M. Arif" as the same person using NLP.

2. **Knowledge Graph** — Interactive Cytoscape.js graph. Every edge is backed by evidence (source, timestamp, confidence score). Temporal slider shows network evolution.

3. **Investigation Path Finder** — Find the shortest evidence-backed path between any two entities. Each hop shows full evidence trail.

4. **Investigator Copilot** — Natural language queries in English or Hindi. Evidence-grounded responses only — no hallucinations.

5. **Evidence Ledger** — Full audit of every relationship: source document, timestamp, confidence, verifier, hash fingerprint. Contradiction detection built in.

6. **Geo Intelligence Map** — India-specific: Country → State → District → Police Station drill-down.

7. **Network Analytics** — Precision/Recall/F1 metrics, temporal growth, betweenness centrality, confidence distribution.

8. **Audit Log** — Who accessed what, when, and why. Full session tracking.

---

## 🔒 Role-Based Access

| Role | Phone Unmask | Verify Relationships | Export | Audit Log |
|---|---|---|---|---|
| Investigator | ❌ | ❌ | ❌ | ❌ |
| Sr. Investigator | ✅ | ✅ | ✅ | ❌ |
| Supervisor | ✅ | ✅ | ✅ | ✅ |
| Analyst | ❌ | ❌ | ✅ | ❌ |
| Admin | ✅ | ✅ | ✅ | ✅ |

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS (dark navy + amber theme)
- **Graph:** Cytoscape.js
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Fuzzy Search:** Fuse.js

---

## 🏃 Running Locally

```bash
git clone https://github.com/SiktoSaha/rakshak-portal.git
cd rakshak-portal
npm install --legacy-peer-deps
npm run dev
```

Open `http://localhost:5173`

---

## 📦 Deployment

```bash
npm run build
# Deploy dist/ to any static host (Netlify, Vercel, GitHub Pages)
```

---

## 📊 Synthetic Dataset

- 20 representative persons across 7 Indian states
- 8 phone entities (including burner phones)
- 5 vehicles with RTO registration data
- 12 geo-located crime sites
- 5 FIR cases across multiple states
- 24 evidence-backed relationships
- 4 detected criminal communities

Ground truth labels available for Precision/Recall/F1 evaluation.

---

## ⚖️ Ethics & Compliance

- Relationship scoring only — no person labelled as "criminal"
- All AI hypotheses clearly marked, require human verification
- Bridge nodes identified but never auto-labelled as "mastermind"
- Contradiction detection prevents auto-merging of conflicting records
- Full audit trail for accountability
