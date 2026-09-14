"use client";

import { useEffect, useState } from "react";

function IconSun(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8L6 18M18 6l1.8-1.8" />
    </svg>
  );
}

function IconMoon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

export default function ThemeToggle({ className = "" }) {
  const [isLight, setIsLight] = useState(null); // null = nog niet bekend (voorkomt hydration-flits)

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"));
  }, []);

  function toggle() {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("gtu-theme", next ? "light" : "dark");
  }

  if (isLight === null) {
    // Server/eerste render: neutrale placeholder met dezelfde afmeting, geen flits van verkeerd icoon.
    return <span className={`inline-block h-9 w-9 ${className}`} aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Schakel naar donkere modus" : "Schakel naar lichte modus"}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-text transition-colors hover:border-amber ${className}`}
    >
      {isLight ? <IconMoon className="h-4 w-4" /> : <IconSun className="h-4 w-4" />}
    </button>
  );
}
