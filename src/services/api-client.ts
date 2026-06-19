import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// ─── Base Config ──────────────────────────────────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const TIMEOUT = 30_000;
const IS_BROWSER = typeof window !== "undefined";

const camelizeString = (value: string): string =>
  value.replace(/([-_][a-z])/gi, (match) => match.toUpperCase().replace(/[-_]/g, ""));

const decamelizeString = (value: string): string =>
  value.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();

const deepTransformKeys = (value: unknown, transform: (key: string) => string): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => deepTransformKeys(item, transform));
  }

  if (value !== null && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>((acc, [key, item]) => {
      acc[transform(key)] = deepTransformKeys(item, transform);
      return acc;
    }, {});
  }

  return value;
};

const isFormData = (value: unknown): boolean => {
  if (!value || typeof value !== "object") return false;
  return (
    value instanceof FormData ||
    value.constructor?.name === "FormData" ||
    typeof (value as any).append === "function"
  );
};

// ─── Token Helpers ────────────────────────────────────────────────────────────
const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    return IS_BROWSER ? window.localStorage.getItem(key) : null;
  },
  setItem: (key: string, value: string): void => {
    if (IS_BROWSER) {
      window.localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (IS_BROWSER) {
      window.localStorage.removeItem(key);
    }
  },
};

export const tokenStorage = {
  getToken: (): string | null => safeLocalStorage.getItem(TOKEN_KEY),
  setToken: (token: string): void => safeLocalStorage.setItem(TOKEN_KEY, token),
  removeToken: (): void => safeLocalStorage.removeItem(TOKEN_KEY),

  getRefreshToken: (): string | null => safeLocalStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string): void => safeLocalStorage.setItem(REFRESH_TOKEN_KEY, token),
  removeRefreshToken: (): void => safeLocalStorage.removeItem(REFRESH_TOKEN_KEY),

  clearAll: (): void => {
    safeLocalStorage.removeItem(TOKEN_KEY);
    safeLocalStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

// ─── Create Instance ──────────────────────────────────────────────────────────
const setAuthCookies = (accessToken: string | null, refreshToken: string | null) => {
  if (!IS_BROWSER) return;

  if (accessToken) {
    document.cookie = `access_token=${accessToken}; path=/; max-age=${60 * 60}; SameSite=Lax`;
  } else {
    document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax";
  }

  if (refreshToken) {
    document.cookie = `refresh_token=${refreshToken}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  } else {
    document.cookie = "refresh_token=; path=/; max-age=0; SameSite=Lax";
  }
};

const publicApiClient: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: TIMEOUT,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

publicApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (config.data && !isFormData(config.data)) {
      config.data = deepTransformKeys(config.data, decamelizeString);
    }

    if (config.params) {
      config.params = deepTransformKeys(config.params, decamelizeString);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

publicApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data && typeof response.data === "object") {
      response.data = deepTransformKeys(response.data, camelizeString);
    }
    return response;
  },
  (error) => Promise.reject(error)
);

const apiClient: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: TIMEOUT,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Attaches the Bearer token to every outgoing request automatically
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (IS_BROWSER) {
      const token = tokenStorage.getToken();
      if (token && config.headers) {
        (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
      }
    }

    if (config.data && !isFormData(config.data)) {
      config.data = deepTransformKeys(config.data, decamelizeString);
    }

    if (config.params) {
      config.params = deepTransformKeys(config.params, decamelizeString);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Handles 401s by attempting a silent token refresh once, then logs out
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else if (token) resolve(token);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data && typeof response.data === "object") {
      response.data = deepTransformKeys(response.data, camelizeString);
    }
    return response;
  },

  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = tokenStorage.getRefreshToken();
      const accessToken = tokenStorage.getToken();

      if (!refreshToken) {
        if (accessToken) {
          tokenStorage.clearAll();
          setAuthCookies(null, null);
          if (IS_BROWSER) window.location.href = "/auth/login";
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((refreshError) => Promise.reject(refreshError));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${BASE_URL}/api/auth/token/refresh/`,
          { refresh: refreshToken },
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );

        tokenStorage.setToken(data.access);
        tokenStorage.setRefreshToken(data.refresh);
        setAuthCookies(data.access, data.refresh);
        apiClient.defaults.headers.common.Authorization = `Bearer ${data.access}`;
        processQueue(null, data.access);

        if (originalRequest.headers) {
          (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${data.access}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStorage.clearAll();
        setAuthCookies(null, null);
        if (IS_BROWSER) window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 429) {
      const resetHeader = error.response.headers["x-ratelimit-reset"];
      if (resetHeader) {
        const waitMs = parseInt(resetHeader, 10) * 1000 - Date.now() + 1000;
        if (waitMs > 0 && waitMs < 60_000) {
          await new Promise((resolve) => setTimeout(resolve, waitMs));
          return apiClient(originalRequest);
        }
      }
    }

    return Promise.reject(error);
  }
);

export { publicApiClient };
export default apiClient;