'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '../api-client';
import Button from '@/components/ui/button';
import TextInputGroup from '@/components/ui/text-input-group';
import ContentBox from '@/components/ui/content-box';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useI18n } from '@/i18n/I18nProvider';
import { AuthService } from '../auth-service';

const SignInPage: React.FC = () => {
    const { messages: t } = useI18n();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        const initCsrf = async () => {
            try {
                await ApiClient.get<null>('/csrf');
            } catch (error) {
                setError(`Failed to initialize sign-in. ${error} Please try again.`);
            }
        };
        initCsrf();
    }, []);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailError(newEmail.length > 0 && !emailRegex.test(newEmail));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&_*])(?=.{8,})/;
        setPasswordError(newPassword.length > 0 && !passwordRegex.test(newPassword));
        if (error) setError(undefined);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await AuthService.login(email, password, rememberMe);
            if (response?.ok) {
                router.push('/');
            } else {
                setError(t.signin.error);
            }
        } catch (err) {
            setError(`Sign in failed. ${err} Please try again.`);
        }
    };

    return (
        <ContentBox height='860px' lheight='800px'>
            <form className="flex-1 h-full flex flex-col items-center" onSubmit={handleSubmit}>
                <Image src='/logo/Logo.png' alt="Logo" width={215} height={60}/>
                <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mb-16 text-center">
                    {t.signin.welcome}
                </h1>
                <div className="flex-1 w-full max-w-[500px] space-y-5">
                    <div className="space-y-5 flex flex-col">
                        <TextInputGroup
                            label={t.signin.emailLabel}
                            value={email}
                            onChange={handleEmailChange}
                            type="email"
                            className=""
                            inputClassName={`floating-input ${emailError ? 'floating-input-error' : ''}`}
                            labelClassName={`${email ? ' filled' : ''} ${emailError ? ' floating-label-error' : ''}`}
                            placeholder=""
                        />
                        <TextInputGroup
                            label={t.signin.passwordLabel}
                            value={password}
                            onChange={handlePasswordChange}
                            type={showPassword ? 'text' : 'password'}
                            className=""
                            inputClassName={`floating-input ${passwordError ? 'floating-input-error' : ''}`}
                            labelClassName={`${password ? ' filled' : ''} ${passwordError ? ' floating-label-error' : ''}`}
                            placeholder=""
                        />
                    </div>
                    <div className='h-8'>
                        {error && <div className="text-[#ED2B2B] text-3xl">{error}</div>}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div
                                className={`custom-checkbox-outer${rememberMe ? " custom-checkbox-checked" : ""}`}
                                onClick={() => setRememberMe(!rememberMe)}
                                tabIndex={0}
                                role="checkbox"
                                aria-checked={rememberMe}
                                id={"remember"}
                                style={{ outline: "none" }}
                            >
                                <div className="custom-checkbox-inner" />
                            </div>
                            <label htmlFor="remember" className="pl-2 font-body-2 text-[#e4e4e4] text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] cursor-pointer">
                                {t.signin.rememberMe}
                            </label>
                        </div>
                        <Button onClick={() => router.push('/forgot-password')} text={t.signin.forgotPassword}
                            className="p-0 h-auto font-body-2 text-[#2892f6] text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] hover:underline"
                        />
                    </div>
                    <input type="submit" value={t.signin.loginButton}
                        className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
                    />
                    <div className="pt-4 space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="font-body-2 text-[#e4e4e4] text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
                                {t.signin.loginWith}
                            </span>
                            <Button onClick={() => signIn('google')} text='' className="p-0 h-auto">
                                <Image src='/google-icon-logo-svgrepo-com.svg' alt="Google" width={32} height={32}/>
                            </Button>
                        </div>
                        <div className="font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
                            <span className="text-[#e4e4e4] pr-2">
                                {t.signin.noAccount}
                            </span>
                            <Button onClick={() => router.push('/signup')} text={t.signin.createAccount}
                                className="p-0 h-auto font-body-2 text-[#2892f6] text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] hover:underline"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </ContentBox>
    );
}

export default SignInPage;
