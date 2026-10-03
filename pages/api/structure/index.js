const { prisma } = require('../../../lib/db');
const { getUserIdFromRequest } = require('../../../lib/auth');

module.exports = async function handler(req, res) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: 'Non autenticato' });
  }

  if (req.method === 'GET') {
    const structure = await prisma.structure.findUnique({
      where: { userId },
      include: { servizi: { orderBy: { ordine: 'asc' } }, informazioniUtili: { orderBy: { ordine: 'asc' } } },
    });
    return res.status(200).json({ structure });
  }

  if (req.method === 'PUT') {
    const {
      nome, indirizzo, lat, lng, email, telefono, whatsapp,
      descrizione, colore, checkin, checkout, colazione, pranzo, cena,
    } = req.body || {};

    try {
      const structure = await prisma.structure.upsert({
        where: { userId },
        update: {
          nome, indirizzo, lat, lng, email, telefono, whatsapp,
          descrizione, colore, checkin, checkout, colazione, pranzo, cena,
        },
        create: {
          userId,
          nome, indirizzo, lat, lng, email, telefono, whatsapp,
          descrizione, colore, checkin, checkout, colazione, pranzo, cena,
        },
      });
      return res.status(200).json({ ok: true, structure });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Errore nel salvataggio dei dati struttura' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  return res.status(405).json({ error: 'Metodo non consentito' });
};
