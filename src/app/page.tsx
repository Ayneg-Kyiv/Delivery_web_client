'use client';

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import CardContent from "@/components/ui/card-content";
import React, { Component, ChangeEvent } from "react";
import { ArrowLeft, ArrowRight} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ImageOptimizerCache } from "next/dist/server/image-optimizer";

class PageTemplate extends Component {
  state: {
    from: string;
    to: string;
    weight: string; // kg
    dims: string; // LxWxH cm
    transferType: string;
    estimate: null | {
      distanceKm: number;
      volumeLiters: number;
      fillPercent: number;
      costMin: number;
      costMax: number;
      timeHours: number;
      suggestion: string;
    };
  } = {
    from: "",
    to: "",
    weight: "",
    dims: "",
    transferType: "",
    estimate: null,
  };

  cityCoords: Record<string, { lat: number; lon: number }> = {
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

  haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
    const R = 6371; // km
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLon = (b.lon - a.lon) * Math.PI / 180;
    const lat1 = a.lat * Math.PI / 180;
    const lat2 = b.lat * Math.PI / 180;
    const sinDLat = Math.sin(dLat / 2);
    const sinDLon = Math.sin(dLon / 2);
    const c = 2 * Math.asin(Math.sqrt(sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon));
    return R * c;
  }

  parseDims(value: string) {
    // Accept formats: "60x40x30", "60 40 30", "60*40*30"
    const cleaned = value.toLowerCase().replace(/[^0-9x*\s]/g, "");
    const parts = cleaned.split(/[x*\s]+/).filter(Boolean).slice(0, 3);
    if (parts.length !== 3) return null;
    const nums = parts.map(p => parseFloat(p));
    if (nums.some(isNaN)) return null;
    return { l: nums[0], w: nums[1], h: nums[2] };
  }

  estimateDelivery = () => {
    const from = this.state.from.trim().toLowerCase();
    const to = this.state.to.trim().toLowerCase();
    const weightKg = parseFloat(this.state.weight.replace(',', '.')) || 0;
    const dims = this.parseDims(this.state.dims);
    const transferType = this.state.transferType.toLowerCase();

    let distanceKm = 0;
    if (from && to && this.cityCoords[from] && this.cityCoords[to]) {
      distanceKm = this.haversineKm(this.cityCoords[from], this.cityCoords[to]);
      // Add 8% detour factor
      distanceKm *= 1.08;
    }

    // If unknown distance fallback heuristic using weight (very rough)
    if (!distanceKm && weightKg) distanceKm = 120 + Math.min(380, weightKg * 15);

    // Volume in liters
    let volumeLiters = 0;
    if (dims) {
      volumeLiters = (dims.l * dims.w * dims.h) / 1000; // cm^3 to liters
    }

    const trunkCapacityLiters = 450; // typical sedan
    const fillPercent = volumeLiters ? Math.min(100, (volumeLiters / trunkCapacityLiters) * 100) : 0;

    const basePerKm = 0.55; // грн / км
    const volumeAdj = volumeLiters ? (volumeLiters / 50) * 0.02 : 0; // small uplift
    const weightAdj = weightKg * 0.15; // per kg uplift to base per km equivalent
    const effectiveRate = basePerKm + volumeAdj + weightAdj;
    let coreCost = distanceKm * effectiveRate;
    // Add handling cost based on weight & volume
    coreCost += weightKg * 4 + volumeLiters * 0.03;
    // Transfer type adjustments
    if (transferType.includes('точка')) coreCost *= 0.95; // drop-off discount
    if (transferType.includes('особист')) coreCost *= 1.02; // personal handover slight premium

    // Produce range ±8%
    const costMin = Math.max(25, coreCost * 0.92);
    const costMax = coreCost * 1.08;

    const avgSpeed = 80; // km/h
    const timeHoursRaw = distanceKm / avgSpeed + 0.3; // add handling buffer
    const timeHours = Math.max(0.5, timeHoursRaw);

    let suggestion = "";
    if (fillPercent > 60) suggestion = "Розгляньте об’єднання з іншим запитом або гнучкішу дату.";
    else if (fillPercent === 0) suggestion = "Додайте габарити для точнішої оцінки.";
    else if (transferType.includes('точка')) suggestion = "Передача на точці вже знизила вартість.";
    else suggestion = "Спробуйте гнучку дату або точку збору для потенційної економії.";

    this.setState({
      estimate: {
        distanceKm: Math.round(distanceKm),
        volumeLiters: Math.round(volumeLiters),
        fillPercent: Math.round(fillPercent),
        costMin: Math.round(costMin),
        costMax: Math.round(costMax),
        timeHours: parseFloat(timeHours.toFixed(1)),
        suggestion,
      },
    });
  };

