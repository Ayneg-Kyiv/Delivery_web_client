"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { ProfileService } from "./profile-service";
import Image from "next/image";
import Link from "next/link";
import MyTrips from "./components/my-trips";
import MyOrders from "./components/my-orders";
import MyReviews from "./components/my-reviews";
import MyRequests from "./components/my-requests";
import MyOffers from "./components/my-offers";
import { useSession } from "next-auth/react";
import { useI18n } from "@/i18n/I18nProvider";

export default function Profile(): React.JSX.Element {
  const { messages: t } = useI18n();
  // State for user data
  const [selectedTab, setSelectedTab] = useState("user");
  const [userData, setUserData] = useState<ApplicationUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const session = useSession();

  // Load user data on component mount with normalization and console logs
  useEffect(() => {

    async function loadUserData() {
      setLoading(true);
      try {
        const response = await ProfileService.getUserProfile(session?.data?.accessToken || "");
        
        console.log('Profile API response:', response);
        
        const success = (response as any)?.Success ?? (response as any)?.success;
        const payload = (response as any)?.Data ?? (response as any)?.data ?? {};
        
        const raw = Array.isArray(payload) ? payload[0] : payload;
        
        console.log('Profile payload:', payload);
        
        if (success && raw) {
          
          const normalized: ApplicationUser = {
            id: raw?.id ?? raw?.Id ?? "",
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
    if (!userData) return t.profile.nameFallback;
    
    const parts = [userData.firstName, userData.middleName, userData.lastName].filter(Boolean);
    
    return parts.length > 0 ? parts.join(' ') : t.profile.missing;
  };

  const getInitials = () => {
    if (!userData) return "";
    
    const first = userData.firstName?.[0] ?? "";
    const last = userData.lastName?.[0] ?? "";
    
    return `${first}${last}`.toUpperCase() || "U";
  };

  const displayOrMissing = (v?: string) => (v && v.trim() !== "" ? v : t.profile.missing);

  // Build absolute URL for image if backend returns relative path
  const resolveImageSrc = (path?: string | null) => {
    if (!path) return undefined;

    const p = String(path);

    // If already absolute or data/blob, return as-is
    if (/^(https?:)?\/\//i.test(p) || p.startsWith('data:') || p.startsWith('blob:')) return p;

    // Use NEXT_PUBLIC_FILES_URL for consistency with your example
    const filesUrl = (process.env.NEXT_PUBLIC_FILES_URL || '').replace(/\/+$/, '');
    const clean = p.replace(/^\/+/, '');

    return filesUrl ? `${filesUrl}/${clean}` : '/dummy.png';
  };

  const testImageLoad = (src: string) => new Promise<boolean>((resolve) => {
    const img = typeof window !== "undefined" ? new (window.Image as { new (): HTMLImageElement })() : {} as HTMLImageElement;
    
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });

  // Handlers for changing profile image
  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userData?.email) return;
    
    setUploading(true);
    // Show instant preview
    
    try {
      
      const localUrl = URL.createObjectURL(file);
      
      setPreviewUrl(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return localUrl;
      });
    } catch {}

    try {
      
      const result = await ProfileService.updateProfileImage(userData.email, file, session?.data?.accessToken || "");
      console.log('Update profile image result:', result);
      
      // Try to update local avatar if API returns a path; otherwise refetch profile
      const newPath = (result?.data?.imagePath) || (result?.Data?.ImagePath) || (result?.imagePath) || null;
      
      if (newPath) {
        const remote = resolveImageSrc(newPath);
        
        if (remote && await testImageLoad(remote)) {
          setUserData(prev => prev ? { ...prev, imagePath: newPath } : prev);
          setPreviewUrl(null);
        } else {
          // Keep preview if remote not available yet (eventual consistency)
          setUserData(prev => prev ? { ...prev, imagePath: newPath } : prev);
        }

      } else {
        // fallback: reload profile
        try {
          const refreshed = await ProfileService.getUserProfile(session?.data?.accessToken || "");
          const success = (refreshed as any)?.Success ?? (refreshed as any)?.success;
          const payload = (refreshed as any)?.Data ?? (refreshed as any)?.data ?? {};
          const raw = Array.isArray(payload) ? payload[0] : payload;
          
          if (success && raw) {
            const normalized: ApplicationUser = {
              id: raw?.id ?? raw?.Id ?? "",
              firstName: raw?.firstName ?? raw?.FirstName ?? "",
              middleName: raw?.middleName ?? raw?.MiddleName ?? "",
              lastName: raw?.lastName ?? raw?.LastName ?? "",
              email: raw?.email ?? raw?.Email ?? "",
              dateOfBirth: raw?.dateOfBirth ?? raw?.DateOfBirth ?? "",
              aboutMe: raw?.aboutMe ?? raw?.AboutMe ?? "",
              phoneNumber: raw?.phoneNumber ?? raw?.PhoneNumber ?? "",
              address: raw?.address ?? raw?.Address ?? "",
              imagePath: raw?.imagePath ?? raw?.ImagePath ?? "",
              rating: raw?.rating ?? raw?.Rating ?? 0,
            };

            const remote = resolveImageSrc(normalized.imagePath);
            
            if (remote && await testImageLoad(remote)) {
              setUserData(normalized);
              setPreviewUrl(null);
            } else {
              setUserData(normalized);
            }
          }
        } catch (err) {
          console.warn('Failed to refresh profile after image upload', err);
        }
      }
      // Clear file input so selecting the same file again re-triggers change
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Failed to update profile image:', err);
    } finally {
      setUploading(false);
    }
  };

  const navItems = [];
  
  if (session?.data?.user?.roles.includes("User")) {
  // Navigation items
    navItems.push(
      { label: t.profile.tabs.profile, value: "user" },
      { label: t.profile.tabs.trips, value: "trips" },
      { label: t.profile.tabs.orders, value: "orders" },
      { label: t.profile.tabs.reviews, value: "reviews" },
      { label: t.profile.tabs.requests, value: "requests" },
    );
  }
  if (session?.data?.user?.roles.includes("Driver")) {
    navItems.push(
      { label: t.profile.tabs.offers, value: "offers" },
    );
  }

  // Form fields with dynamic data (only existing/available fields)
  const formFields = [
    { label: t.profile.fields.firstName, value: displayOrMissing(userData?.firstName), key: "firstName" },
    { label: t.profile.fields.lastName, value: displayOrMissing(userData?.lastName), key: "lastName" },
    { label: t.profile.fields.email, value: displayOrMissing(userData?.email), key: "email" },
    { label: t.profile.fields.birthDate, value: displayOrMissing(userData?.dateOfBirth), key: "birthDate", hasHelp: true },
    { label: t.profile.fields.phoneNumber, value: displayOrMissing(userData?.phoneNumber), key: "phoneNumber" },
    { label: t.profile.fields.address, value: displayOrMissing(userData?.address), key: "address" },
    { label: t.profile.fields.aboutMe, value: displayOrMissing(userData?.aboutMe), key: "aboutMe", type: "textarea" as const },
  ];

  // Rating stars based on user rating (0..5)
  const starCount = Math.max(0, Math.min(5, Math.round(userData?.rating ?? 0)));
  const stars = Array.from({ length: 5 }, (_, i) => i < starCount);

  if (loading) {
    return (
      <main className="bg-[#130c1f] grid justify-items-center w-full">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-white text-xl">{t.profile.loading}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex flex-col bg-[#130c1f] justify-center items-center w-full px-4 md:px-20 lg:px-40">
        {/* Ambient blurred gradient background */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-[#724C9D] opacity-30 blur-3xl" />
          <div className="absolute top-24 -right-28 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500 opacity-20 blur-[120px]" />
          <div className="absolute bottom-[-6rem] right-1/4 h-72 w-72 rounded-full bg-indigo-500 opacity-25 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-emerald-400 opacity-[0.12] blur-[90px]" />
        </div>
 
        {/* Profile header card */}
        <div className="w-full max-w-[1080px] mt-[35px] px-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.45)]">
          <div className="flex flex-col md:flex-row justify-between p-6 md:p-10 lg:p-16">
            {/* Profile avatar and name */}
            <div className=" flex flex-col items-center justify-center pt-10">
              <Avatar className="w-[150px] h-[150px] bg-[#d9d9d9]">
                {previewUrl || userData?.imagePath ? (
                  <Image
                    src={previewUrl || resolveImageSrc(userData?.imagePath) || ''}
                    alt="avatar"
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                    onError={async (e) => {
                      // Avoid loops on preview
                      if (!userData?.email || previewUrl) return;
                      try {
                        const blob = await ProfileService.getProfileImageBlobByEmail(userData.email);
                        const blobUrl = URL.createObjectURL(blob);
                        (e.currentTarget as HTMLImageElement).src = blobUrl;
                      } catch (err) {
                        console.warn('Fallback blob fetch for avatar failed:', err);
                      }
                    }}
                  />
                ) : (
                  <AvatarFallback className="bg-[#d9d9d9] text-[#4d4d4d] font-semibold text-4xl">
                    {getInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="mt-[18px] font-['Bahnschrift-Regular',Helvetica] text-white text-2xl">
                {getDisplayName()}
              </span>
              {/* Change photo link and hidden input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={handlePickFile}
                disabled={uploading}
                className="mt-2 text-[#7f51b3] hover:text-[#6a4399] underline disabled:opacity-60"
              >
                {uploading ? t.profile.uploading : t.profile.changePhoto}
              </button>
            </div>

            {/* Rating section */}
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="font-['Bahnschrift-Light',Helvetica] font-light text-white text-lg mr-1">
                  {t.profile.rating}
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
                  {t.profile.rating}
                </span>
                <div className="font-['Bahnschrift-Regular',Helvetica] font-normal text-white text-[28px] text-center mt-2">
                  {userData?.rating ?? 0}
                </div>
                <Separator className="w-12 h-px mt-2" />
              </div>

              {/* Edit Profile Button */}
              <div className="mt-8 mb-8 flex flex-col gap-4">
                <Button
                  className="w-full button-type-2 text-white py-3 rounded-lg "
                  onClick={() => window.location.href = '/edit-profile'}
                >
                  {t.profile.editProfile}
                </Button>
                <Link href="/change-password" className="w-full">
                  <div className="w-full text-center button-type-2 text-white py-3 rounded-lg hover:opacity-90">
                    {t.profile.changePassword}
                  </div>
                </Link>
                {
                  session?.data?.user?.roles.includes("Admin") && (
                    <div className="font-['Bahnschrift-SemiBold',Helvetica] py-3 rounded-lg button-type-2 font-semibold text-white text-2xl data-[state=active]:bg-transparent data-[state=active]:text-white">
                      <Link href="/profile/admin-panel">
                        <div  className="w-full h-full flex items-center justify-center">
                          {t.profile.adminPanel}
                        </div>
                      </Link>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>

        {/* Navigation tabs laid out evenly in two rows (3 columns) */}
        <div className="w-full max-w-[1080px]">
          <Tabs defaultValue="tab1" className="w-full">
            <TabsList className="grid grid-cols-3 items-stretch w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-[0px_0px_12px_12px] p-2.5 gap-4">
              {navItems.map((item, index) => (
                <div onClick={() => setSelectedTab(item.value)} key={index}>
                  <TabsTrigger
                    key={item.label}
                    value={item.value}
                    className="w-full h-[60px] font-['Bahnschrift-SemiBold',Helvetica] button-type-3 font-semibold text-white text-2xl rounded-lg data-[state=active]:bg-white/10 data-[state=active]:backdrop-blur-md data-[state=active]:text-white"
                  >
                    {item.label}
                  </TabsTrigger>
                </div>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Profile form section */}
        {
          selectedTab === "user" && (
            <Card className="w-full max-w-[1080px] mt-8 mb-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-[0_6px_24px_-6px_rgba(0,0,0,0.5)]">
              <CardContent className="w-full flex flex-col pt-8 pb-10 px-6 md:px-10">
                <Separator className="w-full h-px mb-6 opacity-20" />

                <div className="grid grid-cols-1 gap-y-8 w-full max-w-[700px] mx-auto">
                  {formFields.map((field) => {
                    const isTextArea = field.key === 'aboutMe' || (field as any).type === 'textarea';
                    const missing = field.value === t.profile.missing;
                    return (
                      <div key={field.key} className="flex flex-col">
                        <label className="mb-2 text-sm font-medium tracking-wide text-white/80">
                          {field.label}
                        </label>
                        {isTextArea ? (
                          <Textarea
                            className={`w-full min-h-[110px] resize-none rounded-md border border-white/15 bg-white/5 focus:bg-white/10 transition-colors text-sm text-white/90 ${missing ? 'italic text-white/40' : ''}`}
                            value={(field.value as string) || ''}
                            readOnly
                          />
                        ) : (
                          <Input
                            className={`w-full h-11 rounded-md border border-white/15 bg-white/5 focus:bg-white/10 transition-colors text-sm text-white/90 ${missing ? 'italic text-white/40' : ''}`}
                            value={(field.value as string) || ''}
                            type="text"
                            readOnly
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Removed duplicate Edit Profile button to keep a single CTA in header */}
              </CardContent>
            </Card>
          )
        }

        {
          selectedTab === "trips" && (
          <div className="w-full max-w-[1080px] mx-auto mt-6 mb-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-[0_6px_24px_-6px_rgba(0,0,0,0.5)] p-4 md:p-6">
            <MyTrips />
          </div>)
        }

        {
          selectedTab === "orders" && (
          <div className="w-full max-w-[1080px] mx-auto mt-6 mb-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-[0_6px_24px_-6px_rgba(0,0,0,0.5)] p-4 md:p-6">
            <MyOrders id={session?.data?.user?.id ?? ""} />
          </div>)
        }

        {
          selectedTab === "reviews" && (
          <div className="w-full max-w-[1080px] mx-auto mt-6 mb-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-[0_6px_24px_-6px_rgba(0,0,0,0.5)] p-4 md:p-6">
            <MyReviews id={session?.data?.user?.id ?? ""} />
          </div>)
        }

        {
          selectedTab === "requests" && (
          <div className="w-full max-w-[1080px] mx-auto mt-6 mb-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-[0_6px_24px_-6px_rgba(0,0,0,0.5)] p-4 md:p-6">
            <MyRequests id={session?.data?.user?.id ?? ""} />
          </div>)
        }

        {
          selectedTab === "offers" && session?.data?.user?.roles.includes("Driver") && (
          <div className="w-full max-w-[1080px] mx-auto mt-6 mb-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-[0_6px_24px_-6px_rgba(0,0,0,0.5)] p-4 md:p-6">
            <MyOffers id={session?.data?.user?.id ?? ""} />
          </div>)
        }
    </main>
  );
}