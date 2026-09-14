import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "./ContactForm";
import { getSiteContent, getServiceAreas, phoneHref, whatsappHref } from "@/lib/content";
import { IconPhone, IconWhatsapp, IconClock } from "@/components/Icons";

export const revalidate = 60;

export const metadata = {
  title: "Contact — GoTaxiUtrecht",
};

export default async function ContactPage() {
  const [content, areas] = await Promise.all([getSiteContent(), getServiceAreas()]);

  return (
    <>
      <Header phone={content.phone} />
      <main className="mx-auto grid max-w-4xl gap-12 px-6 py-16 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-[14.5px] font-semibold text-amber">Contact</p>
          <h1 className="font-display text-4xl font-bold">Een taxi nodig?</h1>
          <p className="mt-4 text-muted">Voor de snelste service: bel of app ons direct. Liever een bericht sturen? Gebruik het formulier.</p>

          <div className="mt-8 space-y-4 text-[15px]">
            <a href={phoneHref(content.phone)} className="flex items-center gap-3 hover:text-amber">
              <IconPhone className="h-5 w-5 text-amber" />
              {content.phone}
            </a>
            <a href={whatsappHref(content.whatsapp_number)} className="flex items-center gap-3 hover:text-amber">
              <IconWhatsapp className="h-5 w-5 text-amber" />
              WhatsApp
            </a>
            <p className="flex items-center gap-3 text-muted">
              <IconClock className="h-5 w-5 text-amber" />
              24/7 bereikbaar
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-line-strong bg-night-2 p-7">
          <ContactForm />
        </div>
      </main>
      <Footer content={content} areas={areas} />
    </>
  );
}
