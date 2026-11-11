'use client';

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useResearch } from '@/lib/storage/context';
import { formatDisplacementNumber } from '@/lib/formatting/numbers';

// Dynamically import Globe without SSR
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

interface CountryDisplacementData {
  iso: string;
  name: string;
  displacedHosted: number;
  displacedOrigin: number;
  situationSlug?: string;
}

// Curated verified totals from UNHCR 2025/2026 release for global map
const GLOBAL_VERIFIED_DATA: Record<string, CountryDisplacementData> = {
  IND: { iso: 'IND', name: 'India', displacedHosted: 213000, displacedOrigin: 15000, situationSlug: 'sri-lankan-refugees-in-india' },
  LKA: { iso: 'LKA', name: 'Sri Lanka', displacedHosted: 1100, displacedOrigin: 148369, situationSlug: 'sri-lankan-refugees-in-india' },
  BGD: { iso: 'BGD', name: 'Bangladesh', displacedHosted: 998000, displacedOrigin: 5000, situationSlug: 'rohingya-in-bangladesh' },
  MMR: { iso: 'MMR', name: 'Myanmar', displacedHosted: 0, displacedOrigin: 1350000, situationSlug: 'rohingya-in-bangladesh' },
  SDN: { iso: 'SDN', name: 'Sudan', displacedHosted: 920000, displacedOrigin: 3800000, situationSlug: 'sudan-displacement-2023' },
  TCD: { iso: 'TCD', name: 'Chad', displacedHosted: 1100000, displacedOrigin: 32000, situationSlug: 'sudan-displacement-2023' },
  SSD: { iso: 'SSD', name: 'South Sudan', displacedHosted: 540000, displacedOrigin: 2300000, situationSlug: 'sudan-displacement-2023' },
  EGY: { iso: 'EGY', name: 'Egypt', displacedHosted: 780000, displacedOrigin: 31000 },
  PAK: { iso: 'PAK', name: 'Pakistan', displacedHosted: 1980000, displacedOrigin: 154000 },
  TUR: { iso: 'TUR', name: 'Türkiye', displacedHosted: 3200000, displacedOrigin: 120000 },
  COL: { iso: 'COL', name: 'Colombia', displacedHosted: 2800000, displacedOrigin: 210000 },
  DEU: { iso: 'DEU', name: 'Germany', displacedHosted: 2600000, displacedOrigin: 200 }
};

export function InteractiveGlobe({ selectedYear = 2025 }: { selectedYear: number }) {
  const router = useRouter();
  const { numberFormat } = useResearch();
  const [countries, setCountries] = useState<any>({ features: [] });
  const [hoveredCountry, setHoveredCountry] = useState<CountryDisplacementData | null>(null);
  const globeEl = useRef<any>();

  useEffect(() => {
    fetch('/geo/world-countries.json')
      .then(res => res.json())
      .then(data => {
        setCountries(data);
      })
      .catch(err => console.error('Failed to load GeoJSON:', err));
  }, []);

  const getPolygonColor = (d: any) => {
    const iso = d.id || d.properties?.['ISO_A3'] || d.properties?.['iso_a3'];
    const data = GLOBAL_VERIFIED_DATA[iso];
    if (!data) return 'rgba(30, 41, 59, 0.4)';
    if (data.situationSlug) return 'rgba(37, 99, 235, 0.75)'; // High-visibility blue for supported situation
    return 'rgba(56, 189, 248, 0.45)'; // Secondary blue
  };

  const handlePolygonClick = (d: any) => {
    const iso = d.id || d.properties?.['ISO_A3'] || d.properties?.['iso_a3'];
    const data = GLOBAL_VERIFIED_DATA[iso];
    if (data?.situationSlug) {
      router.push(`/situations/${data.situationSlug}`);
    }
  };

  return (
    <div className="relative w-full h-[550px] sm:h-[620px] flex items-center justify-center overflow-hidden">
      {/* Globe Component */}
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        polygonsData={countries.features}
        polygonAltitude={0.015}
        polygonCapColor={getPolygonColor}
        polygonSideColor={() => 'rgba(15, 23, 42, 0.5)'}
        polygonStrokeColor={() => 'rgba(255, 255, 255, 0.15)'}
        polygonLabel={({ properties: d }: any) => {
          const iso = d?.['ISO_A3'] || d?.['iso_a3'];
          const data = GLOBAL_VERIFIED_DATA[iso];
          if (!data) return `<div class="p-2 bg-slate-900 text-white rounded text-xs">${d?.name || 'Country'} (No active corridor in initial release)</div>`;
          return `
            <div class="p-3 bg-slate-900 border border-slate-700 text-white rounded-lg shadow-xl text-xs space-y-1">
              <div class="font-bold text-sm text-blue-400">${data.name}</div>
              <div>People hosted: <strong>${formatDisplacementNumber(data.displacedHosted, numberFormat)}</strong></div>
              <div>People from here: <strong>${formatDisplacementNumber(data.displacedOrigin, numberFormat)}</strong></div>
              ${data.situationSlug ? '<div class="text-[11px] text-amber-300 font-mono mt-1">Click to open research situation →</div>' : ''}
            </div>
          `;
        }}
        onPolygonClick={handlePolygonClick}
        width={typeof window !== 'undefined' ? Math.min(window.innerWidth - 32, 900) : 800}
        height={580}
      />

      {/* Floating Quiet Status Pill (Sketch 1) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-full text-xs text-slate-300 pointer-events-none flex items-center gap-3">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        <span>People displaced by country, {selectedYear} · Click a highlighted country to explore</span>
      </div>
    </div>
  );
}
