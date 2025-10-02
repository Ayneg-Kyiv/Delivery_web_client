
interface ResetPasswordPageProps {
    router?: ReturnType<typeof useRouter>;
    token: string;
    email: string;
    t?: typeof import("@/i18n/messages/en").default | typeof import("@/i18n/messages/uk").default;
}

interface ResetPasswordPageState {
    password: string;
    passwordError: boolean;
    showPassword: boolean;
    confirmPassword: string;
    confirmPasswordError: boolean;
    showConfirmPassword: boolean;
    error?: string;
    success?: string;
    loading: boolean;
}