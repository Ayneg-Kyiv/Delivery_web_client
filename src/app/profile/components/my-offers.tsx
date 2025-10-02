'use client';

import React, { useEffect, useState } from 'react';
import { ApiClient } from '@/app/api-client';
import Image from 'next/image';
import Link from 'next/link';
import { formatDateTime } from '@/components/other/date-time-former';
import { useI18n } from '@/i18n/I18nProvider';

const batchSize = 10;

interface MyReviewsProps {
    id: string;
}

const MyOffers: React.FC<MyReviewsProps> = ({ id }) => {
    const { messages: t } = useI18n();
    const [offers, setOffers] = useState<DeliveryOffer[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOffers(currentPage);
        if(!id) return;
    }, [currentPage, id]);

    async function fetchOffers(page: number) {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('pageNumber', page.toString());
        params.append('pageSize', batchSize.toString());
        const res = await ApiClient.get<any>(`/request/driver?${params.toString()}`);
        setOffers(res.data.data || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setLoading(false);
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-darker rounded-lg">
            <h2 className="text-3xl font-bold text-white mt-8 mb-6 px-6">{t.profile.myOffers.title}</h2>
            <div className="flex-1 flex flex-col gap-6 px-6 pb-10">
                {loading ? (
                    <div className="text-white text-center py-20">{t.profile.myOffers.loading}</div>
                ) : offers.length === 0 ? (
                    <div className="text-white text-center py-20">{t.profile.myOffers.noOffers}</div>
                ) : (
                    offers.map(offer => (
                        <div key={offer.id} className="bg-[#2d1857] rounded-xl flex flex-col md:flex-row items-start p-2 md:p-6 shadow-lg gap-6">
                            {/* Delivery Request Section */}
                            <div className="flex flex-col  md:w-2/3 w-full bg-[#1a093a] rounded-lg p-4 border border-[#7c3aed]">
                                <h3 className="text-lg font-bold text-[#7c3aed] mb-2">{t.profile.myOffers.deliveryRequest}</h3>
                                <div className="flex items-center gap-4 mb-2">
                                    <Image
                                        src={offer.deliveryRequest.sender?.imagePath ? (process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + offer.deliveryRequest.sender.imagePath : '/dummy.png'}
                                        alt={offer.deliveryRequest.sender?.name || offer.deliveryRequest.senderName}
                                        width={60}
                                        height={60}
                                        className="rounded-full object-cover"
                                    />
                                    <span className="text-white text-xs">{offer.deliveryRequest.sender?.name || offer.deliveryRequest.senderName}</span>
                                    {offer.deliveryRequest.sender?.rating && (
                                        <span className="text-yellow-400">★ {offer.deliveryRequest.sender.rating.toFixed(1)}</span>
                                    )}
                                </div>
                                <div className="flex gap-2 items-center text-white text-lg font-bold">
                                    {offer.deliveryRequest.startLocation.city} {offer.deliveryRequest.startLocation.address} - {offer.deliveryRequest.endLocation.city} {offer.deliveryRequest.endLocation.address}
                                </div>
                                <div className="flex flex-col gap-2 text-white mt-2">
                                    <span>{t.profile.myOffers.departure}: {formatDateTime(offer.deliveryRequest.startLocation.dateTime)}</span>
                                    <span>{t.profile.myOffers.arrival}: {formatDateTime(offer.deliveryRequest.endLocation.dateTime)}</span>
                                </div>
                                <div className="flex flex-col md:flex-row gap-2 md:items-center text-white mt-6 md:mt-2">
                                    <span>{t.profile.myOffers.sender}:</span>
                                    <span>{offer.deliveryRequest.senderName}</span>
                                    <span className="font-bold">{offer.deliveryRequest.senderPhoneNumber}</span>
                                    {offer.deliveryRequest.senderEmail && <span>{offer.deliveryRequest.senderEmail}</span>}
                                </div>
                                <div className="flex gap-2 items-center text-white mt-6 md:mt-2">
                                    <span>{t.profile.myOffers.cargo}: {offer.deliveryRequest.objectName}</span>
                                    <span>{t.profile.myOffers.type}: {offer.deliveryRequest.cargoSlotType}</span>
                                    <span>{t.profile.myOffers.weight}: {offer.deliveryRequest.objectWeight} кг</span>
                                </div>
                                {offer.deliveryRequest.objectDescription && (
                                    <div className="text-white mt-2">{t.profile.myOffers.description}: {offer.deliveryRequest.objectDescription}</div>
                                )}
                                {offer.deliveryRequest.comment && (
                                    <div className="text-white mt-2">{t.profile.myOffers.comment}: {offer.deliveryRequest.comment}</div>
                                )}
                            </div>
                            {/* Offer Section */}
                            <div className="flex flex-col md:w-1/3 w-full bg-[#7c3aed] rounded-lg p-4 border border-[#1a093a] items-end">
                                <h3 className="text-lg font-bold text-white mb-2">{t.profile.myOffers.yourOffer}</h3>
                                <div className="text-white font-bold mb-2">
                                    {t.profile.myOffers.status}: {offer.isDeclined ? t.profile.myOffers.statusValues.declined : offer.isAccepted ? t.profile.myOffers.statusValues.accepted : t.profile.myOffers.statusValues.awaitingConfirmation}
                                </div>
                                <div className="w-full bg-white text-[#7c3aed] px-4 py-2 rounded-lg font-bold text-xl mb-2">
                                    {offer.price ? `${offer.price} ${t.profile.myOffers.currency}` : t.profile.myOffers.priceNotSpecified}
                                </div>
                                <div className="flex flex-col text-white text-sm mb-2 w-full">
                                    <span>{t.profile.myOffers.collection}: {formatDateTime(offer.estimatedCollectionTime)}</span>
                                    <span>{t.profile.myOffers.delivery}: {formatDateTime(offer.estimatedDeliveryTime)}</span>
                                </div>
                                <Link href={`/delivery/request/${offer.deliveryRequestId}`} className='w-full'>
                                    <button className="w-full bg-white text-[#7c3aed] px-6 py-2 rounded-lg font-bold mt-2">{t.profile.myOffers.requestDetails}</button>
                                </Link>

                                <Link href={`/delivery/chat/offer?offerId=${offer.id}`} className='w-full'>
                                    <button className="w-full bg-white text-[#7c3aed] px-6 py-2 rounded-lg font-bold mt-2">{t.profile.myOffers.goToChat}</button>
                                </Link>

                                {
                                    offer.deliveryRequest.isDelivered && (
                                        <Link href={`/delivery/review/request/${offer.deliveryRequest.id}/?userId=${id}`} className='w-full'>
                                            <button className="w-full bg-white text-[#7c3aed] px-6 py-2 rounded-lg font-bold mt-2">{t.profile.myOffers.leaveReview}</button>
                                        </Link>
                                    )
                                }
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

export default MyOffers;