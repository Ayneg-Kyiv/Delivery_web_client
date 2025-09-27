
interface ReviewDto {
    id: string;
    rating: number;
    text: string;
    shippingOrderId?: string;
    deliveryOrderId?: string;
    deliveryRequestId?: string;
    userId: string;
    reviewerId: string;
    reviewer?: shortUserInfo;
};

interface CreateReviewDto {
    rating: number;
    text: string;
    deliveryOrderId?: string;
    deliveryRequestId?: string;
    reviewerId?: string;
    userId?: string;
};