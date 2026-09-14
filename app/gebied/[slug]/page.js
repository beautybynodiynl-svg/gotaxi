import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteContent, getServiceAreas, getServiceAreaBySlug, phoneHref, whatsappHref } from "@/lib/content";
import { IconPhone, IconWhatsapp, IconClock, IconShield, IconPin, IconCheck } from "@/components/Icons";
import RidePriceCalculator from "@/components/RidePriceCalculator";

export const revalidate = 60;

export async function generateStaticParams() {
  const areas = await getServiceAreas();
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const area = await getServiceAreaBySlug(params.slug);
  if (!area) return {};
  return {
    title: `Taxi ${area.name} | Schiphol & Utrecht | Go Taxi Utrecht`,
    description: `Taxi nodig in ${area.name}? Go Taxi Utrecht is 24/7 bereikbaar voor lokale ritten en Schipholvervoer. Bel direct of vraag vooraf je ritprijs aan.`,
    alternates: { canonical: `/gebied/${area.slug}` },
  };
}

export default async function AreaPage({ params }) {
  const [content, areas, area] = await Promise.all([
    getSiteContent(),
    getServiceAreas(),
    getServiceAreaBySlug(params.slug),
  ]);

  if (!area) notFound();

  const otherAreas = areas.filter((a) => a.slug !== area.slug).slice(0, 6);
  const highlights = (area.highlights || "").split(",").map((h) => h.trim()).filter(Boolean);

  return (
    <>
      <Header phone={content.phone} />
      <main>
        <section className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-4 flex items-center gap-2 text-[14.5px] font-semibold text-amber">
              <IconPin className="h-4 w-4" />
              Taxi in {area.name}
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.15] sm:text-[44px]">
              Taxi {area.name}
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted">{area.intro}</p>

            <div className="mt-9 flex flex-wrap gap-3.5">
              <a href="/contact" className="rounded-full bg-amber px-6 py-3.5 text-[15px] font-semibold text-[#171207] hover:bg-amber-deep">
                Vraag ritprijs aan
              </a>
              <a href={phoneHref(content.phone)} className="flex items-center gap-2 rounded-full border border-line-strong px-6 py-3.5 text-[15px] font-semibold hover:border-amber">
                <IconPhone className="h-[18px] w-[18px]" />
                Bel direct
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-line-strong bg-night-2 p-7">
            <h2 className="font-display text-lg font-semibold">{area.name} op een rij</h2>
            <ul className="mt-4 space-y-3.5 text-[15px]">
              {area.travel_time && (
                <li className="flex items-start gap-2.5">
                  <IconClock className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                  <span>{area.travel_time}</span>
                </li>
              )}
              <li className="flex items-start gap-2.5">
                <IconShield className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                <span>Vergunninghouder, ook in {area.name} actief</span>
              </li>
              {highlights.length > 0 && (
                <li className="flex items-start gap-2.5">
                  <IconPin className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                  <span>Bekend bij: {highlights.join(", ")}</span>
                </li>
              )}
            </ul>
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto max-w-2xl px-6 py-10">
            <div className="rounded-2xl border border-line-strong bg-night-2 p-6 sm:p-7">
              <h2 className="font-display text-lg font-semibold">Bereken je ritprijs vanuit {area.name}</h2>
              <p className="mt-1 text-sm text-muted">Geen account nodig. Vrijblijvend.</p>
              <div className="mt-5">
                <RidePriceCalculator presetOriginQuery={area.name} whatsappNumber={content.whatsapp_number} />
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto max-w-5xl px-6 py-14">
            <h2 className="font-display text-2xl font-semibold">Waarom GoTaxiUtrecht in {area.name}</h2>
            <ul className="mt-6 grid gap-3.5 sm:grid-cols-2">
              {[
                `Snel ter plaatse in ${area.name} en omgeving`,
                "24/7 telefonisch en via WhatsApp bereikbaar",
                "Taxameter of vooraf een vaste prijs",
                "Ook luchthavenvervoer en zakelijke ritten",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-[15px] text-muted">
                  <IconCheck className="h-4 w-4 shrink-0 text-amber" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-line bg-night-2">
          <div className="mx-auto max-w-5xl px-6 py-14">
            <h2 className="font-display text-xl font-semibold">Taxi {area.name} naar Schiphol</h2>
            <p className="mt-3 max-w-2xl text-[15px] text-muted">
              Vanuit {area.name} breng je Go Taxi Utrecht rechtstreeks naar Schiphol — geen parkeren, geen overstappen, geen gesjouw met koffers. Voor deze rit kun je vooraf een vaste ritprijs aanvragen, zodat je precies weet waar je aan toe bent.
            </p>
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto max-w-5xl px-6 py-14">
            <h2 className="font-display text-xl font-semibold">Zakelijke taxi {area.name}</h2>
            <p className="mt-3 max-w-2xl text-[15px] text-muted">
              Ook voor zakelijke ritten vanuit {area.name} — klantbezoeken, stationsritten of vervoer voor collega's — kun je op Go Taxi Utrecht rekenen. Facturatie is mogelijk voor bedrijven.
            </p>
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-6 py-14">
            <h2 className="font-display text-xl font-semibold">Veelgestelde vragen over taxi {area.name}</h2>
            <div className="mt-6 divide-y divide-line">
              {[
                { q: `Hoe bestel ik een taxi in ${area.name}?`, a: "Bel of app ons, of vraag online je ritprijs aan. We plannen de rit meteen voor je in." },
                { q: "Kan ik vooraf een prijs krijgen?", a: "Voor veel ritten, waaronder luchthavenritten, kun je vooraf een vaste prijs aanvragen." },
                { q: `Rijden jullie vanuit ${area.name} naar Schiphol?`, a: "Ja, dagelijks. We halen je op bij je deur en brengen je rechtstreeks naar de luchthaven." },
                { q: "Kan ik met meerdere personen reizen?", a: "Ja, geef bij je aanvraag door met hoeveel personen en hoeveel bagage je reist." },
              ].map((f) => (
                <div key={f.q} className="py-4">
                  <p className="font-display text-[16px] font-semibold">{f.q}</p>
                  <p className="mt-1.5 text-[14.5px] text-muted">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {otherAreas.length > 0 && (
          <section className="border-t border-line">
            <div className="mx-auto max-w-5xl px-6 py-14">
              <h2 className="font-display text-xl font-semibold">Ook actief in de buurt</h2>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {otherAreas.map((a) => (
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
        )}
      </main>

      <section className="border-t border-line bg-night-2">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-6 px-6 py-14">
          <h2 className="max-w-[18ch] font-display text-[26px] font-bold sm:text-[30px]">
            Taxi nodig in {area.name}? Wij staan klaar.
          </h2>
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
