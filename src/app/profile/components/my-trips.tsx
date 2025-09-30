'use client';

import React, { useEffect, useState } from 'react';
import { ApiClient } from '@/app/api-client';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

const batchSize = 10;

const MyTrips: React.FC = () => {
    const { messages: t } = useI18n();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTrips(currentPage);
    }, [currentPage]);

    async function fetchTrips(page: number) {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('pageNumber', page.toString());
        params.append('pageSize', batchSize.toString());
        // Only fetch trips for current user as driver
        const res = await ApiClient.get<any>(`/trip/list/with-orders`);

        console.log('Trips response:', res);

        setTrips(res.data.data || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setLoading(false);
    }

    async function handleOrderAction(orderId: string, action: 'accept' | 'declined') {
        setLoading(true);
        try {
            await ApiClient.put(`/trip/order/${action}/${orderId}`);
            fetchTrips(currentPage);
        } catch (err) {
            // handle error
        }
        setLoading(false);
    }

    async function handleTripAction(tripId: string, action: 'start' | 'complete') {
        setLoading(true);
        try {
            await ApiClient.put(`/trip/${action}/${tripId}`);
            fetchTrips(currentPage);
        } catch (err) {
            // handle error
        }
        setLoading(false);
    }

    const getOrderStatus = (order: any) => {
        if (order.isDelivered) return t.profile.myTrips.statusValues.delivered;
        if (order.isPickedUp) return t.profile.myTrips.statusValues.inTransit;
        if (order.isAccepted) return t.profile.myTrips.statusValues.confirmed;
        return t.profile.myTrips.statusValues.awaitingConfirmation;
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-darker rounded-lg">
            <h2 className="text-3xl font-bold text-white mt-8 mb-6 px-6">{t.profile.myTrips.title}</h2>
            <div className="flex-1 flex flex-col gap-6 px-6 pb-10">
                {loading ? (
                    <div className="text-white text-center py-20">{t.profile.myTrips.loading}</div>
                ) : trips.length === 0 ? (
                    <div className="text-white text-center py-20">{t.profile.myTrips.noTrips}</div>
                ) : (
                    trips.map(trip => (
                        <div key={trip.id} className="bg-[#2d1857] rounded-xl flex flex-col md:flex-row items-center p-6 shadow-lg">
                            <Image
                                src={trip.driver.imagePath ? (process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + trip.driver.imagePath : '/dummy.png'}
                                alt={trip.fullName}
                                width={80}
                                height={80}
                                className="md:self-start rounded-full object-cover mb-4 md:mb-0"
                            />
                            <div className="flex-1 flex flex-col px-4 md:px-6">
                                <div className="flex gap-2 items-center text-white text-lg font-bold">
                                    {trip.startLocation.city} - {trip.endLocation.city}
                                </div>
                                <div className="flex flex-col gap-4 text-white mt-2">
                                    <span>
                                        {t.profile.myTrips.departure}: {trip.startLocation.dateTime}
                                    </span>
                                    <span>
                                        {t.profile.myTrips.arrival}: {trip.endLocation.dateTime}
                                    </span>
                                </div>
                                <div className="flex flex-col md:flex-row gap-2 items-start md:items-center text-white mt-2">
                                    <span>{t.profile.myTrips.driver}: {trip.fullName}</span>
                                </div>
                                
                                <div className="flex flex-col gap-2 mt-4 pt-10 md:pt-2">
                                    <div className="text-white font-bold">{t.profile.myTrips.orders}</div>
                                    {trip.deliveryOrders.length === 0 ? (
                                        <div className="text-white text-sm">{t.profile.myTrips.noOrders}</div>
                                    ) : (
                                        trip.deliveryOrders.map(order => (
                                            <div key={order.id} className="bg-[#7c3aed]/30 rounded-lg p-3 mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
                                                <div>
                                                    <div className="text-white text-sm font-bold">{t.profile.myTrips.sender}: {order.senderName}</div>
                                                    <div className="text-white text-sm">{t.profile.myTrips.phone}: {order.senderPhoneNumber}</div>
                                                    <div className="text-white text-sm">{t.profile.myTrips.status}: {getOrderStatus(order)}</div>
                                                </div>
                                                <div className="flex gap-2 mt-2 md:mt-0">
                                                    
                                                    <Link href={`/delivery/chat/order?orderId=${order.id}`} className='w-full'>
                                                        <button className="w-full bg-white text-[#7c3aed] px-6 py-2 rounded-lg font-bold">{t.profile.myTrips.goToChat}</button>
                                                    </Link>

                                                    {!order.isAccepted && (
                                                        <>
                                                            <button
                                                                className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold"
                                                                onClick={() => handleOrderAction(order.id, 'accept')}
                                                                disabled={loading}
                                                            >
                                                                {t.profile.myTrips.confirm}
                                                            </button>
                                                            <button
                                                                className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold"
                                                                onClick={() => handleOrderAction(order.id, 'declined')}
                                                                disabled={loading}
                                                            >
                                                                {t.profile.myTrips.decline}
                                                            </button>
                                                        </>
                                                    )}
                                                    {
                                                        order.isDelivered && (
                                                            <Link href={`/delivery/review/order/${order.id}/?userId=${order.sender?.id}`} className='w-full'>
                                                                <button className="bg-white text-[#7c3aed] px-4 py-2 rounded-lg font-bold">{t.profile.myTrips.leaveReview}</button>
                                                            </Link>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            <div className="w-full md:w-1/3 pt-10 md:pt-0 md:self-start flex flex-col md:items-end gap-2">
                                <div className="w-full bg-[#7c3aed] text-white px-4 py-2 rounded-lg font-bold text-xl">
                                    {t.profile.myTrips.minCost}: {trip.deliverySlots.length > 0
                                        ? Math.min(...trip.deliverySlots.map(slot => slot.approximatePrice))
                                        : trip.price}{t.profile.myTrips.currency}
                                </div>
                                <div className="text-white text-xs">{t.profile.myTrips.priceDisclaimer}</div>
                                <Link href={`/delivery/trip/${trip.id}`} className='w-full'>
                                    <button className="w-full bg-white text-[#7c3aed] px-6 py-2 rounded-lg font-bold mt-2">{t.profile.myTrips.details}</button>
                                </Link>

                                <div className="w-full flex gap-2 mt-2">
                                    {!trip.isStarted  && (
                                        <button
                                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-bold"
                                            onClick={() => handleTripAction(trip.id, 'start')}
                                            disabled={loading}
                                        >
                                            {t.profile.myTrips.startTrip}
                                        </button>
                                    )}
                                    {trip.isStarted && !trip.isCompleted && (
                                        <button
                                            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-bold"
                                            onClick={() => handleTripAction(trip.id, 'complete')}
                                            disabled={loading}
                                        >
                                            {t.profile.myTrips.completeTrip}
                                        </button>
                                    )}
                                    {trip.isCompleted && (
                                        <span className="text-green-400 font-bold">{t.profile.myTrips.tripCompleted}</span>
                                    )}
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

export default MyTrips;