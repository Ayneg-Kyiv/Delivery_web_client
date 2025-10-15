// ...existing code...
'use client';

import React, { useEffect, useState } from 'react';
import { apiGet, apiPost } from '@/app/api-client';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import TextInputGroup from '@/components/ui/text-input-group';
import DateInputGroup from '@/components/ui/date-input-group';
import { useI18n } from '@/i18n/I18nProvider';

const OfferDeliveryPage: React.FC = () => {
	const { id: deliveryRequestId } = useParams<{ id: string }>();
	const router = useRouter();
	const session = useSession();
	const [request, setRequest] = useState<DeliveryRequest | null>(null);
	const [loading, setLoading] = useState(true);
	const { messages } = useI18n();
	const t = messages.requestOffer;

	// Form state
	const [price, setPrice] = useState<string>('');
	const [useSuggestedPrice, setUseSuggestedPrice] = useState(true);
	const [useRequestCollection, setUseRequestCollection] = useState(true);
	const [useRequestDelivery, setUseRequestDelivery] = useState(true);
	const [estimatedCollectionDate, setEstimatedCollectionDate] = useState('');
	const [estimatedCollectionTime, setEstimatedCollectionTime] = useState('');
	const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('');
	const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState('');

	useEffect(() => {
		const fetchRequest = async () => {
			setLoading(true);
			const res = await apiGet<any>(`/request/${deliveryRequestId}`, {}, session?.data?.accessToken);

            // console.log(res.data);

			setRequest(res.data);
			if (res.data?.estimatedPrice) {
				setPrice(res.data.estimatedPrice.toString());
			}
			setLoading(false);
		};
		fetchRequest();
	}, [deliveryRequestId]);

	useEffect(() => {
		if (useSuggestedPrice && request?.estimatedPrice) {
			setPrice(request.estimatedPrice.toString());
		}
	}, [useSuggestedPrice, request]);
	
    useEffect(() => {
        if (request && useRequestCollection) {
            const collectionDateTime = request.startLocation.dateTime || '';
            if (collectionDateTime) {
                const [date, time] = collectionDateTime.split('T');
                setEstimatedCollectionDate(date || '');
                setEstimatedCollectionTime(time ? time.slice(0, 5) : '');
            } else {
                setEstimatedCollectionDate('');
                setEstimatedCollectionTime('');
            }
        }
    }, [useRequestCollection, request]);

    useEffect(() => {
        if (request && useRequestDelivery) {
            const deliveryDateTime = request.endLocation.dateTime || '';
            if (deliveryDateTime) {
                const [date, time] = deliveryDateTime.split('T');
                setEstimatedDeliveryDate(date || '');
                setEstimatedDeliveryTime(time ? time.slice(0, 5) : '');
            } else {
                setEstimatedDeliveryDate('');
                setEstimatedDeliveryTime('');
            }
        }
    }, [useRequestDelivery, request]);

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!price) {
			alert(t.errors.enterPrice);
			return;
		}

		if (!estimatedCollectionDate || !estimatedCollectionTime || !estimatedDeliveryDate || !estimatedDeliveryTime) {
			alert(t.errors.enterTimes);
            return;
        }

		const estimatedCollection = `${estimatedCollectionDate}T${estimatedCollectionTime}`;
		const estimatedDelivery = `${estimatedDeliveryDate}T${estimatedDeliveryTime}`;
		const payload = {
			deliveryRequestId: request.id,
			price: parseFloat(price),
			driverId: session.data?.user?.id,
			estimatedCollectionTime: estimatedCollection,
			estimatedDeliveryTime: estimatedDelivery,
		};
		try {
			const res = await apiPost('/request/offer', payload, {}, session?.data?.accessToken);
            
            console.log(res);

			if (res.success) {
				router.push(`/delivery/request/list`);
			} else {
				alert(t.errors.createFailed);
			}
		} catch {
			alert(t.errors.createError);
		}
	};

	return (
		<div className="flex flex-col w-full min-h-screen bg-[#1a093a] px-10 md:px-60 lg:px-120">
			<div className="text-black flex flex-col items-center rounded-lg my-10 p-10 bg-[#ffffff]">
				<h1 className="text-2xl font-bold py-3 text-[#724C9D]">{t.title}</h1>
				<form className="w-full max-w-lg mt-6" onSubmit={handleSubmit}>
					{/* Price */}
					<div className="mb-6">
						<label className="text-xl font-semibold text-black mb-2">{t.price.section}</label>
						<div className="flex items-center gap-4">
							<input
								type="checkbox"
								checked={useSuggestedPrice}
								onChange={e => setUseSuggestedPrice(e.target.checked)}
								className="mr-2"
								id="useSuggestedPrice"
							/>
							<label htmlFor="useSuggestedPrice" className="text-black text-sm">{t.price.useSuggested} ({request.estimatedPrice ? `${request.estimatedPrice} ${t.currency}` : '—'})</label>
						</div>
						<TextInputGroup
							label={`${t.price.yourPrice} (${t.currency})`}
							value={price}
							onChange={e => setPrice(e.target.value)}
							inputClassName="floating-input-black"
							labelClassName={price ? 'filled' : ''}
							type="number"
							required
						/>
					</div>
					<div className='h-[2px] bg-lighter rounded-sm my-4'></div>
					{/* Estimated Collection Time */}
					<div className="mb-6">
						<div className="flex items-center mb-2">
							<label className="text-xl text-black">{t.collection.section}</label>
							<label className="ml-4 flex items-center text-sm text-black">
								<input
									type="checkbox"
									checked={useRequestCollection}
									onChange={e => setUseRequestCollection(e.target.checked)}
									className="mr-2"
								/>
								{t.collection.useFromRequest}
							</label>
						</div>
						{ !useRequestCollection && (
							<>
								<DateInputGroup
									label=""
									value={estimatedCollectionDate}
									onChange={e => setEstimatedCollectionDate(e.target.value)}
									inputClassName="floating-input-black"
									labelClassName={estimatedCollectionDate ? 'filled' : ''}
								/>
								<label className="font-semibold text-black">{t.collection.time}</label>
								<input
									type="time"
									value={estimatedCollectionTime}
									onChange={e => setEstimatedCollectionTime(e.target.value)}
									className="floating-input-black"
								/>
							</>
						)}
					</div>
					<div className='h-[2px] bg-lighter rounded-sm my-4'></div>
					{/* Estimated Delivery Time */}
					<div className="mb-6">
						<div className="flex items-center mb-2">
							<label className="text-xl text-black">{t.delivery.section}</label>
							<label className="ml-4 flex items-center text-sm text-black">
								<input
									type="checkbox"
									checked={useRequestDelivery}
									onChange={e => setUseRequestDelivery(e.target.checked)}
									className="mr-2"
								/>
								{t.delivery.useFromRequest}
							</label>
						</div>
						{!useRequestDelivery && (
							<>
								<DateInputGroup
									label=""
									value={estimatedDeliveryDate}
									onChange={e => setEstimatedDeliveryDate(e.target.value)}
									inputClassName="floating-input-black"
									labelClassName={estimatedDeliveryDate ? 'filled' : ''}
								/>
								<label className="font-semibold text-black">{t.delivery.time}</label>
								<input
									type="time"
									value={estimatedDeliveryTime}
									onChange={e => setEstimatedDeliveryTime(e.target.value)}
									className="floating-input-black"
								/>
							</>
						)}
					</div>
					<div className="flex justify-end">
						<button
							type="submit"
							className="w-full px-6 py-6 bg-[#724C9D] text-white rounded-lg hover:bg-[#5d3b80] transition-colors"
						>
							{t.buttons.submit}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default OfferDeliveryPage;
