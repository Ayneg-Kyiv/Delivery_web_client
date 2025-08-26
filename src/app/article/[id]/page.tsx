import { notFound } from 'next/navigation';
import React from 'react';

// Article data interface
interface Article {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    imagePath?: string;
}

// Fetch article data
async function getArticle(id: string): Promise<Article | null> {
    try {
        // Replace with your actual API endpoint
        const response = await fetch(`https://your-api.com/articles/${id}`, {
            next: { revalidate: 3600 }, // Revalidate every hour
        });
        
        if (!response.ok) return null;
        return response.json();
    } catch (error) {
        console.error('Error fetching article:', error);
        return null;
    }
}

// Article page component
export default async function ArticlePage({ params }: { params: { id: string } }) {
    const article = await getArticle(params.id);
    
    if (!article) {
        notFound();
    }
    
    const formattedDate = new Date(article.createdAt).toLocaleDateString();
    
    return (
        <main className="container mx-auto px-4 py-8">
            <article className="max-w-3xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
                    <div className="text-gray-600">
                        <span>By {article.author}</span>
                        <span className="mx-2">•</span>
                        <time dateTime={article.createdAt}>{formattedDate}</time>
                    </div>
                    
                </header>

                {article.imagePath && (
                    <div className="mb-8">
                        <img 
                            src={article.imagePath} 
                            alt={article.title} 
                            className="w-full h-auto rounded-lg"
                        />
                    </div>
                )}
                
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
            </article>
        </main>
    );
}