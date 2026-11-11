import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-stone-200 dark:border-slate-800 bg-[#f8f7f4] dark:bg-slate-950 py-10 text-stone-600 dark:text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-3">
          <div className="font-semibold text-sm text-stone-900 dark:text-slate-200">
            Displacement Explorer
          </div>
          <p className="leading-relaxed text-stone-600 dark:text-slate-400 max-w-md">
            Understanding displacement through evidence. A university data visualization research project built to enable rigorous, traceable, and respectful study of global forced displacement.
          </p>
          <div className="p-3 bg-stone-100 dark:bg-slate-900 rounded-md border border-stone-200 dark:border-slate-800 text-[11px] leading-relaxed">
            <strong>Academic Disclaimer:</strong> This is an independent academic project developed for research and educational purposes. It is not an official UNHCR product and is not affiliated with or endorsed by UNHCR or the United Nations.
          </div>
        </div>

        <div>
          <div className="font-semibold text-sm text-stone-900 dark:text-slate-200 mb-3">
            Primary Data Sources
          </div>
          <ul className="space-y-2">
            <li>
              <a
                href="https://refugeedata.unhcr.org/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-600 underline"
              >
                UNHCR Refugee Data Portal
              </a>
            </li>
            <li>
              <a
                href="https://www.internal-displacement.org/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-600 underline"
              >
                IDMC Global Internal Displacement Database
              </a>
            </li>
            <li>
              <a
                href="https://ucdp.uu.se/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-600 underline"
              >
                UCDP / PRIO Armed Conflict Dataset
              </a>
            </li>
            <li>
              <a
                href="https://mea.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-600 underline"
              >
                Ministry of External Affairs, Govt. of India
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-semibold text-sm text-stone-900 dark:text-slate-200 mb-3">
            Navigation & Tools
          </div>
          <ul className="space-y-2">
            <li><Link href="/situations" className="hover:text-blue-600 underline">Situations Directory</Link></li>
            <li><Link href="/source-comparison" className="hover:text-blue-600 underline">Compare Sources</Link></li>
            <li><Link href="/learn" className="hover:text-blue-600 underline">Learn: How to Read Data</Link></li>
            <li><Link href="/data-library" className="hover:text-blue-600 underline">Dataset Library</Link></li>
            <li><Link href="/works-cited" className="hover:text-blue-600 underline">Works Cited & Bibliography</Link></li>
            <li><Link href="/request-data" className="hover:text-blue-600 underline">Request Data / Gap Report</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-4 border-t border-stone-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-stone-500">
        <div>
          Dataset Snapshot: 2026 Release · PopStatsOfficial (UNHCR API v0)
        </div>
        <div>
          Data Attribution: CC BY 4.0 International · All calculations documented.
        </div>
      </div>
    </footer>
  );
}
