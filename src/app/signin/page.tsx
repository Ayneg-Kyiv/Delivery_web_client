"use client";

import React from 'react';
import { AuthService } from '../auth-service';
import { useRouter } from 'next/navigation';

class SignInPage extends React.Component<SignInPageProps, SignInPageState> {
    constructor(props: SignInPageProps) {
        super(props);
        this.state = {
            email: '',
            password: '',
            showPassword: false,
            error: undefined
        };
    }

    handleEmailChange = (email: string) => {
        this.setState({ email });
    };

    handlePasswordChange = (password: string) => {
        this.setState({ password });
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
            <div className='h-[89vh] w-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg'>
                
                <div className='m-8'>
                    <h1 className='text-4xl font-bold'>Sign In</h1>
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
                    />
                    
                    <div className='flex flex-row'>
                        
                        <input
                            id='password'
                            type={this.state.showPassword ? 'text' : 'password'}
                            placeholder='Password'
                            value={this.state.password}
                            onChange={(e) => this.handlePasswordChange(e.target.value)}
                            className='flex-1 mb-4 p-2 border rounded-lg focus:bg-gray-100 focus:text-black'
                        />
                    
                    </div>
                    
                    {this.state.error && (
                        <div className='flex-1 mb-4 mt-4 text-gray-500 outline p-4 rounded-lg bg-gray-200'>{this.state.error}</div>
                    )}
                    
                    <button
                        type="submit"
                        className='flex-1 mt-6 px-4 py-2 bg-blue-500 text-white text-2xl rounded-lg hover:bg-gray-600 transition-colors duration-300 active:opacity-75'
                    >
                        Sign In
                    </button>
                
                </form>
            
            </div>
        );
    };

    render() {
        return <>{this.renderContent()}</>;
    }
}

export default function SignInPageWithRouter(props: SignInPageProps) {
    const router = useRouter();
    return <SignInPage {...props} router={router} />;
}