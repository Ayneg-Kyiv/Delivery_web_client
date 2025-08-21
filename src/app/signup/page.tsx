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
            console.error('Error fetching CSRF token:', error);
        }
    }

    handleEmailChange = (email: string) => {
        this.setState({ email });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) 
            this.setState({ emailError: true });
        else 
            this.setState({ emailError: false });
    };

    handlePasswordChange = (password: string) => {
        this.setState({ password });

        if (password.length < 8) 
            this.setState({ error: 'Password must be at least 8 characters long' });
        else 
            this.setState({ error: undefined });
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
            if (!passwordRegex.test(password)) {
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

        if (birthDate < '1900-01-01') {
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
        if (!phoneNumberRegex.test(phoneNumber)) {
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
            this.setState({ error: 'Sign up failed. Please try again.' });
        
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
        return (
            <ContentBox>
                
                <form className='flex-1 flex pt-20 p-20 flex-col h-full items-center justify-center' onSubmit={this.handleSignupStage1}>
                       
                    <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                        <Image src='/logo/Logo.png' alt="Logo" width={215} height={60}/>
                        
                        <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mt-2 mb-4 text-center">
                            Створіть свій обліковий запис в Cargix
                        </h1>

                        <p className='font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                           Введіть вашу електронну адресу, щоб продовжити. 
                        </p>
                    </div>

                    <div className="flex-1 w-full max-w-[500px] space-y-5 flex flex-col">
                        <TextInputGroup
                                label="E-mail"
                                value={this.state.email}
                                onChange={(e) => this.handleEmailChange(e.target.value)}
                                type="email"
                                className=""
                                inputClassName={`floating-input ${this.state.emailError ? 'floating-input-error' : ''}`}
                                labelClassName={`${this.state.email ? ' filled' : ''} ${this.state.emailError ? ' floating-label-error' : ''}`}
                                placeholder=""
                            />

                        <input type="submit" value='Продовжити'
                            className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
                        />
                        
                        <div className="flex-1 pt-4 space-y-4">
                            <div className="font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
                                <span className="text-[#e4e4e4] pr-2">
                                    Маєте аккаунт?
                                </span>
                                <Button onClick={() => this.props.router?.push('/signin')} text='ввійти'
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
        return (
            <ContentBox>
                
                <form className='flex-1 flex pt-20 p-20 flex-col h-full items-center justify-center' onSubmit={this.handleSignupStage2}>
                       
                    <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                        <Image src='/logo/Logo.png' alt="Logo" width={215} height={60}/>
                        
                        <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mt-2 mb-4 text-center">
                            Встановіть пароль
                        </h1>

                        <p className='font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                           Введіть пароль для облікового запису.
                        </p>
                    </div>

                    <div className="flex-1 w-full max-w-[500px] space-y-5 flex flex-col">
                        <TextInputGroup
                                label="Пароль"
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
                           Пароль має містити не менше 8 символів, включаючи великі та малі літери, цифри та спеціальні символи.
                        </p>
                        )}
                        {this.state.passwordError && (
                            <div className={`flex flex-row items-center  mt-[8px]`}>
                                <Image src='/ErrorVector1.png' alt="Lock Icon" width={6} height={6} className='h-[24px] w-[24px] mr-[20px]'/>
                                <p className='text-[#ED2B2B] text-sm text-stretch'>
                                    Пароль має містити не менше 8 символів, включаючи великі та малі літери, цифри та спеціальні символи.
                                </p>
                            </div>
                        )}

                        <TextInputGroup
                                label="Підтвердження пароля"
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
                                    Паролі мають співпадати.
                                </p>
                            </div>
                        )}

                        <input type="submit" value='Продовжити'
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
    return (
        <ContentBox>
            <form className='flex-1 flex pt-20 p-20 flex-col h-full items-center justify-center' onSubmit={this.handleSignUp}>
                
                    <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                        <Image src='/logo/Logo.png' alt="Logo" width={215} height={60}/>
                        
                        <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mt-2 mb-4 text-center">
                            Останній крок
                        </h1>

                        <p className='font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                           Введіть вказану інформацію.
                        </p>
                    </div>
                    
                    <div className="flex-1 w-full max-w-[500px] space-y-5 flex flex-col">
                        
                        <div className='flex flex-row space-x-2'>
                            <TextInputGroup
                                label="Ім'я"
                                value={this.state.firstName}
                                type='text'
                                onChange={(e) => this.handleFirstNameChange(e.target.value)} />

                            <TextInputGroup
                                label="Прізвище"
                                value={this.state.lastName}
                                type='text'
                                onChange={(e) => this.handleLastNameChange(e.target.value)} />
                        </div>

                        <DateInputGroup
                            label='Дата народження'
                            value={this.state.birthDate}
                            onChange={(e) => this.handleBirthDateChange(e.target.value)}
                            className={`${this.state.birthDateError ? 'floating-input-group-without-margin' : ''}`}
                            inputClassName={`floating-input ${this.state.birthDateError ? 'floating-input-error' : ''}`}
                            labelClassName={`${this.state.birthDate ? ' filled' : ''} ${this.state.birthDateError ? ' floating-label-error' : ''}`}
                        />

                        <TextInputGroup
                            label="Номер телефону"
                            value={this.state.phoneNumber}
                            type='tel'
                            className={`${this.state.phoneNumberError ? 'floating-input-group-without-margin' : ''}`}
                            inputClassName={`floating-input ${this.state.phoneNumberError ? 'floating-input-error' : ''}`}
                            labelClassName={`${this.state.phoneNumber ? ' filled' : ''} ${this.state.phoneNumberError ? ' floating-label-error' : ''}`}
                            onChange={(e) => this.handlePhoneNumberChange(e.target.value)} />

                        <input type="submit" value='Продовжити'
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
    return (
        <ContentBox height='760px' lheight='700px'>
            <div className='flex-1 p-20 flex flex-col items-center justify-stretch'>
                <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                    <Image src='/logo/Logo.png' alt="Logo" width={215} height={60} className='mb-2'/>
                    <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mb-4 text-center">
                        Залишився останній крок
                    </h1>
                    <p className='pb-4 font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                        Ваш обліковий запис успішно створено. для завершення процесу реєстрації перейдіть на вказану електронну пошту та підтвердіть свою реєстрацію.
                    </p>
                    <Image src='/SuccessVector1.png' alt='success' width={126} height={126} className=''/>

                </div>
                <div className="flex-1 w-full max-w-[500px]">
                    <div className="space-y-10 flex flex-col font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
                        <Link href='' className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]">Головна</Link>
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
    return <SignupPage {...props} router={router} />;
}