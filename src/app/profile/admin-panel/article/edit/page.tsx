'use client';

import React from "react";
import { useI18n } from '@/i18n/I18nProvider';
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { ApiClient } from "@/app/api-client";
import TextInputGroup from "@/components/ui/text-input-group";
import Link from "next/link";
import Image from "next/image";
import TextAreaGroup from "@/components/ui/text-area-group";

const withSession = (Component: React.ComponentType<any>) => {
    const WrappedComponent = (props: any) => {
        const session = useSession();
        const searchParams = useSearchParams();

        const articleId = searchParams.get('articleId');

        if (session.status === 'loading') {
            const { messages } = useI18n();
            return <div>{(messages as any)?.addTrip?.loading || 'Loading...'}</div>;
        }

        if (session.status === 'unauthenticated') {
            location.href = '/signin';
        }

        if (session.status === 'authenticated' && !session.data.user.roles.includes('Admin')) {
            location.href = '/unauthorized';
        }

        // Only allow class components
        if (Component.prototype && Component.prototype.render) {
            const { messages } = useI18n();
            return <Component session={session} articleId={articleId} t={messages} {...props} />;
        }

        throw new Error(
            [
                "You passed a function component, `withSession` is not needed.",
                "You can `useSession` directly in your component.",
            ].join("\n")
        );
    };
    WrappedComponent.displayName = `withSession(${Component.displayName || Component.name || "Component"})`;
    return WrappedComponent;
};

class EditArticlePage extends React.Component<EditArticlePageProps & { t: any }, EditArticlePageState> {
    constructor(props: EditArticlePageProps & { t: any }) {
        super(props);
        this.state = {
            article: {
                id: '',
                title: '',
                content: '',
                author: '',
                category: '',
                categoryError: false,
                imagePath: '',
                createdAt: '',
                image: undefined,
                articleBlocks: [{
                    id: '',
                    articleId: '',
                    createdAt: '',
                    title: '',
                    content: '',
                    imagePath: '',
                    image: undefined,
                }],
            }
        };
    }

    async componentDidMount(): Promise<void> {
        const response = await ApiClient.get<any>(`/article/${this.props.articleId}`);

        this.setState({ article: response.data });
    }

