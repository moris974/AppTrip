const { prisma } = require('../../../lib/db');
const { verifyPassword, createSessionToken, setSessionCookie } = require('../../../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e password sono obbligatorie' });
  }

  const emailNorm = String(email).trim().toLowerCase();

  try {
    const user = await prisma.user.findUnique({ where: { email: emailNorm } });
    if (!user) {
      return res.status(401).json({ error: 'Email o password errati' });
    }
    if (!user.verified) {
      return res.status(403).json({ error: 'Account non ancora verificato. Controlla la tua email per il codice.', needsVerification: true });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Email o password errati' });
    }

    const token = createSessionToken(user.id);
    setSessionCookie(res, token);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Errore del server durante il login' });
  }
};
