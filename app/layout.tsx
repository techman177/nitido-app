import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

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
  keywords: ["clasificados", "dominicana", "ventas", "compras", "carros", "inmuebles", "elite", "nítido"],
  openGraph: {
    title: "NÍTIDO | El Mercado Dinámico",
    description: "Compra y vende carros, inmuebles, tecnología y más con un toque de élite.",
    url: "https://nitido.do",
    siteName: "NÍTIDO",
    type: "website",
    locale: "es_DO",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "NÍTIDO Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NÍTIDO | Premium Marketplace",
    description: "La vitrina más exclusiva de RD.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-24 md:pb-0 selection:bg-[#B49248] selection:text-black">
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#0a0a0b',
              color: '#fff',
              border: '1px solid rgba(180, 146, 72, 0.2)',
              borderRadius: '1rem',
              fontSize: '14px',
              fontFamily: 'inherit',
            },
            success: {
              iconTheme: {
                primary: '#B49248',
                secondary: '#fff',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
