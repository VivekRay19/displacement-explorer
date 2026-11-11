import React from 'react';
import { GLOSSARY_TERMS } from '@/lib/data/glossary';
import Link from 'next/link';
import { BookOpen, HelpCircle, Layers, ArrowRight } from 'lucide-react';

export default function LearnPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
      {/* Header */}
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-blue-600">
          Academic Research Companion
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight mt-1">
          Learning Centre: How to Read Displacement Data
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl mt-2 leading-relaxed">
          Ground yourself in core statistical principles, official definitions, and source discrepancies before conducting research.
        </p>
      </div>

      {/* 3 Core Interactive Guides (Sketch 15) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/learn/how-to-read"
          className="p-6 bg-white border border-stone-200 rounded-2xl shadow-sm hover:border-blue-500 transition group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            01
          </div>
          <h2 className="text-lg font-bold text-stone-900 group-hover:text-blue-600">
            Stocks vs. Flows
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Understand why year-end stocks must never be summed across multiple years, and how stocks differ fundamentally from movement flows.
          </p>
          <div className="text-xs font-semibold text-blue-600 flex items-center gap-1 pt-2">
            Read guide <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/learn/correlation-vs-causation"
          className="p-6 bg-white border border-stone-200 rounded-2xl shadow-sm hover:border-blue-500 transition group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            02
          </div>
          <h2 className="text-lg font-bold text-stone-900 group-hover:text-blue-600">
            Correlation vs. Causation
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Why simultaneous conflict or climate events plotted against displacement curves demonstrate temporal correlation, not proven causation.
          </p>
          <div className="text-xs font-semibold text-blue-600 flex items-center gap-1 pt-2">
            Read guide <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/source-comparison"
          className="p-6 bg-white border border-stone-200 rounded-2xl shadow-sm hover:border-blue-500 transition group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            03
          </div>
          <h2 className="text-lg font-bold text-stone-900 group-hover:text-blue-600">
            Definition Crosswalk
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Examine how UNHCR, IDMC, and national governments define key terms, and why figures for the same group diverge across agencies.
          </p>
          <div className="text-xs font-semibold text-blue-600 flex items-center gap-1 pt-2">
            View crosswalk <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* Full Academic Glossary (Sketch 15) */}
      <section className="space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Official Glossary & Terminology
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Grounded in UNHCR, 1951 Convention, EGRISS, and UN Guiding Principles frameworks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GLOSSARY_TERMS.map((term) => (
            <div
              key={term.slug}
              id={`glossary-${term.slug}`}
              className="p-6 bg-white border border-stone-200 rounded-2xl shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-stone-900">{term.term}</h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                  {term.category}
                </span>
              </div>

              <div className="text-xs leading-relaxed text-stone-800">
                <strong className="text-stone-900">Plain definition:</strong> {term.plainDefinition}
              </div>

              <div className="text-xs leading-relaxed text-stone-600 p-3 bg-stone-50 rounded-lg border border-stone-100">
                <strong className="text-stone-800">Official legal text:</strong> "{term.officialDefinition}"
                <div className="text-[10px] text-stone-400 mt-1 font-mono">
                  Source: {term.sourceOrg}
                </div>
              </div>

              {term.howSourcesDiffer && (
                <div className="text-xs text-amber-900 bg-amber-50/70 p-3 rounded-lg border border-amber-200 leading-relaxed">
                  <strong>How sources differ:</strong> {term.howSourcesDiffer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
