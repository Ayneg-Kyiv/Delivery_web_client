'use client';

import React from 'react';
import { apiGet, apiPost } from '@/app/api-client';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { regions } from '@/data/regions';
import { monts } from '@/data/monts';
import { useI18n } from '@/i18n/I18nProvider';

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

        const res = await apiGet<any>(`/trip/list?${params.toString()}`, {}, this.props.session?.data?.accessToken || '');

        console.log(res.data);
        this.setState({
            trips: res.data.data || [],
            totalPages: res.data.pagination?.totalPages || 1,
            loading: false,
        });
    }

    async fetchLocations(){
        const res = await apiGet<any>(`/trip/locations/unique`);

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
        const t = (this.props as any).t;
        return (
            <div className='w-full relative'>
                <div className="h-[600px] md:h-[500px] bg-[url('/Rectangle47.png')] z-0 bg-cover bg-[50%_50%] relative top-0 left-0">
                    <div className="w-full h-[600px] md:h-[500px] bg-[#00000099]">
                        <div className="flex flex-col justify-center items-center absolute top-0 left-0 right-0 z-10 h-[500px] px-8 md:px-10 lg:px-20">
                            <h1 className="mt-18 text-2xl md:text-4xl font-bold mb-4 text-center">{t.heroTitle}</h1>
                            <div className="w-full flex flex-col md:flex-row justify-center items-center rounded-lg gap-4">
                                <select
                                    name="cityFrom"
                                    value={filters.cityFrom}
                                    onChange={this.handleFilterChange}
                                    className="px-4 py-5 rounded-lg text-black w-full md:w-[200px]"
                                    style={{
                                        border: '1px solid #ccc',
                                        backgroundColor: 'white',
                                        color: 'black',
                                    }}
                                >
                                    <option value="">{t.filters.from}</option>
                                    {this.state.cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                                <select
                                    name="cityTo"
                                    value={filters.cityTo}
                                    onChange={this.handleFilterChange}
                                    className="px-4 py-5 rounded-lg text-black w-full md:w-[200px]"
                                    style={{
                                        border: '1px solid #ccc',
                                        backgroundColor: 'white',
                                        color: 'black',
                                    }}
                                >
                                    <option value="">{t.filters.to}</option>
                                    {this.state.cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                                <input
                                    name="dateFrom"
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={this.handleFilterChange}
                                    className="px-4 py-5 rounded-lg text-black w-full md:w-[200px]"
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
                                    className="px-4 py-5 rounded-lg text-black w-full md:w-[200px]"
                                    style={{
                                        border: '1px solid #ccc',
                                        backgroundColor: 'white',
                                        color: 'black',
                                    }}
                                >
                                    <option value="">{t.filters.size}</option>
                                    <option value="XS">{t.filters.sizes.xs}</option>
                                    <option value="S">{t.filters.sizes.s}</option>
                                    <option value="M">{t.filters.sizes.m}</option>
                                    <option value="L">{t.filters.sizes.l}</option>
                                    <option value="XL">{t.filters.sizes.xl}</option>
                                    <option value="XXL">{t.filters.sizes.xxl}</option>
                                </select>
                            </div>
                            <div className='mt-6 w-full flex flex-col md:flex-row gap-4 items-center justify-center'>
                                <button
                                    className="w-full bg-[#7c3aed] button-type-1 py-4 md:w-[252px] rounded-lg font-bold"
                                    onClick={() => this.fetchTrips(1)}
                                    >
                                    {t.buttons.find}
                                </button>
                                {
                                    this.props.session?.data?.user?.roles.includes('Driver') &&
                                    <Link href="/delivery/trip/add" className="button-type-2 py-4 w-full md:w-[252px] rounded-lg flex items-center justify-center font-bold md:ml-6">
                                        {t.buttons.addTrip}
                                    </Link>
                                }
                            </div>
                        </div>
                </div>
            </div>

                <div className='flex flex-col md:flex-row gap-8 px-4 md:px-10 lg:px-20 py-10 w-full'>
                        <div className="flex flex-col p-4 rounded-lg md:w-1/4 bg-[#ffffff]">
                        {/* Filters Sidebar */}
                            <h2 className="text-black text-xl font-bold mb-4">{t.sidebar.filtersTitle}</h2>
                            <div className="mb-4">
                                <label className="text-black">{t.sidebar.price}</label>
                                <div className="flex flex-col gap-2 mt-2">
                                    <input
                                        name="priceFrom"
                                        type="number"
                                        value={filters.priceFrom}
                                        onChange={this.handleFilterChange}
                                        placeholder={t.sidebar.placeholders.from}
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
                                        placeholder={t.sidebar.placeholders.to}
                                        className="px-2 py-1 rounded "
                                        style={{
                                            border: '1px solid #ccc',
                                            color: 'black',
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="text-black">{t.sidebar.driverRating}</label>
                                <input
                                    name="driverRatingFrom"
                                    type="number"
                                    min={1}
                                    max={5}
                                    step={0.1}
                                    value={filters.driverRatingFrom}
                                    onChange={this.handleFilterChange}
                                    placeholder={t.sidebar.placeholders.from}
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
                        <div className="flex-1 flex flex-col gap-4">
                            {loading ? (
                                <div className="text-white text-center py-20">{t.loading}</div>
                            ) : trips.length === 0 ? (
                                <div className="text-white text-center py-20">{t.empty}</div>
                            ) : (
                                trips.map(trip => {
                                    const startDate = new Date(trip.startLocation.dateTime);
                                    const endDate = new Date(trip.endLocation.dateTime);
                                    const monthName = monts.find(m => m.value === startDate.getMonth() + 1)?.name;
                                    const dateLabel = `${monthName} ${startDate.getDate()}`;
                                    const timeFrom = startDate.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
                                    const timeTo = endDate.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
                                    const minPrice = trip.deliverySlots.length > 0 ? Math.min(...trip.deliverySlots.map(s => s.approximatePrice)) : trip.price;
                                    const rating = trip.driver?.rating;
                                    return (
                                        <div
                                            key={trip.id}
                                            className="border border-[#724C9D] rounded-2xl bg-white text-black flex flex-col md:flex-row items-stretch shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                                        >
                                            {/* Column 1: Image + route/date/time */}
                                            <div className="flex md:w-[320px] p-4 gap-4">
                                                <div className="flex-shrink-0">
                                                    <Image
                                                        src={regions.find(r=> r.name === trip.startLocation.state)?.image || '/regions/Kyivska.jpg'}
                                                        alt={`${trip.startLocation.city} - ${trip.endLocation.city}`}
                                                        width={96}
                                                        height={96}
                                                        className="w-24 h-24 object-cover rounded-lg"
                                                    />
                                                </div>
                                                <div className="flex flex-col justify-center min-w-0">
                                                    <div className="font-semibold text-base md:text-lg mb-2 truncate">
                                                        {trip.startLocation.city}–{trip.endLocation.city}
                                                    </div>
                                                    <div className="flex items-center text-xs md:text-sm gap-2">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#724C9D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                                        <span className="truncate">{dateLabel}</span>
                                                    </div>
                                                    <div className="flex items-center text-xs md:text-sm gap-2 mt-1">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#724C9D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                                        <span>{timeFrom}–{timeTo}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Vertical separator (hidden on small screens) */}
                                            <div className="hidden md:block w-px bg-[#724C9D] my-2" />
                                            {/* Column 2: Driver & rating */}
                                            <div className="flex flex-col justify-center flex-1 p-4 md:min-w-[280px] border-t md:border-t-0 md:border-l border-[#724C9D]/40 md:border-transparent md:pl-6">
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src={trip.driver?.imagePath ? (process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + trip.driver.imagePath : '/dummy.png'}
                                                        alt={trip.fullName}
                                                        width={48}
                                                        height={48}
                                                        className="rounded-full object-cover w-12 h-12"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm md:text-base leading-tight">{trip.fullName}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-1 mt-3 text-xs text-gray-600">
                                                    <span className="text-[#F5B400] font-medium">{rating ? rating.toFixed(1) : '0.0'}</span>
                                                    <span className="text-[#F5B400] tracking-tight">★★★★★</span>
                                                </div>
                                            </div>
                                            {/* Vertical separator */}
                                            <div className="hidden md:block w-px bg-[#724C9D] my-2" />
                                            {/* Column 3: Price & action */}
                                            <div className="flex flex-col justify-center p-4 md:w-[240px] gap-2 md:items-end">
                                                <div className="flex items-center gap-1 font-semibold text-base md:text-lg">
                                                    <span className="whitespace-nowrap">{minPrice}{t.currency}</span>
                                                    <span title={t.priceDisclaimer} className="text-[#724C9D] cursor-help select-none">ⓘ</span>
                                                </div>
                                                <div className="text-[10px] text-gray-500 leading-tight max-w-[200px] text-left md:text-right">{t.priceDisclaimer}</div>
                                                <Link href={`/delivery/trip/${trip.id}`} className='mt-2 w-full md:w-auto'>
                                                    <button className="w-full md:w-[160px] px-6 py-2 rounded-lg font-semibold bg-[#724C9D] text-white hover:bg-[#5d3b80] transition-colors text-sm">{t.buttons.choose}</button>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })
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

const TripListWithSession = withSession(TripListPage);
const TripListWrapper = (props: any) => {
    const { messages } = useI18n();
    const t = messages.tripList;
    return <TripListWithSession {...props} t={t} />;
};

export default TripListWrapper;