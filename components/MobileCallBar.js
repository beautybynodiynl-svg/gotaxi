import { IconPhone, IconWhatsapp } from "@/components/Icons";
import { phoneHref, whatsappHref } from "@/lib/content";

export default function MobileCallBar({ phone, whatsapp }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line-strong bg-night/95 p-3 backdrop-blur md:hidden">
      <a
        href={phoneHref(phone)}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-amber py-3 text-[15px] font-semibold text-[#171207]"
      >
        <IconPhone className="h-[18px] w-[18px]" />
        Bel nu
      </a>
      <a
        href={whatsappHref(whatsapp)}
        aria-label="WhatsApp ons"
        className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-line-strong"
      >
        <IconWhatsapp className="h-5 w-5" />
      </a>
    </div>
  );
}
