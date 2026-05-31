# Copilot Prompt — Acadexis Frontend: Global Issues

---

## Context

This is the **Next.js** frontend (React 19, TypeScript, Zustand, Axios, Tailwind) for **Acadexis**. All individual feature areas (auth, user/profile, courses, materials, study lab, notifications, analytics) have been fixed in previous prompts. This prompt fixes **cross-cutting, project-wide issues** that affect every page, every service call, and every component simultaneously.

Do not add new features. Only fix the issues listed below across the entire project.

Files that will be touched:
- `src/services/api-client.ts` — Axios instance (the single most important file)
- `src/types/index.ts` — central type re-exports
- `.env.local` — environment variable completeness
- `next.config.js` — image domains, env exposure
- Any page or hook that directly accesses `localStorage` without SSR guards
- Any page or hook that calls a list endpoint and reads the response as a plain array

---

## Fix 1: Axios base URL — include `/api` prefix once, globally

This is the single highest-impact fix. The Axios instance base URL must include `/api` so that every relative path in `apiService.ts` is written without it. If this is not already done, it will cause every single API call to fail with a 404.

```typescript
// src/services/api-client.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept:         "application/json",
  },
  // withCredentials allows Authorization headers to be sent cross-origin
  withCredentials: true,
  // Timeout after 30 seconds — prevents requests hanging indefinitely
  timeout: 30_000,
});

export default apiClient;
```

After this change, audit every service function in `apiService.ts` to ensure no path starts with `/api/`. If any path does, remove the `/api` prefix — the base URL already provides it:

```typescript
// WRONG — double /api prefix
await apiClient.get("/api/courses/");

// CORRECT — single prefix from baseURL
await apiClient.get("/courses/");
```

---

## Fix 2: Trailing slash audit — every path must end with `/`

DRF's `APPEND_SLASH = True` sends a `301 Moved Permanently` for paths without trailing slashes. Axios silently follows the redirect as a `GET`, which breaks every `POST`, `PATCH`, and `DELETE`.

Do a project-wide search for every `apiClient.get(`, `apiClient.post(`, `apiClient.patch(`, `apiClient.put(`, and `apiClient.delete(` call. Confirm every path string ends with `/`:

```typescript
// WRONG
apiClient.post("/auth/login")
apiClient.get("/courses")
apiClient.delete(`/materials/${id}`)

// CORRECT
apiClient.post("/auth/login/")
apiClient.get("/courses/")
apiClient.delete(`/materials/${id}/`)
```

Dynamic path segments must also end with `/`:
```typescript
// WRONG
apiClient.get(`/courses/${courseId}`)

// CORRECT
apiClient.get(`/courses/${courseId}/`)
```

---

## Fix 3: Global camelCase → snake_case request transform

All request bodies sent to the backend must use `snake_case` field names. Rather than fixing every individual service function manually, add a request interceptor that automatically converts outgoing JSON bodies from camelCase to snake_case using the `humps` library:

Install:
```bash
npm install humps
npm install --save-dev @types/humps
```

Add the interceptor to `src/services/api-client.ts`:

```typescript
import humps from "humps";

// Request interceptor: convert camelCase → snake_case in request bodies
apiClient.interceptors.request.use((config) => {
  // Attach auth token
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Convert body to snake_case — only for JSON requests, not FormData
  if (
    config.data &&
    !(config.data instanceof FormData) &&
    config.headers["Content-Type"] !== "multipart/form-data"
  ) {
    config.data = humps.decamelizeKeys(config.data);
  }

  // Convert query params to snake_case
  if (config.params) {
    config.params = humps.decamelizeKeys(config.params);
  }

  return config;
});
```

**Important:** Do NOT apply `decamelizeKeys` to `FormData` objects — file uploads will break. The `instanceof FormData` check handles this.

---

## Fix 4: Global snake_case → camelCase response transform

All responses from the backend use `snake_case`. Rather than fixing every individual component, add a response interceptor that automatically converts incoming JSON to camelCase:

```typescript
// Response interceptor: convert snake_case → camelCase in responses
apiClient.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      response.headers["content-type"]?.includes("application/json")
    ) {
      response.data = humps.camelizeKeys(response.data);
    }
    return response;
  },
  async (error) => {
    // Handle 401 / token refresh here (see Fix 5)
    return Promise.reject(error);
  }
);
```

After adding this interceptor, all existing component code that reads camelCase field names (e.g. `course.lecturerName`, `material.fileName`) will work automatically — no per-component fixes needed for field names already in camelCase.

