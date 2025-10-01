"use client";

import React from 'react';
import ContentBox from '@/components/ui/content-box';
import Image from 'next/image';
import Button from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/I18nProvider';

export default function ResetPasswordSuccessPage(): React.JSX.Element {
    const router = useRouter();
    const { messages: t } = useI18n();

    const handleGoToSignIn = () => router.push('/signin');

    return (
        <ContentBox height='760px' lheight='700px'>
            <div className='flex-1 flex flex-col items-center justify-stretch'>
                <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                    <Image src='/logo/Logo.png' alt="Logo" width={215} height={60} className='mb-2'/>
                    <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mb-4 text-center">
                        {t.resetPasswordSuccess.title}
                    </h1>
                    <p className='pb-4 font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                        {t.resetPasswordSuccess.subtitle}
                    </p>

                    <Image src='/SuccessVector1.png' alt='success' width={126} height={126} className=''/>

                </div>
                <div className="flex-1 w-full max-w-[500px]">
                    <div className="space-y-10 flex flex-col font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
                        <Button
                            onClick={handleGoToSignIn}
                            text={t.resetPasswordSuccess.goToSignIn}
                            className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
                        />
                    </div>
                </div>
            </div>
        </ContentBox>
    );
}