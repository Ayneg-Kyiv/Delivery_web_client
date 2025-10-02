// filepath: c:\Users\ayneg\source\repos\Delivery_web_client\web_client\src\app\forgot-password-confirmation\forgot-password-confirmation.d.ts

interface ForgotPasswordConfirmationPageProps {
    email: string;
    router: ReturnType<typeof useRouter>;
    t?: typeof import("@/i18n/messages/en").default | typeof import("@/i18n/messages/uk").default;
}

interface ForgotPasswordConfirmationPageState {
    message?: string;
    loading: boolean;
    error?: string;
}