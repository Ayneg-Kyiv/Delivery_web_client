'use client';

import React from "react";
import { useSession } from "next-auth/react";
import { ApiClient } from "@/app/api-client";
import Image from "next/image";
import Link from "next/link";

// HOC to inject session into class components
const withSession = (Component: React.ComponentType<any>) => {
    const WrappedComponent = (props: any) => {
        const session = useSession();

        if( session.status === 'loading' ) {
            return <div>Loading...</div>;
        }

        if( session.status === 'unauthenticated' ) {
            location.href = '/signin';
        }

        if( session.status === 'authenticated' && !session.data.user.roles.includes('Admin') ) {
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

// Example usage with a class component
class AdminPanelPage extends React.Component<AdminPanelProps, AdminPanelState> {

    constructor(props: AdminPanelProps) {
        super(props);
        this.state = {
            mode: 'dashboard',
            
            userPanel: {
                ifPanelOpen: false,

                totalUsers: 0,
                totalDrivers: 0,
                activeOrders: 0,

                users: [{
                    id: '',
                    name: ''
                }],
                currentPage: 1,
                totalPages: 1,
                batchSize: 10
            },

            driverApplicationPanel: {
                ifPanelOpen: false,

                totalApplications: 0,
                
                applications: [],
                
                currentPage: 0,
                totalPages: 0,
                batchSize: 0
            },

            articlePanel: {
                ifPanelOpen: false,

                totalArticles: 0,

                authors: [''],
                categories: [''],
                selectedAuthor: '',
                selectedCategory: '',
                isAuthorOpen: false,
                isCategoryOpen: false,

                currentPage: 1,
                totalPages: 1,
                batchSize: 10,
                articles: [{
                    id: '',
                    title: '',
                    content: '',
                    createdAt: '',
                    imagePath: ''
                }],
            }
        };
    }

    async componentDidMount(): Promise<void> {
            const searchParams = await ApiClient.get<any>('Article/search-params');
            
            this.setState({
                articlePanel: {
                    ...this.state.articlePanel,
                    authors: [null, ...searchParams.data.authors],
                    categories: [null, ...searchParams.data.categories]
                }
            });

            const response = await ApiClient.get<any>(`/article/list/?pageNumber=${this.state.articlePanel.currentPage}&pageSize=${this.state.articlePanel.batchSize}`)

            const articles = response.data.data;

            this.setState({ articlePanel: { ...this.state.articlePanel, articles: articles, totalPages: response.data.pagination.totalPages, totalArticles: response.data.pagination.totalCount } });

            const statsResponse = await ApiClient.get<any>('/admin/panel-data');

            this.setState({
                userPanel: {
                    ...this.state.userPanel,
                    totalUsers: statsResponse.data.usersCount,
                    totalDrivers: statsResponse.data.driversCount,
                    activeOrders: statsResponse.data.totalTrips
                }
            });

            const driverAppsResponse = await ApiClient.get<any>(`/admin/driver-applications/?pageNumber=1&pageSize=10`);

            console.log(driverAppsResponse);

            const totalApplications = driverAppsResponse.data.pagination.totalCount;
            const applications = driverAppsResponse.data.data;
            const currentPage = driverAppsResponse.data.pagination.pageNumber;
            const totalPages = driverAppsResponse.data.pagination.totalPages;
            const batchSize = driverAppsResponse.data.pagination.pageSize;

            const driverPanel = this.state.driverApplicationPanel;

            driverPanel.totalApplications = totalApplications;
            driverPanel.applications = applications;
            driverPanel.currentPage = currentPage;
            driverPanel.totalPages = totalPages;
            driverPanel.batchSize = batchSize;
            if( driverAppsResponse.success ) {
                this.setState({
                    driverApplicationPanel: { ...driverPanel }
                });
            }

            console.log(this.state.driverApplicationPanel);

    }

    async componentDidUpdate(prevProps: Readonly<AdminPanelProps>, prevState: Readonly<AdminPanelState>): Promise<void> {
        if (
            prevState.articlePanel.selectedAuthor !== this.state.articlePanel.selectedAuthor ||
            prevState.articlePanel.selectedCategory !== this.state.articlePanel.selectedCategory 
        ) {
            this.getNewBatch(1, this.state.articlePanel.batchSize);
            this.setState({ articlePanel: { ...this.state.articlePanel} });
        }
    }

    async getNewBatch(pageNumber: number, batchSize: number): Promise<void> {
        const response = await ApiClient.get<any>(`/article/list/?author=${this.state.articlePanel.selectedAuthor}&category=${this.state.articlePanel.selectedCategory}&pageNumber=${pageNumber}&pageSize=${batchSize}`)

        const articles = response.data.data;

        this.setState({ articlePanel: { ...this.state.articlePanel, articles: articles, totalPages: response.data.pagination.totalPages } });
    }

    async deleteArticle(articleId: string): Promise<void> {
        try {
            const response = await ApiClient.delete<any>(`/article/delete/${articleId}`);

            if( response.success ) {

                const updatedArticles = this.state.articlePanel.articles.filter(article => article.id !== articleId);
                
                this.setState({
                    articlePanel: {
                        ...this.state.articlePanel,
                        articles: updatedArticles
                    }
                });
            }
        } catch (error) {
            console.error("Error deleting article:", error);
        }
    }

    dashboardPanelRender () {
        return (
            <div className="flex flex-col justify-center  rounded-lg text-4xl">
                <div className="flex flex-col justify-between md:flex-row gap-6">
                    <div className="flex-1 flex flex-col rounded-lg border border-line justify-between items-start bg-darker p-4">
                        <div className="text-2xl">Статті</div>
                        <div className="pt-2 text-4xl">{this.state.articlePanel.totalArticles}</div>
                    </div>
                    <div className="flex-1 flex flex-col rounded-lg border border-line justify-between items-start bg-darker p-4">
                        <div className="text-2xl">Користувачі</div>
                        <div className="pt-2 text-4xl">{this.state.userPanel.totalUsers}</div>
                    </div>
                    <div className="flex-1 flex flex-col rounded-lg border border-line justify-between items-start bg-darker p-4">
                        <div className="text-2xl">Водіїв</div>
                        <div className="pt-2 text-4xl">{this.state.driverApplicationPanel.totalApplications}</div>
                    </div>
                    <div className="flex-1 flex flex-col rounded-lg border border-line justify-between items-start bg-darker p-4">
                        <div className="text-2xl">Активні замовлення</div>
                        <div className="pt-2 text-4xl">{this.state.userPanel.activeOrders}</div>
                    </div>
                </div>
            </div>
        );
    }

    driverApplicationsPanelRender () {
        return (
            <div className="flex-1 bg-lighter flex py-10 rounded-lg">
                <div className="flex-1 flex-col w-full flex py-10 px-8">
                    <h2 className="text-3xl font-bold mb-8">Заявки водіїв</h2>
                    {this.state.driverApplicationPanel.applications.length === 0 ? (
                        <div className="text-xl">Немає заявок</div>
                    ) : (
                        this.state.driverApplicationPanel.applications.map((app, idx: number) => (
                            <div key={app.id || idx} className="mt-10 flex flex-col bg-darker rounded-xl p-8">
                                <div className="flex-1 flex flex-col md:flex-row ">
                                    <div className="flex-1 flex flex-row  flex flex-col items-start justify-center">
                                        <div className="flex flex-col justify-start gap-4">
                                            <div className="flex flex-col gap-2">
                                                <p className="text-lg">Адреса електронної пошти:</p>
                                                <p className="text-lg">{app.email}</p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <p className="text-lg">Тип транспортного засобу:</p>
                                                <p className="text-lg">{app.vehicle?.type}</p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <p className="text-lg">Бренд:</p>
                                                <p className="text-lg">{app.vehicle?.brand}</p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <p className="text-lg">Модель:</p>
                                                <p className="text-lg">{app.vehicle?.model}</p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <p className="text-lg">Номерний знак:</p>
                                                <p className="text-lg">{app.vehicle?.numberPlate}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col pl-8">
                                            <div className="flex flex-row gap-2">
                                                <div className="flex-1 flex flex-col items-center gap-2 mt-2">
                                                    <span className="text-lg">Фото водійських прав:</span>
                                                    {app.driverLicenseImagePath ? (
                                                        <Image
                                                            src={(process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + app.driverLicenseImagePath}
                                                            alt="Driver License"
                                                            width={120}
                                                            height={80}
                                                            className="rounded border h-[100px] w-[120px] border-line object-cover hoover:scale-105 transition-transform"
                                                        />
                                                    ) : (
                                                        <span className="text-lg">N/A</span>
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col items-center gap-2 mt-2">
                                                    <span className="text-lg">Фото профілю водія:</span>
                                                    {app.imagePath   ? (
                                                        <Image
                                                            src={(process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + app.imagePath}
                                                            alt="Driver Profile"
                                                            width={120}
                                                            height={80}
                                                            className="rounded border h-[100px] w-[120px] border-line object-cover hoover:scale-105 transition-transform"
                                                        />
                                                    ) : (
                                                        <span className="text-lg">N/A</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-row gap-2 mt-6">
                                                <div className="flex-1 flex flex-col items-center gap-2 mt-2">
                                                    <span className="text-lg">Фото авто (спереду):</span>
                                                    {app.vehicle?.imagePath ? (
                                                        <Image
                                                            src={(process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + app.vehicle.imagePath}
                                                            alt="Front of Vehicle"
                                                            width={120}
                                                            height={80}
                                                            className="rounded border h-[100px] w-[120px] border-line object-cover hoover:scale-200 transition-transform"
                                                        />
                                                    ) : (
                                                        <span className="text-lg">N/A</span>
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col items-center gap-2 mt-2">
                                                    <span className="text-lg">Фото авто (ззаду):</span>
                                                    {app.vehicle?.imagePathBack ? (
                                                        <Image
                                                            src={(process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + app.vehicle.imagePathBack}
                                                            alt="Back of Vehicle"
                                                            width={120}
                                                            height={80}
                                                            className="rounded border h-[100px] w-[120px] border-line object-cover hoover:scale-105 transition-transform"
                                                        />
                                                    ) : (
                                                        <span className="text-lg">N/A</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-6 w-full">
                                    <button
                                        className="flex-1 px-4 py-2 button-type-2 rounded-lg bg-green-600 text-white"
                                        onClick={async () => {
                                            await ApiClient.post(`/admin/approve-driver-application/${app.id}`);
                                            this.setState({
                                                driverApplicationPanel: {
                                                    ...this.state.driverApplicationPanel,
                                                    applications: this.state.driverApplicationPanel.applications.filter((a) => a.id !== app.id)
                                                }
                                            });
                                        }}
                                    >
                                        Підтвердити
                                    </button>
                                    <button
                                        className="flex-1 px-4 py-2 button-type-2 rounded-lg bg-red-600 text-white"
                                        onClick={async () => {
                                            await ApiClient.post(`/admin/reject-driver-application/${app.id}`);
                                            this.setState({
                                                driverApplicationPanel: {
                                                    ...this.state.driverApplicationPanel,
                                                    applications: this.state.driverApplicationPanel.applications.filter((a) => a.id !== app.id)
                                                }
                                            });
                                        }}
                                    >
                                    Відхилити
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                    {this.state.driverApplicationPanel.totalPages > 1 && (
                        <div className="flex justify-center items-center mt-10 gap-2 text-lg">
                            <button
                                className="px-4 py-2 bg-lighter rounded-lg disabled:bg-darker disabled:cursor-not-allowed"
                                onClick={async () => {
                                    const response = await ApiClient.get<any>(`/admin/driver-applications/?pageNumber=1&pageSize=${this.state.driverApplicationPanel.batchSize}`);
                                    this.setState({
                                        driverApplicationPanel: {
                                            ...this.state.driverApplicationPanel,
                                            applications: response.data.data,
                                            currentPage: 1
                                        }
                                    });
                                }}
                                disabled={this.state.driverApplicationPanel.currentPage === 1}
                            >
                                1
                            </button>
                            {this.state.driverApplicationPanel.currentPage !== 1 && this.state.driverApplicationPanel.currentPage !== 2 && (
                                <button
                                    className="px-4 py-2 bg-default rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    onClick={async () => {
                                        const prevPage = Math.max(1, this.state.driverApplicationPanel.currentPage - 1);
                                        const response = await ApiClient.get<any>(`/admin/driver-applications/?pageNumber=${prevPage}&pageSize=${this.state.driverApplicationPanel.batchSize}`);
                                        this.setState({
                                            driverApplicationPanel: {
                                                ...this.state.driverApplicationPanel,
                                                applications: response.data.data,
                                                currentPage: prevPage
                                            }
                                        });
                                    }}
                                    disabled={this.state.driverApplicationPanel.currentPage === 1}
                                >
                                    {this.state.driverApplicationPanel.currentPage - 1}
                                </button>
                            )}
                            <span className="px-6 py-2 bg-default rounded-lg">
                                {this.state.driverApplicationPanel.currentPage}
                            </span>
                            {this.state.driverApplicationPanel.currentPage !== this.state.driverApplicationPanel.totalPages &&
                                this.state.driverApplicationPanel.currentPage !== this.state.driverApplicationPanel.totalPages - 1 && (
                                    <button
                                        className="px-4 py-2 bg-default rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        onClick={async () => {
                                            const nextPage = Math.min(this.state.driverApplicationPanel.totalPages, this.state.driverApplicationPanel.currentPage + 1);
                                            const response = await ApiClient.get<any>(`/admin/driver-applications/?pageNumber=${nextPage}&pageSize=${this.state.driverApplicationPanel.batchSize}`);
                                            this.setState({
                                                driverApplicationPanel: {
                                                    ...this.state.driverApplicationPanel,
                                                    applications: response.data.data,
                                                    currentPage: nextPage
                                                }
                                            });
                                        }}
                                        disabled={this.state.driverApplicationPanel.currentPage === this.state.driverApplicationPanel.totalPages}
                                    >
                                        {this.state.driverApplicationPanel.currentPage + 1}
                                    </button>
                                )}
                            <button
                                className="px-4 py-2 bg-default rounded-lg disabled:bg-darker disabled:cursor-not-allowed"
                                onClick={async () => {
                                    const response = await ApiClient.get<any>(`/admin/driver-applications/?pageNumber=${this.state.driverApplicationPanel.totalPages}&pageSize=${this.state.driverApplicationPanel.batchSize}`);
                                    this.setState({
                                        driverApplicationPanel: {
                                            ...this.state.driverApplicationPanel,
                                            applications: response.data.data,
                                            currentPage: this.state.driverApplicationPanel.totalPages
                                        }
                                    });
                                }}
                                disabled={this.state.driverApplicationPanel.currentPage === this.state.driverApplicationPanel.totalPages}
                            >
                                {this.state.driverApplicationPanel.totalPages}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    articlesPanelRender () {
        return (
                    <div className="flex-1 bg-lighter flex py-10 rounded-lg">
                        <div className='flex-1 flex-col w-full flex py-10 px-8'>

                            <div className="flex flex-col md:flex-row gap-2 md:gap-8 mb-2 md:mb-8">
                                {/* Author Filter */}
                                <div className='relative flex-1 flex rounded-lg py-4 px-4 bg-default text-2xl justify-between items-center custom-select'>

                                    <div onClick={() => this.setState({ articlePanel: { ...this.state.articlePanel, isAuthorOpen: !this.state.articlePanel.isAuthorOpen } })} className='flex justify-between w-full cursor-pointer'>
                                        <div>{this.state.articlePanel.selectedAuthor || 'Всі автори'}</div>
                                        <div>{this.state.articlePanel.isAuthorOpen ? '▲' : '▼'}</div>
                                    </div>

                                    {this.state.articlePanel.isAuthorOpen && (
                                        <div className="absolute left-0 right-0 top-0 pt-1  bg-default rounded-lg z-10 overflow-auto shadow-lg">
                                            {this.state.articlePanel.authors.map((option, idx) => (
                                                <div
                                                    key={idx}
                                                    className="px-4 py-3 hover:bg-[#3d2a5a] flex justify-between cursor-pointer transition-colors"
                                                    onClick={() => this.setState({ articlePanel: { ...this.state.articlePanel, selectedAuthor: option || '', isAuthorOpen: false } })}
                                                >
                                                    <div>{option || 'Всі автори'}</div>
                                                    {idx === 0 &&
                                                    <div>{'▲'}</div>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Category Filter */}
                                <div className='relative flex-1 flex rounded-lg py-4 px-4 bg-default text-2xl justify-between items-center custom-select'>
                                    <div onClick={() => this.setState({ articlePanel: { ...this.state.articlePanel, isCategoryOpen: !this.state.articlePanel.isCategoryOpen } })} className='flex justify-between w-full cursor-pointer'>
                                        <div>{this.state.articlePanel.selectedCategory || 'Всі категорії'}</div>
                                        <div>{'▼'}</div>
                                    </div>

                                    {this.state.articlePanel.isCategoryOpen && (
                                        <div className="absolute left-0 right-0 top-0 pt-1 bg-default rounded-lg z-10 max-h-60 overflow-auto shadow-lg">
                                            {this.state.articlePanel.categories.map((option, idx) => (
                                                <div
                                                    key={idx}
                                                    className="px-4 py-3 hover:bg-[#3d2a5a] flex justify-between cursor-pointer transition-colors"
                                                    onClick={() => this.setState({ articlePanel: { ...this.state.articlePanel, selectedCategory: option || '', isCategoryOpen: false } })}
                                                >
                                                    <div>{option || 'Всі категорії'}</div>
                                                    {idx === 0 &&
                                                    <div>{'▲'}</div>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                                <Link href={'/profile/admin-panel/article/create'}  
                                    className='px-6 py-4 bg-default rounded-lg text-2xl w-full lg:w-[320px]'>
                                        Додати статтю</Link>

                            {this.state.articlePanel.articles.map((item, index) => (
                                <div key={index} className='mt-10'>
                                    <div className='rounded-xl flex flex-col md:flex-row md:h-[345px] bg-darker'>
                                        <Image
                                            src={(process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + item.imagePath || '/dummy.png'}
                                            alt={item.title}
                                            width={200}
                                        height={100}
                                        className='rounded-l-xl w-full md:w-[30%] object-cover'
                                    />
                                        <div className='sm:w-[5px] md:w-[5%] lg:w-[8%]'></div>
                                        <div className='flex-1 p-4 lg:pr-14 flex flex-col items-start justify-center'>
                                            <h3 className='text-5xl font-bold pb-8'>{item.title}</h3>
                                            <p className='text-xl'>{item.content}</p>
                                            <p className='pt-4 text-l'>Опубліковано: {item.createdAt}</p>
                                            <div className="flex gap-4 mt-6 w-full">
                                                <Link href={'/profile/admin-panel/article/edit?articleId=' + item.id}
                                                    className='flex-1 w-full px-4 py-2 button-type-2 rounded-lg'>Редагувати</Link>
                                                <button onClick={async() => await this.deleteArticle(item.id)} 
                                                    className='flex-1 px-4 py-2 button-type-2 rounded-lg'>Видалити</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {
                                this.state.articlePanel.totalPages > 1 && (
                                    <div className='flex justify-center items-center mt-10 gap-2 text-lg '>
                                        {/* First page */}
                                        <button
                                            className='px-4 py-2 bg-lighter rounded-lg disabled:bg-darker disabled:cursor-not-allowed'
                                            onClick={() => {
                                                this.getNewBatch(1, this.state.articlePanel.batchSize);
                                                this.setState({ articlePanel: { ...this.state.articlePanel, currentPage: 1 } });
                                            }}
                                            disabled={this.state.articlePanel.currentPage === 1}
                                        >
                                            1
                                        </button>
                                        
                                        {/* Previous page */}
                                        {this.state.articlePanel.currentPage !== 1 && this.state.articlePanel.currentPage !== 2 && (
                                            <button
                                                className='px-4 py-2 bg-default rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed'
                                                onClick={() => {
                                                    const prevPage = Math.max(1, this.state.articlePanel.currentPage - 1);
                                                    this.getNewBatch(prevPage, this.state.articlePanel.batchSize);
                                                    this.setState({ articlePanel: { ...this.state.articlePanel, currentPage: prevPage } });
                                                }}
                                                disabled={this.state.articlePanel.currentPage === 1}
                                            >
                                                {this.state.articlePanel.currentPage - 1}
                                            </button>
                                        )}
                                        
                                        {/* Current page indicator */}
                                        <span className='px-6 py-2 bg-default rounded-lg'>
                                            {this.state.articlePanel.currentPage}
                                        </span>
                                        
                                        {/* Next page */}
                                        { this.state.articlePanel.currentPage !== this.state.articlePanel.totalPages && this.state.articlePanel.currentPage !== this.state.articlePanel.totalPages - 1 && (
                                            <button
                                                className='px-4 py-2 bg-default rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed '
                                                onClick={() => {
                                                    const nextPage = Math.min(this.state.articlePanel.totalPages, this.state.articlePanel.currentPage + 1);
                                                    this.getNewBatch(nextPage, this.state.articlePanel.batchSize);
                                                    this.setState({ articlePanel: { ...this.state.articlePanel, currentPage: nextPage } });
                                                }}
                                                disabled={this.state.articlePanel.currentPage === this.state.articlePanel.totalPages}
                                            >
                                                {this.state.articlePanel.currentPage + 1}
                                            </button>
                                        )}
                                        
                                        {/* Last page */}
                                        <button
                                            className='px-4 py-2 bg-default rounded-lg disabled:bg-darker disabled:cursor-not-allowed'
                                            onClick={() => {
                                                this.getNewBatch(this.state.articlePanel.totalPages, this.state.articlePanel.batchSize);
                                                this.setState({ articlePanel: { ...this.state.articlePanel, currentPage: this.state.articlePanel.totalPages } });
                                            }}
                                            disabled={this.state.articlePanel.currentPage === this.state.articlePanel.totalPages}
                                        >
                                            {this.state.articlePanel.totalPages}
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
        )
    }

    render() {

        // Your render logic here...
        return (
                <div className="flex-1 flex flex-col px-8 md:px:10 lg:px-[190px] py-10">
                    <div className=" flex flex-col lg:flex-row bg-darker rounded-lg border border-line items-between lg:items-center px-8 py-10 mb-10 font-bold">
                        <div className="w-[40%] flex flex-col gap-2 mb-6 lg:mb-0">
                            <h1 className="text-xl md:text-3xl lg:text-4xl">Адміністративна панель</h1>
                            <p className="text-lg md:text-xl lg:text-2xl">Керування платформою</p>
                        </div>

                        <div className="flex-1 flex-col md:flex-row flex justify-center md:items-end gap-6 flex-wrap">
                            <button className={`flex-1 py-2 px-4 rounded-lg border border-line border-[1px] ${this.state.mode === 'dashboard' ? 'bg-lighter' : 'button-type-3'}`}
                                onClick={() => this.setState({ mode: 'dashboard' })}>
                                Панель приладів
                            </button>
                            <button className={`flex-1 py-2 px-4  rounded-lg border border-line border-[1px] ${this.state.mode === 'users' ? 'bg-lighter' : 'button-type-3'}`} 
                                onClick={() => this.setState({ mode: 'users' })}>
                                Користувачі
                            </button>
                            <button className={`flex-1 py-2 px-4 rounded-lg border border-line border-[1px] ${this.state.mode === 'articles' ? 'bg-lighter' : 'button-type-3'}`} 
                                onClick={() => this.setState({ mode: 'articles' })}>
                                Статті
                            </button>
                            <button className={`flex-1 py-2 px-4 rounded-lg border border-line border-[1px] ${this.state.mode === 'driver-applications' ? 'bg-lighter' : 'button-type-3'}`} 
                                onClick={() => this.setState({ mode: 'driver-applications' })}>
                                Заявки водіїв
                            </button>
                        </div>
                    </div>
                    { this.state.mode === 'dashboard' && this.dashboardPanelRender() }
                    { this.state.mode === 'articles' && this.articlesPanelRender() }
                    { this.state.mode === 'driver-applications' && this.driverApplicationsPanelRender() }
                </div>
        );
    }
}

export default withSession(AdminPanelPage);
