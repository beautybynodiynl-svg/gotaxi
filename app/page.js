import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaqAccordion from "@/components/FaqAccordion";
import RidePriceCalculator from "@/components/RidePriceCalculator";
import { getSiteContent, getServiceAreas, phoneHref, whatsappHref } from "@/lib/content";
import { SERVICES } from "@/lib/services";
import {
  IconPhone, IconClock, IconShield, IconTag, IconCheck,
  IconPlane, IconBriefcase, IconCity, IconPin, IconCar,
} from "@/components/Icons";

export const revalidate = 60;

export default async function HomePage() {
  const [content, areas] = await Promise.all([getSiteContent(), getServiceAreas()]);

  return (
    <>
      <Header phone={content.phone} />

      <main>
        {/* 1. Hero + directe CTA's */}
        <section className="relative mx-auto grid max-w-6xl items-start gap-10 overflow-hidden px-6 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="pointer-events-none absolute right-0 top-0 -z-10 h-[420px] w-[420px] rounded-full bg-amber/10 blur-[100px]" />

          <div>
            <p className="mb-4 flex items-center gap-2 text-[14.5px] font-semibold text-amber">
              <span className="h-2 w-2 rounded-full bg-amber animate-pulse2" />
              Taxi Utrecht · 24/7 bereikbaar
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.12] sm:text-[3.1rem]">
              {content.hero_title}
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted">{content.hero_subtitle}</p>

            <ul className="mt-7 space-y-2.5 text-[15px]">
              <li className="flex items-center gap-2.5"><IconCheck className="h-4 w-4 shrink-0 text-amber" />24/7 bereikbaar</li>
              <li className="flex items-center gap-2.5"><IconCheck className="h-4 w-4 shrink-0 text-amber" />Vooraf een vaste ritprijs mogelijk</li>
              <li className="flex items-center gap-2.5"><IconCheck className="h-4 w-4 shrink-0 text-amber" />Professionele en betrouwbare chauffeurs</li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3.5">
              <a href="#ritprijs" className="rounded-full bg-amber px-6 py-3.5 text-[15px] font-semibold text-[#171207] transition-colors hover:bg-amber-deep">
                Vraag je ritprijs aan
              </a>
              <a href={phoneHref(content.phone)} className="flex items-center gap-2 rounded-full border border-line-strong px-6 py-3.5 text-[15px] font-semibold transition-colors hover:border-amber">
                <IconPhone className="h-[18px] w-[18px]" />
                Bel direct
              </a>
            </div>
          </div>

          {/* 2. Ritprijs-formulier, direct zichtbaar boven de vouw */}
          <div id="ritprijs" className="scroll-mt-24 rounded-2xl border border-line-strong bg-night-2 p-6 sm:p-7">
            <h2 className="font-display text-lg font-semibold">Bereken je ritprijs</h2>
            <p className="mt-1 text-sm text-muted">Geen account nodig. Vrijblijvend.</p>
            <div className="mt-5">
              <RidePriceCalculator whatsappNumber={content.whatsapp_number} />
            </div>
          </div>
        </section>

        {/* 3. Vertrouwen — geen nep-reviews, wel eerlijke trust-elementen */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-center text-[14.5px] text-muted sm:justify-between">
              <span className="flex items-center gap-2"><IconShield className="h-4 w-4 text-amber" />Vergunninghouder</span>
              <span className="flex items-center gap-2"><IconClock className="h-4 w-4 text-amber" />24/7 bereikbaar</span>
              <span className="flex items-center gap-2"><IconTag className="h-4 w-4 text-amber" />Vaste prijs vooraf mogelijk</span>
              <span className="flex items-center gap-2"><IconCheck className="h-4 w-4 text-amber" />Betrouwbare chauffeurs</span>
            </div>
          </div>
        </section>

        {/* 4. Belangrijkste diensten */}
        <section id="diensten" className="border-t border-line">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="mb-11 max-w-md">
              <p className="mb-3 text-[14.5px] font-semibold text-amber">Diensten</p>
              <h2 className="font-display text-3xl font-bold sm:text-[34px]">Voor elke rit een passende taxi</h2>
            </div>
            <div className="grid border-l border-t border-line sm:grid-cols-3">
              <ServiceCard slug="dagelijks-vervoer" icon={<IconCity className="h-11 w-11" />} title="Taxi in Utrecht" text="Voor snelle en comfortabele ritten binnen Utrecht en omgeving." cta="Taxi aanvragen" />
              <ServiceCard slug="schiphol-taxi" icon={<IconPlane className="h-11 w-11" />} title="Schiphol Taxi" text="Comfortabel van Utrecht naar Schiphol of andersom. Vooraf een vaste ritprijs mogelijk." cta="Vraag Schipholprijs aan" />
              <ServiceCard slug="zakelijk-vervoer" icon={<IconBriefcase className="h-11 w-11" />} title="Zakelijk vervoer" text="Betrouwbaar vervoer voor bedrijven, medewerkers en zakelijke afspraken." cta="Zakelijke taxi" />
            </div>
          </div>
        </section>

        {/* 5. Schiphol, prominent */}
        <section className="border-t border-line bg-night-2">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-[14.5px] font-semibold text-amber">Luchthavenvervoer</p>
              <h2 className="font-display text-3xl font-bold sm:text-[34px]">Taxi Utrecht naar Schiphol</h2>
              <p className="mt-4 text-[16.5px] text-muted">
                Geen gedoe met parkeren, overstappen of zware koffers. Wij halen je op bij je deur en brengen je rechtstreeks naar Schiphol. Voor luchthavenritten kun je vooraf een vaste ritprijs aanvragen.
              </p>
              <div className="mt-7 flex flex-wrap gap-3.5">
                <a href="#ritprijs" className="rounded-full bg-amber px-6 py-3 text-sm font-semibold text-[#171207] hover:bg-amber-deep">
                  Vraag Schipholprijs aan
                </a>
                <Link href="/diensten/schiphol-taxi" className="rounded-full border border-line-strong px-6 py-3 text-sm font-semibold hover:border-amber">
                  Bekijk Schiphol Taxi
                </Link>
              </div>
            </div>
            <ul className="space-y-3.5">
              {[
                "Ophalen aan huis",
                "24/7 beschikbaar",
                "Ruimte voor bagage",
                "Vluchtnummer doorgeven mogelijk",
                "Vaste prijs vooraf mogelijk",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2.5 rounded-xl border border-line-strong bg-night px-4 py-3 text-[15px]">
                  <IconCheck className="h-4 w-4 shrink-0 text-amber" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 6. Waarom Go Taxi Utrecht */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Waarom kiezen voor Go Taxi Utrecht?</h2>
            <div className="mt-9 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Why icon={<IconClock className="h-6 w-6" />} title="24/7 bereikbaar" text="Ook vroeg in de ochtend of laat in de avond." />
              <Why icon={<IconTag className="h-6 w-6" />} title="Duidelijke prijs" text="Voor veel ritten kun je vooraf een vaste prijs afspreken." />
              <Why icon={<IconPin className="h-6 w-6" />} title="Lokale chauffeur" text="Wij kennen Utrecht en omgeving." />
              <Why icon={<IconPlane className="h-6 w-6" />} title="Schipholvervoer" text="Rechtstreeks naar de luchthaven zonder parkeer- of overstapstress." />
              <Why icon={<IconCar className="h-6 w-6" />} title="Comfortabel vervoer" text="Nette voertuigen en comfortabel reizen." />
              <Why icon={<IconPhone className="h-6 w-6" />} title="Direct contact" text="Geen ingewikkelde klantenservice. Gewoon bellen of WhatsAppen." />
            </div>
          </div>
        </section>

        {/* 7. Werkgebieden */}
        <section id="gebied" className="border-t border-line">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="mb-9 max-w-md">
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
                  Taxi {a.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Prijs / transparantie */}
        <section id="tarieven" className="border-t border-line">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid gap-10 rounded-[20px] border border-line-strong bg-gradient-to-br from-night-2 to-night p-8 lg:grid-cols-[1.2fr_1fr] sm:p-10">
              <div>
                <h2 className="font-display text-2xl font-semibold">Vooraf weten waar je aan toe bent</h2>
                <p className="mt-3.5 text-[15.5px] text-muted">
                  Voor luchthavenritten en veel langere ritten kun je vooraf een vaste prijs aanvragen. Stuur je vertrekadres en bestemming door en we laten je weten wat de rit kost. Voor reguliere taxiritten kan de taxameter worden gebruikt.
                </p>
                <a href="#ritprijs" className="mt-6 inline-block rounded-full bg-amber px-6 py-3 text-sm font-semibold text-[#171207] hover:bg-amber-deep">
                  Vraag ritprijs aan
                </a>
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

        {/* 10. FAQ */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Veelgestelde vragen</h2>
            <div className="mt-8">
              <FaqAccordion items={HOME_FAQ} />
            </div>
          </div>
        </section>
      </main>

      {/* 11. Final CTA */}
      <section className="border-t border-line bg-night-2">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-14">
          <h2 className="max-w-[16ch] font-display text-[28px] font-bold sm:text-[32px]">Taxi nodig? Regel je rit direct.</h2>
          <div className="flex flex-wrap gap-3.5">
            <a href="#ritprijs" className="rounded-full bg-amber px-6 py-3.5 text-[15px] font-semibold text-[#171207] hover:bg-amber-deep">
              Vraag ritprijs aan
            </a>
            <a href={phoneHref(content.phone)} className="flex items-center gap-2 rounded-full border border-line-strong px-6 py-3.5 text-[15px] font-semibold hover:border-amber">
              Bel direct
            </a>
          </div>
        </div>
      </section>

      {/* JSON-LD: FAQPage, alleen met echte vragen/antwoorden die ook zichtbaar op de pagina staan */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: HOME_FAQ.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      <Footer content={content} areas={areas} />
    </>
  );
}

const HOME_FAQ = [
  { q: "Kan ik vooraf een taxi reserveren?", a: "Ja. Je kunt vooraf contact opnemen via telefoon, WhatsApp of het ritformulier." },
  { q: "Rijden jullie naar Schiphol?", a: "Ja. Je kunt vanuit Utrecht en verschillende plaatsen in de regio vervoer naar Schiphol aanvragen." },
  { q: "Kan ik vooraf een vaste prijs afspreken?", a: "Voor bepaalde ritten, waaronder veel luchthavenritten en langere ritten, kun je vooraf een prijs aanvragen." },
  { q: "Kan ik 's nachts een taxi aanvragen?", a: "Go Taxi Utrecht is 24/7 bereikbaar." },
  { q: "Kan ik met meerdere personen reizen?", a: "Ja. Geef bij je aanvraag aan met hoeveel personen en hoeveel bagage je reist." },
];

function ServiceCard({ slug, icon, title, text, cta }) {
  return (
    <Link href={`/diensten/${slug}`} className="group border-b border-r border-line p-8 transition-colors hover:bg-night">
      <div className="mb-4 text-amber transition-transform duration-200 group-hover:-translate-y-0.5">{icon}</div>
      <h3 className="font-display text-lg font-semibold group-hover:text-amber">{title}</h3>
      <p className="mt-2.5 text-[15px] text-muted">{text}</p>
      <span className="mt-4 inline-block text-sm font-medium text-amber opacity-0 transition-opacity group-hover:opacity-100">{cta} →</span>
    </Link>
  );
}

function Why({ icon, title, text }) {
  return (
    <div>
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-night-2 text-amber ring-1 ring-line-strong">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 text-[15px] text-muted">{text}</p>
    </div>
  );
}
