"use client";

import Link from "next/link";
import { useState } from "react";
import { IconPhone } from "@/components/Icons";
import { phoneHref } from "@/lib/content";

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
    <header className="sticky top-0 z-30 overflow-hidden border-b border-line bg-night/90 backdrop-blur">
      {/* Subtiele weg-animatie op de achtergrond, puur decoratief */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
        preserveAspectRatio="none"
        viewBox="0 0 1200 96"
        aria-hidden="true"
      >
        <path d="M0 60 C 250 20, 500 85, 750 45 S 1100 15, 1200 40" stroke="#F6B93B" strokeWidth="2" strokeDasharray="10 14" fill="none">
          <animate attributeName="stroke-dashoffset" from="0" to="-96" dur="6s" repeatCount="indefinite" />
        </path>
        <circle cx="1150" cy="34" r="5" fill="#F6B93B" />
        <circle cx="1150" cy="34" r="10" fill="none" stroke="#F6B93B" strokeWidth="1.5">
          <animate attributeName="r" values="6;14;6" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0;0.8" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </svg>

      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-2">
        <Link href="/" onClick={() => setOpen(false)} className="flex items-center">
          <img
            src="/images/logo.png"
            alt="Go Taxi Utrecht"
            className="hidden h-24 w-auto object-contain sm:block"
          />
          <img
            src="/images/logo.png"
            alt="Go Taxi Utrecht"
            className="h-16 w-auto object-contain sm:hidden"
          />
        </Link>

        <nav className="hidden items-center gap-6 text-[15px] text-muted lg:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-text">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={phoneHref(phone)} className="flex items-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-sm font-semibold transition-colors hover:border-amber">
            <IconPhone className="h-4 w-4" />
            Bel direct
          </a>
          <Link href="/contact" className="rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-[#171207] transition-colors hover:bg-amber-deep">
            Ritprijs aanvragen
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
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
