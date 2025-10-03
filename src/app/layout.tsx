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
import SupportChatClient from "@/components/support-chat-client";
import Script from "next/script";

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
        {/* Strip known extension-injected attributes before hydration to avoid SSR/client mismatches */}
        <Script id="strip-injected-attrs" strategy="beforeInteractive">
          {`
          (function(){
            var ATTRS=['fdprocessedid'];
            function strip(node){
              if (!node || node.nodeType!==1) return;
              for (var i=0;i<ATTRS.length;i++){
                var a=ATTRS[i];
                if (node.hasAttribute && node.hasAttribute(a)) try{ node.removeAttribute(a); }catch(e){}
              }
              if (node.querySelectorAll){
                for (var j=0;j<ATTRS.length;j++){
                  var aa=ATTRS[j];
                  var list=node.querySelectorAll('['+aa+']');
                  for (var k=0;k<list.length;k++){
                    try{ list[k].removeAttribute(aa); }catch(e){}
                  }
                }
              }
            }
            strip(document);
            try{
              var obs=new MutationObserver(function(muts){
                for (var i=0;i<muts.length;i++){
                  var m=muts[i];
                  if (m.type==='attributes' && ATTRS.indexOf(m.attributeName)>-1){
                    try{ m.target.removeAttribute(m.attributeName); }catch(e){}
                  } else if (m.type==='childList' && m.addedNodes){
                    for (var n=0;n<m.addedNodes.length;n++) strip(m.addedNodes[n]);
                  }
                }
              });
              obs.observe(document.documentElement,{subtree:true, childList:true, attributes:true, attributeFilter: ATTRS});
              setTimeout(function(){ try{ obs.disconnect(); }catch(e){} }, 3000);
            }catch(e){}
          })();
          `}
        </Script>
        <I18nProvider initialLocale={locale}>
          <AuthProvider>
              <Suspense fallback={<div className="flex items-center justify-center md:h-screen">Loading...</div>}>
                <Navbar />
                <main className="flex-1 md:mt-[2px] flex flex-col md:min-h-[900px] sm:w-full md:w-full lg:w-full">
                  {children}
                  <CookieBanner />
                </main>
                <SupportChatClient />
                <Footer />
              </Suspense>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
