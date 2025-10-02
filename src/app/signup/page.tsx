"use client";

import React from 'react';
import { AuthService } from '../auth-service';
import { useRouter } from 'next/navigation';
import { ApiClient } from '../api-client';
import Image from 'next/image';
import ContentBox from '@/components/ui/content-box';
import Button from '@/components/ui/button';
import TextInputGroup from '@/components/ui/text-input-group';
import DateInputGroup from '@/components/ui/date-input-group';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

class SignupPage extends React.Component<SignupPageProps, SignupPageState> {
    constructor(props: SignupPageProps) {
        super(props);
        this.state = {
            stage: 1,
            
            email: '',
            emailError: false,

            birthDate: '0000.00.00',
            birthDateError: false,

            password: '',
            passwordError: false,
            showPassword: false,
            
            confirmPassword: '',
            confirmPasswordError: false,
            showConfirmPassword: false,
            
            firstName: '',
            lastName: '',
            
            phoneNumber: '',
            phoneNumberError: false,
            error: undefined
        };
    }

    async componentDidMount() {
        try{
            await ApiClient.get<null>('/csrf');
        }catch (error) {
            // console.error('Error fetching CSRF token:', error);
        }
    }

    handleEmailChange = (email: string) => {
        this.setState({ email });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email) && email.length > 0) 
            this.setState({ emailError: true });
        else 
            this.setState({ emailError: false });
    };

    handlePasswordChange = (password: string) => {
        this.setState({ password });

        if (password.length > 0 && password.length < 8) 
            this.setState({ error: this.props.t?.signup?.stage2?.passwordError ?? 'Password must be at least 8 characters long' });
        else 
            this.setState({ error: undefined });
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
            if (!passwordRegex.test(password) && password.length > 0) {
                this.setState({ passwordError: true });
            } else {
                this.setState({ passwordError: false });
            }
    };

    handleConfirmPasswordChange = (confirmPassword: string) => {
        this.setState({ confirmPassword });

        if (confirmPassword !== this.state.password) 
            this.setState({ confirmPasswordError: true });
        else 
            this.setState({ confirmPasswordError: false });
        
    };

    handleBirthDateChange = (birthDate: string) => {
        this.setState({ birthDate });

        if (birthDate < '1900-01-01' ) {
            this.setState({ birthDateError: true });
        } else {
            this.setState({ birthDateError: false });
        }
    };

    handleFirstNameChange = (firstName: string) => {
        this.setState({ firstName });
    };

    handleLastNameChange = (lastName: string) => {
        this.setState({ lastName });
    };

    handlePhoneNumberChange = (phoneNumber: string) => {
        this.setState({ phoneNumber });

        const phoneNumberRegex = /^\+?[0-9]\d{1,14}$/;
        if (!phoneNumberRegex.test(phoneNumber) && phoneNumber.length > 0) {
            this.setState({ phoneNumberError: true });
        } else {
            this.setState({ phoneNumberError: false });
        }
    };

    handleSignUp = async (event: React.FormEvent) => {
        event.preventDefault();
        
        const response = await AuthService.register(
            this.state.email,
            this.state.password,
            this.state.firstName,
            this.state.lastName,
            this.state.phoneNumber,
            this.state.birthDate
        );

        if (response?.success) 
            this.setState({ stage: 4 });
        else 
            this.setState({ error: this.props.t?.signup?.signUpFailed ?? 'Sign up failed. Please try again.' });
        
    };

    // Stage 1
    handleSignupStage1 = async (event: React.FormEvent) => {
        // Handle the first stage of signup
        event.preventDefault();

        const email = this.state;

        try{
            const response = await ApiClient.get(`/auth/check-is-email-exists/${this.state.email}`);

            if( response.success ){
                this.props.router?.push('/user-exists');
            }
            else {
                this.setState({ stage: 2 });
            }
        } catch (error) {
            this.props.router?.push('/error');
        }
    }


    renderContentForStage1 = () => {
        const t = this.props.t;
        return (
            <ContentBox>
                
                <form className='flex-1 flex flex-col h-full items-center' onSubmit={this.handleSignupStage1}>
                       
                    <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                        <Image src='/logo/Logo.png' alt={t?.nav?.logoAlt ?? 'Logo'} width={215} height={60}/>

                        <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mt-2 mb-4 text-center">
                            {t?.signup?.stage1?.title ?? 'Create your Cargix account'}
                        </h1>

                        <p className='font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                           {t?.signup?.stage1?.subtitle ?? 'Enter your email address to continue.'}
                        </p>
                    </div>

                    <div className="flex-1 w-full max-w-[500px] space-y-5 flex flex-col">
                        <TextInputGroup
                                label={t?.signup?.emailLabel ?? 'E-mail'}
                                value={this.state.email}
                                onChange={(e) => this.handleEmailChange(e.target.value)}
                                type="email"
                                className=""
                                inputClassName={`floating-input ${this.state.emailError ? 'floating-input-error' : ''}`}
                                labelClassName={`${this.state.email ? ' filled' : ''} ${this.state.emailError ? ' floating-label-error' : ''}`}
                                placeholder=""
                            />

                        <input type="submit" value={t?.signup?.stage1?.continueButton ?? 'Continue'}
                            className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
                        />
                        
                        <div className="flex-1 pt-4 space-y-4">
                            <div className="font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
                                <span className="text-[#e4e4e4] pr-2">
                                    {t?.signup?.stage1?.hasAccount ?? 'Have an account?'}
                                </span>
                                <Button onClick={() => this.props.router?.push('/signin')} text={t?.signup?.stage1?.login ?? 'Login'}
                                    className="p-0 h-auto font-body-2 text-[#2892f6] text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] hover:underline"
                                    />
                            </div>
                        </div>

                    </div>

                </form>
                
            </ContentBox>
        );
    };
    // 

    // Stage 2 
    handleSignupStage2 = async (event : React.FormEvent) => {
        event.preventDefault();

        if(!this.state.passwordError && !this.state.confirmPasswordError) {
            this.setState({ stage: 3 });
        }
    }

    renderContentForStage2 = () => {
        const t = this.props.t;
        return (
            <ContentBox>
                
                <form className='flex-1 flex flex-col h-full items-center ' onSubmit={this.handleSignupStage2}>
                       
                    <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                        <Image src='/logo/Logo.png' alt={t?.nav?.logoAlt ?? 'Logo'} width={215} height={60}/>
                        
                        <h1 className="font-title-2 mt-2 mb-4 text-center">
                            {t?.signup?.stage2?.title ?? 'Set a password'}
                        </h1>

                        <p className='font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                           {t?.signup?.stage2?.subtitle ?? 'Enter a password for your account.'}
                        </p>
                    </div>

                    <div className="flex-1 w-full max-w-[500px] space-y-5 flex flex-col">
                        <TextInputGroup
                                label={t?.signup?.stage2?.passwordLabel ?? 'Password'}
                                value={this.state.password}
                                onChange={(e) => this.handlePasswordChange(e.target.value)}
                                type="password"
                                className="floating-input-group-without-margin"
                                inputClassName={`floating-input ${this.state.passwordError ? 'floating-input-error' : ''}`}
                                labelClassName={`${this.state.password ? ' filled' : ''} ${this.state.passwordError ? ' floating-label-error' : ''}`}
                                placeholder=""
                            />

                        {!this.state.error && (
                        <p className='text-sm text-stretch mt-[4px] pl-[12px]'>
                           {t?.signup?.stage2?.passwordHint ?? 'Password must be at least 8 characters long, including upper and lower case letters, numbers and special characters.'}
                        </p>
                        )}
                        {this.state.passwordError && (
                            <div className={`flex flex-row items-center  mt-[8px]`}>
                                <Image src='/ErrorVector1.png' alt="Lock Icon" width={6} height={6} className='h-[24px] w-[24px] mr-[20px]'/>
                                <p className='text-[#ED2B2B] text-sm text-stretch'>
                                    {t?.signup?.stage2?.passwordError ?? 'Password must be at least 8 characters long, including upper and lower case letters, numbers and special characters.'}
                                </p>
                            </div>
                        )}

                        <TextInputGroup
                                label={t?.signup?.stage2?.confirmPasswordLabel ?? 'Confirm password'}
                                value={this.state.confirmPassword}
                                onChange={(e) => this.handleConfirmPasswordChange(e.target.value)}
                                type="password"
                                className={`${this.state.confirmPasswordError ? 'floating-input-group-without-margin' : ''}`}
                                inputClassName={`floating-input ${this.state.confirmPasswordError ? 'floating-input-error' : ''}`}
                                labelClassName={`${this.state.confirmPassword ? ' filled' : ''} ${this.state.confirmPasswordError ? ' floating-label-error' : ''}`}
                                placeholder=""
                            />
                            
                        {this.state.confirmPasswordError && (
                            <div className={`flex flex-row items-center mt-[8px]`}>
                                <Image src='/ErrorVector1.png' alt="Lock Icon" width={6} height={6} className='h-[24px] w-[24px] mr-[20px]'/>
                                <p className='text-[#ED2B2B] text-sm text-stretch'>
                                    {t?.signup?.stage2?.confirmPasswordError ?? 'Passwords must match.'}
                                </p>
                            </div>
                        )}

                        <input type="submit" value={t?.signup?.stage2?.continueButton ?? 'Continue'}
                            className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
                        />

                    </div>

                </form>
                
            </ContentBox>
        );
    };
