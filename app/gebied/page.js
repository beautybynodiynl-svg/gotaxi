import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getSiteContent, getServiceAreas } from "@/lib/content";
import { IconPin } from "@/components/Icons";

export const revalidate = 60;

export const metadata = {
  title: "Werkgebied — Taxi in de hele regio Utrecht | GoTaxiUtrecht",
  description: "GoTaxiUtrecht rijdt in Utrecht en de hele regio: Nieuwegein, Zeist, De Bilt, Houten, Maarssen, IJsselstein en meer.",
};

export default async function GebiedOverviewPage() {
  const [content, areas] = await Promise.all([getSiteContent(), getServiceAreas()]);

  return (
    <>
      <Header phone={content.phone} />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="mb-3 text-[14.5px] font-semibold text-amber">Werkgebied</p>
        <h1 className="font-display text-4xl font-bold">Taxi in de hele regio Utrecht</h1>
        <p className="mt-4 max-w-xl text-[16.5px] text-muted">
          GoTaxiUtrecht rijdt niet alleen in de stad zelf, maar in de hele regio. Kies je plaats voor lokale reistijden en informatie.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {areas.map((a) => (
            <Link
              key={a.slug}
              href={`/gebied/${a.slug}`}
              className="group flex items-start gap-4 rounded-2xl border border-line-strong p-6 transition-colors hover:border-amber"
            >
              <IconPin className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
              <div>
                <h2 className="font-display text-lg font-semibold group-hover:text-amber">{a.name}</h2>
                {a.travel_time && <p className="mt-1 text-sm text-muted">{a.travel_time}</p>}
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer content={content} areas={areas} />
    </>
  );
}
