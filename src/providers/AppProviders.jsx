import '@/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AppRouter } from './AppRouter';
import * as Tooltip from '@radix-ui/react-tooltip';
import { LoadingProvider } from '@/providers/loadingProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LoadingProvider>
          <Tooltip.Provider delayDuration={200}>
            <AppRouter />
          </Tooltip.Provider>
        </LoadingProvider>
      </ThemeProvider>
      <ToastContainer
        position="top-right"
        className="z-[9999]"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </QueryClientProvider>
  );
}
