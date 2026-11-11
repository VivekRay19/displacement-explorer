'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { DisplacementRecord } from '@/lib/data/types';
import { useResearch } from '@/lib/storage/context';
import { formatDisplacementNumber } from '@/lib/formatting/numbers';

export function WherePeopleAreChart({ hosts }: { hosts: DisplacementRecord[] }) {
  const { numberFormat, setActiveTraceRecord } = useResearch();

  // Top 6 host countries
  const topHosts = hosts.slice(0, 6);
  const countries = topHosts.map(h => h.ref_area_label || h.ref_area_adm0).reverse();
  const values = topHosts.map(h => h.obs_value || 0).reverse();

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 12 },
      formatter: (params: any) => {
        const item = params[0];
        return `
          <div class="font-sans space-y-1">
            <div class="font-bold text-blue-400">${item.name}</div>
            <div>Refugees hosted: <strong>${formatDisplacementNumber(item.value, numberFormat)}</strong></div>
            <div class="text-[10px] text-slate-400">Reporting year: 2025 (year-end stock)</div>
          </div>
        `;
      }
    },
    grid: {
      left: '3%',
      right: '6%',
      bottom: '5%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#64748b', fontFamily: 'monospace' }
    },
    yAxis: {
      type: 'category',
      data: countries,
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      axisLabel: { color: '#334155', fontWeight: 500 }
    },
    series: [
      {
        name: 'Hosted Refugees',
        type: 'bar',
        data: values,
        itemStyle: {
          color: (param: any) => param.name === 'India' ? '#2563eb' : '#94a3b8',
          borderRadius: [0, 4, 4, 0]
        },
        label: {
          show: true,
          position: 'right',
          fontFamily: 'monospace',
          color: '#475569',
          formatter: (p: any) => formatDisplacementNumber(p.value, numberFormat)
        }
      }
    ]
  };

  const onChartClick = (params: any) => {
    const reversedIndex = topHosts.length - 1 - params.dataIndex;
    const rec = topHosts[reversedIndex];
    if (rec) setActiveTraceRecord(rec);
  };

  return (
    <div className="w-full">
      <ReactECharts
        option={option}
        style={{ height: '320px', width: '100%' }}
        onEvents={{ click: onChartClick }}
      />
    </div>
  );
}
