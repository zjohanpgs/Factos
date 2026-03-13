// Test rápido: buscar 1 prefijo y obtener 3 fichas

const API_BASE = 'https://eap.oece.gob.pe/perfilprov-bus/1.0';

async function test() {
  // 1. Buscar tarjetas con prefijo 2045
  console.log('1. Buscando tarjetas con prefijo 2045...');
  const res1 = await fetch(`${API_BASE}/tarjetas?searchText=2045&pageSize=5&pageNumber=1&export=1&langTag=es`);
  const data1 = await res1.json();
  
  console.log('Total hits:', data1.searchInfo?.hitsTotal);
  console.log('Primeros proveedores:');
  
  const rucs = [];
  for (const p of (data1.tarjetasProvT01 || []).slice(0, 3)) {
    console.log(`  - ${p.nomRzsProv} | RUC: ${p.numRuc}`);
    if (p.numRuc?.startsWith('20')) rucs.push(p.numRuc);
  }
  
  // 2. Obtener ficha de cada uno
  console.log('\n2. Obteniendo fichas individuales...');
  for (const ruc of rucs) {
    const res2 = await fetch(`${API_BASE}/ficha/${ruc}?langTag=es`);
    const data2 = await res2.json();
    
    const ficha = data2.fichaProvT01 || data2;
    console.log(`\n  RUC: ${ruc}`);
    console.log(`  Nombre: ${ficha.nomRzsProv || 'N/A'}`);
    console.log(`  Emails: ${JSON.stringify(ficha.emails)}`);
    console.log(`  Teléfonos: ${JSON.stringify(ficha.telefonos)}`);
  }
}

test().catch(console.error);
