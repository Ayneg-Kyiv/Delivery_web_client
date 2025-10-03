'use client';

import React from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { useSession } from 'next-auth/react';
import TextInputGroup from '@/components/ui/text-input-group';
import DateInputGroup from '@/components/ui/date-input-group';
import { apiGet ,apiPost } from '@/app/api-client';
import DeliveryMapToSelect from '@/components/other/delivery-map-to-select';

// HOC to inject session into class components
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

        // Only allow Drivers
        if (
            session.status === 'authenticated' &&
            !session.data.user.roles.includes('Driver')
        ) {
            location.href = '/unauthorized';
        }

        // Only allow class components
        if (Component.prototype && Component.prototype.render) {
            return <Component session={session} messages={messages} {...props} />;
        }

        throw new Error(
            [
                "You passed a function component, `withSession` is not needed.",
                "You can `useSession` directly in your component.",
            ].join("\n")
        );
    };
    WrappedComponent.displayName = `withSession(${Component.displayName || Component.name || 'Component'})`;
    return WrappedComponent;
};

// Add this to your file, above the class
const SLOT_TYPES: Record<string, { MaxWeight: string; MaxVolume: string }> = {
    XS: { MaxWeight: "1kg", MaxVolume: "0.5L" },
    S: { MaxWeight: "3kg", MaxVolume: "1L" },
    M: { MaxWeight: "5kg", MaxVolume: "2L" },
    L: { MaxWeight: "7kg", MaxVolume: "2L" },
    XL: { MaxWeight: "10kg", MaxVolume: "2L" },
    XXL: { MaxWeight: "10kg+", MaxVolume: "2L+" }
};


class AddTripPage extends React.Component<any, AddTripState> {
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

