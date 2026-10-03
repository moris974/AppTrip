const { prisma } = require('../../../lib/db');
const { getUserIdFromRequest } = require('../../../lib/auth');

async function getOwnStructureId(userId) {
  const structure = await prisma.structure.findUnique({ where: { userId }, select: { id: true } });
  return structure ? structure.id : null;
}

module.exports = async function handler(req, res) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: 'Non autenticato' });

  const structureId = await getOwnStructureId(userId);
  if (!structureId) return res.status(404).json({ error: 'Struttura non trovata, completa prima i Dati struttura' });

  if (req.method === 'GET') {
    const informazioniUtili = await prisma.informazioneUtile.findMany({ where: { structureId }, orderBy: { ordine: 'asc' } });
    return res.status(200).json({ informazioniUtili });
  }

  if (req.method === 'POST') {
    const { titolo, descrizione, icona } = req.body || {};
    if (!titolo) return res.status(400).json({ error: 'Il titolo \u00e8 obbligatorio' });

    const count = await prisma.informazioneUtile.count({ where: { structureId } });
    const info = await prisma.informazioneUtile.create({
      data: { structureId, titolo, descrizione, icona, ordine: count },
    });
    return res.status(200).json({ ok: true, info });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Metodo non consentito' });
};
