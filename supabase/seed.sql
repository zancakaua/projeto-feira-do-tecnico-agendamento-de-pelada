-- Racha: dados de TESTE (não usar em produção).
-- Todas as contas usam e-mail @racha.test e a senha de teste "racha1234".
-- Datas relativas a hoje, para o seed continuar útil quando for reaplicado.

do $$
declare
  u record;
  v_users jsonb := '[
    {"email":"thiago.moreira@racha.test","name":"Thiago Moreira","nick":"tigrao","pos":"meio","lvl":"intermediario","city":"Juiz de Fora"},
    {"email":"ana.reis@racha.test","name":"Ana Clara Reis","nick":"anaclara","pos":"atacante","lvl":"avancado","city":"Juiz de Fora"},
    {"email":"rafael.souza@racha.test","name":"Rafael Souza","nick":"rafinha","pos":"atacante","lvl":"intermediario","city":"Juiz de Fora"},
    {"email":"juliana.prado@racha.test","name":"Juliana Prado","nick":"jupr","pos":"zagueiro","lvl":"intermediario","city":"Juiz de Fora"},
    {"email":"marcos.lima@racha.test","name":"Marcos Vinícius Lima","nick":"marquinhos","pos":"meio","lvl":"iniciante","city":"Juiz de Fora"},
    {"email":"diego.fernandes@racha.test","name":"Diego Fernandes","nick":"diegao","pos":"zagueiro","lvl":"avancado","city":"Juiz de Fora"},
    {"email":"bruno.lacerda@racha.test","name":"Bruno Lacerda","nick":"paredao","pos":"goleiro","lvl":"avancado","city":"Juiz de Fora"},
    {"email":"camila.duarte@racha.test","name":"Camila Duarte","nick":"cacau","pos":"meio","lvl":"intermediario","city":"Juiz de Fora"},
    {"email":"lucas.almeida@racha.test","name":"Lucas Almeida","nick":"lucao","pos":"tanto_faz","lvl":"avancado","city":"Juiz de Fora"},
    {"email":"pedro.costa@racha.test","name":"Pedro Henrique Costa","nick":"pedrinho","pos":"atacante","lvl":"iniciante","city":"Juiz de Fora"},
    {"email":"gabriel.martins@racha.test","name":"Gabriel Martins","nick":"gabigol_jf","pos":"atacante","lvl":"intermediario","city":"Juiz de Fora"},
    {"email":"larissa.teixeira@racha.test","name":"Larissa Teixeira","nick":"lari","pos":"zagueiro","lvl":"iniciante","city":"Juiz de Fora"},
    {"email":"felipe.rocha@racha.test","name":"Felipe Rocha","nick":"felipera","pos":"meio","lvl":"intermediario","city":"Juiz de Fora"},
    {"email":"vinicius.barbosa@racha.test","name":"Vinícius Barbosa","nick":"vini","pos":"tanto_faz","lvl":"intermediario","city":"Juiz de Fora"},
    {"email":"renata.campos@racha.test","name":"Renata Campos","nick":"renatinha","pos":"meio","lvl":"avancado","city":"Juiz de Fora"},
    {"email":"eduardo.pires@racha.test","name":"Eduardo Pires","nick":"dudu_gol","pos":"goleiro","lvl":"intermediario","city":"Juiz de Fora"},
    {"email":"matheus.gomes@racha.test","name":"Matheus Gomes","nick":"teteu","pos":"atacante","lvl":"avancado","city":"Juiz de Fora"},
    {"email":"carla.mendes@racha.test","name":"Carla Mendes","nick":"carlinha","pos":"zagueiro","lvl":"intermediario","city":"Juiz de Fora"},
    {"email":"igor.santana@racha.test","name":"Igor Santana","nick":"igao","pos":"meio","lvl":"intermediario","city":"Juiz de Fora"},
    {"email":"patricia.nunes@racha.test","name":"Patrícia Nunes","nick":"pati","pos":"tanto_faz","lvl":"iniciante","city":"Juiz de Fora"},
    {"email":"joao.freitas@racha.test","name":"João Victor Freitas","nick":"jvzinho","pos":"zagueiro","lvl":"avancado","city":"Juiz de Fora"},
    {"email":"leandro.silva@racha.test","name":"Leandro Silva","nick":"leandrao","pos":"meio","lvl":"avancado","city":"Belo Horizonte"},
    {"email":"bianca.oliveira@racha.test","name":"Bianca Oliveira","nick":"bia_rj","pos":"atacante","lvl":"intermediario","city":"Rio de Janeiro"},
    {"email":"rodrigo.batista@racha.test","name":"Rodrigo Batista","nick":"digao","pos":"goleiro","lvl":"intermediario","city":"Juiz de Fora"},
    {"email":"aline.ferraz@racha.test","name":"Aline Ferraz","nick":"aline","pos":"meio","lvl":"intermediario","city":"Juiz de Fora"},
    {"email":"caio.rezende@racha.test","name":"Caio Rezende","nick":"caiozin","pos":"atacante","lvl":"intermediario","city":"Juiz de Fora"},
    {"email":"tiago.ramos@racha.test","name":"Tiago Ramos","nick":"tiagao","pos":"zagueiro","lvl":"intermediario","city":"Juiz de Fora"}
  ]';
  v_id uuid;
