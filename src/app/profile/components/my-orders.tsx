'use client';

import React, { useEffect, useState } from 'react';
import { ApiClient } from '@/app/api-client';
import Image from 'next/image';
import Link from 'next/link';
import { formatDateTime } from '@/components/other/date-time-former';
import { useI18n } from '@/i18n/I18nProvider';

const batchSize = 10;

interface MyOrdersProps {
    id: string;
}

const MyOrders: React.FC<MyOrdersProps> = ({ id }) => {
    const { messages: t } = useI18n();
    const [orders, setOrders] = useState<DeliveryOrder[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrders(currentPage);
        if(!id) return;
    }, [currentPage, id]);

    async function fetchOrders(page: number) {
        setLoading(true);
        const params = new URLSearchParams();

        params.append('pageNumber', page.toString());
        params.append('pageSize', batchSize.toString());
        
        const res = await ApiClient.get<any>(`/trip/orders/by-sender`);

        console.log('Orders response:', res);

        setOrders(res.data.data || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setLoading(false);
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-darker rounded-lg">
            <h2 className="text-3xl font-bold text-white mt-8 mb-6 px-6">{t.profile.myOrders.title}</h2>
            <div className="flex-1 flex flex-col gap-6 px-6 pb-10">
                {loading ? (
                    <div className="text-white text-center py-20">{t.profile.myOrders.loading}</div>
                ) : orders.length === 0 ? (
                    <div className="text-white text-center py-20">{t.profile.myOrders.noOrders}</div>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className="bg-[#2d1857] rounded-xl flex flex-col md:flex-row items-center p-6 shadow-lg">
                            
                            <div className="flex flex-col items-center gap-4 mb-2">
                                <Image
                                    src={order.driver?.imagePath ? (process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + order.driver.imagePath : '/dummy.png'}
                                    alt={order.trip?.fullName || t.profile.myOrders.driver}
                                    width={60}
                                    height={60}
                                    className="md:self-start rounded-full object-cover mb-4 md:mb-0"
                                />
                            </div>

                            <div className="flex-1 flex flex-col px-4 md:px-6 mb-10 md:mb-0">
                                <div className="flex gap-2 items-center text-white text-lg font-bold">
                                    {order.startLocation.city} - {order.endLocation.city}
                                </div>
                                <div className="flex flex-col gap-4 text-white mt-2">
                                    <span>
                                        {t.profile.myOrders.departure}: {formatDateTime(order.startLocation.dateTime)}
                                    </span>
                                    <span>
                                        {t.profile.myOrders.arrival}: {formatDateTime(order.endLocation.dateTime)}
                                    </span>
                                </div>
                                <div className="flex flex-col md:flex-row gap-2 items-center text-white mt-2">
                                    <span>{t.profile.myOrders.driver}: {order.driver?.name}</span>
                                </div>
                                <div className="flex flex-col gap-2 mt-10">
                                    <div className="text-white font-bold">{t.profile.myOrders.orderStatus}</div>
                                    <div className="text-white text-sm">
                                        {order.isDeclined
                                            ? t.profile.myOrders.status.declined
                                            : order.isAccepted
                                                ? order.isDelivered
                                                    ? t.profile.myOrders.status.delivered
                                                    : order.isPickedUp
                                                        ? t.profile.myOrders.status.inTransit
                                                        : t.profile.myOrders.status.confirmed
                                                : t.profile.myOrders.status.awaitingConfirmation}
                                    </div>
                                    {order.comment && (
                                        <div className="text-white text-xs mt-2">{t.profile.myOrders.comment}: {order.comment}</div>
                                    )}
                                </div>

                                <div className="flex gap-2 mt-2">
                                    {!order.isPickedUp && order.isAccepted && !order.isDeclined && (
                                        <button
                                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold"
                                            onClick={async () => {
                                                setLoading(true);
                                                await ApiClient.put(`/trip/order/pickup/${order.id}`);
                                                await fetchOrders(currentPage);
                                            }}
                                        >
                                            {t.profile.myOrders.handedToDriver}
                                        </button>
                                    )}
                                    {order.isPickedUp && !order.isDelivered && (
                                        <button
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold"
                                            onClick={async () => {
                                                setLoading(true);
                                                await ApiClient.put(`/trip/order/deliver/${order.id}`);
                                                await fetchOrders(currentPage);
                                            }}
                                        >
                                            {t.profile.myOrders.deliveredToRecipient}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="w-full md:w-1/3 md:self-start flex flex-col md:items-end gap-2">
                                <div className="w-full bg-[#7c3aed] text-white px-4 py-2 rounded-lg font-bold text-xl">
                                    {t.profile.myOrders.cost}: {order.deliverySlot
                                        ? order.deliverySlot.approximatePrice
                                        : '-'}{t.profile.myOrders.currency}
                                </div>
                                <Link href={`/delivery/trip/${order.tripId}`} className='w-full '>
                                    <button className="w-full bg-white text-[#7c3aed] px-6 py-2 rounded-lg font-bold mt-2">{t.profile.myOrders.tripDetails}</button>
                                </Link>
                                <Link href={`/delivery/chat/order?orderId=${order.id}`} className='w-full'>
                                    <button className="w-full bg-white text-[#7c3aed] px-6 py-2 rounded-lg font-bold mt-2">{t.profile.myOrders.goToChat}</button>
                                </Link>
                                {
                                    order.isDelivered && (
                                        <Link href={`/delivery/review/order/${order.id}/?userId=${order.driver?.id}`} className='w-full'>
                                            <button className="w-full bg-white text-[#7c3aed] px-6 py-2 rounded-lg font-bold mt-2">{t.profile.myOrders.leaveReview}</button>
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

export default MyOrders;