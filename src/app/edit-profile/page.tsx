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
import { apiGet } from "../api-client";

export default function EditProfile(): React.JSX.Element {
  const { messages } = useI18n();
  const t = messages.editProfile;
  const [formData, setFormData] = useState<ChangeUserDataDTO>({
    email: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    aboutMe: ""
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
            email: user.email || "",
            firstName: user.firstName || "",
            middleName: user.middleName || "",
            lastName: user.lastName || "",
            dateOfBirth: user.dateOfBirth || "",
            aboutMe: user.aboutMe || ""
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
    if (!formData.email) {
      newErrors.Email = t.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.Email = t.emailInvalid;
    }
    
    // First name validation
    if (formData.firstName && formData.firstName.length < 3) {
      newErrors.FirstName = t.firstNameMinLength;
    }
    
    // Middle name validation
    if (formData.middleName && formData.middleName.length < 3) {
      newErrors.MiddleName = t.middleNameMinLength;
    }
    
    // Last name validation
    if (formData.lastName && formData.lastName.length < 3) {
      newErrors.LastName = t.lastNameMinLength;
    }
    
    // About me validation
    if (formData.aboutMe && formData.aboutMe.length < 3) {
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
      console.log(session?.accessToken);
      const response = await ProfileService.changeUserData(formData, session?.accessToken || "");

      // Accept only Success key (API returns Success: true)
      if (response.Success ) {

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
    <main className="bg-[#130c1f] min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
          <p className="text-gray-300">{t.subtitle}</p>
        </div>

        {/* Form Card */}
        <Card className="bg-[#0f0e10] border border-[#2c1b48]">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-600 text-white p-4 rounded-md">
                  {successMessage}
                </div>
              )}

              {/* General Error (показувати тільки якщо немає successMessage і errors.general) */}
              {!successMessage && errors.general && (
                <div className="bg-red-600 text-white p-4 rounded-md">
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
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full h-12 bg-transparent border-2 border-[#c5c2c2] text-white rounded-md focus:border-[#7f51b3]"
                  placeholder={t.emailPlaceholder}
                />
                {errors.Email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <Separator className="my-6 bg-[#2c1b48]" />

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    {t.firstNameLabel}
                  </label>
                  <Input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full h-12 bg-transparent border-2 border-[#c5c2c2] text-white rounded-md focus:border-[#7f51b3]"
                    placeholder={t.firstNamePlaceholder}
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    {t.middleNameLabel}
                  </label>
                  <Input
                    type="text"
                    value={formData.middleName}
                    onChange={(e) => handleInputChange('middleName', e.target.value)}
                    className="w-full h-12 bg-transparent border-2 border-[#c5c2c2] text-white rounded-md focus:border-[#7f51b3]"
                    placeholder={t.middleNamePlaceholder}
                  />
                  {errors.middleName && (
                    <p className="text-red-400 text-sm mt-1">{errors.middleName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    {t.lastNameLabel}
                  </label>
                  <Input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full h-12 bg-transparent border-2 border-[#c5c2c2] text-white rounded-md focus:border-[#7f51b3]"
                    placeholder={t.lastNamePlaceholder}
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <Separator className="my-6 bg-[#2c1b48]" />

              {/* Date of Birth */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  {t.birthDateLabel}
                </label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full h-12 bg-transparent border-2 border-[#c5c2c2] text-white rounded-md focus:border-[#7f51b3]"
                />
                {errors.dateOfBirth && (
                  <p className="text-red-400 text-sm mt-1">{errors.dateOfBirth}</p>
                )}
              </div>

              {/* About Me */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  {t.aboutMeLabel}
                </label>
                <Textarea
                  value={formData.aboutMe}
                  onChange={(e) => handleInputChange('aboutMe', e.target.value)}
                  className="w-full h-32 bg-transparent border-2 border-[#c5c2c2] text-white rounded-md focus:border-[#7f51b3]"
                  placeholder={t.aboutMePlaceholder}
                />
                {errors.aboutMe && (
                  <p className="text-red-400 text-sm mt-1">{errors.aboutMe}</p>
                )}
              </div>

              <Separator className="my-6 bg-[#2c1b48]" />

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
                  className="px-6 py-3 bg-[#7f51b3] text-white rounded-md hover:bg-[#6a4399] transition-colors disabled:opacity-50"
                >
                  {saveLoading ? t.savingButton : t.saveButton}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
