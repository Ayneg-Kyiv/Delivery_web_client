'use client';

import React, { Component } from 'react';
import { ApiClient } from '../api-client';
import Image from 'next/image';
import Link from 'next/link';

class News extends Component<NewsProps, NewsState> {
    constructor(props: NewsProps) {
        super(props);
        this.state = {
            currentPage: 1,
            totalPages: 1,
            batchSize: 1,
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
        let response = await ApiClient.get<any>(`/article/list/?pageNumber=${this.state.currentPage}&pageSize=${this.state.batchSize}`)
        
        let articles = response.data.data;
        this.setState({ articles: articles, totalPages: response.data.pagination.totalPages });
    }

    async getNewBatch(pageNumber: number, batchSize: number): Promise<void> {
        let response = await ApiClient.get<any>(`/article/list/?pageNumber=${pageNumber}&pageSize=${batchSize}`)
        
        let articles = response.data.data;

        this.setState({ articles: articles, totalPages: response.data.pagination.totalPages });
    }

    render() {
        return (
            <div>
                <Image
                    src='/NewsImg.png'
                    alt='News'
                    width={1280}
                    height={720}
                    className='flex-1 w-full h-full object-cover'
                />
                <div className='flex-1 flex-col w-full flex py-20 sm:px-8 md:px-20 lg:px-40'>
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

                    {this.state.articles.map((item, index) => (
                        <Link href={`/article/?id=${item.id}`} key={index} className='mt-20'>
                            <div className='rounded-xl flex flex-row h-[345px] bg-darker'>
                                <Image
                                    src={(process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + item.imagePath || '/dummy.png'}
                                    alt={item.title}
                                    width={200}
                                height={100}
                                className='rounded-l-xl w-[30%] object-cover'
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