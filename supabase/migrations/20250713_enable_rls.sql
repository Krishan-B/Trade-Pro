DO $$
BEGIN
  IF NOT (SELECT c.relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'accounts' AND n.nspname = 'public') THEN
    ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
  END IF;
  IF NOT (SELECT c.relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'assets' AND n.nspname = 'public') THEN
    ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
  END IF;
  IF NOT (SELECT c.relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'kyc_documents' AND n.nspname = 'public') THEN
    ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
  END IF;
  IF NOT (SELECT c.relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'orders' AND n.nspname = 'public') THEN
    ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
  END IF;
  IF NOT (SELECT c.relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'positions' AND n.nspname = 'public') THEN
    ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
  END IF;
  IF NOT (SELECT c.relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'users' AND n.nspname = 'public') THEN
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
  END IF;
  IF NOT (SELECT c.relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'courses' AND n.nspname = 'public') THEN
    ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
  END IF;
  IF NOT (SELECT c.relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'lessons' AND n.nspname = 'public') THEN
    ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
  END IF;
  IF NOT (SELECT c.relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'enrollments' AND n.nspname = 'public') THEN
    ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
  END IF;
  IF NOT (SELECT c.relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'lesson_progress' AND n.nspname = 'public') THEN
    ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;