-- GoTaxiUtrecht — Supabase schema
-- Plak dit volledige bestand in het Supabase dashboard onder "SQL Editor" > "New query" en klik Run.

-- 1) Site-content: kleine stukjes tekst die overal op de site staan
create table if not exists site_content (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

-- 2) Werkgebieden: één rij per plaats, gebruikt voor de losse landingspagina's op /gebied/[slug]
create table if not exists service_areas (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,        -- bv. 'nieuwegein', gebruikt in de url
  name text not null,               -- bv. 'Nieuwegein'
  intro text not null default '',   -- korte, unieke tekst over deze plaats
  travel_time text,                 -- bv. '15 minuten naar Utrecht Centraal'
  highlights text,                  -- bv. bekende plekken/wijken, komma-gescheiden
  content text,                     -- uitgebreide, unieke tekst (500-800 woorden), alinea's gescheiden door een lege regel
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- 3) Contactformulier-inzendingen (algemeen, legacy — het ritprijs-formulier
--    hieronder is de primaire manier waarop aanvragen nu binnenkomen)
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  message text,
  created_at timestamptz not null default now(),
  read boolean not null default false
);

-- Row Level Security aanzetten
alter table site_content enable row level security;
alter table service_areas enable row level security;
alter table contact_messages enable row level security;

-- Publiek mag content en werkgebieden LEZEN (de openbare website)
create policy "Publiek kan site_content lezen" on site_content
  for select using (true);

create policy "Publiek kan service_areas lezen" on service_areas
  for select using (true);

-- Alleen ingelogde gebruikers mogen content AANPASSEN (via /admin)
create policy "Ingelogde gebruikers kunnen site_content aanpassen" on site_content
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Ingelogde gebruikers kunnen service_areas aanpassen" on service_areas
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Iedereen mag het contactformulier INSTUREN, maar niet lezen
create policy "Publiek kan contactformulier insturen" on contact_messages
  for insert with check (true);

create policy "Ingelogde gebruikers kunnen berichten lezen" on contact_messages
  for select using (auth.role() = 'authenticated');

-- 5) Prijsconfiguratie voor de ritprijscalculator. Eén rij (id = 'default')
--    met de volledige config als JSON — dat is bewust, zodat alle tarieven
--    samen op één plek staan (single source of truth) in plaats van
--    verspreid over losse kolommen.
create table if not exists pricing_config (
  id text primary key default 'default',
  config jsonb not null,
  updated_at timestamptz not null default now()
);

alter table pricing_config enable row level security;

create policy "Publiek kan pricing_config lezen" on pricing_config
  for select using (true);

create policy "Ingelogde gebruikers kunnen pricing_config aanpassen" on pricing_config
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into pricing_config (id, config) values (
  'default',
  '{
    "standard": { "startFee": 4.00, "pricePerKm": 2.40, "pricePerMinute": 0.35, "minimumFare": 15.00 },
    "airports": {
      "schiphol":  { "enabled": true,  "baseFee": 20.00, "pricePerKm": 1.50, "minimumFare": 65.00 },
      "rotterdam": { "enabled": false, "baseFee": 0,     "pricePerKm": 0,    "minimumFare": 0 },
      "eindhoven": { "enabled": false, "baseFee": 0,     "pricePerKm": 0,    "minimumFare": 0 }
    },
    "roundingMethod": "round",
    "maxAutoQuoteDistanceKm": 150,
    "requireManualConfirmation": true,
    "calculatorEnabled": true,
    "surcharges": {
      "night":      { "enabled": false, "from": "00:00", "to": "06:00", "amount": 0 },
      "extraStop":  { "enabled": false, "amount": 0 },
      "childSeat":  { "enabled": false, "amount": 0 }
    }
  }'::jsonb
) on conflict (id) do nothing;

-- 6) Reserveringen vanuit de ritprijscalculator. De prijs (calculated_fare)
--    wordt vastgelegd zoals die op het moment van boeken gold — wijzigen de
--    tarieven later, dan verandert de prijs van bestaande boekingen NIET.
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  origin_label text not null,
  origin_lon double precision,
  origin_lat double precision,
  destination_label text not null,
  destination_lon double precision,
  destination_lat double precision,
  ride_date text,
  ride_time text,
  passengers integer not null default 1,
  luggage integer,
  return_trip boolean not null default false,
  notes text,
  route_km numeric,
  route_minutes numeric,
  calculated_fare numeric,
  pricing_type text, -- standard | airport | manual
  status text not null default 'nieuw', -- nieuw | bekeken | afgehandeld
  created_at timestamptz not null default now()
);

