-- Allow users to upload and read their own KYC files
-- Policy: Only allow authenticated users to access their own files

-- Storage policies must be set in the Supabase dashboard for fine-grained control.
-- Here is a recommended policy for the 'kyc' bucket:
--
-- (In Supabase Dashboard > Storage > kyc > Policies > New Policy)
--
-- Name: Only owner can access
-- Definition:
--   (auth.uid() = storage.objects.owner)
-- Actions: select, insert, update, delete
--
-- For public access to admins, you can add an admin role check as needed.

-- You can also automate this with the CLI or SQL if needed, but dashboard is recommended for storage policies.
