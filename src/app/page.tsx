'use client';

import Button from "@/components/ui/button";
import dynamic from "next/dynamic";
const SupportChatWidget = dynamic(() => import("../components/support-chat-widget"), { ssr: false });
import Card from "@/components/ui/card";
import CardContent from "@/components/ui/card-content";
import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ApiClient } from "./api-client";
import { MapsService } from "@/components/other/google-maps-component";
import DeliveryMap from "@/components/other/delivery-map";
import { useI18n } from "@/i18n/I18nProvider";

const PageTemplate: React.FC = () => {
  const { messages: t } = useI18n();
  const [newsItems, setNewsItems] = useState<[{id?: number; createdAt?: string; imagePath?: string; title?: string; content?: string;}]>([{}]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [weight, setWeight] = useState("");
  const [dims, setDims] = useState("");
  const [transferType, setTransferType] = useState("");
  const [estimate, setEstimate] = useState<null | {
    distanceKm: number;
    volumeLiters: number;
    fillPercent: number;
    costMin: number;
    costMax: number;
    timeHours: number;
    suggestion: string;
  }>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      const response = await ApiClient.get<any>('/article/list?pageSize=2');
      const data = response.data?.data || [];
      setNewsItems(data);
    };
    fetchNews();
    MapsService.init();
  }, []);

  const handleOriginSelect = (address: string) => {
    setFrom(address);
  };
  
  const handleDestinationSelect = (address: string) => {
    setTo(address);
  };

  const cityCoords: Record<string, { lat: number; lon: number }> = {
    "київ": { lat: 50.4501, lon: 30.5234 },
    "kyiv": { lat: 50.4501, lon: 30.5234 },
    "львів": { lat: 49.8397, lon: 24.0297 },
    "lviv": { lat: 49.8397, lon: 24.0297 },
    "харків": { lat: 49.9935, lon: 36.2304 },
    "kharkiv": { lat: 49.9935, lon: 36.2304 },
    "одеса": { lat: 46.4825, lon: 30.7233 },
    "odesa": { lat: 46.4825, lon: 30.7233 },
    "дніпро": { lat: 48.4647, lon: 35.0462 },
    "dnipro": { lat: 48.4647, lon: 35.0462 },
    "чернівці": { lat: 48.2915, lon: 25.9403 },
    "ужгород": { lat: 48.6208, lon: 22.2879 },
  };

  const haversineKm = (a: { lat: number; lon: number }, b: { lat: number; lon: number }) => {
    const R = 6371; // km
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLon = (b.lon - a.lon) * Math.PI / 180;
    const lat1 = a.lat * Math.PI / 180;
    const lat2 = b.lat * Math.PI / 180;
    const sinDLat = Math.sin(dLat / 2);
    const sinDLon = Math.sin(dLon / 2);
    const c = 2 * Math.asin(Math.sqrt(sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon));
    return R * c;
  };

  const parseDims = (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^0-9x*\s]/g, "");
    const parts = cleaned.split(/[x*\s]+/).filter(Boolean).slice(0, 3);
    if (parts.length !== 3) return null;
    const nums = parts.map(p => parseFloat(p));
    if (nums.some(isNaN)) return null;
    return { l: nums[0], w: nums[1], h: nums[2] };
  };

  const estimateDelivery = async () => {
    const fromTrimmed = from.trim();
    const toTrimmed = to.trim();

    const weightKg = parseFloat(weight.replace(',', '.')) || 0;
    const parsedDimensions = parseDims(dims);
    const transferTypeLower = transferType.toLowerCase();

    setIsCalculating(true);

    let distanceKm = 0;

    if (fromTrimmed && toTrimmed) {
      try {
        const result = await MapsService.getDistanceAndTime(fromTrimmed, toTrimmed);
        if (result) {
          distanceKm = result.distance;
        } else {
          distanceKm = haversineKm(cityCoords[fromTrimmed], cityCoords[toTrimmed]);
        }
      } catch (error) {
        console.error("Error fetching distance and time:", error);
      }
    }

    if (!distanceKm && weightKg) distanceKm = 120 + Math.min(380, weightKg * 15);

    let volumeLiters = 0;
    if (parsedDimensions) {
      volumeLiters = (parsedDimensions.l * parsedDimensions.w * parsedDimensions.h) / 1000;
    }

    const trunkCapacityLiters = 450;
    const fillPercent = volumeLiters ? Math.min(100, (volumeLiters / trunkCapacityLiters) * 100) : 0;

    const basePerKm = 0.35;
    const volumeAdj = volumeLiters ? (volumeLiters / 50) * 0.02 : 0;
    const weightAdj = weightKg * 0.15;
    const effectiveRate = basePerKm + volumeAdj + weightAdj;
    
    let coreCost = distanceKm * effectiveRate;
    coreCost += weightKg * 4 + volumeLiters * 0.03;
    
    if (transferTypeLower.includes('точка')) coreCost *= 0.95;
    if (transferTypeLower.includes('особист')) coreCost *= 1.02;

    const costMin = Math.max(25, coreCost * 0.92);
    const costMax = coreCost * 1.08;

    const avgSpeed = 80;
    const timeHoursRaw = distanceKm / avgSpeed + 0.3;
    const timeHours = Math.max(0.5, timeHoursRaw);

    let suggestion = "";
    if (fillPercent > 60) suggestion = "Розгляньте об’єднання з іншим запитом або гнучкішу дату.";
    else if (fillPercent === 0) suggestion = "Додайте габарити для точнішої оцінки.";
    else if (transferTypeLower.includes('точка')) suggestion = "Передача на точці вже знизила вартість.";
    else suggestion = "Спробуйте гнучку дату або точку збору для потенційної економії.";
    
    setEstimate({
      distanceKm: Math.round(distanceKm),
      volumeLiters: Math.round(volumeLiters),
      fillPercent: Math.round(fillPercent),
      costMin: Math.round(costMin),
      costMax: Math.round(costMax),
      timeHours: parseFloat(timeHours.toFixed(1)),
      suggestion,
    });
    setIsCalculating(false);
  };

  const galleryImages = [
    { src: '/3.jpg', alt: t.home.gallery.images[0].alt },
    { src: '/4.jpg', alt: t.home.gallery.images[1].alt },
    { src: '/5.jpg', alt: t.home.gallery.images[2].alt },
    { src: '/6.jpg', alt: t.home.gallery.images[3].alt },
    { src: '/7.jpg', alt: t.home.gallery.images[4].alt },
    { src: '/8.jpg', alt: t.home.gallery.images[5].alt },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="w-full relative h-[500px]">
        <div className="h-[500px] bg-[url('/Rectangle47.png')] z-0 bg-cover bg-[50%_50%] relative top-0 left-0">
          <div className="h-[500px] bg-[#00000099]" />
          <div className="flex flex-col items-center justify-center h-full text-center px-4 absolute top-0 left-0 right-0">
            <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-[22px] mb-4">
              {t.home.hero.tagline}
            </p>
            <h1 className="[font-family:'Bahnschrift-Regular',Helvetica] text-[40px] md:text-7xl max-w-[580px] mb-8">
              {t.home.hero.title}
            </h1>
            <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-[22px] mb-10">
              {t.home.hero.subtitle}
            </p>
            <div className="z-10 flex sm:flex-row flex-col gap-5">
              <Link href={'/delivery/request/list'} className="z-10 button-type-1 w-[242px] h-12 rounded-lg text-2xl flex items-center justify-center">
                {t.home.hero.ctaSend}
              </Link>
              <Link href={'/delivery/trip/list'} className="z-10 button-type-2 w-[242px] h-12 rounded-lg text-2xl flex items-center justify-center">
                {t.home.hero.ctaFind}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="w-full px-8 md:px-20 xl:px-40 py-24 bg-gradient-to-b from-[#18121f] to-[#100d14] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{backgroundImage:"radial-gradient(circle at 20% 30%, #3d2a5a 0, transparent 60%), radial-gradient(circle at 80% 70%, #3d2a5a 0, transparent 55%)"}} />
        <div className="relative">
          <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-4xl md:text-5xl text-center mb-10 md:mb-16">
            {t.home.how.title}
          </h2>
          <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-lg max-w-4xl mx-auto text-center mb-20">
            {t.home.how.description}
          </p>
          <ol className="grid gap-16 md:gap-10 md:grid-cols-3">
            {t.home.how.steps.map((step, index) => (
              <li key={index} className="flex flex-col items-center text-center group">
                <div className="relative w-28 h-28 mb-8">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#c84cd8] to-[#7f51b3] opacity-20 blur-lg group-hover:opacity-30 transition-opacity" />
                  <div className="relative w-full h-full rounded-full border-4 border-[#e4e4e4]/80 group-hover:border-[#c84cd8] bg-[#241c2d] flex items-center justify-center shadow-inner transition-colors">
                    <span className="[font-family:'Bahnschrift-Regular',Helvetica] text-5xl select-none">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <Card className="w-full max-w-[360px] aspect-[10/11] bg-[#2a2332] rounded-2xl mb-8 overflow-hidden border border-[#3d2a5a] group-hover:border-[#c84cd8]/70 transition-colors">
                  <CardContent
                    source={`/how-step-${index + 1}.svg`}
                    className="object-cover w-full h-full"
                  />
                </Card>
                <h3 className="[font-family:'Bahnschrift-Regular',Helvetica] text-2xl mb-3">
                  {step.title}
                </h3>
                <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-base md:text-lg leading-relaxed">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Ecological delivery section */}
      <section className="w-full px-8 md:px-20 xl:px-40 py-24 bg-darker mx-auto ">
        <h2 className="w-full [font-family:'Bahnschrift-Regular',Helvetica] text-[40px] mb-4">
          {t.home.eco.title}
        </h2>
        <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl mb-8">
          {t.home.eco.paragraph}
        </p>
        <h3 className="[font-family:'Bahnschrift-Regular',Helvetica] text-[40px] mb-4">
          {t.home.eco.howTitle}
        </h3>
        <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl mb-8">
          {t.home.eco.howParagraph}
        </p>
        <Card className="h-[200px] bg-[#d9d9d9] rounded-xl items-center justify-center mb-8 relative">
          <p className="absolute inset-0 flex pl-4 pt-4 font-subtitle-1 text-center">
            {t.home.eco.fastDelivery}
          </p>
          <Link href={"/"}>
            <Image
              src="/Fast.png"
              alt="Ecological Delivery"
              width={600}
              height={200}
              className="object-cover w-full h-full rounded-xl h-full"
            />
          </Link>
        </Card>
      </section>

      {/* Mission section */}
      <section className="w-full px-8 md:px-20 xl:px-40 py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{backgroundImage:"radial-gradient(circle at 10% 20%, #3d2a5a 0, transparent 55%), radial-gradient(circle at 90% 80%, #3d2a5a 0, transparent 55%)"}} />
        <div className="relative text-center">
          <h3 className="[font-family:'Bahnschrift-Regular',Helvetica] fg-secondary text-[34px] mb-5 tracking-wide uppercase">
            {t.home.mission.sectionTitle}
          </h3>
          <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-[40px] md:text-7xl leading-[1.05] max-w-[920px] mx-auto mb-14">
            {t.home.mission.title}
          </h2>
          <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl max-w-[900px] mx-auto mb-12 leading-relaxed">
            {t.home.mission.paragraph}
          </p>
          <div className="grid md:grid-cols-3 gap-10 mb-14 text-left">
            <div className="bg-[#2a2332] rounded-2xl border border-[#3d2a5a] p-6">
              <h4 className="[font-family:'Bahnschrift-Regular',Helvetica] text-2xl mb-3">{t.home.mission.cards.transparency.title}</h4>
              <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-base leading-relaxed">{t.home.mission.cards.transparency.text}</p>
            </div>
            <div className="bg-[#2a2332] rounded-2xl border border-[#3d2a5a] p-6">
              <h4 className="[font-family:'Bahnschrift-Regular',Helvetica] text-2xl mb-3">{t.home.mission.cards.economy.title}</h4>
              <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-base leading-relaxed">{t.home.mission.cards.economy.text}</p>
            </div>
            <div className="bg-[#2a2332] rounded-2xl border border-[#3d2a5a] p-6">
              <h4 className="[font-family:'Bahnschrift-Regular',Helvetica] text-2xl mb-3">{t.home.mission.cards.ecology.title}</h4>
              <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-base leading-relaxed">{t.home.mission.cards.ecology.text}</p>
            </div>
          </div>
          <a href="/about">
            <Button
              className="h-[60px] w-[220px] button-type-1 rounded-xl [font-family:'Inter-Regular',Helvetica] text-[24px]"
              onClick={() => {}}
              text={t.home.mission.aboutButton}
            />
          </a>
        </div>
      </section>

      {/* Gallery section */}
      <section className="w-full py-20 bg-darker relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-25" style={{backgroundImage:"radial-gradient(circle at 18% 35%, #3d2a5a 0, transparent 60%), radial-gradient(circle at 82% 65%, #3d2a5a 0, transparent 55%)"}} />
        <div className="relative max-w-[1500px] mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-4xl md:text-5xl">{t.home.gallery.title}</h2>
            <p className="md:max-w-md [font-family:'Inter-Regular',Helvetica] fg-secondary text-sm md:text-base leading-relaxed">
              {t.home.gallery.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
            {galleryImages.map((img, i) => (
              <div key={i} className="group relative aspect-square rounded-xl overflow-hidden border border-[#3d2a5a]/50 bg-[#241c2d]">
                <Card className="absolute inset-0 rounded-xl border-0 bg-transparent">
                  <CardContent
                    source={img.src}
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-500 ease-out"
                  />
                </Card>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                <span className="absolute inset-x-2 bottom-2 [font-family:'Inter-Regular',Helvetica] text-[10px] md:text-xs tracking-wide text-[#e4e4e4] opacity-0 group-hover:opacity-100 transition-opacity">
                  {i+1}. {img.alt}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earn with us section */}
      <section className="w-full px-8 md:px-20 xl:px-40 py-24">
        <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-[40px] md:text-7xl lg:text-7xl mb-4">
          {t.home.earn.title}
        </h2>
        <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl max-w-[1020px] mb-16">
          {t.home.earn.subtitle}
        </p>
          <div className="flex flex-col lg:flex-row md:gap-20">
            <div className="flex-1 flex flex-col gap-10 md:gap-20">
              <Card className=" w-full  bg-[#d9d9d9] rounded-xl">
                <CardContent source="/EarnImage1.png" className="flex items-center justify-center h-full w-full rounded-xl object-cover"/>
              </Card>
              <div className="flex flex-col justify-center">
                <h3 className="[font-family:'Bahnschrift-Regular',Helvetica] text-[40px] mb-4">
                  {t.home.earn.driver.title}
                </h3>
                <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl max-w-[758px] mb-8">
                  {t.home.earn.driver.subtitle}
                </p>
                <Link href='/help/driver' className="h-[76px] w-full lg:w-[320px] bg-[#d9d9d9] mb-8 lg:mb-10 rounded-xl md:place-self-center button-type-1 flex items-center justify-center text-[24px] [font-family:'Inter-Regular',Helvetica]">
                  {t.home.earn.driver.button}
                </Link>
              </div>
            </div>
            <div className="h w-[1px] bg-white/20 rounded-sm"></div>
            <div className="flex-1 flex flex-col gap-10 md:gap-20">
              <Card className="flex md:hidden w-full bg-[#d9d9d9] rounded-xl ">
                <CardContent source="/EarnImage2.png" className="flex items-center justify-center h-full w-full rounded-xl object-cover"/>
              </Card>
              <div className="flex flex-col justify-center ">
                <h3 className="[font-family:'Bahnschrift-Regular',Helvetica] text-[40px] mb-4">
                  {t.home.earn.sender.title}
                </h3>
                <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl max-w-[760px] mb-8">
                  {t.home.earn.sender.subtitle}
                </p>
                <Link href='/help/sender' className="h-[76px] w-full lg:w-[320px] bg-[#d9d9d9] mb-8 lg:mb-10 rounded-xl md:place-self-center button-type-1 flex items-center justify-center text-[24px] [font-family:'Inter-Regular',Helvetica]">
                  {t.home.earn.sender.button}
                </Link>
                <Card className="flex hidden md:block w-full bg-[#d9d9d9] rounded-xl ">
                  <CardContent source="/EarnImage2.png" className="flex items-center justify-center h-full w-full rounded-xl object-cover"/>
                </Card>
              </div>
            </div>
          </div>
        </section>        {/* Calculate delivery section */}
        <section id="calculate-delivery" className="w-full px-8 md:px-20 xl:px-40 py-24 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-30" style={{backgroundImage:"radial-gradient(circle at 14% 22%, #3d2a5a 0, transparent 55%), radial-gradient(circle at 88% 78%, #3d2a5a 0, transparent 55%)"}} />
          <div className="relative text-center">
            <h3 className="[font-family:'Bahnschrift-Regular',Helvetica] fg-secondary text-[30px] md:text-[34px] mb-5 tracking-wide uppercase">
              {t.home.calculate.sectionTitle}
            </h3>
            <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-[40px] md:text-7xl leading-[1.05] max-w-[980px] mx-auto mb-10">
              {t.home.calculate.title}
            </h2>
            <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl max-w-[900px] mx-auto mb-14 leading-relaxed">
              {t.home.calculate.subtitle}
            </p>
            <div className="grid md:grid-cols-3 gap-8 mb-16 text-left">
              <div className="bg-[#2a2332] rounded-2xl border border-[#3d2a5a] p-6">
                <h4 className="[font-family:'Bahnschrift-Regular',Helvetica] text-2xl mb-3">{t.home.calculate.cards.route.title}</h4>
                <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-base leading-relaxed">{t.home.calculate.cards.route.text}</p>
              </div>
              <div className="bg-[#2a2332] rounded-2xl border border-[#3d2a5a] p-6">
                <h4 className="[font-family:'Bahnschrift-Regular',Helvetica] text-2xl mb-3">{t.home.calculate.cards.volume.title}</h4>
                <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-base leading-relaxed">{t.home.calculate.cards.volume.text}</p>
              </div>
              <div className="bg-[#2a2332] rounded-2xl border border-[#3d2a5a] p-6">
                <h4 className="[font-family:'Bahnschrift-Regular',Helvetica] text-2xl mb-3">{t.home.calculate.cards.optimization.title}</h4>
                <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-base leading-relaxed">{t.home.calculate.cards.optimization.text}</p>
              </div>
            </div>
            <div className="w-full mx-auto bg-[#2a2332] border border-[#3d2a5a] rounded-3xl p-10 md:p-14 text-left flex flex-col gap-10 mb-20">
              <h4 className="[font-family:'Bahnschrift-Regular',Helvetica] text-2xl ">{t.home.calculate.mapTitle}</h4>
              <DeliveryMap 
                origin={from} 
                destination={to} 
                className="h-[600px] w-full"
                onOriginSelect={handleOriginSelect}
                onDestinationSelect={handleDestinationSelect}
              />
            </div>
            <div className="w-full mx-auto bg-[#2a2332] border border-[#3d2a5a] rounded-3xl p-10 md:p-14 text-left flex flex-col gap-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="flex flex-col gap-5">
                  <h4 className="[font-family:'Bahnschrift-Regular',Helvetica] text-2xl">{t.home.calculate.inputs.title}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm fg-secondary">{t.home.calculate.inputs.weight}</label>
                      <input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder={t.home.calculate.inputs.weightPlaceholder} className="h-12 rounded-lg bg-[#241c2d] border border-[#3d2a5a] px-4 text-sm text-[#e4e4e4] focus:outline-none focus:border-[#c84cd8] placeholder:opacity-50" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm fg-secondary">{t.home.calculate.inputs.dims}</label>
                      <input value={dims} onChange={(e) => setDims(e.target.value)} placeholder={t.home.calculate.inputs.dimsPlaceholder} className="h-12 rounded-lg bg-[#241c2d] border border-[#3d2a5a] px-4 text-sm text-[#e4e4e4] focus:outline-none focus:border-[#c84cd8] placeholder:opacity-50" />
                    </div>
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <label className="text-sm fg-secondary">{t.home.calculate.inputs.transferType}</label>
                      <input value={transferType} onChange={(e) => setTransferType(e.target.value)} placeholder={t.home.calculate.inputs.transferTypePlaceholder} className="h-12 rounded-lg bg-[#241c2d] border border-[#3d2a5a] px-4 text-sm text-[#e4e4e4] focus:outline-none focus:border-[#c84cd8] placeholder:opacity-50" />
                    </div>
                  </div>
                  <Button className="h-[60px] w-[220px] button-type-1 rounded-xl mt-2" onClick={estimateDelivery} text={t.home.calculate.inputs.button} />
                </div>
                <div className="flex flex-col gap-6">
                  <h4 className="[font-family:'Bahnschrift-Regular',Helvetica] text-2xl">{t.home.calculate.estimate.title}</h4>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between bg-[#241c2d] border border-[#3d2a5a] rounded-xl px-5 py-4">
                      <span className="text-sm fg-secondary">{t.home.calculate.estimate.distance}</span>
                      <span className="text-base [font-family:'Bahnschrift-Regular',Helvetica]">{estimate ? `~ ${estimate.distanceKm} км` : '--'}</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#241c2d] border border-[#3d2a5a] rounded-xl px-5 py-4">
                      <span className="text-sm fg-secondary">{t.home.calculate.estimate.fill}</span>
                      <span className="text-base [font-family:'Bahnschrift-Regular',Helvetica]">{estimate ? `${estimate.fillPercent}%` : '--'}</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#241c2d] border border-[#3d2a5a] rounded-xl px-5 py-4">
                      <span className="text-sm fg-secondary">{t.home.calculate.estimate.cost}</span>
                      <span className="text-base [font-family:'Bahnschrift-Regular',Helvetica] text-[#c84cd8]">{estimate ? `${estimate.costMin}–${estimate.costMax} ₴` : '--'}</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#241c2d] border border-[#3d2a5a] rounded-xl px-5 py-4">
                      <span className="text-sm fg-secondary">{t.home.calculate.estimate.time}</span>
                      <span className="text-base [font-family:'Bahnschrift-Regular',Helvetica]">{estimate ? `~ ${estimate.timeHours} год` : '--'}</span>
                    </div>
                  </div>
                  <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-sm leading-relaxed">
                    {estimate ? estimate.suggestion : t.home.calculate.estimate.suggestionDefault}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* News section */}
        <section className="px-8 md:px-20 xl:px-40 py-16">
          <div className="flex justify-between items-center mb-4">
            <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-[40px] md:lg:text-7xl">
              {t.home.news.title}
            </h2>
          </div>
          <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl max-w-[1020px] mb-8">
            {t.home.news.subtitle}
          </p>
          <Button className="h-[70px] w-full md:w-60 button-type-1 rounded-xl mb-8">
            <Link href={'/news'} className="w-full h-full flex items-center justify-center">{t.home.news.button}</Link>
          </Button>
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
            {newsItems.map((item, index) => (
              <div
                key={index}
                className="flex-1 md:lg:w-[760px] md:lg:h-[350px] bg-[#231d2d] rounded-xl flex flex-col lg:flex-row border border-[#3d2a5a] hover:border-[#c84cd8]/70 transition-colors"
              >
                <Image
                  src={(process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + item.imagePath || '/dummy.png'}
                  alt={item.title || 'No title'}
                  width={370}
                  height={350}
                  className="w-full rounded-lg object-cover"
                />
                <div className=" p-4 flex flex-col ">
                  <div className="flex sm:flex-col justify-between items-center">
                    <span className="[font-family:'Inter-Regular',Helvetica] text-base">
                      {t.home.news.newsTag}
                    </span>
                    <span className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xs">
                      {item.createdAt}
                    </span>
                  </div>
                  <h3 className="flex h-[30px] [font-family:'Bahnschrift-Regular',Helvetica] text-[26px] my-2 overflow-hidden w-full ">
                    {item.title}
                  </h3>
                  <p className="flex-1 flex [font-family:'Inter-Regular',Helvetica] fg-secondary text-base overflow-hidden my-2">
                    {item.content}
                  </p>
                  <Link href={`/article/?id=${item.id}`}
                    className="flex [font-family:'Inter-Regular',Helvetica] text-[#94569f] text-base underline bottom-5 h-[10%]">
                      {t.home.news.viewMore}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      <SupportChatWidget />
    </main>
  );
}

export default PageTemplate;