alter table bookings enable row level security;

create policy "Publiek kan reserveringen insturen" on bookings
  for insert with check (true);

create policy "Ingelogde gebruikers kunnen reserveringen lezen" on bookings
  for select using (auth.role() = 'authenticated');

create policy "Ingelogde gebruikers kunnen reserveringen bijwerken" on bookings
  for update using (auth.role() = 'authenticated');

-- Startcontent invullen — LET OP: telefoonnummer/e-mail/KvK zijn placeholders, pas
-- deze aan via het beheerpaneel (/admin) voordat de site live gaat.
insert into site_content (key, value) values
  ('hero_title', 'Waar je ook moet zijn, wij staan al klaar.'),
  ('hero_subtitle', 'Vul je vertrekadres en bestemming in en bekijk direct je geschatte vaste ritprijs. Of bel ons als je meteen een taxi nodig hebt.'),
  ('phone', '06 14 52 95 05'),
  ('whatsapp_number', '31614529505'),
  ('email', 'info@gotaxiutrecht.nl'),
  ('kvk_nummer', 'nog invullen'),
  ('vergunning_nummer', 'nog invullen')
on conflict (key) do nothing;

-- Startwerkgebieden invullen (regio Utrecht) — teksten mogen aangepast/uitgebreid
-- worden via het beheerpaneel.
insert into service_areas (slug, name, intro, travel_time, highlights, sort_order) values
  ('utrecht-centrum', 'Utrecht Centrum',
    'Van Utrecht Centraal, de Neude of de Oudegracht tot aan je voordeur: GoTaxiUtrecht is binnen enkele minuten bij je in het centrum van Utrecht.',
    'Direct in de stad', 'Utrecht Centraal, Oudegracht, Neude, Dom', 1),
  ('nieuwegein', 'Nieuwegein',
    'Woon of werk je in Nieuwegein? Wij rijden dagelijks tussen Nieuwegein en Utrecht, en verzorgen ook ritten naar Schiphol vanuit de hele regio Lekboulevard en Batau.',
    '15 minuten naar Utrecht Centraal', 'City Plaza, Lekboulevard, Batau', 2),
  ('zeist', 'Zeist',
    'Van de groene lanen van Zeist tot aan Utrecht of de snelweg: een betrouwbare taxi voor zakelijke ritten en dagelijkse trips.',
    '20 minuten naar Utrecht Centraal', 'Slot Zeist, Austerlitz, Zeist-West', 3),
  ('de-bilt', 'De Bilt',
    'GoTaxiUtrecht verzorgt vervoer in De Bilt en Bilthoven, van de Soestdijkseweg tot aan het centrum van Utrecht.',
    '15 minuten naar Utrecht Centraal', 'Bilthoven, Soestdijkseweg, De Holle Bilt', 4),
  ('houten', 'Houten',
    'Vanuit Houten snel naar Utrecht Centraal, Schiphol of elders in de regio — dag en nacht bereikbaar.',
    '15 minuten naar Utrecht Centraal', 'Houten Centrum, Castellum, De Meerpaal', 5),
  ('maarssen', 'Maarssen',
    'Taxivervoer in Maarssen en Maarssenbroek, met snelle verbindingen naar Utrecht en de A2.',
    '15 minuten naar Utrecht Centraal', 'Maarssenbroek, Doorslag, Vecht', 6),
  ('ijsselstein', 'IJsselstein',
    'Van het historische centrum van IJsselstein tot aan Utrecht of Nieuwegein: wij staan klaar.',
    '20 minuten naar Utrecht Centraal', 'Binnenstad, Zenderpark, Achterveld', 7),
  ('bunnik', 'Bunnik',
    'Taxivervoer in Bunnik en Odijk, ideaal voor ritten naar Utrecht Centraal of station Driebergen-Zeist.',
    '15 minuten naar Utrecht Centraal', 'Odijk, Werkhoven, Fort bij Vechten', 8),
  ('vianen', 'Vianen',
    'Vanuit Vianen snel de A2 op richting Utrecht, of een rustige rit naar huis — GoTaxiUtrecht rijdt ook hier.',
    '25 minuten naar Utrecht Centraal', 'Lekdijk, Hoefslag, Vianen-Oost', 9),
  ('woerden', 'Woerden',
    'Taxivervoer tussen Woerden en Utrecht, met oog voor treinaansluitingen op station Woerden.',
    '25 minuten naar Utrecht Centraal', 'Woerden Centrum, Snel en Polanen, Molenvliet', 10),
  ('amersfoort', 'Amersfoort',
    'GoTaxiUtrecht verzorgt ook ritten van en naar Amersfoort, bijvoorbeeld tussen station Amersfoort Centraal en de regio Utrecht.',
    '30 minuten naar Utrecht Centraal', 'Amersfoort Centraal, Koppelpoort, Vathorst', 11),
  ('soest', 'Soest',
    'Vanuit Soest en Soesterberg snel naar Utrecht, Amersfoort of de snelweg A28.',
    '25 minuten naar Utrecht Centraal', 'Soesterberg, Soestdijk, Kampweg', 12),
  ('baarn', 'Baarn',
    'Taxivervoer in Baarn, met een vaste of taxameterprijs richting Utrecht, Amersfoort of Schiphol.',
    '30 minuten naar Utrecht Centraal', 'Paleis Soestdijk, Brink, Station Baarn', 13),
  ('driebergen-zeist', 'Driebergen-Zeist',
    'Van station Driebergen-Zeist tot in het groene Driebergen: GoTaxiUtrecht rijdt hier dagelijks.',
    '20 minuten naar Utrecht Centraal', 'Station Driebergen-Zeist, Hoofdstraat, Traaij', 14),
  ('bilthoven', 'Bilthoven',
    'Taxivervoer in Bilthoven, onderdeel van De Bilt, met snelle verbindingen naar Utrecht Centraal en De Uithof.',
    '15 minuten naar Utrecht Centraal', 'Station Bilthoven, Julianalaan, De Leyen', 15),
  ('breukelen', 'Breukelen',
    'Vanuit Breukelen langs de Vecht snel naar Utrecht, of naar station Breukelen voor een treinaansluiting.',
    '20 minuten naar Utrecht Centraal', 'Vecht, Station Breukelen, Nyenrode', 16),
  ('loenen-aan-de-vecht', 'Loenen aan de Vecht',
    'Taxivervoer in het pittoreske Loenen aan de Vecht en omgeving, richting Utrecht of Amsterdam.',
    '30 minuten naar Utrecht Centraal', 'Vecht, Kasteel Loenersloot, Nieuwersluis', 17),
  ('wijk-bij-duurstede', 'Wijk bij Duurstede',
    'Van het historische Wijk bij Duurstede snel naar Utrecht, via de A12 of langs de Lek.',
    '30 minuten naar Utrecht Centraal', 'Kasteel Duurstede, Markt, Lekdijk', 18),
  ('doorn', 'Doorn',
    'Taxivervoer op de Utrechtse Heuvelrug, van Doorn naar Utrecht, Zeist of Driebergen.',
    '25 minuten naar Utrecht Centraal', 'Kasteel Doorn, Dorpsstraat, Broekweg', 19),
  ('montfoort', 'Montfoort',
    'Vanuit Montfoort snel naar Utrecht of Woerden, ook voor luchthavenvervoer naar Schiphol.',
    '25 minuten naar Utrecht Centraal', 'Historische vestingstad, Hofland, Linschoten', 20),
  ('harmelen', 'Harmelen',
    'GoTaxiUtrecht rijdt in Harmelen, tussen Utrecht en Woerden in, met een station vlakbij.',
    '20 minuten naar Utrecht Centraal', 'Station Harmelen, Dorpshuis, Vleuterweide', 21),
  ('mijdrecht', 'Mijdrecht',
    'Taxivervoer in Mijdrecht en De Ronde Venen, richting Utrecht of Amsterdam.',
    '30 minuten naar Utrecht Centraal', 'De Ronde Venen, Amstel, Industrieweg', 22),
  ('abcoude', 'Abcoude',
    'Van het dorpse Abcoude snel naar Utrecht Centraal of naar Amsterdam, met een station in de buurt.',
    '25 minuten naar Utrecht Centraal', 'Station Abcoude, Amstel, Dorpsplein', 23),
  ('vleuten-de-meern', 'Vleuten-De Meern',
    'Taxivervoer in de Utrechtse wijk Vleuten-De Meern, met snelle verbindingen naar het centrum en station Vleuten.',
    '15 minuten naar Utrecht Centraal', 'Station Vleuten, Haarrijnplein, Meerpaal', 24),
  ('leidsche-rijn', 'Leidsche Rijn',
    'Van Leidsche Rijn Centrum tot aan Terwijde: GoTaxiUtrecht is snel bij je in deze grote Utrechtse wijk.',
    '15 minuten naar Utrecht Centraal', 'Leidsche Rijn Centrum, Terwijde, Parkwijk', 25)
on conflict (slug) do nothing;
