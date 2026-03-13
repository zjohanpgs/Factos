const API_BASE = 'https://eap.oece.gob.pe/perfilprov-bus/1.0';

async function test() {
  // Ficha de la empresa que SÍ tenía datos (VASAVA)
  const res = await fetch(`${API_BASE}/ficha/20455721611?langTag=es`);
  const data = await res.json();
  
  // Mostrar todas las keys del primer nivel
  console.log('Keys nivel 1:', Object.keys(data));
  
  // Buscar dónde están emails y telefonos
  const json = JSON.stringify(data);
  const emailIdx = json.indexOf('emails');
  const telIdx = json.indexOf('telefonos');
  
  if (emailIdx > -1) {
    console.log('\nEmails context:', json.substring(emailIdx - 20, emailIdx + 80));
  }
  if (telIdx > -1) {
    console.log('\nTelefonos context:', json.substring(telIdx - 20, telIdx + 80));
  }
  
  // Mostrar nombre
  const nameIdx = json.indexOf('nomRzsProv');
  if (nameIdx > -1) {
    console.log('\nNombre context:', json.substring(nameIdx - 5, nameIdx + 80));
  }
}

test().catch(console.error);
