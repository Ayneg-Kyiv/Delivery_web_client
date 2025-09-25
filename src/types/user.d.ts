interface shortUserInfo {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    name: string;

    phoneNumber?: string;

    email: string;
    imagePath?: string;
    rating: number;
    reviews: ReviewDto[];
}