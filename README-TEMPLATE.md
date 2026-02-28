# Next.js Frontend Template

A Next.js frontend template designed to work with a separate Laravel API backend. Supports both cookie-based and token-based authentication via Laravel Sanctum.

## Setup

```bash
npm install
cp .env.example .env.local
```

Configure `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AUTH_MODE=cookie
```

## Auth Modes

| Mode | When to use | Example |
|------|-------------|---------|
| `cookie` | API and frontend share the same domain | `localhost:8000` + `localhost:3000`, or `api.domain.com` + `domain.com` |
| `token` | API and frontend are on different domains | `laravel-next.test` (Herd) + `localhost:3000` |

### Cookie mode

- Uses session cookies and CSRF protection
- Requires same top-level domain (e.g. `api.domain.com` and `domain.com`)
- Middleware can protect routes server-side

### Token mode

- Uses Bearer tokens stored in sessionStorage
- Works across different domains (e.g. Herd + localhost)
- Route protection is client-side (middleware passes through)

## Local Development

### With Laravel Herd (token mode)

1. Run Laravel via Herd at `laravel-next.test` (or your project's `.test` domain)
2. Set `NEXT_PUBLIC_API_URL=https://laravel-next.test` and `NEXT_PUBLIC_AUTH_MODE=token`
3. Run this frontend: `npm run dev` (port 3000)

### With php artisan serve (cookie mode)

1. Run Laravel: `php artisan serve` (port 8000)
2. Set `NEXT_PUBLIC_API_URL=http://localhost:8000` and `NEXT_PUBLIC_AUTH_MODE=cookie`
3. Ensure Laravel `.env` has `SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,...` and `CORS_ALLOWED_ORIGINS=http://localhost:3000`
4. Run this frontend: `npm run dev` (port 3000)

## Auth Flow

**Cookie mode:** CSRF cookie → login/register → session cookie → subsequent requests include credentials

**Token mode:** POST to `/api/v1/tokens/issue` → store token → send `Authorization: Bearer` on subsequent requests

## Production

- Set `NEXT_PUBLIC_API_URL` to your production API URL (e.g. `https://api.yourdomain.com`)
- Use `cookie` when frontend is at `domain.com` or `app.domain.com` (same domain as API)
- Use `token` when frontend and API are on different domains
