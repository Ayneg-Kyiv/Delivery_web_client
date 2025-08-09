'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ConfirmEmail() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Confirming your email...');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  useEffect(() => {
    async function confirmEmail() {
      if (!token || !email) {
        setStatus('error');
        setMessage('Invalid confirmation link. Missing token or email.');
        return;
      }
      
      try {
        console.log('Confirming email with token:', token, 'and email:', email);
        
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/confirm-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`
        );
        
        if (response.data.success) {
          setStatus('success');
          setMessage('Your email has been confirmed successfully! You can now log in.');
        } else {
          setStatus('error');
          setMessage(response.data.message || 'Failed to confirm email.');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error?.response?.data?.message || 'An error occurred while confirming your email.');
      }
    }
    
    confirmEmail();
  }, [token, email]);
  
  const handleGoToLogin = () => {
    router.push('/signin');
  };
  
  const handleResendConfirmation = () => {
    router.push('/resend-confirmation');
  };
  
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
            <div className="mt-4">
              <div className="w-16 h-16 bg-green-100 mx-auto rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <p className="mt-4 text-gray-600">{message}</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleGoToLogin}
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}
          
          {status === 'error' && (
            <div className="mt-4">
              <div className="w-16 h-16 bg-red-100 mx-auto rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <p className="mt-4 text-gray-600">{message}</p>
              <div className="mt-6 space-y-2">
                <button
                  type="button"
                  onClick={handleGoToLogin}
                  className="block w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 text-center"
                >
                  Go to Login
                </button>
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  className="block w-full px-4 py-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-50 text-center"
                >
                  Resend Confirmation Email
                </button>
              </div>
            </div>
          )}
        </div>
    </div>
  </div>
  );
}
