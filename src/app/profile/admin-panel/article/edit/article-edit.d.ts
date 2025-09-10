interface EditArticlePageProps {
    session: ReturnType<typeof useSession>
    articleId?: string; // Optional prop for article ID
}

interface EditArticlePageState {
    article:{
        id: string;
        title: string;
        titleError?: boolean;
        content: string;
        contentError?: boolean;
        author: string;
        authorError?: boolean;
        category: string;
        categoryError?: boolean;
        imagePath?: string;
        imagePathError?: boolean;
        image?: File;
        createdAt: string;
        articleBlocks: {
            id: string;
            articleId: string;
            createdAt: string;
            title?: string;
            titleError?: boolean;
            content?: string;
            contentError?: boolean;
            imagePath?: string;
            imagePathError?: boolean;
            image?: File;
        }[];
    }
}