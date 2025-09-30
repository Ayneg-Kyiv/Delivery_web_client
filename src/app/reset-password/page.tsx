"use client";

import React, { useState, useEffect } from 'react';
import { ApiClient } from '../api-client';
import { AuthService } from '../auth-service';
import { useRouter, useSearchParams } from 'next/navigation';
import ContentBox from '@/components/ui/content-box';
import Image from 'next/image';
import TextInputGroup from '@/components/ui/text-input-group';
import { useI18n } from '@/i18n/I18nProvider';

function ResetPasswordPage({ token, email, router }: { token: string; email: string; router: ReturnType<typeof useRouter> }) {
    const { messages: t } = useI18n();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);

    useEffect(() => {
        ApiClient.get<null>('/csrf').catch(error => console.error('Error fetching CSRF token:', error));
    }, []);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&_*]).{8,}$/;
        setPasswordError(newPassword.length > 0 && !passwordRegex.test(newPassword));
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        setConfirmPasswordError(newConfirmPassword !== password);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (passwordError || confirmPasswordError || !password || !confirmPassword) {
            setError(t.resetPassword.error);
            return;
        }

        setLoading(true);
        setError(undefined);

        try {
            const response = await AuthService.resetPassword(email, token, password);
            if (response?.success) {
                // Assuming a success page exists, otherwise redirect to signin
                router.push('/signin?reset=success'); 
            } else {
                setError(t.resetPassword.apiError);
            }
        } catch (err) {
            setError(`${t.resetPassword.genericError}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ContentBox>
            <form className='flex-1 flex flex-col items-center h-full justify-stretch' onSubmit={handleSubmit}>
                <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                    <Image src='/logo/Logo.png' alt="Logo" width={215} height={60} className='mb-2'/>
                    <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mb-4 text-center">
                        {t.resetPassword.title}
                    </h1>
                    <p className='pt-2 font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                        {t.resetPassword.subtitle}
                    </p>
                </div>
                
                <div className="pt-4 flex-1 w-full max-w-[500px] space-y-6">
                    <div className="space-y-5 flex flex-col">
                        <TextInputGroup
                            label={t.resetPassword.passwordLabel}
                            value={password}
                            onChange={handlePasswordChange}
                            type="password"
                            className=""
                            inputClassName={`floating-input ${passwordError ? 'floating-input-error' : ''}`}
                            labelClassName={`${password ? ' filled' : ''} ${passwordError ? ' floating-label-error' : ''}`}
                            placeholder=""
                        />
                        {passwordError && <p className="text-red-500 text-sm">{t.resetPassword.passwordError}</p>}

                        <TextInputGroup
                            label={t.resetPassword.confirmPasswordLabel}
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            type="password"
                            className=""
                            inputClassName={`floating-input ${confirmPasswordError ? 'floating-input-error' : ''}`}
                            labelClassName={`${confirmPassword ? ' filled' : ''} ${confirmPasswordError ? ' floating-label-error' : ''}`}
                        />
                        {confirmPasswordError && <p className="text-red-500 text-sm">{t.resetPassword.confirmPasswordError}</p>}
                        
                        {error && <p className="text-red-500 text-center">{error}</p>}

                        <input
                            type="submit"
                            value={loading ? t.resetPassword.loadingButton : t.resetPassword.submitButton}
                            disabled={loading}
                            className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)] disabled:opacity-50"
                        />
                    </div>
                </div>
            </form>
        </ContentBox>
    );
}

export default function ResetPasswordPageWrapper() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';
    const email = searchParams.get('email') || '';
    return <ResetPasswordPage router={router} token={token} email={email} />;
}