begin
  for u in select * from jsonb_to_recordset(v_users) as x(email text, name text, nick text, pos text, lvl text, city text) loop
    if exists (select 1 from auth.users where email = u.email) then continue; end if;
    v_id := gen_random_uuid();
    insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
                            raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
                            confirmation_token, recovery_token, email_change_token_new, email_change)
    values ('00000000-0000-0000-0000-000000000000', v_id, 'authenticated', 'authenticated', u.email,
            extensions.crypt('racha1234', extensions.gen_salt('bf')), now(),
            '{"provider":"email","providers":["email"]}', jsonb_build_object('full_name', u.name),
            now(), now(), '', '', '', '');
    insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    values (gen_random_uuid(), v_id, v_id::text,
            jsonb_build_object('sub', v_id::text, 'email', u.email, 'email_verified', true),
            'email', now(), now(), now());
    update public.profiles set nickname = u.nick, position = u.pos::public.position_pref,
           level = u.lvl::public.skill_level, city = u.city
      where id = v_id;
  end loop;
end $$;

-- Peladas -------------------------------------------------------------------
create or replace function pg_temp.uid(p_nick text) returns uuid language sql as
  $$ select id from public.profiles where nickname = p_nick $$;
create or replace function pg_temp.at_local(p_days int, p_time time) returns timestamptz language sql as
  $$ select ((current_date + p_days) + p_time) at time zone 'America/Sao_Paulo' $$;

delete from public.matches where organizer_id in (select id from public.profiles where nickname in
  ('tigrao','renatinha','leandrao','igao','diegao','lucao','bia_rj'));

insert into public.matches (code, organizer_id, title, court_type, venue_name, address, neighborhood, city,
  starts_at, duration_minutes, field_slots, goalkeeper_slots, price_cents, pix_key, level, rules, is_public, leave_deadline_hours)