**Exception:** File URLs returned in `file`, `avatar`, `thumbnail` fields are strings, not nested objects. `camelizeKeys` does not change their values — only object keys are transformed.

---

## Fix 5: Token refresh interceptor — complete and correct

The `401` handling must be part of the response interceptor added in Fix 4. Here is the complete response interceptor combining both concerns:

```typescript
// src/services/api-client.ts — complete response interceptor

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject:  (err: unknown)  => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // Convert snake_case → camelCase on all JSON responses
    if (
      response.data &&
      response.headers["content-type"]?.includes("application/json")
    ) {
      response.data = humps.camelizeKeys(response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("refresh_token")
          : null;

      if (!refreshToken) {
        isRefreshing = false;
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        // Use a plain axios call (not apiClient) to avoid interceptor loops
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/auth/token/refresh/`,
          { refresh: refreshToken },     // snake_case — bypass the interceptor
          { headers: { "Content-Type": "application/json" } }
        );

        const newAccessToken  = data.access;
        const newRefreshToken = data.refresh;   // Backend rotates refresh token

        localStorage.setItem("access_token",  newAccessToken);
        localStorage.setItem("refresh_token", newRefreshToken);

        apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle rate limiting — 429 Too Many Requests
    if (error.response?.status === 429) {
      const resetHeader = error.response.headers["x-ratelimit-reset"];
      if (resetHeader) {
        const waitMs = parseInt(resetHeader) * 1000 - Date.now() + 1000;
        if (waitMs > 0 && waitMs < 60_000) {
          // Auto-retry once after the rate limit window
          await new Promise((res) => setTimeout(res, waitMs));
          return apiClient(originalRequest);
        }
      }
    }

    return Promise.reject(error);
  }
);
```

---

## Fix 6: SSR guard for `localStorage` access

Next.js renders pages on the server where `localStorage` does not exist. Any code that reads `localStorage` without a guard will throw `ReferenceError: localStorage is not defined` during SSR.

Search the entire codebase for every `localStorage.getItem` and `localStorage.setItem` call. Wrap every one with a `typeof window !== "undefined"` guard:

```typescript
// WRONG — crashes on server
const token = localStorage.getItem("access_token");

// CORRECT — safe in both SSR and browser
const token =
  typeof window !== "undefined"
    ? localStorage.getItem("access_token")
    : null;
```

For Zustand stores that rehydrate from `localStorage` on mount, use the `persist` middleware with `skipHydration: true` and call `rehydrate()` inside a `useEffect`:

```typescript
// In the store or root layout
useEffect(() => {
  useAuthStore.persist.rehydrate();
}, []);
```

---

## Fix 7: Paginated response handling — global audit

The backend wraps every list response in:
```json
{ "count": n, "next": "...", "previous": "...", "results": [...] }
```

After the camelCase transform in Fix 4, these keys become `camelCase`: `count`, `next`, `previous`, `results` — they do not change (already camelCase or single words).

Do a project-wide search for every list endpoint call and confirm the data is read from `.results`, not directly:

```typescript
// WRONG — assumes plain array
const courses = response.data;
courses.map(...)

// CORRECT — reads from paginated envelope
const { results: courses, count, next, previous } = response.data;
courses.map(...)
```

Exceptions — these endpoints return plain arrays (no pagination envelope):
- `GET /sessions/messages/` — all messages for a session
- `GET /courses/mine/` — lecturer's/student's own courses
- `GET /sessions/` — user's sessions (confirm with backend)
- `GET /bookmarks/` — check response; may be paginated

When in doubt, always destructure `results` and fall back to the full array:
```typescript
const items = response.data.results ?? response.data ?? [];
```

---

## Fix 8: Complete `.env.local` — all required variables

Create or audit `.env.local` in the project root to ensure all required variables are present:

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_APP_NAME=Acadexis

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-dev-secret-change-in-production
```

Production values (`.env.production`):
```env
NEXT_PUBLIC_API_URL=https://api.acadexis.com
NEXT_PUBLIC_WS_URL=wss://api.acadexis.com
NEXT_PUBLIC_APP_NAME=Acadexis
```

Rules:
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.
- Variables without `NEXT_PUBLIC_` are server-side only — never send secrets to the browser.
- Never commit `.env.local` to version control. Add it to `.gitignore`.

---

