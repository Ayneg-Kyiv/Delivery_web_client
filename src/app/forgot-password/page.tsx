"use client";

import React from 'react';
import { ApiClient } from '../api-client';
import { useRouter } from 'next/navigation';
import ContentBox from '@/components/ui/content-box';
import Image from 'next/image';
import TextInputGroup from '@/components/ui/text-input-group';
import Button from '@/components/ui/button';
import { useI18n } from '@/i18n/I18nProvider';

function ForgotPasswordPage({ router }: { router: ReturnType<typeof useRouter> }) {
    const { messages: t } = useI18n();
    const [email, setEmail] = React.useState('');
    const [error, setError] = React.useState<string | undefined>(undefined);
    const [emailError, setEmailError] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchCsrf = async () => {
            try {
                await ApiClient.get<null>('/csrf');
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        };
        fetchCsrf();
    }, []);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail) && newEmail.length > 0) {
            setEmailError(true);
        } else {
            setEmailError(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError(t.forgotPassword.invalidEmail);
            return;
        }

        setLoading(true);
        setError(undefined);

        try {
            const response = await ApiClient.post('/account/forgot-password', { email });

            if (response?.success) {
                router.push(`/forgot-password-confirmation?email=${encodeURIComponent(email)}`);
            } else {
                setError(t.forgotPassword.emailNotFound);
            }
        } catch (err) {
            setError(t.forgotPassword.genericError);
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
                        {t.forgotPassword.title}
                    </h1>

                    <p className='pt-2 font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                        {t.forgotPassword.subtitle}
                    </p>
                </div>

                <div className="pt-4 flex-1 w-full max-w-[500px] space-y-6">
                    <div className="space-y-5 flex flex-col">
                        <TextInputGroup
                            label={t.forgotPassword.emailLabel}
                            value={email}
                            onChange={handleEmailChange}
                            type="email"
                            className=""
                            inputClassName={`floating-input ${emailError ? 'floating-input-error' : ''}`}
                            labelClassName={`${email ? ' filled' : ''} ${emailError ? ' floating-label-error' : ''}`}
                            placeholder=""
                        />

                        <div className={`flex flex-row items-center ${error ? '' : 'hidden'}`}>
                            <Image src='/ErrorVector1.png' alt="Lock Icon" width={6} height={6} className='h-[24px] w-[24px] mr-[20px]'/>
                            <p className='text-[#ED2B2B]'>
                                {error}
                            </p>
                        </div>
                    </div>

                    <input type="submit" value={t.forgotPassword.submitButton}
                        disabled={loading}
                        className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)] disabled:opacity-50"
                    />

                    <div className="flex flex-col font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
                        <Button onClick={() => router?.push('/signin')} text={t.forgotPassword.backToLogin}
                            className="p-0 h-auto font-body-2 text-[#2892f6] text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] hover:underline"
                        />
                    </div>
                </div>
            </form>
        </ContentBox>
    );
}

export default function ForgotPasswordPageWrapper() {
    const router = useRouter();
    return <ForgotPasswordPage router={router} />;
}