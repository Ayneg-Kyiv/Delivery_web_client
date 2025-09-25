'use client';

import React, { useEffect, useState } from 'react';
import { ApiClient } from '@/app/api-client';
import Image from 'next/image';
import Link from 'next/link';
import { formatDateTime } from '@/components/other/date-time-former';

const batchSize = 10;

interface MyOrdersProps {
    id: string;
}

const MyOrders: React.FC<MyOrdersProps> = ({ id }) => {
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
            <h2 className="text-3xl font-bold text-white mt-8 mb-6 px-6">Мої замовлення</h2>
            <div className="flex-1 flex flex-col gap-6 px-6 pb-10">
                {loading ? (
                    <div className="text-white text-center py-20">Завантаження...</div>
                ) : orders.length === 0 ? (
                    <div className="text-white text-center py-20">Немає замовлень</div>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className="bg-[#2d1857] rounded-xl flex flex-row items-center p-6 shadow-lg">
                            <Image
                                src={order.driver?.imagePath ? (process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + order.driver.imagePath : '/dummy.png'}
                                alt={order.trip?.fullName || 'Водій'}
                                width={80}
                                height={80}
                                className="self-start rounded-full object-cover"
                            />
                            <div className="flex-1 flex flex-col px-6">
                                <div className="flex gap-2 items-center text-white text-lg font-bold">
                                    {order.startLocation.city} - {order.endLocation.city}
                                </div>
                                <div className="flex flex-col gap-4 text-white mt-2">
                                    <span>
                                        відбуття: {formatDateTime(order.startLocation.dateTime)}
                                    </span>
                                    <span>
                                        прибуття: {formatDateTime(order.endLocation.dateTime)}
                                    </span>
                                </div>
                                <div className="flex gap-2 items-center text-white mt-2">
                                    <span>Водій: {order.driver?.name}</span>
                                    <span className="font-bold">{order.driver?.email}</span>
                                    <span className="text-yellow-400">★ {order.driver?.rating?.toFixed(1)}</span>
                                </div>
                                <div className="flex flex-col gap-2 mt-4">
                                    <div className="text-white font-bold">Статус замовлення:</div>
                                    <div className="text-white text-sm">
                                        {order.isDeclined
                                            ? 'Відхилено'
                                            : order.isAccepted
                                                ? order.isDelivered
                                                    ? 'Доставлено'
                                                    : order.isPickedUp
                                                        ? 'В дорозі'
                                                        : 'Підтверджено'
                                                : 'Очікує підтвердження'}
                                    </div>
                                    {order.comment && (
                                        <div className="text-white text-xs mt-2">Коментар: {order.comment}</div>
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
                                        Передана водієві
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
                                        Доставлено одержувачу
                                    </button>
                                )}
                            </div>
                            </div>
                            <div className="self-start flex flex-col items-end gap-2">
                                <div className="w-full bg-[#7c3aed] text-white px-4 py-2 rounded-lg font-bold text-xl">
                                    Вартість: {order.deliverySlot
                                        ? order.deliverySlot.approximatePrice
                                        : '-'}грн
                                </div>
                                <Link href={`/delivery/trip/${order.tripId}`} className='w-full '>
                                    <button className="w-full bg-white text-[#7c3aed] px-6 py-2 rounded-lg font-bold mt-2">Деталі поїздки</button>
                                </Link>
                                <Link href={`/delivery/chat/order?orderId=${order.id}`} className='w-full'>
                                    <button className="w-full bg-white text-[#7c3aed] px-6 py-2 rounded-lg font-bold mt-2">Перейти до чату</button>
                                </Link>
                                {
                                    order.isDelivered && (
                                        <Link href={`/delivery/review/order/${order.id}/?userId=${order.driver?.id}`} className='w-full'>
                                            <button className="w-full bg-white text-[#7c3aed] px-6 py-2 rounded-lg font-bold mt-2">Залишити відгук</button>
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