# Racha

A lista da pelada que se organiza sozinha. Quem organiza cria a pelada, manda o link no grupo do WhatsApp, e o Racha cuida de vagas de linha e de goleiro, lista de espera com promoção automática, prazo para desistir, controle de quem pagou o Pix, avisos e sorteio de times.

No ar: https://racha-mu.vercel.app

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- Supabase: Auth (e-mail/senha e Google), Postgres com RLS em todas as tabelas, Storage (fotos)
- Zod + React Hook Form, date-fns (pt-BR, fuso `America/Sao_Paulo`)
- Vitest para as regras puras; testes SQL para as regras do banco

As regras da lista (vaga, fila, prazo, permissões, avisos) ficam **no Postgres**, em funções e gatilhos (`supabase/migrations`). O front só chama `join_match`, `leave_match`, `set_paid`, `remove_participant`, `save_teams` e `cancel_match`. Assim duas pessoas nunca pegam a mesma última vaga.

## Rodar localmente

Pré-requisitos: Node 20.9+ e um projeto no Supabase.

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie `.env.example` para `.env.local` e preencha com os dados do seu projeto (Supabase → Project Settings → API):

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. Aplique o banco: rode, em ordem, os arquivos de `supabase/migrations/` no SQL Editor do Supabase (ou `supabase db push` com a CLI). Depois rode `supabase/seed.sql` se quiser dados de teste.

4. Suba o app:

   ```bash
   npm run dev
   ```

   Abra http://localhost:3000.

### Contas de teste (seed)

Todas as contas do seed usam e-mail `@racha.test` e a senha `racha1234`. Exemplos: `thiago.moreira@racha.test` (organiza o "Racha de sexta"), `ana.reis@racha.test`, `renata.campos@racha.test`. São só para desenvolvimento: não rode o seed em produção com usuários reais.

### Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm test` | Testes unitários (Vitest) |
| `npm run typecheck` | Checagem de tipos |
| `npm run lint` | ESLint |

Os testes do banco ficam em `supabase/tests/*.test.sql`. Rode no SQL Editor sobre o seed: cada arquivo termina com um erro proposital `RESULTADO: n/n testes passaram` (assim nada fica gravado).

## Configuração do Supabase

Em **Authentication → URL Configuration**:

- Site URL: a URL do app (ex.: `https://racha-mu.vercel.app`)
- Redirect URLs: `http://localhost:3000/**` e `https://SEU-APP.vercel.app/**`

Login com Google: crie um OAuth Client no Google Cloud (tipo Web, redirect `https://SEU-PROJETO.supabase.co/auth/v1/callback`) e cole o Client ID e o Secret em **Authentication → Providers → Google**.

Recomendado: ligar **Leaked password protection** em Authentication → Policies.

## Deploy na Vercel

1. Suba o código para um repositório no GitHub.
2. Na Vercel: **Add New → Project**, importe o repositório. O framework (Next.js) é detectado sozinho.
3. Em **Environment Variables**, cadastre as três variáveis do `.env.example`. Em `NEXT_PUBLIC_SITE_URL`, use a URL de produção da Vercel.
4. Deploy. Depois, adicione a URL da Vercel nas Redirect URLs do Supabase (seção acima).

A partir daí, todo push no `main` vira deploy de produção.

## Estrutura

```
supabase/
  migrations/      schema, funções (lista/fila/avisos), RLS, busca do Explorar
  seed.sql         dados de teste (Juiz de Fora)
  tests/           testes SQL das regras
src/
  app/
    (auth)/        entrar, cadastro, recuperar senha, senha nova
    (app)/         explorar, minhas-peladas, avisos, perfil, jogador/[apelido], pelada/...
    auth/callback  volta do Google e dos links de e-mail
    icons/[size]   ícones do app (PWA)
  components/      ui (campos, botões), match, explore, profile, shell
  lib/             regras puras (datas, dinheiro, filtros, sorteio, mensagem do zap)
  proxy.ts         renova a sessão e protege rotas
PRODUCT.md         contexto do produto
DESIGN.md          design system "Súmula"
```
