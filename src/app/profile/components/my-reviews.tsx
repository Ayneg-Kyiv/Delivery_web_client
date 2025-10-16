'use client';

import React, { useEffect, useState } from 'react';
import { apiGet } from '@/app/api-client';
import Image from 'next/image';
import { useI18n } from '@/i18n/I18nProvider';
import { useSession } from 'next-auth/react';

const batchSize = 10;

interface MyReviewsProps {
    id: string;
}

const MyReviews: React.FC<MyReviewsProps> = ({ id }) => {
    const { messages: t } = useI18n();
    const [reviews, setReviews] = useState<ReviewDto[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();

    useEffect(() => {
        fetchReviews(currentPage);
    }, [currentPage, id]);

    async function fetchReviews(page: number) {
        setLoading(true);
        if (!id) return;

        const params = new URLSearchParams();

        params.append('pageNumber', page.toString());
        params.append('pageSize', batchSize.toString());

        const res = await apiGet<any>(`/review/user/${id}?${params.toString()}`, {}, session?.accessToken || '');
        
        setReviews(res.data.data || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setLoading(false);
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-darker rounded-lg">
            <h2 className="text-3xl font-bold text-white mt-8 mb-6 px-6">{t.profile.myReviews.title}</h2>
            <div className="flex-1 flex flex-col gap-6 px-6 pb-10">
                {loading ? (
                    <div className="text-white text-center py-20">{t.profile.myTrips.loading}</div>
                ) : reviews.length === 0 ? (
                    <div className="text-white text-center py-20">{t.profile.myReviews.noReviews}</div>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="bg-[#2d1857] rounded-xl flex flex-row items-center p-6 shadow-lg">
                            <Image
                                src={review.reviewer?.imagePath ? (process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + review.reviewer.imagePath : '/dummy.png'}
                                alt={review.reviewer?.userName || 'Reviewer'}
                                width={80}
                                height={80}
                                className="rounded-full object-cover"
                            />
                            <div className="flex-1 flex flex-col px-6">
                                <div className="flex gap-2 items-center text-white text-lg font-bold">
                                    {review.reviewer?.name}
                                </div>
                                <div className="flex gap-2 items-center text-white mt-2">
                                    <span className="font-bold">{review.reviewer?.email}</span>
                                    <span className="text-yellow-400">★ {review.reviewer?.rating?.toFixed(1)}</span>
                                </div>
                                <div className="flex flex-col gap-2 mt-4">
                                    <div className="text-white font-bold">{t.profile.myReviews.review}: <span className="text-yellow-400">{review.rating}</span></div>
                                    <div className="text-white text-sm">{review.text}</div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-10 gap-2 text-lg">
                        <button
                            className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg disabled:bg-[#2d1857] disabled:cursor-not-allowed"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                        >
                            1
                        </button>
                        {currentPage > 2 && (
                            <button
                                className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg"
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                {currentPage - 1}
                            </button>
                        )}
                        <span className="px-6 py-2 bg-[#7c3aed] text-white rounded-lg">{currentPage}</span>
                        {currentPage < totalPages - 1 && (
                            <button
                                className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg"
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                {currentPage + 1}
                            </button>
                        )}
                        <button
                            className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg disabled:bg-[#2d1857] disabled:cursor-not-allowed"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            {totalPages}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyReviews;