'use client';

import React, { useEffect, useState } from 'react';
import { ApiClient } from '@/app/api-client';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import TextInputGroup from '@/components/ui/text-input-group';
import DateInputGroup from '@/components/ui/date-input-group';
import DeliveryMapToSelect from '@/components/other/delivery-map-to-select';

const OrderDeliveryPage: React.FC = () => {
    const { id: tripId } = useParams<{ id: string }>();
    const router = useRouter();
    const session = useSession();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);

    // Form state
    const [slotId, setSlotId] = useState<string>('');
    const [useTripStartLocation, setUseTripStartLocation] = useState(true);
    const [useTripEndLocation, setUseTripEndLocation] = useState(true);

    const [startLocation, setStartLocation] = useState<CreateLocationDto>({
        country: '',
        state: '',
        city: '',
        address: '',
        houseNumber: '',
        date: '',
        time: '',
        dateTime: '',
        latitude: undefined,
        longitude: undefined,
    });
    const [endLocation, setEndLocation] = useState<CreateLocationDto>({
        country: '',
        state: '',
        city: '',
        address: '',
        houseNumber: '',
        date: '',
        time: '',
        dateTime: '',
        latitude: undefined,
        longitude: undefined,
    });

    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');

    const [senderName, setSenderName] = useState('');
    const [senderPhoneNumber, setSenderPhoneNumber] = useState('');
    const [senderEmail, setSenderEmail] = useState('');
    const [receiverName, setReceiverName] = useState('');
    const [receiverPhoneNumber, setReceiverPhoneNumber] = useState('');
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchTrip = async () => {
            setLoading(true);
            const res = await ApiClient.get<any>(`/trip/${tripId}`);
            setTrip(res.data);
            setLoading(false);
        };
        fetchTrip();
    }, [tripId]);

    // Set trip locations if using trip locations
    useEffect(() => {
        if (trip && useTripStartLocation) {
            setStartLocation({
                ...trip.startLocation,
            });
            setStartDate(trip.startLocation.date || '');
            setStartTime(trip.startLocation.time || '');
        }
        if (trip && useTripEndLocation) {
            setEndLocation({
                ...trip.endLocation,
            });
            setEndDate(trip.endLocation.date || '');
            setEndTime(trip.endLocation.time || '');
        }
    }, [trip, useTripStartLocation, useTripEndLocation]);

    // Reset custom location if toggling to trip location
    useEffect(() => {
        if (useTripStartLocation && trip) {
            setStartLocation({ ...trip.startLocation });
            setStartDate(trip.startLocation.date || '');
            setStartTime(trip.startLocation.time || '');
        }
        if (useTripEndLocation && trip) {
            setEndLocation({ ...trip.endLocation });
            setEndDate(trip.endLocation.date || '');
            setEndTime(trip.endLocation.time || '');
        }
    }, [useTripStartLocation, useTripEndLocation, trip]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!slotId) {
            alert('Оберіть варіант доставки');
            return;
        }
        if (!senderName || !senderPhoneNumber || !receiverName || !receiverPhoneNumber) {
            alert('Заповніть всі обов\'язкові поля');
            return;
        }

        const payload: any = {
            tripId: trip.id,
            senderId: session.data?.user?.id,
            deliverySlotId: slotId,
            senderName,
            senderPhoneNumber,
            senderEmail,
            receiverName,
            receiverPhoneNumber,
            comment,
        };

        if (useTripStartLocation) {
            payload.startLocationId = trip.startLocationId;
            payload.startLocation = undefined;
        } else {
            payload.startLocation = {
                ...startLocation,
                date: startDate,
                time: startTime,
                dateTime: startDate && startTime ? `${startDate}T${startTime}` : '',
            };
            payload.startLocationId = undefined;
        }
        if (useTripEndLocation) {
            payload.endLocationId = trip.endLocationId;
            payload.endLocation = undefined;
        } else {
            payload.endLocation = {
                ...endLocation,
                date: endDate,
                time: endTime,
                dateTime: endDate && endTime ? `${endDate}T${endTime}` : '',
            };
            payload.endLocationId = undefined;
        }

        try {
            const res = await ApiClient.post('/trip/order/create', payload);
            if (res.success) {
                router.push('/delivery/trip/list');
            } else {
                alert('Не вдалося створити замовлення');
            }
        } catch {
            alert('Сталася помилка при створенні замовлення');
        }
    };

    // Handlers for map selection
    const handleStartLocationSelect = (location: CreateLocationDto) => {
        setStartLocation(prev => ({
            ...prev,
            ...location,
        }));
    };

    const handleEndLocationSelect = (location: CreateLocationDto) => {
        setEndLocation(prev => ({
            ...prev,
            ...location,
        }));
    };

    const mapToLocationState = (loc: CreateLocationDto): LocationState => ({
        country: loc.country || '',
        state: loc.state || '',
        city: loc.city || '',
        address: loc.address || '',
        houseNumber: loc.houseNumber || '',
        date: loc.date || '',
        time: loc.time || '',
        dateTime: loc.dateTime || '',
        latitude: loc.latitude || null,
        longitude: loc.longitude || null,
    });

    return (
        <div className="flex flex-col w-full min-h-screen bg-[#1a093a] px-10 md:px-60 lg:px-120">
            <div className="text-black flex flex-col items-center rounded-lg my-10 p-10 bg-[#ffffff]">
                <h1 className="text-2xl font-bold py-3 text-[#724C9D]">Замовити доставку</h1>
                <form className="w-full max-w-lg mt-6" onSubmit={handleSubmit}>
                    {/* Delivery Slot */}
                    <div className="mb-6">
                        <label className="text-xl font-semibold text-black mb-2">Варіант доставки</label>
                        <select
                            value={slotId}
                            onChange={e => setSlotId(e.target.value)}
                            className="border rounded-lg px-4 py-5 focus:outline-none focus:ring-2 focus:ring-[#724C9D] text-black w-full"
                            required
                        >
                            <option value="">Оберіть варіант доставки</option>
                            {trip.deliverySlots.map(slot => (
                                <option key={slot.id} value={slot.id}>
                                    {slot.cargoSlotTypeName} — {slot.approximatePrice} грн
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='h-[2px] bg-lighter rounded-sm my-4'></div>
                    
                    {/* Map for custom locations */}
                    
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2 text-black">Виберіть точки на карті</h2>
                            <DeliveryMapToSelect
                                startLocation={mapToLocationState(startLocation)}
                                endLocation={mapToLocationState(endLocation)}
                                onStartLocationSelect={useTripStartLocation ? () => {} : handleStartLocationSelect}
                                onEndLocationSelect={useTripEndLocation ? () => {} : handleEndLocationSelect}
                                className="w-full h-[350px] mb-4 rounded-lg"
                            />
                            <div className="text-xs text-gray-500">
                                {(!useTripStartLocation && !useTripEndLocation) && "Вкажіть точки на карті для відправлення та отримання."}
                                {(!useTripStartLocation && useTripEndLocation) && "Вкажіть точку на карті для відправлення."}
                                {(useTripStartLocation && !useTripEndLocation) && "Вкажіть точку на карті для отримання."}
                            </div>
                        </div>
                    

                    {/* Start Location */}
                    <div className="mb-6">
                        <div className="flex items-center mb-2">
                            <h2 className="text-xl font-semibold text-black">Локація відправлення</h2>
                            <label className="ml-4 flex items-center text-sm text-black">
                                <input
                                    type="checkbox"
                                    checked={useTripStartLocation}
                                    onChange={e => setUseTripStartLocation(e.target.checked)}
                                    className="mr-2"
                                />
                                Використати локацію маршруту
                            </label>
                        </div>
                        {!useTripStartLocation && (
                            <>
                                <TextInputGroup
                                    label="Країна"
                                    value={startLocation.country}
                                    onChange={e => setStartLocation({ ...startLocation, country: e.target.value })}
                                    inputClassName="floating-input-black"
                                    labelClassName={startLocation.country ? 'filled' : ''}
                                    type="text"
                                />
                                <TextInputGroup
                                    label="Місто"
                                    value={startLocation.city}
                                    onChange={e => setStartLocation({ ...startLocation, city: e.target.value })}
                                    inputClassName="floating-input-black"
                                    labelClassName={startLocation.city ? 'filled' : ''}
                                    type="text"
                                />
                                <TextInputGroup
                                    label="Адреса"
                                    value={startLocation.address}
                                    onChange={e => setStartLocation({ ...startLocation, address: e.target.value })}
                                    inputClassName="floating-input-black"
                                    labelClassName={startLocation.address ? 'filled' : ''}
                                    type="text"
                                />
                                <label className="font-semibold text-black">Дата</label>
                                <DateInputGroup
                                    label=""
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    inputClassName="floating-input-black"
                                    labelClassName={startDate ? 'filled' : ''}
                                />
                                <label className="font-semibold text-black">Час</label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={e => setStartTime(e.target.value)}
                                    className="floating-input-black"
                                />
                            </>
                        )}
                    </div>
                    <div className='h-[2px] bg-lighter rounded-sm my-4'></div>
                    {/* End Location */}
                    <div className="mb-6">
                        <div className="flex items-center mb-2">
                            <h2 className="text-xl font-semibold text-black">Локація отримання</h2>
                            <label className="ml-4 flex items-center text-sm text-black">
                                <input
                                    type="checkbox"
                                    checked={useTripEndLocation}
                                    onChange={e => setUseTripEndLocation(e.target.checked)}
                                    className="mr-2"
                                />
                                Використати локацію маршруту
                            </label>
                        </div>
                        {!useTripEndLocation && (
                            <>
                                <TextInputGroup
                                    label="Країна"
                                    value={endLocation.country}
                                    onChange={e => setEndLocation({ ...endLocation, country: e.target.value })}
                                    inputClassName="floating-input-black"
                                    labelClassName={endLocation.country ? 'filled' : ''}
                                    type="text"
                                />
                                <TextInputGroup
                                    label="Місто"
                                    value={endLocation.city}
                                    onChange={e => setEndLocation({ ...endLocation, city: e.target.value })}
                                    inputClassName="floating-input-black"
                                    labelClassName={endLocation.city ? 'filled' : ''}
                                    type="text"
                                />
                                <TextInputGroup
                                    label="Адреса"
                                    value={endLocation.address}
                                    onChange={e => setEndLocation({ ...endLocation, address: e.target.value })}
                                    inputClassName="floating-input-black"
                                    labelClassName={endLocation.address ? 'filled' : ''}
                                    type="text"
                                />
                                <label className="font-semibold text-black">Дата</label>
                                <DateInputGroup
                                    label=""
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    inputClassName="floating-input-black"
                                    labelClassName={endDate ? 'filled' : ''}
                                />
                                <label className="font-semibold text-black">Час</label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={e => setEndTime(e.target.value)}
                                    className="floating-input-black"
                                />
                            </>
                        )}
                    </div>
                    <div className='h-[2px] bg-lighter rounded-sm my-4'></div>
                    {/* Sender/Receiver Info */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-black">Дані відправника</h2>
                        <TextInputGroup
                            label="Ім'я відправника"
                            value={senderName}
                            onChange={e => setSenderName(e.target.value)}
                            inputClassName="floating-input-black"
                            labelClassName={senderName ? 'filled' : ''}
                            type="text"
                        />
                        <TextInputGroup
                            label="Телефон відправника"
                            value={senderPhoneNumber}
                            onChange={e => setSenderPhoneNumber(e.target.value)}
                            inputClassName="floating-input-black"
                            labelClassName={senderPhoneNumber ? 'filled' : ''}
                            type="tel"
                        />
                        <TextInputGroup
                            label="Email відправника (необов'язково)"
                            value={senderEmail}
                            required={false}
                            onChange={e => setSenderEmail(e.target.value)}
                            inputClassName="floating-input-black"
                            labelClassName={senderEmail ? 'filled' : ''}
                            type="email"
                        />
                        <div className='h-[2px] bg-lighter rounded-sm my-4'></div>
                        <h2 className="text-xl font-semibold mb-4 text-black">Дані отримувача</h2>
                        <TextInputGroup
                            label="Ім'я отримувача"
                            value={receiverName}
                            onChange={e => setReceiverName(e.target.value)}
                            inputClassName="floating-input-black"
                            labelClassName={receiverName ? 'filled' : ''}
                            type="text"
                        />
                        <TextInputGroup
                            label="Телефон отримувача"
                            value={receiverPhoneNumber}
                            onChange={e => setReceiverPhoneNumber(e.target.value)}
                            inputClassName="floating-input-black"
                            labelClassName={receiverPhoneNumber ? 'filled' : ''}
                            type="tel"
                        />
                    </div>
                    <div className='h-[2px] bg-lighter rounded-sm my-4'></div>
                    {/* Comment */}
                    <div className="mb-6">
                        <TextInputGroup
                            label="Коментар (необов'язково)"
                            required={false}
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            inputClassName="floating-input-black"
                            labelClassName={comment ? 'filled' : ''}
                            type="text"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="w-full px-6 py-6 bg-[#724C9D] text-white rounded-lg hover:bg-[#5d3b80] transition-colors"
                        >
                            Замовити доставку
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderDeliveryPage;