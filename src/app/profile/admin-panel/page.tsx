'use client';

import React from "react";
import { useSession } from "next-auth/react";
import { ApiClient } from "@/app/api-client";
import Image from "next/image";
import Link from "next/link";

// HOC to inject session into class components
const withSession = (Component: React.ComponentType<any>) => (props: any) => {
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

// Example usage with a class component
class AdminPanelPage extends React.Component<AdminPanelProps, AdminPanelState> {

    constructor(props: AdminPanelProps) {
        super(props);
        this.state = {
            mode: 'dashboard',
            
            userPanel: {
                ifPanelOpen: false,
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

    render() {

        // Your render logic here...
        return (
                <div className="flex-1 flex flex-col px-8 md:px:10 lg:px-[190px] py-10">
                    <div className="flex-1 flex flex-row bg-darker rounded-lg border border-line border items-center px-8 py-10 mb-10 font-bold">
                        <div className="flex-1 flex flex-col gap-2">
                            <h1 className="text-5xl">Адміністративна панель</h1>
                            <p className="text-2xl">Керування платформою</p>
                        </div>

                        <div className="flex-1 flex justify-end">

                        </div>
                    </div>
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
                                    className='px-6 py-4 bg-default rounded-lg text-2xl w-full md:w-[320px]'>
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
                                                    className='flex-1 w-full px-4 py-2 bg-lighter rounded-lg'>Редагувати</Link>
                                                <button onClick={async() => await this.deleteArticle(item.id)} 
                                                    className='flex-1 px-4 py-2 bg-lighter rounded-lg'>Видалити</button>
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
                </div>
        );
    }
}

export default withSession(AdminPanelPage);
