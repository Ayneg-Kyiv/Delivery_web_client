
interface ForgotPasswordPageProps {
    router?: ReturnType<typeof useRouter>;
    session?: ReturnType<typeof useSession>;
    t?: typeof import("@/i18n/messages/en").default | typeof import("@/i18n/messages/uk").default;
}

interface ForgotPasswordPageState {
    email: string;
    error?: string;
    emailError?: boolean;
    success?: string;
    loading: boolean;
}