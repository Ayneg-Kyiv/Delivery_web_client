type SignupPageProps = {
    router: ReturnType<typeof useRouter>;
};

type SignupPageState = {
    stage: number;
    
    email: string;
    emailError: boolean;

    password: string;
    passwordError: boolean;
    showPassword: boolean;
    
    confirmPassword: string;
    confirmPasswordError: boolean;
    showConfirmPassword: boolean;

    birthDate: string;
    birthDateError: boolean;

    firstName: string;
    lastName: string;
    
    phoneNumber: string;
    phoneNumberError: boolean;

    error?: string;
};