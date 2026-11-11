'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useResearch } from '@/lib/storage/context';
import { Search, BookOpen, Bookmark, HelpCircle } from 'lucide-react';
import { parseAndExecuteSearch, SearchMatchResult } from '@/lib/search/parser';

export function Header() {
  const pathname = usePathname();
  const { numberFormat, setNumberFormat, guideMode, setGuideMode, collection } = useResearch();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchMatchResult[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const isHome = pathname === '/';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim()) {
      const hits = parseAndExecuteSearch(val);
      setSearchResults(hits);
      setShowSearchDropdown(true);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  return (
    <header className={`w-full border-b transition-colors z-40 ${
      isHome ? 'bg-[#0f172a] border-slate-800 text-slate-100' : 'bg-[#fcfbf9] border-stone-200 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-baseline gap-2 group">
            <span className="font-semibold text-lg tracking-tight font-sans">Displacement Explorer</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-stone-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">v1</span>
          </Link>

          {/* Global Number Grouping Preference Toggle (Sketches 1-15: 1,00,000 vs 100,000) */}
          <div className="hidden sm:flex items-center rounded-md border border-stone-300 dark:border-slate-700 p-0.5 text-xs font-mono">
            <button
              onClick={() => setNumberFormat('indian')}
              className={`px-2 py-1 rounded transition ${
                numberFormat === 'indian'
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-stone-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="Indian number grouping (Lakhs/Crores, e.g. 1,00,000)"
            >
              1,00,000
            </button>
            <button
              onClick={() => setNumberFormat('international')}
              className={`px-2 py-1 rounded transition ${
                numberFormat === 'international'
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-stone-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="International number grouping (Millions, e.g. 100,000)"
            >
              100,000
            </button>
          </div>
        </div>

        {/* Global Ask Bar in Header (active when not on home or for quick lookups) */}
        {!isHome && (
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3 text-stone-400" />
              <input
                type="text"
                placeholder="Ask: a country, a group or a question..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setShowSearchDropdown(true)}
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Dropdown results */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-lg shadow-xl overflow-hidden z-50 text-slate-800 dark:text-slate-100">
                {searchResults.map((res, i) => (
                  <Link
                    key={i}
                    href={res.link}
                    onClick={() => setShowSearchDropdown(false)}
                    className="block px-4 py-2.5 hover:bg-stone-50 dark:hover:bg-slate-800 border-b border-stone-100 dark:border-slate-800 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-mono tracking-wider text-blue-600 dark:text-blue-400">
                        {res.type.replace('_', ' ')}
                      </span>
                      {res.quickValue && (
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {res.quickValue}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-medium mt-0.5">{res.title}</div>
                    {res.subtitle && <div className="text-xs text-stone-500 dark:text-slate-400">{res.subtitle}</div>}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/learn"
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-slate-800 transition ${
              pathname.startsWith('/learn') ? 'font-semibold text-blue-600 dark:text-blue-400' : ''
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Learn</span>
          </Link>

          {/* Guide Mode Toggle */}
          <button
            onClick={() => setGuideMode(!guideMode)}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border transition ${
              guideMode
                ? 'bg-amber-100 dark:bg-amber-950 border-amber-400 text-amber-900 dark:text-amber-200 font-medium'
                : 'border-stone-300 dark:border-slate-700 text-stone-600 dark:text-slate-400 hover:text-slate-900'
            }`}
            title="Toggle Guide Mode with contextual research notes"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{guideMode ? 'Guide on' : 'Guide off'}</span>
          </button>

          {/* My Collection Drawer / Link */}
          <Link
            href="/collection"
            className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-stone-300 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 transition group"
          >
            <Bookmark className="w-4 h-4 text-stone-500 group-hover:text-blue-600" />
            <span className="hidden sm:inline">My collection</span>
            {collection.length > 0 && (
              <span className="bg-blue-600 text-white text-xs font-mono font-bold px-1.5 py-0.2 rounded-full">
                {collection.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
