import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";
import { initAnalytics } from "./lib/analytics";

// Global error handler to catch any uncaught errors
window.onerror = function(message, source, lineno, colno, error) {
  console.error('[Global Error]', { message, source, lineno, colno, error });
  // Show error in the loading div if React hasn't mounted yet
  const loadingDiv = document.getElementById('loading-fallback');
  if (loadingDiv) {
    loadingDiv.innerHTML = `
      <div style="color: red; padding: 20px; text-align: center;">
        <h2>Application Error</h2>
        <p>${message}</p>
        <p style="font-size: 12px; color: #666;">Source: ${source}:${lineno}:${colno}</p>
        <button onclick="window.location.reload()" style="margin-top: 10px; padding: 10px 20px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    `;
  }
  return false;
};

// Catch unhandled promise rejections
window.onunhandledrejection = function(event) {
  console.error('[Unhandled Promise Rejection]', event.reason);
};

console.log('[App] Starting initialization...');

// Initialize all analytics (GA4 + Umami) - wrapped in try/catch
try {
  initAnalytics();
  console.log('[App] Analytics initialized');
} catch (e) {
  console.warn('[App] Analytics initialization failed:', e);
}

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

console.log('[App] Creating React root...');

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  const root = createRoot(rootElement);
  console.log('[App] Rendering React app...');
  
  root.render(
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  );
  
  console.log('[App] React app rendered successfully');
} catch (e) {
  console.error('[App] Failed to render React app:', e);
  // Show error in loading div
  const loadingDiv = document.getElementById('loading-fallback');
  if (loadingDiv) {
    loadingDiv.innerHTML = `
      <div style="color: red; padding: 20px; text-align: center;">
        <h2>Failed to load application</h2>
        <p>${e instanceof Error ? e.message : 'Unknown error'}</p>
        <button onclick="window.location.reload()" style="margin-top: 10px; padding: 10px 20px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    `;
  }
}
// Deploy trigger: 1768247047
