import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Suspense } from "react";
import CookieBanner from "@/components/cookie-banner";
import I18nProvider from "@/i18n/I18nProvider";
import { cookies } from "next/headers";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = (cookieStore?.get('locale')?.value === 'en') ? 'en' : 'uk';
  return (
    <html lang={locale} className="scroll-smooth w-screen">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased md:min-h-screen max-w-screen flex flex-col`}>
        <I18nProvider initialLocale={locale}>
          <AuthProvider>
              <Suspense fallback={<div className="flex items-center justify-center md:h-screen">Loading...</div>}>
                <Navbar />
                <main className="flex-1 md:mt-[2px] flex flex-col md:min-h-[900px] sm:w-full md:w-full lg:w-full">
                  {children}
                  <CookieBanner />
                </main>
                <Footer />
              </Suspense>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
