interface AdminPanelProps {
    session: ReturnType<typeof useSession>
}

interface AdminPanelState {
    mode: string;
    userPanel: {
        ifPanelOpen: boolean;

        totalUsers: number;
        totalDrivers: number;

        activeOrders: number;

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
        totalApplications: number;

        applications: {
            id: string;
            vehicleId: string;
            Vehicle: {
                id: number;
                ownerId: string;
                brand?: string;
                model?: string;
                type: string;
                numberPlate: string;
                color: string;
                imagePath?: string;
                imagePathBack?: string;
            };}[];
            
        currentPage: number;
        totalPages: number;
        batchSize: number;
        };

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
