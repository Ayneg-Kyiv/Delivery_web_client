
interface ResetPasswordPageProps {
    router?: ReturnType<typeof useRouter>;
    token: string;
    email: string;
}

interface ResetPasswordPageState {
    password: string;
    showPassword: boolean;
    confirmPassword: string;
    showConfirmPassword: boolean;
    error?: string;
    success?: string;
    loading: boolean;
}