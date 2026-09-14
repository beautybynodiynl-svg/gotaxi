import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteContent, getServiceAreas } from "@/lib/content";
import { SERVICES } from "@/lib/services";

export const revalidate = 60;

export const metadata = {
  title: "Diensten — GoTaxiUtrecht",
  description: "Luchthavenvervoer, zakelijk vervoer en dagelijks vervoer in en rond Utrecht.",
};

export default async function DienstenPage() {
  const [content, areas] = await Promise.all([getSiteContent(), getServiceAreas()]);

  return (
    <>
      <Header phone={content.phone} />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="mb-3 text-[14.5px] font-semibold text-amber">Diensten</p>
        <h1 className="font-display text-4xl font-bold">Voor elke rit een passende taxi</h1>
        <p className="mt-4 max-w-xl text-[16.5px] text-muted">
          Van een vroege vlucht naar Schiphol tot een zakelijke afspraak in de stad — wij regelen het.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/diensten/${s.slug}`}
              className="group rounded-2xl border border-line-strong p-7 transition-colors hover:border-amber hover:bg-night-2"
            >
              <h2 className="font-display text-lg font-semibold group-hover:text-amber">{s.name}</h2>
              <p className="mt-2.5 text-[15px] text-muted">{s.shortText}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer content={content} areas={areas} />
    </>
  );
}
