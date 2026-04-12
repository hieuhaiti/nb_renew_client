import '@/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AppRouter } from './AppRouter';
import * as Tooltip from '@radix-ui/react-tooltip';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { LoadingProvider } from '@/providers/loadingProvider';

const queryClient = new QueryClient();

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
      {/* <ReactQueryDevtools
            initialIsOpen={false}
            toggleButtonProps={{ style: { display: 'none' } }}
        /> */}
    </QueryClientProvider>
  );
}
