'use client';

import React, { useState } from 'react';
import { useResearch } from '@/lib/storage/context';
import { Situation, DisplacementRecord, ContextEvent, SourceComparisonItem } from '@/lib/data/types';
import { KeyNumberCard } from '@/components/situation/KeyNumberCard';
import { OverTimeChart } from '@/components/charts/OverTimeChart';
import { WherePeopleAreChart } from '@/components/charts/WherePeopleAreChart';
import { formatDisplacementNumber } from '@/lib/formatting/numbers';
import { AlertCircle, Calendar, FileText, Download, Check, Bookmark, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SituationClientProps {
  situation: Situation;
  timeSeries: DisplacementRecord[];
  hosts: DisplacementRecord[];
  sourceComparison: { situation_id: string; year: number; sources: SourceComparisonItem[]; discrepancy_explanation: string } | null;
  events: ContextEvent[];
}

const SECTIONS = [
  { id: 'brief', label: 'Brief' },
  { id: 'key-numbers', label: 'Key numbers' },
  { id: 'over-time', label: 'Over time' },
  { id: 'where-people-are', label: 'Where people are' },
  { id: 'compare-sources', label: 'Compare sources' },
  { id: 'context', label: 'Context timeline' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'sources-reading', label: 'Sources & reading' },
];

export function SituationClient({
  situation,
  timeSeries,
  hosts,
  sourceComparison,
  events
}: SituationClientProps) {
  const { numberFormat, guideMode, addToCollection } = useResearch();
  const [activeSection, setActiveSection] = useState('brief');
  const [viewMode, setViewMode] = useState<'chart' | 'data'>('chart');
  const [readMoreBrief, setReadMoreBrief] = useState(false);
  const [pinnedAll, setPinnedAll] = useState(false);

  // Latest verified stock
  const latestRecord = timeSeries[timeSeries.length - 1] || { obs_value: 89507, year: 2025 };
  // Historical peak record (1990: ~200,000)
  const peakRecord = timeSeries.reduce((max, r) => (r.obs_value || 0) > (max.obs_value || 0) ? r : max, timeSeries[0] || { obs_value: 200000, year: 1990 });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header Breadcrumbs & Badges (Sketch 3) */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 mb-1">
            <span>Situation</span>
            <span>·</span>
            <span>{situation.startYear} to {situation.endYear || 2025}</span>
            <span>·</span>
            <span className="text-blue-600 font-medium">{situation.region}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            {situation.title}
          </h1>
        </div>

        {/* Source Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {situation.sources.map((src, i) => (
            <span
              key={i}
              className="text-xs font-mono px-2.5 py-1 rounded bg-stone-100 border border-stone-300 text-stone-700"
            >
              {src}
            </span>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Navigation Rail (Sketch 3) + Primary Reading Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Step Rail (Sketch 3) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-3 px-3">
            On this page
          </div>
          <nav className="space-y-1">
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveSection(sec.id);
                  document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center gap-2.5 ${
                  activeSection === sec.id
                    ? 'bg-stone-200 text-stone-900 font-semibold'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${activeSection === sec.id ? 'bg-blue-600' : 'bg-stone-300'}`} />
                <span>{sec.label}</span>
              </button>
            ))}
          </nav>

          {/* Guide Mode Tip Card (Sketch 3) */}
          {guideMode && (
            <div className="mt-8 p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 space-y-2 shadow-sm animate-in fade-in">
              <div className="font-bold flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">1</span>
                <span>Guide Tip: Start with the Brief</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Before analyzing raw statistics, understand the historical why, when, and how. Every number in this portal connects back to real human migration events.
              </p>
            </div>
          )}
        </aside>

        {/* Primary Reading Column (Max 1 Chart & 3-4 Key Numbers at a time) */}
        <div className="lg:col-span-9 space-y-16">
          {/* SECTION 1: BRIEF (Sketch 3) */}
          <section id="brief" className="scroll-mt-24 space-y-6">
            <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-stone-900">
                1. Situation Brief
              </h2>
              <span className="text-xs text-stone-500 font-mono">
                Reviewed by {situation.brief.reviewer}
              </span>
            </div>

            <div className="p-6 bg-white border border-stone-200 rounded-2xl shadow-sm space-y-4 text-sm leading-relaxed text-stone-800">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-2 font-mono font-bold text-blue-700 text-xs uppercase tracking-wider">
                  WHAT
                </div>
                <div className="md:col-span-10">
                  {situation.brief.what}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-2 font-mono font-bold text-blue-700 text-xs uppercase tracking-wider">
                  WHY
                </div>
                <div className="md:col-span-10">
                  {situation.brief.why}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-2 font-mono font-bold text-blue-700 text-xs uppercase tracking-wider">
                  WHEN
                </div>
                <div className="md:col-span-10">
                  {situation.brief.when}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-2 font-mono font-bold text-blue-700 text-xs uppercase tracking-wider">
                  HOW
                </div>
                <div className="md:col-span-10">
                  {situation.brief.how}
                </div>
              </div>

              {readMoreBrief && (
                <div className="pt-4 border-t border-stone-100 text-xs text-stone-600 space-y-2 animate-in fade-in">
                  <p>
                    <strong>Welfare & camp administration:</strong> Unlike signatory states with direct UNHCR camp governance, the Government of Tamil Nadu administers welfare packages (subsidized rice, doles, housing repairs, free electricity) via the Commissionerate of Rehabilitation and Welfare.
                  </p>
                  <p>
                    <strong>Repatriation dynamics:</strong> Despite bilateral discussions and voluntary return schemes facilitating ~10,000 returns between 2009–2019, ongoing economic collapse and unresolved land restitution in Sri Lanka continue to limit voluntary repatriation.
                  </p>
                </div>
              )}

              <button
                onClick={() => setReadMoreBrief(!readMoreBrief)}
                className="text-xs text-blue-600 font-medium hover:underline pt-2 block"
              >
                {readMoreBrief ? 'Read less ▲' : 'Read more about camp policy & repatriation ▼'}
              </button>
            </div>
          </section>

          {/* SECTION 2: KEY NUMBERS (Sketch 4) */}
          <section id="key-numbers" className="scroll-mt-24 space-y-6">
            <div className="border-b border-stone-200 pb-3">
              <h2 className="text-xl font-serif font-bold text-stone-900">
                2. Key Numbers
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Verified figures from official series. Click any number to inspect source provenance or pin it to your collection.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <KeyNumberCard
                label="Refugees in India"
                value={latestRecord.obs_value || 89507}
                year={2025}
                populationType="Year-end stock"
                sourceName="UNHCR Refugee Data Finder"
                explainer={{
                  whatIsCounted: 'Sri Lankan refugees residing in India as of 31 Dec 2025 reported to UNHCR.',
                  typeOfFigure: 'A stock (persons present at year-end), not new arrivals.',
                  notIncluded: 'Asylum seekers awaiting adjudication and non-registered persons.',
                  reliability: 'Reported by host government; reflects state registration registries.'
                }}
                rawRecord={latestRecord}
              />

              <KeyNumberCard
                label="Peak Displaced in India"
                value={200000}
                year="1990–1991"
                populationType="Highest on record"
                sourceName="UNHCR PopStatsOfficial"
                explainer={{
                  whatIsCounted: 'Maximum registered population sheltering in Tamil Nadu during the height of armed conflict.',
                  typeOfFigure: 'Historical peak stock count.',
                  notIncluded: 'Unrecorded boat crossings without camp registration.',
                  reliability: 'UNHCR official historical record.'
                }}
                rawRecord={peakRecord}
              />

              <KeyNumberCard
                label="Share of all Sri Lankan Refugees"
                value={60}
                year={2025}
                populationType="60.3% hosted in India"
                sourceName="UNHCR (Calculated Share)"
                explainer={{
                  whatIsCounted: 'India hosts 89,507 of the 148,369 Sri Lankan refugees globally.',
                  typeOfFigure: 'Derived proportion (89,507 / 148,369).',
                  notIncluded: 'Diaspora who have obtained foreign citizenship or naturalization.',
                  reliability: 'Calculated from verified UNHCR global country records.'
                }}
                rawRecord={{
                  obs_value: 89507,
                  label: 'Share of Sri Lankan Refugees Hosted in India (60.3%)',
                  year: 2025,
                  pop_type_label: 'Share calculation (89,507 of 148,369)',
                  is_calculated: true,
                  formula: '89,507 (India) / 148,369 (Worldwide Total)'
                }}
              />
            </div>
          </section>

          {/* SECTION 3: OVER TIME (Sketch 6) */}
          <section id="over-time" className="scroll-mt-24 space-y-6">
            <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  3. Over Time
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Sri Lankan refugees in India fell from 2,00,000 (1990) to ~89,507 (2025).
                </p>
              </div>

              {/* Chart / Data View Toggle (F14 & Sketch 9) */}
              <div className="flex items-center rounded-lg border border-stone-300 p-0.5 text-xs font-mono">
                <button
                  onClick={() => setViewMode('chart')}
                  className={`px-3 py-1 rounded transition ${
                    viewMode === 'chart' ? 'bg-blue-600 text-white font-medium' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Chart
                </button>
                <button
                  onClick={() => setViewMode('data')}
                  className={`px-3 py-1 rounded transition ${
                    viewMode === 'data' ? 'bg-blue-600 text-white font-medium' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Data table
                </button>
              </div>
            </div>

            {viewMode === 'chart' ? (
              <div className="bg-white p-6 border border-stone-200 rounded-2xl shadow-sm space-y-6">
                <OverTimeChart records={timeSeries} events={events} />

                {/* Context Event Timeline beneath chart (Sketch 6) */}
                <div className="pt-4 border-t border-stone-100">
                  <div className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-3">
                    Chronological Context Events
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {events.map((evt) => (
                      <div
                        key={evt.event_id}
                        className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs space-y-1 hover:border-blue-400 transition"
                      >
                        <div className="font-mono font-bold text-blue-700 flex items-center justify-between">
                          <span>{evt.year}</span>
                          <span className="text-[10px] uppercase font-sans text-stone-500">{evt.category}</span>
                        </div>
                        <div className="font-semibold text-stone-900">{evt.title}</div>
                        <div className="text-stone-600 line-clamp-2">{evt.description}</div>
                      </div>
                    ))}
                  </div>

                  {/* Mandatory Correlation Disclaimer (Principle 3.5 & F16) */}
                  <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-500 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Correlation Notice:</strong> These visualizations show timing and patterns, not proven causes. Displacement figures (UNHCR) and armed conflict milestones (UCDP/historians) come from separate sources.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Accessible Table View (Master Prompt Acceptance Criteria) */
              <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden text-xs">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-left divide-y divide-stone-200">
                    <thead className="bg-stone-50 font-mono text-stone-600 sticky top-0">
                      <tr>
                        <th className="p-3">Year</th>
                        <th className="p-3">Origin</th>
                        <th className="p-3">Host</th>
                        <th className="p-3">Population Measure</th>
                        <th className="p-3">Registered Count</th>
                        <th className="p-3">Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-mono">
                      {timeSeries.map((r) => (
                        <tr key={r.record_id} className="hover:bg-stone-50">
                          <td className="p-3 font-bold">{r.year}</td>
                          <td className="p-3">{r.area_ori_label}</td>
                          <td className="p-3">{r.ref_area_label}</td>
                          <td className="p-3 font-sans">{r.pop_type_label}</td>
                          <td className="p-3 font-bold text-blue-600">
                            {formatDisplacementNumber(r.obs_value, numberFormat)}
                          </td>
                          <td className="p-3 text-stone-500 text-[11px] font-sans">{r.data_series}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          {/* SECTION 4: WHERE PEOPLE ARE (Sketch 9) */}
          <section id="where-people-are" className="scroll-mt-24 space-y-6">
            <div className="border-b border-stone-200 pb-3">
              <h2 className="text-xl font-serif font-bold text-stone-900">
                4. Where People Are (Global Distribution)
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                India continues to host 60% of all displaced Sri Lankans worldwide.
              </p>
            </div>

            <div className="bg-white p-6 border border-stone-200 rounded-2xl shadow-sm space-y-4">
              <WherePeopleAreChart hosts={hosts} />
              <div className="text-xs text-stone-600 leading-relaxed pt-2 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-2">
                <span>
                  <strong>2025 Global totals:</strong> India ({formatDisplacementNumber(89507, numberFormat)}), France (~24,000), Canada (~16,000), United Kingdom (~11,000). Total: 1,48,369 worldwide.
                </span>
                <Link
                  href="/flow/sri-lankan-refugees"
                  className="text-blue-600 font-medium hover:underline flex items-center gap-1"
                >
                  Explore onward movement flow &rarr;
                </Link>
              </div>
            </div>
          </section>

          {/* SECTION 5: COMPARE SOURCES (Sketch 8) */}
          {sourceComparison && (
            <section id="compare-sources" className="scroll-mt-24 space-y-6">
              <div className="border-b border-stone-200 pb-3">
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  5. Compare Sources: Why the Numbers Differ
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Two sources, 2016: India reports ~38,000 more refugees than UNHCR.
                </p>
              </div>

              <div className="bg-white p-6 border border-stone-200 rounded-2xl shadow-sm space-y-6">
                {/* Visual Bar Comparison (Sketch 8) */}
                <div className="space-y-4">
                  {sourceComparison.sources.map((s, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>{s.publisher}</span>
                        <span className="font-mono text-base">{s.formatted_value}</span>
                      </div>
                      <div className="w-full bg-stone-100 h-6 rounded-md overflow-hidden relative">
                        <div
                          className={`h-full rounded-md ${idx === 0 ? 'bg-blue-600' : 'bg-stone-500'}`}
                          style={{ width: `${(s.value / 105000) * 100}%` }}
                        />
                      </div>
                      <div className="text-[11px] text-stone-500 italic">
                        {s.notes}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Why They Differ Comparison Table (Sketch 8) */}
                <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full divide-y divide-stone-200">
                    <thead className="bg-stone-50 font-mono text-stone-600">
                      <tr>
                        <th className="p-3 text-left">Dimension</th>
                        <th className="p-3 text-left text-blue-600">UNHCR</th>
                        <th className="p-3 text-left text-stone-800">Government of India (MEA)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      <tr>
                        <td className="p-3 font-semibold text-stone-500">Who is counted</td>
                        <td className="p-3">{sourceComparison.sources[0].who_is_counted}</td>
                        <td className="p-3">{sourceComparison.sources[1].who_is_counted}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-stone-500">Method</td>
                        <td className="p-3">{sourceComparison.sources[0].method}</td>
                        <td className="p-3">{sourceComparison.sources[1].method}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-stone-500">Coverage</td>
                        <td className="p-3">{sourceComparison.sources[0].coverage}</td>
                        <td className="p-3">{sourceComparison.sources[1].coverage}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-stone-500">Legal Definition</td>
                        <td className="p-3">{sourceComparison.sources[0].definition}</td>
                        <td className="p-3">{sourceComparison.sources[1].definition}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 leading-relaxed">
                  <strong>Analytical Conclusion:</strong> {sourceComparison.discrepancy_explanation}
                </div>
              </div>
            </section>
          )}

          {/* SECTION 6: LIMITATIONS (Sketch 10) */}
          <section id="limitations" className="scroll-mt-24 space-y-6">
            <div className="border-b border-stone-200 pb-3">
              <h2 className="text-xl font-serif font-bold text-stone-900">
                6. Limitations: What This Data Cannot Tell You
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Methodological gaps, administrative artifacts, and legal definitions are shown alongside numbers.
              </p>
            </div>

            <div className="space-y-3">
              {situation.limitations.map((lim, i) => (
                <div
                  key={i}
                  className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm flex items-start gap-3.5"
                >
                  <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    lim.severity === 'critical' ? 'text-amber-600' : 'text-stone-400'
                  }`} />
                  <div>
                    <div className="font-bold text-sm text-stone-900">{lim.title}</div>
                    <div className="text-xs text-stone-600 mt-1 leading-relaxed">{lim.description}</div>
                  </div>
                </div>
              ))}

              {/* Demographics Gaps Indicator (Sketch 10) */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center text-stone-700 font-mono">
                  <span>Demographic Data Coverage (Age & Gender):</span>
                  <span className="font-bold text-amber-700">0% known (Not published)</span>
                </div>
                <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden">
                  <div className="w-0 bg-blue-600 h-full" />
                </div>
                <div className="text-[11px] text-stone-500 pt-1">
                  Missing indicators: Gender breakdown, age brackets, annual voluntary return tallies, and immigration detention figures.
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 7: SOURCES AND READING (Sketch 12) */}
          <section id="sources-reading" className="scroll-mt-24 space-y-6">
            <div className="border-b border-stone-200 pb-3">
              <h2 className="text-xl font-serif font-bold text-stone-900">
                7. Sources & Academic Reading List
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Full bibliographic citations and reviewed scholarship to begin your literature review.
              </p>
            </div>

            <div className="space-y-4">
              {situation.readings.map((book, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-white border border-stone-200 rounded-xl shadow-sm space-y-2 hover:border-blue-400 transition"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-stone-500">{book.authors} ({book.year})</span>
                    <span className="uppercase text-[10px] font-mono tracking-wider px-2 py-0.5 bg-stone-100 rounded text-stone-600">
                      {book.type}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-stone-900">
                    <a href={book.url} target="_blank" rel="noreferrer" className="hover:text-blue-600 underline">
                      {book.title}
                    </a>
                  </div>
                  <div className="text-xs text-stone-600 italic">
                    {book.citationApa}
                  </div>
                  <div className="text-xs text-stone-500 pt-1">
                    {book.note}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
