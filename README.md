# USDT Daily Rewards — source starter
This is a Next.js + Supabase starter, not an audited live financial service.

## Requirements
- Node.js 20+
- A Supabase project
- Hosting provider account (choose after legal review)

## Setup
1. Create a Supabase project.
2. Run `supabase/schema.sql` in Supabase SQL Editor.
3. Copy `.env.example` to `.env.local`, and fill the Supabase project URL and anon/public key.
4. Run `npm install` then `npm run dev`; open http://localhost:3000.
5. Register your own account. To make it the admin, run in SQL Editor:
   `update public.profiles set role='admin' where email='YOUR_EMAIL';`

Never expose a service-role key, wallet seed phrase, or private key.
The package catalog is inactive by default, and the site is paused by default.
Do not activate packages or accept real funds until the return model is verified, legally reviewed, and fully funded. This app does not calculate guaranteed daily returns or send payouts.

## Pause/resume
As admin, use the site control in the app, or run:
`update public.site_settings set paused=true where id=1;`
`update public.site_settings set paused=false where id=1;`

Before live launch: configure HTTPS/domain and auth redirect URLs; test RLS with multiple accounts; verify TXIDs independently on a trusted TRON explorer; add rate limiting, monitoring, backups, privacy/terms/refund policy, and independent security review.
