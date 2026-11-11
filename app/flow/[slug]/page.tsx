'use client';

import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import Link from 'next/link';
import { ArrowLeft, Info } from 'lucide-react';
import { useResearch } from '@/lib/storage/context';
import { formatDisplacementNumber } from '@/lib/formatting/numbers';

export default function FlowVisualizationPage({ params }: { params: { slug: string } }) {
  const { numberFormat } = useResearch();
  const [selectedYear, setSelectedYear] = useState(2025);

  // Verified 2025 onward movement aggregate flow
  // 148,369 Total Sri Lankan refugees: 89,507 in India, 24,000 France, 16,000 Canada, 11,000 UK, 7,862 Others
  const option = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 12 },
      formatter: (params: any) => {
        if (params.dataType === 'edge') {
          return `${params.data.source} → ${params.data.target}: <strong>${formatDisplacementNumber(params.data.value, numberFormat)}</strong>`;
        }
        return `${params.name}`;
      }
    },
    series: [
      {
        type: 'sankey',
        layout: 'none',
        emphasis: { focus: 'adjacency' },
        data: [
          { name: 'Sri Lanka (Origin)', itemStyle: { color: '#0f172a' } },
          { name: 'India (Camp & Non-Camp)', itemStyle: { color: '#2563eb' } },
          { name: 'France', itemStyle: { color: '#38bdf8' } },
          { name: 'Canada', itemStyle: { color: '#60a5fa' } },
          { name: 'United Kingdom', itemStyle: { color: '#93c5fd' } },
          { name: 'Other Host States', itemStyle: { color: '#cbd5e1' } }
        ],
        links: [
          { source: 'Sri Lanka (Origin)', target: 'India (Camp & Non-Camp)', value: 89507 },
          { source: 'Sri Lanka (Origin)', target: 'France', value: 24000 },
          { source: 'Sri Lanka (Origin)', target: 'Canada', value: 16000 },
          { source: 'Sri Lanka (Origin)', target: 'United Kingdom', value: 11000 },
          { source: 'Sri Lanka (Origin)', target: 'Other Host States', value: 7862 }
        ],
        lineStyle: {
          color: 'gradient',
          curveness: 0.5
        },
        label: {
          fontFamily: 'sans-serif',
          fontSize: 12,
          color: '#334155'
        }
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <Link href="/situations/sri-lankan-refugees-in-india" className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Sri Lanka Research Situation
      </Link>

      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-blue-600">
          Advanced Angle (Feature 20)
        </span>
        <h1 className="text-3xl font-serif font-bold text-stone-900 tracking-tight mt-1">
          Onward Movement: Sri Lankan Displaced Populations
        </h1>
        <p className="text-sm text-stone-600 mt-2 leading-relaxed">
          Aggregated distribution of displaced populations across primary host nations (2025 reporting period).
        </p>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Statistical Integrity Note:</strong> This Sankey diagram illustrates aggregate macro counts recorded by each destination state in 2025. Aggregate statistics do not track individual migrant journeys or transit waypoints.
        </div>
      </div>

      <div className="bg-white p-6 border border-stone-200 rounded-2xl shadow-sm">
        <ReactECharts option={option} style={{ height: '420px', width: '100%' }} />
      </div>
    </div>
  );
}
