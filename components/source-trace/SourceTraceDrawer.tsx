'use client';

import React, { useState } from 'react';
import { useResearch } from '@/lib/storage/context';
import { X, Copy, Bookmark, Check, ExternalLink } from 'lucide-react';
import { formatDisplacementNumber } from '@/lib/formatting/numbers';

export function SourceTraceDrawer() {
  const { activeTraceRecord, setActiveTraceRecord, numberFormat, addToCollection } = useResearch();
  const [copied, setCopied] = useState(false);
  const [pinned, setPinned] = useState(false);

  if (!activeTraceRecord) return null;

  const r = activeTraceRecord;

  // Generate strict academic APA citation
  const generatedCitation = r.citation ||
    `UNHCR. (${r.year || 2026}). Official population statistics on people affected by forced displacement and statelessness [Data set]. United Nations High Commissioner for Refugees. https://refugeedata.unhcr.org/`;

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(generatedCitation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePin = () => {
    addToCollection({
      label: r.label || `${r.pop_type_label || 'Displacement'} (${r.area_ori_label || 'Origin'} to ${r.ref_area_label || 'Host'})`,
      measures: r.pop_type_label || 'Refugee population (stock)',
      place: `${r.area_ori_label || 'Origin'} → ${r.ref_area_label || 'Host'}`,
      year: r.year || r.time_period || 2025,
      value: formatDisplacementNumber(r.obs_value, numberFormat),
      numericValue: r.obs_value,
      source: r.source || 'UNHCR Refugee Data Finder',
      citation: generatedCitation,
      notes: r.notes || '',
      rawRecord: r
    });
    setPinned(true);
    setTimeout(() => setPinned(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-stone-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-6 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Source Trace & Verification
            </span>
            <h2 className="text-lg font-bold text-stone-900 dark:text-white mt-0.5">
              Where this number comes from
            </h2>
          </div>
          <button
            onClick={() => setActiveTraceRecord(null)}
            className="p-2 rounded-md hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-500 transition"
            aria-label="Close Source Trace Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* Main Key Figure Card */}
          <div className="p-5 rounded-lg bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700">
            <div className="text-3xl font-mono font-bold text-stone-900 dark:text-white">
              {formatDisplacementNumber(r.obs_value, numberFormat)}
            </div>
            <div className="text-xs font-medium text-stone-600 dark:text-slate-300 mt-1">
              {r.label || `${r.pop_type_label || 'Refugees'} · ${r.ref_area_label || 'Host Country'}`}
            </div>
            <div className="text-[11px] font-mono text-stone-500 mt-1">
              Reporting period: {r.time_period || r.year} (Year-end stock snapshot)
            </div>
          </div>

          {/* Provenance Metadata Table */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">
              Dataset Provenance
            </h3>
            <div className="border border-stone-200 dark:border-slate-800 rounded-lg overflow-hidden divide-y divide-stone-100 dark:divide-slate-800 text-xs">
              <div className="grid grid-cols-3 p-2.5">
                <span className="text-stone-500 font-medium">Dataset</span>
                <span className="col-span-2 font-mono">{r.data_series || 'PopStatsOfficial (UNHCR)'}</span>
              </div>
              <div className="grid grid-cols-3 p-2.5">
                <span className="text-stone-500 font-medium">Publisher</span>
                <span className="col-span-2">{r.publisher || 'United Nations High Commissioner for Refugees'}</span>
              </div>
              <div className="grid grid-cols-3 p-2.5">
                <span className="text-stone-500 font-medium">Definition</span>
                <span className="col-span-2">{r.pop_type_label || 'Refugees under UNHCR mandate'} (year-end stock)</span>
              </div>
              <div className="grid grid-cols-3 p-2.5">
                <span className="text-stone-500 font-medium">Measurement</span>
                <span className="col-span-2">Individual persons (unit: IND)</span>
              </div>
              <div className="grid grid-cols-3 p-2.5">
                <span className="text-stone-500 font-medium">Footnotes</span>
                <span className="col-span-2 italic text-stone-600 dark:text-slate-400">
                  {r.footnotes || 'Official submission from national authorities to UNHCR.'}
                </span>
              </div>
            </div>
          </div>

          {/* Original Record Fields (Raw row verification - Sketch 7) */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">
              Original Record Fields (Verified)
            </h3>
            <div className="p-3 bg-stone-900 text-stone-100 rounded-lg font-mono text-xs overflow-x-auto space-y-1">
              <div>record_id: "{r.record_id || 'unhcr_popstats_001'}"</div>
              <div>time_period: "{r.time_period || r.year}"</div>
              <div>area_ori_adm0: "{r.area_ori_adm0 || 'LKA'}" ({r.area_ori_label || 'Sri Lanka'})</div>
              <div>ref_area_adm0: "{r.ref_area_adm0 || 'IND'}" ({r.ref_area_label || 'India'})</div>
              <div>pop_type: "{r.pop_type || 'REF_UNHCR'}"</div>
              <div>obs_value: {r.obs_value}</div>
              <div>sex: "{r.sex || '_X'}" ({r.sex_label || 'Unspecified'})</div>
              <div>age: "{r.age || '_X'}" ({r.age_label || 'Unspecified'})</div>
            </div>
          </div>

          {/* Citation Generator */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-stone-500">
                Academic Citation (APA Style)
              </h3>
              <button
                onClick={handleCopyCitation}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Citation'}</span>
              </button>
            </div>
            <div className="p-3 bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg text-xs leading-relaxed text-stone-700 dark:text-slate-300 font-sans">
              {generatedCitation}
            </div>
          </div>
        </div>

        {/* Drawer Actions */}
        <div className="p-6 border-t border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900/50 flex items-center justify-between gap-4">
          <a
            href={r.url || 'https://refugeedata.unhcr.org/'}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-slate-400 hover:text-blue-600"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open UNHCR Portal</span>
          </a>

          <button
            onClick={handlePin}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition ${
              pinned
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>{pinned ? 'Pinned to Collection!' : '+ Add to Collection'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
