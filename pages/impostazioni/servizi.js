import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { useRequireAuth } from '../../lib/useRequireAuth';
import { useToast } from '../../components/Toast';

export default function Servizi() {
  const { user, loading } = useRequireAuth();
  const toast = useToast();

  const [servizi, setServizi] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [newNome, setNewNome] = useState('');
  const [newPrezzo, setNewPrezzo] = useState('');

  async function loadServizi() {
    setLoadingList(true);
    const res = await fetch('/api/servizi');
    if (res.ok) {
      const data = await res.json();
      setServizi(data.servizi || []);
    }
    setLoadingList(false);
  }

  useEffect(() => {
    if (!loading) loadServizi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newNome.trim()) return;
    const res = await fetch('/api/servizi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: newNome.trim(), prezzo: newPrezzo.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast(data.error || 'Struttura non trovata: compila prima i Dati struttura');
      return;
    }
    setNewNome('');
    setNewPrezzo('');
    toast('Servizio aggiunto e salvato');
    loadServizi();
  }

  async function handleDelete(id) {
    const res = await fetch('/api/servizi/' + id, { method: 'DELETE' });
    if (res.ok) {
      toast('Servizio eliminato');
      loadServizi();
    }
  }

  if (loading) return null;

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <div className="topbar">
          <h1 className="page-title">Servizi</h1>
          <div className="user-chip">👤 {user?.email}</div>
        </div>

        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <input className="field-input" style={{ maxWidth: 240 }} placeholder="Nome servizio" value={newNome} onChange={(e) => setNewNome(e.target.value)} />
          <input className="field-input" style={{ maxWidth: 140 }} placeholder="Prezzo (es. 10,00 €)" value={newPrezzo} onChange={(e) => setNewPrezzo(e.target.value)} />
          <button className="btn-add" type="submit" style={{ marginTop: 0 }}>+ Aggiungi</button>
        </form>

        {loadingList ? (
          <p>Caricamento...</p>
        ) : servizi.length === 0 ? (
          <p style={{ color: '#999', fontSize: 13 }}>Nessun servizio ancora inserito.</p>
        ) : (
          <table className="simple">
            <thead><tr><th>Nome</th><th>Prezzo</th><th></th></tr></thead>
            <tbody>
              {servizi.map((s) => (
                <tr key={s.id}>
                  <td>{s.nome}</td>
                  <td>{s.prezzo}</td>
                  <td><button className="del-btn" onClick={() => handleDelete(s.id)}>🗑 Elimina</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
