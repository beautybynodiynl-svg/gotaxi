import Link from "next/link";
import { IconLogo } from "@/components/Icons";
import { phoneHref, whatsappHref } from "@/lib/content";

export default function Footer({ content, areas = [] }) {
  const year = new Date().getFullYear();
  const isPlaceholder = (v) => !v || v.toLowerCase().includes("nog invullen") || v.includes("000 00 00");

  return (
    <footer id="contact-info" className="border-t border-line py-14">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
              <IconLogo className="h-6 w-6 text-amber" />
              GoTaxi<span className="text-amber">Utrecht</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted">
              Snel, betrouwbaar taxivervoer in en rond Utrecht — dag en nacht.
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-muted">Contact</p>
            <ul className="space-y-2.5 text-[14.5px] text-muted">
              <li>
                <a href={phoneHref(content.phone)} className="hover:text-text">{content.phone}</a>
                {isPlaceholder(content.phone) && (
                  <span className="ml-2 rounded border border-dashed border-amber px-1.5 py-0.5 text-xs text-amber">vul je nummer in</span>
                )}
              </li>
              <li><a href={`mailto:${content.email}`} className="hover:text-text">{content.email}</a></li>
              <li><a href={whatsappHref(content.whatsapp_number)} className="hover:text-text">WhatsApp</a></li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-muted">Werkgebied</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-[14.5px] text-muted">
              {areas.slice(0, 8).map((a) => (
                <li key={a.slug}>
                  <Link href={`/gebied/${a.slug}`} className="hover:text-text">{a.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-[13.5px] text-muted">
          <span>© {year} GoTaxiUtrecht</span>
          <span>
            KvK: {content.kvk_nummer} · Vergunning: {content.vergunning_nummer}
            {isPlaceholder(content.kvk_nummer) && (
              <span className="ml-2 rounded border border-dashed border-amber px-1.5 py-0.5 text-xs text-amber">nog invullen</span>
            )}
          </span>
        </div>
      </div>
    </footer>
  );
}
