import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteContent, getServiceAreas, phoneHref, whatsappHref } from "@/lib/content";
import {
  IconPhone, IconWhatsapp, IconClock, IconShield, IconTag,
  IconPlane, IconBriefcase, IconCity, IconCheck,
} from "@/components/Icons";

export const revalidate = 60;

export default async function HomePage() {
  const [content, areas] = await Promise.all([getSiteContent(), getServiceAreas()]);

  return (
    <>
      <Header phone={content.phone} />

      <main>
        {/* Hero */}
        <section className="relative mx-auto grid max-w-5xl items-center gap-12 px-6 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="pointer-events-none absolute right-0 top-0 -z-10 h-[420px] w-[420px] rounded-full bg-amber/10 blur-[100px]" />
          <div>
            <p className="mb-4 flex items-center gap-2 text-[14.5px] font-semibold text-amber animate-fade-up">
              <span className="h-2 w-2 rounded-full bg-amber animate-pulse2" />
              Dag en nacht bereikbaar in Utrecht
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.15] sm:text-5xl animate-fade-up [animation-delay:80ms]">
              {content.hero_title}
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted animate-fade-up [animation-delay:160ms]">
              {content.hero_subtitle}
            </p>
            <div className="mt-9 flex flex-wrap gap-3.5 animate-fade-up [animation-delay:240ms]">
              <a href={phoneHref(content.phone)} className="flex items-center gap-2 rounded-full bg-amber px-6 py-3.5 text-[15px] font-semibold text-[#171207] transition-transform hover:-translate-y-0.5 hover:bg-amber-deep">
                <IconPhone className="h-[18px] w-[18px]" />
                Bel nu: {content.phone}
              </a>
              <a href={whatsappHref(content.whatsapp_number)} className="flex items-center gap-2 rounded-full border border-line-strong px-6 py-3.5 text-[15px] font-semibold transition-transform hover:-translate-y-0.5 hover:border-amber">
                <IconWhatsapp className="h-[18px] w-[18px]" />
                WhatsApp ons
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-7 text-sm text-muted animate-fade-up [animation-delay:300ms]">
              <span className="flex items-center gap-2"><IconClock className="h-4 w-4 text-amber" />24/7 bereikbaar</span>
              <span className="flex items-center gap-2"><IconShield className="h-4 w-4 text-amber" />Vergunninghouder</span>
              <span className="flex items-center gap-2"><IconTag className="h-4 w-4 text-amber" />Vaste prijs mogelijk</span>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[420px] animate-fade-up [animation-delay:180ms]">
            <svg viewBox="0 0 420 420" fill="none" className="h-full w-full">
              <path d="M60 320 C 110 260, 90 180, 160 150 S 300 120, 330 60" stroke="#2A3044" strokeWidth="3" strokeDasharray="2 12" strokeLinecap="round" fill="none" />
              <path d="M60 320 C 110 260, 90 180, 160 150 S 300 120, 330 60" stroke="#F6B93B" strokeWidth="3" strokeDasharray="14 400" strokeLinecap="round" fill="none">
                <animate attributeName="stroke-dashoffset" from="0" to="-414" dur="4.5s" repeatCount="indefinite" />
              </path>
              <circle cx="60" cy="320" r="8" fill="#171B27" stroke="#F6B93B" strokeWidth="2" />
              <circle cx="330" cy="60" r="8" fill="#171B27" stroke="#F6B93B" strokeWidth="2" />
              <g>
                <circle r="11" fill="#F6B93B" />
                <animateMotion dur="4.5s" repeatCount="indefinite" path="M60 320 C 110 260, 90 180, 160 150 S 300 120, 330 60" rotate="auto" />
              </g>
              <text x="48" y="345" fill="#A9AFC0" fontFamily="Inter, sans-serif" fontSize="13">Jouw locatie</text>
              <text x="300" y="45" fill="#A9AFC0" fontFamily="Inter, sans-serif" fontSize="13">Bestemming</text>
            </svg>
          </div>
        </section>

        {/* Diensten */}
        <section id="diensten" className="border-t border-line">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <div className="mb-11 max-w-md">
              <p className="mb-3 text-[14.5px] font-semibold text-amber">Diensten</p>
              <h2 className="font-display text-3xl font-bold sm:text-[34px]">Voor elke rit een passende taxi</h2>
              <p className="mt-3.5 text-[16.5px] text-muted">
                Van een vroege vlucht naar Schiphol tot een zakelijke afspraak in de stad — wij regelen het.
              </p>
            </div>
            <div className="grid border-l border-t border-line sm:grid-cols-3">
              <Service slug="luchthavenvervoer" icon={<IconPlane className="h-11 w-11" />} title="Luchthavenvervoer" text="Op tijd naar Schiphol, Eindhoven of Rotterdam Airport. We houden je vluchttijd in de gaten, ook bij vertragingen." />
              <Service slug="zakelijk-vervoer" icon={<IconBriefcase className="h-11 w-11" />} title="Zakelijk vervoer" text="Betrouwbaar vervoer voor klantbezoeken, personeel of stationsritten — desgewenst met factuur voor je bedrijf." />
              <Service slug="dagelijks-vervoer" icon={<IconCity className="h-11 w-11" />} title="Dagelijks vervoer" text="Naar het station, een avondje uit, of gewoon boodschappen die te zwaar zijn voor de fiets. Bel en we komen eraan." />
            </div>
          </div>
        </section>

        {/* Hoe het werkt */}
        <section id="werkt" className="border-t border-line">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <div className="mb-11 max-w-md">
              <p className="mb-3 text-[14.5px] font-semibold text-amber">Hoe het werkt</p>
              <h2 className="font-display text-3xl font-bold sm:text-[34px]">In drie stappen onderweg</h2>
            </div>
            <div className="grid gap-9 sm:grid-cols-3">
              <Step n="1" title="Bel of app ons" text="Geef je locatie en bestemming door — telefonisch of via WhatsApp, wat jou het beste uitkomt." />
              <Step n="2" title="Wij komen eraan" text="Een chauffeur uit de buurt rijdt naar je toe. Bij drukte of een vlucht houden we alles in de gaten." />
              <Step n="3" title="Je bent er, relax" text="Leun achterover. Pinnen of contant betalen kan allebei, een bonnetje krijg je altijd." />
            </div>
          </div>
        </section>

        {/* Tarieven */}
        <section id="tarieven" className="border-t border-line">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <div className="mb-11 max-w-md">
              <p className="mb-3 text-[14.5px] font-semibold text-amber">Tarieven</p>
              <h2 className="font-display text-3xl font-bold sm:text-[34px]">Eerlijke prijzen, geen verrassingen</h2>
            </div>
            <div className="grid gap-10 rounded-[20px] border border-line-strong bg-gradient-to-br from-night-2 to-night p-10 lg:grid-cols-[1.2fr_1fr] sm:p-10">
              <div>
                <h3 className="font-display text-2xl font-semibold">Taxameter of vaste prijs — jij kiest</h3>
                <p className="mt-3.5 text-[15.5px] text-muted">
                  Voor de meeste ritten rekenen we gewoon op de taxameter, zoals wettelijk voorgeschreven. Voor vaste routes — zoals naar een luchthaven — kun je vooraf een vaste prijs opvragen, zodat je precies weet waar je aan toe bent.
                </p>
              </div>
              <ul className="space-y-0">
                {["Altijd een bonnetje", "Pinnen of contant", "Prijs op aanvraag vooraf", "Facturatie voor bedrijven"].map((t) => (
                  <li key={t} className="flex items-center gap-2.5 border-b border-line py-2.5 text-[15px] last:border-none">
                    <IconCheck className="h-4 w-4 shrink-0 text-amber" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Werkgebied overzicht */}
        <section id="gebied" className="border-t border-line">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <div className="mb-11 max-w-md">
              <p className="mb-3 text-[14.5px] font-semibold text-amber">Werkgebied</p>
              <h2 className="font-display text-3xl font-bold sm:text-[34px]">Actief in heel Utrecht en omstreken</h2>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {areas.map((a) => (
                <Link
                  key={a.slug}
                  href={`/gebied/${a.slug}`}
                  className="rounded-full border border-line-strong px-5 py-2.5 text-[14.5px] text-muted transition-colors hover:border-amber hover:text-text"
                >
                  {a.name}
                </Link>
              ))}
              {areas.length === 0 && (
                <p className="text-muted">Werkgebieden worden geladen zodra Supabase is gekoppeld.</p>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* CTA band */}
      <section className="border-t border-line bg-night-2">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-6 px-6 py-14">
          <h2 className="max-w-[16ch] font-display text-[28px] font-bold sm:text-[32px]">Klaar voor vertrek? Wij ook.</h2>
          <div className="flex flex-wrap gap-3.5">
            <a href={phoneHref(content.phone)} className="flex items-center gap-2 rounded-full bg-amber px-6 py-3.5 text-[15px] font-semibold text-[#171207] hover:bg-amber-deep">
              Bel nu: {content.phone}
            </a>
            <a href={whatsappHref(content.whatsapp_number)} className="flex items-center gap-2 rounded-full border border-line-strong px-6 py-3.5 text-[15px] font-semibold hover:border-amber">
              WhatsApp ons
            </a>
          </div>
        </div>
      </section>

      <Footer content={content} areas={areas} />
    </>
  );
}

function Service({ slug, icon, title, text }) {
  return (
    <Link href={`/diensten/${slug}`} className="group border-b border-r border-line p-8 transition-colors hover:bg-night-2">
      <div className="mb-4 text-amber transition-transform duration-200 group-hover:-translate-y-0.5">{icon}</div>
      <h3 className="font-display text-lg font-semibold group-hover:text-amber">{title}</h3>
      <p className="mt-2.5 text-[15px] text-muted">{text}</p>
      <span className="mt-3 inline-block text-sm text-amber opacity-0 transition-opacity group-hover:opacity-100">Meer info</span>
    </Link>
  );
}

function Step({ n, title, text }) {
  return (
    <div>
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-line-strong font-display text-[15px] text-amber">
        {n}
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-[15px] text-muted">{text}</p>
    </div>
  );
}
