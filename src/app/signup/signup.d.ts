type SignupPageProps = {
    router: ReturnType<typeof useRouter>;
    t?: typeof import("@/i18n/messages/en").default | typeof import("@/i18n/messages/uk").default;
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