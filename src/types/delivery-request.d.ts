// Request model
interface DeliveryRequest {
    id: string;

    // Locations for pickup and drop-off
    startLocationId: string;
    startLocation: LocationState;
    endLocationId: string;
    endLocation: LocationState;

    // Sender details
    senderId: string;
    senderName: string;
    senderPhoneNumber: string;
    senderEmail?: string;
    sender: shortUserInfo;

    // Receiver details
    receiverName: string;
    receiverPhoneNumber: string;

    // Optional 
    objectName: string;

    // Type of cargo slot (e.g., "Box", "Envelope", "Crate")
    cargoSlotType: string;

    // Weight in kilograms and optional description
    objectWeight: number;
    objectDescription?: string;
    
    // Optional comment from the sender
    comment?: string;

    // Estimated price for the delivery
    estimatedPrice?: number;

    // List of offers made by couriers and the ID of the accepted offer (if any)
    deliveryOfferID ?: string;
    offers ?: DeliveryOffer[];
    // Status flags
    isAccepted: boolean;
    isPickedUp: boolean;
    isDelivered: boolean;
};

interface AddRequestState {
    // Locations for pickup and drop-off
	startLocation: LocationState;
    startTime: string;
    startDate: string;
	endLocation: LocationState;
    endTime: string;
    endDate: string;
    
    // Sender details
	senderName: string;
	senderPhoneNumber: string;
	senderEmail: string;
	
    // Object details
    objectName: string;
	cargoSlotType: string;
	objectWeight: string;
	objectDescription: string;
	
    // Estimated price and receiver details
    estimatedPrice: string;
	receiverName: string;
	receiverPhoneNumber: string;

    // Optional comment from the sender
	comment?: string;

    // Form submission state
	submitting: boolean;
    // UI state
    showManualAddress?: boolean;
};