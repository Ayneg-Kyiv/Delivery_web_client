import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Suspense } from "react";
import CookieBanner from "@/components/cookie-banner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cargix",
  description: "Відправляй вантажі з легкістю",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="scroll-smooth w-screen">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased md:min-h-screen max-w-screen flex flex-col`}>
        <AuthProvider>
            <Suspense fallback={<div className="flex items-center justify-center md:h-screen">Loading...</div>}>
              <Navbar />
              <main className="flex-1 md:mt-[2px] flex flex-col md:min-h-[900px] sm:w-full md:w-full lg:w-full">
                {children}
                <CookieBanner />
              </main>
            </Suspense>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
