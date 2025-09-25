'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import TextInputGroup from '@/components/ui/text-input-group';
import DateInputGroup from '@/components/ui/date-input-group';
import { ApiClient } from '@/app/api-client';

const SLOT_TYPES: Record<string, { MaxWeight: string; MaxVolume: string }> = {
	XS: { MaxWeight: "1kg", MaxVolume: "0.5L" },
	S: { MaxWeight: "3kg", MaxVolume: "1L" },
	M: { MaxWeight: "5kg", MaxVolume: "2L" },
	L: { MaxWeight: "7kg", MaxVolume: "2L" },
	XL: { MaxWeight: "10kg", MaxVolume: "2L" },
	XXL: { MaxWeight: "10kg+", MaxVolume: "2L+" }
};

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

type AddRequestState = {
	startLocation: LocationState;
	endLocation: LocationState;
	senderName: string;
	senderPhoneNumber: string;
	senderEmail: string;
	objectName: string;
	cargoSlotType: string;
	objectWeight: string;
	objectDescription: string;
	estimatedPrice: string;
	receiverName: string;
	receiverPhoneNumber: string;
	comment: string;
	submitting: boolean;
};

const withSession = (Component: React.ComponentType<any>) => {
	const WrappedComponent = (props: any) => {
		const session = useSession();
		if (session.status === 'loading') {
			return <div>Loading...</div>;
		}
		if (session.status === 'unauthenticated') {
			location.href = '/signin';
		}
		if (Component.prototype && Component.prototype.render) {
			return <Component session={session} {...props} />;
		}
		throw new Error("You passed a function component, `withSession` is not needed.");
	};
	WrappedComponent.displayName = `withSession(${Component.displayName || Component.name || 'Component'})`;
	return WrappedComponent;
};

class AddRequestPage extends React.Component<any, AddRequestState> {
	constructor(props: any) {
		super(props);
		this.state = {
			startLocation: {
				country: '',
				city: '',
				address: '',
				date: '',
				time: '',
				dateTime: '',
				latitude: null,
				longitude: null
			},
			endLocation: {
				country: '',
				city: '',
				address: '',
				date: '',
				time: '',
				dateTime: '',
				latitude: null,
				longitude: null
			},
			senderName: '',
			senderPhoneNumber: '',
			senderEmail: '',
			objectName: '',
			cargoSlotType: '',
			objectWeight: '',
			objectDescription: '',
			estimatedPrice: '',
			receiverName: '',
			receiverPhoneNumber: '',
			comment: '',
			submitting: false,
		};
	}

	handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		this.setState({ submitting: true });

		// Combine date and time for start and end locations
		const combineDateTime = (date: string, time: string) => {
			if (!date || !time) return '';
			return `${date}T${time}`;
		};

		const startDateTime = combineDateTime(this.state.startLocation.date, this.state.startLocation.time);
		const endDateTime = combineDateTime(this.state.endLocation.date, this.state.endLocation.time);

		// Validate required fields
		const requiredFields = [
			this.state.startLocation.country,
			this.state.startLocation.city,
			this.state.startLocation.address,
			this.state.startLocation.date,
			this.state.startLocation.time,
			this.state.endLocation.country,
			this.state.endLocation.city,
			this.state.endLocation.address,
			this.state.endLocation.date,
			this.state.endLocation.time,
			this.state.senderName,
			this.state.senderPhoneNumber,
			this.state.objectName,
			this.state.cargoSlotType,
			this.state.objectWeight,
			this.state.receiverName,
			this.state.receiverPhoneNumber,
		];
		if (requiredFields.some(field => !field)) {
			alert('Будь ласка, заповніть всі обов\'язкові поля');
			this.setState({ submitting: false });
			return;
		}

