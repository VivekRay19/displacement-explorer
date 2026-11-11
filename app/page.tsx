'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';
import { InteractiveGlobe } from '@/components/globe/InteractiveGlobe';
import { parseAndExecuteSearch, SearchMatchResult } from '@/lib/search/parser';

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchMatchResult[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2025);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      const hits = parseAndExecuteSearch(val);
      setResults(hits);
      setIsDropdownOpen(true);
    } else {
      setResults([]);
      setIsDropdownOpen(false);
    }
  };

  const handleSuggestedClick = (text: string) => {
    setQuery(text);
    const hits = parseAndExecuteSearch(text);
    setResults(hits);
    setIsDropdownOpen(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0b0f19] text-slate-100 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background glow styling */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-950/20 blur-[130px] rounded-full pointer-events-none" />

      {/* Main Hero Container */}
      <div className="max-w-4xl mx-auto px-4 pt-12 sm:pt-16 text-center z-10 w-full">
        {/* Main Heading (Master Prompt Section 11.1) */}
        <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-white mb-6 font-sans">
          What are you researching?
        </h1>

        {/* Big Central Ask Bar (Sketch 1 & 2) */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-2xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition">
            <Search className="w-5 h-5 absolute left-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={handleSearchChange}
              placeholder="Search a country, a group, or ask a question"
              className="w-full pl-12 pr-4 py-4 text-base sm:text-lg bg-transparent text-white placeholder-slate-400 rounded-2xl focus:outline-none"
            />
          </div>

          {/* Quick Autocomplete & Answer Card (Sketch 2) */}
          {isDropdownOpen && results.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 text-left divide-y divide-slate-800">
              {results.map((r, i) => (
                <div
                  key={i}
                  onClick={() => router.push(r.link)}
                  className="p-4 hover:bg-slate-800/80 cursor-pointer transition flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300">
                        {r.type.replace('_', ' ')}
                      </span>
                      {r.sourceNote && (
                        <span className="text-[11px] text-slate-400">
                          Source: {r.sourceNote}
                        </span>
                      )}
                    </div>
                    <div className="text-base font-medium text-white mt-1">
                      {r.title}
                    </div>
                    {r.subtitle && (
                      <div className="text-xs text-slate-400 mt-0.5">
                        {r.subtitle}
                      </div>
                    )}
                  </div>

                  {r.quickValue && (
                    <div className="text-right">
                      <div className="text-2xl font-mono font-bold text-white">
                        {r.quickValue}
                      </div>
                      <span className="text-xs text-blue-400 flex items-center gap-1 justify-end mt-1">
                        Open situation <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Curated "Try" Suggestions (Section 11.2 & Sketch 1) */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 mb-8">
          <span>Try:</span>
          <button
            onClick={() => handleSuggestedClick('Sri Lankan refugees in India')}
            className="px-3 py-1 rounded-full bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-slate-200 transition"
          >
            Sri Lankans in India
          </button>
          <button
            onClick={() => handleSuggestedClick('Rohingya in Bangladesh')}
            className="px-3 py-1 rounded-full bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-slate-200 transition"
          >
            Rohingya in Bangladesh
          </button>
          <button
            onClick={() => handleSuggestedClick('Sudan conflict displacement')}
            className="px-3 py-1 rounded-full bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-slate-200 transition"
          >
            Sudan war, 2023
          </button>
        </div>
      </div>

      {/* Central Quiet Interactive Globe */}
      <div className="w-full flex-1 flex items-center justify-center relative">
        <InteractiveGlobe selectedYear={selectedYear} />
      </div>

      {/* Bottom Bar: Tour & Year Selector (Master Prompt Section 11.4 & Sketch 1) */}
      <div className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 z-10 gap-3">
        <Link
          href="/learn/how-to-read"
          className="hover:text-blue-400 transition flex items-center gap-1 underline decoration-dotted"
        >
          New here? Take the 2-minute tour &rarr;
        </Link>

        {/* Reporting Period Indicator / Slider */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-4 py-1.5 rounded-lg font-mono">
          <span>Reporting Year:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="bg-slate-800 text-white rounded px-2 py-0.5 focus:outline-none border border-slate-700"
          >
            <option value={2025}>2025 (Latest Verified)</option>
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
            <option value={2020}>2020</option>
            <option value={2016}>2016 (Source Comparison Year)</option>
            <option value={2010}>2010</option>
            <option value={2000}>2000</option>
            <option value={1990}>1990 (Historical Peak)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
