-- ============================================================
--  Photo storage access rules.
--  RUN THIS *AFTER* you've created a bucket named "photos"
--  in Supabase → Storage → New bucket (set it to Public).
-- ============================================================

drop policy if exists "photos public read" on storage.objects;
create policy "photos public read" on storage.objects
  for select using (bucket_id = 'photos');

drop policy if exists "photos owner upload" on storage.objects;
create policy "photos owner upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "photos owner delete" on storage.objects;
create policy "photos owner delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
