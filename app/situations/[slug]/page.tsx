import React from 'react';
import { notFound } from 'next/navigation';
import { dataRepository } from '@/lib/repositories/dataRepository';
import { SituationClient } from '@/components/situation/SituationClient';
import { SITUATIONS_CATALOGUE } from '@/lib/data/situations';

// Enable static pre-rendering on Vercel for all supported situations
export function generateStaticParams() {
  return SITUATIONS_CATALOGUE.map((sit) => ({
    slug: sit.slug,
  }));
}

export default async function SituationPage({
  params
}: {
  params: { slug: string };
}) {
  const situation = await dataRepository.getSituationBySlug(params.slug);
  if (!situation) {
    notFound();
  }

  const timeSeries = await dataRepository.getTimeSeries(situation.id);
  const hosts = await dataRepository.getHostDistribution(situation.id, 2025);
  const sourceComparison = await dataRepository.getSourceComparison(situation.id, 2016);
  const events = await dataRepository.getContextEvents(situation.id);

  return (
    <SituationClient
      situation={situation}
      timeSeries={timeSeries}
      hosts={hosts}
      sourceComparison={sourceComparison}
      events={events}
    />
  );
}
