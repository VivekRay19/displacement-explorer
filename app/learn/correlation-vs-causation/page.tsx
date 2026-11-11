import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function CorrelationVsCausationPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <Link href="/learn" className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Learning Centre
      </Link>

      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-amber-600">Primer 02</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight mt-1">
          Correlation vs. Causation in Displacement Research
        </h1>
        <p className="text-sm text-stone-600 mt-2 leading-relaxed">
          Why temporal alignment of conflicts, climate disasters, and migration numbers does not constitute empirical proof of causation.
        </p>
      </div>

      <div className="p-8 bg-white border border-stone-200 rounded-2xl shadow-sm space-y-6 text-sm text-stone-800 leading-relaxed">
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
          <div>
            <strong>Core Research Directive:</strong> Displacement Explorer plots conflict timelines (UCDP), disaster events (EM-DAT), and policy acts along the same time axis solely to provide historical context. Chronological overlap does not prove causality.
          </div>
        </div>

        <h2 className="text-xl font-bold text-stone-900">The Multi-Causal Nature of Human Movement</h2>
        <p>
          Displacement decisions are rarely driven by a single isolated variable. Even during intense armed conflicts or severe droughts, whether a family decides to flee, remains internally displaced, or crosses an international frontier depends on:
        </p>

        <ul className="list-disc pl-5 space-y-2 text-xs text-stone-700">
          <li><strong>Pre-existing social and family networks:</strong> Having relatives across the border provides critical sheltering infrastructure.</li>
          <li><strong>Financial capital and resources:</strong> Crossing borders frequently requires paying smugglers or transport fees; the most vulnerable may be unable to leave (trapped populations).</li>
          <li><strong>Border regime enforcement:</strong> Militarization or relaxed border policies drastically alter recorded crossing tallies regardless of conflict intensity.</li>
          <li><strong>Bilateral diplomatic arrangements:</strong> State recognition or denial of refugee status dictates whether people register or remain invisible in census records.</li>
        </ul>

        <div className="p-5 bg-stone-50 border border-stone-200 rounded-xl text-xs space-y-2">
          <h3 className="font-bold text-stone-900">Case Study: Sri Lanka (2004 Indian Ocean Tsunami)</h3>
          <p className="text-stone-600">
            The December 2004 tsunami devastated coastal northern and eastern Sri Lanka, coinciding with the civil war ceasefire. While thousands were internally displaced by the waves, refugee arrivals across the Palk Strait to India did not surge proportionally because maritime security and local recovery arrangements absorbed communities locally. Attributing refugee fluctuations solely to the tsunami would represent a severe interpretive fallacy.
          </p>
        </div>
      </div>
    </div>
  );
}
