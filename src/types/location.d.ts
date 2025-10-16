
interface LocationState {
    // Address components
    fullAddress: string;

    country: string;
    state: string;
    city: string;
    address: string;
    houseNumber: string;

    // date and time
    date: string;
    time: string;
    // ISO 8601 combined date and time
    dateTime: string;
  
    // Coordinates
    latitude: number | null;
    longitude: number | null;
};

interface CreateLocationDto {
    // Address components
    fullAddress: string;

    country: string;
    state: string | null;
    city: string;
    address: string;
    houseNumber: string | null;
    
    // date and time
    date: string;
    time: string;
    dateTime: string;

    // Coordinates
    latitude?: number | null;
    longitude?: number | null;
};