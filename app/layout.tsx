import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "NÍTIDO | El Mercado Dinámico de República Dominicana",
  description: "Encuentra y vende lo que necesites en NÍTIDO. La plataforma más rápida, moderna y segura para anuncios clasificados en la República Dominicana.",
  openGraph: {
    title: "NÍTIDO | El Mercado Dinámico",
    description: "Compra y vende carros, inmuebles, tecnología y más.",
    type: "website",
    locale: "es_DO",
    images: ["/og-image.jpg"], // Placeholder image path
  },
  twitter: {
    card: "summary_large_image",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
