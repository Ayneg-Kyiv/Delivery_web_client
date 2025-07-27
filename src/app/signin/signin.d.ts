
type SignInPageProps = {
    router?: ReturnType<typeof useRouter>;
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