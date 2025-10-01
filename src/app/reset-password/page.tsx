"use client";

import React from 'react';
import { ApiClient } from '../api-client';
import { AuthService } from '../auth-service';
import { useRouter, useSearchParams } from 'next/navigation';
import ContentBox from '@/components/ui/content-box';
import Image from 'next/image';
import TextInputGroup from '@/components/ui/text-input-group';

class ResetPasswordPage extends React.Component<ResetPasswordPageProps & { token: string; email: string }, ResetPasswordPageState> {
    constructor(props: ResetPasswordPageProps & { token: string; email: string }) {
        super(props);
        this.state = {
            password: '',
            confirmPassword: '',
            error: undefined,
            success: undefined,
            loading: false,
            passwordError: false,
            confirmPasswordError: false,
            showPassword: false,
            showConfirmPassword: false,
        };
    }

    async componentDidMount() {
        try {
            await ApiClient.get<null>('/csrf');
        } catch (error) {
            console.error('Error fetching CSRF token:', error);
        }
    }

    handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        this.setState({ password });
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&_*]).{8,}$/;
        if (!passwordRegex.test(password) && password.length > 0) {
            this.setState({ passwordError: true });
        } else {
            this.setState({ passwordError: false });
        }
    };

    handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const confirmPassword = e.target.value;
        this.setState({ confirmPassword });
        if (confirmPassword !== this.state.password) {
            this.setState({ confirmPasswordError: true });
        } else {
            this.setState({ confirmPasswordError: false });
        }
    };

    handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const { password, confirmPassword, passwordError, confirmPasswordError } = this.state;
        if (passwordError || confirmPasswordError || !password || !confirmPassword) {
            this.setState({ error: 'Please fix the errors above.', success: undefined });
            return;
        }

        this.setState({ loading: true, error: undefined, success: undefined });

        try {
            const response = await AuthService.resetPassword(
                this.props.email,
                this.props.token,
                password
            );
            if (response?.success) {
                this.props.router.push('/reset-password-success');
            } else {
                this.setState({ error: 'Не вдалося змінити пароль. Спробуйте ще раз.', success: undefined, loading: false });
            }
        } catch (err) {
            this.setState({ error: `Виникла помилка. ${err} Спробуйте ще раз.`, success: undefined, loading: false });
        }
    };

    renderContent = () => {
        return (
            <ContentBox>
                <form className='flex-1 flex flex-col items-center h-full justify-stretch' onSubmit={this.handleSubmit}>
                    <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                        <Image src='/logo/Logo.png' alt="Logo" width={215} height={60} className='mb-2'/>
                        
                        <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mb-4 text-center">
                            Встановлення нового паролю
                        </h1>
                        
                        <p className='md:pt-2 font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                            Введіть новий пароль для вашого акаунта.
                        </p>
                    </div>
                    
                    <div className="pt-4 flex-1 w-full max-w-[500px] space-y-6">
                        <div className="space-y-5 flex flex-col">
                            <TextInputGroup
                                label="Новий пароль"
                                value={this.state.password}
                                onChange={this.handlePasswordChange}
                                type="password"
                                className=""
                                inputClassName={`floating-input ${this.state.passwordError ? 'floating-input-error' : ''}`}
                                labelClassName={`${this.state.password ? ' filled' : ''} ${this.state.passwordError ? ' floating-label-error' : ''}`}
                                placeholder=""
                            />


                            <TextInputGroup
                                label="Підтвердіть новий пароль"
                                value={this.state.confirmPassword}
                                onChange={this.handleConfirmPasswordChange}
                                type="password"
                                className=""
                                inputClassName={`floating-input ${this.state.confirmPasswordError ? 'floating-input-error' : ''}`}
                                labelClassName={`${this.state.confirmPassword ? ' filled' : ''} ${this.state.confirmPasswordError ? ' floating-label-error' : ''}`}
                            />

                            <input
                                type="submit"
                                value={this.state.loading ? 'Змінюємо...' : 'Змінити пароль'}
                                disabled={this.state.loading}
                                className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
                            />
                        </div>
                    </div>
                </form>
            </ContentBox>
        );
    };

    render() {
        return <>{this.renderContent()}</>;
    }
}

export default function ResetPasswordPageWrapper(props: ResetPasswordPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';
    const email = searchParams.get('email') || '';
    return <ResetPasswordPage {...props} router={router} token={token} email={email} />;
}