# GoTaxiUtrecht — website

Moderne website voor GoTaxiUtrecht, gebouwd met Next.js, Supabase (backend/database) en klaar om te hosten op Vercel. Teksten, contactgegevens én de losse landingspagina's per werkgebied (stad) zijn te beheren via `/admin` — geen developer nodig.

Dit is dezelfde opzet als het eerdere Beauty by Nodiy-project, dus als je die stappen al eens hebt gedaan, komt dit bekend voor.

## Belangrijk: placeholder-gegevens invullen

De site bevat nog GEEN echte bedrijfsgegevens. Vul via het beheerpaneel (na installatie) in elk geval in:
- Telefoonnummer
- WhatsApp-nummer
- E-mailadres
- KvK-nummer
- Vergunningnummer (taxivergunning)

Zonder deze gegevens werken de "Bel nu"- en WhatsApp-knoppen niet correct.

## Stap 1 — Supabase-project aanmaken

1. Ga naar **[supabase.com](https://supabase.com)**, maak een gratis account.
2. Klik op **New project**, kies een naam (bv. `gotaxiutrecht`), een sterk database-wachtwoord, en regio Frankfurt.
3. Wacht tot het project klaar is (1-2 minuten).

## Stap 2 — Database-tabellen aanmaken

1. Ga naar **SQL Editor** > **New query**.
2. Open `supabase/schema.sql` uit dit project, kopieer de hele inhoud, plak in de SQL Editor, klik **Run**.
3. Dit maakt de tabellen `site_content`, `service_areas` (de werkgebieden/steden) en `contact_messages` aan, en vult ze met startdata — inclusief 10 plaatsen in de regio Utrecht.

## Stap 3 — Inlogaccount voor het beheerpaneel

1. Ga naar **Authentication** > **Users** > **Add user** > **Create new user**.
2. Vul je e-mailadres en een wachtwoord in, vink **Auto Confirm User** aan, klik **Create user**.

## Stap 4 — API-sleutels ophalen

1. Ga naar **Project Settings** > **API Keys**.
2. Kopieer de **Project URL** en de **Publishable key** (dit heet ook wel "anon key").

## Stap 5 — Naar GitHub

1. Maak een (gratis) GitHub-account en een nieuwe repository, bv. `gotaxiutrecht`.
2. Upload de bestanden uit dit project (via GitHub Desktop, zoals eerder).

## Stap 6 — Hosten op Vercel

1. Ga naar **vercel.com**, log in met GitHub, klik **Add New > Project**, kies de repository.
2. Bij **Environment Variables**, voeg toe:
   - `NEXT_PUBLIC_SUPABASE_URL` → de Project URL uit stap 4
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → de Publishable key uit stap 4
3. Klik **Deploy**.

## Werkgebieden (steden) beheren

Ga naar `/admin` > tabblad **Werkgebieden**. Daar kun je:
- Bestaande plaatsen (Utrecht, Nieuwegein, Zeist, De Bilt, Houten, Maarssen, IJsselstein, Bunnik, Vianen, Woerden) bewerken
- Nieuwe plaatsen toevoegen — elke plaats krijgt automatisch een eigen landingspagina op `/gebied/<plaatsnaam>`
- Plaatsen verwijderen

Schrijf voor elke plaats een **unieke** introductietekst (niet gewoon dezelfde tekst met alleen de plaatsnaam veranderd) — dat is beter voor vindbaarheid in Google en leest prettiger voor bezoekers.

## Projectstructuur

```
app/
  page.js                    → Homepage
  gebied/page.js              → Overzicht van alle werkgebieden
  gebied/[slug]/page.js       → Losse landingspagina per stad
  contact/                    → Contactpagina + formulier
  admin/                      → Login + beheerpaneel
components/                   → Header, Footer, Icons
lib/                          → Supabase-verbinding en data-functies
supabase/schema.sql           → Database-structuur + startdata
```

## Lokaal ontwikkelen

```bash
npm install
cp .env.local.example .env.local
# vul .env.local in met je Supabase-gegevens
npm run dev
```
