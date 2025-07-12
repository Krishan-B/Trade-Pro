-- Migration: Create kyc_documents table for KYC system
create table if not exists public.kyc_documents (
  user_id uuid primary key references auth.users(id),
  id_url text,
  address_url text,
  status text default 'unverified',
  submitted_at timestamptz default now(),
  reviewed_at timestamptz,
  reviewer_id uuid,
  rejection_reason text
);
