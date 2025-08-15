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

export default function EditProfile(): React.JSX.Element {
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
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/Account`;
        console.log('Шлях запиту до API:', url);
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
        console.log('Дані з API /Account:', data);
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
        console.error('Error loading user data:', error);
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
      newErrors.Email = "Email обов'язковий";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      newErrors.Email = "Неправильний формат email";
    }
    
    // First name validation
    if (formData.FirstName && formData.FirstName.length < 3) {
      newErrors.FirstName = "Ім'я повинно містити мінімум 3 символи";
    }
    
    // Middle name validation
    if (formData.MiddleName && formData.MiddleName.length < 3) {
      newErrors.MiddleName = "По батькові повинно містити мінімум 3 символи";
    }
    
    // Last name validation
    if (formData.LastName && formData.LastName.length < 3) {
      newErrors.LastName = "Прізвище повинно містити мінімум 3 символи";
    }
    
    // About me validation
    if (formData.AboutMe && formData.AboutMe.length < 3) {
      newErrors.AboutMe = "Опис повинен містити мінімум 3 символи";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
  setSaveLoading(true);
  setErrors({});
  setSuccessMessage("");
    
    try {
      const response = await ProfileService.changeUserData(formData);
  console.log('Відповідь API на зміну даних:', response);
      
      if (response.Success) {
        setErrors({});
        setSuccessMessage("Дані успішно оновлено!");
        // Optionally redirect back to profile page
        // window.location.href = '/profile';
        return;
      } else {
        if (response.Errors && response.Errors.length > 0) {
          const errorObj: Record<string, string> = {};
          response.Errors.forEach((error: string) => {
            errorObj.general = error;
          });
          setErrors(errorObj);
        } else {
          setErrors({ general: response.Message || 'Помилка при збереженні даних' });
        }
      }
    } catch (error: any) {
      console.error('Error saving data:', error);
      setErrors({ general: 'Помилка при збереженні даних' });
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-[#130c1f] min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Завантаження...</div>
      </main>
    );
  }

  return (
    <main className="bg-[#130c1f] min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Редагування профілю</h1>
          <p className="text-gray-300">Оновіть свої особисті дані</p>
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
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.Email}
                  onChange={(e) => handleInputChange('Email', e.target.value)}
                  className="w-full h-12 bg-transparent border-2 border-[#c5c2c2] text-white rounded-md focus:border-[#7f51b3]"
                  placeholder="your.email@example.com"
                />
                {errors.Email && (
                  <p className="text-red-400 text-sm mt-1">{errors.Email}</p>
                )}
              </div>

              <Separator className="my-6 bg-[#2c1b48]" />

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Ім'я
                  </label>
                  <Input
                    type="text"
                    value={formData.FirstName}
                    onChange={(e) => handleInputChange('FirstName', e.target.value)}
                    className="w-full h-12 bg-transparent border-2 border-[#c5c2c2] text-white rounded-md focus:border-[#7f51b3]"
                    placeholder="Іван"
                  />
                  {errors.FirstName && (
                    <p className="text-red-400 text-sm mt-1">{errors.FirstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    По батькові
                  </label>
                  <Input
                    type="text"
                    value={formData.MiddleName}
                    onChange={(e) => handleInputChange('MiddleName', e.target.value)}
                    className="w-full h-12 bg-transparent border-2 border-[#c5c2c2] text-white rounded-md focus:border-[#7f51b3]"
                    placeholder="Іванович"
                  />
                  {errors.MiddleName && (
                    <p className="text-red-400 text-sm mt-1">{errors.MiddleName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Прізвище
                  </label>
                  <Input
                    type="text"
                    value={formData.LastName}
                    onChange={(e) => handleInputChange('LastName', e.target.value)}
                    className="w-full h-12 bg-transparent border-2 border-[#c5c2c2] text-white rounded-md focus:border-[#7f51b3]"
                    placeholder="Іванов"
                  />
                  {errors.LastName && (
                    <p className="text-red-400 text-sm mt-1">{errors.LastName}</p>
                  )}
                </div>
              </div>

              <Separator className="my-6 bg-[#2c1b48]" />

              {/* Date of Birth */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Дата народження
                </label>
                <Input
                  type="date"
                  value={formData.DateOfBirth}
                  onChange={(e) => handleInputChange('DateOfBirth', e.target.value)}
                  className="w-full h-12 bg-transparent border-2 border-[#c5c2c2] text-white rounded-md focus:border-[#7f51b3]"
                />
                {errors.DateOfBirth && (
                  <p className="text-red-400 text-sm mt-1">{errors.DateOfBirth}</p>
                )}
              </div>

              {/* About Me */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Про себе
                </label>
                <Textarea
                  value={formData.AboutMe}
                  onChange={(e) => handleInputChange('AboutMe', e.target.value)}
                  className="w-full h-32 bg-transparent border-2 border-[#c5c2c2] text-white rounded-md focus:border-[#7f51b3]"
                  placeholder="Розкажіть про себе..."
                />
                {errors.AboutMe && (
                  <p className="text-red-400 text-sm mt-1">{errors.AboutMe}</p>
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
                  Скасувати
                </Button>
                
                <Button
                  type="submit"
                  disabled={saveLoading}
                  className="px-6 py-3 bg-[#7f51b3] text-white rounded-md hover:bg-[#6a4399] transition-colors disabled:opacity-50"
                >
                  {saveLoading ? 'Збереження...' : 'Зберегти зміни'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
