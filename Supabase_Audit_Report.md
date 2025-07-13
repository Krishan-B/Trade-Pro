# Supabase Project Audit Report

## 1. Executive Summary

**Overall Status: Critical Issues Found**

This audit has identified several critical and high-risk vulnerabilities that require immediate attention. The most severe issue is the complete absence of Row Level Security (RLS) on all tables, exposing sensitive user data. Additionally, database migration integrity is compromised due to a failed schema drift detection process, and several performance and best-practice recommendations have been noted.

## 2. Migration Status

**Schema Drift: Undetermined**

The command `supabase db diff --linked` failed because Docker Desktop is not running, which is a prerequisite for the Supabase CLI to compare the local and remote schemas.

**Recommendation:**
1.  Install and run Docker Desktop.
2.  Execute `supabase db diff --linked` to identify any schema drift.
3.  If drift is detected, create a new migration file to align the schemas.

## 3. Security Vulnerability Report

### Critical Risk

*   **Issue:** RLS is not enabled on the following tables: `accounts`, `assets`, `kyc_documents`, `orders`, `positions`, `users`, `courses`, `lessons`, `enrollments`, `lesson_progress`.
*   **Risk:** Without RLS, any user with a valid JWT can read, modify, or delete data in these tables, leading to a major data breach.
*   **Remediation:** Enable RLS for each table and define appropriate policies.

```sql
-- Enable RLS for each table
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
-- ... (repeat for all other tables)

-- Example Policy: Users can only see their own account
CREATE POLICY "Allow individual read access on accounts"
ON public.accounts
FOR SELECT
USING (auth.uid() = user_id);
```

### High Risk

*   **Issue:** Storage security policies are not version-controlled and rely on manual configuration in the Supabase dashboard.
*   **Risk:** This can lead to inconsistent or missing security rules, making files in your storage buckets publicly accessible.
*   **Remediation:** Define storage policies in `supabase/storage_policies/` and deploy them.

```sql
-- Example: supabase/storage_policies/user_avatars.sql
CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
```

## 4. Configuration & Performance Recommendations

### Database Schema

*   **Issue:** Inefficient `text` data type used in `kyc_documents`, `courses`, and `lessons`.
*   **Recommendation:** Use `VARCHAR(255)` for columns with a known maximum length to improve performance.

```sql
ALTER TABLE public.kyc_documents
ALTER COLUMN document_type TYPE VARCHAR(255);
```

*   **Issue:** The `lessons` table has a column named `"order"`, which is a reserved SQL keyword.
*   **Recommendation:** Rename the column to avoid potential conflicts.

```sql
ALTER TABLE public.lessons
RENAME COLUMN "order" TO lesson_order;
```

### Missing Indexes

*   **Issue:** Missing indexes on foreign keys and frequently queried columns.
*   **Recommendation:** Create indexes to improve query performance.

```sql
-- Example for the orders table
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_asset_id ON public.orders(asset_id);

-- Example for the enrollments table
CREATE INDEX idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON public.enrollments(course_id);
```

### Configuration (`config.toml`)

*   **Issue:** Default settings are used for auth, email, and JWT expiration.
*   **Recommendation:** Customize these settings to match your application's security requirements. For example, reduce the JWT expiration time.

```toml
# supabase/config.toml
[auth]
jwt_expiry = 3600 # 1 hour