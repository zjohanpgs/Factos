const API_BASE = 'https://eap.oece.gob.pe/perfilprov-bus/1.0';

async function test() {
  // Test búsqueda: usar prefijo más específico como "20455" para RUC 20
  console.log('=== Test 1: Búsqueda por prefijo ===');
  const res1 = await fetch(`${API_BASE}/tarjetas?searchText=20455&pageSize=5&pageNumber=1&export=1&langTag=es`);
  const data1 = await res1.json();
  console.log('Total hits:', data1.searchInfo?.hitsAll, '| Exportable:', data1.searchInfo?.hitsTotal);
  
  const provs = data1.tarjetasProvT01 || [];
  for (const p of provs) {
    console.log(`  ${p.numRuc} - ${p.nomRzsProv}`);
  }
  
  // Test ficha individual
  console.log('\n=== Test 2: Ficha individual ===');
  const ruc = provs[0]?.numRuc || '20455721611';
  const res2 = await fetch(`${API_BASE}/ficha/${ruc}?langTag=es`);
  const data2 = await res2.json();
  
  const prov = data2.proveedorT01;
  if (prov) {
    console.log(`Nombre: ${prov.nomRzsProv}`);
    console.log(`RUC: ${prov.numRuc || ruc}`);
    console.log(`Emails: ${JSON.stringify(prov.emails)}`);
    console.log(`Teléfonos: ${JSON.stringify(prov.telefonos)}`);
    console.log(`Habilitado: ${prov.esHabilitado}`);
    console.log(`Tipo personería: ${prov.tipoPersoneria}`);
  }
  
  // Test con empresa sin email
  console.log('\n=== Test 3: Empresa probablemente sin email ===');
  const res3 = await fetch(`${API_BASE}/ficha/20100000001?langTag=es`);
  const data3 = await res3.json();
  console.log('Codigo:', data3.resultadoT01?.codigo);
  console.log('Proveedor:', data3.proveedorT01 ? 'existe' : 'null');
}

test().catch(console.error);
