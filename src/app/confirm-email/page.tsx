'use client';

import React from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import ContentBox from '@/components/ui/content-box';
import Button from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

class ConfirmEmail extends React.Component<ConfirmEmailProps, ConfirmEmailState> {
  constructor(props: ConfirmEmailProps) {
    super(props);
    this.state = {
      status: 'loading',
      message: 'Confirming your email...',
    };
  }

  async componentDidMount() {

    if (!this.props.token || !this.props.email) {
      this.setState({
        status: 'error',
        message: 'Invalid confirmation link. Missing token or email.',
      });
      return;
    }

    try {
      console.log('Confirming email with token:', this.props.token, 'and email:', this.props.email);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/confirm-email?token=${encodeURIComponent(this.props.token)}&email=${encodeURIComponent(this.props.email)}`
      );

      if (response.data.success) {
        this.setState({
          status: 'success',
          message: 'Your email has been confirmed successfully! You can now log in.',
        });
      } else {
        this.setState({
          status: 'error',
          message: response.data.message || 'Failed to confirm email.',
        });
      }
    } catch (error: any) {
      this.setState({
        status: 'error',
        message: error?.response?.data?.message || 'An error occurred while confirming your email.',
      });
    }
  }

  handleResendConfirmation = () => {
    //Rework logic to resend confirmation email
    this.props.router.push('/resend-confirmation');
  };

  render() {
    const { status, message } = this.state;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Email Confirmation</h1>

              {status === 'loading' && (
                <div className="mt-4">
                  <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4 text-gray-600">{message}</p>
                </div>
              )}

              {status === 'success' && (
            <ContentBox height='760px' lheight='700px'>
                <div className='flex-1 p-20 flex flex-col items-center justify-stretch'>
                    <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                        <Image src='/logo/Logo.png' alt="Logo" width={215} height={60} className='mb-2'/>
                        <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mb-4 text-center">
                            Ваш обліковий запис підтверджено
                        </h1>
                        <p className='pb-4 font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                            Ваш обліковий запис підтверджено. Тепер ви можете увійти до свого облікового запису.
                        </p>

                        <Image src='/SuccessVector1.png' alt='success' width={126} height={126} className=''/>

                    </div>
                    <div className="flex-1 w-full max-w-[500px]">
                        <div className="space-y-10 flex flex-col font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
                            <Link href='/signin' className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]">Ввійти</Link>
                        </div>
                    </div>
                </div>
            </ContentBox>
              )}

              {status === 'error' && (
                
            <ContentBox height='760px' lheight='700px'>
                <div className='flex-1 p-20 flex flex-col items-center justify-stretch'>
                    <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                        <Image src='/logo/Logo.png' alt="Logo" width={215} height={60} className='mb-2'/>
                        <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mb-4 text-center">
                            Щось пішло не так
                        </h1>
                        <p className='pb-4 font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                            Виникла помилка під час підтвердження вашої електронної адреси. Будь ласка, спробуйте ще раз.
                        </p>

                    </div>
                    <div className="flex-1 w-full max-w-[500px]">
                        <div className="space-y-10 flex flex-col font-body-2 text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)]">
                            <Button
                                onClick={this.handleResendConfirmation}
                                text='Надіслати підтвердження ще раз'
                                className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
                            />
                        </div>
                    </div>
                </div>
            </ContentBox>
              )}
            </div>
          </div>
      </div>
    );
  }
}

export default function ConfirmEmailWithRouter(props: ConfirmEmailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  return (
      <ConfirmEmail {...props} router={router} token={token} email={email} />
  );
}
