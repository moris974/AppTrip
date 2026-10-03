const { prisma } = require('../../../../lib/db');

// Endpoint pubblico: nessuna autenticazione richiesta.
// Restituisce solo i dati pensati per essere visti dall'ospite (niente email/telefono interni, ecc. se non desiderato).
module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'ID struttura mancante' });
  }

  try {
    const structure = await prisma.structure.findUnique({
      where: { id },
      include: {
        servizi: { orderBy: { ordine: 'asc' } },
        informazioniUtili: { orderBy: { ordine: 'asc' } },
      },
    });

    if (!structure) {
      return res.status(404).json({ error: 'Struttura non trovata' });
    }

    // Esponiamo solo i campi pensati per l'ospite
    return res.status(200).json({
      structure: {
        id: structure.id,
        nome: structure.nome,
        indirizzo: structure.indirizzo,
        telefono: structure.telefono,
        whatsapp: structure.whatsapp,
        descrizione: structure.descrizione,
        colore: structure.colore,
        checkin: structure.checkin,
        checkout: structure.checkout,
        colazione: structure.colazione,
        pranzo: structure.pranzo,
        cena: structure.cena,
        servizi: structure.servizi,
        informazioniUtili: structure.informazioniUtili,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Errore del server' });
  }
};
