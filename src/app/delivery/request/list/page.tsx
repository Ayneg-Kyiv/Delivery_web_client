'use client';

import React from 'react';
import { ApiClient } from '@/app/api-client';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
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

// HOC to inject i18n messages into class components
const withI18n = (Component: React.ComponentType<any>) => {
    const WrappedComponent = (props: any) => {
        const { messages: t } = useI18n();
        return <Component t={t} {...props} />;
    };
    WrappedComponent.displayName = `withI18n(${Component.displayName || Component.name || 'Component'})`;
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

        const res = await ApiClient.get<any>(`/request?${params.toString()}`);

        console.log(res);


        this.setState({
            requests: res.data.data || [],
            totalPages: res.data.pagination?.totalPages || 1,
            loading: false,
        });
    }

    async fetchLocations() {
        const res = await ApiClient.get<any>(`/trip/locations/unique`);

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
        const t = this.props.t?.requestList;
        return (
            <div className='w-full relative '>
                <div className="h-[600px] md:h-[500px] bg-[url('/Rectangle47.png')] z-0 bg-cover bg-[50%_50%] relative top-0 left-0">
                    <div className="w-full h-[600px] md:h-[500px] bg-[#00000099]">
                    <div className="flex flex-col justify-center items-center absolute top-0 left-0 right-0 z-10 h-[500px] px-8 md:px-10 lg:px-20">
                        <h1 className="pt-18 text-2xl md:text-4xl font-bold mb-4">{t?.heroTitle}</h1>
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
                                <option value="">{t?.filters.from}</option>
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
                                <option value="">{t?.filters.to}</option>
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
                                <option value="">{t?.filters.size}</option>
                                <option value="XS">{t?.filters.sizes.xs}</option>
                                <option value="S">{t?.filters.sizes.s}</option>
                                <option value="M">{t?.filters.sizes.m}</option>
                                <option value="L">{t?.filters.sizes.l}</option>
                                <option value="XL">{t?.filters.sizes.xl}</option>
                                <option value="XXL">{t?.filters.sizes.xxl}</option>
                            </select>
                        </div>
                        <div className='mt-6 w-full flex flex-col md:flex-row gap-4 justify-center items-center'>
                            <button
                                className="bg-[#7c3aed] button-type-1 py-4 w-full md:w-[252px] rounded-lg font-bold"
                                onClick={() => this.fetchRequests(1)}
                            >
                                {t?.buttons.find}
                            </button>
                            {
                                this.props.session.status === 'authenticated' && this.props.session.data.user.roles.includes('User') &&
                                (
                                    <Link href={'/delivery/request/add'} className="md:ml-6 bg-white button-type-1 py-4 w-full md:w-[252px] rounded-lg font-bold flex items-center justify-center">
                                        {t?.buttons.create}
                                    </Link>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
                <div className='w-fullflex flex-col md:flex-row gap-8 px-4 md:px-10 lg:px-20 py-10 w-full'>
                    {/* Requests List */}
                    <div className="w-fullflex flex-col gap-6">
                        {loading ? (
                            <div className="text-white text-center py-20">{t?.loading}</div>
                        ) : requests.length === 0 ? (
                            <div className="text-white text-center py-20">{t?.empty}</div>
                        ) : (
                            requests.map(request => (
                                <div key={request.id} className="bg-[#2d1857] w-full rounded-xl flex flex-col md:flex-row items-center mb-10 p-6 shadow-lg">
                                    <div className=" flex flex-col items-center justify-center mr-6 pb-10 md:pb-0">
                                        <Image
                                            src={request.sender?.imagePath ? (process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + request.sender.imagePath : '/dummy.png'}
                                            alt={request.sender?.name || request.senderName}
                                            width={80}
                                            height={80}
                                            className="rounded-full object-cover"
                                        />
                                        <span className="text-white text-xs mt-2">{request.sender?.name || request.senderName}</span>
                                        {request.sender?.rating && (
                                            <span className="text-yellow-400">★ {request.sender.rating.toFixed(1)}</span>
                                        )}
                                    </div>
                                    
                                    <div className="w-full pb-10 md:pb-0 flex-1 flex flex-col md:px-6">
                                        <div className="flex gap-2 items-center text-white text-lg font-bold">
                                            {request.startLocation.city} - {request.endLocation.city}
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-4 text-white mt-2">
                                            <span>
                                                {t?.labels.departure}: {request.startLocation.dateTime}
                                            </span>
                                            <span>
                                                {t?.labels.arrival}: {request.endLocation.dateTime}
                                            </span>
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-2 items-start text-white mt-2">
                                            <span>{t?.labels.sender}: {request.senderName}</span>
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-2 items-start text-white mt-2">
                                            <span>{t?.labels.cargo}: {request.objectName}</span>
                                            <span>{t?.labels.type}: {request.cargoSlotType}</span>
                                            <span>{t?.labels.weight}: {request.objectWeight} {t?.labels.kg}</span>
                                        </div>
                                        {request.objectDescription && (
                                            <div className="text-white mt-2">{t?.labels.description}: {request.objectDescription}</div>
                                        )}
                                        {request.comment && (
                                            <div className="text-white mt-2">{t?.labels.comment}: {request.comment}</div>
                                        )}
                                    </div>
                                    <div className="w-full md:w-[30%] flex flex-col items-end gap-2">
                                        <div className="w-full bg-[#7c3aed] text-white px-4 py-2 rounded-lg font-bold text-xl">
                                            {request.estimatedPrice ? `${request.estimatedPrice} ${t?.currency}` : t?.priceNotSpecified}
                                        </div>
                                        {this.props.session.status === 'authenticated' && this.props.session.data.user.roles.includes('User') && (
                                            <Link href={`/delivery/request/${request.id}`} className='w-full'>
                                                <button className="w-full bg-white text-[#7c3aed] px-6 py-2 rounded-lg font-bold mt-2">{t?.buttons.details}</button>
                                            </Link>
                                        )}
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
export default withI18n(withSession(RequestListPage));