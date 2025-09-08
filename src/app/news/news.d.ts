interface NewsProps {
    template?: string;
}

interface NewsState {
    authors: [string|null, ...string[]];
    categories: [string|null, ...string[]];
    selectedAuthor: string;
    selectedCategory: string;
    isAuthorOpen: boolean;
    isCategoryOpen: boolean;

    currentPage: number;
    totalPages: number;
    batchSize: number;
    articles: [{
        id: string;
        title: string;
        content: string;
        createdAt: string;
        imagePath: string;
    }];
}