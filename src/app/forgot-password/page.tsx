"use client";

import React from 'react';
import { ApiClient } from '../api-client';
import { useRouter } from 'next/navigation';

class ForgotPasswordPage extends React.Component<ForgotPasswordPageProps, ForgotPasswordPageState> {
    constructor(props: ForgotPasswordPageProps) {
        super(props);
        this.state = {
            email: '',
            error: undefined,
            success: undefined,
            loading: false,
        };
    }

    async componentDidMount() {
        // CSRF token is handled automatically by getCsrfTokenSync() when needed
    }

    handleEmailChange = (email: string) => {
        this.setState({ email });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            this.setState({ error: 'Invalid email format', success: undefined });
        } else {
            this.setState({ error: undefined });
        }
    };

    handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const { email } = this.state;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            this.setState({ error: 'Invalid email format', success: undefined });
            return;
        }
        
        this.setState({ loading: true, error: undefined, success: undefined });
        
        try {
            const response = await ApiClient.post('/account/forgot-password', { email });

            if (response?.success) {
                this.setState({
                    success: 'If an account with that email exists, a password reset link has been sent.',
                    error: undefined,
                    loading: false,
                });
            } else {
                this.setState({
                    error: 'Failed to send reset link. Please try again.',
                    success: undefined,
                    loading: false,
                });
            }
        } catch (err) {
            this.setState({
                error: 'An error occurred. Please try again.',
                success: undefined,
                loading: false,
            });
        }
    };

    renderContent = () => {
        return (
            <div className='h-[89vh] w-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg'>
                <div className='m-8'>
                    <h1 className='text-4xl font-bold'>Forgot Password</h1>
                </div>
                <form className='flex flex-col w-95 items-stretch justify-center' onSubmit={this.handleSubmit}>
                    <input
                        id='email'
                        type='email'
                        placeholder='Email'
                        autoComplete='email'
                        value={this.state.email}
                        onChange={(e) => this.handleEmailChange(e.target.value)}
                        className='flex-1 mb-4 p-2 border rounded-lg focus:bg-gray-100 focus:text-black'
                        disabled={this.state.loading}
                    />
                    {this.state.error && (
                        <div className='flex-1 mb-4 mt-4 text-gray-500 outline p-4 rounded-lg bg-gray-200'>{this.state.error}</div>
                    )}
                    {this.state.success && (
                        <div className='flex-1 mb-4 mt-4 text-green-600 outline p-4 rounded-lg bg-green-100'>{this.state.success}</div>
                    )}
                    <button
                        type="submit"
                        className='flex-1 mt-6 px-4 py-2 bg-blue-500 text-white text-2xl rounded-lg hover:bg-gray-600 transition-colors duration-300 active:opacity-75'
                        disabled={this.state.loading}
                    >
                        {this.state.loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
            </div>
        );
    };

    render() {
        return <>{this.renderContent()}</>;
    }
}

export default function ForgotPasswordPageWrapper(props: ForgotPasswordPageProps) {
    const router = useRouter();
    return <ForgotPasswordPage {...props} router={router} />;
}