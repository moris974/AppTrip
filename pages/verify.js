import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Verify() {
  const router = useRouter();
  const { email } = router.query;
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Codice non valido');
        setLoading(false);
        return;
      }
      setSuccess('Account verificato! Ti stiamo portando alla dashboard...');
      setTimeout(() => router.push('/dashboard'), 800);
    } catch (err) {
      setError('Errore di connessione, riprova.');
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>Conferma la tua email</h1>
        <p className="sub">
          Abbiamo inviato un codice a 6 cifre a <b>{email}</b>. Inseriscilo qui sotto per attivare l&apos;account.
        </p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Codice di verifica</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ letterSpacing: '6px', fontSize: '20px', textAlign: 'center' }}
            />
          </div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Verifica in corso...' : 'Conferma account'}
          </button>
        </form>
      </div>
    </div>
  );
}
