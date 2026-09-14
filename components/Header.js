"use client";

import Link from "next/link";
import { useState } from "react";
import { IconLogo, IconPhone } from "@/components/Icons";
import { phoneHref } from "@/lib/content";

const NAV_LINKS = [
  { href: "/#diensten", label: "Diensten" },
  { href: "/#werkt", label: "Hoe het werkt" },
  { href: "/gebied", label: "Werkgebied" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ phone }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-night/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight">
          <IconLogo className="h-6 w-6 text-amber" />
          GoTaxi<span className="text-amber">Utrecht</span>
        </Link>

        <nav className="hidden items-center gap-7 text-[15px] text-muted md:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-text">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href={phoneHref(phone)} className="flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm font-semibold transition-colors hover:border-amber">
            <IconPhone className="h-4 w-4" />
            {phone}
          </a>
          <Link href="/contact" className="rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-[#171207] transition-colors hover:bg-amber-deep">
            Bel direct een taxi
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Sluit menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center text-text md:hidden"
        >
          <span className="relative block h-4 w-5">
            <span className={`absolute left-0 top-0 h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${open ? "top-[7px] rotate-45" : ""}`} />
            <span className={`absolute left-0 top-[7px] h-[2px] w-5 rounded-full bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute left-0 top-[14px] h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${open ? "top-[7px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <div className={`overflow-hidden border-t border-line bg-night transition-[max-height,opacity] duration-300 ease-out md:hidden ${open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
        <nav className="flex flex-col gap-1 px-6 py-4 text-[15px] text-muted">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-2 py-2.5 hover:bg-night-2 hover:text-text">
              {l.label}
            </Link>
          ))}
          <a href={phoneHref(phone)} className="mt-2 rounded-full bg-amber px-5 py-2.5 text-center text-sm font-semibold text-[#171207]">
            Bel nu: {phone}
          </a>
        </nav>
      </div>
    </header>
  );
}
