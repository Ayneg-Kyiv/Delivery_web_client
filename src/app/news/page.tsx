'use client';

import React, { Component } from 'react';
import { ApiClient } from '../api-client';
import Image from 'next/image';
import Link from 'next/link';

class News extends Component<NewsProps, NewsState> {
    constructor(props: NewsProps) {
        super(props);
        this.state = {
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
        };
    }

    async componentDidMount(): Promise<void> {

        const searchParams = await ApiClient.get<any>('Article/search-params');
        
        this.setState({ 
            authors: [null, ...searchParams.data.authors], 
            categories: [null, ...searchParams.data.categories] 
        });

        const response = await ApiClient.get<any>(`/article/list/?pageNumber=${this.state.currentPage}&pageSize=${this.state.batchSize}`)

        const articles = response.data.data;

        this.setState({ articles: articles, totalPages: response.data.pagination.totalPages });
    }

    async componentDidUpdate(prevProps: NewsProps, prevState: NewsState): Promise<void> {
        if (prevState.selectedAuthor !== this.state.selectedAuthor || prevState.selectedCategory !== this.state.selectedCategory) {
            this.getNewBatch(1, this.state.batchSize);
        }
    }

    async getNewBatch(pageNumber: number, batchSize: number): Promise<void> {
        const response = await ApiClient.get<any>(`/article/list/?author=${this.state.selectedAuthor}&category=${this.state.selectedCategory}&pageNumber=${pageNumber}&pageSize=${batchSize}`)
        
        const articles = response.data.data;

        this.setState({ articles: articles, totalPages: response.data.pagination.totalPages });
    }

