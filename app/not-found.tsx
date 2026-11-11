import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto my-24 p-8 bg-white border border-stone-200 rounded-2xl shadow-sm text-center space-y-4">
      <div className="text-4xl font-mono font-bold text-stone-300">404</div>
      <h1 className="text-xl font-bold text-stone-900">Research Topic Not Found</h1>
      <p className="text-xs text-stone-600 leading-relaxed">
        The requested situation, country dossier, or data view is either unavailable in the current release snapshot or still undergoing verification.
      </p>
      <div className="pt-2">
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Return to Research Home
        </Link>
      </div>
    </div>
  );
}
