"use client";

import Link from "next/link";
import { useState } from "react";
import { IconPhone } from "@/components/Icons";
import { phoneHref } from "@/lib/content";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/diensten", label: "Diensten" },
  { href: "/diensten/schiphol-taxi", label: "Schiphol" },
  { href: "/gebied", label: "Gebieden" },
  { href: "/diensten/zakelijk-vervoer", label: "Zakelijk" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ phone }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-night/90 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-2">
        <Link href="/" onClick={() => setOpen(false)} className="flex items-center">
          <span className="flex items-center light:hidden">
            <img src="/images/logo-dark.png" alt="Go Taxi Utrecht" className="hidden h-24 w-auto object-contain sm:block" />
            <img src="/images/logo-dark.png" alt="Go Taxi Utrecht" className="h-16 w-auto object-contain sm:hidden" />
          </span>
          <span className="hidden items-center light:flex">
            <img src="/images/logo-light.png" alt="Go Taxi Utrecht" className="hidden h-24 w-auto object-contain sm:block" />
            <img src="/images/logo-light.png" alt="Go Taxi Utrecht" className="h-16 w-auto object-contain sm:hidden" />
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-[15px] text-muted lg:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-text">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <a href={phoneHref(phone)} className="flex items-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-sm font-semibold transition-colors hover:border-amber">
            <IconPhone className="h-4 w-4" />
            Bel direct
          </a>
          <Link href="/contact" className="rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-[#171207] transition-colors hover:bg-amber-deep">
            Ritprijs aanvragen
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <a
            href={phoneHref(phone)}
            aria-label="Bel direct"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-amber text-[#171207]"
          >
            <IconPhone className="h-[18px] w-[18px]" />
          </a>
          <button
            type="button"
            aria-label={open ? "Sluit menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center text-text"
          >
            <span className="relative block h-4 w-5">
              <span className={`absolute left-0 top-0 h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${open ? "top-[7px] rotate-45" : ""}`} />
              <span className={`absolute left-0 top-[7px] h-[2px] w-5 rounded-full bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute left-0 top-[14px] h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${open ? "top-[7px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      <div className={`overflow-hidden border-t border-line bg-night transition-[max-height,opacity] duration-300 ease-out lg:hidden ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <nav className="flex flex-col gap-1 px-6 py-4 text-[15px] text-muted">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-2 py-2.5 hover:bg-night-2 hover:text-text">
              {l.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-amber px-5 py-2.5 text-center text-sm font-semibold text-[#171207]">
            Ritprijs aanvragen
          </Link>
        </nav>
      </div>
    </header>
  );
}