            slots: [],
            newSlot: {
                cargoSlotTypeName: '',
                approximatePrice: ''
            },
            fullName: '',
            email: '',
            phoneNumber: '',
            vehicleId: '',
            vehicles: [],
            loadingVehicles: true,
        };
    }

    async componentDidMount() {
        // Fetch user's vehicles
        try {
            const vehiclesResponse = await apiGet<any>('/account/user-vehicles', {}, this.props.session.data?.accessToken || '');
            if (vehiclesResponse.success) {
                this.setState({ vehicles: vehiclesResponse.data, loadingVehicles: false });
            } else {
                this.setState({ vehicles: [], loadingVehicles: false });
            }
        } catch {
            this.setState({ vehicles: [], loadingVehicles: false });
        }
    }
    
    handleSlotTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState(prevState => ({
            ...prevState,
            newSlot: {
                ...prevState.newSlot,
                cargoSlotTypeName: e.target.value
            }
        }));
    };

    handleSlotPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState(prevState => ({
            ...prevState,
            newSlot: {
                ...prevState.newSlot,
                approximatePrice: e.target.value
            }
        }));
    };

    handleAddSlot = (e: React.FormEvent) => {
        e.preventDefault();
        const { cargoSlotTypeName, approximatePrice } = this.state.newSlot;
        if (!cargoSlotTypeName || !approximatePrice) return;
        this.setState(prevState => ({
            ...prevState,
            slots: [
                ...prevState.slots,
                {
                    id: Math.random().toString(36).substr(2, 9),
                    cargoSlotTypeName,
                    approximatePrice: Number(approximatePrice)
                }
            ],
            newSlot: { cargoSlotTypeName: '', approximatePrice: '' }
        }));
    };

    handleRemoveSlot = (id: string) => {
        this.setState(prevState => ({
            ...prevState,
            slots: prevState.slots.filter(slot => slot.id !== id)
        }));
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

    handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Combine date and time for start and end locations
        const combineDateTime = (date: string, time: string) => {
            if (!date || !time) return '';
            // Format: YYYY-MM-DDTHH:mm
            return `${date}T${time}`;
        };

        const startDateTime = combineDateTime(this.state.startDate, this.state.startTime);
        const endDateTime = combineDateTime(this.state.endDate, this.state.endTime);

        console.log(this.state.startLocation, this.state.endLocation);

        // Check required fields
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
            this.state.fullName,
            this.state.email,
            this.state.phoneNumber,
            this.state.vehicleId,
        ];

        if (requiredFields.some(field => !field)) {
            const t = (this.props as any).t?.addTrip;
            alert(t?.errors.requiredFields || 'Будь ласка, заповніть всі обов\'язкові поля');
            return;
        }

        if (this.state.slots.length === 0) {
            const t = (this.props as any).t?.addTrip;
            alert(t?.errors.noSlots || 'Додайте хоча б один слот для доставки');
            return;
        }

        const payload = {
            startLocation: {
                ...this.state.startLocation,
                dateTime: startDateTime,
            },
            endLocation: {
                ...this.state.endLocation,
                dateTime: endDateTime,
            },
            slots: this.state.slots,
            fullName: this.state.fullName,
            email: this.state.email,
            phoneNumber: this.state.phoneNumber,
            vehicleId: this.state.vehicleId,
        };

        try {
            const response = await apiPost('/trip/create', payload, {}, this.props.session.data?.accessToken || '');
            if (response.success) {
                // Redirect or show success message
                window.location.href = '/delivery/trip/list';
            } else {
                const t = (this.props as any).t?.addTrip;
                alert(t?.errors.saveFailed || 'Не вдалося зберегти маршрут');
            }
        } catch (error) {
            const t = (this.props as any).t?.addTrip;
            alert(t?.errors.saveError || 'Сталася помилка при збереженні маршруту');
        }
    }

    render() {
        const t = (this.props as any).t?.addTrip;
        return (
            <div className="flex flex-col w-full min-h-screen bg-[#1a093a] px-8 md:px-20 lg:px-80 min-w-[300px]">
                <div className='text-black flex flex-col items-center rounded-lg my-10 p-10 bg-[#ffffff] max-w-[540px]'>
                    <h1 className='text-2xl font-bold py-3 text-[#724C9D]'>
                        {t?.title || 'Оформлення маршруту'}
                    </h1>

                    <form className="w-full max-w-lg mt-6" onSubmit={this.handleSubmit}>
                        

                        {/* Start Location */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-4 text-black"></h2>

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
                            
                            <div className='h-[2px] bg-lighter rounded-sm my-4 mb-6'></div>

                            <div className="flex flex-col mb-2">
                                <label className=" font-semibold text-black">{t?.start.dateLabel || 'Дата виїзду'}</label>
                                <DateInputGroup
                                    label=""
                                    value={this.state.startDate}
                                    onChange={e => this.setState({ startDate: e.target.value })}
                                    inputClassName="floating-input-black"
                                    labelClassName={this.state.startDate ? 'filled' : ''}
                                />
                            </div>

                            <div className="flex flex-col mb-2">
                                <label className=" font-semibold text-black">{t?.start.timeLabel || 'Час виїзду'}</label>
                                <input
                                    type="time"
                                    value={this.state.startTime}
                                    onChange={e => this.setState({ startTime: e.target.value })}
                                    className="floating-input-black"
                                />
                            </div>
                        </div>

                        <div className='h-[2px] bg-lighter rounded-sm my-4'></div>

                        {/* End Location */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-4 text-black">{t?.end.sectionTitle || 'Кінцева локація'}</h2>
                            
                            <div className="flex flex-col mb-2">
                                <label className="mb-2 font-semibold text-black">{t?.end.dateLabel || 'Дата'}</label>
                                <DateInputGroup
                                    label=""
                                    value={this.state.endDate}
                                    onChange={e => this.setState({ endDate: e.target.value })}
                                    inputClassName="floating-input-black"
                                    labelClassName={this.state.endDate ? 'filled' : ''}
                                />
                            </div>

                            <div className="flex flex-col mb-4">
                                <label className="mb-2 font-semibold text-black">{t?.end.timeLabel || 'Час'}</label>
                                <input
                                    type="time"
                                    value={this.state.endTime}
                                    onChange={e => this.setState({ endTime: e.target.value })}
                                    className="floating-input-black"
                                />
                            </div>
                            
                        <div className='h-[2px] bg-lighter rounded-sm mt-6 mb-4'></div>  
                    <div className="mb-6">

                        
                        <h2 className="text-xl font-semibold mb-4 text-black">{t?.personal.sectionTitle || 'Ваші дані'}</h2>

                        <div className="flex flex-col mb-2">
                            <TextInputGroup
                                label={t?.personal.fullName || "Повне ім'я"}
                                value={this.state.fullName}
                                onChange={e => this.setState({ fullName: e.target.value })}
                                inputClassName="floating-input-black"
                                labelClassName={this.state.fullName ? 'filled' : ''}
                                type="text"
                            />
                        </div>

                        <div className="flex flex-col mb-2">
                            <TextInputGroup
                                label={t?.personal.email || 'Email'}
                                value={this.state.email}
                                onChange={e => this.setState({ email: e.target.value })}
                                inputClassName="floating-input-black"
                                labelClassName={this.state.email ? 'filled' : ''}
                                type="email"
                            />
                        </div>

                        <div className="flex flex-col mb-2">
                            <TextInputGroup
                                label={t?.personal.phone || 'Номер телефону'}
                                value={this.state.phoneNumber}
                                onChange={e => this.setState({ phoneNumber: e.target.value })}
                                inputClassName="floating-input-black"
                                labelClassName={this.state.phoneNumber ? 'filled' : ''}
                                type="tel"
                            />

                        </div>
                            <div className="flex flex-col mb-2">
                                <label className="mb-2 text-xl font-semibold text-black">{t?.vehicle.sectionTitle || 'Транспортний засіб'}</label>
                                {this.state.loadingVehicles ? (
                                    <div className="text-gray-500">{t?.vehicle.loading || 'Завантаження транспортних засобів...'}</div>
                                ) : (
                                    <select
                                        id="vehicleId"
                                        value={this.state.vehicleId}
                                        onChange={e => this.setState({ vehicleId: e.target.value })}
                                        className="border rounded-lg px-4 py-5 focus:outline-none focus:ring-2 focus:ring-[#724C9D] text-black"
                                        required
                                    >
                                        <option value="">{t?.vehicle.choosePlaceholder || 'Оберіть транспортний засіб'}</option>
                                        {this.state.vehicles.map(vehicle => (
                                            <option key={vehicle.id} value={vehicle.id}>
                                                {vehicle.brand} {vehicle.model} ({vehicle.numberPlate})
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {this.state.vehicles.length === 0 && !this.state.loadingVehicles && (
                                    <div className="text-red-500 mt-2">
                                        {t?.vehicle.noneMessage || 'У вас немає доданих транспортних засобів.'} <a href="/vehicle/add" className="underline text-blue-600">{t?.vehicle.addLink || 'Додати'}</a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='h-[2px] bg-lighter rounded-sm my-2'></div>
                            {/* Delivery Slots Section */}
                            <div className="w-full mb-2">
                                <h2 className="w-full text-xl font-semibold mb-4 text-[#724C9D]">{t?.slots.sectionTitle || 'Додати слоти для доставки'}</h2>
                                <div className="w-full flex flex-col md:flex-row gap-4 justify-center items-center mb-4">
                                    <select
                                        id='slotType'
                                        value={this.state.newSlot.cargoSlotTypeName}
                                        onChange={this.handleSlotTypeChange}
                                        className="w-full px-4 py-5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#724C9D]"
                                    >
                                        <option value="">{t?.slots.selectTypePlaceholder || 'Оберіть тип слота'}</option>
                                        {Object.entries(SLOT_TYPES).map(([key, val]) => (
                                            <option key={key} value={key}>
                                                {key} ({val.MaxWeight}, {val.MaxVolume})
                                            </option>
                                        ))}
                                    </select>

                                    <TextInputGroup
                                        label={`${t?.slots.priceLabel || 'Ціна'}, ${t?.currency || 'грн'}`}
                                        value={this.state.newSlot.approximatePrice}
                                        onChange={this.handleSlotPriceChange}
                                        className='floating-input-group-without-margin'
                                        inputClassName="floating-input-black"
                                        required={false}
                                        labelClassName={this.state.newSlot.approximatePrice ? 'filled' : ''}
                                        type="number"
                                        />

                                    <button
                                        type="button"
                                        onClick={this.handleAddSlot}
                                        className="px-4 py-2 bg-[#724C9D] text-white rounded-lg hover:bg-[#5d3b80] transition-colors"
                                    >
                                        {t?.slots.addSlot || 'Додати слот'}
                                    </button>
                                </div>
                                {/* List of added slots */}
                                {this.state.slots.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        {this.state.slots.map(slot => (
                                            <div key={slot.id} className="flex items-center justify-between bg-[#f3f0fa] rounded-lg px-4 py-2">
                                                <span>
                                                    <b>{slot.cargoSlotTypeName}</b> — {slot.approximatePrice} {t?.currency || 'грн'}
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        ({SLOT_TYPES[slot.cargoSlotTypeName]?.MaxWeight}, {SLOT_TYPES[slot.cargoSlotTypeName]?.MaxVolume})
                                                    </span>
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => this.handleRemoveSlot(slot.id)}
                                                    className="text-red-500 hover:underline ml-4"
                                                >
                                                    {t?.slots.delete || 'Видалити'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Note: Slots management would be added here */}
                        
                        <div className='h-[2px] bg-lighter rounded-sm my-4'></div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="w-full px-6 py-6 bg-[#724C9D] text-white rounded-lg hover:bg-[#5d3b80] transition-colors"
                            >
                                {t?.buttons.save || 'Зберегти'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default withSession(AddTripPage);