
interface ForgotPasswordPageProps {
    router?: ReturnType<typeof useRouter>;
}

interface ForgotPasswordPageState {
    email: string;
    error?: string;
    success?: string;
    loading: boolean;
}