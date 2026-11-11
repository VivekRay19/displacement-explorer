import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Filter } from 'lucide-react';

const DATASETS = [
  {
    code: 'PopStatsOfficial',
    title: 'UNHCR Official Population Statistics (PopStatsOfficial)',
    publisher: 'United Nations High Commissioner for Refugees (UNHCR)',
    status: 'integrated',
    coverage: 'Global, 1951–2025',
    frequency: 'Annual (year-end stock)',
    description: 'Official population statistics on refugees under UNHCR mandate, asylum-seekers, IDPs protected by UNHCR, returnees, and stateless persons.',
    limitations: 'Disaggregated demographic coverage (age/sex) is absent for select corridors; non-signatory state registries may exclude community-settled refugees.',
    url: 'https://refugeedata.unhcr.org/'
  },
  {
    code: 'UCDP_PRIO',
    title: 'UCDP / PRIO Armed Conflict Dataset',
    publisher: 'Uppsala Conflict Data Program / PRIO',
    status: 'integrated',
    coverage: 'Global, 1946–2025',
    frequency: 'Annual release (v26.1)',
    description: 'Chronological event coding of organized violence, state-based armed conflicts, non-state armed conflict, and one-sided violence.',
    limitations: 'Measures battle-related deaths and conflict active years; does not track individual civilian displaced persons.',
    url: 'https://ucdp.uu.se/'
  },
  {
    code: 'MEA_LOKSABHA',
    title: 'Government of India — Ministry of External Affairs Lok Sabha Statements',
    publisher: 'Ministry of External Affairs / Lok Sabha Secretariat',
    status: 'integrated',
    coverage: 'India bilateral snapshots (e.g. August 2016)',
    frequency: 'Periodic parliamentary replies',
    description: 'National and state administrative registration counts of Sri Lankan Tamil refugees residing in Tamil Nadu government camps and outside camps.',
    limitations: 'Ad-hoc reporting frequency governed by parliamentary inquiries rather than continuous public API series.',
    url: 'https://mea.gov.in/'
  },
  {
    code: 'IDMC_GIDD',
    title: 'IDMC Global Internal Displacement Database (GIDD)',
    publisher: 'Internal Displacement Monitoring Centre (IDMC)',
    status: 'available_planned',
    coverage: 'Global, 2008–2025',
    frequency: 'Annual release & mid-year updates',
    description: 'Comprehensive monitoring of internal displacement resulting from conflict, generalized violence, and disaster events.',
    limitations: 'Disaster displacements reflect incident event counts (flows) rather than permanent displaced populations.',
    url: 'https://www.internal-displacement.org/'
  },
  {
    code: 'IOM_DTM',
    title: 'IOM Displacement Tracking Matrix (DTM)',
    publisher: 'International Organization for Migration (IOM)',
    status: 'available_planned',
    coverage: 'Crisis-specific countries (e.g. Sudan, Somalia)',
    frequency: 'Bi-weekly and monthly monitoring',
    description: 'Rapid field assessments capturing localized mobility dynamics, village-level displacement, and humanitarian site conditions.',
    limitations: 'Varying methodologies by country mission; difficult to harmonize globally across historical decades.',
    url: 'https://dtm.iom.int/'
  }
];

export default function DataLibraryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-blue-600">
          Source Repository
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight mt-1">
          Dataset Library & Provenance Catalog
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl mt-2 leading-relaxed">
          Transparent accounting of integrated datasets, methodology frameworks, publisher mandates, and data availability statuses.
        </p>
      </div>

      <div className="space-y-6">
        {DATASETS.map((ds) => (
          <div
            key={ds.code}
            className="p-6 bg-white border border-stone-200 rounded-2xl shadow-sm space-y-4 hover:border-stone-300 transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                  {ds.code}
                </span>
                <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-semibold ${
                  ds.status === 'integrated' ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-600'
                }`}>
                  {ds.status === 'integrated' ? 'Integrated Snapshot' : 'Available / Reference'}
                </span>
              </div>
              <a
                href={ds.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Publisher Portal</span> <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <h2 className="text-xl font-bold text-stone-900">{ds.title}</h2>
            <div className="text-xs text-stone-500 font-mono">
              Publisher: {ds.publisher} · Coverage: {ds.coverage} · Cadence: {ds.frequency}
            </div>

            <p className="text-xs text-stone-700 leading-relaxed">
              {ds.description}
            </p>

            <div className="p-3 bg-stone-50 border border-stone-100 rounded-lg text-xs text-stone-600 leading-relaxed">
              <strong className="text-stone-800">Known Limitations & Constraints:</strong> {ds.limitations}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
