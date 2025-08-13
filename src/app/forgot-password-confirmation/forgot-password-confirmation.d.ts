// filepath: c:\Users\ayneg\source\repos\Delivery_web_client\web_client\src\app\forgot-password-confirmation\forgot-password-confirmation.d.ts

interface ForgotPasswordConfirmationPageProps {
    email: string;
    router: ReturnType<typeof useRouter>;
}

interface ForgotPasswordConfirmationPageState {
    message?: string;
    loading: boolean;
    error?: string;
}