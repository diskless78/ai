import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './app';

// Configure QueryClient with optimized defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minutes default stale time
      gcTime: 10 * 60 * 1000, // 10 minutes cache time (formerly cacheTime)
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch on window focus by default
      refetchOnReconnect: true, // Refetch when internet reconnects
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const app = (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense>
          <App />
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  </HelmetProvider>
);

// Disable StrictMode in dev to prevent ApexCharts double-mounting issues
// StrictMode causes components to mount/unmount/remount in dev, breaking ApexCharts
// Production builds don't have this behavior, so StrictMode is safe there
root.render(import.meta.env.DEV ? app : <StrictMode>{app}</StrictMode>);

