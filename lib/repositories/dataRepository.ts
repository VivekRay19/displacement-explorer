import { Situation, DisplacementRecord, ContextEvent, SourceComparisonItem } from '../data/types';
import { SITUATIONS_CATALOGUE } from '../data/situations';
import sriLankaTimeSeries from '@/public/data/processed/sri_lanka_time_series.json';
import sriLankaHosts2025 from '@/public/data/processed/sri_lanka_hosts_2025.json';
import sriLankaSourceComparison from '@/public/data/processed/sri_lanka_source_comparison.json';
import sriLankaContextEvents from '@/public/data/processed/sri_lanka_context_events.json';

export interface IDataRepository {
  getSituations(): Promise<Situation[]>;
  getSituationBySlug(slug: string): Promise<Situation | null>;
  getTimeSeries(situationId: string): Promise<DisplacementRecord[]>;
  getHostDistribution(situationId: string, year?: number): Promise<DisplacementRecord[]>;
  getSourceComparison(situationId: string, year?: number): Promise<{ situation_id: string; year: number; sources: SourceComparisonItem[]; discrepancy_explanation: string } | null>;
  getContextEvents(situationId: string): Promise<ContextEvent[]>;
}

export class StaticDataRepository implements IDataRepository {
  async getSituations(): Promise<Situation[]> {
    return SITUATIONS_CATALOGUE;
  }

  async getSituationBySlug(slug: string): Promise<Situation | null> {
    const item = SITUATIONS_CATALOGUE.find(s => s.slug === slug);
    return item || null;
  }

  async getTimeSeries(situationId: string): Promise<DisplacementRecord[]> {
    if (situationId === 'sri-lankan-refugees-in-india') {
      return sriLankaTimeSeries as DisplacementRecord[];
    }
    return [];
  }

  async getHostDistribution(situationId: string, year = 2025): Promise<DisplacementRecord[]> {
    if (situationId === 'sri-lankan-refugees-in-india') {
      return sriLankaHosts2025 as DisplacementRecord[];
    }
    return [];
  }

  async getSourceComparison(situationId: string, year = 2016): Promise<{ situation_id: string; year: number; sources: SourceComparisonItem[]; discrepancy_explanation: string } | null> {
    if (situationId === 'sri-lankan-refugees-in-india') {
      return sriLankaSourceComparison as any;
    }
    return null;
  }

  async getContextEvents(situationId: string): Promise<ContextEvent[]> {
    if (situationId === 'sri-lankan-refugees-in-india') {
      return sriLankaContextEvents as ContextEvent[];
    }
    return [];
  }
}

export const dataRepository = new StaticDataRepository();
