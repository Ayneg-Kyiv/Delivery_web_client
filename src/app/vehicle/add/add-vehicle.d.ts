

interface AddVehicleProps {
    session: any;
    t: typeof import('../../../i18n/messages/uk').default['addVehicle'];
}

interface AddVehicleState {
    stage: number;
    vehicleTypes: string[];
    selectedType: string;
    brand: string;
    model: string;
    color: string;
    licensePlate: string;
    imageFront: File | null;
    imageBack: File | null;
    showFrontModal: boolean;
    showBackModal: boolean;
    isSubmitting: boolean;
    error: string;
    success: boolean;
}
