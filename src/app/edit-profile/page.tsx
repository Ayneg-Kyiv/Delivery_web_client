"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ProfileService } from "../profile/profile-service";
import { ChangeUserDataDTO } from "../profile/profile.d";
import { useI18n } from "@/i18n/I18nProvider";

export default function EditProfile(): React.JSX.Element {
  const { messages } = useI18n();
  const t = messages.editProfile;
  const [formData, setFormData] = useState<ChangeUserDataDTO>({
    Email: "",
    FirstName: "",
    MiddleName: "",
    LastName: "",
    DateOfBirth: "",
    AboutMe: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  // Load current user data
  const { data: session } = useSession();
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/Account`;
        
  // console.log('Шлях запиту до API:', url);
        
        const token = session?.accessToken;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          credentials: 'include'
        });
        const data = await response.json();

  // console.log('Дані з API /Account:', data);
        
        if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
          const user = data.data[0];
          
          setFormData({
            Email: user.email || "",
            FirstName: user.firstName || "",
            MiddleName: user.middleName || "",
            LastName: user.lastName || "",
            DateOfBirth: user.dateOfBirth || "",
            AboutMe: user.aboutMe || ""
          });
        }
      } catch (error) {
        // console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken) {
      loadUserData();
    }
  }, [session]);

  // Handle input changes
  const handleInputChange = (field: keyof ChangeUserDataDTO, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setSuccessMessage("");
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Email validation
    if (!formData.Email) {
      newErrors.Email = t.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      newErrors.Email = t.emailInvalid;
    }
    
    // First name validation
    if (formData.FirstName && formData.FirstName.length < 3) {
      newErrors.FirstName = t.firstNameMinLength;
    }
    
    // Middle name validation
    if (formData.MiddleName && formData.MiddleName.length < 3) {
      newErrors.MiddleName = t.middleNameMinLength;
    }
    
    // Last name validation
    if (formData.LastName && formData.LastName.length < 3) {
      newErrors.LastName = t.lastNameMinLength;
    }
    
    // About me validation
    if (formData.AboutMe && formData.AboutMe.length < 3) {
      newErrors.AboutMe = t.aboutMeMinLength;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setErrors({});
    setSuccessMessage("");

    if (!validateForm()) {
      setSaveLoading(false);
      return;
    }

    try {
      const response = await ProfileService.changeUserData(formData);
      console.log('Відповідь API на зміну даних:', response);

      // Accept only Success key (API returns Success: true)
      if (response.Success === true) {
        setErrors({});
        setSuccessMessage(t.successMessage);
        return;
      }

      // If not success, show error
      if (response.Errors && response.Errors.length > 0) {
        const errorObj: Record<string, string> = {};
        response.Errors.forEach((error: string) => {
          errorObj.general = error;
        });
        setErrors(errorObj);
      } else {
        setErrors({ general: response.Message || t.errorMessage });
      }
    } catch (error: any) {
      console.error('Error saving data:', error);
      setErrors({ general: t.errorMessage });
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-[#130c1f] min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">{t.loading}</div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-[70vh] flex-col bg-[#130c1f] items-center w-full px-4 py-16">
      {/* Ambient blurred gradient background (same style language as profile/change-password) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-[#724C9D] opacity-30 blur-3xl" />
        <div className="absolute top-24 -right-28 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500 opacity-20 blur-[120px]" />
        <div className="absolute bottom-[-6rem] right-1/4 h-72 w-72 rounded-full bg-indigo-500 opacity-25 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-emerald-400 opacity-[0.12] blur-[90px]" />
      </div>

      {/* Glass card wrapper */}
      <section className="w-full max-w-[900px] bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.45)]">
        <div className="px-6 py-6 md:px-10 md:py-10">
          {/* Header */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
            <p className="text-white/70">{t.subtitle}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Success Message */}
            {successMessage && (
              <div className="bg-emerald-500/10 border border-emerald-400/30 text-emerald-200 px-3 py-2 rounded-lg" role="status" aria-live="polite">
                {successMessage}
              </div>
            )}

            {/* General Error */}
            {!successMessage && errors.general && (
              <div className="bg-red-500/10 border border-red-400/30 text-red-200 px-3 py-2 rounded-lg" role="alert" aria-live="assertive">
                {errors.general}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                {t.emailLabel} *
              </label>
              <Input
                type="email"
                value={formData.Email}
                onChange={(e) => handleInputChange('Email', e.target.value)}
                className="w-full h-12 bg-transparent text-white placeholder-white/40 border border-white/20 rounded-md focus:ring-fuchsia-500/40"
                placeholder={t.emailPlaceholder}
              />
              {errors.Email && (
                <p className="text-red-400 text-sm mt-1">{errors.Email}</p>
              )}
            </div>

            <Separator className="my-6 bg-white/10" />

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  {t.firstNameLabel}
                </label>
                <Input
                  type="text"
                  value={formData.FirstName}
                  onChange={(e) => handleInputChange('FirstName', e.target.value)}
                  className="w-full h-12 bg-transparent text-white placeholder-white/40 border border-white/20 rounded-md focus:ring-fuchsia-500/40"
                  placeholder={t.firstNamePlaceholder}
                />
                {errors.FirstName && (
                  <p className="text-red-400 text-sm mt-1">{errors.FirstName}</p>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  {t.middleNameLabel}
                </label>
                <Input
                  type="text"
                  value={formData.MiddleName}
                  onChange={(e) => handleInputChange('MiddleName', e.target.value)}
                  className="w-full h-12 bg-transparent text-white placeholder-white/40 border border-white/20 rounded-md focus:ring-fuchsia-500/40"
                  placeholder={t.middleNamePlaceholder}
                />
                {errors.MiddleName && (
                  <p className="text-red-400 text-sm mt-1">{errors.MiddleName}</p>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  {t.lastNameLabel}
                </label>
                <Input
                  type="text"
                  value={formData.LastName}
                  onChange={(e) => handleInputChange('LastName', e.target.value)}
                  className="w-full h-12 bg-transparent text-white placeholder-white/40 border border-white/20 rounded-md focus:ring-fuchsia-500/40"
                  placeholder={t.lastNamePlaceholder}
                />
                {errors.LastName && (
                  <p className="text-red-400 text-sm mt-1">{errors.LastName}</p>
                )}
              </div>
            </div>

            <Separator className="my-6 bg-white/10" />

            {/* Date of Birth */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                {t.birthDateLabel}
              </label>
              <Input
                type="date"
                value={formData.DateOfBirth}
                onChange={(e) => handleInputChange('DateOfBirth', e.target.value)}
                className="w-full h-12 bg-transparent text-white placeholder-white/40 border border-white/20 rounded-md focus:ring-fuchsia-500/40"
              />
              {errors.DateOfBirth && (
                <p className="text-red-400 text-sm mt-1">{errors.DateOfBirth}</p>
              )}
            </div>

            {/* About Me */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                {t.aboutMeLabel}
              </label>
              <Textarea
                value={formData.AboutMe}
                onChange={(e) => handleInputChange('AboutMe', e.target.value)}
                className="w-full h-32 bg-transparent text-white placeholder-white/40 border border-white/20 rounded-md focus:ring-fuchsia-500/40"
                placeholder={t.aboutMePlaceholder}
              />
              {errors.AboutMe && (
                <p className="text-red-400 text-sm mt-1">{errors.AboutMe}</p>
              )}
            </div>

            <Separator className="my-6 bg-white/10" />

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                {t.cancelButton}
              </Button>

              <Button
                type="submit"
                disabled={saveLoading}
                className="px-6 py-3 bg-[#7c3aed] text-white rounded-md hover:bg-[#6a4399] transition-colors disabled:opacity-50"
              >
                {saveLoading ? t.savingButton : t.saveButton}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
