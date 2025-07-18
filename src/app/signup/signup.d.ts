type SignupPageProps = {
    router: ReturnType<typeof useRouter>;
};

type SignupPageState = {
    email: string;
    password: string;
    showPassword: boolean;
    confirmPassword: string;
    showConfirmPassword: boolean;
    error?: string;
};