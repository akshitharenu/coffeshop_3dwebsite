import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Artisan Coffee Co. | Premium Handcrafted Coffee",
  description: "Experience the art of coffee. Handcrafted with precision, served with passion. Single-origin beans, roasted in-house, brewed to perfection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`relative ${inter.variable} ${cinzel.variable} ${cormorant.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
