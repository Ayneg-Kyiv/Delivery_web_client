"use client";

import React from 'react';
import { AuthService } from '../auth-service';
import { useRouter, useSearchParams } from 'next/navigation';
import { ApiClient } from '../api-client';


class ResetPasswordPage extends React.Component<ResetPasswordPageProps, ResetPasswordPageState> {

    constructor(props: ResetPasswordPageProps & { token: string; email: string }) {
        super(props);
        this.state = {
            password: '',
            showPassword: false,
            confirmPassword: '',
            showConfirmPassword: false,
            error: undefined,
            success: undefined,
            loading: false,
        };
    }

    async componentDidMount() {
        // CSRF token is handled automatically by getCsrfTokenSync() when needed
    }

    handlePasswordChange = (password: string) => {
        this.setState({ password });
        if (password.length < 8) {
            this.setState({ error: 'Password must be at least 8 characters long' });
        } else {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&_*])(?=.{8,})/;
            if (!passwordRegex.test(password)) {
                this.setState({
                    error:
                        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                });
            } else {
                this.setState({ error: undefined });
            }
        }
    };

    handleConfirmPasswordChange = (confirmPassword: string) => {
        this.setState({ confirmPassword });
        if (confirmPassword !== this.state.password) {
            this.setState({ error: 'Passwords do not match' });
        } else {
            this.setState({ error: undefined });
        }
    };

    handleResetPassword = async (event: React.FormEvent) => {
        event.preventDefault();
        if (this.state.error) return;

        this.setState({ loading: true, success: undefined, error: undefined });

        try {
            const response = await AuthService.resetPassword(
                this.props.email,
                this.props.token,
                this.state.password
            );
            if (response?.success) {
                this.setState({ success: 'Password reset successful. You can now log in.', error: undefined });
                setTimeout(() => {
                    this.props.router?.push('/login');
                }, 2000);
            } else {
                this.setState({ error: 'Password reset failed. Please try again.', success: undefined });
            }
        } catch (err) {
            this.setState({ error: 'An error occurred. Please try again.', success: undefined });
        } finally {
            this.setState({ loading: false });
        }
    };

    renderContent = () => {
        return (
            <div className='h-[89vh] w-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg'>
                <div className='m-8'>
                    <h1 className='text-4xl font-bold'>Reset Password</h1>
                </div>
                <form className='flex flex-col w-95 items-stretch justify-center' onSubmit={this.handleResetPassword}>
                    <input
                        id='password'
                        type={this.state.showPassword ? 'text' : 'password'}
                        placeholder='New Password'
                        autoComplete='new-password'
                        value={this.state.password}
                        onChange={(e) => this.handlePasswordChange(e.target.value)}
                        className='flex-1 mb-4 p-2 border rounded-lg focus:bg-gray-100 focus:text-black'
                    />
                    <input
                        id='confirmPassword'
                        type={this.state.showConfirmPassword ? 'text' : 'password'}
                        placeholder='Confirm New Password'
                        autoComplete='new-password'
                        value={this.state.confirmPassword}
                        onChange={(e) => this.handleConfirmPasswordChange(e.target.value)}
                        className='flex-1 mb-4 p-2 border rounded-lg focus:bg-gray-100 focus:text-black'
                    />
                    {this.state.error && (
                        <div className='flex-1 mb-4 mt-4 text-gray-500 outline p-4 rounded-lg bg-gray-200'>
                            {this.state.error}
                        </div>
                    )}
                    {this.state.success && (
                        <div className='flex-1 mb-4 mt-4 text-green-600 outline p-4 rounded-lg bg-green-100'>
                            {this.state.success}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={this.state.loading}
                        className='flex-1 mt-6 px-4 py-2 bg-blue-500 text-white text-2xl rounded-lg hover:bg-gray-600 transition-colors duration-300 active:opacity-75 disabled:opacity-50'
                    >
                        {this.state.loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        );
    };

    render() {
        return <>{this.renderContent()}</>;
    }
}

export default function ResetPasswordPageWrapper() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';
    const email = searchParams.get('email') || '';

    return <ResetPasswordPage router={router} token={token} email={email} />;
}