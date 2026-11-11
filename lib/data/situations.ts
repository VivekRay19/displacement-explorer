import { Situation } from './types';

export const SITUATIONS_CATALOGUE: Situation[] = [
  {
    id: 'sri-lankan-refugees-in-india',
    slug: 'sri-lankan-refugees-in-india',
    title: 'Sri Lankan refugees in India',
    summary: 'Decades of displacement across the Palk Strait stemming from the Sri Lankan civil war, sheltered across Tamil Nadu camp and non-camp settlements.',
    region: 'South Asia',
    startYear: 1983,
    endYear: 2025,
    originCountry: { code: 'LKA', name: 'Sri Lanka' },
    hostCountries: [
      { code: 'IND', name: 'India' },
      { code: 'FRA', name: 'France' },
      { code: 'CAN', name: 'Canada' },
      { code: 'GBR', name: 'United Kingdom' },
      { code: 'DEU', name: 'Germany' }
    ],
    populationCategories: ['Refugees', 'Asylum-seekers'],
    sources: ['UNHCR', 'UCDP', 'Govt. of India (MEA)', 'Readings (6)'],
    brief: {
      what: 'Tamils from northern and eastern Sri Lanka fled across the Palk Strait to southern India, primarily residing in Tamil Nadu, across distinct migration waves starting from 1983 [1].',
      why: 'Protracted armed conflict between the Sri Lankan armed forces and the Liberation Tigers of Tamil Eelam (LTTE) from 1983 to 2009 resulted in widespread violence, civilian displacement, and loss of ancestral land [1].',
      when: 'The largest arrival waves occurred between 1983–1988 (Phase I) and 1990–1994 (Phase II following the Indian Peace Keeping Force withdrawal). Despite the military conclusion of the war in May 2009, return rates have remained low [1].',
      how: 'Predominantly by fiber-glass boats across the 30km Palk Strait into Rameswaram and Mandapam transit camps. Registered on arrival and allocated across approximately 107 state-administered welfare camps, with approximately one-third living in non-camp communities [1].',
      reviewer: 'Prof. Harsh Vasani & Dr. Divya Balan (Oct 2026)',
      reviewDate: '2026-10-15'
    },
    limitations: [
      {
        title: 'India is not a signatory to the 1951 Refugee Convention',
        description: 'India lacks a comprehensive domestic refugee law. Refugees are managed administratively under the Foreigners Act 1946 with ad-hoc executive policies, meaning UNHCR operates with restricted access and relies heavily on state notifications.',
        severity: 'critical'
      },
      {
        title: 'Camp vs. Non-camp Discrepancies',
        description: 'UNHCR published figures historically reflect registered camp populations receiving state doles (~63k–65k in 2016), whereas state government records include non-camp self-supporting refugees (~36k+), creating apparent source discrepancies.',
        severity: 'critical'
      },
      {
        title: 'No demographic breakdowns published',
        description: 'Official data published by UNHCR for this bilateral corridor lacks disaggregation by age or gender. Demographics must not be estimated or inferred.',
        severity: 'moderate'
      },
      {
        title: 'Registry update artifacts (2009–2019)',
        description: 'Very gradual, flat annual changes in the 2010s reflect periodic bureaucratic administrative verification cycles rather than continuous physical counts.',
        severity: 'informative'
      }
    ],
    readings: [
      {
        title: 'Life of Sri Lankan refugee women in the camps of Tamil Nadu',
        authors: 'Balan, D., & Athray, D.',
        year: 2022,
        type: 'book chapter',
        publisher: 'Routledge',
        url: 'https://doi.org/10.4324/9781003246800',
        citationApa: 'Balan, D., & Athray, D. (2022). Life of Sri Lankan refugee women in the camps of Tamil Nadu. In S. I. Rajan (Ed.), The Routledge Handbook of Refugees in India. Routledge.',
        citationChicago: 'Balan, Divya, and D. Athray. 2022. "Life of Sri Lankan refugee women in the camps of Tamil Nadu." In The Routledge Handbook of Refugees in India, edited by S. Irudaya Rajan. London: Routledge.',
        citationHarvard: 'Balan, D. and Athray, D., 2022. Life of Sri Lankan refugee women in the camps of Tamil Nadu. In: S. I. Rajan, ed. The Routledge Handbook of Refugees in India. London: Routledge.',
        note: 'Comprehensive empirical study documenting camp infrastructure, socioeconomic rights, and gendered experiences.'
      },
      {
        title: 'Sri Lankan Tamil refugees in India: Return or stay?',
        authors: 'Valatheeswaran, C., & Rajan, S. I.',
        year: 2011,
        type: 'journal article',
        publisher: 'Economic & Political Weekly',
        url: 'https://www.epw.in/journal/2011/35/special-articles/sri-lankan-tamil-refugees-india.html',
        citationApa: 'Valatheeswaran, C., & Rajan, S. I. (2011). Sri Lankan Tamil refugees in India: Return or stay? Economic & Political Weekly, 46(35), 45-53.',
        citationChicago: 'Valatheeswaran, C., and S. Irudaya Rajan. 2011. "Sri Lankan Tamil refugees in India: Return or stay?" Economic & Political Weekly 46 (35): 45–53.',
        citationHarvard: 'Valatheeswaran, C. and Rajan, S.I., 2011. Sri Lankan Tamil refugees in India: Return or stay? Economic & Political Weekly, 46(35), pp.45–53.',
        note: 'Examines the post-2009 dilemma between voluntary repatriation to northern Sri Lanka and prolonged integration in Tamil Nadu.'
      },
      {
        title: 'Between Fear and Hope: Sri Lankan Refugees in Tamil Nadu',
        authors: 'Suryanarayan, V., & Sudarsen, V.',
        year: 2000,
        type: 'book',
        publisher: 'T.R. Publications',
        url: 'https://catalog.loc.gov/',
        citationApa: 'Suryanarayan, V., & Sudarsen, V. (2000). Between Fear and Hope: Sri Lankan Refugees in Tamil Nadu. T.R. Publications.',
        citationChicago: 'Suryanarayan, V., and V. Sudarsen. 2000. Between Fear and Hope: Sri Lankan Refugees in Tamil Nadu. Chennai: T.R. Publications.',
        citationHarvard: 'Suryanarayan, V. and Sudarsen, V., 2000. Between Fear and Hope: Sri Lankan Refugees in Tamil Nadu. Chennai: T.R. Publications.',
        note: 'Foundational historical and political analysis of the migration waves and Indo-Sri Lanka bilateral diplomacy.'
      }
    ]
  },
  {
    id: 'rohingya-in-bangladesh',
    slug: 'rohingya-in-bangladesh',
    title: 'Rohingya refugees in Bangladesh',
    summary: 'One of the largest protracted stateless refugee crises in the world, concentrated in Cox’s Bazar following mass military operations in Rakhine State in 2017.',
    region: 'South Asia',
    startYear: 2017,
    endYear: 2025,
    originCountry: { code: 'MMR', name: 'Myanmar' },
    hostCountries: [{ code: 'BGD', name: 'Bangladesh' }],
    populationCategories: ['Refugees', 'Stateless people'],
    sources: ['UNHCR', 'IOM', 'RRRC Bangladesh'],
    brief: {
      what: 'Nearly one million Rohingya Muslims reside in congested mega-camps around Kutupalong and Balukhali in Cox’s Bazar, Bangladesh, after escaping brutal ethnic violence in Myanmar’s Rakhine State [1].',
      why: 'Systematic persecution, denial of citizenship under the 1982 Myanmar Citizenship Law, and targeted military clearance operations in August 2017 [1].',
      when: 'While cross-border movements occurred in 1978 and 1991–92, over 740,000 crossed in a few short months starting August 2017 [1].',
      how: 'On foot through dense jungle hills and across the Naf River on wooden fishing vessels into Teknaf and Ukhia sub-districts [1].',
      reviewer: 'Research Team (Oct 2026)',
      reviewDate: '2026-10-10'
    },
    limitations: [
      {
        title: 'Statelessness and Legal Nomenclature',
        description: 'Bangladesh is not a signatory to the 1951 Convention and officially terms Rohingya refugees as "Forcibly Displaced Myanmar Nationals" (FDMNs).',
        severity: 'critical'
      },
      {
        title: 'Secondary Maritime Movements',
        description: 'Desperation leads many to embark on dangerous boat crossings to Malaysia and Indonesia, figures which are difficult to capture in annual terrestrial camp stock counts.',
        severity: 'moderate'
      }
    ],
    readings: []
  },
  {
    id: 'sudan-displacement-2023',
    slug: 'sudan-displacement-2023',
    title: 'Sudan conflict displacement',
    summary: 'The catastrophic humanitarian crisis triggered by fighting between the Sudanese Armed Forces (SAF) and the Rapid Support Forces (RSF) since April 2023.',
    region: 'East & Horn of Africa',
    startYear: 2023,
    endYear: 2025,
    originCountry: { code: 'SDN', name: 'Sudan' },
    hostCountries: [
      { code: 'TCD', name: 'Chad' },
      { code: 'SSD', name: 'South Sudan' },
      { code: 'EGY', name: 'Egypt' }
    ],
    populationCategories: ['Refugees', 'IDPs', 'Returnees'],
    sources: ['UNHCR', 'IOM DTM', 'UCDP'],
    brief: {
      what: 'Massive internal and cross-border displacement across 18 Sudanese states and into neighboring Chad, South Sudan, Egypt, Ethiopia, and Central African Republic [1].',
      why: 'Intense armed conflict between rival military factions (SAF and RSF) that erupted in Khartoum and spread rapidly across Darfur, Kordofan, and Gezira [1].',
      when: 'Commenced on 15 April 2023 and escalating continuously into 2025, creating the world’s largest internal displacement emergency [1].',
      how: 'Multiple overland routes, truck caravans, and walking hundreds of kilometers across desert border checkpoints into Adré (Chad) and Renk (South Sudan) [1].',
      reviewer: 'Research Team (Oct 2026)',
      reviewDate: '2026-10-10'
    },
    limitations: [
      {
        title: 'Severe Insecurity and Verification Gaps',
        description: 'Active hostilities, telecommunication blackouts, and denied humanitarian access in Darfur and Khartoum make comprehensive household census impossible; numbers incorporate periodic rapid tracking estimates.',
        severity: 'critical'
      }
    ],
    readings: []
  }
];
