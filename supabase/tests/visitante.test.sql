-- Visitante sem login (role anon): vê peladas públicas e suas listas, nunca as privadas.
-- Rodar sobre o seed. Esperado: erro "RESULTADO: visitante OK (...)".
do $$
declare v_matches int; v_private int; v_part int;
begin
  set local role anon;
  select count(*) into v_matches from public.matches;
  select count(*) into v_private from public.matches where not is_public;
  select count(*) into v_part from public.match_participants mp join public.matches m on m.id = mp.match_id where m.code = 'seedsexta1';
  reset role;
  if v_matches = 10 and v_private = 0 and v_part = 12 then
    raise exception 'RESULTADO: visitante OK (% públicas, % privadas, % na lista)', v_matches, v_private, v_part;
  else
    raise exception 'FALHOU: visitante viu % peladas, % privadas, % na lista', v_matches, v_private, v_part;
  end if;
end $$;
