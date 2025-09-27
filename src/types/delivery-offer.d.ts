
// Offer model
interface DeliveryOffer {
    id: string;
    deliveryRequestId: string;
    deliveryRequest: DeliveryRequest;
    price: number;
    driverId: string;
    driver: shortUserInfo;
    estimatedCollectionTime: string;
    estimatedDeliveryTime: string;
    isAccepted: boolean;
    isDeclined: boolean;
};