## Fix 9: Complete `next.config.js` — image domains, strict mode

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development warnings
  reactStrictMode: true,

  // Allow Next.js <Image> to load images from the backend and S3
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname:  "localhost",
        port:      "8000",
        pathname:  "/media/**",
      },
      {
        protocol: "https",
        hostname:  "*.amazonaws.com",
        pathname:  "/**",
      },
      {
        protocol: "https",
        hostname:  "*.cloudfront.net",
        pathname:  "/**",
      },
    ],
  },

  // Expose NEXT_PUBLIC_ variables explicitly (Next.js 13+ does this automatically
  // but this makes the config self-documenting)
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },
};

module.exports = nextConfig;
```

---

## Fix 10: Central type re-export in `src/types/index.ts`

All type files created in previous prompts should be re-exported from a single `index.ts` so imports are clean:

```typescript
// src/types/index.ts
export * from "./user";
export * from "./course";
export * from "./institution";
export * from "./material";
export * from "./studylab";
export * from "./notification";
export * from "./analytics";
```

After this, any component can import from `@/types` instead of `@/types/course`, `@/types/user`, etc.:

```typescript
// Before (verbose)
import { AuthUser }    from "@/types/user";
import { Course }      from "@/types/course";
import { Notification } from "@/types/notification";

// After (clean)
import { AuthUser, Course, Notification } from "@/types";
```

---

## Fix 11: Global error boundary for API errors

Add a React error boundary that catches unhandled promise rejections from Axios and shows a user-friendly fallback instead of a blank white screen:

```typescript
// src/components/ApiErrorBoundary.tsx
"use client";

import { Component, ReactNode } from "react";

interface Props  { children: ReactNode; }
interface State  { hasError: boolean; message: string; }

export class ApiErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message:  error.message ?? "Something went wrong.",
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
          <h2 className="text-xl font-semibold text-gray-800">
            Something went wrong
          </h2>
          <p className="text-sm text-gray-500 max-w-md text-center">
            {this.state.message}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, message: "" });
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

Wrap the root layout:

```typescript
// src/app/layout.tsx
import { ApiErrorBoundary } from "@/components/ApiErrorBoundary";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ApiErrorBoundary>
          {children}
        </ApiErrorBoundary>
      </body>
    </html>
  );
}
```

---

## Fix 12: Role-based route protection middleware

Add a Next.js middleware file that protects all dashboard routes and redirects unauthenticated users to `/login`:

```typescript
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths through
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow static files and API routes through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api")   ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check for access token in cookies (preferred) or fall through to client-side check
  // Note: localStorage is not accessible in middleware — use a cookie for SSR auth
  const token = request.cookies.get("access_token")?.value;

  if (!token && pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based routing — redirect to correct dashboard if accessing wrong role's area
  // This is a lightweight check; the backend enforces roles authoritatively
  if (token) {
    try {
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );
      const role    = payload.role as string;
      const isExp   = payload.exp * 1000 < Date.now();

      if (isExp) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
      }

      if (role === "student" && pathname.startsWith("/dashboard/lecturer")) {
        return NextResponse.redirect(new URL("/dashboard/student", request.url));
      }
      if (role === "lecturer" && pathname.startsWith("/dashboard/student")) {
        return NextResponse.redirect(new URL("/dashboard/lecturer", request.url));
      }
    } catch {
      // Invalid token — redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

Also update the auth store's login function to store the token in a cookie (in addition to `localStorage`) so the middleware can read it:

```typescript
// In the login handler, after storing to localStorage:
document.cookie = `access_token=${accessToken}; path=/; max-age=${60 * 60}; SameSite=Lax`;
// Clear it on logout:
document.cookie = "access_token=; path=/; max-age=0";
```

---

## General Rules

- Do not add any new features, pages, or UI components in this prompt. Only infrastructure-level fixes.
- The `humps` camelCase/snake_case interceptors handle the entire naming convention automatically. After they are in place, individual service functions do not need to manually convert field names — trust the interceptors.
- The `withCredentials: true` on the Axios instance is required for the `Authorization` header to be sent on cross-origin requests. Without it, every API call will fail in the browser with a CORS error.
- Never read `localStorage` outside of a `typeof window !== "undefined"` guard. SSR will crash otherwise.
- Every paginated list endpoint returns `{ count, next, previous, results }`. Always read from `.results`. The only exceptions are explicitly non-paginated endpoints like `GET /sessions/{id}/messages/` and `GET /courses/mine/`.
- Run `next build` after all fixes to catch TypeScript errors and missing env variable warnings before testing in the browser.
