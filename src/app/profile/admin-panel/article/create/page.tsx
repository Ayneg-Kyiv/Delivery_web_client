'use client';

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ApiClient } from "@/app/api-client";
import TextInputGroup from "@/components/ui/text-input-group";
import Link from "next/link";
import Image from "next/image";
import TextAreaGroup from "@/components/ui/text-area-group";

const withSession = (Component: React.ComponentType<any>) => {
    const WrappedComponent = (props: any) => {
        const session = useSession();
        const router = useRouter();

        if (session.status === 'loading') {
            return <div>Loading...</div>;
        }

        if (session.status === 'unauthenticated') {
            router.replace('/signin');
            return null;
        }

        if (session.status === 'authenticated' && !session.data.user.roles.includes('Admin')) {
            router.replace('/unauthorized');
            return null;
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
    WrappedComponent.displayName = `withSession(${Component.displayName || Component.name || "Component"})`;
    return WrappedComponent;
};

type ArticleBlock = {
    id?: string;
    articleId?: string;
    createdAt?: string;
    title?: string;
    titleError: string;
    content?: string;
    contentError: string;
    imagePath?: string;
    image?: File;
};

type Article = {
    id?: string;
    title: string;
    titleError: string;
    content: string;
    contentError: string;
    author: string;
    authorError: string;
    category?: string;
    categoryError: string;
    imagePath?: string;
    createdAt?: string;
    image?: File;
    articleBlocks: ArticleBlock[];
};

type CreateArticlePageProps = {
    session: any;
};

type CreateArticlePageState = {
    article: Article;
    submitting: boolean;
};

class CreateArticlePage extends React.Component<CreateArticlePageProps, CreateArticlePageState> {
    constructor(props: CreateArticlePageProps) {
        super(props);
        this.state = {
            article: {
                title: '',
                titleError: '',
                content: '',
                contentError: '',
                author: props.session.data?.user?.name || '',
                authorError: '',
                category: '',
                categoryError: '',
                imagePath: '',
                image: undefined,
                articleBlocks: [],
            },
            submitting: false,
        };
    }

    handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        this.setState({ article: { ...this.state.article, image: file } });

        const reader = new FileReader();
        reader.onload = (ev) => {
            const result = ev.target?.result;
            if (typeof result === "string") {
                this.setState({ article: { ...this.state.article, imagePath: result } });
            }
        };
        reader.readAsDataURL(file);
    };

    getImageSrc = () => {
        const { imagePath } = this.state.article;
        if (imagePath?.startsWith('data:')) return imagePath;
        if (imagePath) return `${process.env.NEXT_PUBLIC_FILES_URL || ''}/${imagePath}`;
        return '/dummy.png';
    };

    handleBlockImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            const result = ev.target?.result;
            if (typeof result === "string") {
                const newBlocks = [...this.state.article.articleBlocks];
                newBlocks[index] = { ...newBlocks[index], image: file, imagePath: result };
                this.setState({ article: { ...this.state.article, articleBlocks: newBlocks } });
            }
        };
        reader.readAsDataURL(file);
    };

    addBlock = () => {
        this.setState({
            article: {
                ...this.state.article,
                articleBlocks: [
                    ...this.state.article.articleBlocks,
                    {
                        title: '',
                        titleError: '',
                        content: '',
                        contentError: '',
                        imagePath: '',
                        image: undefined,
                    }
                ]
            }
        });
    };

    async createArticle(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        let hasError = false;

        const article = { ...this.state.article };

        // Validate main article
        article.titleError = article.title.trim() ? '' : 'Заголовок обовʼязковий';
        article.contentError = article.content.trim() ? '' : 'Контент обовʼязковий';
        if (!article.author || !article.author.trim()) {
            alert('Автор обовʼязковий');
            hasError = true;
        }
        if (article.titleError || article.contentError) {
            hasError = true;
        }

        // Validate blocks
        article.articleBlocks = article.articleBlocks.map((block) => {
            let titleError = '';
            let contentError = '';
            const hasTitle = block.title && block.title.trim();
            const hasContent = block.content && block.content.trim();
            const hasImage = !!block.image;

            if (!hasTitle && !hasContent && !hasImage) {
                titleError = 'Блок повинен містити заголовок, контент або зображення';
                contentError = 'Блок повинен містити заголовок, контент або зображення';
                hasError = true;
            }

            return {
                ...block,
                titleError,
                contentError,
            };
        });

        this.setState({ article });
        if (hasError) return;

        this.setState({ submitting: true });
        try {
            const formData = new FormData();
            
            formData.append('title', article.title);
            formData.append('content', article.content);
            formData.append('author', article.author);

            if (article.image) {
                formData.append('image', article.image);
            }

            const response = await ApiClient.post<any>(`/article/create`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log("Article created:", response.data);
            const articleId = response.data;

            for (const block of article.articleBlocks) {
                //test it as it previously used form
                const blockFormData = new FormData();

                blockFormData.append('articleId', articleId);
                
                if (block.title) blockFormData.append('title', block.title);
                if (block.content) blockFormData.append('content', block.content);
                if (block.image) blockFormData.append('image', block.image);

                await ApiClient.post(`/article/block/create`,{
                  "articleId": articleId,
                  "title": (block.title ? block.title : null),
                  "content": (block.content ? block.content: null),
                  "image" : (block.image ? block.image : null)
                }, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            alert("Article and blocks created successfully");
            location.href = '/profile/admin-panel';

        } catch (error) {
            console.error("Error creating article:", error);
        } finally {
            this.setState({ submitting: false });
        }
    }

    render() {
        return (
            <div className="flex-1 bg-default flex py-10">
                <div className="w-full flex flex-col items-center px-8">
                    <Link href="/profile/admin-panel" className="self-start w-full md:w-[340px] p-4 bg-lighter rounded-lg mb-6 hover:underline text-center">{'<<'} Назад до панелі адміністратора</Link>
                    <h1 className="text-4xl font-bold mb-6">Створення статті</h1>
                    <form className="flex flex-col gap-4 w-full max-w-7xl bg-lighter p-4 rounded-lg" onSubmit={(e) => this.createArticle(e)}>
                        <div className="flex flex-col">
                            <TextInputGroup
                                value={this.state.article.title}
                                onChange={(e) => this.setState({ article: { ...this.state.article, title: e.target.value } })}
                                placeholder=""
                                label={"Заголовок"}
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
                                label="Контент"
                                className="mb-4"
                                error={!!this.state.article.contentError}
                                minHeight="150px"
                            />

                            <TextInputGroup
                                value={this.state.article.category || ''}
                                onChange={(e) => this.setState({ article: { ...this.state.article, category: e.target.value } })}
                                placeholder=""
                                label={"Категорія"}
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

                            <div className="flex flex-col">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="flex-1 flex justify-center items-center p-4"
                                    onChange={this.handleImageChange}
                                />
                            </div>

                            {this.state.article.articleBlocks.map((block, index) => (
                                <div key={index} className="flex flex-col border border-gray-300 rounded-lg p-4 mb-4 mt-10">
                                    <h2 className="text-2xl font-bold mb-4">Блок {index + 1}</h2>
                                    { block.title !== undefined && (
                                                <TextInputGroup
                                                    value={block.title}
                                                    onChange={e => {
                                                        const newBlocks = [...this.state.article.articleBlocks];
                                                        newBlocks[index] = { ...block, title: e.target.value };
                                                        this.setState({ article: { ...this.state.article, articleBlocks: newBlocks } });
                                                    }}
                                                    required={false}
                                                    placeholder=""
                                                    label="Заголовок блоку"
                                                    className="mb-2"
                                                />
                                            )}

                                        {
                                            block.content !== undefined && (
                                                <TextAreaGroup
                                                    value={block.content}
                                                    onChange={e => {
                                                        const newBlocks = [...this.state.article.articleBlocks];
                                                        newBlocks[index] = { ...block, content: e.target.value };
                                                    this.setState({ article: { ...this.state.article, articleBlocks: newBlocks } });
                                                }}
                                                placeholder=""
                                                required={false}
                                                label="Контент блоку"
                                                className="mb-2"
                                                minHeight="100px"
                                            />)
                                        }

                                    {block.imagePath && (
                                        <Image
                                            src={block.imagePath.startsWith('data:')
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
                                        className="mb-4"
                                        onChange={e => this.handleBlockImageChange(index, e)}
                                    />
                                </div>
                            ))}

                            <button
                                type="button"
                                className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)] mt-8 mb-4"
                                onClick={this.addBlock}
                            >
                                Додати блок
                            </button>

                            <input
                                type="submit"
                                value={this.state.submitting ? 'Зберігаємо...' : 'Створити статтю'}
                                disabled={this.state.submitting}
                                className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
                            />
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default withSession(CreateArticlePage);