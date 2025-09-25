
'use client';

import React, { useEffect, useState } from 'react';
import { ApiClient } from '@/app/api-client';
import Image from 'next/image';
import Link from 'next/link';
import { formatDateTime } from '@/components/other/date-time-former';

// Location model
type Location = {
    id: string;
    country: string;
    city: string;
    address: string;
    dateTime: string;
    latitude?: number;
    longitude?: number;
};

// Request model
type DeliveryRequest = {
    id: string;
    startLocation: Location;
    endLocation: Location;
    senderName: string;
    senderPhoneNumber: string;
    senderEmail?: string;
    sender: {
        email: string;
        name: string;
        rating: number;
        imagePath?: string;
    };
    receiverName: string;
    receiverPhoneNumber: string;
    objectName: string;
    cargoSlotType: string;
    objectWeight: number;
    objectDescription?: string;
    comment?: string;
    estimatedPrice?: number;
    deliveryOfferID ?: string;
    offers ?: DeliveryOffer[];
    isAccepted: boolean;
    isPickedUp: boolean;
    isDelivered: boolean;
};

// Offer model
type DeliveryOffer = {
    id: string;
    deliveryRequestId: string;
    deliveryRequest: DeliveryRequest;
    price: number;
    driverId: string;
    driver: {
        email: string;
        name: string;
        rating: number;
        imagePath?: string;
    };
    estimatedCollectionTime: string;
    estimatedDeliveryTime: string;
    isAccepted: boolean;
    isDeclined: boolean;
};

const batchSize = 10;

interface MyReviewsProps {
    id: string;
}

