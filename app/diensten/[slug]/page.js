import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteContent, getServiceAreas, phoneHref, whatsappHref } from "@/lib/content";
import { SERVICES, getService } from "@/lib/services";
import { IconPhone, IconWhatsapp, IconCheck } from "@/components/Icons";
import RidePriceCalculator from "@/components/RidePriceCalculator";

const SCHIPHOL_PRESET = { placeName: "Schiphol Airport", lon: 4.7639, lat: 52.3086, iata: "AMS" };

export const revalidate = 60;

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const service = getService(params.slug);
  if (!service) return {};
  return {
    title: `${service.name} — GoTaxiUtrecht`,
    description: service.heroSubtitle,
  };
}

export default async function ServicePage({ params }) {
  const service = getService(params.slug);
  if (!service) notFound();

  const [content, areas] = await Promise.all([getSiteContent(), getServiceAreas()]);
  const otherServices = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <>
      <Header phone={content.phone} />

      <main>
        <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
          <p className="mb-3 text-[14.5px] font-semibold text-amber">Dienst</p>
          <h1 className="font-display text-4xl font-bold leading-[1.15] sm:text-[44px]">
            {service.slug === "schiphol-taxi" ? "Wat kost een taxi naar Schiphol?" : service.heroTitle}
          </h1>
          <p className="mt-5 text-lg text-muted">
            {service.slug === "schiphol-taxi"
              ? "Vul je vertrekadres in en bekijk direct de geschatte vaste ritprijs."
              : service.heroSubtitle}
          </p>
          {service.slug !== "schiphol-taxi" && (
            <div className="mt-9 flex flex-wrap gap-3.5">
              <a href="/contact" className="rounded-full bg-amber px-6 py-3.5 text-[15px] font-semibold text-[#171207] hover:bg-amber-deep">
                Vraag ritprijs aan
              </a>
              <a href={phoneHref(content.phone)} className="flex items-center gap-2 rounded-full border border-line-strong px-6 py-3.5 text-[15px] font-semibold hover:border-amber">
                <IconPhone className="h-[18px] w-[18px]" />
                Bel direct
              </a>
            </div>
          )}
        </section>

        {service.slug === "schiphol-taxi" && (
          <section className="border-t border-line">
            <div className="mx-auto max-w-2xl px-6 py-10">
              <div className="rounded-2xl border border-line-strong bg-night-2 p-6 sm:p-7">
                <RidePriceCalculator presetDestination={SCHIPHOL_PRESET} whatsappNumber={content.whatsapp_number} />
              </div>
            </div>
          </section>
        )}

        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-6 py-14">
            <p className="text-[16.5px] leading-[1.85] text-muted">{service.intro}</p>
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-6 py-14">
            <h2 className="font-display text-2xl font-semibold">Voor wie is dit</h2>
            <ul className="mt-6 space-y-3.5">
              {service.forWho.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[15px] text-muted">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-6 py-14">
            <h2 className="font-display text-2xl font-semibold">Wat je kunt verwachten</h2>
            <ul className="mt-6 space-y-3.5">
              {service.whatToExpect.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[15px] text-muted">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-6 py-14">
            <h2 className="font-display text-2xl font-semibold">Veelgestelde vragen</h2>
            <div className="mt-6 divide-y divide-line">
              {service.faqs.map((f) => (
                <div key={f.q} className="py-5">
                  <p className="font-display text-[17px] font-semibold">{f.q}</p>
                  <p className="mt-2 text-[15px] text-muted">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {otherServices.length > 0 && (
          <section className="border-t border-line">
            <div className="mx-auto max-w-3xl px-6 py-14">
              <h2 className="font-display text-xl font-semibold">Ook interessant</h2>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {otherServices.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/diensten/${s.slug}`}
                    className="rounded-full border border-line-strong px-5 py-2.5 text-[14.5px] text-muted transition-colors hover:border-amber hover:text-text"
                  >
                    {s.name}
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
            {service.name} nodig? Wij staan klaar.
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: service.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </>
  );
}
