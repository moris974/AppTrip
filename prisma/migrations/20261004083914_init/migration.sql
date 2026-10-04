-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationCode" TEXT,
    "verificationExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "structures" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nome" TEXT,
    "indirizzo" TEXT,
    "lat" TEXT,
    "lng" TEXT,
    "email" TEXT,
    "telefono" TEXT,
    "whatsapp" TEXT,
    "descrizione" JSONB DEFAULT '{}',
    "colore" TEXT DEFAULT '#E8748A',
    "checkin" TEXT,
    "checkout" TEXT,
    "colazione" TEXT,
    "pranzo" TEXT,
    "cena" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "structures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servizi" (
    "id" TEXT NOT NULL,
    "structureId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "prezzo" TEXT,
    "descrizione" JSONB DEFAULT '{}',
    "immagineUrl" TEXT,
    "ordine" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servizi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "informazioni_utili" (
    "id" TEXT NOT NULL,
    "structureId" TEXT NOT NULL,
    "titolo" TEXT NOT NULL,
    "descrizione" JSONB DEFAULT '{}',
    "icona" TEXT,
    "ordine" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "informazioni_utili_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "structures_userId_key" ON "structures"("userId");

-- AddForeignKey
ALTER TABLE "structures" ADD CONSTRAINT "structures_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servizi" ADD CONSTRAINT "servizi_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "structures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "informazioni_utili" ADD CONSTRAINT "informazioni_utili_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "structures"("id") ON DELETE CASCADE ON UPDATE CASCADE;
