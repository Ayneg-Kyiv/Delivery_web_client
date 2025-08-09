interface ConfirmEmailProps {
  router: ReturnType<typeof useRouter>;
}

interface ConfirmEmailState {
  status: 'loading' | 'success' | 'error';
  message: string;
}