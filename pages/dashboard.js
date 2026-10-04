import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';
import { useRequireAuth } from '../lib/useRequireAuth';
import { useToast } from '../components/Toast';

export default function Dashboard() {
  const router = useRouter();
  const { user, structure, loading } = useRequireAuth();
  const toast = useToast();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  if (loading) return null;

  const clientUrl = structure ? `/app/${structure.id}` : null;

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <div className="topbar">
          <h1 className="page-title">Dashboard</h1>
          <button className="user-chip" onClick={handleLogout}>👤 {user?.email} · Esci</button>
        </div>

        <div className="box">
          <div className="box-title">La tua struttura</div>
          <p style={{ fontSize: 14 }}>
            {structure?.nome ? <b>{structure.nome}</b> : <i>Non hai ancora inserito il nome della struttura.</i>}
          </p>
          <p style={{ fontSize: 13, color: '#666' }}>
            Completa i <a href="/impostazioni/dati-struttura" style={{ color: '#3B6FD1' }}>Dati struttura</a>, poi aggiungi{' '}
            <a href="/impostazioni/servizi" style={{ color: '#3B6FD1' }}>Servizi</a> e{' '}
            <a href="/impostazioni/informazioni-utili" style={{ color: '#3B6FD1' }}>Informazioni utili</a>: tutto quello
            che salvi qui comparirà davvero nella pagina che vedono i tuoi ospiti.
          </p>
        </div>

        {clientUrl && (
          <div className="box">
            <div className="box-title">Anteprima lato ospite</div>
            <p style={{ fontSize: 13, color: '#666' }}>
              Questo è il link pubblico che i tuoi ospiti vedranno (puoi generare un QR code da qui per la tua reception):
            </p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <code style={{ background: '#F5F4F7', padding: '8px 12px', borderRadius: 6, fontSize: 12 }}>
                {typeof window !== 'undefined' ? window.location.origin : ''}{clientUrl}
              </code>
              <button
                className="save-btn"
                style={{ marginTop: 0 }}
                onClick={() => window.open(clientUrl, '_blank')}
              >
                👁 Apri vista ospite
              </button>
              <button
                className="save-btn"
                style={{ marginTop: 0, background: '#3DBFC0' }}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + clientUrl);
                  toast('Link copiato!');
                }}
              >
                📋 Copia link
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
