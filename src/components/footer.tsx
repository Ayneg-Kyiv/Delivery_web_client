import React from "react";

  const footerLinks = Array(7)
    .fill(null)
    .map((_, i) => ({
      title: "Text",
      links: Array(6)
        .fill("")
        .map(() => "Text"),
    }));

const Footer: React.FC = () => (
    <footer className="w-full h-[395px] bg-[#0e1010] px-[450px] pt-10 pb-6 relative">
          <div className="grid grid-cols-7 gap-[130px] mb-10">
            {footerLinks.map((column, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-2">
                <h4 className="[font-family:'Bahnschrift-Regular',Helvetica] text-white text-base mb-4">
                  {column.title}
                </h4>
                {column.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href="#"
                    className="[font-family:'Inter-Regular',Helvetica] text-[#e4e4e4] text-xs"
                  >
                    {link}
                  </a>
                ))}
              </div>
            ))}
          </div>

          <div className="w-full h-px bg-white/20 mb-5" />

          <div className="flex items-center gap-8 mb-10">
            <div className="flex items-center">
                <div className="w-[30px] h-[22px] icon-light-blue rounded-md flex items-center justify-center">
                    <img className="w-[14px] h-[14px]" alt="English flag" src="/worldicon.png" />
                </div>
              <span className="ml-2 [font-family:'Bahnschrift-Regular',Helvetica] text-[#c5c2c2] text-base">
                EN
              </span>
            </div>

            <div className="h-7 bg-white/20" />

            <div className="flex items-center">
              <div className="w-[30px] h-[22px] icon-light-yellow rounded-md overflow-hidden">
                <div className="h-[11px] icon-light-blue rounded-[6px_6px_0px_0px]" />
              </div>
              <span className="ml-2 [font-family:'Bahnschrift-Regular',Helvetica] text-white text-base">
                UA
              </span>
            </div>
          </div>

          <div className="[font-family:'Bahnschrift-Regular',Helvetica] text-white text-base">
            Logo
          </div>

          <div className="absolute top-[134px] right-[190px] [font-family:'Bahnschrift-Regular',Helvetica] text-white text-base">
            Demo demo
          </div>
        </footer>
);

export default Footer;