    async updateArticle(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        try {
            const formData = new FormData();

            formData.append('id', this.state.article.id);
            formData.append('title', this.state.article.title);
            formData.append('content', this.state.article.content);
            formData.append('author', this.state.article.author);
            
            if (this.state.article.image) {
                formData.append('image', this.state.article.image);
            }

            const response = await ApiClient.put<any>(`/article/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            for (const block of this.state.article.articleBlocks) {
                const blockFormData = new FormData();
                
                blockFormData.append('id', block.id);
                blockFormData.append('articleId', this.state.article.id);
                
                if (block.title) blockFormData.append('title', block.title);
                if (block.content) blockFormData.append('content', block.content);
                if (block.image) {
                    blockFormData.append('image', block.image);
                }

                const response = await ApiClient.put(`/article/block/update`, blockFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.success) 
                    alert("Article and blocks updated successfully");
            }

        } catch (error) {
            console.error("Error updating article:", error);
        }
    }
    
    handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 1024 * 1024) {
            alert('Image exceeds 1MB. Please choose a smaller file.');
            (e.target as HTMLInputElement).value = '';
            return;
        }
        
        // Update the file in state
        this.setState({ article: { ...this.state.article, image: file } });
        
        // Create preview for display
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === "string") {
                this.setState({ article: { ...this.state.article, imagePath: result } });
            }
        };
        reader.readAsDataURL(file);
    }
    
    getImageSrc = () => {
        const { imagePath } = this.state.article;
        
        // If it's a data URL (from FileReader), use it directly
        if (imagePath?.startsWith('data:')) {
            return imagePath;
        }
        
        // Otherwise, it's a server path - prepend the API URL
        if (imagePath) {
            return `${process.env.NEXT_PUBLIC_FILES_URL || ''}/${imagePath}`;
        }
        
        // Fallback image
        return '/dummy.png';
    }

    render() {
        const { data: session } = this.props.session;

        return (
                <div className="flex-1 bg-default flex py-10">
                    <div className="w-full flex flex-col items-center px-8">
                        <Link href="/profile/admin-panel" className="self-start w-full md:w-[340px] p-4 bg-lighter rounded-lg mb-6 hover:underline text-center">{this.props.t?.profile?.adminArticle?.back}</Link>
                        <h1 className="text-4xl font-bold mb-6">{this.props.t?.profile?.adminArticle?.editTitle}</h1>
                        <form className="flex flex-col gap-4 w-full max-w-7xl bg-lighter p-4 rounded-lg" onSubmit={(e) => {
                            this.updateArticle(e);
                        }}>
                            <div className="flex flex-col">
                                <TextInputGroup
                                    value={this.state.article.title}
                                    onChange={(e) => this.setState({ article: { ...this.state.article, title: e.target.value } })}
                                    placeholder=""
                                    label={this.props.t?.profile?.adminArticle?.labels?.title}
                                    className="w-full"
                                    inputClassName={`floating-input ${this.state.article.titleError ? 'floating-input-error' : ''}`}
                                    labelClassName={`${this.state.article.title ? ' filled' : ''} ${this.state.article.titleError ? ' floating-label-error' : ''}`}
                                />

                                <TextAreaGroup
                                    value={this.state.article.content}
                                    onChange={(e) => this.setState({ 
                                        article: { ...this.state.article, content: e.target.value }
                                    })}
                                    placeholder=""
                                    label={this.props.t?.profile?.adminArticle?.labels?.content}
                                    className="mb-4"
                                    error={!!this.state.article.contentError}
                                    minHeight="150px"
                                />
                                
                                <TextInputGroup
                                    value={this.state.article.category || ''}
                                    onChange={(e) => this.setState({ article: { ...this.state.article, category: e.target.value } })}
                                    placeholder=""
                                    label={this.props.t?.profile?.adminArticle?.labels?.category}
                                    className="w-full"
                                    inputClassName={`floating-input ${this.state.article.categoryError ? 'floating-input-error' : ''}`}
                                    labelClassName={`${this.state.article.category ? ' filled' : ''} ${this.state.article.categoryError ? ' floating-label-error' : ''}`}
                                />

                                {this.state.article.imagePath && (
                                    <Image
                                        src={this.getImageSrc()}
                                        alt={this.state.article.title || "Preview image"}
                                        width={1920}
                                        height={1080}
                                        className='object-cover w-full max-h-[920px] rounded-lg mb-4'
                                    />
                                    )}
                                    
                                    {/* image selector */}
                                <div className="flex flex-col">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="flex-1 flex justify-center items-center p-4"
                                        onChange={this.handleImageChange}
                                    />
                                </div>

                                {
                                    this.state.article.articleBlocks.map((block, index) => (
                                        <div key={block.id || index} className="flex flex-col border border-gray-300 rounded-lg p-4 mb-4 mt-10">
                                            <h2 className="text-2xl font-bold mb-4">{(this.props.t?.profile?.adminArticle?.labels?.block || 'Block {index}').replace('{index}', String(index + 1))}</h2>

                                            { block.title && (
                                                <TextInputGroup
                                                    value={block.title}
                                                    onChange={e => {
                                                        const newBlocks = [...this.state.article.articleBlocks];
                                                        newBlocks[index] = { ...block, title: e.target.value };
                                                        this.setState({ article: { ...this.state.article, articleBlocks: newBlocks } });
                                                    }}
                                                    placeholder=""
                                                    label={this.props.t?.profile?.adminArticle?.labels?.blockTitle}
                                                    className="mb-2"
                                                />
                                            )}

                                            {
                                                block.content && (
                                                    <TextAreaGroup
                                                        value={block.content}
                                                        onChange={e => {
                                                            const newBlocks = [...this.state.article.articleBlocks];
                                                            newBlocks[index] = { ...block, content: e.target.value };
                                                        this.setState({ article: { ...this.state.article, articleBlocks: newBlocks } });
                                                    }}
                                                    placeholder=""
                                                    label={this.props.t?.profile?.adminArticle?.labels?.blockContent}
                                                    className="mb-2"
                                                    minHeight="100px"
                                                />
                                                )}

                                            {
                                                block.imagePath && (
                                                <Image
                                                    src={
                                                        block.imagePath.startsWith('data:')
                                                            ? block.imagePath
                                                            : `${process.env.NEXT_PUBLIC_FILES_URL || ''}/${block.imagePath}`
                                                    }
                                                    alt={block.title || "Block image"}
                                                    width={1920}
                                                    height={1080}
                                                    className="object-cover w-full max-h-[920px] rounded-lg mb-4"
                                                />
                                            )}

                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="mb-4 flex-1 flex justify-center items-center p-4"
                                                onChange={e => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    const reader = new FileReader();
                                                    reader.onload = ev => {
                                                        const result = ev.target?.result;
                                                        if (typeof result === "string") {
                                                            const newBlocks = [...this.state.article.articleBlocks];
                                                            newBlocks[index] = { ...block, image: file, imagePath: result };
                                                            this.setState({ article: { ...this.state.article, articleBlocks: newBlocks } });
                                                        }
                                                    };
                                                    reader.readAsDataURL(file);
                                                }}
                                            />
                                        </div>
                                    ))
                                }

                                <input type="submit" value={this.props.t?.profile?.adminArticle?.labels?.saveChanges}
                                    className="w-full mt-10 h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
                                />
                            </div>
                        </form>
                    </div>
                </div>
        );
    }
}

export default withSession(EditArticlePage);