'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import ContentBox from '@/components/ui/content-box';
import Button from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

type Status = 'loading' | 'success' | 'error' | 'resent';

function ConfirmEmailComponent({ token, email }: { token: string | null, email: string | null }) {
  const { messages: t } = useI18n();
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState(t.confirmEmail.loading);

  useEffect(() => {
    const confirm = async () => {
      if (!token || !email) {
        setStatus('error');
        setMessage(t.confirmEmail.invalidLink);
        return;
      }

      try {
        console.log('Confirming email with token:', token, 'and email:', email);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/confirm-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`
        );

        if (response.data.success) {
          setStatus('success');
          setMessage(t.confirmEmail.api.success);
        } else {
          setStatus('error');
          setMessage(response.data.message || t.confirmEmail.api.failed);
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error?.response?.data?.message || t.confirmEmail.api.error);
      }
    };

    confirm();
  }, [token, email, t]);

  const handleResendConfirmation = async () => {
    if (!email) return;
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-confirmation-email?email=${encodeURIComponent(email)}`);

        if (response.data.success) {
            setStatus('resent');
            setMessage(t.confirmEmail.api.resentSuccess);
        } else {
            setStatus('error');
            setMessage(response.data.message || t.confirmEmail.api.resentFailed);
        }
    } catch (error: any) {
        setStatus('error');
        setMessage(error?.response?.data?.message || t.confirmEmail.api.resentFailed);
    }
  };

  if (status === 'loading') {
    return (
      <div className="mt-4 text-center">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-300">{message}</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <ContentBox height='760px' lheight='700px'>
        <div className='flex-1 p-20 flex flex-col items-center justify-stretch'>
          <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
            <Image src='/logo/Logo.png' alt="Logo" width={215} height={60} className='mb-2'/>
            <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mb-4 text-center">
              {t.confirmEmail.successTitle}
            </h1>
            <p className='pb-4 font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
              {t.confirmEmail.successMessage}
            </p>
            <Image src='/SuccessVector1.png' alt='success' width={126} height={126} className=''/>
          </div>
          <div className="flex-1 w-full max-w-[500px]">
            <div className="space-y-10 flex flex-col font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
              <Link href='/signin' className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)] rounded-lg flex items-center justify-center">{t.confirmEmail.loginButton}</Link>
            </div>
          </div>
        </div>
      </ContentBox>
    );
  }

  if (status === 'error') {
    return (
      <ContentBox height='760px' lheight='700px'>
        <div className='flex-1 p-20 flex flex-col items-center justify-stretch'>
          <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
            <Image src='/logo/Logo.png' alt="Logo" width={215} height={60} className='mb-2'/>
            <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mb-4 text-center">
              {t.confirmEmail.errorTitle}
            </h1>
            <p className='pb-4 font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
              {message}
            </p>
          </div>
          <div className="flex-1 w-full max-w-[500px]">
            <div className="space-y-10 flex flex-col font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
              <Button
                onClick={handleResendConfirmation}
                text={t.confirmEmail.resendButton}
                className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
              />
            </div>
          </div>
        </div>
      </ContentBox>
    );
  }

  if (status === 'resent') {
    return (
      <ContentBox height='760px' lheight='700px'>
        <div className='flex-1 p-20 flex flex-col items-center justify-stretch'>
          <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
            <Image src='/logo/Logo.png' alt="Logo" width={215} height={60} className='mb-2'/>
            <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mb-4 text-center">
              {t.confirmEmail.resentTitle}
            </h1>
            <p className='pb-4 font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
              {t.confirmEmail.resentMessage}
            </p>
          </div>
          <div className="flex-1 w-full max-w-[500px]">
            <div className="space-y-10 flex flex-col font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
              <Button
                onClick={handleResendConfirmation}
                text={t.confirmEmail.resendButton}
                className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
              />
            </div>
          </div>
        </div>
      </ContentBox>
    );
  }

  return null;
}

export default function ConfirmEmailWithRouter() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  return <ConfirmEmailComponent token={token} email={email} />;
}
