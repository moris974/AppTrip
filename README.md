# TravelTrip

App gestionale per strutture ricettive (reception digitale + guida turistica per gli ospiti).

Questo progetto include:
- **Registrazione con conferma via email** (codice a 6 cifre)
- **Login con sessione sicura** (cookie httpOnly)
- **Dati struttura, Servizi, Informazioni utili salvati su database reale** (PostgreSQL)
- **Vista pubblica lato ospite** (`/app/[id]`): la pagina che vedranno davvero i clienti della struttura, generata automaticamente dai dati salvati

---

## 1. Requisiti

- Un account [GitHub](https://github.com)
- Un account [Vercel](https://vercel.com) (puoi collegarlo direttamente al tuo GitHub)
- Un database PostgreSQL. Scegline uno:
  - **Vercel Postgres** (il più semplice: si crea direttamente dal pannello Vercel)
  - [Neon](https://neon.tech) (gratuito, molto usato con Vercel)
  - [Supabase](https://supabase.com)
- (Opzionale ma consigliato) Un account [Resend](https://resend.com) gratuito per inviare davvero le email di verifica

---

## 2. Carica il progetto su GitHub

```bash
cd traveltrip
git init
git add .
git commit -m "Primo commit - TravelTrip"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/traveltrip.git
git push -u origin main
```

---

## 3. Crea il database

### Opzione consigliata: Vercel Postgres
1. Vai sul tuo progetto su [vercel.com](https://vercel.com) (crealo importando il repo GitHub, vedi punto 4)
2. Scheda **Storage** → **Create Database** → **Postgres**
3. Una volta creato, Vercel aggiunge automaticamente la variabile `DATABASE_URL` al progetto

### Alternativa: Neon / Supabase
1. Crea un database gratuito sul loro sito
2. Copia la "connection string" che ti forniscono (deve iniziare con `postgresql://`)
3. La incollerai come variabile d'ambiente `DATABASE_URL` su Vercel (punto 5)

---

## 4. Importa il progetto su Vercel

1. Vai su [vercel.com/new](https://vercel.com/new)
2. Seleziona il repository GitHub appena creato
3. Framework Preset: **Next.js** (dovrebbe essere rilevato automaticamente)
4. Non premere ancora "Deploy": prima configura le variabili d'ambiente (punto 5)

---

## 5. Configura le variabili d'ambiente su Vercel

Nella schermata di importazione (o dopo, in **Project Settings → Environment Variables**), aggiungi:

| Nome | Valore |
|---|---|
| `DATABASE_URL` | La connection string del tuo database Postgres |
| `JWT_SECRET` | Una stringa lunga e casuale (es. generata con `openssl rand -base64 32`) |
| `RESEND_API_KEY` | La tua API key di Resend (opzionale: senza, i codici di verifica vengono solo loggati) |
| `EMAIL_FROM` | Es. `TravelTrip <onboarding@resend.dev>` (va bene il dominio di test di Resend finché non colleghi un tuo dominio) |

Premi **Deploy**.

---

## 6. Applica lo schema al database

Dopo il primo deploy, devi creare le tabelle nel database. Dal tuo computer, con Node.js installato:

```bash
npm install
# incolla il DATABASE_URL reale in un file .env nella root del progetto, poi:
npx prisma migrate deploy
```

Se non hai ancora una migrazione creata, generala prima in locale con:
```bash
npx prisma migrate dev --name init
```
poi fai il commit della cartella `prisma/migrations` generata e rifai il push + redeploy.

---

## 7. Prova il flusso completo

1. Apri il tuo sito (es. `https://traveltrip.vercel.app`)
2. **Registrati** con un'email vera
3. Controlla l'email (o i log di Vercel, se non hai configurato Resend) per il codice a 6 cifre
4. Confermalo → entri nella Dashboard
5. Vai su **Dati struttura**, compila tutto, premi **Salva** → i dati sono ora nel database per davvero
6. Vai su **Servizi** e **Informazioni utili**, aggiungine qualcuno
7. Torna alla **Dashboard** e clicca **👁 Apri vista ospite**: si apre `/app/[id]`, la pagina pubblica che un ospite vedrebbe scansionando il QR code della struttura, con tutti i dati che hai appena salvato

---

## Struttura del progetto

```
pages/
  index.js                  → redirect a /login o /dashboard
  login.js                  → pagina di accesso
  register.js                → registrazione nuova struttura
  verify.js                  → inserimento codice di verifica email
  dashboard.js                → pannello principale
  impostazioni/
    dati-struttura.js         → anagrafica struttura (salva su DB)
    servizi.js                 → elenco servizi (salva su DB)
    informazioni-utili.js      → elenco informazioni utili (salva su DB)
  app/[id].js                 → VISTA PUBBLICA lato ospite (nessun login richiesto)
  api/
    auth/                      → register, verify, login, logout, me
    structure/                 → GET/PUT dati struttura (richiede login)
    servizi/                   → CRUD servizi (richiede login)
    info-utili/                → CRUD informazioni utili (richiede login)
    public/structure/[id].js  → lettura pubblica dati struttura (usata da app/[id] se serve client-side)
prisma/
  schema.prisma               → modello del database
lib/
  db.js, auth.js, mailer.js   → utility condivise
```

---

## Prossimi passi (non ancora inclusi in questo progetto)

Le altre sezioni del prototipo originale (Consigli, Statistiche, Prenotazioni, Messaggi, Email automatiche,
Abbonamento, Ordini, Assistenza) sono per ora solo nel mockup HTML e vanno portate qui allo stesso modo
di "Servizi" e "Informazioni utili" quando sei pronto ad espandere l'app.
