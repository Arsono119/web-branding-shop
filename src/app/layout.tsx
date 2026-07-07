import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getBrand } from "@/lib/data";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateMetadata(): Metadata {
  const brand = getBrand();
  return {
    title: brand.seo.title || `${brand.name} - Brand Lokal Premium`,
    description: brand.seo.description || `Brand lokal premium dengan desain minimalis modern.`,
    openGraph: {
      title: brand.seo.title,
      description: brand.seo.description,
      images: brand.seo.ogImage ? [brand.seo.ogImage] : [],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
