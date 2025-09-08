'use client';

import React from 'react';
import ContentBox from '@/components/ui/content-box';
import Image from 'next/image';
import Link from 'next/link';

export default function UserExistsPage() {
    return (
        <ContentBox height='760px' lheight='700px'>
            <div className='flex-1 p-20 flex flex-col items-center justify-stretch'>
                <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                    <Image src='/logo/Logo.png' alt="Logo" width={215} height={60} className='mb-2'/>
                    <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mb-4 text-center">
                        Користувач вже існує
                    </h1>
                    <p className='pb-4 font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                        Обліковий запис з цією електронною адресою вже існує. Ви можете увійти до свого облікового запису або скинути пароль, якщо забули його.
                    </p>
                    <Image src='/ErrorVectorBig.svg' alt='user exists' width={126} height={126} />
                </div>
                <div className="flex-1 w-full max-w-[500px]">
                    <div className="space-y-6 flex flex-col font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
                        <Link
                            href='/signin'
                            className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)] rounded-lg flex items-center justify-center"
                        >
                            Ввійти
                        </Link>
                        <Link
                            href='/reset-password'
                            className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)] rounded-lg flex items-center justify-center"
                        >
                            Скинути пароль
                        </Link>
                    </div>
                </div>
            </div>
        </ContentBox>
    );
}