import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

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
  title: "Artisan Coffee Co. | Premium Handcrafted Coffee & Roastery",
  description: "Experience the art of coffee. Handcrafted with precision, served with passion. Single-origin beans, roasted in-house, brewed to perfection in Melbourne.",
  keywords: ["artisan coffee", "specialty coffee", "coffee roastery", "handcrafted coffee", "melbourne coffee", "single origin beans"],
  authors: [{ name: "Artisan Coffee Co." }],
  creator: "Artisan Coffee Co.",
  publisher: "Artisan Coffee Co.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://artisan-coffee.example.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Artisan Coffee Co. | Premium Handcrafted Coffee",
    description: "Experience the art of coffee. Handcrafted with precision, served with passion.",
    url: "https://artisan-coffee.example.com",
    siteName: "Artisan Coffee Co.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Artisan Coffee Co. - Premium Coffee Experience",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artisan Coffee Co. | Premium Handcrafted Coffee",
    description: "Experience the art of coffee. Handcrafted with precision, served with passion.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`relative ${inter.variable} ${cinzel.variable} ${cormorant.variable} antialiased`}>
      <body className="font-sans">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
