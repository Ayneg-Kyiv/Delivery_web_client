'use client';

import React from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { useSession } from 'next-auth/react';
import TextInputGroup from '@/components/ui/text-input-group';
import DateInputGroup from '@/components/ui/date-input-group';
import { apiGet, apiPost } from '@/app/api-client';
import DeliveryMapToSelect from '@/components/other/delivery-map-to-select';
import AddressAutocompleteInput from '@/components/ui/AddressAutocompleteInput';

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
		
		const { messages } = useI18n();
		if (session.status === 'loading') {
			return <div>Loading...</div>;
		}
		if (session.status === 'unauthenticated') {
			location.href = '/signin';
		}
		if (Component.prototype && Component.prototype.render) {
			return <Component session={session} messages={messages} {...props} />;
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
				fullAddress: '',
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
				fullAddress: '',
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
			showManualAddress: false,
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
			console.log('accessToken', this.props.session?.data?.accessToken);
			const response = await apiPost('/request', payload, {}, this.props.session?.data?.accessToken);
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

    };

    handleEndLocationSelect = (location: LocationState) => {
        this.setState(prev => ({
            ...prev,
            endLocation: {
                ...prev.endLocation,
                ...location,
            }
        }));
    };

	render() {
		const t = (this.props as any).t?.addRequest;

		return (
			<div className="flex flex-col w-full items-center min-h-screen min-w-[300px] md:min-w-[540px] bg-[#1a093a] px-8 md:px-60 lg:px-80">
				<div className='text-black w-full flex flex-col items-center rounded-lg my-10 p-10 bg-[#ffffff] max-w-[540px]'>
					<h1 className='text-2xl font-bold py-3 text-[#724C9D]'>{t?.title}</h1>

					<form className="w-full max-w-lg mt-6" onSubmit={this.handleSubmit}>
					
							{/* Map / Manual Selection */}
							<div className="mb-8">
								<h2 className="text-xl font-semibold mb-4 text-black flex items-center justify-between">
									<span>{t?.map.title}</span>
									<button type="button" onClick={() => this.setState({ showManualAddress: !this.state.showManualAddress })} className="text-sm text-[#724C9D] underline hover:opacity-80">
										{this.state.showManualAddress ? t?.addressManual?.toggleOff : t?.addressManual?.toggleOn}
									</button>
								</h2>
								{this.state.showManualAddress ? (
									<div className="space-y-6">
										{/* Start Address Manual */}
										<div>
											<h3 className="font-semibold mb-2 text-black">{t?.addressManual?.startTitle}</h3>

                                            <div className='pb-8'>
                                                <AddressAutocompleteInput
                                                    value={this.state.startLocation.fullAddress}
                                                    onChange={(fullAddress, locationObj) => {
                                                        this.setState(prev => ({
                                                        ...prev,
                                                        startLocation: {
                                                            ...prev.startLocation,
                                                            fullAddress,
                                                            ...locationObj,
                                                        }
                                                        }));
                                                    }}
                                                    placeholder={t?.addressManual?.startTitle || 'Address'}
                                                    className="floating-input-black"
                                                />
                                            </div>

											<TextInputGroup label={t?.addressManual?.country || ''} value={this.state.startLocation.country} onChange={e => this.setState({ startLocation: { ...this.state.startLocation, country: e.target.value } })} inputClassName="floating-input-black" labelClassName={this.state.startLocation.country ? 'filled' : ''} />
											<TextInputGroup label={t?.addressManual?.state || ''} value={this.state.startLocation.state} onChange={e => this.setState({ startLocation: { ...this.state.startLocation, state: e.target.value } })} inputClassName="floating-input-black" labelClassName={this.state.startLocation.state ? 'filled' : ''} />
											<TextInputGroup label={t?.addressManual?.city || ''} value={this.state.startLocation.city} onChange={e => this.setState({ startLocation: { ...this.state.startLocation, city: e.target.value } })} inputClassName="floating-input-black" labelClassName={this.state.startLocation.city ? 'filled' : ''} />
											<TextInputGroup label={t?.addressManual?.address || ''} value={this.state.startLocation.address} onChange={e => this.setState({ startLocation: { ...this.state.startLocation, address: e.target.value } })} inputClassName="floating-input-black" labelClassName={this.state.startLocation.address ? 'filled' : ''} />
											<TextInputGroup label={t?.addressManual?.houseNumber || ''} value={this.state.startLocation.houseNumber} onChange={e => this.setState({ startLocation: { ...this.state.startLocation, houseNumber: e.target.value } })} inputClassName="floating-input-black" labelClassName={this.state.startLocation.houseNumber ? 'filled' : ''} />
										</div>
										{/* End Address Manual */}
										<div>
											<h3 className="font-semibold mb-2 text-black">{t?.addressManual?.endTitle}</h3>
											
                                            <div className='pb-8'>
                                                <AddressAutocompleteInput
                                                    value={this.state.endLocation.fullAddress }
                                                    onChange={(fullAddress, locationObj) => {
                                                        this.setState(prev => ({
                                                            ...prev,
                                                            endLocation: {
                                                                ...prev.endLocation,
                                                            fullAddress,
                                                            ...locationObj,
                                                        }
                                                        }));
                                                    }}
                                                    placeholder={t?.addressManual?.endTitle || 'Address'}
                                                    className="floating-input-black"
                                                />
                                            </div>
											
											<TextInputGroup label={t?.addressManual?.country || ''} value={this.state.endLocation.country} onChange={e => this.setState({ endLocation: { ...this.state.endLocation, country: e.target.value } })} inputClassName="floating-input-black" labelClassName={this.state.endLocation.country ? 'filled' : ''} />
											<TextInputGroup label={t?.addressManual?.state || ''} value={this.state.endLocation.state} onChange={e => this.setState({ endLocation: { ...this.state.endLocation, state: e.target.value } })} inputClassName="floating-input-black" labelClassName={this.state.endLocation.state ? 'filled' : ''} />
											<TextInputGroup label={t?.addressManual?.city || ''} value={this.state.endLocation.city} onChange={e => this.setState({ endLocation: { ...this.state.endLocation, city: e.target.value } })} inputClassName="floating-input-black" labelClassName={this.state.endLocation.city ? 'filled' : ''} />
											<TextInputGroup label={t?.addressManual?.address || ''} value={this.state.endLocation.address} onChange={e => this.setState({ endLocation: { ...this.state.endLocation, address: e.target.value } })} inputClassName="floating-input-black" labelClassName={this.state.endLocation.address ? 'filled' : ''} />
											<TextInputGroup label={t?.addressManual?.houseNumber || ''} value={this.state.endLocation.houseNumber} onChange={e => this.setState({ endLocation: { ...this.state.endLocation, houseNumber: e.target.value } })} inputClassName="floating-input-black" labelClassName={this.state.endLocation.houseNumber ? 'filled' : ''} />
										</div>
									</div>
								) : (
									<>
										<DeliveryMapToSelect
											startLocation={this.state.startLocation}
											endLocation={this.state.endLocation}
											onStartLocationSelect={this.handleStartLocationSelect}
											onEndLocationSelect={this.handleEndLocationSelect}
											className="w-full h-[350px] mb-4"
										/>
										<div className="text-sm text-gray-500">{t?.map.hint}</div>
									</>
								)}
							</div>
						{/* Start Location */}
						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-4 text-black">{t?.pickup.sectionTitle}</h2>
							<div className='h-[2px] bg-lighter rounded-sm my-4 mb-6'></div>
							<label className="font-semibold text-black">{t?.pickup.dateLabel}</label>
							<DateInputGroup label="" value={this.state.startDate} onChange={e => this.setState({ startDate: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.startDate ? 'filled' : ''} />
							<label className="font-semibold text-black">{t?.pickup.timeLabel}</label>
							<input type="time" value={this.state.startTime} onChange={e => this.setState({ startTime: e.target.value })} className="floating-input-black" />
						</div>
						<div className='h-[2px] bg-lighter rounded-sm my-4'></div>
						{/* End Location */}
						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-4 text-black">{t?.delivery.sectionTitle}</h2>
							
							<label className="font-semibold text-black">{t?.delivery.dateLabel}</label>
							<DateInputGroup label="" value={this.state.endDate} onChange={e => this.setState({ endDate: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.endDate ? 'filled' : ''} />
							<label className="font-semibold text-black">{t?.delivery.timeLabel}</label>
							<input type="time" value={this.state.endTime} onChange={e => this.setState({ endTime: e.target.value })} className="floating-input-black" />
						</div>
						<div className='h-[2px] bg-lighter rounded-sm my-4'></div>
						{/* Sender Info */}
						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-4 text-black">{t?.sender.sectionTitle}</h2>
							<TextInputGroup label={t?.sender.name} value={this.state.senderName} onChange={e => this.setState({ senderName: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.senderName ? 'filled' : ''} type="text" />
							<TextInputGroup label={t?.sender.phone} value={this.state.senderPhoneNumber} onChange={e => this.setState({ senderPhoneNumber: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.senderPhoneNumber ? 'filled' : ''} type="tel" />
							<TextInputGroup label={t?.sender.email} value={this.state.senderEmail} required={false} onChange={e => this.setState({ senderEmail: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.senderEmail ? 'filled' : ''} type="email" />
						</div>
						<div className='h-[2px] bg-lighter rounded-sm my-4'></div>
						{/* Cargo Info */}
						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-4 text-black">{t?.cargo.sectionTitle}</h2>
							<TextInputGroup label={t?.cargo.objectName} value={this.state.objectName} onChange={e => this.setState({ objectName: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.objectName ? 'filled' : ''} type="text" />
							<div className="flex flex-col mb-2">
								<label className="mb-2 font-semibold text-black">{t?.cargo.slotType}</label>
								<select value={this.state.cargoSlotType} onChange={e => this.setState({ cargoSlotType: e.target.value })} className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#724C9D] text-black" required>
									<option value="">{t?.cargo.chooseSlotPlaceholder}</option>
									{Object.entries(SLOT_TYPES).map(([key, val]) => (
										<option key={key} value={key}>{key} ({val.MaxWeight}, {val.MaxVolume})</option>
									))}
								</select>
							</div>
							<TextInputGroup label={t?.cargo.weightWithUnit} value={this.state.objectWeight} onChange={e => this.setState({ objectWeight: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.objectWeight ? 'filled' : ''} type="number" />
							<TextInputGroup label={t?.cargo.description} value={this.state.objectDescription} required={false} onChange={e => this.setState({ objectDescription: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.objectDescription ? 'filled' : ''} type="text" />
							<TextInputGroup label={`${t?.cargo.estimatedPrice}, ${t?.currency}`} value={this.state.estimatedPrice} required={false} onChange={e => this.setState({ estimatedPrice: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.estimatedPrice ? 'filled' : ''} type="number" />
						</div>
						<div className='h-[2px] bg-lighter rounded-sm my-4'></div>
						{/* Receiver Info */}
						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-4 text-black">{t?.receiver.sectionTitle}</h2>
							<TextInputGroup label={t?.receiver.name} value={this.state.receiverName} onChange={e => this.setState({ receiverName: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.receiverName ? 'filled' : ''} type="text" />
							<TextInputGroup label={t?.receiver.phone} value={this.state.receiverPhoneNumber} onChange={e => this.setState({ receiverPhoneNumber: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.receiverPhoneNumber ? 'filled' : ''} type="tel" />
						</div>
						<div className='h-[2px] bg-lighter rounded-sm my-4'></div>
						{/* Comment */}
						<div className="mb-6">
							<TextInputGroup label={t?.comment} value={this.state.comment ?? ""} required={false} onChange={e => this.setState({ comment: e.target.value })} inputClassName="floating-input-black" labelClassName={this.state.comment ? 'filled' : ''} type="text" />
						</div>
						<div className="flex justify-end">
							<button type="submit" className="w-full px-6 py-6 bg-[#724C9D] text-white rounded-lg hover:bg-[#5d3b80] transition-colors" disabled={this.state.submitting}>
								{t?.buttons.create}
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