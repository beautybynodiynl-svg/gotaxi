import Link from "next/link";
import { IconPhone, IconWhatsapp } from "@/components/Icons";
import { phoneHref, whatsappHref } from "@/lib/content";
import { SERVICES } from "@/lib/services";

function isPlaceholder(v) {
  return !v || v.toLowerCase().includes("nog invullen") || v.includes("000 00 00");
}

export default function Footer({ content, areas = [] }) {
  const year = new Date().getFullYear();
  const topAreas = areas.slice(0, 6);
  const hasCompanyInfo = !isPlaceholder(content.kvk_nummer) || !isPlaceholder(content.vergunning_nummer);

  return (
    <footer id="contact-info" className="border-t border-line py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/">
              <img src="/images/logo-dark.png" alt="Go Taxi Utrecht" className="h-20 w-auto object-contain light:hidden" />
              <img src="/images/logo-light.png" alt="Go Taxi Utrecht" className="hidden h-20 w-auto object-contain light:block" />
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted">
              Taxi in en rond Utrecht — dag en nacht bereikbaar.
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-muted">Diensten</p>
            <ul className="space-y-2.5 text-[14.5px] text-muted">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/diensten/${s.slug}`} className="hover:text-text">{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-muted">Gebieden</p>
            <ul className="space-y-2.5 text-[14.5px] text-muted">
              {topAreas.map((a) => (
                <li key={a.slug}>
                  <Link href={`/gebied/${a.slug}`} className="hover:text-text">{a.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/gebied" className="text-amber hover:text-amber-deep">Alle gebieden →</Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-muted">Contact</p>
            <ul className="space-y-2.5 text-[14.5px] text-muted">
              {!isPlaceholder(content.phone) && (
                <li className="flex items-center gap-2">
                  <IconPhone className="h-4 w-4 text-amber" />
                  <a href={phoneHref(content.phone)} className="hover:text-text">{content.phone}</a>
                </li>
              )}
              {content.whatsapp_number && (
                <li className="flex items-center gap-2">
                  <IconWhatsapp className="h-4 w-4 text-amber" />
                  <a href={whatsappHref(content.whatsapp_number)} className="hover:text-text">WhatsApp</a>
                </li>
              )}
              {content.email && !isPlaceholder(content.email) && (
                <li><a href={`mailto:${content.email}`} className="hover:text-text">{content.email}</a></li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-[13.5px] text-muted">
          <span>© {year} Go Taxi Utrecht</span>
          {hasCompanyInfo && (
            <span>
              {!isPlaceholder(content.kvk_nummer) && <>KvK: {content.kvk_nummer}</>}
              {!isPlaceholder(content.kvk_nummer) && !isPlaceholder(content.vergunning_nummer) && " · "}
              {!isPlaceholder(content.vergunning_nummer) && <>Vergunning: {content.vergunning_nummer}</>}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
