# auth-addon

Frontend Add-On for the NextJS-Go Template. Handles authentication — login form, JWT session, user context, and server-side user hydration.

**Backend dependency:** [`auth-service`](https://github.com/Mognus/auth-service) — gRPC microservice running on `AUTH_SERVICE_ADDR` (default `localhost:50051`), exposed via the backend API gateway at `/api/auth/`.

---

## What's included

```
frontend/
  components/
    LoginForm.tsx       ← Login form with validation (react-hook-form + zod)
    UserInfo.tsx        ← Displays current user info
  context/
    AuthContext.tsx     ← AuthProvider + useAuth hook
  lib/
    api.ts              ← Client-side: login, logout, me
    api-server.ts       ← Server-side: fetch current user for SSR
  pages/
    login.tsx           ← Full login page component (default export)
  types/
    index.ts            ← User, Role, LoginRequest, AuthResponse
  index.ts              ← Barrel export
```

---

## Setup

### 1. Add as submodule

```bash
git submodule add https://github.com/Mognus/auth-addon frontend/addons/auth-addon
```

### 2. Register the provider

In `frontend/addons/providers.tsx`, add `AuthProvider` to the provider chain. It requires `initialUser` fetched server-side:

```tsx
import { AuthProvider } from "./auth-addon/frontend";
import type { User } from "./auth-addon/frontend";

// In ModuleProviders (Server Component):
const token = cookieStore.get("access_token")?.value;
if (token && !isJwtExpired(token)) {
    initialUser = await serverFetch<User>("/auth/me", { withAuth: true, authToken: token });
}

return (
    <AuthProvider initialUser={initialUser}>
        {children}
    </AuthProvider>
);
```

### 3. Add the login route

```tsx
// app/[locale]/(standalone)/login/page.tsx
export { default } from "@/addons/auth-addon/frontend/pages/login";
```

### 4. Use in components

```tsx
import { useAuth } from "@/addons/auth-addon/frontend";

const { user, isAdmin } = useAuth();
```

---

## Environment

The backend API gateway must expose:

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/login` | POST | Login, sets `access_token` cookie |
| `/api/auth/logout` | POST | Clears session |
| `/api/auth/me` | GET | Returns current user |
| `/api/auth/refresh` | POST | Rotates access token |
