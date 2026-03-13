const API_BASE = 'https://eap.oece.gob.pe/perfilprov-bus/1.0';

async function test() {
  // Probar búsqueda solo con números de RUC
  const terms = ['20100', '20200', '20300', '20400', '20500', '20600', '20700', '20800', '20900'];
  
  for (const term of terms) {
    const res = await fetch(`${API_BASE}/tarjetas?searchText=${encodeURIComponent(term)}&pageSize=1&pageNumber=1&export=1&langTag=es`);
    const data = await res.json();
    const total = data.searchInfo?.hitsAll || 0;
    const exportable = data.searchInfo?.hitsTotal || 0;
    console.log(`"${term}": ${total} total, ${exportable} exportable`);
  }
  
  // Probar con 6 dígitos
  console.log('\n--- 6 dígitos ---');
  const terms6 = ['201000', '201001', '201002', '201003', '201004', '201005'];
  for (const term of terms6) {
    const res = await fetch(`${API_BASE}/tarjetas?searchText=${encodeURIComponent(term)}&pageSize=1&pageNumber=1&export=1&langTag=es`);
    const data = await res.json();
    const total = data.searchInfo?.hitsAll || 0;
    console.log(`"${term}": ${total}`);
  }
}

test().catch(console.error);
