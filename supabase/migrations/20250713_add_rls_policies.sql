-- Policies for accounts
DROP POLICY IF EXISTS "Allow individual read access on accounts" ON public.accounts;
CREATE POLICY "Allow individual read access on accounts" ON public.accounts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow individual update access on accounts" ON public.accounts;
CREATE POLICY "Allow individual update access on accounts" ON public.accounts FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Policies for assets
DROP POLICY IF EXISTS "Allow read access on assets to authenticated users" ON public.assets;
CREATE POLICY "Allow read access on assets to authenticated users" ON public.assets FOR SELECT TO authenticated USING (true);

-- Policies for kyc_documents
DROP POLICY IF EXISTS "Allow individual access on kyc_documents" ON public.kyc_documents;
CREATE POLICY "Allow individual access on kyc_documents" ON public.kyc_documents FOR ALL USING (auth.uid() = user_id);

-- Policies for orders
DROP POLICY IF EXISTS "Allow individual access on orders" ON public.orders;
CREATE POLICY "Allow individual access on orders" ON public.orders FOR ALL USING (
  EXISTS (
    SELECT 1
    FROM accounts
    WHERE accounts.id = orders.account_id AND accounts.user_id = auth.uid()
  )
);

-- Policies for positions
DROP POLICY IF EXISTS "Allow individual access on positions" ON public.positions;
CREATE POLICY "Allow individual access on positions" ON public.positions FOR ALL USING (
  EXISTS (
    SELECT 1
    FROM accounts
    WHERE accounts.id = positions.account_id AND accounts.user_id = auth.uid()
  )
);

-- Policies for users
DROP POLICY IF EXISTS "Allow individual read access on users" ON public.users;
CREATE POLICY "Allow individual read access on users" ON public.users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow individual update access on users" ON public.users;
CREATE POLICY "Allow individual update access on users" ON public.users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Policies for courses
DROP POLICY IF EXISTS "Allow read access on courses to authenticated users" ON public.courses;
CREATE POLICY "Allow read access on courses to authenticated users" ON public.courses FOR SELECT TO authenticated USING (true);

-- Policies for lessons
DROP POLICY IF EXISTS "Allow read access on lessons to authenticated users" ON public.lessons;
CREATE POLICY "Allow read access on lessons to authenticated users" ON public.lessons FOR SELECT TO authenticated USING (true);

-- Policies for enrollments
DROP POLICY IF EXISTS "Allow individual access on enrollments" ON public.enrollments;
CREATE POLICY "Allow individual access on enrollments" ON public.enrollments FOR ALL USING (auth.uid() = student_id);

-- Policies for lesson_progress
DROP POLICY IF EXISTS "Allow individual access on lesson_progress" ON public.lesson_progress;
CREATE POLICY "Allow individual access on lesson_progress" ON public.lesson_progress FOR ALL USING (
  EXISTS (
    SELECT 1
    FROM enrollments
    WHERE enrollments.id = lesson_progress.enrollment_id AND enrollments.student_id = auth.uid()
  )
);