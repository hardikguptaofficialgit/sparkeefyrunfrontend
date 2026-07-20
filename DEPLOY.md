# Sparkeefy Frontend — Vercel Deploy

Frontend-only repo. Backend runs on a **DigitalOcean Droplet** (separate repo).

---

## 1. Repo setup

Copy the `frontend/` folder contents to the root of `sparkeefy-frontend` GitHub repo:

```
frontend-repo/
├── src/
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── vercel.json
├── .env.example
└── DEPLOY.md
```

---

## 2. Vercel project

1. [vercel.com](https://vercel.com) → **Add New Project**
2. Import `sparkeefy-frontend` repo
3. **Framework:** Vite
4. **Build command:** `npm run build`
5. **Output directory:** `dist`
6. Deploy

`vercel.json` is included for:
- React Router SPA rewrites
- Security headers (X-Frame-Options, nosniff, etc.)

---

## 3. Environment variables

**Vercel → Settings → Environment Variables**

| Variable | Production value | Notes |
|----------|------------------|-------|
| `VITE_API_URL` | `https://api.yourdomain.com/v1` | Your Droplet API URL |

Apply to **Production**, **Preview**, and **Development** (use different backend URLs if needed).

**Never add backend secrets here** — no `GROQ_API_KEY`, no `DATABASE_URL`.

After changing env vars → **Redeploy**.

---

## 4. Custom domain (optional)

Vercel → **Domains** → add `app.yourdomain.com`

Then update backend `FRONTEND_URL` to include:
```
https://app.yourdomain.com,https://your-app.vercel.app
```

Restart backend: `pm2 restart sparkeefy-api`

---

## 5. Verify connection

1. Open your Vercel URL
2. Settings → **Use Demo Account** (`demo-user`) if backend was seeded
3. Create a person or run Wingman
4. Browser DevTools → Network → API calls should go to your Droplet URL (not localhost)

---

## 6. Local development

```bash
cp .env.example .env
npm install
npm run dev
```

`.env`:
```
VITE_API_URL=http://localhost:4000/v1
```

Backend must be running locally on port 4000.

---

## Security notes

- Only `VITE_*` vars are embedded in the browser bundle — safe for public API URL only
- Never put secrets in `VITE_` variables
- Frontend sends `x-user-id` header (dev auth) — replace with JWT before public production launch
