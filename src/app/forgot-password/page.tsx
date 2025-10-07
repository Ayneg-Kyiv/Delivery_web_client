"use client";

import React from 'react';
import { ApiClient } from '../api-client';
import { useRouter } from 'next/navigation';
import ContentBox from '@/components/ui/content-box';
import Image from 'next/image';
import TextInputGroup from '@/components/ui/text-input-group';
import Button from '@/components/ui/button';
import { useI18n } from '@/i18n/I18nProvider';

class ForgotPasswordPage extends React.Component<ForgotPasswordPageProps, ForgotPasswordPageState> {
    constructor(props: ForgotPasswordPageProps) {
        super(props);
        this.state = {
            email: '',
            error: undefined,
            emailError: false,
            success: undefined,
            loading: false,
        };
    }

    async componentDidMount() {
        try {
            await ApiClient.get<null>('/csrf');
        } catch (error) {
            // console.error('Error fetching CSRF token:', error);
            this.setState({
                error: this.props.t?.forgotPassword?.genericError ?? `Something went wrong. Please try again.`,
                success: undefined,
                loading: false,
            });
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


    handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const { email } = this.state;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email) && email.length > 0) {
            this.setState({ error: this.props.t?.forgotPassword?.invalidEmail, success: undefined });
            return;
        }
        
        this.setState({ loading: true, error: undefined, success: undefined });
        
        try {
            const response = await ApiClient.post('/account/forgot-password', { email });

            if (response?.success) {
                this.props.router.push(`/forgot-password-confirmation?email=${encodeURIComponent(email)}`);
            } else {
            this.setState({
                error: this.props.t?.forgotPassword?.genericError,
                success: undefined,
                loading: false,
            });
            }
        } catch (err) {
            this.setState({
                error: this.props.t?.forgotPassword?.genericError,
                success: undefined,
                loading: false,
            });
        }
    };

    renderContent = () => {
        const t = this.props.t;
        return (
            <ContentBox>
                <form className='flex-1 flex flex-col items-center h-full justify-stretch' onSubmit={this.handleSubmit}>

                    <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                        <Image src='/logo/Logo.png' alt={t?.nav?.logoAlt || 'Logo'} width={215} height={60} className='mb-2'/>
                        
                        <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mb-4 text-center">
                            {t?.forgotPassword?.title}
                        </h1>

                        <p className='md:pt-2 font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                            {t?.forgotPassword?.subtitle}
                        </p>
                    </div>

                    <div className="pt-4 flex-1 w-full max-w-[500px] space-y-6">

                        <div className="space-y-5 flex flex-col">
                            <TextInputGroup
                                label={t?.forgotPassword?.emailLabel || ''}
                                value={this.state.email}
                                onChange={this.handleEmailChange}
                                type="email"
                                className=""
                                inputClassName={`floating-input ${this.state.emailError ? 'floating-input-error' : ''}`}
                                labelClassName={`${this.state.email ? ' filled' : ''} ${this.state.emailError ? ' floating-label-error' : ''}`}
                                placeholder=""
                            />

                            <div className={`flex flex-row items-center ${this.state.error ? '' : 'hidden'}`}>
                                <Image src='/ErrorVector1.png' alt="Lock Icon" width={6} height={6} className='h-[24px] w-[24px] mr-[20px]'/>
                                <p className='text-[#ED2B2B]'>
                                    {this.state.error ?? t?.forgotPassword?.emailNotFound}
                                </p>
                            </div>
                        </div>

                        <input type="submit" value={t?.forgotPassword?.submitButton}
                            className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
                        />

                        <div className="flex flex-col font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
                            <Button onClick={() => this.props.router?.push('/signin')} text={t?.forgotPassword?.backToLogin}
                                className="p-0 h-auto font-body-2 text-[#2892f6] text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] hover:underline"
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

export default function ForgotPasswordPageWrapper(props: ForgotPasswordPageProps) {
    const router = useRouter();
    const { messages: t } = useI18n();
    return <ForgotPasswordPage {...props} router={router} t={t} />;
}