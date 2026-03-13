const API_BASE = 'https://eap.oece.gob.pe/perfilprov-bus/1.0';

// Probar fichas directas - ver cuántas existen en un rango
async function test() {
  let found = 0;
  let notFound = 0;
  
  // Probar rango 20100000000 - 20100000100
  console.log('Probando RUCs 20100000000 a 20100000050...');
  for (let i = 20100000000; i <= 20100000050; i++) {
    const ruc = String(i);
    const res = await fetch(`${API_BASE}/ficha/${ruc}?langTag=es`);
    const data = await res.json();
    
    if (data.proveedorT01) {
      found++;
      const p = data.proveedorT01;
      console.log(`  FOUND: ${ruc} - ${p.nomRzsProv} | Email: ${p.emails?.join(',')||'N/A'} | Tel: ${p.telefonos?.join(',')||'N/A'}`);
    } else {
      notFound++;
    }
  }
  
  console.log(`\nResultado: ${found} encontrados, ${notFound} no existen`);
  console.log(`Tasa: ${(found/(found+notFound)*100).toFixed(1)}%`);
}

test().catch(console.error);
