const API_BASE = 'https://eap.oece.gob.pe/perfilprov-bus/1.0';

async function test() {
  // Intentar búsqueda con 2 letras + tipo
  const combos = ['AA S.A.C', 'AB S.A.C', 'AC S.A.C', 'ZZ S.A.C'];
  
  for (const term of combos) {
    const res = await fetch(`${API_BASE}/tarjetas?searchText=${encodeURIComponent(term)}&pageSize=1&pageNumber=1&export=1&langTag=es`);
    const data = await res.json();
    const total = data.searchInfo?.hitsAll || 0;
    console.log(`"${term}": ${total}`);
  }
  
  // Alternativa: probar con filtros de la URL original
  console.log('\n--- Probar filtros ---');
  // Verificar si la API acepta filtros adicionales
  const filters = [
    'tarjetas?searchText=S.A.C&pageSize=1&pageNumber=1&export=1&langTag=es&tipoPersoneria=2',
    'tarjetas?searchText=S.A.C&pageSize=1&pageNumber=1&export=1&langTag=es&departamento=LIMA',
  ];
  
  for (const f of filters) {
    const res = await fetch(`${API_BASE}/${f}`);
    const data = await res.json();
    const total = data.searchInfo?.hitsAll || 0;
    console.log(`${f.substring(0,80)}: ${total}`);
  }

  // Verificar si hay endpoint de filtros disponible
  console.log('\n--- Revisar filtros.json ---');
  const res = await fetch('https://apps.osce.gob.pe/perfilprov-ui/assets/data/tarjetas/filtros.json');
  const filtros = await res.json();
  console.log(JSON.stringify(filtros).substring(0, 500));
}

test().catch(console.error);
