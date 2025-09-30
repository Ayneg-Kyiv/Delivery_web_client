"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '../api-client';
import Image from 'next/image';
import ContentBox from '@/components/ui/content-box';
import Button from '@/components/ui/button';
import TextInputGroup from '@/components/ui/text-input-group';
import DateInputGroup from '@/components/ui/date-input-group';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';
import { AuthService } from '../auth-service';

const SignupPage: React.FC = () => {
    const { messages: t } = useI18n();
    const router = useRouter();
    const [stage, setStage] = useState(1);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [birthDate, setBirthDate] = useState('0000.00.00');
    const [birthDateError, setBirthDateError] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchCsrf = async () => {
            try {
                await ApiClient.get<null>('/csrf');
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        };
        fetchCsrf();
    }, []);

    const handleEmailChange = (newEmail: string) => {
        setEmail(newEmail);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailError(newEmail.length > 0 && !emailRegex.test(newEmail));
    };

    const handlePasswordChange = (newPassword: string) => {
        setPassword(newPassword);
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        setPasswordError(newPassword.length > 0 && !passwordRegex.test(newPassword));
        if (error) setError(undefined);
    };

    const handleConfirmPasswordChange = (newConfirmPassword: string) => {
        setConfirmPassword(newConfirmPassword);
        setConfirmPasswordError(newConfirmPassword !== password);
    };

    const handleBirthDateChange = (newBirthDate: string) => {
        setBirthDate(newBirthDate);
        setBirthDateError(newBirthDate < '1900-01-01');
    };

    const handleFirstNameChange = (newFirstName: string) => {
        setFirstName(newFirstName);
    };

    const handleLastNameChange = (newLastName: string) => {
        setLastName(newLastName);
    };

    const handlePhoneNumberChange = (newPhoneNumber: string) => {
        setPhoneNumber(newPhoneNumber);
        const phoneNumberRegex = /^\+?[0-9]\d{1,14}$/;
        setPhoneNumberError(newPhoneNumber.length > 0 && !phoneNumberRegex.test(newPhoneNumber));
    };

    const handleSignUp = async (event: React.FormEvent) => {
        event.preventDefault();
        const response = await AuthService.register(email, password, firstName, lastName, phoneNumber, birthDate);
        if (response?.success) {
            setStage(4);
        } else {
            setError('Sign up failed. Please try again.');
        }
    };

    const handleSignupStage1 = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await ApiClient.get(`/auth/check-is-email-exists/${email}`);
            if (response.success) {
                router.push('/user-exists');
            } else {
                setStage(2);
            }
        } catch (error) {
            router.push('/error');
        }
    };

    const handleSignupStage2 = (event: React.FormEvent) => {
        event.preventDefault();
        if (!passwordError && !confirmPasswordError) {
            setStage(3);
        }
    };

    const renderContentForStage1 = () => (
        <ContentBox>
            <form className='flex-1 flex flex-col h-full items-center justify-center' onSubmit={handleSignupStage1}>
                <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                    <Image src='/logo/Logo.png' alt="Logo" width={215} height={60}/>
                    <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mt-2 mb-4 text-center">
                        {t.signup.stage1.title}
                    </h1>
                    <p className='font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                        {t.signup.stage1.subtitle}
                    </p>
                </div>
                <div className="flex-1 w-full max-w-[500px] space-y-5 flex flex-col">
                    <TextInputGroup
                        label={t.signup.emailLabel}
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        type="email"
                        className=""
                        inputClassName={`floating-input ${emailError ? 'floating-input-error' : ''}`}
                        labelClassName={`${email ? ' filled' : ''} ${emailError ? ' floating-label-error' : ''}`}
                        placeholder=""
                    />
                    <input type="submit" value={t.signup.stage1.continueButton}
                        className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
                    />
                    <div className="flex-1 pt-4 space-y-4">
                        <div className="font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
                            <span className="text-[#e4e4e4] pr-2">{t.signup.stage1.hasAccount}</span>
                            <Button onClick={() => router.push('/signin')} text={t.signup.stage1.login}
                                className="p-0 h-auto font-body-2 text-[#2892f6] text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] hover:underline"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </ContentBox>
    );

    const renderContentForStage2 = () => (
        <ContentBox>
            <form className='flex-1 flex pt-20 p-20 flex-col h-full items-center justify-center' onSubmit={handleSignupStage2}>
                <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                    <Image src='/logo/Logo.png' alt="Logo" width={215} height={60}/>
                    <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mt-2 mb-4 text-center">
                        {t.signup.stage2.title}
                    </h1>
                    <p className='font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                        {t.signup.stage2.subtitle}
                    </p>
                </div>
                <div className="flex-1 w-full max-w-[500px] space-y-5 flex flex-col">
                    <TextInputGroup
                        label={t.signup.stage2.passwordLabel}
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        type="password"
                        className="floating-input-group-without-margin"
                        inputClassName={`floating-input ${passwordError ? 'floating-input-error' : ''}`}
                        labelClassName={`${password ? ' filled' : ''} ${passwordError ? ' floating-label-error' : ''}`}
                        placeholder=""
                    />
                    {!error && <p className='text-sm mt-[4px] pl-[12px]'>{t.signup.stage2.passwordHint}</p>}
                    {passwordError && (
                        <div className={`flex flex-row items-center mt-[8px]`}>
                            <Image src='/ErrorVector1.png' alt="Lock Icon" width={6} height={6} className='h-[24px] w-[24px] mr-[20px]'/>
                            <p className='text-[#ED2B2B] text-sm'>{t.signup.stage2.passwordError}</p>
                        </div>
                    )}
                    <TextInputGroup
                        label={t.signup.stage2.confirmPasswordLabel}
                        value={confirmPassword}
                        onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                        type="password"
                        className={`${confirmPasswordError ? 'floating-input-group-without-margin' : ''}`}
                        inputClassName={`floating-input ${confirmPasswordError ? 'floating-input-error' : ''}`}
                        labelClassName={`${confirmPassword ? ' filled' : ''} ${confirmPasswordError ? ' floating-label-error' : ''}`}
                        placeholder=""
                    />
                    {confirmPasswordError && (
                        <div className={`flex flex-row items-center mt-[8px]`}>
                            <Image src='/ErrorVector1.png' alt="Lock Icon" width={6} height={6} className='h-[24px] w-[24px] mr-[20px]'/>
                            <p className='text-[#ED2B2B] text-sm'>{t.signup.stage2.confirmPasswordError}</p>
                        </div>
                    )}
                    <input type="submit" value={t.signup.stage2.continueButton}
                        className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
                    />
                </div>
            </form>
        </ContentBox>
    );

    const renderContentForStage3 = () => (
        <ContentBox>
            <form className='flex-1 flex pt-20 p-20 flex-col h-full items-center justify-center' onSubmit={handleSignUp}>
                <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                    <Image src='/logo/Logo.png' alt="Logo" width={215} height={60}/>
                    <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mt-2 mb-4 text-center">
                        {t.signup.stage3.title}
                    </h1>
                    <p className='font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                        {t.signup.stage3.subtitle}
                    </p>
                </div>
                <div className="flex-1 w-full max-w-[500px] space-y-5 flex flex-col">
                    <div className='flex flex-row space-x-2'>
                        <TextInputGroup
                            label={t.signup.stage3.firstNameLabel}
                            value={firstName}
                            type='text'
                            onChange={(e) => handleFirstNameChange(e.target.value)} />
                        <TextInputGroup
                            label={t.signup.stage3.lastNameLabel}
                            value={lastName}
                            type='text'
                            onChange={(e) => handleLastNameChange(e.target.value)} />
                    </div>
                    <DateInputGroup
                        label={t.signup.stage3.birthDateLabel}
                        value={birthDate}
                        onChange={(e) => handleBirthDateChange(e.target.value)}
                        className={`${birthDateError ? 'floating-input-group-without-margin' : ''}`}
                        inputClassName={`floating-input ${birthDateError ? 'floating-input-error' : ''}`}
                        labelClassName={`${birthDate ? ' filled' : ''} ${birthDateError ? ' floating-label-error' : ''}`}
                    />
                    <TextInputGroup
                        label={t.signup.stage3.phoneNumberLabel}
                        value={phoneNumber}
                        type='tel'
                        className={`${phoneNumberError ? 'floating-input-group-without-margin' : ''}`}
                        inputClassName={`floating-input ${phoneNumberError ? 'floating-input-error' : ''}`}
                        labelClassName={`${phoneNumber ? ' filled' : ''} ${phoneNumberError ? ' floating-label-error' : ''}`}
                        onChange={(e) => handlePhoneNumberChange(e.target.value)} />
                    <input type="submit" value={t.signup.stage3.continueButton}
                        className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
                    />
                </div>
            </form>
        </ContentBox>
    );

    const renderContentForStage4 = () => (
        <ContentBox>
            <div className='flex-1 p-20 flex flex-col items-center justify-stretch'>
                <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                    <Image src='/logo/Logo.png' alt="Logo" width={215} height={60} className='mb-2'/>
                    <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mb-4 text-center">
                        {t.signup.stage4.title}
                    </h1>
                    <p className='pb-4 font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                        {t.signup.stage4.subtitle}
                    </p>
                </div>
                <div className="flex-1 w-full max-w-[500px]">
                    <div className="space-y-10 flex flex-col font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
                        <Link href='/' className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)] rounded-lg flex items-center justify-center">{t.signup.stage4.mainButton}</Link>
                    </div>
                </div>
            </div>
        </ContentBox>
    );

    if (stage === 1) return renderContentForStage1();
    if (stage === 2) return renderContentForStage2();
    if (stage === 3) return renderContentForStage3();
    if (stage === 4) return renderContentForStage4();
    return null;
}

export default SignupPage;