'use client';

import React, { Component } from 'react';
import { ApiClient } from '@/app/api-client';
import { useSearchParams } from 'next/dist/client/components/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/i18n/I18nProvider';

class ArticlePage extends Component<ArticlePageProps & { t: any, localeTag: string }, ArticlePageState> {
    constructor(props: ArticlePageProps & { t: any, localeTag: string }) {
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

        if (loading) return <div>{this.props.t.loading}</div>;
        if (error) return <div>{this.props.t.errorPrefix}{error}</div>;
        if (!article) return <div>{this.props.t.notFound}</div>;

        return (
            <div className='flex-1 flex-col w-full flex pt-8 md:pt-10 lg:pt-20 px-8 md:px-10 lg:px-20'>
                <div className='flex-1 w-full flex flex-row'>
                    <Link href='/' className=' hover:underline pr-4'>{this.props.t.breadcrumb.home}</Link>
                    <p> {' > '} </p>
                    <Link href='/news' className='pl-4 hover:underline pr-4'>{this.props.t.breadcrumb.news}</Link>
                    <p> {' > '} </p>
                    <Link href={`/article?id=${article.id}`} className='pl-4 hover:underline'>{article.title}</Link>
                </div>
                <div className='flex-1 flex-col w-full flex '>
                    <p className='mt-4'>{this.props.t.categoryLabel} {article.category}</p>
                    <p className='mt-4'>{this.props.t.dateLabel} {new Date(article.createdAt).toLocaleDateString(this.props.localeTag)}</p>
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
                        <div className='mt-10'>
                            <Link href='/news' className='text-[#2892f6] underline'>{this.props.t.backToNews}</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default function ArticleWithRouter(props: ArticlePageProps) {
  const searchParams = useSearchParams();
    const { messages, language } = useI18n();
    const t = messages.articlePage;
    const localeTag = language === 'uk' ? 'uk-UA' : 'en-US';

  const id = searchParams.get('id');

  return (
            <ArticlePage {...props} id={id} t={t} localeTag={localeTag} />
  );
}