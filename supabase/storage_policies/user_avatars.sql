DROP POLICY IF EXISTS "Allow authenticated users to upload avatars" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow users to view their own avatars" ON storage.objects;
CREATE POLICY "Allow users to view their own avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars' AND owner_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Allow users to update their own avatars" ON storage.objects;
CREATE POLICY "Allow users to update their own avatars"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND owner_id::text = auth.uid()::text);