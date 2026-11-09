# A Little Something for Selaelo ♡

A bespoke interactive romantic digital letter and Pinterest-inspired scrapbook asking **Selaelo Phosa** on a first date to **44 Stanley, Johannesburg**.

---

## 1. Experience Overview & User Journey

The application is designed as a continuous, choreographed five-stage experience:

1. **Stage 1 — The Envelope (`src/sections/Introduction.tsx`, `src/components/Envelope.tsx`)**
   - Warm ivory cotton paper surface with pressed white lilies, a handwritten `"For Selaelo"` recipient label, and an embossed deep-burgundy & champagne-gold wax seal.
   - Clicking/tapping breaks the wax seal, opens the envelope flap in 3D perspective, slides the letter out, and transitions smoothly to Stage 2.
2. **Stage 2 — The Personal Letter (`src/sections/PersonalLetter.tsx`, `src/components/Letter.tsx`)**
   - Handwritten-style stationery note with progressive paragraph reveal, subtle coffee-ring watermark, and `"With a little intention, Andile."` sign-off.
3. **Stage 3 — The Scrapbook (`src/sections/MemoryScrapbook.tsx`, `src/components/Scrapbook.tsx`, `src/components/Polaroid.tsx`)**
   - Two Polaroid-style photographs (`public/images/selaelo-photo.jpg` and `public/images/together-photo.jpg`) with realistic paper shadows, translucent washi tape, pressed white lily stickers, and editable handwritten captions.
   - Three subtle margin annotations (caffeine & SQL queries, peer-reviewed Data Analytics observation, and a champagne-gold chain link detail).
4. **Stage 4 — The Date Invitation (`src/sections/DateInvitation.tsx`, `src/components/InvitationCard.tsx`, `src/components/ResponseButtons.tsx`)**
   - Letterpress-inspired cream invitation card with corner white lily engravings, burgundy serif typography, and structured details (`44 Stanley, Johannesburg`, `Dinner followed by a movie.`, `[CONFIGURABLE DATE]`, `[CONFIGURABLE TIME]`).
   - Three stationary, equally accessible, respectful response buttons:
     - `"Yes, I'd love to! ♡"`
     - `"Maybe, let's see..."`
     - `"No, thank you."`
5. **Stage 5 & 6 — Response Experiences & Personal Closing (`src/sections/ResponseExperience.tsx`, `src/components/Celebration.tsx`, `src/components/ClosingMessage.tsx`)**
   - **YES**: Celebratory floating white lily petals & champagne flecks, keepsake itinerary summary, and a `"Let's plan our evening."` CTA that opens WhatsApp with a pre-populated message.
   - **MAYBE**: Warm, zero-pressure confirmation with an optional WhatsApp chat link.
   - **NO**: Gentle, respectful appreciation message with zero guilt or pressure.
   - **Personal Closing**: `"Made with a little creativity, a little caffeine, and genuine intention. — Andile"`

---

## 2. Pre-Deployment Personalisation Checklist (Requires Your Input)

All personal details are centralised in a single file: **`src/config/invitation.ts`**.

Before deploying to production, update the following items:

| Item | Location | Current Placeholder | Action Required |
|---|---|---|---|
| **1. Proposed Date** | `src/config/invitation.ts` (`dateDetails.proposedDate`) | `"[CONFIGURABLE DATE]"` | Replace with your proposed date (e.g., `"Saturday, 21 November 2026"`). |
| **2. Proposed Time** | `src/config/invitation.ts` (`dateDetails.proposedTime`) | `"[CONFIGURABLE TIME]"` | Replace with your proposed time (e.g., `"18:30"`). |
| **3. WhatsApp Number** | `src/config/invitation.ts` (`sender.whatsappNumber`) | `"27000000000"` | Replace with your phone number in international digits-only format (e.g., `"27821234567"`). |
| **4. Notification Email** | `src/config/invitation.ts` (`sender.notificationEmail`) & Supabase Secrets | `"andile@example.com"` | Replace with your email address and set `NOTIFICATION_EMAIL` in Supabase Edge Function secrets. |
| **5. Selaelo's Photograph** | `public/images/selaelo-photo.jpg` | Bespoke monogram placeholder JPEG | Overwrite `public/images/selaelo-photo.jpg` with your photo of Selaelo. |
| **6. Photo Together** | `public/images/together-photo.jpg` | Bespoke monogram placeholder JPEG | Overwrite `public/images/together-photo.jpg` with your photo together. |

---

## 3. Local Development & Testing Instructions

### Install & Run Development Server

```bash
npm install
npm run dev
```

### Run Automated Tests, TypeScript Verification & Production Build

```bash
# TypeScript type-checking
npm run lint

# Run Vitest unit & integration test suite
npm test

# Build production bundle to ./dist
npm run build

# Preview production build locally
npm run preview
```

---

## 4. Backend Setup (Supabase PostgreSQL + Edge Function + Resend)

Because GitHub Pages is static hosting, response persistence and email notifications are handled securely by **Supabase** and **Resend**.

### Step 1: Create a Supabase Project & Database Table

1. Create a new project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase Dashboard and execute the migration file:
   - `supabase/migrations/20261109000000_create_date_invitation_responses.sql`
   - Or run via the Supabase CLI:
     ```bash
     supabase db push
     ```
   This creates the `public.date_invitation_responses` table with Row Level Security (RLS) enabled and public read/update/delete revoked.

### Step 2: Configure Server-Side Secrets & Deploy the Edge Function

1. Create an API key at [resend.com](https://resend.com).
2. Link your Supabase project and set the server-side secrets (these are **never** exposed in frontend code):
   ```bash
   supabase login
   supabase link --project-ref <your-project-ref>

   supabase secrets set RESEND_API_KEY=re_your_resend_api_key
   supabase secrets set NOTIFICATION_EMAIL=your-real-email@example.com
   supabase secrets set RESEND_FROM_EMAIL="A Little Something for Selaelo <onboarding@resend.dev>"
   supabase secrets set EXPECTED_INVITATION_ID="selaelo-first-date-44-stanley"
   ```
   *(Note: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are automatically provided by the Supabase Edge runtime.)*
3. Deploy the `submit-response` Edge Function:
   ```bash
   supabase functions deploy submit-response --no-verify-jwt
   ```

### Step 3: Configure Frontend Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in your public Supabase URL and Anon Key from **Supabase Dashboard → Project Settings → API**:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key
   ```

> **Important Honesty Guarantee:** Until `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured and the Edge Function responds with HTTP 200, the app will **never** falsely claim that a response was recorded or emailed. During local development without credentials, clicking a response button displays a transparent status notice with a `"Preview experience (Unrecorded demo mode)"` button so you can inspect all three screens (`YES`, `MAYBE`, `NO`).

---

## 5. GitHub Pages Deployment Instructions

A complete GitHub Actions workflow is pre-configured at `.github/workflows/deploy.yml`.

1. Push this repository to GitHub (on the `main` branch).
2. In your GitHub repository, navigate to **Settings → Pages**:
   - Under **Build and deployment → Source**, select **GitHub Actions**.
3. Navigate to **Settings → Secrets and variables → Actions → Secrets** and add two Repository Secrets:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Public Anon Key
   *(Never add `SUPABASE_SERVICE_ROLE_KEY` or `RESEND_API_KEY` to GitHub frontend build secrets — those remain exclusively in Supabase Edge Function secrets.)*
4. Push to `main` (or trigger **Deploy to GitHub Pages** manually from the **Actions** tab). Your live site URL will be displayed in the workflow run output.

