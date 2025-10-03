'use client';

import React, { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { apiPost } from '@/app/api-client';

const ReviewRequestPage: React.FC = () => {
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const session = useSession();
    const [rating, setRating] = useState(0);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const dto: CreateReviewDto = {
            rating,
            text,
            deliveryRequestId: id,
            reviewerId: session.data?.user?.id,
            userId: userId || undefined,
        };

        try {
            const res = await apiPost('/api/review/create', dto, {}, session.data?.accessToken || '');

            if (!res.success) {
                setError(res.message || 'Помилка при створенні відгуку');
            } else {
                setSuccess(true);
                setTimeout(() => router.push('/' + id), 1500);
            }
        } catch {
            setError('Помилка мережі');
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-[#1a093a] justify-center items-center">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-[#2d1857] text-center">Залишити відгук водію</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="font-bold text-[#2d1857]">Оцінка:</label>
                    <div className="flex gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                type="button"
                                key={star}
                                className={`text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                onClick={() => setRating(star)}
                                aria-label={`Оцінка ${star}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                    <label className="font-bold text-[#2d1857]">Текст відгуку:</label>
                    <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        rows={4}
                        className="border rounded-lg p-2 text-black"
                        required
                        placeholder="Напишіть ваш відгук..."
                    />
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {success && <div className="text-green-600 text-sm">Відгук успішно створено!</div>}
                    <button
                        type="submit"
                        className="bg-[#7c3aed] text-white px-6 py-3 rounded-lg font-bold text-lg mt-4"
                        disabled={loading || rating === 0 || text.length === 0}
                    >
                        {loading ? 'Відправка...' : 'Залишити відгук'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewRequestPage;