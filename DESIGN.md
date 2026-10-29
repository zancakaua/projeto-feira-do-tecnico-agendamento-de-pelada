---
name: Racha
description: A lista da pelada que se organiza sozinha, desenhada como uma súmula de jogo.
colors:
  ink: "#141414"
  ink-soft: "#2a2a28"
  stamp: "#b3161b"
  stamp-deep: "#8c1015"
  paper: "#f3f3ef"
  paper-deep: "#e7e7e1"
  rule: "#c4c4bd"
  muted: "#5b5b56"
  on-ink-muted: "#b9b9b2"
  on-stamp: "#ffffff"
typography:
  display:
    fontFamily: "Archivo Narrow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Archivo Narrow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1
  title:
    fontFamily: "Archivo Narrow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "tnum"
  label:
    fontFamily: "Archivo Narrow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.12em"
  typed:
    fontFamily: "Courier Prime, ui-monospace, monospace"
    fontSize: "1.125rem"
    fontWeight: 700
    letterSpacing: "-0.01em"
  typed-display:
    fontFamily: "Courier Prime, ui-monospace, monospace"
    fontSize: "1.85rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  button:
    fontFamily: "Archivo Narrow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    letterSpacing: "0.06em"
rounded:
  none: "0"
spacing:
  hairline: "1px"
  cell-y: "8px"
  cell-x: "12px"
  gutter: "16px"
  stack: "24px"
  section: "32px"
  bar-clearance: "96px"
components:
  button-primary:
    backgroundColor: "{colors.stamp}"
    textColor: "{colors.on-stamp}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.stamp-deep}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "52px"
  button-ink-hover:
    backgroundColor: "{colors.ink-soft}"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "52px"
  button-outline-hover:
    backgroundColor: "{colors.paper-deep}"
  field-cell:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.typed}"
    rounded: "{rounded.none}"
    padding: "8px 12px 6px"
  choice-option:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
    height: "48px"
  choice-option-checked:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  tag-stamp:
    backgroundColor: "{colors.stamp}"
    textColor: "{colors.on-stamp}"
    rounded: "{rounded.none}"
    padding: "2px 6px"
  tag-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "2px 6px"
  nav-bar:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink-muted}"
    height: "64px"
  join-bar:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    padding: "12px 16px"
---

# Design System: Racha

## Overview

**Creative North Star: "A Súmula do Jogo"**

Racha é um documento oficial de várzea, não um app esportivo. Cada tela é uma folha de súmula impressa em três tintas: o preto do formulário, o vermelho do carimbo e o papel neutro. A lista de confirmados é a relação numerada de atletas, as vagas abertas são linhas em branco tracejadas, a lista de espera é a seção "Reservas". O organizador confia porque a lista parece papel timbrado; o jogador entende quando, onde e quantas vagas em dois segundos porque o cabeçalho é uma grade de campos.

A densidade é de formulário: células com rótulo pequeno em versalete condensado e valor "datilografado" em Courier Prime, separadas por fios de 1px. Nada flutua: não há sombra, gradiente nem canto arredondado. A profundidade vem da moldura preta (topo, barra de ação, navegação) que enquadra o papel, e o vermelho aparece só onde há ação ou veredito: o botão "Tô dentro" e o carimbo girado de status.

A rejeição é explícita no PRODUCT.md e confirmada pela construção: nada de card de app esportivo com foto de quadra, barra de progresso, avatar redondo, gradiente roxo/azul, glassmorphism ou sombra exagerada.

**Key Characteristics:**
- Três tintas mais cinzas de pauta; papel neutro, nunca creme.
- Rótulo em versalete condensado em cima, valor datilografado embaixo, a célula é a borda.
- Fios de 1px, cantos retos, zero sombra, zero gradiente.
- Moldura preta no topo e no polegar; vermelho só em ação e carimbo.
- Assinatura: o nome é datilografado na próxima linha em branco e o carimbo bate.

## Colors

