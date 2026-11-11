'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { DisplacementRecord, ContextEvent } from '@/lib/data/types';
import { useResearch } from '@/lib/storage/context';
import { formatDisplacementNumber, formatAxisNumber } from '@/lib/formatting/numbers';

interface OverTimeChartProps {
  records: DisplacementRecord[];
  events: ContextEvent[];
}

export function OverTimeChart({ records, events }: OverTimeChartProps) {
  const { numberFormat, setActiveTraceRecord } = useResearch();

  const sortedRecords = [...records].sort((a, b) => a.year - b.year);
  const years = sortedRecords.map(r => r.year);
  const values = sortedRecords.map(r => r.obs_value);

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 12 },
      formatter: (params: any) => {
        const item = params[0];
        const rec = sortedRecords[item.dataIndex];
        return `
          <div class="font-sans space-y-1">
            <div class="font-bold text-blue-400 font-mono">${item.name}</div>
            <div>Refugees: <strong>${formatDisplacementNumber(item.value, numberFormat)}</strong></div>
            <div class="text-[10px] text-slate-400">Type: ${rec?.pop_type_label || 'Refugees'} (year-end stock)</div>
            <div class="text-[10px] text-amber-300">Click data point to view Source Trace</div>
          </div>
        `;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: years,
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      axisLabel: { color: '#64748b', fontFamily: 'monospace' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: {
        color: '#64748b',
        fontFamily: 'monospace',
        formatter: (v: number) => formatAxisNumber(v, numberFormat)
      }
    },
    series: [
      {
        name: 'Refugees in India',
        type: 'line',
        data: values,
        smooth: 0.2,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: { color: '#2563eb' },
        lineStyle: { width: 3, color: '#2563eb' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(37, 99, 235, 0.25)' },
              { offset: 1, color: 'rgba(37, 99, 235, 0.02)' }
            ]
          }
        }
      }
    ]
  };

  const onChartClick = (params: any) => {
    if (params.componentType === 'series') {
      const rec = sortedRecords[params.dataIndex];
      if (rec) {
        setActiveTraceRecord(rec);
      }
    }
  };

  return (
    <div className="w-full">
      <ReactECharts
        option={option}
        style={{ height: '380px', width: '100%' }}
        onEvents={{ click: onChartClick }}
      />
    </div>
  );
}
