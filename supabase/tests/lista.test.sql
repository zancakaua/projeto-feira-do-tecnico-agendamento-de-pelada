-- Testes das regras da lista (rodar sobre o seed).
-- Tudo roda dentro de um bloco que termina com exceção: nada fica gravado.
-- Resultado esperado: erro "RESULTADO: n/n testes passaram".
-- Qualquer falha aparece como "FALHOU: <teste>".

create or replace function pg_temp.as_user(p_nick text) returns void language plpgsql as $$
declare v uuid := (select id from public.profiles where nickname = p_nick);
begin
  if v is null then raise exception 'apelido % não existe no seed', p_nick; end if;
  perform set_config('request.jwt.claim.sub', v::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v, 'role', 'authenticated')::text, true);
end $$;

create or replace function pg_temp.status_of(p_code text, p_nick text) returns text language sql as $$
  select mp.status::text from public.match_participants mp
  join public.matches m on m.id = mp.match_id
  join public.profiles p on p.id = mp.user_id
  where m.code = p_code and p.nickname = p_nick
$$;

do $$
declare
  v_ok int := 0;
  v_total int := 0;
  v_res text;
  v_err text;
  v_match uuid;
begin
  -- 1. Lista cheia: quem entra vai pra espera
  v_total := v_total + 1;
  perform pg_temp.as_user('pedrinho');
  v_res := public.join_match('seedareia1', 'linha');
  if v_res = 'espera' then v_ok := v_ok + 1; else raise warning 'FALHOU: lotada -> espera (veio %)', v_res; end if;

  -- 2. Entrar de novo não duplica nem muda a posição
  v_total := v_total + 1;
  v_res := public.join_match('seedareia1', 'linha');
  if v_res = 'espera' and (select count(*) from public.match_participants mp join public.matches m on m.id = mp.match_id
                           where m.code = 'seedareia1' and mp.status = 'espera') = 3
  then v_ok := v_ok + 1; else raise warning 'FALHOU: entrar duas vezes é idempotente'; end if;

  -- 3. Confirmado sai: o primeiro da espera (jvzinho) sobe e recebe aviso
  v_total := v_total + 1;
  perform pg_temp.as_user('vini');
  perform public.leave_match('seedareia1');
  if pg_temp.status_of('seedareia1', 'vini') = 'saiu'
     and pg_temp.status_of('seedareia1', 'jvzinho') = 'confirmado'
     and pg_temp.status_of('seedareia1', 'lari') = 'espera'
     and exists (select 1 from public.notifications n join public.profiles p on p.id = n.user_id
                 where p.nickname = 'jvzinho' and n.kind = 'promovido')
  then v_ok := v_ok + 1; else raise warning 'FALHOU: saída promove o primeiro da fila'; end if;

  -- 4. Goleiro em pelada sem vaga de goleiro é recusado
  v_total := v_total + 1;
  perform pg_temp.as_user('paredao');
  begin
    perform public.join_match('seedareia1', 'goleiro');
    raise warning 'FALHOU: goleiro sem vaga deveria ser recusado';
  exception when sqlstate 'P0001' then v_ok := v_ok + 1;
  end;

  -- 5. Quem não organiza não marca pagamento
  v_total := v_total + 1;
  perform pg_temp.as_user('anaclara');
  select id into v_match from public.matches where code = 'seedsexta1';
  begin
    perform public.set_paid(v_match, (select id from public.profiles where nickname = 'rafinha'), true);
    raise warning 'FALHOU: não-organizador marcou pagamento';
  exception when sqlstate '42501' then v_ok := v_ok + 1;
  end;

  -- 6. Organizador marca pagamento
  v_total := v_total + 1;
  perform pg_temp.as_user('tigrao');
  perform public.set_paid(v_match, (select id from public.profiles where nickname = 'rafinha'), true);
  if (select paid from public.match_participants where match_id = v_match
      and user_id = (select id from public.profiles where nickname = 'rafinha'))
  then v_ok := v_ok + 1; else raise warning 'FALHOU: organizador marca pagamento'; end if;

  -- 7. Removido não volta pela própria conta
  v_total := v_total + 1;
  perform public.remove_participant(v_match, (select id from public.profiles where nickname = 'pedrinho'));
  perform pg_temp.as_user('pedrinho');
  begin
    perform public.join_match('seedsexta1', 'linha');
    raise warning 'FALHOU: removido conseguiu voltar';
  exception when sqlstate '42501' then
    if exists (select 1 from public.notifications n join public.profiles p on p.id = n.user_id
               where p.nickname = 'pedrinho' and n.kind = 'removido')
    then v_ok := v_ok + 1; else raise warning 'FALHOU: removido sem aviso'; end if;
  end;

  -- 8. Diminuir vagas abaixo dos confirmados é bloqueado
  v_total := v_total + 1;
  perform pg_temp.as_user('tigrao');
  begin
    update public.matches set field_slots = 5 where id = v_match;
    raise warning 'FALHOU: vagas abaixo dos confirmados';
  exception when sqlstate 'P0001' then v_ok := v_ok + 1;
  end;

  -- 9. Aumentar vagas promove a fila (areia: lari ainda na espera)
  v_total := v_total + 1;
  update public.matches set field_slots = 9 where code = 'seedareia1';
  if pg_temp.status_of('seedareia1', 'lari') = 'confirmado'
  then v_ok := v_ok + 1; else raise warning 'FALHOU: mais vagas promove fila'; end if;

  -- 10. Desistência depois do prazo é bloqueada
  v_total := v_total + 1;
  update public.matches set starts_at = now() + interval '1 hour', leave_deadline_hours = 2 where code = 'seedareia1';
  perform pg_temp.as_user('teteu');
  begin
    perform public.leave_match('seedareia1');
    raise warning 'FALHOU: saiu depois do prazo';
  exception when sqlstate 'P0001' then v_ok := v_ok + 1;
  end;

  -- 11. Mudança de horário avisa os inscritos
  v_total := v_total + 1;
  if exists (select 1 from public.notifications n join public.profiles p on p.id = n.user_id
             where p.nickname = 'teteu' and n.kind = 'alterada')
  then v_ok := v_ok + 1; else raise warning 'FALHOU: alteração gera aviso'; end if;

  -- 12. Cancelar avisa todos os inscritos, menos quem organiza
  v_total := v_total + 1;
  perform pg_temp.as_user('tigrao');
  perform public.cancel_match(v_match, 'Choveu demais');
  if (select count(*) from public.notifications where match_id = v_match and kind = 'cancelada')
     = (select count(*) from public.match_participants where match_id = v_match
        and status in ('confirmado', 'espera') and user_id <> (select id from public.profiles where nickname = 'tigrao'))
  then v_ok := v_ok + 1; else raise warning 'FALHOU: cancelamento avisa inscritos'; end if;

  -- 13. Pelada cancelada não aceita inscrição
  v_total := v_total + 1;
  perform pg_temp.as_user('lari');
  begin
    perform public.join_match('seedsexta1', 'linha');
    raise warning 'FALHOU: entrou em pelada cancelada';
  exception when sqlstate 'P0001' then v_ok := v_ok + 1;
  end;

  -- 14. Trocar de linha para goleiro libera a vaga de linha para a fila
  v_total := v_total + 1;
  perform pg_temp.as_user('tigrao');
  perform public.join_match('seedcampo1', 'linha'); -- tigrao já está confirmado na linha (seed)
  perform pg_temp.as_user('lucao');
  begin
    perform public.join_match('seedcampo1', 'goleiro'); -- goleiros lotados: vai pra espera de goleiro
    if pg_temp.status_of('seedcampo1', 'lucao') = 'espera'
       and (select count(*) from public.match_participants mp join public.matches m on m.id = mp.match_id
            where m.code = 'seedcampo1' and mp.slot = 'linha' and mp.status = 'confirmado') = 20
    then v_ok := v_ok + 1; else raise warning 'FALHOU: troca de slot libera vaga'; end if;
  end;

  -- 15. Sem login não entra
  v_total := v_total + 1;
  perform set_config('request.jwt.claim.sub', '', true);
  perform set_config('request.jwt.claims', '{}', true);
  begin
    perform public.join_match('seedgranbe', 'linha');
    raise warning 'FALHOU: entrou sem login';
  exception when sqlstate '28000' then v_ok := v_ok + 1;
  end;

  raise exception 'RESULTADO: %/% testes passaram', v_ok, v_total;
end $$;