    render() {
        return (
            <div className='flex flex-col w-full h-full'>
                <Image
                    src='/NewsImg.png'
                    alt='News'
                    width={1280}
                    height={720}
                    className='flex-1 w-full h-full object-cover'
                />
                <div className='flex-1 flex-col w-full flex py-20 px-8 md:px-20 lg:px-40'>
                    <div className='flex-1 w-full flex flex-row'>
                        <Link href='/' className=' hover:underline pr-4'>Головна</Link>
                        <p> {' > '} </p>
                        <Link href='/news' className='pl-4 hover:underline'>Новини</Link>
                    </div>
                    
                    <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-5xl pt-10">
                        Новини та оновлення
                    </h2>

                    <p className='pt-4'>
                        Останнє оновлення { this.state.articles[0].createdAt }
                    </p>

                    <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl max-w-[1020px] pt-4 mb-8">
                        Тут ви знайдете останні новини, оновлення сервісу та корисні поради щодо доставки.
                        Слідкуйте за змінами, щоб бути в курсі нових можливостей та акцій на платформі Cargix.
                    </p>

                    <div className="flex flex-col md:flex-row gap-2 md:gap-8 mb-2 md:mb-8">
                        {/* Author Filter */}
                        <div className='relative flex-1 flex rounded-lg py-4 px-4 bg-lighter text-2xl justify-between items-center custom-select'>
                            
                            <div onClick={() => this.setState({ isAuthorOpen: !this.state.isAuthorOpen })} className='flex justify-between w-full cursor-pointer'>
                                <div>{this.state.selectedAuthor || 'Всі автори'}</div>
                                <div>{this.state.isAuthorOpen ? '▲' : '▼'}</div>
                            </div>

                            {this.state.isAuthorOpen && (
                                <div className="absolute left-0 right-0 top-0 pt-1  bg-lighter rounded-lg z-10 overflow-auto shadow-lg">
                                    {this.state.authors.map((option, idx) => (
                                        <div
                                            key={idx}
                                            className="px-4 py-3 hover:bg-[#3d2a5a] flex justify-between cursor-pointer transition-colors"
                                            onClick={() => this.setState({ selectedAuthor: option || '', isAuthorOpen: false })}
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
                        <div className='relative flex-1 flex rounded-lg py-4 px-4 bg-lighter text-2xl justify-between items-center custom-select'>
                            <div onClick={() => this.setState({ isCategoryOpen: !this.state.isCategoryOpen })} className='flex justify-between w-full cursor-pointer'>
                                <div>{this.state.selectedCategory || 'Всі категорії'}</div>
                                <div>{'▼'}</div>
                            </div>

                            {this.state.isCategoryOpen && (
                                <div className="absolute left-0 right-0 top-0 pt-1 bg-lighter rounded-lg z-10 max-h-60 overflow-auto shadow-lg">
                                    {this.state.categories.map((option, idx) => (
                                        <div
                                            key={idx}
                                            className="px-4 py-3 hover:bg-[#3d2a5a] flex justify-between cursor-pointer transition-colors"
                                            onClick={() => this.setState({ selectedCategory: option || '', isCategoryOpen: false })}
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

                    {this.state.articles.map((item, index) => (
                        <Link href={`/article/?id=${item.id}`} key={index} className='mt-20'>
                            <div className='rounded-xl flex flex-col md:flex-row md:h-[345px] bg-darker'>
                                <Image
                                    src={(process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + item.imagePath || '/dummy.png'}
                                    alt={item.title}
                                    width={200}
                                height={100}
                                className='rounded-l-xl w-full md:w-[30%] object-cover'
                            />
                                <div className='sm:w-[5px] md:w-[5%] lg:w-[10%]'></div>
                                <div className='flex-1 p-4 flex flex-col items-start justify-center'>
                                    <h3 className='text-5xl font-bold pb-8'>{item.title}</h3>
                                    <p className='text-xl'>{item.content}</p>
                                    <p className='pt-4 text-l'>Опубліковано: {item.createdAt}</p>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {
                        this.state.totalPages > 1 && (
                            <div className='flex justify-center items-center mt-10 gap-2 text-lg '>
                                {/* First page */}
                                <button
                                    className='px-4 py-2 bg-lighter rounded-lg disabled:bg-darker disabled:cursor-not-allowed'
                                    onClick={() => {
                                        this.getNewBatch(1, this.state.batchSize);
                                        this.setState({ currentPage: 1 });
                                    }}
                                    disabled={this.state.currentPage === 1}
                                >
                                    1
                                </button>
                                
                                {/* Previous page */}
                                {this.state.currentPage !== 1 && this.state.currentPage !== 2 && (
                                    <button
                                        className='px-4 py-2 bg-lighter rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed'
                                        onClick={() => {
                                            const prevPage = Math.max(1, this.state.currentPage - 1);
                                            this.getNewBatch(prevPage, this.state.batchSize);
                                            this.setState({ currentPage: prevPage });
                                        }}
                                        disabled={this.state.currentPage === 1}
                                    >
                                        {this.state.currentPage - 1}
                                    </button>
                                )}
                                
                                {/* Current page indicator */}
                                <span className='px-6 py-2 bg-lighter rounded-lg'>
                                    {this.state.currentPage}
                                </span>
                                
                                {/* Next page */}
                                { this.state.currentPage !== this.state.totalPages && this.state.currentPage !== this.state.totalPages - 1 && (
                                    <button
                                        className='px-4 py-2 bg-lighter rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed '
                                        onClick={() => {
                                            const nextPage = Math.min(this.state.totalPages, this.state.currentPage + 1);
                                            this.getNewBatch(nextPage, this.state.batchSize);
                                            this.setState({ currentPage: nextPage });
                                        }}
                                        disabled={this.state.currentPage === this.state.totalPages}
                                    >
                                        {this.state.currentPage + 1}
                                    </button>
                                )}
                                
                                {/* Last page */}
                                <button
                                    className='px-4 py-2 bg-lighter rounded-lg disabled:bg-darker disabled:cursor-not-allowed'
                                    onClick={() => {
                                        this.getNewBatch(this.state.totalPages, this.state.batchSize);
                                        this.setState({ currentPage: this.state.totalPages });
                                    }}
                                    disabled={this.state.currentPage === this.state.totalPages}
                                >
                                    {this.state.totalPages}
                                </button>
                            </div>
                        )
                    }

                </div>
            </div>
        );
    }
}

export default News;