import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function HowToReadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <Link href="/learn" className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Learning Centre
      </Link>

      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-blue-600">Primer 01</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight mt-1">
          How to Read Displacement Data: Stocks vs. Flows
        </h1>
        <p className="text-sm text-stone-600 mt-2 leading-relaxed">
          The single most common methodological error in displacement research is treating annual population snapshots as cumulative totals.
        </p>
      </div>

      {/* Visual Analogy Box (Sketch 15) */}
      <div className="p-8 bg-white border border-stone-200 rounded-2xl shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-stone-900">The Bathtub Principle</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-700 leading-relaxed">
          <div className="p-5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
            <h3 className="font-bold text-sm text-blue-900">What is a Stock?</h3>
            <p>
              A <strong>stock</strong> measures the total volume of water in the tub at a single moment in time (e.g. 31 December 2025).
            </p>
            <p>
              In displacement terms, UNHCR reports that India hosted <strong>89,507</strong> Sri Lankan refugees on December 31, 2025. That is the stock.
            </p>
            <div className="p-2 bg-white rounded border border-blue-200 font-mono text-[11px] text-blue-800">
              Rule: Never sum annual stocks. (2023 stock + 2024 stock + 2025 stock ≠ total displaced).
            </div>
          </div>

          <div className="p-5 bg-amber-50/50 border border-amber-200 rounded-xl space-y-3">
            <h3 className="font-bold text-sm text-amber-900">What is a Flow?</h3>
            <p>
              A <strong>flow</strong> measures water entering through the faucet (new arrivals, births) or draining out (returns, resettlement, deaths) over a period of time.
            </p>
            <p>
              For example, 250 refugees voluntarily repatriated to Sri Lanka during 2024. That is a flow.
            </p>
            <div className="p-2 bg-white rounded border border-amber-200 font-mono text-[11px] text-amber-800">
              Rule: Stocks change when inflows exceed outflows.
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 text-xs text-stone-600 leading-relaxed space-y-2">
          <h3 className="font-bold text-stone-800">Why Does This Matter for Policy & Academia?</h3>
          <p>
            If a researcher adds annual stocks over ten years, an unchanged group of 100,000 refugees appears erroneously as 1,000,000 people. Always check the dataset metadata to confirm whether an indicator represents an end-of-year stock balance or a period flow event.
          </p>
        </div>
      </div>
    </div>
  );
}
