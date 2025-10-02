
type SignInPageProps = {
    router?: ReturnType<typeof useRouter>;
    t?: typeof import("@/i18n/messages/en").default | typeof import("@/i18n/messages/uk").default;
};

type SignInPageState = {
    email: string;
    emailError?: boolean;
    password: string;
    passwordError?: boolean;
    rememberMe: boolean;
    showPassword: boolean;
    error?: string;
};