import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

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

export const metadata = {
  title: "GoTaxiUtrecht — Taxi in en rond Utrecht, dag en nacht",
  description:
    "Snel, betrouwbaar taxivervoer in en rond Utrecht. Luchthavenvervoer, zakelijk vervoer en dagelijkse ritten, 24/7 bereikbaar.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-body bg-night text-text`}>
        {children}
      </body>
    </html>
  );
}
