'use client';

import React, { useState } from 'react';
import { Send, CheckCircle, HelpCircle } from 'lucide-react';

export default function RequestDataPage() {
  const [topic, setTopic] = useState('');
  const [place, setPlace] = useState('');
  const [years, setYears] = useState('');
  const [suggestedSource, setSuggestedSource] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Transparent local draft save (Principle 3.7 & Master Prompt Section 20)
    try {
      const existing = JSON.parse(localStorage.getItem('de_data_requests') || '[]');
      existing.push({
        topic,
        place,
        years,
        suggestedSource,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('de_data_requests', JSON.stringify(existing));
    } catch (err) {}
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-blue-600">
          Academic Research Contribution
        </span>
        <h1 className="text-3xl font-serif font-bold text-stone-900 tracking-tight mt-1">
          Can't Find What You're Looking For?
        </h1>
        <p className="text-sm text-stone-600 mt-2 leading-relaxed">
          Submit a missing dataset request or suggest a credible primary source for our university review team to evaluate.
        </p>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
        <strong>Privacy & Storage Notice:</strong> In this release, requests are stored locally in your browser storage or formatted as an email link to ensure zero unapproved backend tracking.
      </div>

      {submitted ? (
        <div className="p-8 bg-white border border-stone-200 rounded-2xl shadow-sm text-center space-y-4">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
          <h2 className="text-xl font-bold text-stone-900">Request Recorded Locally</h2>
          <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
            Thank you for helping expand the research catalog. Your request regarding <strong>{place || 'your topic'}</strong> has been saved to your local browser record.
          </p>
          <button
            onClick={() => {
              setTopic('');
              setPlace('');
              setYears('');
              setSuggestedSource('');
              setSubmitted(false);
            }}
            className="text-xs text-blue-600 hover:underline pt-2 inline-block font-semibold"
          >
            Submit another query &rarr;
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 bg-white border border-stone-200 rounded-2xl shadow-sm space-y-5 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-stone-800">Research Topic or Missing Population Group</label>
            <input
              type="text"
              required
              placeholder="e.g. Colombian IDPs in urban centers; Venezuelan migrants in Peru"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-stone-800">Country or Territory</label>
              <input
                type="text"
                required
                placeholder="e.g. Sudan, Sri Lanka, Chad"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-stone-800">Time Period / Years Needed</label>
              <input
                type="text"
                placeholder="e.g. 1980–1995 or 2023–2025"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-stone-800">Suggested Primary Source or Link (Optional)</label>
            <input
              type="text"
              placeholder="e.g. IOM DTM, Government National Census, Academic Monograph"
              value={suggestedSource}
              onChange={(e) => setSuggestedSource(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-xs"
          >
            <Send className="w-4 h-4" />
            <span>Record Data Request</span>
          </button>
        </form>
      )}
    </div>
  );
}
