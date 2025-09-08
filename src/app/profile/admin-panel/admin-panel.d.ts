interface AdminPanelProps {
    session: ReturnType<typeof useSession>
}

interface AdminPanelState {
    mode: string;
    userPanel: {
        ifPanelOpen: boolean;
        users: {
            id: string;
            name: string;
        }[];
        currentPage: number;
        totalPages: number;
        batchSize: number;
    },

    driverApplicationPanel: {
        ifPanelOpen: boolean;
    },

    articlePanel: {
        ifPanelOpen: boolean;

        totalArticles: number;
        
        authors: [string|null, ...string[]];
        categories: [string|null, ...string[]];
        selectedAuthor: string;
        selectedCategory: string;
        isAuthorOpen: boolean;
        isCategoryOpen: boolean;

        currentPage: number;
        totalPages: number;
        batchSize: number;
        articles: {
            id: string;
            title: string;
            content: string;
            createdAt: string;
            imagePath: string;
        }[]
    }
}
