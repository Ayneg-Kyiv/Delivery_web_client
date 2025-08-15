"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Settings, Star } from "lucide-react";
import React, { useState, useEffect } from "react";
import { ProfileService } from "./profile-service";

export default function Profile(): React.JSX.Element {
  // State for user data
  const [userData, setUserData] = useState<ApplicationUser | null>(null);
  const [loading, setLoading] = useState(true);


  // Load user data on component mount with normalization and console logs
  useEffect(() => {
    async function loadUserData() {
      setLoading(true);
      try {
        const response = await ProfileService.getUserProfile();
        console.log('Profile API response:', response);
        const success = (response as any)?.Success ?? (response as any)?.success;
        const payload = (response as any)?.Data ?? (response as any)?.data ?? {};
        const raw = Array.isArray(payload) ? payload[0] : payload;
        console.log('Profile payload:', payload);
        if (success && raw) {
          const normalized: ApplicationUser = {
            firstName: raw?.firstName ?? raw?.FirstName ?? "",
            middleName: raw?.middleName ?? raw?.MiddleName ?? "",
            lastName: raw?.lastName ?? raw?.LastName ?? "",
            email: raw?.email ?? raw?.Email ?? "",
            // date stays as-is (API string)
            dateOfBirth: raw?.dateOfBirth ?? raw?.DateOfBirth ?? "",
            aboutMe: raw?.aboutMe ?? raw?.AboutMe ?? "",
            phoneNumber: raw?.phoneNumber ?? raw?.PhoneNumber ?? "",
            address: raw?.address ?? raw?.Address ?? "",
            imagePath: raw?.imagePath ?? raw?.ImagePath ?? "",
            rating: raw?.rating ?? raw?.Rating ?? 0,
          };
          console.log('Normalized profile data:', normalized);
          setUserData(normalized);
        } else {
          console.warn('Profile load not successful:', response);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, []);

  // No inline editing on this page; fields are read-only

  // Get display name
  const getDisplayName = () => {
    if (!userData) return "Name Second name";
    const parts = [userData.firstName, userData.middleName, userData.lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : "Не вказано";
  };

  const getInitials = () => {
    if (!userData) return "";
    const first = userData.firstName?.[0] ?? "";
    const last = userData.lastName?.[0] ?? "";
    return `${first}${last}`.toUpperCase() || "U";
  };

  const displayOrMissing = (v?: string) => (v && v.trim() !== "" ? v : "Не вказано");

  // Navigation items
  const navItems = ["Text", "Text", "Text", "Text"];

  // Form fields with dynamic data (only existing/available fields)
  const formFields = [
    { label: "Ім'я", value: displayOrMissing(userData?.firstName), key: "firstName" },
    { label: "Прізвище", value: displayOrMissing(userData?.lastName), key: "lastName" },
    { label: "E-mail", value: displayOrMissing(userData?.email), key: "email" },
    { label: "Дата народження", value: displayOrMissing(userData?.dateOfBirth), key: "birthDate", hasHelp: true },
    { label: "Номер телефону", value: displayOrMissing(userData?.phoneNumber), key: "phoneNumber" },
    { label: "Адреса", value: displayOrMissing(userData?.address), key: "address" },
    { label: "Про мене", value: displayOrMissing(userData?.aboutMe), key: "aboutMe", type: "textarea" as const },
  ];

  // Rating stars based on user rating (0..5)
  const starCount = Math.max(0, Math.min(5, Math.round(userData?.rating ?? 0)));
  const stars = Array.from({ length: 5 }, (_, i) => i < starCount);

  if (loading) {
    return (
      <main className="bg-[#130c1f] grid justify-items-center w-screen min-h-screen h-full">
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-xl">Завантаження...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#130c1f] grid justify-items-center w-screen min-h-screen h-full">
      <div className="bg-[#130c1f] w-full max-w-[1920px] relative">
        {/* Top separator */}
        <Separator className="w-full h-px mt-[95px]" />

        {/* Profile header card */}
        <Card className="w-[1080px] h-[460px] mx-auto mt-[35px] bg-[#0f0e10] border-0 border-b-8 border-b-[#2c1b48] rounded-none">
          <CardContent className="grid grid-cols-2 gap-[100px] p-[100px]">
            {/* Profile avatar and name */}
            <div className="flex flex-col items-center justify-center">
              <Avatar className="w-[150px] h-[150px] bg-[#d9d9d9]">
                {userData?.imagePath ? (
                  <img src={userData.imagePath} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <AvatarFallback className="bg-[#d9d9d9] text-[#4d4d4d] font-semibold text-4xl">
                    {getInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="mt-[18px] font-['Bahnschrift-Regular',Helvetica] text-white text-2xl">
                {getDisplayName()}
              </span>
            </div>

            {/* Rating section */}
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="font-['Bahnschrift-Light',Helvetica] font-light text-white text-lg mr-1">
                  Рейтинг
                </span>
                <div className="flex">
                  {stars.map((filled, index) => (
                    <Star
                      key={`star-${index}`}
                      className="w-[31px] h-[30px]"
                      fill={filled ? "white" : "none"}
                      color="white"
                    />
                  ))}
                </div>
              </div>

              <Separator className="w-[177px] h-px mt-[10px]" />

              <div className="mt-[70px]">
                <span className="font-['Bahnschrift-Light',Helvetica] font-light text-white text-lg">
                  Рейтинг
                </span>
                <div className="font-['Bahnschrift-Regular',Helvetica] font-normal text-white text-[28px] text-center mt-2">
                  {userData?.rating ?? 0}
                </div>
                <Separator className="w-12 h-px mt-2" />
              </div>

              {/* Edit Profile Button */}
              <div className="mt-8">
                <Button
                  className="w-full bg-[#7f51b3] text-white py-3 rounded-lg hover:bg-[#6a4399] transition-colors"
                  onClick={() => window.location.href = '/edit-profile'}
                >
                  Редагувати профіль
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation tabs */}
        <Tabs defaultValue="tab1" className="w-[1080px] mx-auto">
          <TabsList className="w-full h-[83px] bg-[#2c1b48] rounded-[8px_8px_0px_0px] p-2.5 justify-start gap-4">
            <Button className="w-[60px] h-[60px] bg-[#7f51b3] rounded-lg p-0 flex items-center justify-center">
              <Settings className="w-[34px] h-[34px]" />
            </Button>

            {navItems.map((item, index) => (
              <TabsTrigger
                key={`tab-${index}`}
                value={`tab${index + 1}`}
                className="w-[210px] h-[60px] font-['Bahnschrift-SemiBold',Helvetica] font-semibold text-white text-2xl bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-white"
              >
                {item}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Profile form section */}
        <Card className="w-[1080px] h-[575px] mx-auto bg-[#0f0e10] border-0 rounded-none">
          <CardContent className="pt-[39px] px-[68px]">
            <Separator className="w-[965px] h-px mb-[20px]" />

            <div className="w-[682px] mx-auto mt-[20px]">
              {formFields.map((field, index) => (
                <div key={field.key} className="mb-[56px]">
                  <div className="flex justify-between">
                    <label className="font-['Bahnschrift-Regular',Helvetica] font-normal text-white text-lg">
                      {field.label}
                    </label>
                  </div>

                  <div className="relative mt-1">
                    {field.key === 'aboutMe' || (field as any).type === 'textarea' ? (
                      <Textarea
                        className="w-[576px] min-h-[100px] rounded-md border-2 border-[#c5c2c2] bg-transparent text-[#c5c2c2] font-m3-title-small"
                        value={(field.value as string) || ''}
                        readOnly
                      />
                    ) : (
                      <Input
                        className="w-[376px] h-[41px] rounded-md border-2 border-[#c5c2c2] bg-transparent text-[#c5c2c2] font-m3-title-small"
                        value={(field.value as string) || ''}
                        type="text"
                        readOnly
                      />
                    )}

                    {field.hasHelp && (
                      <div className="absolute right-[-20px] top-[10px]">
                        <div className="w-5 h-5 rounded-[10px] bg-[#d9d9d9] flex items-center justify-center">
                          <HelpCircle className="w-4 h-4 text-[#4d4d4d]" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
