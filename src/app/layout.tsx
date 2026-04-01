import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";

import { ToasterHost } from "@/components/ToasterHost";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Montserrat({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Premiers secours Genève — Success Driving School",
    template: "%s | Premiers secours Genève — Success Driving School",
  },
  description:
    "Cours (premiers secours) à Genève — Success Driving School. Réservation en ligne.",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f43f5e",
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full min-h-dvh flex flex-col overflow-x-clip font-sans">
        <ToasterHost />
        {children}
      </body>
    </html>
  );
}
