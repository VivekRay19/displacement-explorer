# Methodological Assumptions & Ground Rules — Displacement Explorer

## 1. Core Principles
- **No Fabricated Statistics**: Every figure displayed originates from an officially published dataset or a documented mathematical derivation of verified rows.
- **Traceability**: Every statistical number links to its underlying dataset, reporting period, observation date, measurement type, and original source fields via the Source Trace drawer.
- **Honest Limitations**: Missing demographic breakdowns, series breaks, or non-equivalent definitions (e.g., camp vs. non-camp populations) are highlighted as primary research considerations, never hidden or smoothed over.

## 2. API & Data Handling Assumptions
- **UNHCR Base URL**: `https://api-data.unhcr.org/api/v0`. Publicly accessible, no API key required.
- **Filter Syntax**: The query endpoint requires dimension filters formatted as `c[dimension_name]=value` (e.g. `c[ref_area_adm0]=IND&c[area_ori_adm0]=LKA`).
- **Codes & Semantics**:
  - `_T`: Total.
  - `_X`: Unspecified.
  - `REF_UNHCR`: Refugees under UNHCR's mandate.
  - `REF_UNRWA`: Refugees under UNRWA's mandate.
  - `ASY`: Asylum-seekers.
  - `IDP_UNHCR` & `IDP_IDMC`: Internally displaced persons as monitored by UNHCR or IDMC.
- **Stocks vs Flows**:
  - `PopStatsOfficial` reports year-end stocks (active population present as of Dec 31).
  - Annual stocks must NEVER be summed to create cumulative totals.
- **Temporal Association vs Causation**:
  - Contextual armed conflict data (from UCDP) and policy/disaster milestones are plotted along the same timeline for chronological reference, explicitly disclaiming causal inference.

## 3. Reference Research Journey: Sri Lankan Refugees in India
- **UNHCR Historical Data**: Spans from early 1990s through 2025. In the 1990s, UNHCR recorded ~200,000–210,000 Sri Lankan refugees in India. Recent records reflect ~89,000–92,000.
- **Government of India (MEA) Discrepancy**: A 2016 Lok Sabha official answer reported 101,005 Sri Lankan refugees (64,144 in 107 government-run camps in Tamil Nadu and 36,861 non-camp registered refugees). UNHCR's corresponding figure was 63,162 because UNHCR predominantly reflects registered camp populations. This discrepancy is a foundational demonstration of the platform's multi-source crosswalk and analysis tools.
