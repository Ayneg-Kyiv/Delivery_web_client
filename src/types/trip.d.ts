
interface Trip {
    id: string;

    // start and end locations details
    startLocationId: string;
    startLocation: LocationState;

    endLocationId: string;
    endLocation: LocationState;

    // vehicle details
    vehicleId: string;
    vehicle: Vehicle;

    // delivery slots details
    deliverySlots: DeliverySlot[];
    
    // delivery orders details
    deliveryOrders: DeliveryOrder[];

    // driver details
    driverId: string;
    driver: shortUserInfo;
    fullName: string;
    email: string;
    phoneNumber: string;

    // price
    price: number;
    
    // cargo type
    cargoType: string;

    // states
    isStarted: boolean;
    isCompleted: boolean;
};

interface AddTripState{
    startLocation: LocationState;
    startTime: string;
    startDate: string;

    endLocation: LocationState;
    endTime: string;
    endDate: string;
    slots: DeliverySlot[];
    newSlot: {
        cargoSlotTypeName: string;
        approximatePrice: string;
    };
    fullName: string;
    email: string;
    phoneNumber: string;
    vehicleId: string;
    vehicles: Vehicle[];
    loadingVehicles: boolean;
};