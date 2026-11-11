import { z } from 'zod';

export const DisplacementRecordSchema = z.object({
  record_id: z.string(),
  situation_id: z.string(),
  data_series: z.string(),
  data_series_label: z.string(),
  time_period: z.string(),
  year: z.number(),
  reporting_type: z.string().optional(),
  reporting_type_label: z.string().optional(),
  pop_type: z.string(),
  pop_type_label: z.string(),
  ref_area_adm0: z.string(),
  ref_area_label: z.string(),
  area_ori_adm0: z.string(),
  area_ori_label: z.string(),
  obs_value: z.number().nullable(),
  unit_measure: z.string().optional(),
  unit_measure_label: z.string().optional(),
  sex: z.string().optional(),
  sex_label: z.string().optional(),
  age: z.string().optional(),
  age_label: z.string().optional(),
  urbanisation_label: z.string().optional(),
  setting_label: z.string().optional(),
  source: z.string(),
  retrieval_date: z.string(),
  publisher: z.string(),
  url: z.string(),
  is_calculated: z.boolean().default(false),
  formula: z.string().optional(),
  footnotes: z.string().optional(),
});

export type DisplacementRecord = z.infer<typeof DisplacementRecordSchema>;

export interface SituationBrief {
  what: string;
  why: string;
  when: string;
  how: string;
  reviewer: string;
  reviewDate: string;
}

export interface ContextEvent {
  event_id: string;
  situation_id: string;
  year: number;
  title: string;
  description: string;
  category: 'conflict' | 'disaster' | 'policy' | 'peace';
  source: string;
  url: string;
}

export interface SourceComparisonItem {
  publisher: string;
  source_name: string;
  value: number;
  formatted_value: string;
  population_type: string;
  who_is_counted: string;
  method: string;
  coverage: string;
  definition: string;
  notes: string;
  url: string;
}

export interface Situation {
  id: string;
  slug: string;
  title: string;
  summary: string;
  region: string;
  startYear: number;
  endYear?: number;
  originCountry: { code: string; name: string };
  hostCountries: { code: string; name: string }[];
  populationCategories: string[];
  sources: string[];
  brief: SituationBrief;
  limitations: {
    title: string;
    description: string;
    severity: 'critical' | 'moderate' | 'informative';
  }[];
  readings: {
    title: string;
    authors: string;
    year: number;
    type: 'book' | 'journal article' | 'book chapter' | 'report';
    publisher: string;
    url: string;
    citationApa: string;
    citationChicago: string;
    citationHarvard: string;
    note: string;
  }[];
}

export interface CollectionItem {
  id: string;
  label: string;
  measures: string;
  place: string;
  year: string | number;
  value: string;
  numericValue?: number;
  source: string;
  citation: string;
  notes: string;
  addedAt: string;
  rawRecord?: Partial<DisplacementRecord>;
}
