"use client";

import React, { Component } from 'react';
import ContentBox from '@/components/ui/content-box';
import Image from 'next/image';
import Button from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

class ForgotPasswordConfirmationPage extends Component<ForgotPasswordConfirmationPageProps> {

    constructor(props: ForgotPasswordConfirmationPageProps) {
        super(props);
    }

    handleGoToSignIn = () => {
        this.props.router.push('/signin');
    };

    handleResendPassword = () => {
        
    }

    render() {

        let email = this.props.email;

        return (
            <ContentBox height='760px' lheight='700px'>
                <div className='flex-1 p-20 flex flex-col items-center  justify-stretch'>
                    <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                        <Image src='/logo/Logo.png' alt="Logo" width={215} height={60} className='mb-2'/>
                        <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mb-4 text-center">
                            {email} Перевірте вашу пошту
                        </h1>
                        <p className='pb-4 font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                            Якщо обліковий запис з цією електронною адресою існує, ми надіслали вам лист з посиланням для скидання паролю.
                        </p>
                    </div>
                    <div className="flex-1 w-full max-w-[500px]">
                        <div className=" space-y-10 flex flex-col font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
                            <Button text='Надіслати повторно' onClick={this.handleResendPassword}
                                className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
                            />
                            <Button
                                onClick={this.handleGoToSignIn}
                                text='Повернутись до сторінки входу'
                                className="p-0 h-auto font-body-2 text-[#2892f6] text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] hover:underline"
                            />
                        </div>
                    </div>
                </div>
            </ContentBox>
        );
    }
}

export default function ForgotPasswordConfirmationPageWrapper(props: ForgotPasswordConfirmationPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    let email = searchParams.get('email') || '';

    return <ForgotPasswordConfirmationPage {...props} email={email} router={router} />;
}