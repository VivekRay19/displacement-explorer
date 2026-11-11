import React from 'react';
import { notFound } from 'next/navigation';
import { dataRepository } from '@/lib/repositories/dataRepository';
import { SituationClient } from '@/components/situation/SituationClient';

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
