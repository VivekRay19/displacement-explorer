import React from 'react';
import Link from 'next/link';
import { Layers, ArrowRight } from 'lucide-react';

export default function SourceComparisonPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-blue-600">
          Source Crosswalk & Discrepancy Analysis
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight mt-1">
          Why Statistics Differ Across Organizations
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl mt-2 leading-relaxed">
          Discrepancies in displacement numbers rarely indicate mathematical error. They arise from differing agency mandates, legal definitions, geographical boundaries, and reporting intervals.
        </p>
      </div>

      {/* Case 1: India vs UNHCR (2016 Lok Sabha Data) */}
      <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
              Verified Corroboration Study
            </span>
            <h2 className="text-xl font-bold text-stone-900 mt-1">
              Sri Lankan Refugees in India (2016 Snapshot)
            </h2>
          </div>
          <Link
            href="/situations/sri-lankan-refugees-in-india#compare-sources"
            className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
          >
            Open in Situation Dossier &rarr;
          </Link>
        </div>

        {/* Side-by-Side Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-blue-50/40 border border-blue-200 rounded-xl space-y-3">
            <span className="text-xs font-mono font-bold text-blue-800">UNHCR REFUGEE DATA FINDER</span>
            <div className="text-3xl font-mono font-bold text-blue-900">63,162</div>
            <div className="text-xs text-stone-600 leading-relaxed">
              <strong>Count criteria:</strong> Year-end stock snapshot reported to UNHCR. Reflects predominantly registered camp dwellers eligible for specific welfare food ration doles.
            </div>
            <div className="text-[11px] font-mono text-stone-500 pt-2 border-t border-blue-100">
              Coverage: Year-end 2016 · Source: UNHCR official database
            </div>
          </div>

          <div className="p-6 bg-stone-50 border border-stone-300 rounded-xl space-y-3">
            <span className="text-xs font-mono font-bold text-stone-700">GOVERNMENT OF INDIA (MEA)</span>
            <div className="text-3xl font-mono font-bold text-stone-900">1,01,005</div>
            <div className="text-xs text-stone-600 leading-relaxed">
              <strong>Count criteria:</strong> Official Lok Sabha unstarred answer (No. 3974). Includes <strong>64,144</strong> individuals across 107 state camps plus <strong>36,861</strong> non-camp registered residents in Tamil Nadu.
            </div>
            <div className="text-[11px] font-mono text-stone-500 pt-2 border-t border-stone-200">
              Coverage: August 2016 · Source: Ministry of External Affairs
            </div>
          </div>
        </div>

        {/* Analytical explanation */}
        <div className="p-5 bg-stone-100 rounded-xl text-xs text-stone-800 leading-relaxed space-y-2">
          <h3 className="font-bold text-stone-900">Why the 37,843 discrepancy exists:</h3>
          <p>
            The camp figures match almost identically (63,162 UNHCR vs. 64,144 Indian Government). The primary discrepancy is that UNHCR's international report did not integrate non-camp refugees who reside independently in local Indian communities with local police registration. Comparing the two numbers without understanding this administrative boundary produces false conclusions about population changes.
          </p>
        </div>
      </div>

      {/* Case 2: IDMC vs UNHCR Global IDP Crosswalk */}
      <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <span className="text-[10px] font-mono uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
            Global Methodological Crosswalk
          </span>
          <h2 className="text-xl font-bold text-stone-900 mt-1">
            Internal Displacement: UNHCR vs. IDMC
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left divide-y divide-stone-200 text-xs">
            <thead className="bg-stone-50 font-mono text-stone-600">
              <tr>
                <th className="p-3">Dimension</th>
                <th className="p-3 text-blue-700">UNHCR (IDPs of Concern)</th>
                <th className="p-3 text-amber-800">IDMC (Global Internal Displacement)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr>
                <td className="p-3 font-semibold text-stone-600">Mandate & Scope</td>
                <td className="p-3">Only IDPs in situations where UNHCR is formally requested to protect or assist.</td>
                <td className="p-3">All IDPs globally, covering every country regardless of UN operational presence.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-stone-600">Drivers Covered</td>
                <td className="p-3">Conflict and generalized violence.</td>
                <td className="p-3">Both armed conflict and natural hazard/disaster displacement.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-stone-600">Reporting Metrics</td>
                <td className="p-3">Year-end stocks.</td>
                <td className="p-3">Year-end stocks AND annual internal movement flows (new displacements).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