  handleInput = (field: keyof PageTemplate['state']) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    this.setState({ [field]: e.target.value } as any);
  };
  
  heroData = {
    tagline: "Доставка від людей для людей",
    title: "Відправляй куди та як завгодно",
    subtitle: "Cargix - робе це можливим",
    buttons: [
      { text: "Відправити зараз", onclick: () => console.log("Send Now clicked!"), 
        className: "button-type-1 w-[242px] h-12 rounded-lg text-2xl" },
      { text: "Знайти попутника", onclick: () => console.log("Find Companion clicked!"), 
        className: "button-type-2 w-[242px] h-12 rounded-lg text-2xl" },
    ],
  };

  howItWorksSteps = [
    {
      number: "1",
  title: "Створіть запит",
  description: "Опишіть посилку (тип, вага, орієнтовні габарити), вкажіть маршрут та бажану дату. Додайте фото — так водії швидше відгукнуться.",
  image: "/how-step-1.svg",
    },
    {
      number: "2",
  title: "Обирайте перевізника",
  description: "Перегляньте профілі водіїв, їх рейтинг, попередні відгуки та запропоновану ціну. Уточніть деталі в чаті перед підтвердженням.",
  image: "/how-step-2.svg",
    },
    {
      number: "3",
  title: "Передача і доставка",
  description: "Зустріньтеся у погодженому місці або передайте на точці збору. Слідкуйте за статусом. Після отримання — залиште відгук та оцінку.",
  image: "/how-step-3.svg",
    },
  ];

  newsItems = [
    {
      id: 1,
      createdAt: "01/01/2025",
      imagePath: "/dummy.png",
      title: "Lorem ipsum dolor sit amet, consectetur....",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque volutpat efficitur rutrum. Aenean finibus nulla a est vestibulum suscipit. Integer sodales laoreet nunc, at convallis nisi fringilla sit amet...",
    },
    {
      id: 2,
      createdAt: "01/01/2025",
      imagePath: "/dummy.png",
      title: "Lorem ipsum dolor sit amet, consectetur....",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque volutpat efficitur rutrum. Aenean finibus nulla a est vestibulum suscipit. Integer sodales laoreet nunc, at convallis nisi fringilla sit amet...",
    },
  ];

  fetchLastNews = async () => {
    const response = await fetch("/api/article?pageSize=2");
    const data = await response.json();
    this.setState({ newsItems: data.data });
  };

  galleryImages = [
  { src: '/3.jpg', alt: 'Передача посилки' },
  { src: '/4.jpg', alt: 'Водій у дорозі' },
  { src: '/5.jpg', alt: 'Компактне пакування' },
  { src: '/6.jpg', alt: 'Амортизація шляху' },
  { src: '/7.jpg', alt: 'Маршрут на мапі' },
  { src: '/8.jpg', alt: 'Отримання відправлення' },
  ];

  render() {
    return (
      <main>
        {/* Hero Section */}
        <section className="w-full relative h-[500px]">
          <div className="h-[500px] bg-[url('/Rectangle47.png')] z-[-1] bg-cover bg-[50%_50%] relative top-0 left-0">
            <div className="h-[500px] bg-[#00000099]" />

            <div className="flex flex-col items-center justify-center h-full text-center px-4 absolute top-0 left-0 right-0">
              <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-[22px] mb-4">
                {this.heroData.tagline}
              </p>

              <h1 className="[font-family:'Bahnschrift-Regular',Helvetica] text-7xl max-w-[580px] mb-8">
                {this.heroData.title}
              </h1>

              <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-[22px] mb-10">
                {this.heroData.subtitle}
              </p>

              <div className="flex gap-5">
                {this.heroData.buttons.map((button, index) => (
                  <Button
                    onClick={button.onclick}
                    text={button.text}
                    className={button.className}
                    key={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How it works section */}
        <section className="w-full mt-24 px-8 md:px-20 xl:px-40 py-24 bg-gradient-to-b from-[#18121f] to-[#100d14] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-30" style={{backgroundImage:"radial-gradient(circle at 20% 30%, #3d2a5a 0, transparent 60%), radial-gradient(circle at 80% 70%, #3d2a5a 0, transparent 55%)"}} />
          <div className="relative">
            <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-4xl md:text-5xl text-center mb-10 md:mb-16">
              Як це працює?
            </h2>
            <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-lg max-w-4xl mx-auto text-center mb-20">
              Весь процес займає лічені хвилини. Ми допомагаємо знайти перевізника, який уже рухається вашим маршрутом — ви економите кошти і час, а транспорт використовується ефективніше.
            </p>

            <ol className="grid gap-16 md:gap-10 md:grid-cols-3">
              {this.howItWorksSteps.map((step, index) => (
                <li key={index} className="flex flex-col items-center text-center group">
                  <div className="relative w-28 h-28 mb-8">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#c84cd8] to-[#7f51b3] opacity-20 blur-lg group-hover:opacity-30 transition-opacity" />
                    <div className="relative w-full h-full rounded-full border-4 border-[#e4e4e4]/80 group-hover:border-[#c84cd8] bg-[#241c2d] flex items-center justify-center shadow-inner transition-colors">
                      <span className="[font-family:'Bahnschrift-Regular',Helvetica] text-5xl select-none">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  <Card className="w-full max-w-[360px] aspect-[10/11] bg-[#2a2332] rounded-2xl mb-8 overflow-hidden border border-[#3d2a5a] group-hover:border-[#c84cd8]/70 transition-colors">
                    <CardContent
                      source={step.image}
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
        <section className="w-full h-[1080px] bg-darker px-[450px] py-[159px]">
          <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-7xl mb-10">
            Робимо доставку екологічною та швидкою
          </h2>

          <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl mb-16">
              Наш сервіс об’єднує тих, хто хоче відправити речі,
              і водіїв, які вже прямують у потрібному напрямку. 
              Використовуючи вільне місце в багажнику,
              ми знижуємо кількість порожніх кілометрів, 
              економимо ваш час і гроші та зменшуємо викиди CO₂.
          </p>

          <h3 className="[font-family:'Bahnschrift-Regular',Helvetica] text-[40px] mb-4">
            Як це працює?
          </h3>

          <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl mb-8">
            Ви залишаєте заявку з деталями відправлення, 
            ми підбираємо найближчого попутного водія, 
            який бере вашу посилку в дорогу. 
            {/* Слідкуйте за маршрутом у реальному часі,  */}
            спілкуйтеся з водієм через чат і залишайте відгук після успішної доставки.
          </p>

          <Card className="w-full h-[200px] bg-[#d9d9d9] rounded-xl mb-8">
            <Button
              onClick={() => console.log("Learn more clicked!")}
              text="Illustration + Button"
              className="flex items-center justify-center h-full text-5xl text-center"
            />
          </Card>

          <div className="flex justify-between items-center">
            <Button onClick={() => console.log("Previous clicked!")} className="p-0"
              text="">
              <ArrowLeft className="w-10 h-10" />
            </Button>
            <Button onClick={() => console.log("Next clicked!")} className="p-0"
              text="">
              <ArrowRight className="w-10 h-10" />
            </Button>
          </div>

        </section>

        {/* Mission section (rewritten) */}
        <section className="w-full px-[190px] py-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-30" style={{backgroundImage:"radial-gradient(circle at 10% 20%, #3d2a5a 0, transparent 55%), radial-gradient(circle at 90% 80%, #3d2a5a 0, transparent 55%)"}} />
          <div className="relative text-center">
            <h3 className="[font-family:'Bahnschrift-Regular',Helvetica] fg-secondary text-[34px] mb-5 tracking-wide uppercase">
              Наша місія
            </h3>

            <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-6xl md:text-7xl leading-[1.05] max-w-[920px] mx-auto mb-14">
              Робимо доставку людяною, доступною та<br className="hidden md:block"/> екологічно відповідальною
            </h2>

            <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl max-w-[900px] mx-auto mb-12 leading-relaxed">
              Ми поєднуємо людей, чий шлях уже прокладений, з тими, кому треба щось відправити. Так зменшуємо порожні кілометри,
              скорочуємо витрати та час очікування. Кожна поїздка стає кориснішою: для відправника, перевізника та планети.
              Прозорість, довіра й взаємна вигода — фундамент нашої платформи.
            </p>

            <div className="grid md:grid-cols-3 gap-10 mb-14 text-left">
              <div className="bg-[#2a2332] rounded-2xl border border-[#3d2a5a] p-6">
                <h4 className="[font-family:'Bahnschrift-Regular',Helvetica] text-2xl mb-3">Прозорість</h4>
                <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-base leading-relaxed">Профілі з рейтингами, історія доставок та зрозумілі статуси формують довіру й прибирають невизначеність.</p>
              </div>
              <div className="bg-[#2a2332] rounded-2xl border border-[#3d2a5a] p-6">
                <h4 className="[font-family:'Bahnschrift-Regular',Helvetica] text-2xl mb-3">Економія</h4>
                <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-base leading-relaxed">Маршрути вже існують — ми просто використовуємо вільний простір. Менше витрат для відправника, додатковий дохід для водія.</p>
              </div>
              <div className="bg-[#2a2332] rounded-2xl border border-[#3d2a5a] p-6">
                <h4 className="[font-family:'Bahnschrift-Regular',Helvetica] text-2xl mb-3">Екологічність</h4>
                <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-base leading-relaxed">Оптимізований вантажний простір = менше зайвих поїздок і CO₂. Кожна сумісна доставка — маленький крок до стійкості.</p>
              </div>
          
            </div>

            <a href="/about">
              <Button
                className="h-[60px] w-[220px] button-type-1 rounded-xl [font-family:'Inter-Regular',Helvetica] text-[24px]"
                onClick={() => {}}
                text="про нас"
              />
            </a>
          </div>
        </section>

        {/* Gallery section (compact thumbnails) */}
        <section className="w-full py-20 bg-darker relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-25" style={{backgroundImage:"radial-gradient(circle at 18% 35%, #3d2a5a 0, transparent 60%), radial-gradient(circle at 82% 65%, #3d2a5a 0, transparent 55%)"}} />
          <div className="relative max-w-[1500px] mx-auto px-6 md:px-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-4xl md:text-5xl">Роби це швидко зручно вигідно</h2>
              <p className="md:max-w-md [font-family:'Inter-Regular',Helvetica] fg-secondary text-sm md:text-base leading-relaxed">
                Короткі миті взаємодії: запити, рух, передача й отримання. Усе компактно — як і наш підхід до доставки.
              </p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
              {this.galleryImages.map((img, i) => (
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
        <section className="w-full px-[190px] py-16">
          <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-7xl mb-4">
            Заробляйте разом з Cargix
          </h2>

          <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl max-w-[1020px] mb-16">
            Плануйте маршрути з максимальним комфортом та без зайвих зусиль.
            Наша платформа дозволяє швидко знаходити оптимальні заїзди та економити час на дорозі.
            Використовуйте додаток для зручної комунікації з відправниками та прозорих виплат без зайвої паперової тяганини.
          </p>

          <div className="flex flex-col gap-20">
            <div className="flex gap-20">
              <Card className="w-[630px] h-[700px] bg-[#d9d9d9] rounded-xl">
                <CardContent source="/EarnImage1.png" className="flex items-center justify-center h-full w-full"/>
              </Card>

              <div className="flex flex-col justify-center">
                <h3 className="[font-family:'Bahnschrift-Regular',Helvetica] text-[40px] mb-4">
                  Переваги для водія
                </h3>

                <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl max-w-[758px] mb-8">
                  Вибирайте поїздки відповідно до свого графіка та отримуйте дохід з кожної доставки.
                  Інтуїтивний інтерфейс дозволяє швидко додавати маршрути й приймати замовлення без зайвих дзвінків.
                  Автоматичні сповіщення тримають вас у курсі нових запитів та статусу виконання.
                </p>

                <Button className="h-[76px] w-60 bg-[#d9d9d9] rounded-xl" onClick={() => console.log("Learn more clicked!")}
                  text="Дізнатися більше"/>
              </div>
            </div>

            <div className="flex gap-20">
              <div className="flex flex-col justify-center">
                <h3 className="[font-family:'Bahnschrift-Regular',Helvetica] text-[40px] mb-4">
                  Переваги для відправника
                </h3>

                <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl max-w-[760px] mb-8">
                    Знаходьте перевірених водіїв для швидкої та надійної доставки в кілька кліків.
                    Гнучкі тарифи та рейтинг водіїв гарантують оптимальне співвідношення ціни й якості.
                    Всі комунікації, підтвердження та оплати відбуваються в додатку — без зайвої бюрократії.
                </p>

                <Button className="h-[76px] w-60 bg-[#d9d9d9] rounded-xl" onClick={() => console.log("Learn more clicked!")}
                  text="Дізнатися більше" />
              </div>

              <Card className="w-[630px] h-[700px] bg-[#d9d9d9] rounded-xl">
                <CardContent source="/EarnImage2.png" className="flex items-center justify-center h-full w-full"/>
              </Card>
            </div>
          </div>

        </section>

        {/* Calculate delivery section (restyled) */}
        <section className="w-full px-[190px] py-24 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-30" style={{backgroundImage:"radial-gradient(circle at 14% 22%, #3d2a5a 0, transparent 55%), radial-gradient(circle at 88% 78%, #3d2a5a 0, transparent 55%)"}} />
          <div className="relative text-center">
            <h3 className="[font-family:'Bahnschrift-Regular',Helvetica] fg-secondary text-[30px] md:text-[34px] mb-5 tracking-wide uppercase">
              Швидкий розрахунок
            </h3>
            <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-6xl md:text-7xl leading-[1.05] max-w-[980px] mx-auto mb-10">
              Розрахуй доставку за кілька секунд
            </h2>
            <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl max-w-[900px] mx-auto mb-14 leading-relaxed">
              Вкажіть звідки і куди, орієнтовну вагу та габарити. Ми підберемо попутні маршрути, спрогнозуємо діапазон вартості й підкажемо як оптимізувати: змінити дату, точку передачі чи об’єднати з існуючим запитом.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-16 text-left">
              <div className="bg-[#2a2332] rounded-2xl border border-[#3d2a5a] p-6">
                <h4 className="[font-family:'Bahnschrift-Regular',Helvetica] text-2xl mb-3">Маршрут</h4>
                <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-base leading-relaxed">Початкова та кінцева точка визначають відстань і доступні попутні водії.</p>
              </div>
              <div className="bg-[#2a2332] rounded-2xl border border-[#3d2a5a] p-6">
                <h4 className="[font-family:'Bahnschrift-Regular',Helvetica] text-2xl mb-3">Об’єм & вага</h4>
                <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-base leading-relaxed">Розуміння займаного простору дозволяє оптимально використати багажник.</p>
              </div>
              <div className="bg-[#2a2332] rounded-2xl border border-[#3d2a5a] p-6">
                <h4 className="[font-family:'Bahnschrift-Regular',Helvetica] text-2xl mb-3">Оптимізація</h4>
                <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-base leading-relaxed">Алгоритм радить як знизити вартість: гнучка дата або альтернатива передачі.</p>
              </div>
            </div>

            <div className="w-full mx-auto bg-[#2a2332] border border-[#3d2a5a] rounded-3xl p-10 md:p-14 text-left flex flex-col gap-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="flex flex-col gap-5">
                  <h4 className="[font-family:'Bahnschrift-Regular',Helvetica] text-2xl">Вхідні дані</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm fg-secondary">Звідки</label>
                      <input value={this.state.from} onChange={this.handleInput('from')} placeholder="Місто / індекс" className="h-12 rounded-lg bg-[#241c2d] border border-[#3d2a5a] px-4 text-sm text-[#e4e4e4] focus:outline-none focus:border-[#c84cd8] placeholder:opacity-50" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm fg-secondary">Куди</label>
                      <input value={this.state.to} onChange={this.handleInput('to')} placeholder="Місто / індекс" className="h-12 rounded-lg bg-[#241c2d] border border-[#3d2a5a] px-4 text-sm text-[#e4e4e4] focus:outline-none focus:border-[#c84cd8] placeholder:opacity-50" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm fg-secondary">Вага (кг)</label>
                      <input value={this.state.weight} onChange={this.handleInput('weight')} placeholder="Напр. 4.5" className="h-12 rounded-lg bg-[#241c2d] border border-[#3d2a5a] px-4 text-sm text-[#e4e4e4] focus:outline-none focus:border-[#c84cd8] placeholder:opacity-50" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm fg-secondary">Габарити (см)</label>
                      <input value={this.state.dims} onChange={this.handleInput('dims')} placeholder="Д×Ш×В" className="h-12 rounded-lg bg-[#241c2d] border border-[#3d2a5a] px-4 text-sm text-[#e4e4e4] focus:outline-none focus:border-[#c84cd8] placeholder:opacity-50" />
                    </div>
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <label className="text-sm fg-secondary">Тип передачі</label>
                      <input value={this.state.transferType} onChange={this.handleInput('transferType')} placeholder="Особиста / Точка" className="h-12 rounded-lg bg-[#241c2d] border border-[#3d2a5a] px-4 text-sm text-[#e4e4e4] focus:outline-none focus:border-[#c84cd8] placeholder:opacity-50" />
                    </div>
                  </div>
                  <Button className="h-[60px] w-[220px] button-type-1 rounded-xl mt-2" onClick={this.estimateDelivery} text="Розрахувати" />
                </div>
                <div className="flex flex-col gap-6">
                  <h4 className="[font-family:'Bahnschrift-Regular',Helvetica] text-2xl">Оцінка</h4>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between bg-[#241c2d] border border-[#3d2a5a] rounded-xl px-5 py-4">
                      <span className="text-sm fg-secondary">Прогнозована відстань</span>
                      <span className="text-base [font-family:'Bahnschrift-Regular',Helvetica]">{this.state.estimate ? `~ ${this.state.estimate.distanceKm} км` : '--'}</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#241c2d] border border-[#3d2a5a] rounded-xl px-5 py-4">
                      <span className="text-sm fg-secondary">Заповненість багажу</span>
                      <span className="text-base [font-family:'Bahnschrift-Regular',Helvetica]">{this.state.estimate ? `${this.state.estimate.fillPercent}%` : '--'}</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#241c2d] border border-[#3d2a5a] rounded-xl px-5 py-4">
                      <span className="text-sm fg-secondary">Діапазон вартості</span>
                      <span className="text-base [font-family:'Bahnschrift-Regular',Helvetica] text-[#c84cd8]">{this.state.estimate ? `${this.state.estimate.costMin}–${this.state.estimate.costMax} ₴` : '--'}</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#241c2d] border border-[#3d2a5a] rounded-xl px-5 py-4">
                      <span className="text-sm fg-secondary">Час у дорозі</span>
                      <span className="text-base [font-family:'Bahnschrift-Regular',Helvetica]">{this.state.estimate ? `~ ${this.state.estimate.timeHours} год` : '--'}</span>
                    </div>
                  </div>
                  <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-sm leading-relaxed">
                    {this.state.estimate ? this.state.estimate.suggestion : 'Порада з оптимізації з’явиться після розрахунку.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* News section */}
        <section className="px-[190px] py-16">
          <div className="flex justify-between items-center mb-4">
            <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-7xl">
              Новини та оновлення
            </h2>
          </div>

          <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl max-w-[1020px] mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque volutpat efficitur rutrum. Aenean finibus nulla a est
            vestibulum suscipit. Integer sodales laoreet nunc, at convallis nisi
            fringilla sit amet.
          </p>

          <Button className="h-[70px] w-60 bg-[#d9d9d9] rounded-xl mb-8" onClick={() => console.log("View all news clicked!")} 
            text="Переглянути всі новини"/>

          <div className="flex gap-5 mb-8">
            {this.newsItems.map((item, index) => (
              <div
                key={index}
                className="w-[760px] h-[350px] bg-[#231d2d] rounded-xl flex"
              >
                {/* переробити під card */}
                <div className="w-[370px] h-[350px] bg-[#ababab] rounded-[12px_0px_0px_12px] flex items-center justify-center">
                  <Image
                    src={item.imagePath}
                    alt={item.title}
                    className="w-full h-auto rounded-lg"
                  />
                </div>

                <div className="flex-1 p-5 relative">
                  <div className="flex justify-between items-center">
                    <span className="[font-family:'Inter-Regular',Helvetica] text-base">
                      Новини
                    </span>
                    <span className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xs">
                      {item.createdAt}
                    </span>
                  </div>

                  <h3 className="[font-family:'Bahnschrift-Regular',Helvetica]text-[26px] mt-12 mb-4 max-w-[260px]">
                    {item.title}
                  </h3>

                  <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-base max-w-[350px]">
                    {item.content}
                  </p>

                  {/* Коли буде готовий функціонал то переробити під некстові лінки */}
                    <Link
                    href={`/article/${item.id}`}
                    className="[font-family:'Inter-Regular',Helvetica] text-[#94569f] text-base underline absolute bottom-5"
                    >
                    Дивитися далі
                    </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <Button className="p-0" onClick={() => console.log("Previous clicked!")} text="">
              <ArrowLeft className="w-10 h-10 text-white" />
            </Button>
            <Button className="p-0" onClick={() => console.log("Next clicked!")} text="">
              <ArrowRight className="w-10 h-10 text-white" />
            </Button>
          </div>
        </section>

      </main>
    );
  }
}

export default PageTemplate;
