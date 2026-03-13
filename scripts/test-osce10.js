const API_BASE = 'https://eap.oece.gob.pe/perfilprov-bus/1.0';

async function test() {
  // Para rubros grandes, combinar con departamento
  const deptos = ['AMAZONAS', 'ANCASH', 'APURIMAC', 'AREQUIPA', 'AYACUCHO', 'CAJAMARCA', 'CALLAO', 'CUSCO', 'HUANCAVELICA', 'HUANUCO', 'ICA', 'JUNIN', 'LA LIBERTAD', 'LAMBAYEQUE', 'LIMA', 'LORETO', 'MADRE DE DIOS', 'MOQUEGUA', 'PASCO', 'PIURA', 'PUNO', 'SAN MARTIN', 'TACNA', 'TUMBES', 'UCAYALI'];
  
  console.log('--- CONSTRUCCION por departamento ---');
  let grandTotal = 0;
  for (const d of deptos) {
    const term = `CONSTRUCCION ${d}`;
    const res = await fetch(`${API_BASE}/tarjetas?searchText=${encodeURIComponent(term)}&pageSize=1&pageNumber=1&export=1&langTag=es`);
    const data = await res.json();
    const total = data.searchInfo?.hitsAll || 0;
    const exportable = Math.min(total, 10000);
    grandTotal += exportable;
    if (total > 10000) console.log(`"${term}": ${total} *** EXCEDE`);
  }
  console.log(`Total exportable CONSTRUCCION: ${grandTotal}`);
  
  // El verdadero approach: buscar solo por RUC numérico con 11 dígitos
  // Probar si puedo buscar "2010" y obtener solo los que tienen ese RUC
  console.log('\n--- Cuántos proveedores TOTALES hay en OSCE? ---');
  // Buscar con un wildcard o término universal
  const universals = ['PERU', 'SOCIEDAD', 'EMPRESA', 'CONTRATISTAS', 'GRUPO'];
  for (const u of universals) {
    const res = await fetch(`${API_BASE}/tarjetas?searchText=${encodeURIComponent(u)}&pageSize=1&pageNumber=1&export=1&langTag=es`);
    const data = await res.json();
    console.log(`"${u}": hitsAll=${data.searchInfo?.hitsAll}, hitsTotal=${data.searchInfo?.hitsTotal}`);
  }
}

test().catch(console.error);
