import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ssi-tn.com"),
  title: {
    default: "SSI — Sociétés Sécurités et Solutions Informatiques",
    template: "%s — SSI",
  },
  description:
    "Cybersécurité et solutions informatiques pour entreprises tunisiennes. Audit, conseil, infogérance.",
  openGraph: {
    type: "website",
    locale: "fr_TN",
    siteName: "SSI",
    title: "SSI — Sociétés Sécurités et Solutions Informatiques",
    description:
      "Cybersécurité et solutions informatiques pour entreprises tunisiennes.",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}