Uma paleta de gráfica: tinta preta chapada, um vermelho de carimbo e papel de formulário, com cinzas que só fazem pauta e texto secundário.

### Primary
- **Vermelho Carimbo** (stamp): o único acento. Botão primário ("Tô dentro", "Nova pelada"), carimbo de status ("3 VAGAS", "LOTOU", "CONFIRMADO"), número de vagas restantes no Explorar, o nome do próprio usuário na lista, o filete superior da barra de ação, o indicador da aba ativa, contorno de foco, cursor de texto e erros.
- **Vermelho Carimbo Fundo** (stamp-deep): só estado de hover/active do botão primário.

### Neutral
- **Preto de Formulário** (ink): texto, moldura do app (topo, navegação, barra de ação, `theme-color`), bordas de célula e o fundo do `html`. Opção marcada inverte para fundo preto.
- **Preto Gasto** (ink-soft): hover de elementos sobre a moldura preta e o fio da navegação inferior.
- **Papel Neutro** (paper): fundo de toda superfície de conteúdo e texto sobre preto.
- **Papel Marcado** (paper-deep): linha do próprio usuário na relação, hover de linhas e do botão contornado, fundo de avatar e de aviso positivo.
- **Cinza de Pauta** (rule): fios entre linhas de lista e linhas em branco tracejadas. Nunca para borda de célula, que é sempre preta.
- **Grafite** (muted): rótulos de campo, texto secundário, contadores "/14".
- **Grafite sobre Preto** (on-ink-muted): abas inativas e texto secundário dentro da moldura preta.
- **Branco de Carimbo** (on-stamp): texto sobre vermelho e sobre a seleção.

### Named Rules
**The Three Inks Rule.** Toda superfície é feita de preto, vermelho e papel. Cinzas existem só como pauta e texto secundário; não entra quarta cor de marca, e o papel nunca puxa para creme ou bege.

**The Red Means Act Rule.** Vermelho é reservado para a ação principal, o carimbo de status, o "você" na lista, foco e erro. Se um elemento vermelho não é nenhum desses, ele está errado.

## Typography

**Display Font:** Archivo Narrow (com ui-sans-serif, system-ui)
**Body Font:** Archivo (com ui-sans-serif, system-ui)
**Label/Mono Font:** Archivo Narrow para rótulos; Courier Prime (com ui-monospace) para valores datilografados

**Character:** Archivo Narrow em negrito é a tipografia impressa do formulário e da camisa: títulos, rótulos e botões. Courier Prime em negrito é a máquina de escrever que preencheu a súmula: datas, horários, nomes, códigos, preços. Archivo é a prosa de apoio. Números sempre tabulares.

### Hierarchy
- **Display** (700, 3rem subindo a 3.75rem em telas sm+, 0.95, -0.025em): só a manchete da página inicial deslogada, limitada a ~16ch.
- **Headline** (700, 1.875rem, 1): título de página ("Avisos", "Explorar", "Nova pelada"). O título da pelada sobe para 2rem com 1.02; telas de autenticação e 404 usam 2.25rem.
- **Title** (700, 1.125rem, 1.25): nome da pelada em linhas de lista, "Time 1", títulos de passos.
- **Body** (400, 16px, 1.45): prosa; texto secundário em 0.95rem e notas em 0.875rem. Blocos longos (observações) limitados a 65ch.
- **Label** (700, 0.75rem, 0.12em, caixa alta): rótulo de campo, cabeçalho de seção, dia da semana e mês no bloco de data.
- **Typed** (Courier Prime 700, 1.125rem, -0.01em): valor de campo, nome na relação (1.05rem), chave Pix. Em destaque: data e horário do cabeçalho (1.85rem), dia no bloco de data (1.9 a 2.1rem), contagens (1.5rem).
- **Button** (700, 1.125rem, 0.06em, caixa alta): todo botão e as abas (0.8rem, 0.08em).

