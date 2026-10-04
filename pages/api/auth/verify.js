import { prisma } from '../../../lib/db';
import { createSessionToken, setSessionCookie } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { email, code } = req.body || {};
  if (!email || !code) {
    return res.status(400).json({ error: 'Email e codice sono obbligatori' });
  }

  const emailNorm = String(email).trim().toLowerCase();

  try {
    const user = await prisma.user.findUnique({ where: { email: emailNorm } });
    if (!user) {
      return res.status(404).json({ error: 'Nessun account trovato con questa email' });
    }
    if (user.verified) {
      return res.status(400).json({ error: 'Questo account \u00e8 gi\u00e0 verificato, effettua il login' });
    }
    if (!user.verificationCode || user.verificationCode !== String(code).trim()) {
      return res.status(400).json({ error: 'Codice non valido' });
    }
    if (!user.verificationExpiry || new Date() > user.verificationExpiry) {
      return res.status(400).json({ error: 'Codice scaduto, richiedine uno nuovo registrandoti di nuovo' });
    }

    await prisma.user.update({
      where: { email: emailNorm },
      data: { verified: true, verificationCode: null, verificationExpiry: null },
    });

    const token = createSessionToken(user.id);
    setSessionCookie(res, token);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Errore del server durante la verifica' });
  }
};
