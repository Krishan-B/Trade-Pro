-- Migration: Consolidated schema changes

-- Create Tables
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  experience_level VARCHAR(50) CHECK (experience_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_verified BOOLEAN DEFAULT FALSE,
  kyc_status VARCHAR(50) DEFAULT 'PENDING' CHECK (kyc_status IN ('PENDING', 'APPROVED', 'REJECTED')),
  preferences JSONB
);

CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  account_type VARCHAR(50) CHECK (account_type IN ('DEMO', 'COMPETITION')),
  balance DECIMAL(15,2) DEFAULT 0.00,
  equity DECIMAL(15,2) GENERATED ALWAYS AS (balance + unrealized_pnl) STORED,
  margin_used DECIMAL(15,2) DEFAULT 0.00,
  unrealized_pnl DECIMAL(15,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reset_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  asset_class VARCHAR(50) CHECK (asset_class IN ('FOREX', 'STOCKS', 'INDICES', 'COMMODITIES', 'CRYPTO')),
  base_currency VARCHAR(10),
  quote_currency VARCHAR(10),
  is_active BOOLEAN DEFAULT TRUE,
  leverage_max INTEGER,
  spread_base DECIMAL(8,5),
  contract_size DECIMAL(15,2) DEFAULT 1.00
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id),
  asset_id UUID REFERENCES assets(id),
  order_type VARCHAR(50) CHECK (order_type IN ('MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT')),
  side VARCHAR(4) CHECK (side IN ('BUY', 'SELL')),
  quantity DECIMAL(15,4) NOT NULL,
  price DECIMAL(15,5),
  stop_price DECIMAL(15,5),
  status VARCHAR(50) CHECK (status IN ('PENDING', 'FILLED', 'CANCELLED', 'REJECTED')),
  filled_quantity DECIMAL(15,4) DEFAULT 0,
  avg_fill_price DECIMAL(15,5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  filled_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id),
  asset_id UUID REFERENCES assets(id),
  side VARCHAR(5) CHECK (side IN ('LONG', 'SHORT')),
  quantity DECIMAL(15,4) NOT NULL,
  entry_price DECIMAL(15,5) NOT NULL,
  current_price DECIMAL(15,5),
  leverage INTEGER,
  margin_required DECIMAL(15,2),
  unrealized_pnl DECIMAL(15,2),
  rollover_charges DECIMAL(15,2) DEFAULT 0.00,
  take_profit DECIMAL(15,5),
  stop_loss DECIMAL(15,5),
  opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    educator_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES auth.users(id) NOT NULL,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, course_id)
);

CREATE TABLE IF NOT EXISTS lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
    completed_at TIMESTAMPTZ,
    UNIQUE(enrollment_id, lesson_id)
);

-- Alterations
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='kyc_documents' AND column_name='document_type' AND data_type='text') THEN
    ALTER TABLE public.kyc_documents ALTER COLUMN document_type TYPE VARCHAR(255);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='title' AND data_type='text') THEN
    ALTER TABLE public.courses ALTER COLUMN title TYPE VARCHAR(255);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='description' AND data_type='text') THEN
    ALTER TABLE public.courses ALTER COLUMN description TYPE VARCHAR(255);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lessons' AND column_name='title' AND data_type='text') THEN
    ALTER TABLE public.lessons ALTER COLUMN title TYPE VARCHAR(255);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lessons' AND column_name='content' AND data_type='text') THEN
    ALTER TABLE public.lessons ALTER COLUMN content TYPE VARCHAR(255);
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lessons' AND column_name='order') THEN
    ALTER TABLE public.lessons RENAME COLUMN "order" TO lesson_order;
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_account_id ON public.orders(account_id);
CREATE INDEX IF NOT EXISTS idx_orders_asset_id ON public.orders(asset_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON public.enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON public.enrollments(course_id);

-- RLS
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

-- Policies
DROP POLICY IF EXISTS "Allow individual read access on accounts" ON public.accounts;
CREATE POLICY "Allow individual read access on accounts" ON public.accounts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow individual update access on accounts" ON public.accounts;
CREATE POLICY "Allow individual update access on accounts" ON public.accounts FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow read access on assets to authenticated users" ON public.assets;
CREATE POLICY "Allow read access on assets to authenticated users" ON public.assets FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow individual access on kyc_documents" ON public.kyc_documents;
CREATE POLICY "Allow individual access on kyc_documents" ON public.kyc_documents FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow individual access on orders" ON public.orders;
CREATE POLICY "Allow individual access on orders" ON public.orders FOR ALL USING (
  EXISTS (
    SELECT 1
    FROM accounts
    WHERE accounts.id = orders.account_id AND accounts.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Allow individual access on positions" ON public.positions;
CREATE POLICY "Allow individual access on positions" ON public.positions FOR ALL USING (
  EXISTS (
    SELECT 1
    FROM accounts
    WHERE accounts.id = positions.account_id AND accounts.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Allow individual read access on users" ON public.users;
CREATE POLICY "Allow individual read access on users" ON public.users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow individual update access on users" ON public.users;
CREATE POLICY "Allow individual update access on users" ON public.users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Allow read access on courses to authenticated users" ON public.courses;
CREATE POLICY "Allow read access on courses to authenticated users" ON public.courses FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow read access on lessons to authenticated users" ON public.lessons;
CREATE POLICY "Allow read access on lessons to authenticated users" ON public.lessons FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow individual access on enrollments" ON public.enrollments;
CREATE POLICY "Allow individual access on enrollments" ON public.enrollments FOR ALL USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Allow individual access on lesson_progress" ON public.lesson_progress;
CREATE POLICY "Allow individual access on lesson_progress" ON public.lesson_progress FOR ALL USING (
  EXISTS (
    SELECT 1
    FROM enrollments
    WHERE enrollments.id = lesson_progress.enrollment_id AND enrollments.student_id = auth.uid()
  )
);