import { prisma } from '../../../lib/db';
import { getUserIdFromRequest } from '../../../lib/auth';

async function getOwnStructureId(userId) {
  const structure = await prisma.structure.findUnique({ where: { userId }, select: { id: true } });
  return structure ? structure.id : null;
}

export default async function handler(req, res) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: 'Non autenticato' });

  const structureId = await getOwnStructureId(userId);
  if (!structureId) return res.status(404).json({ error: 'Struttura non trovata, completa prima i Dati struttura' });

  if (req.method === 'GET') {
    const servizi = await prisma.servizio.findMany({ where: { structureId }, orderBy: { ordine: 'asc' } });
    return res.status(200).json({ servizi });
  }

  if (req.method === 'POST') {
    const { nome, prezzo, descrizione, immagineUrl } = req.body || {};
    if (!nome) return res.status(400).json({ error: 'Il nome del servizio \u00e8 obbligatorio' });

    const count = await prisma.servizio.count({ where: { structureId } });
    const servizio = await prisma.servizio.create({
      data: { structureId, nome, prezzo, descrizione, immagineUrl, ordine: count },
    });
    return res.status(200).json({ ok: true, servizio });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Metodo non consentito' });
};
