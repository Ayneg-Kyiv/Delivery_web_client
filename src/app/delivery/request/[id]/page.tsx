'use client';

import React, { useEffect, useState } from 'react';
import { apiGet, apiPost } from '@/app/api-client';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import TravelPathMap from '@/components/other/travel-path-map';
import { useI18n } from '@/i18n/I18nProvider';

type Sender = {
	id: string;
	name: string;
	email?: string;
	phoneNumber?: string;
	imagePath?: string;
	reviews?: ReviewDto[];
};

const DeliveryRequestDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [request, setRequest] = useState<DeliveryRequest | null>(null);
	const [loading, setLoading] = useState(true);
	const session = useSession();
    const { messages } = useI18n();
    const t = messages.requestDetail;

	useEffect(() => {
		const fetchRequest = async () => {
			setLoading(true);
			const res = await apiGet<any>(`/request/${id}`, {}, session?.data?.accessToken);
			setRequest(res.data);
			setLoading(false);
		};
		fetchRequest();
	}, [id]);

	if (session.status === 'loading' || loading) {
		return (
			<div className="flex flex-col w-full min-h-screen bg-[#1a093a] justify-center items-center">
				<div className="text-white text-center py-20">{t.loading}</div>
			</div>
		);
	}

	if (!request) {
		return (
			<div className="flex flex-col w-full min-h-screen bg-[#1a093a] justify-center items-center">
				<div className="text-white text-center py-20">{t.notFound}</div>
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
				<div className="absolute inset-0 bg-[#1a093a]/60 flex flex-col justify-center items-center px-4">
					<h1 className="text-2xl md:text-4xl font-bold mb-4 text-white">
						{t.heroTitle}
					</h1>
					<div className="flex gap-4 text-white text-xl font-bold">
						<span>{request.startLocation.city}</span>
						<span>-</span>
						<span>{request.endLocation.city}</span>
					</div>
					<div className='flex flex-col md:flex-row gap-4 justify-center items-center mt-4 text-lg font-medium'>
						<div className="mt-2 text-white">
							{t.labels.departureShort}: {request.startLocation.dateTime} 
						</div>
						<div className='hidden md:block'>
							|
						</div>
						<div className="mt-2 text-white">
							{t.labels.deliveryShort}: {request.endLocation.dateTime}
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col md:flex-row gap-8 px-4 md:px-10 lg:px-20 py-10 w-full">
				
				{/* Sender Info */}
				<div className="flex flex-col p-6 rounded-lg w-full md:w-1/3 bg-[#ffffff] items-center">
					<Image
						src={request.sender.imagePath ? (process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + request.sender.imagePath : '/dummy.png'}
						alt={request.senderEmail || 'Sender'}
						width={100}
						height={100}
						className="rounded-full object-cover mb-4"
					/>
					<div className="text-black text-xl font-bold">{request.senderName}</div>
					<div className="text-black">{request.sender.email}</div>
					<div className="text-black mt-2">{t.labels.phone}: {request.senderPhoneNumber}</div>

					<div className="w-full mt-6">
						<div className="text-lg font-bold mb-2 text-black">{t.labels.senderReviews}</div>
						{request.sender.reviews && request.sender.reviews.filter(review => review.rating > 0).length === 0 ? (
							<div className="text-gray-500">{t.labels.noReviews}</div>
						) : (
							<div className="flex flex-col gap-4 w-full">
								{request.sender.reviews && request.sender.reviews.filter(review => review.rating > 0).map(review => (
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

				{/* Request Details */}
				<div className="flex-1 flex flex-col gap-6">
                    <div className='w-full flex justify-stretch gap-6 flex-col md:flex-row bg-[#2d1857]'>
						<div className="bg-[#2d1857] rounded-xl p-6 shadow-lg text-white">
							<div className="text-lg font-bold mb-2">{t.labels.route}</div>
							<div className="mb-2">
								<span className="font-bold">{t.labels.from}:</span> {request.startLocation.address} {request.startLocation.houseNumber}, {request.startLocation.state}, {request.startLocation.city}
							</div>
							<div className="mb-2">
								<span className="font-bold">{t.labels.to}:</span> {request.endLocation.address} {request.endLocation.houseNumber}, {request.endLocation.state}, {request.endLocation.city}
							</div>
							<div className="mb-2">
								<span className="font-bold">{t.labels.departureDate}:</span> {request.startLocation.dateTime}
							</div>
							<div className="mb-2">
								<span className="font-bold">{t.labels.deliveryDate}:</span> {request.endLocation.dateTime}
							</div>
							<div className="mb-2">
								<span className="font-bold">{t.labels.comment}:</span> {request.comment || '—'}
							</div>
						</div>
						
						<TravelPathMap 
                            start={{ 
                                latitude: request.startLocation.latitude ?? 0, 
                                longitude: request.startLocation.longitude ?? 0 
                            }} 
                            end={{ 
                                latitude: request.endLocation.latitude ?? 0, 
                                longitude: request.endLocation.longitude ?? 0 
                            }} 
                            className="w-full md:w-2/3 p-8 rounded-xl shadow-lg"
                        />

					</div>
					<div className="bg-[#2d1857] rounded-xl p-6 shadow-lg text-white">
						<div className="text-lg font-bold mb-2">{t.labels.deliveryStatus}: {request.isAccepted ? t.labels.statusAccepted : t.labels.statusSearching}</div>
						<div className="flex gap-4 items-center">
                            {/* cost */}
								<div>{t.labels.estimatedCost}: {request.estimatedPrice ? `${request.estimatedPrice} ${t.labels.currency}` : '—'}</div>
						</div>
					</div>
					<div className="flex justify-end">
                        {
                            session.data?.user?.roles.includes('Driver') 
                            && !request.isAccepted && !request.isPickedUp && !request.isDelivered 
                            && request.senderId !== session.data?.user?.id
                            && (
                                <Link href={`/delivery/request/${request.id}/offer`} className='w-full md:w-auto'>
                                    <button className="w-full bg-[#7c3aed] text-white px-8 py-3 rounded-lg font-bold text-lg">
										{t.actions.sendOffer}
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

export default DeliveryRequestDetailPage;