### Named Rules
**The Label Over Value Rule.** Dado do jogo é sempre um par: rótulo em versalete condensado em cima, valor datilografado embaixo. Quem lê escaneia os rótulos e lê os valores.

**The Typewriter Is For Data Rule.** Courier Prime só preenche dados (data, hora, nomes, códigos, valores, contagens). Nunca em títulos, botões ou prosa.

## Layout

Coluna única centralizada de no máximo 48rem (max-w-3xl) com 16px de margem lateral, pensada para o celular com uma mão. O conteúdo começa 24px abaixo do topo; seções se separam por 32px, cada uma aberta por um cabeçalho em versalete sobre um fio preto de 2px, com a contagem datilografada alinhada à direita.

Grades de campos dividem a largura em 2 ou 3 colunas (DATA | HORÁRIO; LOCAL em largura total; QUADRA | VALOR | NÍVEL) com divisórias de 1px. Grupos de opções usam `gap: 1px` sobre fundo preto, de modo que o próprio fundo vira o fio entre as células. Linhas de lista são grades fixas: coluna de número de 2.25rem na relação, bloco de data de 4.25rem nas linhas de pelada.

A moldura preta tem posição fixa: topo pegajoso de 56px com o logotipo, navegação inferior de 64px no celular (que sobe para o topo a partir de md), barra de ação fixa acima da navegação respeitando `safe-area-inset-bottom`. O conteúdo reserva 96px no fim para não ficar sob a barra. Alvos de toque têm no mínimo 44px; botões 52px.

## Elevation & Depth

Plano por princípio. Não existe sombra nem gradiente em nenhum componente. A profundidade é tonal e de enquadramento: a moldura preta fica "por fora" do papel, o estado marcado inverte para preto, o hover escurece o papel para papel marcado. O único objeto que sai do plano é o carimbo, e ele sai por rotação (-6°) e borda dupla, não por sombra.

### Named Rules
**The Flat Paper Rule.** Papel não tem sombra. Para separar, use fio de 1px, fio duplo de 3px ou inversão para preto.

## Shapes

Cantos retos em tudo (raio 0): botões, campos, etiquetas, avatares (foto 3x4 de ficha, retangular, com moldura de tinta), notificações. As linhas são o vocabulário: fio de 1px preto para células e caixas, fio de 1px cinza de pauta entre linhas de lista, fio de 2px preto sob cabeçalho de seção e em volta do placar de vagas, fio duplo de 3px sob cabeçalhos de ficha (perfil, autenticação, passos da página inicial), linha tracejada para a vaga em branco. Caixinhas de marcar são quadrados de 16 a 20px que recebem um "×" datilografado em vermelho quando marcadas, como caneta em formulário.

### Named Rules
**The Square Corner Rule.** Raio é sempre 0. Nada redondo, nem avatar, nem badge de contagem.

## Components

### Buttons
Tipografia de camisa em bloco chapado: confiantes, altos e sem enfeite.
- **Shape:** retângulo de canto reto (0), altura mínima de 52px, 20px de padding horizontal, ícone de 20px com 8px de gap.
- **Primary:** bloco vermelho carimbo com texto branco, caixa alta. Para a ação principal da tela ("Tô dentro", "Nova pelada", "Confirmar saída").
- **Ink:** bloco preto com texto papel para ações do organizador ("Editar", "Sortear times").
- **Outline:** fio preto de 1px sobre papel ("Mandar no grupo do zap", "Duplicar"). Dentro da moldura preta inverte para fio papel sobre transparente.
- **Ghost:** texto preto sublinhado com fio de 1px, vira vermelho no hover.
- **Hover / Focus:** só troca de cor (primário escurece para vermelho fundo, preto para preto gasto, contornado para papel marcado). Foco é contorno vermelho de 2px com 2px de afastamento em todo elemento. Carregando: ícone girando e opacidade 55% quando desabilitado.

