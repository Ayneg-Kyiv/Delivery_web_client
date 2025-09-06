
interface Article {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    imagePath?: string;
}

interface ArticlePageProps {
    id: string | null;
}

interface ArticlePageState {
    loading: boolean;
    article?: Article;
    error?: string;
}