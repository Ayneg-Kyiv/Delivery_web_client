
interface AddVehicleState {
    stage: number;

    driverPhonePresent: boolean;
    driverLicensePresent: boolean;

    driverPhone: string;
    driverLicenseImage?: File | null;

    vehicleTypes: string[];
    selectedType: string;
    brand: string;
    model: string;
    color: string;
    licensePlate: string;
    imageFront: File | null;
    imageBack: File | null;
    isSubmitting: boolean;
    error: string;
    success: boolean;
}

interface AddVehicleProps {
    session: any;
}