"use client";

import React from 'react';
import { AuthService } from '../auth-service';
import { useRouter } from 'next/navigation';
import { ApiClient } from '../api-client';

class SignupPage extends React.Component<SignupPageProps, SignupPageState> {
    constructor(props: SignupPageProps) {
        super(props);
        this.state = {
            email: '',
            password: '',
            showPassword: false,
            confirmPassword: '',
            showConfirmPassword: false,
            error: undefined
        };
    }

    async componentDidMount() {
        try{
            await ApiClient.get<any>('/csrf');
        }catch (error) {
            console.error('Error fetching CSRF token:', error);
        }
    }

    handleEmailChange = (email: string) => {
        this.setState({ email });
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) 
            this.setState({ error: 'Invalid email format' });
        else 
            this.setState({ error: undefined });
    };

    handlePasswordChange = (password: string) => {
        this.setState({ password });
        if (password.length < 8) 
            this.setState({ error: 'Password must be at least 8 characters long' });
        else 
            this.setState({ error: undefined });
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
            if (!passwordRegex.test(password)) {
                this.setState({ error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' });
            } else {
                this.setState({ error: undefined });
            }
    };

    handleConfirmPasswordChange = (confirmPassword: string) => {
        this.setState({ confirmPassword });
        if (confirmPassword !== this.state.password) 
            this.setState({ error: 'Passwords do not match' });
        else 
            this.setState({ error: undefined });
        
    };

    handleSignUp = async (event: React.FormEvent) => {
        event.preventDefault();
        
        const response = await AuthService.register(
            this.state.email,
            this.state.password
        );

        if (response?.success) 
            this.props.router?.push('/');
        else 
            this.setState({ error: 'Sign up failed. Please try again.' });
        
    };

    renderContent = () => {
        return (
            <div className='h-[89vh] w-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg'>
                
                <div className='m-8'>
                    <h1 className='text-4xl font-bold'>Sign Up</h1>
                </div>
                
                <form className='flex flex-col w-95 items-stretch justify-center' onSubmit={this.handleSignUp}>
                    
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
                    
                    <div className='flex flex-row'>
                        
                        <input
                            id='confirmPassword'
                            type={this.state.showConfirmPassword ? 'text' : 'password'}
                            placeholder='Confirm Password'
                            value={this.state.confirmPassword}
                            onChange={(e) => this.handleConfirmPasswordChange(e.target.value)}
                            className='flex-1 mb-4 p-2 border rounded-lg focus:bg-gray-100 focus:text-black'
                        />
                    
                    </div>
                    
                    {this.state.error && (
                        <div className='flex-1 mb-4 mt-4 text-gray-500 outline p-4 rounded-lg bg-gray-200'>{this.state.error}</div>
                    )}
                    
                    <button type="submit"
                        className='flex-1 mt-6 px-4 py-2 bg-blue-500 text-white text-2xl rounded-lg hover:bg-gray-600 transition-colors duration-300 active:opacity-75'>
                        Sign Up
                    </button>
                
                </form>
            
            </div>
        );
    };

    render() {
        return <>{this.renderContent()}</>;
    }
}

export default function SignupPageWrapper(props: SignupPageProps) {
    const router = useRouter();
    return <SignupPage {...props} router={router} />;
}