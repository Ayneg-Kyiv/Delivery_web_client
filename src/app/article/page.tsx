'use client';

import React, { Component } from 'react';
import { ApiClient } from '@/app/api-client';
import { useSearchParams } from 'next/dist/client/components/navigation';
import Link from 'next/link';
import Image from 'next/image';

class ArticlePage extends Component<ArticlePageProps, ArticlePageState> {
    constructor(props: ArticlePageProps) {
        super(props);
        this.state = {
            loading: true,
        };
    }

    async componentDidMount() {
        try {
            const response = await ApiClient.get<any>(`/article/${this.props.id}`);
            this.setState({ article: response.data, loading: false });
        } catch (error: any) {
            this.setState({ error: error?.message || 'Failed to fetch article', loading: false });
        }
    }

    render() {
        const { loading, article, error } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

        if (!article) {
            return <div>No article found.</div>;
        }

        return (
            <div className='flex-1 flex-col w-full flex pt-8 md:pt-10 lg:pt-20 px-8 md:px-10 lg:px-20'>
                <div className='flex-1 w-full flex flex-row'>
                    <Link href='/' className=' hover:underline pr-4'>Головна</Link>
                    <p> {' > '} </p>
                    <Link href='/news' className='pl-4 hover:underline pr-4'>Новини</Link>
                    <p> {' > '} </p>
                    <Link href={`/article?id=${article.id}`} className='pl-4 hover:underline'>{article.title}</Link>
                </div>
                <div className='flex-1 flex-col w-full flex '>
                    <p className='mt-4'>Категорія: {article.category}</p>
                    <p className='mt-4'>Дата: {article.createdAt}</p>
                    <h1 className='text-4xl font-bold py-10'>{article.title}</h1>
                    
                    { this.state.article?.imagePath &&
                    (<Image
                        src={(process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + article.imagePath || '/dummy.png'}
                        alt={article.title}
                        width={762}
                        height={400}
                        className='object-cover w-full h-[400px] rounded-lg'
                    />
                    )}
                    <div className='flex-1 flex-col w-full flex py-10'>
                        <h1 className='text-3xl font-bold'>{article.title}</h1>
                        <p className='mt-4'>{article.content}</p>

                        {article.articleBlocks.map(block => (
                            <div key={block.id} className='flex-1 flex flex-col w-full mt-10'>
                                <h2 className='text-2xl font-bold'>{block.title}</h2>
                                
                                {block.imagePath && (
                                    <Image
                                        src={(process.env.NEXT_PUBLIC_FILES_URL || '') + '/' + block.imagePath}
                                        alt={block.title}
                                        width={762}
                                        height={400}
                                        className='object-cover w-full h-[400px] rounded-lg mt-4'
                                    />
                                )}

                                <p className='flex mt-4 break-all'>{block.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}


export default function ArticleWithRouter(props: ArticlePageProps) {
  const searchParams = useSearchParams();

  const id = searchParams.get('id');

  return (
      <ArticlePage {...props} id={id} />
  );
}