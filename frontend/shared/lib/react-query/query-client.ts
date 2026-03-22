import { QueryClient } from "@tanstack/react-query";

// Created ONCE when the app loads in browser
// Lives for the entire browser session
// Shared across all components via ReactQueryProvider
// This is what useQueryClient() reads from
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // data is fresh for 1 min
      gcTime: 5 * 60_000, // cache lives 5 min (v5)
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});
