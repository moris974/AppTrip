import { useState } from 'react';
import { prisma } from '../../lib/db';

export async function getServerSideProps({ params }) {
  const structure = await prisma.structure.findUnique({
    where: { id: params.id },
    include: {
      servizi: { orderBy: { ordine: 'asc' } },
      informazioniUtili: { orderBy: { ordine: 'asc' } },
    },
  });

  if (!structure) {
    return { notFound: true };
  }

  return {
    props: {
      structure: JSON.parse(JSON.stringify(structure)),
    },
  };
}

export default function ClientView({ structure }) {
  const [lang, setLang] = useState('it');
  const color = structure.colore || '#E8748A';
  const descrizione = structure.descrizione || {};

  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', background: '#fafafa', minHeight: '100vh' }}>
      <div className="client-hero" style={{ background: color }}>
        <h1 style={{ margin: 0, fontSize: 26 }}>{structure.nome || 'La tua struttura'}</h1>
        {structure.indirizzo && <p style={{ margin: '6px 0 0', opacity: 0.9 }}>{structure.indirizzo}</p>}
      </div>

      <div className="client-section">
        {Object.keys(descrizione).length > 0 && (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              {Object.keys(descrizione).map((code) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  style={{
                    border: '1px solid #E4E1E6', borderRadius: 14, padding: '5px 12px', fontSize: 12,
                    background: lang === code ? color : '#fff', color: lang === code ? '#fff' : '#444', cursor: 'pointer',
                  }}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#333' }}>{descrizione[lang] || descrizione.it}</p>
          </>
        )}

        <div className="client-card">
          <b>Orari</b>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 8, fontSize: 13, color: '#555' }}>
            {structure.checkin && <span>Check-in: <b>{structure.checkin}</b></span>}
            {structure.checkout && <span>Check-out: <b>{structure.checkout}</b></span>}
            {structure.colazione && <span>Colazione: <b>{structure.colazione}</b></span>}
            {structure.pranzo && <span>Pranzo: <b>{structure.pranzo}</b></span>}
            {structure.cena && <span>Cena: <b>{structure.cena}</b></span>}
          </div>
        </div>

        {structure.servizi.length > 0 && (
          <>
            <h3 style={{ color }}>Servizi</h3>
            {structure.servizi.map((s) => (
              <div key={s.id} className="client-card" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{s.nome}</span>
                {s.prezzo && <b style={{ color }}>{s.prezzo}</b>}
              </div>
            ))}
          </>
        )}

        {structure.informazioniUtili.length > 0 && (
          <>
            <h3 style={{ color }}>Informazioni utili</h3>
            {structure.informazioniUtili.map((i) => (
              <div key={i.id} className="client-card">
                <b>{i.titolo}</b>
              </div>
            ))}
          </>
        )}

        <div style={{ textAlign: 'center', padding: '30px 0', fontSize: 11, color: '#999' }}>
          Powered by TravelTrip
        </div>
      </div>
    </div>
  );
}
