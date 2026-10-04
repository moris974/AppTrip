import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM || 'TravelTrip <onboarding@resend.dev>';

async function sendVerificationEmail(toEmail, code) {
  // Se non è configurata una API key (es. in sviluppo locale), stampiamo il codice
  // in console invece di inviare una vera email: comodo per i test, da configurare
  // con una vera RESEND_API_KEY su Vercel per l'invio reale.
  if (!RESEND_API_KEY) {
    console.log(`[DEV] Codice di verifica per ${toEmail}: ${code}`);
    return { simulated: true };
  }

  const resend = new Resend(RESEND_API_KEY);

  return resend.emails.send({
    from: FROM_EMAIL,
    to: toEmail,
    subject: 'Il tuo codice di verifica TravelTrip',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;">
        <h2 style="color:#3E2472;">Benvenuto su TravelTrip</h2>
        <p>Usa il codice qui sotto per confermare il tuo indirizzo email:</p>
        <p style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#E8748A;">${code}</p>
        <p style="color:#777;font-size:13px;">Il codice scade tra 15 minuti. Se non hai richiesto questa registrazione, ignora questa email.</p>
      </div>
    `,
  });
}

export { sendVerificationEmail };