### Chips (Etiquetas de situação)
- **Style:** caixa de canto reto com fio de 1px, versalete 0.7rem com 0.1em, padding 2px 6px. Três tons: vermelho chapado, preto chapado, contornado preto. "PAGO" na relação é contornado preto.
- **State:** "Cancelada" sempre contornado vermelho, com o título riscado.

### Cards / Containers
Não há cards. Conteúdo vive em linhas de lista e em grades de campos.
- **Corner Style:** reto (0).
- **Background:** papel; hover da linha inteira em papel marcado.
- **Shadow Strategy:** nenhuma (ver Elevation & Depth).
- **Border:** células com fio preto de 1px; linhas separadas por fio cinza de pauta.
- **Internal Padding:** células 12px na horizontal e 8px na vertical; linhas de lista 12px na vertical.

### Inputs / Fields
- **Style:** a célula é a borda: caixa com fio preto de 1px sobre papel, rótulo em versalete grafite em cima, valor datilografado em 1.125rem embaixo, sufixo opcional em versalete. Opções (radio) são grades de células com caixinha "×"; a marcada inverte para preto com o "×" em vermelho.
- **Focus:** contorno vermelho de 2px colado à célula; cursor de texto vermelho.
- **Error / Disabled:** a borda vira vermelha e a mensagem aparece abaixo em vermelho 0.875rem com ícone de alerta.

### Navigation
- **Style:** barra preta fixa no rodapé com quatro abas (Peladas, Explorar, Avisos, Perfil), ícone de 24px sobre versalete 0.8rem. Inativa em grafite sobre preto, ativa em papel com um filete vermelho de 3px no topo. Contagem de avisos é um bloco vermelho retangular.
- **Mobile / desktop:** no celular, 64px no rodapé; a partir de md, vira linha horizontal dentro do topo preto, com o filete vermelho embaixo.

### Carimbo (Signature Component)
O veredito da súmula. Versalete condensado em caixa alta com fio de 3px na cor do texto, segundo fio de 1px afastado 2px, girado -6°. Vermelho para status vivo ("3 VAGAS", "LOTOU", "CONFIRMADO"), preto quando a pelada está cancelada. Ao confirmar presença, o carimbo bate: entra em escala 1.6, passa de 0.94 e assenta em 1, em 380ms com `cubic-bezier(0.16, 1, 0.3, 1)` e 700ms de atraso.

### Relação de Atletas (Signature Component)
Lista numerada (01, 02… / G1, G2… / 1º, 2º…) com número em versalete na coluna de 2.25rem, nome datilografado e posição/nível em 0.75rem grafite. Vagas abertas são linhas em branco com um traço tracejado cinza de pauta. A linha do próprio usuário fica em papel marcado com o nome em vermelho; ao entrar, o nome é datilografado da esquerda para a direita (650ms em 22 passos). Toda animação só roda com `prefers-reduced-motion: no-preference`.

## Do's and Don'ts

### Do:
- **Do** apresentar todo dado do jogo como par rótulo em versalete (0.75rem, 0.12em) sobre valor datilografado em Courier Prime negrito.
- **Do** separar com fios: 1px preto para células, 1px cinza de pauta entre linhas, 2px preto sob cabeçalho de seção, duplo de 3px sob cabeçalho de ficha.
- **Do** enquadrar o papel com a moldura preta: topo, navegação e barra de ação fixa no polegar.
- **Do** reservar o vermelho para ação principal, carimbo, "você", foco e erro.
- **Do** mostrar vagas como linhas em branco numeradas, não como barra de progresso.
- **Do** manter alvos de toque com no mínimo 44px e botões com 52px.

### Don't:
- **Don't** arredondar cantos; raio é sempre 0, inclusive em avatar e badge.
- **Don't** usar sombra ou gradiente em qualquer elemento.
- **Don't** usar papel creme ou bege; o papel é neutro.
- **Don't** usar card de app esportivo com foto de quadra, barra de progresso ou avatar redondo.
- **Don't** usar Courier Prime em título, botão ou prosa.
- **Don't** introduzir uma quarta cor de marca ou hex solto fora dos tokens.
