-- A política de leitura de peladas chama is_in_match(); sem EXECUTE para anon,
-- visitante sem login não conseguia ler nem as peladas públicas.
-- Para anon, auth.uid() é null e a função sempre devolve false.
grant execute on function public.is_in_match(uuid) to anon;
