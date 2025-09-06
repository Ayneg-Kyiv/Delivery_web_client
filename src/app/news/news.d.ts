interface NewsProps {}

interface NewsState {
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