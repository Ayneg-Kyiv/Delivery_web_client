"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { ProfileService } from "../profile/profile-service";
import { useI18n } from "@/i18n/I18nProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


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
      const res = await ProfileService.changePassword(email, passwords.current, passwords.new, session?.accessToken || undefined,);
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
    <main className="relative flex min-h-[70vh] flex-col bg-[#130c1f] items-center justify-center w-full px-4 py-16">
      {/* Ambient blurred gradient background (same style language as profile) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-[#724C9D] opacity-30 blur-3xl" />
        <div className="absolute top-24 -right-28 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500 opacity-20 blur-[120px]" />
        <div className="absolute bottom-[-6rem] right-1/4 h-72 w-72 rounded-full bg-indigo-500 opacity-25 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-emerald-400 opacity-[0.12] blur-[90px]" />
      </div>

      {/* Glass card */}
      <section className="w-full max-w-[700px] bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.45)]">
        <div className="px-6 py-6 md:px-10 md:py-10">
          <h1 className="text-white text-2xl md:text-3xl font-semibold text-center mb-8">{t.changePassword.header}</h1>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="current-password" className="block text-white/90 text-sm mb-2">{t.changePassword.currentLabel}</label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={show.current ? "text" : "password"}
                  value={passwords.current}
                  onChange={(e) => handlePasswordChange("current", e.target.value)}
                  placeholder={t.changePassword.placeholder.password}
                  className="w-full h-12 bg-transparent text-white placeholder-white/40 border-white/20 focus:ring-fuchsia-500/40"
                />
                <button
                  type="button"
                  onClick={() => toggle("current")}
                  className="absolute top-2.5 right-3 text-white/70 hover:text-white text-sm"
                >
                  {show.current ? t.changePassword.toggles.hide : t.changePassword.toggles.show}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="new-password" className="block text-white/90 text-sm mb-2">{t.changePassword.newLabel}</label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={show.new ? "text" : "password"}
                  value={passwords.new}
                  onChange={(e) => handlePasswordChange("new", e.target.value)}
                  placeholder={t.changePassword.placeholder.newPassword}
                  className="w-full h-12 bg-transparent text-white placeholder-white/40 border-white/20 focus:ring-fuchsia-500/40"
                />
                <button
                  type="button"
                  onClick={() => toggle("new")}
                  className="absolute top-2.5 right-3 text-white/70 hover:text-white text-sm"
                >
                  {show.new ? t.changePassword.toggles.hide : t.changePassword.toggles.show}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-white/90 text-sm mb-2">{t.changePassword.confirmLabel}</label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={show.confirm ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                  placeholder={t.changePassword.placeholder.confirmNewPassword}
                  className="w-full h-12 bg-transparent text-white placeholder-white/40 border-white/20 focus:ring-fuchsia-500/40"
                />
                <button
                  type="button"
                  onClick={() => toggle("confirm")}
                  className="absolute top-2.5 right-3 text-white/70 hover:text-white text-sm"
                >
                  {show.confirm ? t.changePassword.toggles.hide : t.changePassword.toggles.show}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-400/30 text-red-200 px-3 py-2 rounded-lg" role="alert" aria-live="assertive">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-emerald-500/10 border border-emerald-400/30 text-emerald-200 px-3 py-2 rounded-lg" role="status" aria-live="polite">
                {message}
              </div>
            )}

            <div className="pt-2 flex justify-center">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full md:w-[240px] h-11 bg-[#7c3aed] hover:bg-[#6b2fd7] text-white font-semibold rounded-lg disabled:opacity-60"
              >
                {submitting ? t.changePassword.submit.saving : t.changePassword.submit.save}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
