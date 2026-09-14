import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import MobileCallBar from "@/components/MobileCallBar";
import { getSiteContent } from "@/lib/content";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://gotaxiutrecht.nl";
const TITLE = "Taxi Utrecht | 24/7 Taxi & Schipholvervoer | Go Taxi Utrecht";
const DESCRIPTION =
  "Taxi nodig in Utrecht? Go Taxi Utrecht is 24/7 bereikbaar voor lokale ritten, Schipholvervoer en zakelijke taxi. Bel direct of vraag vooraf je ritprijs aan.";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#10131C",
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | Go Taxi Utrecht" },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Go Taxi Utrecht",
    locale: "nl_NL",
    type: "website",
    images: [{ url: "/images/logo-dark.png", width: 1254, height: 1254, alt: "Go Taxi Utrecht" }],
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/logo-dark.png"],
  },
};

export default async function RootLayout({ children }) {
  const content = await getSiteContent();

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: "Go Taxi Utrecht",
    image: `${SITE_URL}/images/logo-dark.png`,
    url: SITE_URL,
    telephone: content.phone,
    areaServed: {
      "@type": "City",
      name: "Utrecht",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  };

  return (
    <html lang="nl">
      <head>
        {/* Voorkomt een flits van het verkeerde thema: zet de 'light'-class
            al vóór React hydrateert, op basis van een eerder gemaakte keuze. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('gtu-theme')==='light'){document.documentElement.classList.add('light');}}catch(e){}`,
          }}
        />
      </head>
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-body bg-night text-text pb-20 lg:pb-0`}>
        {children}
        <MobileCallBar phone={content.phone} whatsapp={content.whatsapp_number} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