// 

// Stage 3
renderContentForStage3 = () => {
    const t = this.props.t;
    return (
        <ContentBox>
            <form className='flex-1 flex flex-col h-full items-center ' onSubmit={this.handleSignUp}>
                
                    <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                        <Image src='/logo/Logo.png' alt={t?.nav?.logoAlt ?? 'Logo'} width={215} height={60}/>
                        
                        <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mt-2 mb-4 text-center">
                            {t?.signup?.stage3?.title ?? 'Last step'}
                        </h1>

                        <p className='font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                           {t?.signup?.stage3?.subtitle ?? 'Enter the specified information.'}
                        </p>
                    </div>
                    
                    <div className="flex-1 w-full max-w-[500px] space-y-5 flex flex-col">
                        
                        <div className='flex flex-col md:flex-row space-x-2'>
                            <TextInputGroup
                                label={t?.signup?.stage3?.firstNameLabel ?? 'First name'}
                                value={this.state.firstName}
                                type='text'
                                onChange={(e) => this.handleFirstNameChange(e.target.value)} />

                            <TextInputGroup
                                label={t?.signup?.stage3?.lastNameLabel ?? 'Last name'}
                                value={this.state.lastName}
                                type='text'
                                onChange={(e) => this.handleLastNameChange(e.target.value)} />
                        </div>

                        <DateInputGroup
                            label={t?.signup?.stage3?.birthDateLabel ?? 'Date of birth'}
                            value={this.state.birthDate}
                            onChange={(e) => this.handleBirthDateChange(e.target.value)}
                            className={`${this.state.birthDateError ? 'floating-input-group-without-margin' : ''}`}
                            inputClassName={`floating-input ${this.state.birthDateError ? 'floating-input-error' : ''}`}
                            labelClassName={`${this.state.birthDate ? ' filled' : ''} ${this.state.birthDateError ? ' floating-label-error' : ''}`}
                        />

                        <TextInputGroup
                            label={t?.signup?.stage3?.phoneNumberLabel ?? 'Phone number'}
                            value={this.state.phoneNumber}
                            type='tel'
                            className={`${this.state.phoneNumberError ? 'floating-input-group-without-margin' : ''}`}
                            inputClassName={`floating-input ${this.state.phoneNumberError ? 'floating-input-error' : ''}`}
                            labelClassName={`${this.state.phoneNumber ? ' filled' : ''} ${this.state.phoneNumberError ? ' floating-label-error' : ''}`}
                            onChange={(e) => this.handlePhoneNumberChange(e.target.value)} />

                        <input type="submit" value={t?.signup?.stage3?.continueButton ?? 'Continue'}
                            className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
                        />
                    </div>
            </form>
        </ContentBox>
    );
}
//

