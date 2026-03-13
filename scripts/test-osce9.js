const API_BASE = 'https://eap.oece.gob.pe/perfilprov-bus/1.0';

async function test() {
  // Probar diferentes departamentos con S.A.C
  const deptos = ['LIMA', 'AREQUIPA', 'CUSCO', 'PIURA', 'JUNIN', 'LAMBAYEQUE', 'LA LIBERTAD', 'TACNA', 'PUNO', 'CAJAMARCA'];
  
  console.log('--- Departamentos + S.A.C ---');
  for (const d of deptos) {
    const term = `${d} S.A.C`;
    const res = await fetch(`${API_BASE}/tarjetas?searchText=${encodeURIComponent(term)}&pageSize=1&pageNumber=1&export=1&langTag=es`);
    const data = await res.json();
    const total = data.searchInfo?.hitsAll || 0;
    const exportable = data.searchInfo?.hitsTotal || 0;
    console.log(`"${term}": ${total} total, ${exportable} exportable ${total > 10000 ? '*** EXCEDE' : ''}`);
  }
  
  // Probar segmentación por actividad/rubro
  console.log('\n--- Rubros comunes ---');
  const rubros = ['CONSTRUCCION', 'CONSULTORIA', 'TRANSPORTE', 'SERVICIOS GENERALES', 'COMERCIALIZADORA', 'INGENIERIA', 'ALIMENTOS', 'TECNOLOGIA', 'MINERIA', 'TEXTIL', 'FARMACEUTICA', 'SEGURIDAD', 'LIMPIEZA', 'AGROINDUSTRIAL'];
  for (const r of rubros) {
    const res = await fetch(`${API_BASE}/tarjetas?searchText=${encodeURIComponent(r)}&pageSize=1&pageNumber=1&export=1&langTag=es`);
    const data = await res.json();
    const total = data.searchInfo?.hitsAll || 0;
    const exportable = data.searchInfo?.hitsTotal || 0;
    console.log(`"${r}": ${total} total, ${exportable} exportable ${total > 10000 ? '*** EXCEDE' : ''}`);
  }
}

test().catch(console.error);
