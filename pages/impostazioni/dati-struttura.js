import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../components/Sidebar';
import { useRequireAuth } from '../../lib/useRequireAuth';
import { useToast } from '../../components/Toast';

const LANGS = [
  { code: 'it', flag: '🇮🇹', label: 'Italiano' },
  { code: 'en', flag: '🇬🇧', label: 'Inglese' },
  { code: 'de', flag: '🇩🇪', label: 'Tedesco' },
  { code: 'es', flag: '🇪🇸', label: 'Spagnolo' },
  { code: 'ru', flag: '🇷🇺', label: 'Russo' },
];

export default function DatiStruttura() {
  const router = useRouter();
  const { user, structure, loading } = useRequireAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    nome: '', indirizzo: '', lat: '', lng: '', email: '', telefono: '', whatsapp: '',
    colore: '#E8748A', checkin: '', checkout: '', colazione: '', pranzo: '', cena: '',
  });
  const [descrizione, setDescrizione] = useState({});
  const [lang, setLang] = useState('it');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (structure) {
      setForm({
        nome: structure.nome || '',
        indirizzo: structure.indirizzo || '',
        lat: structure.lat || '',
        lng: structure.lng || '',
        email: structure.email || '',
        telefono: structure.telefono || '',
        whatsapp: structure.whatsapp || '',
        colore: structure.colore || '#E8748A',
        checkin: structure.checkin || '',
        checkout: structure.checkout || '',
        colazione: structure.colazione || '',
        pranzo: structure.pranzo || '',
        cena: structure.cena || '',
      });
      setDescrizione(structure.descrizione || {});
    }
  }, [structure]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/structure', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, descrizione }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || 'Errore nel salvataggio');
      } else {
        toast('✅ Dati struttura salvati correttamente');
      }
    } catch (e) {
      toast('Errore di connessione');
    }
    setSaving(false);
  }

  if (loading) return null;

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <div className="topbar">
          <h1 className="page-title">Dati struttura</h1>
          <div className="user-chip">👤 {user?.email}</div>
        </div>

        <div className="field-label">Nome</div>
        <input className="field-input" value={form.nome} onChange={(e) => update('nome', e.target.value)} placeholder="Es. Hotel Bellavista" />

        <div className="box">
          <div className="box-title">Indirizzo</div>
          <div className="grid-2">
            <div>
              <div className="field-label" style={{ marginTop: 0 }}>Indirizzo</div>
              <input className="field-input" value={form.indirizzo} onChange={(e) => update('indirizzo', e.target.value)} />
            </div>
            <div></div>
            <div>
              <div className="field-label">Latitudine</div>
              <input className="field-input" value={form.lat} onChange={(e) => update('lat', e.target.value)} />
            </div>
            <div>
              <div className="field-label">Longitudine</div>
              <input className="field-input" value={form.lng} onChange={(e) => update('lng', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="box">
          <div className="box-title">Dati descrittivi</div>
          <div className="grid-2">
            <div>
              <div className="field-label" style={{ marginTop: 0 }}>Indirizzo e-mail</div>
              <input className="field-input" value={form.email} onChange={(e) => update('email', e.target.value)} />
            </div>
            <div>
              <div className="field-label" style={{ marginTop: 0 }}>Telefono</div>
              <input className="field-input" value={form.telefono} onChange={(e) => update('telefono', e.target.value)} />
            </div>
            <div>
              <div className="field-label">Whatsapp</div>
              <input className="field-input" value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} />
            </div>
            <div>
              <div className="field-label">Colore app</div>
              <input type="color" value={form.colore} onChange={(e) => update('colore', e.target.value)} style={{ width: 60, height: 36, border: 'none', padding: 0 }} />
            </div>
          </div>

          <div className="field-label">Descrizione</div>
          <div className="lang-tabs">
            {LANGS.map((l) => (
              <div key={l.code} className={'lang-tab' + (lang === l.code ? ' active' : '')} onClick={() => setLang(l.code)}>
                {l.flag} {l.label}
              </div>
            ))}
          </div>
          <textarea
            className="desc-textarea"
            value={descrizione[lang] || ''}
            onChange={(e) => setDescrizione((d) => ({ ...d, [lang]: e.target.value }))}
            placeholder={`Descrizione della struttura in ${LANGS.find((l) => l.code === lang).label}...`}
          />
        </div>

        <div className="box">
          <div className="box-title">Orari</div>
          <div className="grid-5">
            <div><div className="field-label" style={{ marginTop: 0 }}>Check-in</div><input className="field-input" value={form.checkin} onChange={(e) => update('checkin', e.target.value)} /></div>
            <div><div className="field-label" style={{ marginTop: 0 }}>Check-out</div><input className="field-input" value={form.checkout} onChange={(e) => update('checkout', e.target.value)} /></div>
            <div><div className="field-label" style={{ marginTop: 0 }}>Colazione</div><input className="field-input" value={form.colazione} onChange={(e) => update('colazione', e.target.value)} /></div>
            <div><div className="field-label" style={{ marginTop: 0 }}>Pranzo</div><input className="field-input" value={form.pranzo} onChange={(e) => update('pranzo', e.target.value)} /></div>
            <div><div className="field-label" style={{ marginTop: 0 }}>Cena</div><input className="field-input" value={form.cena} onChange={(e) => update('cena', e.target.value)} /></div>
          </div>
        </div>

        <button className="save-btn" onClick={handleSave} disabled={saving}>
          {saving ? 'Salvataggio...' : '💾 Salva'}
        </button>
      </main>
    </div>
  );
}
