import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import I18nProvider from "@/i18n/I18nProvider";
import "./globals.css";
import { AuthProvider } from "./provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Suspense } from "react";
import SupportChatClient from "@/components/support-chat-client";

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
  const locale = cookies().get('locale')?.value === 'en' ? 'en' : 'uk';

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <I18nProvider initialLocale={locale}>
          <AuthProvider>
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <Navbar />
                    <main className="flex-1 mt-[2px] flex flex-col min-h-[900px] sm:w-full md:w-full lg:w-full">
                {children}
                      <SupportChatClient />
              </main>
            </Suspense>
          </AuthProvider>
        </I18nProvider>
        <Footer />
      </body>
    </html>
  );
}
