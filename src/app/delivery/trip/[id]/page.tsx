'use client';

import React, { useEffect, useState } from 'react';
import { ApiClient } from '@/app/api-client';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import TravelPathMap from '@/components/other/travel-path-map';

const TripDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);
    const session = useSession();

    useEffect(() => {
        const fetchTrip = async () => {
            setLoading(true);
            const res = await ApiClient.get<any>(`/trip/${id}`);

            console.log(res.data);

            setTrip(res.data);
            setLoading(false);
        };
        fetchTrip();
    }, [id]);

    if (session.status === 'loading' || loading) {
        return (
            <div className="flex flex-col w-full min-h-screen bg-[#1a093a] justify-center items-center">
                <div className="text-white text-center py-20">Завантаження...</div>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="flex flex-col w-full min-h-screen bg-[#1a093a] justify-center items-center">
                <div className="text-white text-center py-20">Поїздка не знайдена</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-[#1a093a]">
            <div className="relative w-full h-[350px]">
                <Image
                    src="/Rectangle47.png"
                    alt="Delivery"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-[#1a093a]/60 flex flex-col justify-center items-center px-8">
                    <h1 className="text-4xl font-bold mb-4 text-white">
                        Деталі поїздки
                    </h1>
                    <div className="flex gap-4 text-white text-xl font-bold">
                        <span>{trip.startLocation.city}</span>
                        <span>-</span>
                        <span>{trip.endLocation.city}</span>
                    </div>
					<div className='flex flex-col md:flex-row gap-4 justify-center items-center mt-4 text-lg font-medium'>
						<div className="mt-2 text-white">
							Відправка: {trip.startLocation.dateTime} 
						</div>
						<div className='hidden md:block'>
							|
						</div>
						<div className="mt-2 text-white">
							Доставка: {trip.endLocation.dateTime}
						</div>
					</div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 px-4 md:px-10 lg:px-20 py-10 w-full">
                {/* Driver Info */}
                <div className="flex flex-col p-6 rounded-lg w-full md:w-1/3 bg-[#ffffff] items-center">
                    <Image
                        src={trip.driver.imagePath ? (process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + trip.driver.imagePath : '/dummy.png'}
                        alt={trip.fullName}
                        width={100}
                        height={100}
                        className="rounded-full object-cover mb-4"
                    />
                    <div className="text-black text-xl font-bold">{trip.fullName}</div>
                    <div className="text-black">{trip.driver.email}</div>
                    <div className="text-yellow-400 font-bold mt-2">★ {trip.driver.rating.toFixed(1)}</div>
                    <div className="text-black mt-2">Телефон: {trip.phoneNumber}</div>

                    <div className="w-full mt-6">
                        <div className="text-lg font-bold mb-2 text-black">Відгуки про водія</div>
                        {trip.driver.reviews
                            .filter(review => review.rating > 0)
                            .length === 0 ? (
                            <div className="text-gray-500">Відгуків поки немає</div>
                        ) : (
                            <div className="flex flex-col gap-4 w-full">
                                {trip.driver.reviews
                                    .filter(review => review.rating > 0)
                                    .map(review => (
                                        <div key={review.id} className="bg-gray-100 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-yellow-400 font-bold">★ {review.rating}</span>
                                            </div>
                                            <div className="text-black">{review.text}</div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
                {/* Trip Details */}
                <div className="flex-1 flex flex-col gap-6">
                    <div className='w-full flex justify-between gap-6 flex-col md:flex-row bg-[#2d1857]'>

                        <div className=" rounded-xl p-6 shadow-lg text-white">
                            <div className="text-lg font-bold mb-2">Маршрут</div>
                            <div className="mb-2">
                                <span className="font-bold">Звідки:</span> {trip.startLocation.address}, {trip.startLocation.city}
                            </div>
                            <div className="mb-2">
                                <span className="font-bold">Куди:</span> {trip.endLocation.address}, {trip.endLocation.city}
                            </div>
                            <div className="mb-2">
                                <span className="font-bold">Дата відбуття:</span> {trip.startLocation.dateTime}
                            </div>
                            <div className="mb-2">
                                <span className="font-bold">Дата прибуття:</span> {trip.endLocation.dateTime}
                            </div>
                            <div className="mb-2">
                                <span className="font-bold">Тип транспорту:</span> {trip.vehicle.type}
                            </div>
                        </div>
                        <TravelPathMap 
                            start={{ 
                                latitude: trip.startLocation.latitude ?? 0, 
                                longitude: trip.startLocation.longitude ?? 0 
                            }} 
                            end={{ 
                                latitude: trip.endLocation.latitude ?? 0, 
                                longitude: trip.endLocation.longitude ?? 0 
                            }} 
                            className="w-full md:w-2/3 p-8 rounded-xl shadow-lg"
                        />
                    </div>
                    <div className="bg-[#2d1857] rounded-xl p-6 shadow-lg text-white">
                        <div className="text-lg font-bold mb-2">Автомобіль</div>
                        <div className="flex gap-4 items-center">
                            <Image
                                src={trip.vehicle.imagePath ? (process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + trip.vehicle.imagePath : '/dummy.png'}
                                alt={trip.vehicle.brand + ' ' + trip.vehicle.model}
                                width={120}
                                height={60}
                                className="max-h-[100px] rounded object-cover"
                            />
                            <div>
                                <div>{trip.vehicle.brand} {trip.vehicle.model}</div>
                                <div>Тип: {trip.vehicle.type}</div>
                                <div>Колір: {trip.vehicle.color}</div>
                                <div>Номер: {trip.vehicle.numberPlate}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#2d1857] rounded-xl p-6 shadow-lg text-white">
                        <div className="text-lg font-bold mb-2">Варіанти доставки</div>
                        {trip.deliverySlots.length === 0 ? (
                            <div>Варіанти доставки не вказані</div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {trip.deliverySlots.map(slot => (
                                    <div key={slot.id} className="flex justify-between items-center bg-[#7c3aed]/30 px-4 py-2 rounded-lg">
                                        <span>{slot.cargoSlotTypeName}</span>
                                        <span className="font-bold">{slot.approximatePrice} грн</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-4 text-xs text-white">Ціна може змінюватись від розміру посилки</div>
                    </div>
                    <div className="flex justify-end">
                        {
                            !trip.isStarted && !trip.isCompleted 
                            && trip.driverId !== session.data?.user?.id
                            && (
                                <Link href={`/delivery/trip/${trip.id}/order`} className='w-full md:w-auto'>
                                    <button className="w-full bg-[#7c3aed] text-white px-8 py-3 rounded-lg font-bold text-lg">
                                        Відправити посилку
                                    </button>
                                </Link>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripDetailPage;