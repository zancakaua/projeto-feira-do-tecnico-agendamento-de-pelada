-- Upload com upsert precisa enxergar o próprio arquivo (o Storage confere se já existe)
create policy "avatar: dono lê" on storage.objects for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
