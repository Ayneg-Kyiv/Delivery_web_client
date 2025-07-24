'use client';

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import CardContent from "@/components/ui/card-content";
import React, { Component } from "react";
import { ArrowLeft, ArrowRight, Menu } from "lucide-react";

class PageTemplate extends Component {
  heroData = {
    tagline: "Доставка від людей для людей",
    title: "Відправляй куди та як завгодно",
    subtitle: "Name - робе це можливим",
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
      description: "Вкажіть, куди і що потрібно доставити",
    },
    {
      number: "2",
      title: "Знайдіть людину, яка їде в той бік",
      description: "TEXT TEXT TEXT TEXT TEXT TEXT TEXT",
    },
    {
      number: "3",
      title: "Узгодьте деталі",
      description: "Та отримайте доставку без зайвого клопоту",
    },
  ];

  newsItems = [
    {
      category: "Новини",
      date: "01/01/2025",
      title: "Lorem ipsum dolor sit amet, consectetur....",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque volutpat efficitur rutrum. Aenean finibus nulla a est vestibulum suscipit. Integer sodales laoreet nunc, at convallis nisi fringilla sit amet...",
    },
    {
      category: "Новини",
      date: "01/01/2025",
      title: "Lorem ipsum dolor sit amet, consectetur....",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque volutpat efficitur rutrum. Aenean finibus nulla a est vestibulum suscipit. Integer sodales laoreet nunc, at convallis nisi fringilla sit amet...",
    },
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
        <section className="w-full mt-20 px-[190px] py-16">
          <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-5xl text-center mb-16">
            Як це працює?
          </h2>

          <div className="flex ">
            {this.howItWorksSteps.map((step, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className=" relative w-[102px] h-[102px] rounded-[51px] border-4 border-solid border-[#e4e4e4] flex items-center justify-center mb-8">
                  <span className="[font-family:'Bahnschrift-Regular',Helvetica] text-5xl">
                    {step.number}
                  </span>
                </div>

                <Card className="w-[370px] h-[400px] bg-[#d9d9d9] rounded-xl mb-6" children={
                  <CardContent source="/path/to/illustration.png"
                   className="flex items-center justify-center h-full" />} />

                <h3 className="[font-family:'Bahnschrift-Regular',Helvetica] text-[28px] mb-2">
                  {step.title}
                </h3>

                <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-lg text-center">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Ecological delivery section */}
        <section className="w-full h-[1080px] bg-darker px-[450px] py-[159px]">
          <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-7xl mb-10">
            Робимо доставку екологічною та швидкою
          </h2>

          <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl mb-16">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque volutpat efficitur rutrum. Aenean finibus nulla a est
            vestibulum suscipit. Integer sodales laoreet nunc, at convallis nisi
            fringilla sit amet.
          </p>

          <h3 className="[font-family:'Bahnschrift-Regular',Helvetica] text-[40px] mb-4">
            Lorem Ipsum .....
          </h3>

          <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque volutpat efficitur rutrum. Aenean finibus nulla a est
            vestibulum suscipit. Integer sodales laoreet nunc, at convallis nisi
            fringilla sit amet.
          </p>

          <Card
            className="w-full h-[200px] bg-[#d9d9d9] rounded-xl mb-8"
            children={
              <Button
                onClick={() => console.log("Learn more clicked!")}
                text="Illustration + Button"
                className="flex items-center justify-center h-full text-5xl text-center"
              />
            }
          />

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

        {/* Mission section */}
        <section className="w-full px-[190px] py-16">
          <div className="text-center">
            <h3 className="[font-family:'Bahnschrift-Regular',Helvetica] fg-secondary text-[34px] mb-4">
              Наша місія
            </h3>

            <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-7xl max-w-[759px] mx-auto mb-16">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </h2>

            <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl max-w-[759px] mx-auto mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque volutpat efficitur rutrum. Aenean finibus nulla a est
              vestibulum suscipit. Integer sodales laoreet nunc, at convallis
              nisi fringilla sit amet.
            </p>

            <Button className="h-[60px] w-[186px] button-type-1 rounded-xl [font-family:'Inter-Regular',Helvetica] text-[26px]"
              onClick={() => console.log("Про нас clicked!")} text="про нас"/>
          </div>

        </section>

        {/* Gallery section */}
        <section className="w-full h-[600px] bg-darker flex justify-center items-center">
          <div className="w-[1552px] h-[520px] mx-auto my-[30px] grid grid-cols-12 grid-rows-2 gap-5">
            <Card className="col-span-4 bg-[#d9d9d9] rounded-xl">
              <CardContent className="flex items-center justify-center h-full" />
            </Card>
            <Card className="col-span-5 bg-[#d9d9d9] rounded-xl">
              <CardContent className="flex items-center justify-center h-full" />
            </Card>
            <Card className="col-span-3 bg-[#d9d9d9] rounded-xl">
              <CardContent className="flex items-center justify-center h-full" />
            </Card>
            <Card className="col-span-3 bg-[#d9d9d9] rounded-xl">
              <CardContent className="flex items-center justify-center h-full" />
            </Card>
            <Card className="col-span-5 bg-[#d9d9d9] rounded-xl">
              <CardContent className="flex items-center justify-center h-full" />
            </Card>
            <Card className="col-span-4 bg-[#d9d9d9] rounded-xl">
              <CardContent className="flex items-center justify-center h-full" />
            </Card>
          </div>
        </section>

        {/* Earn with us section */}
        <section className="w-full px-[190px] py-16">
          <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-7xl mb-4">
            Заробляйте разом з Name
          </h2>

          <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl max-w-[1020px] mb-16">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque volutpat efficitur rutrum. Aenean finibus nulla a est
            vestibulum suscipit. Integer sodales laoreet nunc, at convallis nisi
            fringilla sit amet.
          </p>

          <div className="flex flex-col gap-20">
            <div className="flex gap-20">
              <Card className="w-[630px] h-[700px] bg-[#d9d9d9] rounded-xl">
                <CardContent className="flex items-center justify-center h-full">
                </CardContent>
              </Card>

              <div className="flex flex-col justify-center">
                <h3 className="[font-family:'Bahnschrift-Regular',Helvetica] text-[40px] mb-4">
                  Lorem Ipsum
                </h3>

                <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl max-w-[758px] mb-8">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Pellentesque volutpat efficitur rutrum. Aenean finibus nulla a
                  est vestibulum suscipit. Integer sodales laoreet nunc, at
                  convallis nisi fringilla sit amet.
                </p>

                <Button className="h-[76px] w-60 bg-[#d9d9d9] rounded-xl" onClick={() => console.log("Learn more clicked!")}
                  text="Дізнатися більше"/>
              </div>
            </div>

            <div className="flex gap-20">
              <div className="flex flex-col justify-center">
                <h3 className="[font-family:'Bahnschrift-Regular',Helvetica] text-[40px] mb-4">
                  Lorem Ipsum
                </h3>

                <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl max-w-[760px] mb-8">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Pellentesque volutpat efficitur rutrum. Aenean finibus nulla a
                  est vestibulum suscipit. Integer sodales laoreet nunc, at
                  convallis nisi fringilla sit amet.
                </p>

                <Button className="h-[76px] w-60 bg-[#d9d9d9] rounded-xl" onClick={() => console.log("Learn more clicked!")}
                  text="Дізнатися більше" />
              </div>

              <Card className="w-[630px] h-[700px] bg-[#d9d9d9] rounded-xl">
                <CardContent className="flex items-center justify-center h-full">
                </CardContent>
              </Card>
            </div>
          </div>

        </section>

        {/* Calculate delivery section */}
        <section className="w-full px-[190px] py-16 text-center">
          <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-7xl mb-6 max-w-[1020px] mx-auto">
            Розрахуй свою доставку
          </h2>

          <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl max-w-[1020px] mx-auto mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque volutpat efficitur rutrum. Aenean finibus nulla a est
            vestibulum suscipit. Integer sodales laoreet nunc, at convallis nisi
            fringilla sit amet.
          </p>

          <Button className="h-[76px] w-60 bg-[#d9d9d9] rounded-xl mb-16" onClick={() => console.log("Calculate clicked!")} 
            text="Розрахувати доставку" />

          <Card className="w-full h-[700px] bg-[#d9d9d9] rounded-xl">
            <CardContent className="flex items-center justify-center h-full">
            </CardContent>
          </Card>

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
                  <span className="rotate-[-43.80deg] [font-family:'Bahnschrift-Regular',Helvetica] text-black text-5xl text-center">
                    Illustration
                  </span>
                </div>

                <div className="flex-1 p-5 relative">
                  <div className="flex justify-between items-center">
                    <span className="[font-family:'Inter-Regular',Helvetica] text-base">
                      {item.category}
                    </span>
                    <span className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xs">
                      {item.date}
                    </span>
                  </div>

                  <h3 className="[font-family:'Bahnschrift-Regular',Helvetica]text-[26px] mt-12 mb-4 max-w-[260px]">
                    {item.title}
                  </h3>

                  <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-base max-w-[350px]">
                    {item.content}
                  </p>

                  {/* Коли буде готовий функціонал то переробити під некстові лінки */}
                  <a
                    href="#"
                    className="[font-family:'Inter-Regular',Helvetica] text-[#94569f] text-base underline absolute bottom-5"
                  >
                    Дивитися далі
                  </a>
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
