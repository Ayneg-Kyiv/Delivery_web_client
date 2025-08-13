
interface ForgotPasswordPageProps {
    router?: ReturnType<typeof useRouter>;
}

interface ForgotPasswordPageState {
    email: string;
    error?: string;
    emailError?: boolean;
    success?: string;
    loading: boolean;
}