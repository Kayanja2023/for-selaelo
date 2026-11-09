-- ============================================================================
-- SUPABASE POSTGRESQL SCHEMA: "A Little Something for Selaelo"
-- Table: public.date_invitation_responses
-- ============================================================================

create extension if not exists "pgcrypto";

create table if not exists public.date_invitation_responses (
  id uuid primary key default gen_random_uuid(),
  response text not null check (response in ('YES', 'MAYBE', 'NO')),
  recipient text not null default 'Selaelo Phosa',
  invitation_id text not null,
  created_at timestamptz not null default now(),
  source text not null default 'Website'
);

comment on table public.date_invitation_responses is
  'Stores Selaelo Phosa''s response (YES, MAYBE, or NO) to the bespoke digital date invitation.';

-- Index for quick lookup by invitation_id and chronological sorting
create index if not exists idx_date_invitation_responses_invitation_created
  on public.date_invitation_responses (invitation_id, created_at desc);

-- ============================================================================
-- SECURITY & ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- Enable RLS and block public read/update/delete access so no administrative
-- data is exposed publicly. All validated inserts are processed through the
-- `submit-response` Supabase Edge Function.
alter table public.date_invitation_responses enable row level security;

-- Explicitly revoke public select/update/delete from anon role
revoke select, update, delete on public.date_invitation_responses from anon;

