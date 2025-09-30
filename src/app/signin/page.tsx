'use client';

import React from 'react';
import { AuthService } from '../auth-service';
import { useRouter } from 'next/navigation';
import { ApiClient } from '../api-client';
import Button from '@/components/ui/button';
import TextInputGroup from '@/components/ui/text-input-group';
import ContentBox from '@/components/ui/content-box';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

class SignInPage extends React.Component<SignInPageProps, SignInPageState> {
    constructor(props: SignInPageProps) {
        super(props);
        this.state = {
            email: '',
            emailError: false,
            password: '',
            passwordError: false,
            rememberMe: false,
            showPassword: false,
            error: undefined
        };
    }

    async componentDidMount() {
        try {
            await ApiClient.get<null>('/csrf');
        } catch (error) {
            this.setState({ error: `Failed to initialize sign-in. ${error} Please try again.` });
        }
    }

    handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value;
        this.setState({ email });
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email) && email.length > 0) 
            this.setState({ emailError: true });
        else 
            this.setState({ emailError: false });
    };

    handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        this.setState({ password });

        if (password.length < 8 || password.length > 0) 
            this.setState({ passwordError: true });
        else 
            this.setState({ passwordError: false, error: undefined });

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&_*])(?=.{8,})/;
        
        if (!passwordRegex.test(password) && password.length > 0) {
            this.setState({ passwordError: true });
        } else {
            this.setState({ passwordError: false });
        }
    };

    handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await AuthService.login(
                this.state.email,
                this.state.password,
                this.state.rememberMe
            );

            if (response?.ok)
                this.props.router?.push('/');
            else
                this.setState({ error: 'Invalid email or password' });
        } catch (error) {
            this.setState({ error: `Sign in failed. ${error} Please try again.` });
        }
    };

    renderContent = () => {
        return (
            <ContentBox>
                <form className="flex-1 h-full flex flex-col items-center" onSubmit={this.handleSubmit}>
                        
                    <Image src='/logo/Logo.png' alt="Logo" width={215} height={60}/>

                    <h1 className="font-title-2  mb-6 md:mb-16 text-center">
                        Ласкаво просимо до Cargix
                    </h1>

                   <div className="flex-1 w-full max-w-[500px] md:space-y-5">
                        <div className="space-y-5 flex flex-col">
                            <TextInputGroup
                                label="E-mail"
                                value={this.state.email}
                                onChange={this.handleEmailChange}
                                type="email"
                                className=""
                                inputClassName={`floating-input ${this.state.emailError ? 'floating-input-error' : ''}`}
                                labelClassName={`${this.state.email ? ' filled' : ''} ${this.state.emailError ? ' floating-label-error' : ''}`}
                                placeholder=""
                            />

                            <TextInputGroup
                                label="Password"
                                value={this.state.password}
                                onChange={this.handlePasswordChange}
                                type={this.state.showPassword ? 'text' : 'password'}
                                className=""
                                inputClassName={`floating-input ${this.state.passwordError ? 'floating-input-error' : ''}`}
                                labelClassName={`${this.state.password ? ' filled' : ''} ${this.state.passwordError ? ' floating-label-error' : ''}`}
                                placeholder=""
                            />
                        </div>

                        <div className=''>
                            <div className={`text-[#ED2B2B] text-2xl ${this.state.error ? 'block' : 'hidden'}`}>
                                Неправильний email або пароль
                            </div>
                        </div>


                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div
                                    className={`custom-checkbox-outer${this.state.rememberMe ? " custom-checkbox-checked" : ""}`}
                                    onClick={() => this.setState({ rememberMe: !this.state.rememberMe })}
                                    tabIndex={0}
                                    role="checkbox"
                                    aria-checked={this.state.rememberMe}
                                    id={"remember"}
                                    style={{ outline: "none" }}
                                    >
                                    <div className="custom-checkbox-inner" />
                                    </div>
            
                                    <label htmlFor="remember" className="pl-2 font-body-2 text-[#e4e4e4] text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] cursor-pointer">
                                        Запам&apos;ятати мене
                                    </label>
                                </div>

                                <Button onClick={() => this.props.router?.push('/forgot-password')} text='Забув пароль'
                                    className="p-0 h-auto font-body-2 text-[#2892f6] text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] hover:underline"
                                />
                            </div>

                            <input type="submit" value='Увійти'
                                className="w-full h-[40px] md:h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
                            />

                            <div className="pt-4 space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-body-2 text-[#e4e4e4] text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
                                    Увійти за допомогою:
                                    </span>
                                    <Button onClick={()  => { signIn('google') }} text='' className="p-0 h-auto">
                                        <Image src='/google-icon-logo-svgrepo-com.svg' alt="Google" width={32} height={32}/>
                                    </Button>
                                </div>

                                <div className="font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
                                    <span className="text-[#e4e4e4] pr-2">
                                    Не маєте акаунту? 
                                    </span>
                                    <Button onClick={() => this.props.router?.push('/signup')} text='Створити акаунт'
                                        className="p-0 h-auto font-body-2 text-[#2892f6] text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] hover:underline"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
            </ContentBox>
        )
    }

    render() {
        return <>{this.renderContent()}</>;
    }
}

export default function SignInPageWithRouter(props: SignInPageProps) {
    const router = useRouter();
    return <SignInPage {...props} router={router} />;
}
