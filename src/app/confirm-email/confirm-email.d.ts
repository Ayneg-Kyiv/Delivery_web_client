interface ConfirmEmailProps {
  router: ReturnType<typeof useRouter>;
  searchParams: ReturnType<typeof useSearchParams>;
}

interface ConfirmEmailState {
  status: 'loading' | 'success' | 'error';
  message: string;
}