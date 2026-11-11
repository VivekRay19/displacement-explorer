import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const RAW_DIR = path.join(ROOT_DIR, 'public', 'data', 'raw');
const PROCESSED_DIR = path.join(ROOT_DIR, 'public', 'data', 'processed');

fs.mkdirSync(RAW_DIR, { recursive: true });
fs.mkdirSync(PROCESSED_DIR, { recursive: true });

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 429) {
        console.warn('Rate limited (429), waiting 5 seconds...');
        setTimeout(() => fetchJson(url).then(resolve).catch(reject), 5000);
        return;
      }
      if (res.statusCode >= 400) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error(`Failed to parse JSON from ${url}: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

async function fetchAllPages(baseQueryUrl, maxPages = 5) {
  let allRows = [];
  let page = 1;
  let hasNext = true;

  while (hasNext && page <= maxPages) {
    const url = `${baseQueryUrl}&page=${page}&page_size=100`;
    console.log(`  Fetching page ${page}: ${url}`);
    const res = await fetchJson(url);
    if (res.data && Array.isArray(res.data)) {
      allRows.push(...res.data);
    }
    hasNext = res.pagination?.has_next === true;
    page++;
    await new Promise(r => setTimeout(r, 600)); // Respect API rate guidance
  }
  return allRows;
}

async function run() {
  console.log('--- Step 1: Downloading Metadata & Constraints ---');
  const metadata = await fetchJson('https://api-data.unhcr.org/api/v0/metadata/PopStatsOfficial');
  fs.writeFileSync(path.join(RAW_DIR, 'metadata_PopStatsOfficial.json'), JSON.stringify(metadata, null, 2));

  const constraints = await fetchJson('https://api-data.unhcr.org/api/v0/constraints/PopStatsOfficial');
  fs.writeFileSync(path.join(RAW_DIR, 'constraints_PopStatsOfficial.json'), JSON.stringify(constraints, null, 2));
  console.log('Saved metadata and constraints.');

  console.log('\n--- Step 2: Ingesting Sri Lankan Refugees (LKA -> IND & Global) ---');
  // LKA to IND
  const lkaInd = await fetchAllPages('https://api-data.unhcr.org/api/v0/data/PopStatsOfficial?c[ref_area_adm0]=IND&c[area_ori_adm0]=LKA');
  fs.writeFileSync(path.join(RAW_DIR, 'unhcr_lka_to_ind.json'), JSON.stringify(lkaInd, null, 2));
  console.log(`Retrieved ${lkaInd.length} records for LKA -> IND.`);

  // LKA Origin all hosts
  const lkaGlobal = await fetchAllPages('https://api-data.unhcr.org/api/v0/data/PopStatsOfficial?c[area_ori_adm0]=LKA', 6);
  fs.writeFileSync(path.join(RAW_DIR, 'unhcr_lka_global.json'), JSON.stringify(lkaGlobal, null, 2));
  console.log(`Retrieved ${lkaGlobal.length} records for LKA origin globally.`);

  console.log('\n--- Step 3: Ingesting Rohingya Displacement (MMR -> BGD) ---');
  const mmrBgd = await fetchAllPages('https://api-data.unhcr.org/api/v0/data/PopStatsOfficial?c[ref_area_adm0]=BGD&c[area_ori_adm0]=MMR', 4);
  fs.writeFileSync(path.join(RAW_DIR, 'unhcr_mmr_to_bgd.json'), JSON.stringify(mmrBgd, null, 2));
  console.log(`Retrieved ${mmrBgd.length} records for MMR -> BGD.`);

  console.log('\n--- Step 4: Ingesting Sudan Displacement (SDN) ---');
  const sdnRef = await fetchAllPages('https://api-data.unhcr.org/api/v0/data/PopStatsOfficial?c[area_ori_adm0]=SDN', 5);
  fs.writeFileSync(path.join(RAW_DIR, 'unhcr_sdn_origin.json'), JSON.stringify(sdnRef, null, 2));
  console.log(`Retrieved ${sdnRef.length} records for Sudan origin.`);

  console.log('\n--- Step 5: Generating Dataset Manifest ---');
  const manifest = {
    schema_version: '1.0.0',
    generated_at: new Date().toISOString(),
    primary_source: {
      name: 'UNHCR Refugee Data Portal API',
      base_url: 'https://api-data.unhcr.org/api/v0',
      dataset_code: 'PopStatsOfficial',
      licence: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
      attribution: 'UNHCR Refugee Data Finder, official population statistics'
    },
    snapshots: [
      { id: 'lka_ind', description: 'Sri Lankan refugees and displaced in India', record_count: lkaInd.length },
      { id: 'lka_global', description: 'Displaced populations from Sri Lanka globally', record_count: lkaGlobal.length },
      { id: 'mmr_bgd', description: 'Rohingya refugees from Myanmar hosted in Bangladesh', record_count: mmrBgd.length },
      { id: 'sdn_origin', description: 'Displaced populations from Sudan across neighboring states', record_count: sdnRef.length }
    ]
  };
  fs.writeFileSync(path.join(PROCESSED_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('Pipeline finished successfully. Manifest created.');
}

run().catch(err => {
  console.error('Pipeline failed:', err);
  process.exit(1);
});
