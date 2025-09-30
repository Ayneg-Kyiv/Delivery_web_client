'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ApiClient } from '../api-client';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

interface Article {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    imagePath: string;
}

const NewsPage: React.FC = () => {
    const { messages: t, language } = useI18n();
    const [authors, setAuthors] = useState<(string | null)[]>([]);
    const [categories, setCategories] = useState<(string | null)[]>([]);
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isAuthorOpen, setIsAuthorOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [articles, setArticles] = useState<Article[]>([]);
    const batchSize = 10;

    const getNewBatch = useCallback(async (pageNumber: number, author: string, category: string) => {
        try {
            const response = await ApiClient.get<any>(`/article/list/?author=${author}&category=${category}&pageNumber=${pageNumber}&pageSize=${batchSize}`);
            const articlesData = response.data.data;
            setArticles(articlesData);
            setTotalPages(response.data.pagination.totalPages);
            setCurrentPage(pageNumber);
        } catch (error) {
            console.error("Failed to fetch articles", error);
        }
    }, [batchSize]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const searchParams = await ApiClient.get<any>('Article/search-params');
                setAuthors([null, ...searchParams.data.authors]);
                setCategories([null, ...searchParams.data.categories]);
                getNewBatch(1, '', '');
            } catch (error) {
                console.error("Failed to fetch search params", error);
            }
        };
        fetchInitialData();
    }, [getNewBatch]);

    useEffect(() => {
        getNewBatch(1, selectedAuthor, selectedCategory);
    }, [selectedAuthor, selectedCategory, getNewBatch]);

    const handlePageChange = (page: number) => {
        getNewBatch(page, selectedAuthor, selectedCategory);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString(language);
    };

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
                    <Link href='/' className=' hover:underline pr-4'>{t.newsPage.main}</Link>
                    <p> {' > '} </p>
                    <Link href='/news' className='pl-4 hover:underline'>{t.newsPage.news}</Link>
                </div>
                
                <h2 className="[font-family:'Bahnschrift-Regular',Helvetica] text-5xl pt-10">
                    {t.newsPage.title}
                </h2>

                {articles.length > 0 && (
                    <p className='pt-4'>
                        {t.newsPage.lastUpdated.replace('{date}', formatDate(articles[0].createdAt))}
                    </p>
                )}

                <p className="[font-family:'Inter-Regular',Helvetica] fg-secondary text-xl max-w-[1020px] pt-4 mb-8">
                    {t.newsPage.subtitle}
                </p>

                <div className="flex flex-col md:flex-row gap-2 md:gap-8 mb-2 md:mb-8">
                    {/* Author Filter */}
                    <div className='relative flex-1 flex rounded-lg py-4 px-4 bg-lighter text-2xl justify-between items-center custom-select'>
                        <div onClick={() => setIsAuthorOpen(!isAuthorOpen)} className='flex justify-between w-full cursor-pointer'>
                            <div>{selectedAuthor || t.newsPage.allAuthors}</div>
                            <div>{isAuthorOpen ? '▲' : '▼'}</div>
                        </div>
                        {isAuthorOpen && (
                            <div className="absolute left-0 right-0 top-0 pt-1 bg-lighter rounded-lg z-10 overflow-auto shadow-lg">
                                {authors.map((option, idx) => (
                                    <div
                                        key={idx}
                                        className="px-4 py-3 hover:bg-[#3d2a5a] flex justify-between cursor-pointer transition-colors"
                                        onClick={() => { setSelectedAuthor(option || ''); setIsAuthorOpen(false); }}
                                    >
                                        <div>{option || t.newsPage.allAuthors}</div>
                                        {idx === 0 && <div>{'▲'}</div>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Category Filter */}
                    <div className='relative flex-1 flex rounded-lg py-4 px-4 bg-lighter text-2xl justify-between items-center custom-select'>
                        <div onClick={() => setIsCategoryOpen(!isCategoryOpen)} className='flex justify-between w-full cursor-pointer'>
                            <div>{selectedCategory || t.newsPage.allCategories}</div>
                            <div>{isCategoryOpen ? '▲' : '▼'}</div>
                        </div>
                        {isCategoryOpen && (
                            <div className="absolute left-0 right-0 top-0 pt-1 bg-lighter rounded-lg z-10 max-h-60 overflow-auto shadow-lg">
                                {categories.map((option, idx) => (
                                    <div
                                        key={idx}
                                        className="px-4 py-3 hover:bg-[#3d2a5a] flex justify-between cursor-pointer transition-colors"
                                        onClick={() => { setSelectedCategory(option || ''); setIsCategoryOpen(false); }}
                                    >
                                        <div>{option || t.newsPage.allCategories}</div>
                                        {idx === 0 && <div>{'▲'}</div>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {articles.map((item) => (
                    <Link href={`/article/?id=${item.id}`} key={item.id} className='mt-20'>
                        <div className='rounded-xl flex flex-col md:flex-row md:h-[345px] bg-darker'>
                            <Image
                                src={`${process.env.NEXT_PUBLIC_FILES_URL || ''}/${item.imagePath}` || '/dummy.png'}
                                alt={item.title}
                                width={200}
                                height={100}
                                className='rounded-l-xl w-full md:w-[30%] object-cover'
                            />
                            <div className='sm:w-[5px] md:w-[5%] lg:w-[10%]'></div>
                            <div className='flex-1 p-4 flex flex-col items-start justify-center'>
                                <h3 className='text-5xl font-bold pb-8'>{item.title}</h3>
                                <p className='text-xl'>{item.content}</p>
                                <p className='pt-4 text-l'>{t.newsPage.published.replace('{date}', formatDate(item.createdAt))}</p>
                            </div>
                        </div>
                    </Link>
                ))}

                {totalPages > 1 && (
                    <div className='flex justify-center items-center mt-10 gap-2 text-lg '>
                        <button
                            className='px-4 py-2 bg-lighter rounded-lg disabled:bg-darker disabled:cursor-not-allowed'
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                        >
                            1
                        </button>
                        
                        {currentPage > 2 && (
                            <button
                                className='px-4 py-2 bg-lighter rounded-lg'
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                {currentPage - 1}
                            </button>
                        )}
                        
                        {currentPage > 1 && currentPage < totalPages && (
                             <span className='px-6 py-2 bg-lighter rounded-lg'>
                                {currentPage}
                            </span>
                        )}
                        
                        {currentPage < totalPages -1 && (
                            <button
                                className='px-4 py-2 bg-lighter rounded-lg'
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                {currentPage + 1}
                            </button>
                        )}
                        
                        <button
                            className='px-4 py-2 bg-lighter rounded-lg disabled:bg-darker disabled:cursor-not-allowed'
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            {totalPages}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsPage;