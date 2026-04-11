import axios from "axios";
import { store } from "@/shared/redux/store";
import { clearAuth, setAccessToken } from "@/shared/redux/slices/auth.slice";
import { env } from "@/shared/lib/env";

const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10000,
});

// ── Request interceptor ───────────────────────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor ──────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  failedQueue = [];
};

// Routes that should NEVER trigger a token refresh on 401
const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/refresh"];

const isAuthRoute = (url?: string) =>
  AUTH_ROUTES.some((route) => url?.includes(route));

apiClient.interceptors.response.use(
  (response) => response.data, // unwrap — all api fns get data directly

  async (error) => {
    const original = error.config;

    // ✅ Skip refresh entirely for auth routes — just reject with the error
    if (error.response?.status === 401 && isAuthRoute(original?.url)) {
      return Promise.reject(error.response?.data ?? error);
    }

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return apiClient(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        // ✅ Direct fetch — no circular import, no interceptor involved
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include", // sends httpOnly refresh token cookie
        });

        if (!res.ok) throw new Error("Refresh failed");

        const json = await res.json();

        // Your backend response shape: { data: { accessToken } }
        const accessToken: string = json.data.accessToken;

        store.dispatch(setAccessToken({ accessToken }));
        processQueue(null, accessToken);

        original.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(original);
      } catch (err) {
        processQueue(err, null);
        store.dispatch(clearAuth());
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error.response?.data ?? error);
  },
);

export default apiClient;
