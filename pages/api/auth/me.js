import { prisma } from '../../../lib/db';
import { getUserIdFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: 'Non autenticato' });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, phone: true, verified: true },
  });

  if (!user) {
    return res.status(401).json({ error: 'Non autenticato' });
  }

  return res.status(200).json({ user });
};
