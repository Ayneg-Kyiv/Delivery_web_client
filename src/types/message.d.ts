
interface MessageDto {
    id: number;
    senderId: string;
    receiverId: string;
    deliveryOrderId?: string;
    deliveryOfferId?: string;
    text: string;
    sentAt: string;
    seenAt?: string;
};

interface CreateMessageDto {
    senderId: string;
    receiverId: string;
    deliveryOrderId?: string;
    deliveryOfferId?: string;
    text: string;
};