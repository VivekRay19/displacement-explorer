'use client';

import React, { useState } from 'react';
import { useResearch } from '@/lib/storage/context';
import { formatDisplacementNumber } from '@/lib/formatting/numbers';
import { HelpCircle, Bookmark, Check } from 'lucide-react';

interface KeyNumberCardProps {
  label: string;
  value: number;
  year: number | string;
  populationType: string;
  sourceName: string;
  explainer: {
    whatIsCounted: string;
    typeOfFigure: string;
    notIncluded: string;
    reliability: string;
  };
  rawRecord?: any;
}

export function KeyNumberCard({
  label,
  value,
  year,
  populationType,
  sourceName,
  explainer,
  rawRecord
}: KeyNumberCardProps) {
  const { numberFormat, setActiveTraceRecord, addToCollection } = useResearch();
  const [showExplainer, setShowExplainer] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const formattedValue = formatDisplacementNumber(value, numberFormat);

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCollection({
      label,
      measures: populationType,
      place: 'India',
      year,
      value: formattedValue,
      numericValue: value,
      source: sourceName,
      citation: `UNHCR Refugee Data Finder (${year}). ${label}. https://refugeedata.unhcr.org/`,
      notes: explainer.whatIsCounted,
      rawRecord
    });
    setIsPinned(true);
    setTimeout(() => setIsPinned(false), 2000);
  };

  return (
    <div
      onClick={() => rawRecord && setActiveTraceRecord(rawRecord)}
      className="relative p-5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl shadow-sm hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-medium text-stone-600 dark:text-slate-400">
            {label}
          </span>
          <div className="flex items-center gap-1.5">
            {/* Pop-out info button (Sketch 4 & 5) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowExplainer(!showExplainer);
              }}
              className="text-stone-400 hover:text-blue-600 p-0.5 rounded transition"
              title="What does this number mean?"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            {/* Pin to collection button (Sketch 11) */}
            <button
              onClick={handlePin}
              className={`p-1 rounded transition ${
                isPinned ? 'text-green-600' : 'text-stone-400 hover:text-blue-600'
              }`}
              title="Add to My Collection"
            >
              {isPinned ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="text-2xl sm:text-3xl font-mono font-bold text-stone-900 dark:text-white mt-2">
          {formattedValue}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-stone-500 font-mono">
        <span>{populationType} · {year}</span>
        <span className="text-blue-600 dark:text-blue-400 group-hover:underline">Trace &rarr;</span>
      </div>

      {/* "What does this number mean?" Explainer Popover (Sketch 5) */}
      {showExplainer && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-12 left-0 right-0 z-30 p-4 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-600 rounded-xl shadow-2xl text-xs space-y-2 text-stone-800 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex justify-between items-center border-b border-stone-200 dark:border-slate-700 pb-1.5 font-bold text-stone-900 dark:text-white">
            <span>What this number means</span>
            <button
              onClick={() => setShowExplainer(false)}
              className="text-stone-400 hover:text-stone-600 font-normal"
            >
              ✕
            </button>
          </div>
          <div>
            <strong className="text-blue-600 dark:text-blue-400">What is counted:</strong> {explainer.whatIsCounted}
          </div>
          <div>
            <strong className="text-amber-600 dark:text-amber-400">Type of figure:</strong> {explainer.typeOfFigure}
          </div>
          <div>
            <strong className="text-stone-500">Not included:</strong> {explainer.notIncluded}
          </div>
          <div>
            <strong className="text-stone-500">How reliable:</strong> {explainer.reliability}
          </div>
        </div>
      )}
    </div>
  );
}
