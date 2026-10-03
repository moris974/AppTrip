import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { useRequireAuth } from '../../lib/useRequireAuth';
import { useToast } from '../../components/Toast';

export default function InformazioniUtili() {
  const { user, loading } = useRequireAuth();
  const toast = useToast();

  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [newTitolo, setNewTitolo] = useState('');

  async function loadItems() {
    setLoadingList(true);
    const res = await fetch('/api/info-utili');
    if (res.ok) {
      const data = await res.json();
      setItems(data.informazioniUtili || []);
    }
    setLoadingList(false);
  }

  useEffect(() => {
    if (!loading) loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newTitolo.trim()) return;
    const res = await fetch('/api/info-utili', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titolo: newTitolo.trim().toUpperCase() }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast(data.error || 'Struttura non trovata: compila prima i Dati struttura');
      return;
    }
    setNewTitolo('');
    toast('Informazione aggiunta e salvata');
    loadItems();
  }

  async function handleDelete(id) {
    const res = await fetch('/api/info-utili/' + id, { method: 'DELETE' });
    if (res.ok) {
      toast('Informazione eliminata');
      loadItems();
    }
  }

  if (loading) return null;

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <div className="topbar">
          <h1 className="page-title">Informazioni utili</h1>
          <div className="user-chip">👤 {user?.email}</div>
        </div>

        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <input className="field-input" style={{ maxWidth: 280 }} placeholder="Titolo (es. AUTOSTRADA)" value={newTitolo} onChange={(e) => setNewTitolo(e.target.value)} />
          <button className="btn-add" type="submit" style={{ marginTop: 0 }}>+ Aggiungi</button>
        </form>

        {loadingList ? (
          <p>Caricamento...</p>
        ) : items.length === 0 ? (
          <p style={{ color: '#999', fontSize: 13 }}>Nessuna informazione ancora inserita.</p>
        ) : (
          <table className="simple">
            <thead><tr><th>Titolo</th><th></th></tr></thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>{i.titolo}</td>
                  <td><button className="del-btn" onClick={() => handleDelete(i.id)}>🗑 Elimina</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
