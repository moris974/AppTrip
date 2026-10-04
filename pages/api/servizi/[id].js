import { prisma } from '../../../lib/db';
import { getUserIdFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: 'Non autenticato' });

  const { id } = req.query;

  // Verifica che il servizio appartenga davvero alla struttura dell'utente loggato
  const servizio = await prisma.servizio.findUnique({ where: { id }, include: { structure: true } });
  if (!servizio || servizio.structure.userId !== userId) {
    return res.status(404).json({ error: 'Servizio non trovato' });
  }

  if (req.method === 'PUT') {
    const { nome, prezzo, descrizione, immagineUrl, ordine } = req.body || {};
    const updated = await prisma.servizio.update({
      where: { id },
      data: { nome, prezzo, descrizione, immagineUrl, ordine },
    });
    return res.status(200).json({ ok: true, servizio: updated });
  }

  if (req.method === 'DELETE') {
    await prisma.servizio.delete({ where: { id } });
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', ['PUT', 'DELETE']);
  return res.status(405).json({ error: 'Metodo non consentito' });
};