const MyRequests: React.FC<MyReviewsProps> = ({ id }) => {
    const [requests, setRequests] = useState<DeliveryRequest[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRequests(currentPage);
        if(!id) return;
    }, [currentPage, id]);

    async function fetchRequests(page: number) {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('pageNumber', page.toString());
        params.append('pageSize', batchSize.toString());

        const res = await ApiClient.get<any>(`/request/sender?${params.toString()}`);
        console.log('Fetch requests response:', res);
        const reqs: DeliveryRequest[] = res.data.data || [];
        setRequests(reqs);
        setTotalPages(res.data.pagination?.totalPages || 1);

        setLoading(false);
    }

    return (
    <div className="flex flex-col w-full min-h-screen bg-darker rounded-lg">
            <h2 className="text-3xl font-bold text-white mt-8 mb-6 px-6">Мої запити на доставку</h2>
            <div className="flex-1 flex flex-col gap-6 px-6 pb-10">
                {loading ? (
                    <div className="text-white text-center py-20">Завантаження...</div>
                ) : requests.length === 0 ? (
                    <div className="text-white text-center py-20">Немає запитів</div>
                ) : (
                    requests.map(request => (
                        <div key={request.id} className="bg-[#2d1857] rounded-xl flex flex-col md:flex-row items-center p-6 shadow-lg">
                            <div className="self-start flex flex-col items-center justify-center mr-6">
                                <Image
                                    src={request.sender?.imagePath ? (process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + request.sender.imagePath : '/dummy.png'}
                                    alt={request.sender?.name || request.senderName}
                                    width={80}
                                    height={80}
                                    className="rounded-full object-cover"
                                />
                                <span className="text-white text-xs mt-2">{request.sender?.name || request.senderName}</span>
                                {request.sender?.rating && (
                                    <span className="text-yellow-400">★ {request.sender.rating.toFixed(1)}</span>
                                )}
                            </div>
                            <div className="flex-1 flex flex-col px-6">
                                <div className="flex gap-2 items-center text-white text-lg font-bold">
                                    {request.startLocation.city} {request.startLocation.address} - {request.endLocation.city} {request.endLocation.address}
                                </div>
                                <div className="flex flex-col gap-4 text-white mt-2">
                                    <span>
                                        відправка: {formatDateTime(request.startLocation.dateTime)}
                                    </span>
                                    <span>
                                        прибуття: {formatDateTime(request.endLocation.dateTime)}
                                    </span>
                                </div>
                                <div className="flex gap-2 items-center text-white mt-2">
                                    <span>Відправник: {request.senderName}</span>
                                    <span className="font-bold">{request.senderPhoneNumber}</span>
                                    {request.senderEmail && <span>{request.senderEmail}</span>}
                                </div>
                                <div className="flex gap-2 items-center text-white mt-2">
                                    <span>Вантаж: {request.objectName}</span>
                                    <div className='flex gap-2 flex-row'>
                                        <span>Тип: {request.cargoSlotType}</span>
                                        <span>Вага: {request.objectWeight} кг</span>
                                    </div>
                                </div>
                                {request.objectDescription && (
                                    <div className="text-white mt-2">Опис: {request.objectDescription}</div>
                                )}
                                {request.comment && (
                                    <div className="text-white mt-2">Коментар: {request.comment}</div>
                                )}
                                {/* Status and action buttons */}
                                <div className="flex items-center gap-4 mb-2">
                                    <span className="text-white font-bold">Статус: {request.isDelivered ? 'Доставлено' : request.isPickedUp ? 'Забрано' : 'Очікує'}</span>
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded-lg font-bold disabled:bg-gray-600"
                                        disabled={request.isPickedUp || !request.isAccepted}
                                        onClick={async () => {
                                            setLoading(true);
                                            await ApiClient.put(`/request/pickup/${request.id}`);
                                            await fetchRequests(currentPage);
                                        }}
                                    >
                                        Забрано
                                    </button>
                                    <button
                                        className="bg-green-600 text-white px-3 py-1 rounded-lg font-bold disabled:bg-gray-600"
                                        disabled={!request.isPickedUp || request.isDelivered}
                                        onClick={async () => {
                                            setLoading(true);
                                            await ApiClient.put(`/request/deliver/${request.id}`);
                                            await fetchRequests(currentPage);
                                        }}
                                    >
                                        Доставлено
                                    </button>
                                </div>
                                <div className="flex flex-col gap-2 mt-4">
                                    <div className="text-white font-bold">Пропозиції водіїв:</div>
                                    {request.offers && request.offers.length ? (
                                        request.offers.map(offer => (
                                            <div key={offer.id} className={`bg-[#1a093a] rounded-lg p-4 mt-2 flex flex-col md:flex-row md:items-center gap-4 ${offer.id === request.deliveryOfferID ? 'border-2 border-green-400' : ''}`}>
                                                <div className="flex items-center gap-2">
                                                    <Image
                                                        src={offer.driver.imagePath ? (process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + offer.driver.imagePath : '/dummy.png'}
                                                        alt={offer.driver.name || 'Driver'}
                                                        width={48}
                                                        height={48}
                                                        className="rounded-full object-cover"
                                                    />
                                                    <span className="text-white font-bold">{offer.driver.name}</span>
                                                    <span className="text-yellow-400">★ {offer.driver.rating?.toFixed(1)}</span>
                                                </div>
                                                <div className="flex flex-col text-white text-sm">
                                                    <span>Ціна: <span className="font-bold">{offer.price} грн</span></span>
                                                    <span>Забір: {formatDateTime(offer.estimatedCollectionTime)}</span>
                                                    <span>Доставка: {formatDateTime(offer.estimatedDeliveryTime)}</span>
                                                    <span>
                                                        Статус:{' '}
                                                        {offer.isDeclined
                                                            ? 'Відхилено'
                                                            : offer.isAccepted
                                                                ? 'Підтверджено'
                                                                : 'Очікує підтвердження'}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2 mt-2 md:mt-0">
                                                    {(!offer.isAccepted && !offer.isDeclined) && (
                                                        <>
                                                            <button
                                                                className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold"
                                                                onClick={async () => {
                                                                    setLoading(true);
                                                                    await ApiClient.put(`/request/offer/accept/${offer.id}`);
                                                                    await fetchRequests(currentPage);
                                                                }}
                                                            >
                                                                Прийняти
                                                            </button>
                                                            <button
                                                                className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold"
                                                                onClick={async () => {
                                                                    setLoading(true);
                                                                    await ApiClient.put(`/request/offer/decline/${offer.id}`);
                                                                    await fetchRequests(currentPage);
                                                                }}
                                                            >
                                                                Відхилити
                                                            </button>
                                                        </>
                                                    )}
                                                    {
                                                        offer.id === request.deliveryOfferID && (
                                                            <Link href={`/delivery/chat/offer?offerId=${request.deliveryOfferID}`} className="bg-purple-500 text-white px-4 py-2 rounded-lg font-bold">
                                                                Перейти до чату
                                                            </Link>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-white text-sm mt-2">Немає пропозицій</div>
                                    )}
                                </div>
                            </div>
                            <div className="self-start flex flex-col justify-end items-end gap-2">
                                <div className="w-full bg-[#7c3aed] text-white px-4 py-2 rounded-lg font-bold text-xl">
                                    {request.estimatedPrice ? `${request.estimatedPrice} грн` : 'Ціна не вказана'}
                                </div>
                                <Link href={`/delivery/request/${request.id}`} className='w-full'>
                                    <button className="w-full bg-white text-[#7c3aed] px-6 py-2 rounded-lg font-bold mt-2">Деталі запиту</button>
                                </Link>
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

export default MyRequests;