const API_BASE = 'https://eap.oece.gob.pe/perfilprov-bus/1.0';

async function test() {
  // Probar segmentación: "A S.A.C", "B S.A.C", etc.
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  let grandTotal = 0;
  for (const letter of letters) {
    const term = `${letter} S.A.C`;
    const res = await fetch(`${API_BASE}/tarjetas?searchText=${encodeURIComponent(term)}&pageSize=1&pageNumber=1&export=1&langTag=es`);
    const data = await res.json();
    const total = data.searchInfo?.hitsAll || 0;
    const exportable = data.searchInfo?.hitsTotal || 0;
    grandTotal += exportable;
    if (total > 10000) {
      console.log(`"${term}": ${total} total, ${exportable} exportable  *** EXCEDE 10K`);
    } else {
      console.log(`"${term}": ${total} total, ${exportable} exportable`);
    }
  }
  console.log(`\nTotal exportable por letra + S.A.C: ${grandTotal}`);
}

test().catch(console.error);
