import React from 'react';
import Link from 'next/link';
import { SITUATIONS_CATALOGUE } from '@/lib/data/situations';
import { ArrowRight, Globe, Layers, Users } from 'lucide-react';

export default function SituationsDirectoryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-blue-600">
          Research Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight mt-1">
          Forced Displacement Situations
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl mt-2 leading-relaxed">
          Curated research situations grouping verified population datasets, historical briefs, context timelines, and source crosswalks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SITUATIONS_CATALOGUE.map((sit) => (
          <Link
            key={sit.id}
            href={`/situations/${sit.slug}`}
            className="p-6 bg-white border border-stone-200 rounded-2xl shadow-sm hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-stone-500">
                <span className="text-blue-600 font-semibold">{sit.region}</span>
                <span>{sit.startYear} – {sit.endYear || 'Present'}</span>
              </div>

              <h2 className="text-xl font-bold text-stone-900 group-hover:text-blue-600 transition">
                {sit.title}
              </h2>

              <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                {sit.summary}
              </p>

              <div className="pt-2 flex flex-wrap gap-1.5">
                {sit.populationCategories.map((cat, i) => (
                  <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>Open Research Dossier</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
