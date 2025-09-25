'use client';

import React from 'react';
import { ApiClient } from '@/app/api-client';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

// HOC to inject session into class components (copied from your admin panel)
const withSession = (Component: React.ComponentType<any>) => {
    const WrappedComponent = (props: any) => {
        const session = useSession();

        if (session.status === 'loading') {
            return <div>Loading...</div>;
        }

        if (session.status === 'unauthenticated') {
            location.href = '/signin';
        }

        // Only allow users (not Admins only)
        if (
            session.status === 'authenticated' &&
            !session.data.user.roles.includes('User')
        ) {
            location.href = '/unauthorized';
        }

        // Only allow class components
        if (Component.prototype && Component.prototype.render) {
            return <Component session={session} {...props} />;
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

type Vehicle = {
    id: string;
    type: string;
    brand: string;
    model: string;
    color: string;
    numberPlate: string;
    imagePath: string;
    imagePathBack: string;
    createdAt: string;
    updatedAt: string;
};
type DeliverySlot = {
    id: string;
    cargoSlotTypeName: string;
    approximatePrice: number;
};

type Trip = {
    id: string;
    startLocation: LocationState;
    endLocation: LocationState;
    vehicle: Vehicle;
    deliverySlots: DeliverySlot[];
    driver: {
        email: string;
        name: string;
        rating: number;
        imagePath?: string;
    };
    price: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    cargoType: string;
};

type TripFilters = {
    cityFrom: string;
    cityTo: string;
    priceFrom: string;
    priceTo: string;
    dateFrom: string;
    dateTo: string;
    driverRatingFrom: string;
    cargoType: string;
};

type TripListState = {
    cities: string[];
    trips: Trip[];
    filters: TripFilters;
    currentPage: number;
    totalPages: number;
    loading: boolean;
};

const initialFilters: TripFilters = {
    cityFrom: '',
    cityTo: '',
    priceFrom: '',
    priceTo: '',
    dateFrom: '',
    dateTo: '',
    driverRatingFrom: '',
    cargoType: '',
};

const batchSize = 10;

class TripListPage extends React.Component<any, TripListState> {
    constructor(props: any) {
        super(props);
        this.state = {
            cities: [],
            trips: [],
            filters: initialFilters,
            currentPage: 1,
            totalPages: 1,
            loading: false,
        };
    }

    async fetchTrips(page = 1) {
        this.setState({ loading: true });
        const { filters } = this.state;
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            // Only add if value is not empty string, null, or undefined
            if (
                value !== '' &&
                value !== null &&
                value !== undefined
            ) {
                params.append(key, value);
            }
        });

        params.append('pageNumber', page.toString());
        params.append('pageSize', batchSize.toString());

        console.log(`/trip/list?${params.toString()}`);

        const res = await ApiClient.get<any>(`/trip/list?${params.toString()}`);

        console.log(res.data);
        this.setState({
            trips: res.data.data || [],
            totalPages: res.data.pagination?.totalPages || 1,
            loading: false,
        });
    }

    async fetchLocations(){
        const res = await ApiClient.get<any>(`/trip/locations/unique`);

        console.log(res.data);
        this.setState({
            cities:  res.data || [],
        });
    }

    componentDidMount() {
        this.fetchTrips(1);
        this.fetchLocations();
    }

    componentDidUpdate(prevProps: any, prevState: TripListState) {
        if (
            prevState.filters !== this.state.filters ||
            prevState.currentPage !== this.state.currentPage
        ) {
            this.fetchTrips(this.state.currentPage);
        }
    }

    handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        this.setState({
            filters: { ...this.state.filters, [e.target.name]: e.target.value },
            currentPage: 1,
        });
    };

    render() {
        const { trips, filters, currentPage, totalPages, loading } = this.state;
        return (
            <div className="flex flex-col w-full min-h-screen bg-[#1a093a]">
                <div className="relative w-full h-[500px]">
                    <Image
                        src="/Rectangle47.png"
                        alt="Delivery"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[#1a093a]/60 flex flex-col justify-center items-center">
                        <h1 className="  text-4xl font-bold mb-4">Відправляй свою посилку вже зараз</h1>
                        <div className="flex rounded-lg gap-4">
                            <select
                                name="cityFrom"
                                value={filters.cityFrom}
                                onChange={this.handleFilterChange}
                                className="px-4 py-2 rounded-lg text-black w-[200px]"
                                style={{
                                    border: '1px solid #ccc',
                                    backgroundColor: 'white',
                                    color: 'black',
                                }}
                            >
                                <option value="">Звідки</option>
                                {this.state.cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                            <select
                                name="cityTo"
                                value={filters.cityTo}
                                onChange={this.handleFilterChange}
                                className="px-4 py-2 rounded-lg text-black w-[200px]"
                                style={{
                                    border: '1px solid #ccc',
                                    backgroundColor: 'white',
                                    color: 'black',
                                }}
                            >
                                <option value="">Куди</option>
                                {this.state.cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                            <input
                                name="dateFrom"
                                type="date"
                                value={filters.dateFrom}
                                onChange={this.handleFilterChange}
                                className="px-4 py-2 rounded-lg text-black"
                                style={{
                                    border: '1px solid #ccc',
                                    backgroundColor: 'white',
                                    color: 'black',
                                }}
                            />
                            <select
                                name="cargoType"
                                value={filters.cargoType}
                                onChange={this.handleFilterChange}
                                className="px-4 py-2 rounded-lg text-black"
                                style={{
                                    border: '1px solid #ccc',
                                    backgroundColor: 'white',
                                    color: 'black',
                                }}
                            >
                                <option value="">Розмір</option>
                                <option value="XS">XS до 1 кг</option>
                                <option value="S">S до 5 кг</option>
                                <option value="M">M до 15 кг</option>
                                <option value="L">L до 30 кг</option>
                                <option value="XL">XL до 60 кг</option>
                                <option value="XXL">XXL від 61 кг</option>
                            </select>
                        </div>
                        <div className='mt-6 flex flex-row items-center justify-center'>
                            <button
                                className="bg-[#7c3aed] button-type-1 py-4 w-[252px] rounded-lg font-bold"
                                onClick={() => this.fetchTrips(1)}
                                >
                                Знайти попутника
                            </button>
                            {
                                this.props.session?.data?.user?.roles.includes('Driver') &&
                                <Link href="/delivery/trip/add" className="button-type-2 py-4 w-[252px] rounded-lg flex items-center justify-center font-bold ml-6">
                                    Додати поїздку
                                </Link>
                            }
                        </div>
                    </div>
                </div>
                <div className='flex flex-col md:flex-row gap-8 px-4 md:px-10 lg:px-20 py-10 w-full'>
                    <div className="flex flex-col p-4 rounded-lg w-1/4 bg-[#ffffff]">
                    {/* Filters Sidebar */}
                        <h2 className="text-black text-xl font-bold mb-4">Фільтри</h2>
                        <div className="mb-4">
                            <label className="text-black">Ціна</label>
                            <div className="flex flex-col gap-2 mt-2">
                                <input
                                    name="priceFrom"
                                    type="number"
                                    value={filters.priceFrom}
                                    onChange={this.handleFilterChange}
                                    placeholder="Від"
                                    className="px-2 py-1 rounded"
                                    style={{
                                        border: '1px solid #ccc',
                                        color: 'black',
                                    }}
                                />
                                <input
                                    name="priceTo"
                                    type="number"
                                    value={filters.priceTo}
                                    onChange={this.handleFilterChange}
                                    placeholder="До"
                                    className="px-2 py-1 rounded "
                                    style={{
                                        border: '1px solid #ccc',
                                        color: 'black',
                                    }}
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="text-black">Рейтинг водія</label>
                            <input
                                name="driverRatingFrom"
                                type="number"
                                min={1}
                                max={5}
                                step={0.1}
                                value={filters.driverRatingFrom}
                                onChange={this.handleFilterChange}
                                placeholder="Від"
                                className="px-2 py-1 text-black rounded w-full mt-2"
                                    style={{
                                        border: '1px solid #ccc',
                                        color: 'black',
                                    }}
                            />
                        </div>
                        {/* Add more filters as needed */}
                    </div>
                    {/* Trips List */}
                    <div className="flex-1 flex flex-col gap-6">
                        {loading ? (
                            <div className="text-white text-center py-20">Завантаження...</div>
                        ) : trips.length === 0 ? (
                            <div className="text-white text-center py-20">Немає доступних поїздок</div>
                        ) : (
                            trips.map(trip => (
                                <div key={trip.id} className="bg-[#2d1857] rounded-xl flex flex-row items-center p-6 shadow-lg">
                                    <Image
                                        src={trip.driver.imagePath ? (process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + trip.driver.imagePath : '/dummy.png'}
                                        alt={trip.fullName}
                                        width={80}
                                        height={80}
                                        className="rounded-full object-cover"
                                    />
                                    <div className="flex-1 flex flex-col px-6">
                                        <div className="flex gap-2 items-center text-white text-lg font-bold">
                                            {trip.startLocation.city} - {trip.endLocation.city}
                                        </div>
                                        <div className="flex flex-col gap-4 text-white mt-2">
                                            <span>
                                                відбуття: {trip.startLocation.dateTime} 
                                            </span>
                                            <span>
                                                прибуття: {trip.endLocation.dateTime}
                                            </span>
                                        </div>
                                        <div className="flex gap-2 items-center text-white mt-2">
                                            <span>Водій: {trip.fullName}</span>
                                            <span className="font-bold">{trip.driver.email}</span>
                                            <span className="text-yellow-400">★ {trip.driver.rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="bg-[#7c3aed] text-white px-4 py-2 rounded-lg font-bold text-xl">
                                            {trip.deliverySlots.length > 0
                                                ? Math.min(...trip.deliverySlots.map(slot => slot.approximatePrice))
                                                : trip.price}грн
                                        </div>
                                        <div className="text-white text-xs">Ціна може змінюватись від розміру посилки</div>
                                        <Link href={`/delivery/trip/${trip.id}`}>
                                            <button className="bg-white text-[#7c3aed] px-6 py-2 rounded-lg font-bold mt-2">Обрати</button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-10 gap-2 text-lg">
                                <button
                                    className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg disabled:bg-[#2d1857] disabled:cursor-not-allowed"
                                    onClick={() => this.setState({ currentPage: 1 })}
                                    disabled={currentPage === 1}
                                >
                                    1
                                </button>
                                {currentPage > 2 && (
                                    <button
                                        className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg"
                                        onClick={() => this.setState({ currentPage: currentPage - 1 })}
                                    >
                                        {currentPage - 1}
                                    </button>
                                )}
                                <span className="px-6 py-2 bg-[#7c3aed] text-white rounded-lg">{currentPage}</span>
                                {currentPage < totalPages - 1 && (
                                    <button
                                        className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg"
                                        onClick={() => this.setState({ currentPage: currentPage + 1 })}
                                    >
                                        {currentPage + 1}
                                    </button>
                                )}
                                <button
                                    className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg disabled:bg-[#2d1857] disabled:cursor-not-allowed"
                                    onClick={() => this.setState({ currentPage: totalPages })}
                                    disabled={currentPage === totalPages}
                                >
                                    {totalPages}
                                </button>
                            </div>
                        )}
                    </div>
                    
                </div>
            </div>
        );
    }
}

export default withSession(TripListPage);