values
  ('seedsexta1', pg_temp.uid('tigrao'), 'Racha de sexta', 'society', 'Arena Bom Pastor', 'Rua Dr. Constantino Paleta, 300',
   'Bom Pastor', 'Juiz de Fora', pg_temp.at_local(1, '20:00'), 90, 14, 2, 2000, 'thiago.moreira@racha.test', 'intermediario',
   'Chegar 10 min antes. Colete por conta da casa. Quem não pagar até quinta perde a vaga.', true, 6),
  ('seedfutsal', pg_temp.uid('renatinha'), 'Futsal das meninas', 'futsal', 'Ginásio São Mateus', 'Rua São Mateus, 820',
   'São Mateus', 'Juiz de Fora', pg_temp.at_local(2, '19:00'), 60, 10, 2, 1500, '32988887777', 'iniciante',
   'Aberto pra quem tá começando. Tênis de futsal, sem trava.', true, 3),
  ('seedcampo1', pg_temp.uid('tigrao'), 'Pelada do campo — Cascatinha', 'campo', 'Campo do Cascatinha', 'Rua Professor Lisboa, 150',
   'Cascatinha', 'Juiz de Fora', pg_temp.at_local(3, '08:00'), 120, 20, 2, 1000, 'thiago.moreira@racha.test', null,
   'Dois tempos de 50. Time que perde sai.', true, 12),
  ('seedareia1', pg_temp.uid('renatinha'), 'Areia no fim de tarde', 'areia', 'Arena Beach JF', 'Av. Itamar Franco, 3600',
   'Cascatinha', 'Juiz de Fora', pg_temp.at_local(4, '17:30'), 60, 8, 0, 1800, '32988887777', 'intermediario', null, true, 2),
  ('seedtrampo', pg_temp.uid('igao'), 'Futsal do trampo', 'futsal', 'Quadra Santa Luzia', 'Rua Ibitiguaia, 455',
   'Santa Luzia', 'Juiz de Fora', pg_temp.at_local(5, '19:30'), 60, 10, 2, 0, null, 'intermediario',
   'Só a galera da firma e convidados.', false, 2),
  ('seedgranbe', pg_temp.uid('lucao'), 'Society da galera do Granbery', 'society', 'Quadra Granbery', 'Rua Batista de Oliveira, 1145',
   'Granbery', 'Juiz de Fora', pg_temp.at_local(7, '21:00'), 90, 12, 2, 2200, 'lucas.almeida@racha.test', 'avancado',
   'Nível puxado. Falta para bola parada.', true, 4),
  ('seedbenfic', pg_temp.uid('diegao'), 'Racha de quinta — Benfica', 'society', 'Society Benfica', 'Rua Coronel Quintão, 90',
   'Benfica', 'Juiz de Fora', pg_temp.at_local(6, '20:30'), 60, 12, 2, 1500, 'diego.fernandes@racha.test', null, null, true, 2),
  ('seedsavass', pg_temp.uid('leandrao'), 'Society da Savassi', 'society', 'Arena Savassi', 'Rua Pernambuco, 1000',
   'Savassi', 'Belo Horizonte', pg_temp.at_local(2, '21:00'), 90, 14, 2, 2500, 'leandro.silva@racha.test', 'avancado', null, true, 4),
  ('seedcopaca', pg_temp.uid('bia_rj'), 'Futevôlei não, pelada na areia', 'areia', 'Posto 5', 'Av. Atlântica, 3600',
   'Copacabana', 'Rio de Janeiro', pg_temp.at_local(3, '07:00'), 90, 10, 0, 0, null, null, null, true, 2),
  ('seedpassad', pg_temp.uid('tigrao'), 'Racha de sexta', 'society', 'Arena Bom Pastor', 'Rua Dr. Constantino Paleta, 300',
   'Bom Pastor', 'Juiz de Fora', pg_temp.at_local(-6, '20:00'), 90, 14, 2, 2000, 'thiago.moreira@racha.test', 'intermediario', null, true, 6),
  ('seedpasre1', pg_temp.uid('renatinha'), 'Futsal das meninas', 'futsal', 'Ginásio São Mateus', 'Rua São Mateus, 820',
   'São Mateus', 'Juiz de Fora', pg_temp.at_local(-5, '19:00'), 60, 10, 2, 1500, '32988887777', 'iniciante', null, true, 3);

update public.matches set status = 'cancelada', cancel_reason = 'A quadra fechou pra reforma essa semana.'
  where code = 'seedbenfic';

-- Inscritos: (código, apelido, slot, status, pago, minutos depois da criação)
insert into public.match_participants (match_id, user_id, slot, status, paid, joined_at, team)
select m.id, pg_temp.uid(x.nick), x.slot::public.slot_kind, x.status::public.participant_status, x.paid,
       now() - interval '3 days' + make_interval(mins => x.ord), x.team
