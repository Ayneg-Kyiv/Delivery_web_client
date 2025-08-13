"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Settings, Star } from "lucide-react";
import React, { useState, useEffect } from "react";
import { ProfileService } from "./profile-service";
import { ChangeUserDataDTO } from "./profile.d";

export default function Profile(): React.JSX.Element {
  // State for user data
  const [userData, setUserData] = useState<ApplicationUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState<ChangeUserDataDTO>({
    Email: "",
    FirstName: "",
    MiddleName: "",
    LastName: "",
    DateOfBirth: "",
    AboutMe: ""
  });
  const [saveLoading, setSaveLoading] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const response = await ProfileService.getUserProfile();
        if (response.Success && response.Data) {
          setUserData(response.Data);
          setFormData({
            Email: response.Data.email,
            FirstName: response.Data.firstName || "",
            MiddleName: response.Data.middleName || "",
            LastName: response.Data.lastName || "",
            DateOfBirth: response.Data.dateOfBirth || "",
            AboutMe: response.Data.aboutMe || ""
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Handle field changes
  const handleFieldChange = (key: keyof ChangeUserDataDTO, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle save changes
  const handleSaveField = async (fieldKey: string) => {
    setSaveLoading(true);
    try {
      const response = await ProfileService.changeUserData(formData);
      
      if (response.Success) {
        // Update local user data
        if (userData) {
          const updatedUser = { ...userData };
          switch (fieldKey) {
            case 'name':
              updatedUser.firstName = formData.FirstName;
              updatedUser.middleName = formData.MiddleName;
              updatedUser.lastName = formData.LastName;
              break;
            case 'email':
              updatedUser.email = formData.Email;
              break;
            case 'birthDate':
              updatedUser.dateOfBirth = formData.DateOfBirth;
              break;
          }
          setUserData(updatedUser);
        }
        setEditingField(null);
        alert('Дані успішно збережено!');
      } else {
        alert(`Помилка: ${response.Message || 'Не вдалося зберегти дані'}`);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Помилка при збереженні даних');
    } finally {
      setSaveLoading(false);
    }
  };

  // Get display name
  const getDisplayName = () => {
    if (!userData) return "Name Second name";
    const parts = [userData.firstName, userData.middleName, userData.lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : "Не вказано";
  };

  // Navigation items
  const navItems = ["Text", "Text", "Text", "Text"];

  // Form fields with dynamic data
  const formFields = [
    { 
      label: "Ім'я", 
      value: getDisplayName(),
      key: "name",
      editValue: `${formData.FirstName} ${formData.MiddleName} ${formData.LastName}`.trim()
    },
    { 
      label: "E-mail", 
      value: userData?.email || "@mail.com", 
      key: "email",
      editValue: formData.Email
    },
    {
      label: "Дата народження",
      value: userData?.dateOfBirth || "7/03/2000",
      key: "birthDate",
      hasHelp: true,
      editValue: formData.DateOfBirth
    },
    { 
      label: "Пароль", 
      value: "***********************", 
      key: "password",
      editValue: "***********************"
    },
    { 
      label: "Номер телефону", 
      value: "+38011 111 11 11", 
      key: "phone",
      editValue: "+38011 111 11 11"
    },
  ];

  // Rating stars (3 filled out of 5)
  const stars = [true, true, true, false, false];

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
                <AvatarFallback className="bg-[#d9d9d9]"></AvatarFallback>
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
                  Місяць
                </span>
                <div className="font-['Bahnschrift-Regular',Helvetica] font-normal text-white text-[28px] text-center mt-2">
                  {userData?.rating || 2}
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
                    <span 
                      className="text-sm text-white underline cursor-pointer hover:text-[#7f51b3]"
                      onClick={() => setEditingField(editingField === field.key ? null : field.key)}
                    >
                      {editingField === field.key ? 'Скасувати' : 'Змінити'}
                    </span>
                  </div>

                  <div className="relative mt-1">
                    {editingField === field.key && field.key !== 'password' ? (
                      <div className="flex gap-2">
                        {field.key === 'name' ? (
                          <div className="flex gap-2">
                            <Input
                              className="w-[120px] h-[41px] rounded-md border-2 border-[#c5c2c2] bg-transparent text-white"
                              placeholder="Ім'я"
                              value={formData.FirstName}
                              onChange={(e) => handleFieldChange('FirstName', e.target.value)}
                            />
                            <Input
                              className="w-[120px] h-[41px] rounded-md border-2 border-[#c5c2c2] bg-transparent text-white"
                              placeholder="По батькові"
                              value={formData.MiddleName}
                              onChange={(e) => handleFieldChange('MiddleName', e.target.value)}
                            />
                            <Input
                              className="w-[120px] h-[41px] rounded-md border-2 border-[#c5c2c2] bg-transparent text-white"
                              placeholder="Прізвище"
                              value={formData.LastName}
                              onChange={(e) => handleFieldChange('LastName', e.target.value)}
                            />
                          </div>
                        ) : (
                          <Input
                            className="w-[376px] h-[41px] rounded-md border-2 border-[#c5c2c2] bg-transparent text-white"
                            value={field.key === 'email' ? formData.Email : field.key === 'birthDate' ? formData.DateOfBirth : field.editValue}
                            onChange={(e) => {
                              if (field.key === 'email') handleFieldChange('Email', e.target.value);
                              if (field.key === 'birthDate') handleFieldChange('DateOfBirth', e.target.value);
                            }}
                            type={field.key === 'birthDate' ? 'date' : field.key === 'email' ? 'email' : 'text'}
                          />
                        )}
                        <Button
                          className="px-4 py-2 bg-[#7f51b3] text-white rounded hover:bg-[#6a4399]"
                          onClick={() => handleSaveField(field.key)}
                          disabled={saveLoading}
                        >
                          {saveLoading ? 'Збереження...' : 'Зберегти'}
                        </Button>
                      </div>
                    ) : (
                      <Input
                        className="w-[376px] h-[41px] rounded-md border-2 border-[#c5c2c2] bg-transparent text-[#c5c2c2] font-m3-title-small"
                        value={field.value}
                        type={field.key === "password" ? "password" : "text"}
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
