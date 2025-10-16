'use client';

import React from 'react';
import { apiGet } from '@/app/api-client';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { regions } from '@/data/regions';
import { monts } from '@/data/monts';
import { useI18n } from '@/i18n/I18nProvider';

// HOC to inject session into class components
const withSession = (Component: React.ComponentType<any>) => {
    const WrappedComponent = (props: any) => {
        const session = useSession();

        if (session.status === 'loading') {
            return <div>Loading...</div>;
        }

        if (session.status === 'unauthenticated') {
            location.href = '/signin';
        }

        // Only allow users
        if (
            session.status === 'authenticated' &&
            !session.data.user.roles.includes('User')
        ) {
            location.href = '/unauthorized';
        }

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

type RequestFilters = {
    cityFrom: string;
    cityTo: string;
    cargoSlotType: string;
    dateFrom: string;
    dateTo: string;
};

type RequestListState = {
    cities: string[];
    requests: DeliveryRequest[];
    filters: RequestFilters;
    currentPage: number;
    totalPages: number;
    loading: boolean;
};

const initialFilters: RequestFilters = {
    cityFrom: '',
    cityTo: '',
    cargoSlotType: '',
    dateFrom: '',
    dateTo: '',
};

const batchSize = 10;

class RequestListPage extends React.Component<any, RequestListState> {
    constructor(props: any) {
        super(props);
        this.state = {
            cities: [],
            requests: [],
            filters: initialFilters,
            currentPage: 1,
            totalPages: 1,
            loading: false,
        };
    }

    async fetchRequests(page = 1) {
        this.setState({ loading: true });
        const { filters } = this.state;
        const params = new URLSearchParams();

        // Only use cityFrom, cityTo, dateFrom, dateTo
        if (filters.cityFrom) params.append('cityFrom', filters.cityFrom);
        if (filters.cityTo) params.append('cityTo', filters.cityTo);
        if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) params.append('dateTo', filters.dateTo);

        params.append('pageNumber', page.toString());
        params.append('pageSize', batchSize.toString());

        const res = await apiGet<any>(`/request?${params.toString()}`, {}, this.props.session?.accessToken);


        this.setState({
            requests: res.data.data || [],
            totalPages: res.data.pagination?.totalPages || 1,
            loading: false,
        });
    }

    async fetchLocations() {
        console.log('fetching locations', this.props.session);

        const res = await apiGet<any>(`/trip/locations/unique`, {}, this.props.session?.data?.accessToken);

        this.setState({
            cities: res.data || [],
        });
    }

    componentDidMount() {
        this.fetchRequests(1);
        this.fetchLocations();
    }

    componentDidUpdate(prevProps: any, prevState: RequestListState) {
        if (
            prevState.filters !== this.state.filters ||
            prevState.currentPage !== this.state.currentPage
        ) {
            this.fetchRequests(this.state.currentPage);
        }
    }

    handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        this.setState({
            filters: { ...this.state.filters, [e.target.name]: e.target.value },
            currentPage: 1,
        });
    };

    render() {
        const { requests, filters, currentPage, totalPages, loading } = this.state;
        const t = (this.props as any).t;
        return (
            <div className='w-full relative '>
                <div className="h-[600px] md:h-[500px] bg-[url('/Rectangle47.png')] z-0 bg-cover bg-[50%_50%] relative top-0 left-0">
                    <div className="w-full h-[600px] md:h-[500px] bg-[#00000099]">
                    <div className="flex flex-col justify-center items-center absolute top-0 left-0 right-0 z-10 h-[500px] px-8 md:px-10 lg:px-20">
                        <h1 className="mt-18 text-2xl md:text-4xl font-bold mb-4">{t.heroTitle}</h1>
                        <div className="w-full flex flex-col md:flex-row justify-center items-center rounded-lg gap-x-4 gap-y-4">
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
                                className="mt-2 md:mt-0 px-4 py-5  rounded-lg text-black w-full md:w-[200px]"
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
                                className="mt-2 md:mt-0 px-4 py-5 rounded-lg text-black w-full md:w-[200px]"
                                style={{
                                    border: '1px solid #ccc',
                                    backgroundColor: 'white',
                                    color: 'black',
                                }}
                            />
                            <select
                                name="cargoSlotType"
                                value={filters.cargoSlotType}
                                onChange={this.handleFilterChange}
                                className="mt-2 md:mt-0 px-4 py-5 rounded-lg text-black w-full md:w-[200px]"
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
                        <div className='mt-6 w-full flex flex-col md:flex-row gap-4 justify-center items-center'>
                            <button
                                className="bg-[#7c3aed] button-type-1 py-4 w-full md:w-[252px] rounded-lg font-bold"
                                onClick={() => this.fetchRequests(1)}
                            >
                                {t.buttons.find}
                            </button>
                            {this.props.session.status === 'authenticated' && this.props.session.data.user.roles.includes('User') && (
                                <Link href={'/delivery/request/add'} className="md:ml-6 bg-white button-type-1 py-4 w-full md:w-[252px] rounded-lg font-bold flex items-center justify-center">
                                    {t.buttons.create}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
                <div className='w-full flex flex-col gap-8 px-4 md:px-10 lg:px-20 py-10'>
                    {/* Requests List */}
                    <div className="w-full flex flex-col gap-4">
                        {loading ? (
                            <div className="text-white text-center py-20">{t.loading}</div>
                        ) : requests.length === 0 ? (
                            <div className="text-white text-center py-20">{t.empty}</div>
                        ) : (
                            requests.map(request => {
                                const locale = t.locale || 'uk';
                                const startDate = new Date(request.startLocation.dateTime);
                                const endDate = new Date(request.endLocation.dateTime);
                                const dateLabel = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(startDate);
                                const timeFrom = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(startDate);
                                const timeTo = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(endDate);
                                const rating = request.sender?.rating;
                                const isSuper = rating && rating >= 4.8;
                                const reviewsCount: any = (request as any).sender?.reviewsCount; // optional
                                return (
                                <div key={request.id} className="border border-[#724C9D] rounded-2xl bg-white text-black flex flex-col md:flex-row flex-wrap md:flex-nowrap items-stretch p-3 md:p-4 gap-4 shadow-sm hover:shadow-md transition-shadow">
                                    {/* Thumbnail */}
                                    <div className="flex-shrink-0 order-1">
                                        <Image
                                            src={regions.find(r=> r.name === request.startLocation.state)?.image || '/regions/Kyivska.jpg'}
                                            alt={`${request.startLocation.city} - ${request.endLocation.city}`}
                                            width={120}
                                            height={120}
                                            className="w-[120px] h-[120px] object-cover rounded-lg"
                                        />
                                    </div>
                                    {/* Route & Time */}
                                    <div className="flex flex-col justify-center flex-[1_1_180px] order-2 md:order-2 min-w-[160px]">
                                        <div className="font-semibold text-base md:text-lg mb-2 truncate">
                                            {request.startLocation.city}–{request.endLocation.city}
                                        </div>
                                        <div className="flex items-center text-sm gap-2">
                                            {/* calendar icon */}
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#724C9D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                            <span className="truncate">{dateLabel}</span>
                                        </div>
                                        <div className="flex items-center text-sm gap-2 mt-1">
                                            {/* clock icon */}
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#724C9D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                            <span>{timeFrom}–{timeTo}</span>
                                        </div>
                                    </div>
                                    {/* Sender */}
                                    <div className="flex flex-col justify-center flex-[1_1_160px] order-4 md:order-3 min-w-[150px]">
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={request.sender?.imagePath ? (process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + request.sender.imagePath : '/dummy.png'}
                                                alt={request.sender?.name || request.senderName}
                                                width={48}
                                                height={48}
                                                className="rounded-full object-cover w-12 h-12"
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm md:text-base leading-tight">{request.sender?.name || request.senderName}</span>
                                                {isSuper && <span className="text-[11px] text-[#724C9D] font-semibold">{t.labels.superDriver}</span>}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-1 mt-2 text-xs text-gray-600">
                                            <span className="text-[#F5B400] font-medium">{rating ? rating.toFixed(1) : '0'}</span>
                                            <span className="text-[#F5B400] tracking-tight">★★★★★</span>
                                            {reviewsCount != null && <span className="text-gray-500">{reviewsCount} {t.labels.reviews}</span>}
                                        </div>
                                    </div>
                                    {/* Price & Action (wraps on small screens) */}
                                    <div className="flex flex-col items-end justify-start flex-[1_1_140px] order-3 md:order-4 min-w-[140px]">
                                        <div className="flex items-center gap-1 font-semibold text-base md:text-lg flex-wrap">
                                            <span className="whitespace-nowrap">{request.estimatedPrice ? `${request.estimatedPrice} ${t.currency}` : t.priceNotSpecified}</span>
                                            <span title={t.priceDisclaimer} className="text-[#724C9D] cursor-help select-none">ⓘ</span>
                                        </div>
                                        <div className="text-[10px] text-gray-500 leading-tight mt-1 mb-2 max-w-[200px] text-right md:text-right break-words">{t.priceDisclaimer}</div>
                                        {this.props.session.status === 'authenticated' && this.props.session.data.user.roles.includes('User') && (
                                            <Link href={`/delivery/request/${request.id}`} className='w-full flex justify-end mt-auto'>
                                                <button className="w-full md:w-[200px] px-6 py-2 rounded-lg font-semibold bg-[#724C9D] text-white hover:bg-[#5d3b80] transition-colors text-sm">{t.buttons.select || t.buttons.details}</button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );})
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
const RequestListWithSession = withSession(RequestListPage);
const RequestListWrapper = (props: any) => {
    const { messages } = useI18n();
    const t = messages.requestList;
    return <RequestListWithSession {...props} t={t} />;
};

export default RequestListWrapper;