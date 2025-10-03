'use client';

import React from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { useSession } from 'next-auth/react';
import TextInputGroup from '@/components/ui/text-input-group';
import DateInputGroup from '@/components/ui/date-input-group';
import { apiGet, apiPost } from '@/app/api-client';
import DeliveryMapToSelect from '@/components/other/delivery-map-to-select';

const SLOT_TYPES: Record<string, { MaxWeight: string; MaxVolume: string }> = {
	XS: { MaxWeight: "1kg", MaxVolume: "0.5L" },
	S: { MaxWeight: "3kg", MaxVolume: "1L" },
	M: { MaxWeight: "5kg", MaxVolume: "2L" },
	L: { MaxWeight: "7kg", MaxVolume: "2L" },
	XL: { MaxWeight: "10kg", MaxVolume: "2L" },
	XXL: { MaxWeight: "10kg+", MaxVolume: "2L+" }
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
                country: 'Україна',
                state: 'Місто Київ',
                city: 'Місто Київ',
                address: 'Вулиця Хрещатик',
                houseNumber: '1',
                date: '',
                time: '',
                dateTime: '',
                latitude: 50.450001,
                longitude: 30.523333
			},
			startTime: '',
			startDate: '',

			endLocation: {
                country: '',
                state: '',
                city: '',
                address: '',
                houseNumber: '',
                date: '',
                time: '',
                dateTime: '',
                latitude: 50.450001,
                longitude: 30.523333
			},
			endTime: '',
			endDate: '',

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

		const startDateTime = combineDateTime(this.state.startDate, this.state.startTime);
		const endDateTime = combineDateTime(this.state.endDate, this.state.endTime);

		// Validate required fields
		const requiredFields = [
			this.state.startLocation.country,
			this.state.startLocation.city,
			this.state.startLocation.address,
			this.state.startDate,
			this.state.startTime,
			this.state.endLocation.country,
			this.state.endLocation.city,
			this.state.endLocation.address,
			this.state.endDate,
			this.state.endTime,
			this.state.senderName,
			this.state.senderPhoneNumber,
			this.state.objectName,
			this.state.cargoSlotType,
			this.state.objectWeight,
			this.state.receiverName,
			this.state.receiverPhoneNumber,
		];
		if (requiredFields.some(field => !field)) {
			const t = (this.props as any).t?.addRequest;
			alert(t?.errors.requiredFields || 'Будь ласка, заповніть всі обов\'язкові поля');
			this.setState({ submitting: false });
			return;
		}

		const payload = {
			StartLocation: {
				country: this.state.startLocation.country,
				state: this.state.startLocation.state,
				city: this.state.startLocation.city,
				address: this.state.startLocation.address,
				houseNumber: this.state.startLocation.houseNumber,
				dateTime: startDateTime,
				latitude: this.state.startLocation.latitude,
				longitude: this.state.startLocation.longitude,
			},
			EndLocation: {
				country: this.state.endLocation.country,
				state: this.state.endLocation.state,
				city: this.state.endLocation.city,
				address: this.state.endLocation.address,
				houseNumber: this.state.endLocation.houseNumber,
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
			const response = await apiPost('/request', payload, {}, this.props.session.data?.user?.accessToken);
			if (response.success) {
				window.location.href = '/delivery/request/list';
			} else {
				const t = (this.props as any).t?.addRequest;
				alert(t?.errors.createFailed || 'Не вдалося створити запит');
			}
		} catch (error) {
			const t = (this.props as any).t?.addRequest;
			alert(t?.errors.createError || 'Сталася помилка при створенні запиту');
		}
		this.setState({ submitting: false });
	};

    handleStartLocationSelect = (location: LocationState) => {
        this.setState(prev => ({
            ...prev,
            startLocation: {
                ...prev.startLocation,
                ...location,
            }
        }));

        console.log(location);
    };

    handleEndLocationSelect = (location: LocationState) => {
        this.setState(prev => ({
            ...prev,
            endLocation: {
                ...prev.endLocation,
                ...location,
            }
        }));
        console.log(location);
    };

	render() {
		const t = (this.props as any).t?.addRequest;
		return (
			<div className="flex flex-col w-full justify-center items-center min-h-screen bg-[#1a093a] px-10 md:px-60 lg:px-80">
				<div className='text-black flex flex-col items-center rounded-lg my-10 p-10 bg-[#ffffff]  max-w-[540px]'>
					<h1 className='text-2xl font-bold py-3 text-[#724C9D]'>
						{t?.title || 'Створити запит на доставку'}
					</h1>
					<form className="w-full max-w-lg mt-6" onSubmit={this.handleSubmit}>
						{/* Map Selection */}
                        <div className="mb-8">
							<h2 className="text-xl font-semibold mb-4 text-black">{t?.map.title || 'Виберіть точки на карті'}</h2>
                            <DeliveryMapToSelect
                                startLocation={this.state.startLocation}
                                endLocation={this.state.endLocation}
                                onStartLocationSelect={this.handleStartLocationSelect}
                                onEndLocationSelect={this.handleEndLocationSelect}
                                className="w-full h-[350px] mb-4"
                            />
							<div className="text-sm text-gray-500">{t?.map.hint || 'Натисніть "Вказати початок" або "Вказати кінець", потім виберіть точку на карті.'}</div>
                        </div>
						{/* Start Location */}
						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-4 text-black">{t?.pickup.sectionTitle || 'Дата і час отримання'}</h2>
							<div className='h-[2px] bg-lighter rounded-sm my-4 mb-6'></div>
							<label className="font-semibold text-black">{t?.pickup.dateLabel || 'Дата'}</label>
							<DateInputGroup label="" value={this.state.startDate} onChange={e => this.setState({ startDate: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.startDate ? 'filled' : ''} />
							<label className="font-semibold text-black">{t?.pickup.timeLabel || 'Час'}</label>
							<input type="time" value={this.state.startTime} onChange={e => this.setState({ startTime: e.target.value })} className="floating-input-black" />
						</div>
						<div className='h-[2px] bg-lighter rounded-sm my-4'></div>
						{/* End Location */}
						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-4 text-black">{t?.delivery.sectionTitle || 'Дата і час доставки'}</h2>
							
							<label className="font-semibold text-black">{t?.delivery.dateLabel || 'Дата'}</label>
							<DateInputGroup label="" value={this.state.endDate} onChange={e => this.setState({ endDate: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.endDate ? 'filled' : ''} />
							<label className="font-semibold text-black">{t?.delivery.timeLabel || 'Час'}</label>
							<input type="time" value={this.state.endTime} onChange={e => this.setState({ endTime: e.target.value })} className="floating-input-black" />
						</div>
						<div className='h-[2px] bg-lighter rounded-sm my-4'></div>
						{/* Sender Info */}
						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-4 text-black">{t?.sender.sectionTitle || 'Відправник'}</h2>
							<TextInputGroup label={t?.sender.name || "Ім'я відправника"} value={this.state.senderName} onChange={e => this.setState({ senderName: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.senderName ? 'filled' : ''} type="text" />
							<TextInputGroup label={t?.sender.phone || 'Телефон відправника'} value={this.state.senderPhoneNumber} onChange={e => this.setState({ senderPhoneNumber: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.senderPhoneNumber ? 'filled' : ''} type="tel" />
							<TextInputGroup label={t?.sender.email || 'Email відправника'} value={this.state.senderEmail} required={false} onChange={e => this.setState({ senderEmail: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.senderEmail ? 'filled' : ''} type="email" />
						</div>
						<div className='h-[2px] bg-lighter rounded-sm my-4'></div>
						{/* Cargo Info */}
						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-4 text-black">{t?.cargo.sectionTitle || 'Вантаж'}</h2>
							<TextInputGroup label={t?.cargo.objectName || "Назва об'єкта"} value={this.state.objectName} onChange={e => this.setState({ objectName: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.objectName ? 'filled' : ''} type="text" />
							<div className="flex flex-col mb-2">
								<label className="mb-2 font-semibold text-black">{t?.cargo.slotType || 'Тип слота'}</label>
								<select value={this.state.cargoSlotType} onChange={e => this.setState({ cargoSlotType: e.target.value })} className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#724C9D] text-black" required>
									<option value="">{t?.cargo.chooseSlotPlaceholder || 'Оберіть тип слота'}</option>
									{Object.entries(SLOT_TYPES).map(([key, val]) => (
										<option key={key} value={key}>{key} ({val.MaxWeight}, {val.MaxVolume})</option>
									))}
								</select>
							</div>
							<TextInputGroup label={t?.cargo.weightWithUnit || 'Вага, кг'} value={this.state.objectWeight} onChange={e => this.setState({ objectWeight: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.objectWeight ? 'filled' : ''} type="number" />
							<TextInputGroup label={t?.cargo.description || 'Опис вантажу'} value={this.state.objectDescription} required={false} onChange={e => this.setState({ objectDescription: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.objectDescription ? 'filled' : ''} type="text" />
							<TextInputGroup label={`${t?.cargo.estimatedPrice || 'Пропонована ціна доставки'}, ${t?.currency || 'грн'}`} value={this.state.estimatedPrice} required={false} onChange={e => this.setState({ estimatedPrice: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.estimatedPrice ? 'filled' : ''} type="number" />
						</div>
						<div className='h-[2px] bg-lighter rounded-sm my-4'></div>
						{/* Receiver Info */}
						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-4 text-black">{t?.receiver.sectionTitle || 'Одержувач'}</h2>
							<TextInputGroup label={t?.receiver.name || "Ім'я одержувача"} value={this.state.receiverName} onChange={e => this.setState({ receiverName: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.receiverName ? 'filled' : ''} type="text" />
							<TextInputGroup label={t?.receiver.phone || 'Телефон одержувача'} value={this.state.receiverPhoneNumber} onChange={e => this.setState({ receiverPhoneNumber: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.receiverPhoneNumber ? 'filled' : ''} type="tel" />
						</div>
						<div className='h-[2px] bg-lighter rounded-sm my-4'></div>
						{/* Comment */}
						<div className="mb-6">
							<TextInputGroup label={t?.comment || 'Коментар'} value={this.state.comment ?? ""} required={false} onChange={e => this.setState({ comment: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.comment ? 'filled' : ''} type="text" />
						</div>
						<div className="flex justify-end">
							<button type="submit" className="w-full px-6 py-6 bg-[#724C9D] text-white rounded-lg hover:bg-[#5d3b80] transition-colors" disabled={this.state.submitting}>
								{t?.buttons.create || 'Створити запит'}
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
}
const AddRequestWithSession = withSession(AddRequestPage);
const AddRequestWrapper = (props: any) => {
	const { messages } = useI18n();
	return <AddRequestWithSession {...props} t={messages} />;
};

export default AddRequestWrapper;
