import React from 'react';
import { SITUATIONS_CATALOGUE } from '@/lib/data/situations';
import { BookOpen, ExternalLink, Copy } from 'lucide-react';

export default function WorksCitedPage() {
  const allReadings = SITUATIONS_CATALOGUE.flatMap(s => s.readings);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-blue-600">
          Academic Bibliography
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight mt-1">
          Works Cited & Curated Literature
        </h1>
        <p className="text-sm text-stone-600 mt-2 leading-relaxed">
          Peer-reviewed articles, books, datasets, and government documents integrated across Displacement Explorer with verified citations.
        </p>
      </div>

      {/* Official Datasets Bibliography */}
      <section className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-stone-900 border-b border-stone-200 pb-2">
          Datasets & Primary Statistical Sources
        </h2>
        <div className="space-y-4 text-xs font-mono text-stone-800 leading-relaxed">
          <div className="p-4 bg-white border border-stone-200 rounded-xl">
            UNHCR. (2026). <em>Official population statistics on people affected by forced displacement and statelessness, by population type (PopStatsOfficial)</em> [Data set]. United Nations High Commissioner for Refugees. https://refugeedata.unhcr.org/
          </div>
          <div className="p-4 bg-white border border-stone-200 rounded-xl">
            Gleditsch, N. P., Wallensteen, P., Eriksson, M., Sollenberg, M., & Strand, H. (2002). Armed Conflict 1946–2001: A New Dataset. <em>Journal of Peace Research</em>, 39(5), 615–637. (UCDP/PRIO Armed Conflict Dataset v26.1). https://ucdp.uu.se/
          </div>
          <div className="p-4 bg-white border border-stone-200 rounded-xl">
            Ministry of External Affairs. (2016). <em>Sri Lankan refugees in India</em>. Lok Sabha Unstarred Question No. 3974, answered on 10.08.2016. Government of India. https://mea.gov.in/
          </div>
        </div>
      </section>

      {/* Academic Literature Bibliography */}
      <section className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-stone-900 border-b border-stone-200 pb-2">
          Peer-Reviewed Scholarship & Books
        </h2>
        <div className="space-y-4 text-xs font-mono text-stone-800 leading-relaxed">
          {allReadings.map((reading, i) => (
            <div key={i} className="p-4 bg-white border border-stone-200 rounded-xl space-y-2 font-sans">
              <div className="font-mono text-xs text-stone-900 font-medium">
                {reading.citationApa}
              </div>
              <div className="text-[11px] text-stone-500 font-sans">
                <strong>Annotation:</strong> {reading.note}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
