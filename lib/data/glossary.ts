export interface GlossaryTerm {
  term: string;
  slug: string;
  plainDefinition: string;
  officialDefinition: string;
  sourceOrg: string;
  sourceUrl: string;
  category: 'population' | 'statistical' | 'methodological';
  howSourcesDiffer?: string;
  examples?: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Refugee',
    slug: 'refugee',
    plainDefinition: 'A person who has fled their home country because of a well-founded fear of persecution, conflict, violence, or serious human rights violations, and cannot return safely.',
    officialDefinition: 'Owing to well-founded fear of being persecuted for reasons of race, religion, nationality, membership of a particular social group or political opinion, is outside the country of his nationality and is unable or, owing to such fear, is unwilling to avail himself of the protection of that country (Article 1A(2), 1951 Convention).',
    sourceOrg: 'UNHCR / 1951 Convention',
    sourceUrl: 'https://www.unhcr.org/about-unhcr/who-we-are/1951-refugee-convention',
    category: 'population',
    howSourcesDiffer: 'UNHCR counts individuals registered under its mandate or recognized by host governments. Some states (like India or Bangladesh) lack domestic refugee laws, counting individuals under state administrative welfare categories or specific executive orders rather than standard 1951 Convention status.',
    examples: 'Sri Lankan Tamils in Tamil Nadu camps; Syrian refugees in Jordan.'
  },
  {
    term: 'Asylum-seeker',
    slug: 'asylum-seeker',
    plainDefinition: 'Someone whose request for refugee status is being formally evaluated by a government or UNHCR, but whose legal status has not yet been determined.',
    officialDefinition: 'An individual who is seeking international protection and whose claim has not yet been finally decided on by the country in which the claim was lodged.',
    sourceOrg: 'UNHCR',
    sourceUrl: 'https://refugeedata.unhcr.org/',
    category: 'population',
    howSourcesDiffer: 'National asylum procedures vary widely in duration and reporting standards. Pending claims can linger for years across appeal stages.'
  },
  {
    term: 'Internally Displaced Person (IDP)',
    slug: 'idp',
    plainDefinition: 'A person forced to flee their home because of war, violence, or disasters, but who has remained inside their own country without crossing an international border.',
    officialDefinition: 'Persons or groups of persons who have been forced or obliged to flee or to leave their homes or places of habitual residence, in particular as a result of or in order to avoid the effects of armed conflict, situations of generalized violence, violations of human rights or natural or human-made disasters, and who have not crossed an internationally recognized state border (UN Guiding Principles on Internal Displacement, 1998).',
    sourceOrg: 'UN Guiding Principles / IDMC',
    sourceUrl: 'https://www.internal-displacement.org/',
    category: 'population',
    howSourcesDiffer: 'UNHCR only counts IDPs whom it actively protects or assists under specific humanitarian mandates. IDMC (Internal Displacement Monitoring Centre) monitors all internal displacement globally, including both conflict and disaster-induced movements. As a result, IDMC figures are frequently higher than UNHCR IDP statistics.',
    examples: 'Millions displaced inside Sudan across Darfur and Gezira states.'
  },
  {
    term: 'Stateless Person',
    slug: 'stateless-person',
    plainDefinition: 'A person who is not considered as a national by any state under the operation of its laws.',
    officialDefinition: 'A person who is not recognized as a national by any State under the operation of its law (1954 Convention relating to the Status of Stateless Persons).',
    sourceOrg: 'UN / 1954 Convention',
    sourceUrl: 'https://www.unhcr.org/ibelong/statelessness-around-the-world/',
    category: 'population',
    howSourcesDiffer: 'Many displaced groups are simultaneously refugees and stateless (e.g. Rohingya). Datasets that fail to disaggregate both categories risk undercounting the specific legal hurdles of stateless populations.'
  },
  {
    term: 'Stock',
    slug: 'stock',
    plainDefinition: 'A statistical snapshot of the total number of displaced people residing in a given place at a specific moment in time (typically 31 December).',
    officialDefinition: 'The number of persons of concern present at a specific reference date, representing an accumulated balance at that point.',
    sourceOrg: 'UNHCR Statistical Manual / EGRISS',
    sourceUrl: 'https://egriss.org/',
    category: 'statistical',
    howSourcesDiffer: 'Stock is NOT cumulative arrivals. Adding annual stock figures (e.g., 2020 + 2021 + 2022) results in catastrophic double-counting because the same individuals are present across multiple years.',
    examples: '89,507 Sri Lankan refugees recorded in India on 31 Dec 2025.'
  },
  {
    term: 'Flow',
    slug: 'flow',
    plainDefinition: 'The number of movements or events (such as new arrivals, births, departures, returns) occurring over a defined period (such as one year).',
    officialDefinition: 'The count of transitions or movement events occurring into or out of a population over an observation period.',
    sourceOrg: 'EGRISS International Recommendations',
    sourceUrl: 'https://egriss.org/',
    category: 'statistical',
    howSourcesDiffer: 'Flow data measures dynamics (e.g. 700,000 crossed the border in 2017), whereas stock measures the static population at the end of the year.'
  },
  {
    term: 'Series Break',
    slug: 'series-break',
    plainDefinition: 'A change in how data was collected, defined, or counted, making figures before and after that date non-comparable.',
    officialDefinition: 'A discontinuity in a time series caused by a change in methodology, administrative boundary, population coverage, or data source.',
    sourceOrg: 'UN Statistical Division',
    sourceUrl: 'https://unstats.un.org/',
    category: 'methodological',
    howSourcesDiffer: 'A sudden dip or jump in a chart often reflects a registry clean-up or changes in definition rather than sudden mass migration.'
  }
];
