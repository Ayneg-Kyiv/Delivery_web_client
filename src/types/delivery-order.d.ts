
interface DeliveryOrder {
    id: string;
    
    // trip details
    tripId: string;
    trip?: Trip;

    // sender details
    senderId?: string;
    senderName: string;
    senderPhoneNumber: string;
    senderEmail?: string;
    receiverName: string;
    receiverPhoneNumber: string;
    sender?: shortUserInfo;
    
    // driver details in dto
    driver?: shortUserInfo;

    // delivery slot details
    deliverySlotId: string;
    deliverySlot: DeliverySlot;

    // locations
    startLocationId: string;
    startLocation: LocationState;
    endLocationId: string;
    endLocation: LocationState;
    
    // possible comments from sender
    comment?: string;

    // states
    isAccepted: boolean;
    isDeclined: boolean;
    isPickedUp: boolean;
    isDelivered: boolean;
};