import { IconPhone, IconWhatsapp } from "@/components/Icons";
import { phoneHref, whatsappHref } from "@/lib/content";

export default function MobileCallBar({ phone, whatsapp }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line-strong bg-night/95 p-3 backdrop-blur lg:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <a
        href={phoneHref(phone)}
        className="flex flex-[1.4] items-center justify-center gap-2 rounded-full bg-amber py-3 text-[15px] font-semibold text-[#171207]"
      >
        <IconPhone className="h-[18px] w-[18px]" />
        Bel taxi
      </a>
      <a
        href={whatsappHref(whatsapp)}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1a2e22] py-3 text-[15px] font-semibold text-[#7CD68A]"
      >
        <IconWhatsapp className="h-[18px] w-[18px]" />
        WhatsApp
      </a>
    </div>
  );
}
