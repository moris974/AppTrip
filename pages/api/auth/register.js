import { prisma } from '../../../lib/db';
import { hashPassword, generateVerificationCode } from '../../../lib/auth';
import { sendVerificationEmail } from '../../../lib/mailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { email, password, phone, nomeStruttura } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e password sono obbligatorie' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'La password deve avere almeno 6 caratteri' });
  }

  const emailNorm = String(email).trim().toLowerCase();

  try {
    const existing = await prisma.user.findUnique({ where: { email: emailNorm } });
    if (existing && existing.verified) {
      return res.status(409).json({ error: 'Esiste gi\u00e0 un account verificato con questa email' });
    }

    const passwordHash = await hashPassword(password);
    const code = generateVerificationCode();
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    let user;
    if (existing && !existing.verified) {
      // L'utente si era registrato ma non aveva mai confermato: aggiorniamo e rimandiamo il codice
      user = await prisma.user.update({
        where: { email: emailNorm },
        data: {
          passwordHash,
          phone: phone || null,
          verificationCode: code,
          verificationExpiry: expiry,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email: emailNorm,
          phone: phone || null,
          passwordHash,
          verificationCode: code,
          verificationExpiry: expiry,
          structure: {
            create: {
              nome: nomeStruttura || null,
            },
          },
        },
      });
    }

    await sendVerificationEmail(emailNorm, code);

    return res.status(200).json({ ok: true, email: emailNorm });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Errore del server durante la registrazione' });
  }
};
