const { PrismaClient } = require('@prisma/client');

// Evita di creare pi\u00f9 istanze di PrismaClient durante lo sviluppo (hot reload di Next.js)
const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = { prisma };
