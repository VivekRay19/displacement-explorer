# Displacement Explorer
> **Understanding displacement through evidence.**

A research-oriented data visualization platform and academic companion built for university students, researchers, and scholars of forced displacement, migration, and humanitarian affairs.

---

## 1. Project Identity & Purpose
Displacement Explorer is an independent academic project designed to communicate complex forced displacement statistics calmly, clearly, and with complete source provenance. It strictly adheres to research integrity:
- **No Fabricated Statistics**: All figures derive from verified official datasets (`PopStatsOfficial` via UNHCR API v0, UCDP conflict records, and official government publications).
- **Traceability**: Every figure can be clicked to open the **Source Trace** panel, inspecting the original value, publisher, reporting period, definitions, footnotes, and full APA citation.
- **Explain Before Showing**: Each situation opens with a structured 4-part brief (**What, Why, When, How**), followed by key figures, over-time charts, and visible limitations.
- **Timing vs. Causation**: Context timelines explicitly disclaim causal assumptions.
- **Multi-Source Crosswalks**: Compares conflicting datasets (e.g., UNHCR's camp-focused 63,162 vs. India's Lok Sabha answer of 1,01,005 in 2016) without artificially averaging or merging them.

---

## 2. Technical Stack
- **Framework**: Next.js 14+ (App Router), React 18, TypeScript (Strict Mode).
- **Styling**: Tailwind CSS, semantic displacement palette (Refugees: Blue, Asylum: Amber, IDPs: Terracotta, Stateless: Violet).
- **Visualization**: Apache ECharts (`echarts-for-react`), `react-globe.gl` / Three.js, TopoJSON/GeoJSON.
- **Search**: Fuse.js fuzzy matching with custom rule-based query parser.
- **Exports**: Client-side generation of Excel (`exceljs`), Word (`docx`), CSV (`papaparse`), chart images, and print-ready summary views.
- **Persistence**: Safe browser `localStorage` for My Collection, researcher notes, and number formatting preferences (Indian `1,00,000` vs. International `100,000`).

---

## 3. Getting Started

### Prerequisites
- Node.js 18.x or 20.x+
- npm or pnpm

### Installation
```bash
git clone https://github.com/VivekRay19/displacement-explorer.git
cd displacement-explorer
npm install
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Data Ingestion & Transformation Pipeline
To refresh local snapshots directly from the official UNHCR Refugee Data Portal API:
```bash
npm run data:refresh
```
This runs:
1. `scripts/download-unhcr-data.mjs`: Retrieves constraints, metadata, and verified records across corridors from `https://api-data.unhcr.org/api/v0`.
2. `scripts/transform-data.mjs`: Validates records with Zod, normalizes reporting units, extracts annual time series, and generates verified snapshots and manifests in `public/data/processed/`.

### Production Build
```bash
npm run build
npm run start
```

---

## 4. Key Application Routes
- `/`: Dark atmospheric home with interactive 3D Globe, central Ask Bar, and year selector.
- `/situations`: Browsable directory of global displacement situations.
- `/situations/sri-lankan-refugees-in-india`: Central research dossier featuring the 10-step research journey:
  1. Brief (What, Why, When, How)
  2. Key Numbers with "What does this number mean?" explainers
  3. Over-Time line chart with Chart/Data table toggle and context timeline
  4. Where People Are (global host country distribution)
  5. Compare Sources (UNHCR vs. Government of India 2016 discrepancy analysis)
  6. Context Timeline (UCDP armed conflicts & policy milestones with correlation disclaimer)
  7. Limitations (demographic coverage gaps, registry artifacts, non-signatory status)
  8. Sources & Academic Reading List (APA, Chicago, Harvard citations)
- `/flow/sri-lankan-refugees`: Macro onward movement Sankey visualization across host states.
- `/compare`: Multi-situation comparison workspace.
- `/source-comparison`: Dedicated agency crosswalk (UNHCR vs. IDMC vs. national governments).
- `/learn`: Learning Centre, Glossary of terms, and interactive primers:
  - `/learn/how-to-read`: Stocks vs. Flows and the Bathtub Principle.
  - `/learn/correlation-vs-causation`: Interpreting displacement curves responsibly.
- `/data-library`: Transparent index of integrated and referenced datasets with version metadata.
- `/collection`: My Collection notebook with customizable researcher notes and real file downloads (Excel, Word, CSV, Print/PDF).
- `/works-cited`: Comprehensive academic bibliography.
- `/request-data`: Community data request and research gap submission workspace.

---

## 5. Academic & Non-Affiliation Disclaimer
*Displacement Explorer is an independent academic research and data-visualization platform developed for educational and scholarly inquiry. It is not an official UNHCR product, nor is it endorsed by or affiliated with UNHCR or the United Nations.*
