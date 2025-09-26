
type Vehicle ={
    id: string;
    type: string;
    brand: string;
    model: string;
    color: string;
    numberPlate: string;
    imagePath: string;
    imagePathBack: string;

    createdAt: string;
    updatedAt: string;

}

interface VehicleState {
    stage: number;

    agreedToTerms: boolean;

    driverPhonePresent: boolean;
    driverPhone: string | null;
    
    driverProfileImagePresent: boolean;
    showProfileModal: boolean;
    driverProfileImageUrl: string | null;
    driverProfileImage?: File | null;
    
    driverLicensePresent: boolean;
    showLicenseModal: boolean;
    driverLicenseImageUrl: string | null;
    driverLicenseImage?: File | null;

    vehicles: Vehicle[];
    error: string;
    success: boolean;
}

interface VehicleProps {
    session: ReturnType<typeof useSession>
}