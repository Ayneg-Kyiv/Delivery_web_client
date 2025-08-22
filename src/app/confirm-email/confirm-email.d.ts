interface ConfirmEmailProps {
  router: ReturnType<typeof useRouter>;
  token: string | null;
  email: string | null;
}

interface ConfirmEmailState {
  status: 'loading' | 'success' | 'error' | 'resent';
  message: string;
}