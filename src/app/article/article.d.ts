
interface Article {
    id: string;
    category: string;
    title: string;
    content: string;
    createdAt: string;
    imagePath?: string;
    articleBlocks: [{
        id: string;
        title: string;
        content: string;
        imagePath?: string;
    }]
}

interface ArticlePageProps {
    id: string | null;
}

interface ArticlePageState {
    loading: boolean;
    article?: Article;
    error?: string;
}