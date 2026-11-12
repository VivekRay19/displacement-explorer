'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Download,
  Info,
  ExternalLink,
  Search,
  Database,
  Calendar,
  Layers,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { UNHCRQueryResponse } from '@/lib/search/unhcrClient';
import { useResearch } from '@/lib/storage/context';

interface SearchResultsViewProps {
  initialData: UNHCRQueryResponse;
  initialQuery: string;
}

export function SearchResultsView({ initialData, initialQuery }: SearchResultsViewProps) {
  const router = useRouter();
  const { numberFormat } = useResearch();
  const [data, setData] = useState<UNHCRQueryResponse>(initialData);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);

  const formatNumber = (num?: number | string) => {
    if (num === undefined || num === null) return '—';
    const n = typeof num === 'string' ? parseInt(num.replace(/,/g, ''), 10) : num;
    if (isNaN(n)) return '—';

    if (numberFormat === 'indian') {
      return n.toLocaleString('en-IN');
    }
    return n.toLocaleString('en-US');
  };

  const executeNewSearch = async (q: string) => {
    if (!q.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        window.history.pushState(null, '', `/search?q=${encodeURIComponent(q)}`);
      }
    } catch (err) {
      console.error('Search fetch failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReverseCorridor = () => {
    const parsed = data.parsedQuery;
    if (parsed.originCountry && parsed.asylumCountry) {
      const reversedQuery = `${parsed.asylumCountry.name} to ${parsed.originCountry.name}`;
      setSearchQuery(reversedQuery);
      executeNewSearch(reversedQuery);
    }
  };

  // CSV Export handler
  const handleExportCSV = () => {
    if (!data.records || data.records.length === 0) return;

    const headers = [
      'Year',
      'Country of Origin',
      'Origin ISO3',
      'Country of Asylum',
      'Asylum ISO3',
      'Refugees',
      'Asylum Seekers',
      'Returned Refugees',
      'IDPs',
      'Stateless Persons'
    ];

    const rows = data.records.map(r => [
      r.year,
      `"${r.coo_name || ''}"`,
      r.coo_iso || '',
      `"${r.coa_name || ''}"`,
      r.coa_iso || '',
      r.refugees || 0,
      r.asylum_seekers || 0,
      r.returned_refugees || 0,
      r.idps || 0,
      r.stateless || 0
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `displacement_data_${data.parsedQuery.originCountry?.iso || 'all'}_${data.parsedQuery.asylumCountry?.iso || 'all'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Prepare chart options
  const chartOption = useMemo(() => {
    if (!data.records || data.records.length === 0) return null;

    // Group by year and aggregate primary metric
    const yearsMap = new Map<number, number>();
    const isAsylumApp = data.parsedQuery.targetDataset === 'AsylumApplications';
    const isAsylumDec = data.parsedQuery.targetDataset === 'AsylumDecisions';
    const cat = data.parsedQuery.populationCategory === 'all' ? 'refugees' : data.parsedQuery.populationCategory;

    data.records.forEach(r => {
      let val = 0;
      if (isAsylumApp) {
        val = typeof r.applied === 'number' ? r.applied : parseInt(String(r.applied || 0), 10);
      } else if (isAsylumDec) {
        val = typeof r.dec_recognized === 'number' ? r.dec_recognized : parseInt(String(r.dec_recognized || 0), 10);
      } else {
        const rawVal = r[cat];
        val = typeof rawVal === 'number' ? rawVal : parseInt(String(rawVal || 0), 10);
      }
      if (isNaN(val)) val = 0;
      yearsMap.set(r.year, (yearsMap.get(r.year) || 0) + val);
    });

    const sortedYears = Array.from(yearsMap.keys()).sort((a, b) => a - b);
    const seriesData = sortedYears.map(yr => yearsMap.get(yr) || 0);

    return {
      tooltip: {
        trigger: 'axis',
        formatter: (params: Array<{ name: string; value: number }>) => {
          const item = params[0];
          return `<div style="font-family: inherit; font-size: 13px;">
            <strong>${item.name}</strong><br/>
            ${data.metricLabel}: <span style="font-weight: 600; color: #2563eb;">${formatNumber(item.value)}</span>
          </div>`;
        }
      },
      grid: {
        top: 25,
        left: '3%',
        right: '4%',
        bottom: '8%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: sortedYears,
        axisLine: { lineStyle: { color: '#cbd5e1' } },
        axisLabel: { color: '#64748b' }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#f1f5f9' } },
        axisLabel: {
          color: '#64748b',
          formatter: (value: number) => {
            if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
            if (value >= 1000) return (value / 1000).toFixed(0) + 'k';
            return value;
          }
        }
      },
      series: [
        {
          data: seriesData,
          type: 'line',
          smooth: true,
          showSymbol: sortedYears.length < 20,
          symbolSize: 6,
          itemStyle: { color: '#2563eb' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(37, 99, 235, 0.25)' },
                { offset: 1, color: 'rgba(37, 99, 235, 0.01)' }
              ]
            }
          }
        }
      ]
    };
  }, [data, numberFormat]);

  const parsed = data.parsedQuery;

  return (
    <div className="min-h-screen bg-[#fcfbf9] dark:bg-[#070b14] text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home & Globe
          </Link>

          {/* Quick Search Reprompt */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeNewSearch(searchQuery);
            }}
            className="relative flex-1 max-w-lg"
          >
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask a question or corridor (e.g., India to Pakistan)..."
              className="w-full pl-9 pr-20 py-2 text-sm bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition"
            >
              {isLoading ? 'Querying...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Query Understanding / Interpretation Banner */}
        <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-semibold tracking-tight">Query Interpretation</h1>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-400 border border-stone-200 dark:border-slate-700">
                Dataset: {parsed.targetDataset}
              </span>
              <span className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                Category: {data.metricLabel}
              </span>
            </div>
          </div>

          {/* Corridor & Direction Visualizer */}
          <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-2 rounded-lg bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700">
                <div className="text-[10px] uppercase font-mono tracking-wider text-stone-400 dark:text-slate-400">Country of Origin</div>
                <div className="text-base font-semibold text-slate-900 dark:text-white">
                  {parsed.originCountry ? `${parsed.originCountry.name} (${parsed.originCountry.iso})` : 'All Countries'}
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-stone-400 hidden sm:block" />

              <div className="px-3.5 py-2 rounded-lg bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700">
                <div className="text-[10px] uppercase font-mono tracking-wider text-stone-400 dark:text-slate-400">Country of Asylum (Host)</div>
                <div className="text-base font-semibold text-slate-900 dark:text-white">
                  {parsed.asylumCountry ? `${parsed.asylumCountry.name} (${parsed.asylumCountry.iso})` : 'All Host Countries'}
                </div>
              </div>

              {parsed.originCountry && parsed.asylumCountry && (
                <button
                  onClick={handleReverseCorridor}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 transition"
                  title="Reverse Origin and Asylum countries"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
                  <span>Reverse Direction</span>
                </button>
              )}
            </div>

            <div className="text-sm text-stone-600 dark:text-slate-400 max-w-md">
              <div className="italic text-xs text-stone-500 dark:text-slate-400">Interpretation:</div>
              <div>{parsed.explanation}</div>
            </div>
          </div>

          {/* Ambiguity Alert Notice if query direction was inferred from non-directional words */}
          {parsed.isAmbiguousDirection && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Ambiguity note:</strong> Both countries were mentioned without directional prepositions like &quot;to&quot; or &quot;from&quot;.
                Currently querying: <strong>{parsed.originCountry?.name} → {parsed.asylumCountry?.name}</strong>.
                You can use the <strong>Reverse Direction</strong> button above if you intended the opposite corridor.
              </div>
            </div>
          )}
        </div>

        {/* Results Body */}
        {data.records.length > 0 ? (
          <div className="space-y-6">
            
            {/* Headline Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                <div className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-slate-400">
                  Latest Reported Figure ({data.latestYear || 'N/A'})
                </div>
                <div className="text-3xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-2">
                  {formatNumber(data.latestValue)}
                </div>
                <div className="text-xs text-stone-500 dark:text-slate-400 mt-1">
                  {data.metricLabel} recorded at year-end
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                <div className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-slate-400">
                  Available Historical Span
                </div>
                <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white mt-2">
                  {data.records[0].year} – {data.records[data.records.length - 1].year}
                </div>
                <div className="text-xs text-stone-500 dark:text-slate-400 mt-1">
                  {data.records.length} distinct annual record series
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-slate-400">
                    Official Primary Source
                  </div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-2">
                    UNHCR Refugee Data Portal
                  </div>
                  <div className="text-xs text-stone-500 dark:text-slate-400 mt-0.5 font-mono truncate">
                    Population Statistics API v1
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV</span>
                  </button>
                  <a
                    href={data.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>Raw Endpoint</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Historical Trend Chart */}
            {chartOption && (
              <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-base font-semibold">Historical Trend: {data.metricLabel} Over Time</h2>
                  <span className="text-xs font-mono text-stone-400 dark:text-slate-500">Unit: Registered Individuals</span>
                </div>
                <div className="w-full h-72">
                  <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
                </div>
              </div>
            )}

            {/* Detailed Records Data Table */}
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-stone-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-stone-500" />
                  <h2 className="text-sm font-semibold">Annual Statistical Breakdown</h2>
                </div>
                <span className="text-xs text-stone-500 dark:text-slate-400">
                  Showing {data.records.length} records
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-50 dark:bg-slate-800/60 text-xs font-mono text-stone-500 dark:text-slate-400 border-b border-stone-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4 font-medium">Year</th>
                      <th className="py-2.5 px-4 font-medium">Origin</th>
                      <th className="py-2.5 px-4 font-medium">Asylum</th>
                      <th className="py-2.5 px-4 font-medium text-right">Refugees</th>
                      <th className="py-2.5 px-4 font-medium text-right">Asylum Seekers</th>
                      <th className="py-2.5 px-4 font-medium text-right">Returned</th>
                      <th className="py-2.5 px-4 font-medium text-right">Stateless</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-slate-800/80 font-mono text-xs">
                    {data.records.slice(-15).reverse().map((rec, i) => (
                      <tr key={i} className="hover:bg-stone-50 dark:hover:bg-slate-800/50 transition">
                        <td className="py-2.5 px-4 font-bold text-slate-800 dark:text-slate-200">{rec.year}</td>
                        <td className="py-2.5 px-4">{rec.coo_name || rec.coo_iso}</td>
                        <td className="py-2.5 px-4">{rec.coa_name || rec.coa_iso}</td>
                        <td className="py-2.5 px-4 text-right font-semibold text-blue-600 dark:text-blue-400">
                          {formatNumber(rec.refugees)}
                        </td>
                        <td className="py-2.5 px-4 text-right text-stone-600 dark:text-slate-400">
                          {formatNumber(rec.asylum_seekers)}
                        </td>
                        <td className="py-2.5 px-4 text-right text-stone-600 dark:text-slate-400">
                          {formatNumber(rec.returned_refugees)}
                        </td>
                        <td className="py-2.5 px-4 text-right text-stone-600 dark:text-slate-400">
                          {formatNumber(rec.stateless)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : (
          /* Empty State */
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-10 text-center space-y-4">
            <Database className="w-10 h-10 text-stone-400 mx-auto" />
            <h2 className="text-lg font-semibold">No records returned for this corridor in UNHCR database</h2>
            <p className="text-sm text-stone-500 dark:text-slate-400 max-w-lg mx-auto">
              The query was recognized as{' '}
              <strong>
                {parsed.originCountry?.name || 'Any'} → {parsed.asylumCountry?.name || 'Any'}
              </strong>
              , but UNHCR&apos;s statistical repository does not have active recorded data matching this exact criteria.
            </p>
            {parsed.originCountry && parsed.asylumCountry && (
              <button
                onClick={handleReverseCorridor}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition"
              >
                <ArrowUpDown className="w-4 h-4" />
                <span>Try querying opposite direction ({parsed.asylumCountry.name} to {parsed.originCountry.name})</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
