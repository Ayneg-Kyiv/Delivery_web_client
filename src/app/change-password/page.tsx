"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { ProfileService } from "../profile/profile-service";
import { useI18n } from "@/i18n/I18nProvider";


export default function ChangePasswordPage(): React.JSX.Element {
  const { data: session } = useSession();
  const email = (session?.user as any)?.email || "";
  const { messages: t } = useI18n();

  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordChange = (field: keyof typeof passwords, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
  };

  const toggle = (field: keyof typeof show) => setShow(prev => ({ ...prev, [field]: !prev[field] }));

  const validate = () => {
    if (!email) return t.changePassword.validate.noEmail;
    if (!passwords.current || !passwords.new || !passwords.confirm) return t.changePassword.validate.fillAll;
    if (passwords.new.length < 6) return t.changePassword.validate.tooShort;
    if (passwords.new !== passwords.confirm) return t.changePassword.validate.mismatch;
    if (passwords.new === passwords.current) return t.changePassword.validate.sameAsCurrent;
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    const v = validate();
    if (v) { setError(v); return; }
    setSubmitting(true);
    try {
      const res = await ProfileService.changePassword(email, passwords.current, passwords.new, session?.accessToken || undefined);

      const ok = (res?.Success ?? res?.success ?? false) as boolean;
      const msg = (res?.Message ?? res?.message ?? t.changePassword.successDefault) as string;

      if (ok) {
        setMessage(msg);
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        setError(msg || t.changePassword.errorChangeDefault);
      }
    } catch (err: any) {
      setError(err?.message || t.changePassword.errorChangeDefault);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#130c1f] grid justify-items-center w-screen">
      <div className="bg-[#130c1f] w-full max-w-[1920px]">
        <div className="relative w-[1157px] min-h-[696px] mx-auto mt-[190px]">
          <div className="absolute w-full h-[600px] top-24 left-0 bg-[#0f0e10] border-b-8 border-b-[#2c1b48]" />

          <header className="absolute w-full h-[100px] top-0 left-0 bg-[#2c1b48] rounded-[8px_8px_0px_0px]">
            <h1 className="absolute top-5 left-1/2 -translate-x-1/2 font-['Bahnschrift-Regular',Helvetica] text-white text-3xl">
              {t.changePassword.header}
            </h1>
          </header>

          <form onSubmit={onSubmit} className="absolute w-[1002px] top-[185px] left-20">
            <div className="mb-6">
              <label htmlFor="current-password" className="block text-white text-lg mb-2">{t.changePassword.currentLabel}</label>
              <div className="relative">
                <input
                  id="current-password"
                  type={show.current ? "text" : "password"}
                  value={passwords.current}
                  onChange={(e) => handlePasswordChange("current", e.target.value)}
                  placeholder={t.changePassword.placeholder.password}
                  className="w-full h-[60px] px-4 rounded-md border-2 border-[#c5c2c2] bg-transparent text-white"
                />
                <button type="button" onClick={() => toggle("current")} className="absolute top-3.5 right-4 text-[#c5c2c2]">{show.current ? t.changePassword.toggles.hide : t.changePassword.toggles.show}</button>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="new-password" className="block text-white text-lg mb-2">{t.changePassword.newLabel}</label>
              <div className="relative">
                <input
                  id="new-password"
                  type={show.new ? "text" : "password"}
                  value={passwords.new}
                  onChange={(e) => handlePasswordChange("new", e.target.value)}
                  placeholder={t.changePassword.placeholder.newPassword}
                  className="w-full h-[60px] px-4 rounded-md border-2 border-[#c5c2c2] bg-transparent text-white"
                />
                <button type="button" onClick={() => toggle("new")} className="absolute top-3.5 right-4 text-[#c5c2c2]">{show.new ? t.changePassword.toggles.hide : t.changePassword.toggles.show}</button>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="confirm-password" className="block text-white text-lg mb-2">{t.changePassword.confirmLabel}</label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={show.confirm ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                  placeholder={t.changePassword.placeholder.confirmNewPassword}
                  className="w-full h-[60px] px-4 rounded-md border-2 border-[#c5c2c2] bg-transparent text-white"
                />
                <button type="button" onClick={() => toggle("confirm")} className="absolute top-3.5 right-4 text-[#c5c2c2]">{show.confirm ? t.changePassword.toggles.hide : t.changePassword.toggles.show}</button>
              </div>
            </div>

            {error && <div className="text-red-400 mb-3" role="alert">{error}</div>}
            {message && <div className="text-green-400 mb-3" role="status">{message}</div>}

            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                disabled={submitting}
                className="w-[242px] h-12 bg-[#94569f] rounded-lg hover:bg-[#a366ad] disabled:opacity-60"
              >
                <span className="text-white text-2xl">{submitting ? t.changePassword.submit.saving : t.changePassword.submit.save}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