// Stage 4 - Final
renderContentForStage4 = () =>{
    const t = this.props.t;
    return (
        <ContentBox height='760px' lheight='700px'>
            <div className='flex-1 p-20 flex flex-col items-center justify-stretch'>
                <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                    <Image src='/logo/Logo.png' alt={t?.nav?.logoAlt ?? 'Logo'} width={215} height={60} className='mb-2'/>
                    <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mb-4 text-center">
                        {t?.signup?.stage4?.title ?? 'One last step'}
                    </h1>
                    <p className='pb-4 font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                        {t?.signup?.stage4?.subtitle ?? 'Your account has been successfully created. To complete the registration process, please check your email and confirm your registration.'}
                    </p>
                    <Image src='/SuccessVector1.png' alt={t?.signup?.stage4?.successAlt ?? 'Success'} width={126} height={126} className='' />

                </div>
                <div className="flex-1 w-full max-w-[500px]">
                    <div className="space-y-10 flex flex-col font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
                        <Link href='/' className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)] rounded-lg flex items-center justify-center">{t?.signup?.stage4?.mainButton ?? 'Home'}</Link>
                    </div>
                </div>
            </div>
        </ContentBox>
    );
}
//

    render() {
        if(this.state.stage === 1) {
            return this.renderContentForStage1();
        }
        else if (this.state.stage === 2) {
            return this.renderContentForStage2();
        }
        else if (this.state.stage === 3) {
            return this.renderContentForStage3();
        }
        else if (this.state.stage === 4) {
            return this.renderContentForStage4();
        }
    }
}

export default function SignupPageWrapper(props: SignupPageProps) {
    const router = useRouter();
    const { messages: t } = useI18n();
    return <SignupPage {...props} router={router} t={t} />;
}