import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="antialiased">
      <body>{children}</body>
    </html>
  );
}
