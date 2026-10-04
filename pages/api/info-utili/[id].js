import { prisma } from '../../../lib/db';
import { getUserIdFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: 'Non autenticato' });

  const { id } = req.query;

  const info = await prisma.informazioneUtile.findUnique({ where: { id }, include: { structure: true } });
  if (!info || info.structure.userId !== userId) {
    return res.status(404).json({ error: 'Informazione non trovata' });
  }

  if (req.method === 'PUT') {
    const { titolo, descrizione, icona, ordine } = req.body || {};
    const updated = await prisma.informazioneUtile.update({
      where: { id },
      data: { titolo, descrizione, icona, ordine },
    });
    return res.status(200).json({ ok: true, info: updated });
  }

  if (req.method === 'DELETE') {
    await prisma.informazioneUtile.delete({ where: { id } });
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', ['PUT', 'DELETE']);
  return res.status(405).json({ error: 'Metodo non consentito' });
};
