import React from 'react';
import { FlowClient } from './FlowClient';

// Pre-render static params so flow pages are 100% SSG on Vercel
export function generateStaticParams() {
  return [
    { slug: 'sri-lankan-refugees' }
  ];
}

export default function FlowVisualizationPage({ params }: { params: { slug: string } }) {
  return <FlowClient slug={params.slug} />;
}