		const payload = {
			StartLocation: {
				country: this.state.startLocation.country,
				city: this.state.startLocation.city,
				address: this.state.startLocation.address,
				dateTime: startDateTime,
				latitude: this.state.startLocation.latitude,
				longitude: this.state.startLocation.longitude,
			},
			EndLocation: {
				country: this.state.endLocation.country,
				city: this.state.endLocation.city,
				address: this.state.endLocation.address,
				dateTime: endDateTime,
				latitude: this.state.endLocation.latitude,
				longitude: this.state.endLocation.longitude,
			},
			SenderName: this.state.senderName,
			SenderPhoneNumber: this.state.senderPhoneNumber,
			SenderEmail: this.state.senderEmail,
			ObjectName: this.state.objectName,
			CargoSlotType: this.state.cargoSlotType,
			ObjectWeight: Number(this.state.objectWeight),
			ObjectDescription: this.state.objectDescription,
			EstimatedPrice: this.state.estimatedPrice ? Number(this.state.estimatedPrice) : undefined,
			ReceiverName: this.state.receiverName,
			ReceiverPhoneNumber: this.state.receiverPhoneNumber,
			Comment: this.state.comment,
		};

		try {
			const response = await ApiClient.post('/request', payload);
			if (response.success) {
				window.location.href = '/delivery/request/list';
			} else {
				alert('Не вдалося створити запит');
			}
		} catch (error) {
			alert('Сталася помилка при створенні запиту');
		}
		this.setState({ submitting: false });
	};

	render() {
		return (
			<div className="flex flex-col w-full min-h-screen bg-[#1a093a] px-10 md:px-60 lg:px-120">
				<div className='text-black flex flex-col items-center rounded-lg my-10 p-10 bg-[#ffffff]'>
					<h1 className='text-2xl font-bold py-3 text-[#724C9D]'>Створити запит на доставку</h1>
					<form className="w-full max-w-lg mt-6" onSubmit={this.handleSubmit}>
						{/* Start Location */}
						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-4 text-black">Початкова локація</h2>
							<div className='h-[2px] bg-lighter rounded-sm my-4 mb-6'></div>
							<TextInputGroup label="Країна" value={this.state.startLocation.country} onChange={e => this.setState({ startLocation: { ...this.state.startLocation, country: e.target.value } })} inputClassName="floating-input-black" labelClassName={this.state.startLocation.country ? 'filled' : ''} type="text" />
							<TextInputGroup label="Місто" value={this.state.startLocation.city} onChange={e => this.setState({ startLocation: { ...this.state.startLocation, city: e.target.value } })} inputClassName="floating-input-black" labelClassName={this.state.startLocation.city ? 'filled' : ''} type="text" />
							<TextInputGroup label="Адреса" value={this.state.startLocation.address} onChange={e => this.setState({ startLocation: { ...this.state.startLocation, address: e.target.value } })} inputClassName="floating-input-black" labelClassName={this.state.startLocation.address ? 'filled' : ''} type="text" />
							<label className="font-semibold text-black">Дата</label>
							<DateInputGroup label="" value={this.state.startLocation.date} onChange={e => this.setState({ startLocation: { ...this.state.startLocation, date: e.target.value } })} inputClassName="floating-input-black" labelClassName={this.state.startLocation.date ? 'filled' : ''} />
							<label className="font-semibold text-black">Час</label>
							<input type="time" value={this.state.startLocation.time} onChange={e => this.setState({ startLocation: { ...this.state.startLocation, time: e.target.value } })} className="floating-input-black" />
						</div>
						<div className='h-[2px] bg-lighter rounded-sm my-4'></div>
						{/* End Location */}
						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-4 text-black">Кінцева локація</h2>
							<TextInputGroup label="Країна" value={this.state.endLocation.country} onChange={e => this.setState({ endLocation: { ...this.state.endLocation, country: e.target.value } })} inputClassName="floating-input-black" labelClassName={this.state.endLocation.country ? 'filled' : ''} type="text" />
							<TextInputGroup label="Місто" value={this.state.endLocation.city} onChange={e => this.setState({ endLocation: { ...this.state.endLocation, city: e.target.value } })} inputClassName="floating-input-black" labelClassName={this.state.endLocation.city ? 'filled' : ''} type="text" />
							<TextInputGroup label="Адреса" value={this.state.endLocation.address} onChange={e => this.setState({ endLocation: { ...this.state.endLocation, address: e.target.value } })} inputClassName="floating-input-black" labelClassName={this.state.endLocation.address ? 'filled' : ''} type="text" />
							<label className="font-semibold text-black">Дата</label>
							<DateInputGroup label="" value={this.state.endLocation.date} onChange={e => this.setState({ endLocation: { ...this.state.endLocation, date: e.target.value } })} inputClassName="floating-input-black" labelClassName={this.state.endLocation.date ? 'filled' : ''} />
							<label className="font-semibold text-black">Час</label>
							<input type="time" value={this.state.endLocation.time} onChange={e => this.setState({ endLocation: { ...this.state.endLocation, time: e.target.value } })} className="floating-input-black" />
						</div>
						<div className='h-[2px] bg-lighter rounded-sm my-4'></div>
						{/* Sender Info */}
						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-4 text-black">Відправник</h2>
							<TextInputGroup label="Ім'я відправника" value={this.state.senderName} onChange={e => this.setState({ senderName: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.senderName ? 'filled' : ''} type="text" />
							<TextInputGroup label="Телефон відправника" value={this.state.senderPhoneNumber} onChange={e => this.setState({ senderPhoneNumber: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.senderPhoneNumber ? 'filled' : ''} type="tel" />
							<TextInputGroup label="Email відправника" value={this.state.senderEmail} required={false} onChange={e => this.setState({ senderEmail: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.senderEmail ? 'filled' : ''} type="email" />
						</div>
						<div className='h-[2px] bg-lighter rounded-sm my-4'></div>
						{/* Cargo Info */}
						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-4 text-black">Вантаж</h2>
							<TextInputGroup label="Назва об'єкта" value={this.state.objectName} onChange={e => this.setState({ objectName: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.objectName ? 'filled' : ''} type="text" />
							<div className="flex flex-col mb-2">
								<label className="mb-2 font-semibold text-black">Тип слота</label>
								<select value={this.state.cargoSlotType} onChange={e => this.setState({ cargoSlotType: e.target.value })} className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#724C9D] text-black" required>
									<option value="">Оберіть тип слота</option>
									{Object.entries(SLOT_TYPES).map(([key, val]) => (
										<option key={key} value={key}>{key} ({val.MaxWeight}, {val.MaxVolume})</option>
									))}
								</select>
							</div>
							<TextInputGroup label="Вага, кг" value={this.state.objectWeight} onChange={e => this.setState({ objectWeight: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.objectWeight ? 'filled' : ''} type="number" />
							<TextInputGroup label="Опис вантажу" value={this.state.objectDescription} required={false} onChange={e => this.setState({ objectDescription: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.objectDescription ? 'filled' : ''} type="text" />
							<TextInputGroup label="Пропонована ціна доставки, грн" value={this.state.estimatedPrice} required={false} onChange={e => this.setState({ estimatedPrice: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.estimatedPrice ? 'filled' : ''} type="number" />
						</div>
						<div className='h-[2px] bg-lighter rounded-sm my-4'></div>
						{/* Receiver Info */}
						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-4 text-black">Одержувач</h2>
							<TextInputGroup label="Ім'я одержувача" value={this.state.receiverName} onChange={e => this.setState({ receiverName: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.receiverName ? 'filled' : ''} type="text" />
							<TextInputGroup label="Телефон одержувача" value={this.state.receiverPhoneNumber} onChange={e => this.setState({ receiverPhoneNumber: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.receiverPhoneNumber ? 'filled' : ''} type="tel" />
						</div>
						<div className='h-[2px] bg-lighter rounded-sm my-4'></div>
						{/* Comment */}
						<div className="mb-6">
							<TextInputGroup label="Коментар" value={this.state.comment} required={false} onChange={e => this.setState({ comment: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.comment ? 'filled' : ''} type="text" />
						</div>
						<div className="flex justify-end">
							<button type="submit" className="w-full px-6 py-6 bg-[#724C9D] text-white rounded-lg hover:bg-[#5d3b80] transition-colors" disabled={this.state.submitting}>
								Створити запит
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default withSession(AddRequestPage);
