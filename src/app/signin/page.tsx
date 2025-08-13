"use client";

import React from 'react';
import { AuthService } from '../auth-service';
import { useRouter } from 'next/navigation';
import { ApiClient } from '../api-client';
import Button from '@/components/ui/button';

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
        // CSRF token is handled automatically by getCsrfTokenSync() when needed
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
            this.setState({ passwordError: true });
        else 
            this.setState({ passwordError: false, error: undefined });
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&_*])(?=.{8,})/;
            if (!passwordRegex.test(password)) {
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
                this.state.password
            );

            if (response?.ok)
                this.props.router?.push('/');
            else
                this.setState({ error: 'Invalid email or password' });
        } catch (error) {
            this.setState({ error: 'Sign in failed. Please try again.' });
        }
    };

    renderContent = () => {
        return (
            <div className='flex justify-center items-center py-20 h-screen'>
                <div className="w-full max-w-[760px] bg-[#0f0e10] border-none rounded-[20px] shadow-[0px_0px_10px_20px_#00000040] mx-4">
                    <form className="p-10 flex flex-col items-center" onSubmit={this.handleSubmit}>
                        <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mb-16 text-center">
                            Ласкаво просимо до SMTH?
                        </h1>

                        <div className="w-full max-w-[500px] space-y-6">
                            <div className="space-y-5 flex flex-col">
                                <div className="floating-input-group flex flex-col ">
                                    <input
                                        type="email"
                                        value={this.state.email}
                                        onChange={(e) => this.handleEmailChange(e.target.value)}
                                        className={`floating-input ${this.state.emailError ? 'floating-input-error' : ''}`}
                                        required
                                        id="email"
                                        autoComplete="email"
                                    />
                                    <label htmlFor="email" className={`floating-label${this.state.email ? ' filled' : ''} ${this.state.emailError ? ' floating-label-error' : ''}`}>E-mail</label>
                                </div>

                                <div className="floating-input-group flex flex-col">
                                    <input
                                        type={this.state.showPassword ? 'text' : 'password'}
                                        value={this.state.password}
                                        onChange={(e) => this.handlePasswordChange(e.target.value)}
                                        className={`floating-input ${this.state.passwordError ? 'floating-input-error' : ''}`}
                                        required
                                        id="password"
                                        autoComplete="current-password"
                                    />
                                    <label htmlFor="password" className={`floating-label${this.state.password ? ' filled' : ''} ${this.state.passwordError ? ' floating-label-error' : ''}`}>Password</label>
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
                                    <label htmlFor="remember"
                                    className="pl-2 font-body-2 text-[#e4e4e4] text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] cursor-pointer"
                                    >
                                    Запам'ятати мене
                                    </label>
                                </div>

                                <Button onClick={() => this.props.router?.push('/forgot-password')} text='Забув пароль'
                                    className="p-0 h-auto font-body-2 text-[#2892f6] text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]"
                                />
                            </div>

                            <input type="submit" value='Увійти'
                                className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
                            />

                            <div className="pt-4 space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-body-2 text-[#e4e4e4] text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
                                    Увійти за допомогою:
                                    </span>
                                    <Button onClick={() => console.log('Sign up with Google')} text='' className="p-0 h-auto">
                                        {/* <Google className="h-5 w-5 text-white" /> */}
                                    </Button>
                                </div>

                                <div className="font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
                                    <span className="text-[#e4e4e4] pr-2">
                                    Не маєте акаунту? 
                                    </span>
                                    <Button onClick={() => this.props.router?.push('/signup')} text='Створити акаунт'
                                        className="p-0 h-auto font-body-2 text-[#2892f6] text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )}


    render() {
        return <>{this.renderContent()}</>;
    }
}

export default function SignInPageWithRouter(props: SignInPageProps) {
    const router = useRouter();
    return <SignInPage {...props} router={router} />;
}