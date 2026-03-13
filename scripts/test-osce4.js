const API_BASE = 'https://eap.oece.gob.pe/perfilprov-bus/1.0';

async function test() {
  // Las empresas jurídicas siempre tienen sufijos como SAC, EIRL, SRL, SA, SCRL
  const terms = ['S.A.C', 'E.I.R.L', 'S.R.L', 'S.A.', 'S.C.R.L', 'SAC', 'EIRL', 'SRL'];
  
  for (const term of terms) {
    const res = await fetch(`${API_BASE}/tarjetas?searchText=${encodeURIComponent(term)}&pageSize=1&pageNumber=1&export=1&langTag=es`);
    const data = await res.json();
    const total = data.searchInfo?.hitsAll || 0;
    const exportable = data.searchInfo?.hitsTotal || 0;
    console.log(`"${term}": ${total} total, ${exportable} exportable`);
  }
}

test().catch(console.error);
