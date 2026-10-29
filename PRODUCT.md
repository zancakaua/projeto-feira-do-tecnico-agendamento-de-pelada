# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + TypeScript, Tailwind CSS, Supabase (Auth com e-mail/senha e Google, Postgres com RLS em todas as tabelas, Storage), Zod + React Hook Form, date-fns com locale pt-BR e fuso America/Sao_Paulo. PWA básico (instalável). Deploy na Vercel. Escolhido pelo usuário.

## Users

- **Organizador (usuário principal):** quem mantém a pelada da semana. Hoje controla a lista no grupo do WhatsApp na mão: quem confirmou, quem desistiu, quem está na espera, quem já pagou o Pix, como dividir os times. Está cansado disso.
- **Jogador:** homens e mulheres de 18 a 45 anos que jogam com amigos e colegas de trabalho. Chegam quase sempre pelo celular, tocando num link mandado no grupo do WhatsApp, muitas vezes com uma mão só e com pressa. Querem saber em segundos: quando, onde, se tem vaga, quanto custa, e confirmar.

## Product Purpose

Racha organiza peladas (futebol amador em quadra: society, futsal, campo, areia). A pelada vira um link com a lista que se organiza sozinha: vagas de linha e de goleiro, lista de espera com promoção automática, prazo para desistir, controle de quem pagou o Pix, aviso de alteração/cancelamento e sorteio de times equilibrado por nível. Também dá para encontrar peladas abertas na cidade.

Sucesso: o organizador para de editar lista no WhatsApp; o jogador confirma presença em poucos segundos a partir do link.

## Positioning

**A lista que se organiza sozinha.** O diferencial não é rede social nem marketplace de quadras: é tirar do organizador o trabalho braçal da lista (vagas, fila, pagamento, times), mantendo o WhatsApp como o canal por onde o link circula. Descoberta de peladas (Explorar) é secundária.

## Operating Context

- Entrada típica: link no WhatsApp → página da pelada no celular → "Tô dentro".
- Pagamento é Pix direto ao organizador, fora do app; o app só registra manualmente quem pagou.
- Peladas costumam ser semanais e recorrentes, no mesmo local e horário.
- Uso em quadra/estacionamento: luz forte, uma mão, conexão instável.

## Capabilities and Constraints

- Contas (e-mail/senha, Google, recuperação de senha), perfil (nome, apelido, foto, cidade, posição, nível, telefone opcional) e perfil público com histórico.
- Criar/editar/cancelar/duplicar pelada; recorrência semanal; vagas de linha e de goleiro separadas; valor por pessoa ou gratuito; chave Pix; nível esperado; regras; pública ou privada (só com link).
- Explorar com filtros (cidade/bairro, data, tipo de quadra, nível, preço, vaga de goleiro) e busca por texto.
- Entrar/sair com prazo de desistência configurável; lista de espera automática; organizador marca pagos e remove jogadores; compartilhar no WhatsApp; sorteio de times por nível.
- Painel "Minhas peladas" e notificações dentro do app.
- Sem dados mockados no código: tudo vem do banco. Seeds de teste realistas.
- Terminologia: "pelada", "racha", "linha", "goleiro", "lista de espera", "Tô dentro", "Saí da lista", "Bora?".

## Brand Commitments

- Nome: **Racha**.
- Cores: **preto e vermelho** (exigência do usuário). Nenhum logo, fonte ou código de cor definido além disso.
- Voz: português do Brasil natural, direto, energia de várzea e de quadra, mas organizado e confiável. Nada de tradução literal do inglês.
- Referências pedidas: identidade esportiva real (placares, súmulas, quadras, tipografia de camisa), não templates de SaaS.
- Proibido pelo usuário: gradientes roxo/azul, glassmorphism, grade de cards idênticos com ícone em cima, hero genérico "Bem-vindo à plataforma", emojis como ícone, sombras exageradas, tudo centralizado, Inter por preguiça, ilustrações 3D genéricas, qualquer "cara de site feito por IA".

## Evidence on Hand

Nenhum usuário, depoimento, número ou parceiro real ainda. Não inventar métricas, depoimentos ou "X peladas organizadas".

## Product Principles

1. **Quando, onde, quantas vagas** em 2 segundos, em qualquer tela que mostre uma pelada.
2. O organizador trabalha menos a cada feature; se algo exige ação manual dele, precisa ser um toque.
3. O link do WhatsApp é a porta de entrada: a página da pelada funciona para quem nunca viu o app.
4. Regras da lista são do banco, não da interface: vagas e fila nunca ficam inconsistentes.
5. Lançamento local primeiro: **Juiz de Fora (MG)** é a cidade padrão e o foco dos dados de teste.

## Accessibility & Inclusion

Contraste WCAG AA, alvos de toque grandes, uso confortável com uma mão no celular, legível sob sol forte. Público misto (homens e mulheres): linguagem não pode presumir gênero.
