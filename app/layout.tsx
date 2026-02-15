import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReduxProvider from "@/lib/redux/ReduxProvider";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "NextHome | Discover Your Dream Home",
  description: "Beyond listings. Find the place where your story begins with NextHome's premium real estate experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-background text-text-main antialiased selection:bg-secondary/10 selection:text-secondary`}>
        <ReduxProvider>
          <Suspense fallback={<div className="h-16 flex items-center justify-center bg-white/50 backdrop-blur-md sticky top-0 z-50 animate-pulse" />}>
            <Header />
          </Suspense>
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
