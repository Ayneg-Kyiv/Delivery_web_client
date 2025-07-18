
type SignInPageProps = {
    router?: ReturnType<typeof useRouter>;
};

type SignInPageState = {
    email: string;
    password: string;
    showPassword: boolean;
    error?: string;
};