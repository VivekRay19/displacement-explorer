'use client';

import React, { useState } from 'react';
import { SITUATIONS_CATALOGUE } from '@/lib/data/situations';
import { useResearch } from '@/lib/storage/context';
import { formatDisplacementNumber } from '@/lib/formatting/numbers';
import Link from 'next/link';

export default function CompareWorkspacePage() {
  const { numberFormat } = useResearch();
  const [selectedSlugA, setSelectedSlugA] = useState('sri-lankan-refugees-in-india');
  const [selectedSlugB, setSelectedSlugB] = useState('rohingya-in-bangladesh');

  const sitA = SITUATIONS_CATALOGUE.find(s => s.slug === selectedSlugA) || SITUATIONS_CATALOGUE[0];
  const sitB = SITUATIONS_CATALOGUE.find(s => s.slug === selectedSlugB) || SITUATIONS_CATALOGUE[1];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-blue-600">
          Research Tool
        </span>
        <h1 className="text-3xl font-serif font-bold text-stone-900 tracking-tight mt-1">
          Compare Situations Workspace
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl mt-2 leading-relaxed">
          Side-by-side analysis of displacement drivers, host arrangements, legal frameworks, and verified population scales.
        </p>
      </div>

      {/* Comparison Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-2">
          <label className="text-xs font-mono font-bold text-stone-600 uppercase">Situation A</label>
          <select
            value={selectedSlugA}
            onChange={(e) => setSelectedSlugA(e.target.value)}
            className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SITUATIONS_CATALOGUE.map(s => (
              <option key={s.slug} value={s.slug}>{s.title}</option>
            ))}
          </select>
        </div>

        <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-2">
          <label className="text-xs font-mono font-bold text-stone-600 uppercase">Situation B</label>
          <select
            value={selectedSlugB}
            onChange={(e) => setSelectedSlugB(e.target.value)}
            className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SITUATIONS_CATALOGUE.map(s => (
              <option key={s.slug} value={s.slug}>{s.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Comparison Dossiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Situation A Column */}
        <div className="p-6 bg-white border border-stone-200 rounded-2xl shadow-sm space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold">
              {sitA.region} · {sitA.startYear}–{sitA.endYear || 'Present'}
            </span>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">{sitA.title}</h2>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-stone-800">Brief Summary</div>
            <p className="text-stone-600 leading-relaxed">{sitA.summary}</p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-bold text-stone-800">Primary Origin Country</div>
            <div className="font-mono text-sm">{sitA.originCountry.name} ({sitA.originCountry.code})</div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-bold text-stone-800">Key Host States</div>
            <div className="flex flex-wrap gap-1.5">
              {sitA.hostCountries.map((h, i) => (
                <span key={i} className="px-2 py-1 bg-stone-100 rounded font-mono text-[11px] text-stone-700">
                  {h.name}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-bold text-stone-800">Methodological Limitations</div>
            <ul className="list-disc pl-4 space-y-1 text-stone-600">
              {sitA.limitations.map((lim, i) => (
                <li key={i}>{lim.title}</li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <Link
              href={`/situations/${sitA.slug}`}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Open Full Research Dossier &rarr;
            </Link>
          </div>
        </div>

        {/* Situation B Column */}
        <div className="p-6 bg-white border border-stone-200 rounded-2xl shadow-sm space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 font-bold">
              {sitB.region} · {sitB.startYear}–{sitB.endYear || 'Present'}
            </span>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">{sitB.title}</h2>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-stone-800">Brief Summary</div>
            <p className="text-stone-600 leading-relaxed">{sitB.summary}</p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-bold text-stone-800">Primary Origin Country</div>
            <div className="font-mono text-sm">{sitB.originCountry.name} ({sitB.originCountry.code})</div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-bold text-stone-800">Key Host States</div>
            <div className="flex flex-wrap gap-1.5">
              {sitB.hostCountries.map((h, i) => (
                <span key={i} className="px-2 py-1 bg-stone-100 rounded font-mono text-[11px] text-stone-700">
                  {h.name}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-bold text-stone-800">Methodological Limitations</div>
            <ul className="list-disc pl-4 space-y-1 text-stone-600">
              {sitB.limitations.map((lim, i) => (
                <li key={i}>{lim.title}</li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <Link
              href={`/situations/${sitB.slug}`}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Open Full Research Dossier &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
