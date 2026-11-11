# System Architecture — Displacement Explorer

## 1. Overview
Displacement Explorer is a research-grade data visualization platform and academic research companion built to explore, understand, compare, and trace forced displacement statistics worldwide.

## 2. Core Architectural Decisions
- **Static-First Data Architecture**: Versioned JSON snapshots and metadata produced by verified data pipelines (`/scripts`). The frontend is served directly from local verified snapshots, ensuring lightning-fast performance, zero reliance on live third-party API availability during browsing, and complete protection against upstream breaking changes or downtime.
- **Repository Pattern (`DataRepository`)**: All data access is mediated through TypeScript interfaces (`StaticDataRepository`), enabling seamless plug-in of future databases (such as Supabase PostgreSQL) without altering UI components.
- **Client-Side Research State**: Browser `localStorage` holds user collections, custom notes, pinned numbers/charts, number format preferences (Indian vs. International), and Guide Mode settings.
- **Rule-Based Natural Query Parser**: Custom tokenizer combined with `Fuse.js` fuzzy matching over a structured story and geographic catalogue. Zero reliance on paid or hallucination-prone AI APIs.
- **Multi-Format Export Engine**: Client-side generation of Excel (`exceljs`), Word (`docx`), CSV (`papaparse`), chart images (`echarts` canvas/PNG), and print-ready research bibliographies with strict academic citation styles (APA, Chicago, Harvard).

## 3. Tech Stack
- **Framework**: Next.js 14+ (App Router), React 18, TypeScript (Strict Mode).
- **Styling & UI**: Tailwind CSS, Radix UI primitives, Lucide icons.
- **Visualization**: Apache ECharts (`echarts-for-react`), `react-globe.gl` / Three.js for interactive globe, TopoJSON/GeoJSON for global displacement mapping.
- **Tables**: `@tanstack/react-table`.
- **Validation**: Zod schema validation for all ingested records and snapshot models.

## 4. Directory Layout
```text
displacement-explorer/
├── app/                  # Next.js App Router routes
│   ├── page.tsx          # Homepage with Quiet Globe, Ask Bar, Year Slider
│   ├── situations/       # Situation directory & situation research page ([slug])
│   ├── compare/          # Multi-situation and multi-country comparison workspace
│   ├── source-comparison/# Dual-source discrepancy analyzer (e.g. UNHCR vs IDMC vs MEA)
│   ├── flow/             # Onward movement & flow visualization
│   ├── learn/            # Learning Centre (Glossary, How-to-Read, Correlation vs Causation)
│   ├── data-library/     # Catalogue of integrated & external datasets
│   ├── collection/       # "My Collection" research notebook & export modal
│   ├── works-cited/      # Complete bibliography and citation crosswalk
│   └── request-data/     # Structured missing-data request workspace
├── components/           # Modular UI & visualization components
│   ├── layout/           # AppHeader, AppFooter, StepRail, GuideMode
│   ├── globe/            # Interactive 3D Globe with hover cards & filters
│   ├── search/           # AskBar with query tokenizer & suggested query pills
│   ├── charts/           # ECharts line, area, mirrored bar, Sankey flow wrappers
│   ├── tables/           # TanStack data tables with pagination & sorting
│   ├── situation/        # Section views (Brief, KeyNumbers, OverTime, Sources, Limitations)
│   ├── source-trace/     # Slide-over Source Trace panel with row-level provenance
│   └── collection/       # Pinning buttons, drawer, and export controls
├── lib/
│   ├── data/             # Types, Zod schemas, Static repository implementations
│   ├── repositories/     # Repository interfaces
│   ├── search/           # Rule-based query parser & Fuse index
│   ├── citations/        # APA / Chicago / Harvard generator
│   └── exports/          # CSV, Excel, Word, and print formatters
├── public/
│   ├── data/             # Versioned JSON datasets (PopStatsOfficial, UCDP, MEA, etc.)
│   └── geo/              # GeoJSON / TopoJSON boundary files
├── scripts/              # Data retrieval, transformation, and validation pipeline
└── docs/                 # Architecture, Data Provenance, and Assumptions
```
