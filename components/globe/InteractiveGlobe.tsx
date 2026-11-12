'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useResearch } from '@/lib/storage/context';
import { formatDisplacementNumber } from '@/lib/formatting/numbers';
import { Globe as GlobeIcon, AlertTriangle, RefreshCw } from 'lucide-react';

// Dynamically import Globe without SSR and with a sleek fallback loader
const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-[520px] text-slate-400 space-y-3">
      <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
        Initializing 3D Displacement Globe...
      </span>
    </div>
  )
});

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
  const containerRef = useRef<HTMLDivElement>(null);
  const globeEl = useRef<any>(null);

  const [geoData, setGeoData] = useState<any[]>([]);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 800, height: 560 });
  const [isClient, setIsClient] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Check WebGL availability safely
  useEffect(() => {
    setIsClient(true);
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
      }
    } catch (e) {
      setWebGLSupported(false);
    }
  }, []);

  // Responsive dimension tracking with clean ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth } = containerRef.current;
        const width = Math.max(320, clientWidth);
        const height = window.innerWidth < 640 ? 440 : 560;
        setDimensions({ width, height });
      }
    };

    updateDimensions();

    const ro = new ResizeObserver(() => {
      updateDimensions();
    });
    ro.observe(containerRef.current);

    return () => ro.disconnect();
  }, [isClient]);

  // Load geojson data once
  useEffect(() => {
    let isMounted = true;
    fetch('/geo/world-countries.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (isMounted && data && Array.isArray(data.features)) {
          setGeoData(data.features);
        }
      })
      .catch(err => {
        console.warn('Could not load local GeoJSON, globe will run in texture mode:', err);
        if (isMounted) setLoadError(err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Configure camera & auto-rotation once mounted
  useEffect(() => {
    if (globeEl.current) {
      try {
        const controls = globeEl.current.controls();
        if (controls) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.6;
          controls.enableZoom = true;
          controls.minDistance = 150;
          controls.maxDistance = 600;
        }
        // Focus slightly towards South Asia & Middle East
        globeEl.current.pointOfView({ lat: 18, lng: 76, altitude: 2.2 }, 1000);
      } catch (err) {
        console.warn('Controls init error:', err);
      }
    }
  }, [isClient, geoData.length]);

  const getPolygonColor = useMemo(() => {
    return (d: any) => {
      const iso = d.id || d.properties?.['ISO_A3'] || d.properties?.['iso_a3'] || d.properties?.['ADM0_A3'];
      const data = GLOBAL_VERIFIED_DATA[iso];
      if (!data) return 'rgba(30, 41, 59, 0.45)';
      if (data.situationSlug) return 'rgba(37, 99, 235, 0.85)'; // Highlighted blue for supported research situations
      return 'rgba(56, 189, 248, 0.55)'; // Light blue for registered global countries
    };
  }, []);

  const handlePolygonClick = (d: any) => {
    const iso = d.id || d.properties?.['ISO_A3'] || d.properties?.['iso_a3'] || d.properties?.['ADM0_A3'];
    const data = GLOBAL_VERIFIED_DATA[iso];
    if (data?.situationSlug) {
      router.push(`/situations/${data.situationSlug}`);
    }
  };

  // Graceful fallback for non-WebGL / unsupported devices
  if (!webGLSupported) {
    return (
      <div className="w-full max-w-2xl mx-auto my-12 p-8 bg-slate-900/90 border border-slate-800 rounded-2xl text-center space-y-4">
        <GlobeIcon className="w-12 h-12 text-blue-500 mx-auto" />
        <h3 className="text-lg font-bold text-white">3D Earth Visualization (Standard Map Mode)</h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
          WebGL acceleration is disabled or unavailable in this browser environment. You can explore research situations directly below.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3 text-xs">
          <button
            onClick={() => router.push('/situations/sri-lankan-refugees-in-india')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            Explore Sri Lanka &rarr; India Dossier
          </button>
          <button
            onClick={() => router.push('/situations')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            Browse All Situations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[480px] sm:h-[580px] flex items-center justify-center overflow-hidden pointer-events-auto"
      style={{ touchAction: 'none' }}
    >
      {isClient && (
        <Globe
          ref={globeEl}
          globeImageUrl="/textures/earth-night.jpg"
          backgroundImageUrl="/textures/night-sky.png"
          polygonsData={geoData}
          polygonAltitude={0.012}
          polygonCapColor={getPolygonColor}
          polygonSideColor={() => 'rgba(15, 23, 42, 0.6)'}
          polygonStrokeColor={() => 'rgba(255, 255, 255, 0.18)'}
          polygonLabel={({ properties: d }: any) => {
            const iso = d?.['ISO_A3'] || d?.['iso_a3'] || d?.['ADM0_A3'];
            const data = GLOBAL_VERIFIED_DATA[iso];
            if (!data) return `<div class="p-2 bg-slate-950/90 border border-slate-800 text-white rounded text-xs">${d?.name || 'Country'}</div>`;
            return `
              <div class="p-3 bg-slate-950/95 border border-slate-700 text-white rounded-xl shadow-2xl text-xs space-y-1 backdrop-blur-md">
                <div class="font-bold text-sm text-blue-400 font-sans">${data.name}</div>
                <div>People hosted: <strong>${formatDisplacementNumber(data.displacedHosted, numberFormat)}</strong></div>
                <div>People from here: <strong>${formatDisplacementNumber(data.displacedOrigin, numberFormat)}</strong></div>
                ${data.situationSlug ? '<div class="text-[11px] text-amber-300 font-mono mt-1 pt-1 border-t border-slate-800">Click country to open situation dossier →</div>' : ''}
              </div>
            `;
          }}
          onPolygonClick={handlePolygonClick}
          width={dimensions.width}
          height={dimensions.height}
          animateIn={true}
        />
      )}

      {/* Floating Status Pill (Sketch 1) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-4 py-1.5 rounded-full text-[11px] sm:text-xs text-slate-300 pointer-events-none flex items-center gap-2.5 z-10 shadow-lg">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        <span>Drag to rotate · Scroll to zoom · Click highlighted countries</span>
      </div>
    </div>
  );
}
