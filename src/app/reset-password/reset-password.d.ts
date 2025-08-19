
interface ResetPasswordPageProps {
    router?: ReturnType<typeof useRouter>;
    token: string;
    email: string;
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