from (values
  -- Racha de sexta: 11/14 linha, 1/2 goleiro
  ('seedsexta1','tigrao','linha','confirmado',true,1,null::smallint),('seedsexta1','anaclara','linha','confirmado',true,2,null),
  ('seedsexta1','rafinha','linha','confirmado',false,3,null),('seedsexta1','jupr','linha','confirmado',true,4,null),
  ('seedsexta1','marquinhos','linha','confirmado',false,5,null),('seedsexta1','diegao','linha','confirmado',true,6,null),
  ('seedsexta1','cacau','linha','confirmado',false,7,null),('seedsexta1','lucao','linha','confirmado',true,8,null),
  ('seedsexta1','pedrinho','linha','confirmado',false,9,null),('seedsexta1','gabigol_jf','linha','confirmado',true,10,null),
  ('seedsexta1','felipera','linha','confirmado',false,11,null),('seedsexta1','paredao','goleiro','confirmado',true,12,null),
  -- Futsal das meninas: 6/10
  ('seedfutsal','renatinha','linha','confirmado',true,1,null),('seedfutsal','anaclara','linha','confirmado',true,2,null),
  ('seedfutsal','jupr','linha','confirmado',false,3,null),('seedfutsal','cacau','linha','confirmado',true,4,null),
  ('seedfutsal','lari','linha','confirmado',false,5,null),('seedfutsal','pati','linha','confirmado',false,6,null),
  -- Areia: lotada (8/8) com 2 na espera
  ('seedareia1','renatinha','linha','confirmado',true,1,null),('seedareia1','teteu','linha','confirmado',true,2,null),
  ('seedareia1','carlinha','linha','confirmado',true,3,null),('seedareia1','igao','linha','confirmado',false,4,null),
  ('seedareia1','aline','linha','confirmado',true,5,null),('seedareia1','caiozin','linha','confirmado',false,6,null),
  ('seedareia1','tiagao','linha','confirmado',true,7,null),('seedareia1','vini','linha','confirmado',false,8,null),
  ('seedareia1','jvzinho','linha','espera',false,9,null),('seedareia1','lari','linha','espera',false,10,null),
  -- Futsal do trampo (privada)
  ('seedtrampo','igao','linha','confirmado',false,1,null),('seedtrampo','felipera','linha','confirmado',false,2,null),
  ('seedtrampo','vini','linha','confirmado',false,3,null),('seedtrampo','dudu_gol','goleiro','confirmado',false,4,null),
  -- Granbery: 4/12, vaga de goleiro aberta
  ('seedgranbe','lucao','linha','confirmado',true,1,null),('seedgranbe','teteu','linha','confirmado',false,2,null),
  ('seedgranbe','jvzinho','linha','confirmado',true,3,null),('seedgranbe','anaclara','linha','confirmado',false,4,null),
  -- Cancelada
  ('seedbenfic','diegao','linha','confirmado',false,1,null),('seedbenfic','rafinha','linha','confirmado',false,2,null),
  -- Passada com times sorteados
  ('seedpassad','tigrao','linha','confirmado',true,1,1),('seedpassad','anaclara','linha','confirmado',true,2,2),
  ('seedpassad','rafinha','linha','confirmado',true,3,1),('seedpassad','jupr','linha','confirmado',true,4,2),
  ('seedpassad','diegao','linha','confirmado',true,5,1),('seedpassad','lucao','linha','confirmado',true,6,2),
  ('seedpassad','gabigol_jf','linha','confirmado',true,7,1),('seedpassad','cacau','linha','confirmado',true,8,2),
  ('seedpassad','paredao','goleiro','confirmado',true,9,1),('seedpassad','digao','goleiro','confirmado',true,10,2),
  ('seedpasre1','renatinha','linha','confirmado',true,1,null),('seedpasre1','anaclara','linha','confirmado',true,2,null),
  ('seedpasre1','cacau','linha','confirmado',true,3,null),('seedpasre1','pati','linha','confirmado',true,4,null),
  -- Savassi e Copacabana
  ('seedsavass','leandrao','linha','confirmado',true,1,null),('seedcopaca','bia_rj','linha','confirmado',false,1,null)
) as x(code, nick, slot, status, paid, ord, team)
join public.matches m on m.code = x.code;

-- Campo do Cascatinha: 20/20 linha + 2/2 goleiros + 2 na espera
insert into public.match_participants (match_id, user_id, slot, status, paid, joined_at)
select m.id, p.id,
       case when p.position = 'goleiro' and rn_gk <= 2 then 'goleiro' else 'linha' end::public.slot_kind,
       case when p.position = 'goleiro' and rn_gk <= 2 then 'confirmado'
            when p.position <> 'goleiro' and rn_gk <= 20 then 'confirmado' else 'espera' end::public.participant_status,
       (rn_line % 3 = 0), now() - interval '2 days' + make_interval(mins => rn_line::int)
from public.matches m
cross join lateral (
  select pr.*, row_number() over (order by pr.full_name) as rn_line,
         row_number() over (partition by pr.position = 'goleiro' order by pr.full_name) as rn_gk
  from public.profiles pr where pr.city = 'Juiz de Fora' and pr.nickname <> 'digao'
) p
where m.code = 'seedcampo1';

update public.matches set teams_drawn_at = starts_at - interval '1 hour' where code = 'seedpassad';
