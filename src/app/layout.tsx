import type { Metadata } from "next";
import "./globals.css";
import { WatchlistProvider } from "@/context/WatchlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "CineVerse 4K — Watch Full Movies & Web Series Online",
  description:
    "Stream blockbuster Movies, hit Web Series, TV Shows, Anime, K-Dramas, and Bollywood Originals in Full HD & 4K powered by TMDB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#07080d] text-slate-100 antialiased selection:bg-[#e50914] selection:text-white">
        <WatchlistProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </WatchlistProvider>
      </body>
    </html>
  );
}

