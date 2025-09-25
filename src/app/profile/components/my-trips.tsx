'use client';

import React, { useEffect, useState } from 'react';
import { ApiClient } from '@/app/api-client';
import Image from 'next/image';
import Link from 'next/link';

type LocationState = {
    country: string;
    city: string;
    address: string;
    date: string;
    time: string;
    dateTime: string;
    latitude: number | null;
    longitude: number | null;
};

type Vehicle = {
    id: string;
    type: string;
    brand: string;
    model: string;
    color: string;
    numberPlate: string;
    imagePath: string;
    imagePathBack: string;
    createdAt: string;
    updatedAt: string;
};

type DeliverySlot = {
    id: string;
    cargoSlotTypeName: string;
    approximatePrice: number;
};

type DeliveryOrder = {
    id: string;
    tripId: string;
    senderId?: string;
    sender: {
        id: string;
        name: string;
        email?: string;
        phoneNumber?: string;
    };
    deliverySlotId: string;
    startLocation: LocationState;
    endLocation: LocationState;
    senderName: string;
    senderPhoneNumber: string;
    senderEmail?: string;
    receiverName: string;
    receiverPhoneNumber: string;
    comment?: string;
    isAccepted: boolean;
    isDeclined: boolean;
    isPickedUp: boolean;
    isDelivered: boolean;
};

type Trip = {
    id: string;
    startLocation: LocationState;
    endLocation: LocationState;
    vehicle: Vehicle;
    deliverySlots: DeliverySlot[];
    deliveryOrders: DeliveryOrder[];
    driver: {
        email: string;
        name: string;
        rating: number;
        imagePath?: string;
    };
    price: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    cargoType: string;
    isStarted: boolean;
    isCompleted: boolean;
};

const batchSize = 10;

const MyTrips: React.FC = () => {
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

    return (
        <div className="flex flex-col w-full min-h-screen bg-darker rounded-lg">
            <h2 className="text-3xl font-bold text-white mt-8 mb-6 px-6">Мої поїздки</h2>
            <div className="flex-1 flex flex-col gap-6 px-6 pb-10">
                {loading ? (
                    <div className="text-white text-center py-20">Завантаження...</div>
                ) : trips.length === 0 ? (
                    <div className="text-white text-center py-20">Немає поїздок</div>
                ) : (
                    trips.map(trip => (
                        <div key={trip.id} className="bg-[#2d1857] rounded-xl flex flex-row items-center p-6 shadow-lg">
                            <Image
                                src={trip.driver.imagePath ? (process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + trip.driver.imagePath : '/dummy.png'}
                                alt={trip.fullName}
                                width={80}
                                height={80}
                                className="self-start rounded-full object-cover"
                            />
                            <div className="flex-1 flex flex-col px-6">
                                <div className="flex gap-2 items-center text-white text-lg font-bold">
                                    {trip.startLocation.city} - {trip.endLocation.city}
                                </div>
                                <div className="flex flex-col gap-4 text-white mt-2">
                                    <span>
                                        відбуття: {trip.startLocation.dateTime}
                                    </span>
                                    <span>
                                        прибуття: {trip.endLocation.dateTime}
                                    </span>
                                </div>
                                <div className="flex gap-2 items-center text-white mt-2">
                                    <span>Водій: {trip.fullName}</span>
                                    <span className="font-bold">{trip.driver.email}</span>
                                    <span className="text-yellow-400">★ {trip.driver.rating.toFixed(1)}</span>
                                </div>
                                <div className="flex flex-col gap-2 mt-4">
                                    <div className="text-white font-bold">Замовлення:</div>
                                    {trip.deliveryOrders.length === 0 ? (
                                        <div className="text-white text-sm">Немає замовлень</div>
                                    ) : (
                                        trip.deliveryOrders.map(order => (
                                            <div key={order.id} className="bg-[#7c3aed]/30 rounded-lg p-3 mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
                                                <div>
                                                    <div className="text-white text-sm font-bold">Відправник: {order.senderName}</div>
                                                    <div className="text-white text-sm">Телефон: {order.senderPhoneNumber}</div>
                                                    <div className="text-white text-sm">Статус: {order.isAccepted ? (order.isDelivered ? 'Доставлено' : order.isPickedUp ? 'В дорозі' : 'Підтверджено') : 'Очікує підтвердження'}</div>
                                                </div>
                                                <div className="flex gap-2 mt-2 md:mt-0">
                                                    
                                                    <Link href={`/delivery/chat/order?orderId=${order.id}`} className='w-full'>
                                                        <button className="w-full bg-white text-[#7c3aed] px-6 py-2 rounded-lg font-bold">Перейти до чату</button>
                                                    </Link>

                                                    {!order.isAccepted && (
                                                        <>
                                                            <button
                                                                className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold"
                                                                onClick={() => handleOrderAction(order.id, 'accept')}
                                                                disabled={loading}
                                                            >
                                                                Підтвердити
                                                            </button>
                                                            <button
                                                                className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold"
                                                                onClick={() => handleOrderAction(order.id, 'declined')}
                                                                disabled={loading}
                                                            >
                                                                Відхилити
                                                            </button>
                                                        </>
                                                    )}
                                                    {
                                                        order.isDelivered && (
                                                            <Link href={`/delivery/review/order/${order.id}/?userId=${order.sender.id}`} className='w-full'>
                                                                <button className="bg-white text-[#7c3aed] px-4 py-2 rounded-lg font-bold">Залишити відгук</button>
                                                            </Link>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            <div className="self-start flex flex-col items-end gap-2">
                                <div className="bg-[#7c3aed] text-white px-4 py-2 rounded-lg font-bold text-xl">
                                    Мінімальна вартість: {trip.deliverySlots.length > 0
                                        ? Math.min(...trip.deliverySlots.map(slot => slot.approximatePrice))
                                        : trip.price}грн
                                </div>
                                <div className="text-white text-xs">Ціна може змінюватись від розміру посилки</div>
                                <Link href={`/delivery/trip/${trip.id}`} className='w-full'>
                                    <button className="w-full bg-white text-[#7c3aed] px-6 py-2 rounded-lg font-bold mt-2">Деталі</button>
                                </Link>

                                <div className="flex gap-2 mt-2">
                                    {!trip.isStarted  && (
                                        <button
                                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-bold"
                                            onClick={() => handleTripAction(trip.id, 'start')}
                                            disabled={loading}
                                        >
                                            Почати поїздку
                                        </button>
                                    )}
                                    {trip.isStarted && !trip.isCompleted && (
                                        <button
                                            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-bold"
                                            onClick={() => handleTripAction(trip.id, 'complete')}
                                            disabled={loading}
                                        >
                                            Завершити поїздку
                                        </button>
                                    )}
                                    {trip.isCompleted && (
                                        <span className="text-green-400 font-bold">Поїздка завершена</span>
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