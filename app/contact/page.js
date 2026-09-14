import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import { getSiteContent, getServiceAreas, phoneHref, whatsappHref } from "@/lib/content";
import { IconPhone, IconWhatsapp } from "@/components/Icons";

export const revalidate = 60;

export const metadata = {
  title: "Ritprijs aanvragen — Go Taxi Utrecht",
  description: "Vraag eenvoudig je ritprijs aan bij Go Taxi Utrecht, of bel of app ons direct voor een taxi in en rond Utrecht.",
};

export default async function ContactPage() {
  const [content, areas] = await Promise.all([getSiteContent(), getServiceAreas()]);

  return (
    <>
      <Header phone={content.phone} />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="mb-3 text-[14.5px] font-semibold text-amber">Ritprijs aanvragen</p>
        <h1 className="font-display text-4xl font-bold">Vraag je ritprijs aan</h1>
        <p className="mt-4 max-w-lg text-muted">
          Vul je gegevens in en we laten je zo snel mogelijk weten wat je rit kost. Geen account nodig, vrijblijvend.
        </p>

        <div className="mt-10 rounded-2xl border border-line-strong bg-night-2 p-6 sm:p-8">
          <QuoteForm whatsappNumber={content.whatsapp_number} />
        </div>

        <div className="mt-10 rounded-2xl border border-line-strong p-6 sm:p-8">
          <p className="font-display text-lg font-semibold">Liever direct contact?</p>
          <div className="mt-4 flex flex-wrap gap-3.5">
            <a href={phoneHref(content.phone)} className="flex items-center gap-2 rounded-full bg-amber px-6 py-3 text-sm font-semibold text-[#171207] hover:bg-amber-deep">
              <IconPhone className="h-4 w-4" />
              Direct contact met Go Taxi Utrecht
            </a>
            <a href={whatsappHref(content.whatsapp_number)} className="flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-semibold hover:border-amber">
              <IconWhatsapp className="h-4 w-4" />
              Stuur je ritgegevens via WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer content={content} areas={areas} />
    </>
  );
}
