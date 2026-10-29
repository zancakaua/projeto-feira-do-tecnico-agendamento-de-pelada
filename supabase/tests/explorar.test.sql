-- Testes da busca do Explorar, como visitante sem login. Rodar sobre o seed.
-- Esperado: erro "RESULTADO: 7/7 testes passaram." (falhas aparecem listadas no fim da mensagem).
do $$
declare
  v_ok int := 0;
  v_total int := 0;
  v_codes text;
  t timestamptz := now();
  v_fail text := '';
begin
  set local role anon;

  -- Cidade sem acento acha JF; privada, cancelada e passadas ficam de fora
  v_total := v_total + 1;
  select string_agg(code, ',' order by code) into v_codes from public.explore_matches('juiz de fora', t);
  if v_codes = 'seedareia1,seedcampo1,seedfutsal,seedgranbe,seedsexta1' then v_ok := v_ok + 1;
  else v_fail := v_fail || ' cidade=' || coalesce(v_codes, '-'); end if;

  -- Bairro sem acento
  v_total := v_total + 1;
  select string_agg(code, ',') into v_codes from public.explore_matches('Juiz de Fora', t, p_neighborhood => 'sao mateus');
  if v_codes = 'seedfutsal' then v_ok := v_ok + 1; else v_fail := v_fail || ' bairro=' || coalesce(v_codes, '-'); end if;

  -- Tipo de quadra
  v_total := v_total + 1;
  select string_agg(code, ',' order by code) into v_codes
    from public.explore_matches('Juiz de Fora', t, p_courts => array['areia','campo']::public.court_type[]);
  if v_codes = 'seedareia1,seedcampo1' then v_ok := v_ok + 1; else v_fail := v_fail || ' quadra=' || coalesce(v_codes, '-'); end if;

  -- Precisa de goleiro: campo está completo e areia não tem vaga de goleiro
  v_total := v_total + 1;
  select string_agg(code, ',' order by code) into v_codes from public.explore_matches('Juiz de Fora', t, p_need_goalkeeper => true);
  if v_codes = 'seedfutsal,seedgranbe,seedsexta1' then v_ok := v_ok + 1; else v_fail := v_fail || ' goleiro=' || coalesce(v_codes, '-'); end if;

  -- Até R$ 15 e nível iniciante (pelada sem nível definido também serve)
  v_total := v_total + 1;
  select string_agg(code, ',' order by code) into v_codes
    from public.explore_matches('Juiz de Fora', t, p_max_price => 1500, p_level => 'iniciante');
  if v_codes = 'seedcampo1,seedfutsal' then v_ok := v_ok + 1; else v_fail := v_fail || ' preco=' || coalesce(v_codes, '-'); end if;

  -- Busca por texto sem acento, no nome do local
  v_total := v_total + 1;
  select string_agg(code, ',') into v_codes from public.explore_matches('Juiz de Fora', t, p_q => 'ginasio');
  if v_codes = 'seedfutsal' then v_ok := v_ok + 1; else v_fail := v_fail || ' busca=' || coalesce(v_codes, '-'); end if;

  -- Contagens batem com a lista
  v_total := v_total + 1;
  if exists (select 1 from public.explore_matches('Juiz de Fora', t) where code = 'seedareia1' and linha = 8 and espera = 2)
  then v_ok := v_ok + 1; else v_fail := v_fail || ' contagem'; end if;

  reset role;
  raise exception 'RESULTADO: %/% testes passaram.%', v_ok, v_total, v_fail;
end $$;
