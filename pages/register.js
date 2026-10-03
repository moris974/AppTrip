import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ nomeStruttura: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Errore durante la registrazione');
        setLoading(false);
        return;
      }
      router.push('/verify?email=' + encodeURIComponent(form.email));
    } catch (err) {
      setError('Errore di connessione, riprova.');
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>Registra la tua struttura</h1>
        <p className="sub">Crea un account per iniziare a usare TravelTrip</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Nome struttura</label>
            <input
              type="text"
              placeholder="Es. Hotel Bellavista"
              value={form.nomeStruttura}
              onChange={(e) => update('nomeStruttura', e.target.value)}
            />
          </div>
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              required
              placeholder="info@tuastruttura.it"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </div>
          <div className="auth-field">
            <label>Numero di telefono (opzionale)</label>
            <input
              type="tel"
              placeholder="+39 ..."
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
            />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Almeno 6 caratteri"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
            />
          </div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Creazione account...' : 'Crea account e invia codice'}
          </button>
        </form>

        <div className="auth-alt">
          Hai gi\u00e0 un account? <Link href="/login">Accedi</Link>
        </div>
      </div>
    </div>
  );
}
