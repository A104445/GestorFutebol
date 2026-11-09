# MatchDay (GestorFutebol)

Plataforma moderna de gestão desportiva e de clubes de futebol, desenhada para otimizar o acompanhamento de atletas, equipas, finanças, estatísticas e planeamento de treinos ou jogos.

## Sobre a Aplicação

O **MatchDay** é uma solução completa orientada à experiência móvel e de ambiente de trabalho (Progressive Web App - PWA), permitindo que treinadores, dirigentes e atletas mantenham todos os dados do clube centralizados e acessíveis em tempo real.

### Principais Funcionalidades:
- **Gestão de Clubes e Equipas:** Criação e personalização de clubes, divisão por escalões e gestão completa de plantéis desportivos.
- **Painel de Atletas (ClubPlayers):** Registo detalhado de jogadores, posições, dados de contacto, histórico e estado físico.
- **Dashboard de Desempenho (ClubDashboard & ClubStats):** Acompanhamento visual de estatísticas coletivas e individuais, métricas de jogo e gráficos analíticos.
- **Controlo Financeiro (ClubFinances):** Monitorização de quotas, despesas, receitas e orçamento do clube.
- **Sistemas de Autenticação e Gestão de Acessos:** Fluxos seguros de login, registo e associação a clubes (`JoinClub` e `ClubSelector`).
- **Suporte Multilíngue (i18n):** Interface totalmente traduzida para vários idiomas (Português, Inglês, Espanhol, Francês, Alemão e Italiano).
- **Notificacoes e Push Notifications:** Sistema integrado para envio de alertas e avisos importantes aos membros da equipa (via Supabase Edge Functions / Deno).

## Stack Tecnológica

* **Frontend:** Vue.js 3, Quasar Framework (com suporte a PWA e SPA)
* **Linguagem:** JavaScript / ES6+ (com suporte a JSDoc / configuração em JS)
* **Backend & Base de Dados:** Supabase (Autenticação, Base de Dados PostgreSQL em tempo real, Políticas de Segurança RLS e Edge Functions)
* **Gestão de Estado:** Pinia
* **Internacionalização:** Vue-I18n
* **DevOps / Hosting:** Configurações prontas para Vercel e suporte a service workers para funcionamento offline.

## Arquitetura e Distribuição do Código

O projeto está organizado numa estrutura modular orientada a componentes e páginas, centralizada na pasta `app/`:

```text
GestorFutebol-main/
├── app/
│   ├── public/              # Recursos estáticos, favicon e ícones para PWA
│   ├── src/
│   │   ├── boot/            # Ficheiros de inicialização (ex: Supabase, i18n)
│   │   ├── components/      # Componentes reutilizáveis de interface
│   │   ├── css/             # Folhas de estilo globais e variáveis Quasar (SCSS)
│   │   ├── i18n/            # Traduções e dicionários por idioma (PT, EN, ES, etc.)
│   │   ├── layouts/         # Estruturas de navegação principais (MainLayout)
│   │   ├── pages/           # Vistas da aplicação (Dashboard, Finanças, Atletas, Login)
│   │   ├── router/          # Configuração de rotas e navegação protegida
│   │   └── stores/          # Gestão de estado global com Pinia (Autenticação, Clubes)
│   ├── supabase/
│   │   ├── functions/       # Funções de servidor serverless (ex: send-push)
│   │   └── config.toml      # Configuração do projeto Supabase
│   └── quasar.config.js     # Configuração principal da framework Quasar e PWA
└── README.md
```

## Como Executar Localmente

### 1. Pré-requisitos
Certifica-te de que tens o [Node.js](https://nodejs.org/) instalado na tua máquina, juntamente com o gestor de pacotes `npm` ou `pnpm` e a CLI do Quasar.

### 2. Instalação de Dependências
Navega para a pasta da aplicação e instala os pacotes necessários:

```bash
cd app
npm install
```

### 3. Configuração de Variáveis de Ambiente
Cria um ficheiro `.env` na raiz da pasta `app/` com as tuas credenciais do projeto Supabase:

```env
SUPABASE_URL=o_teu_url_do_supabase
SUPABASE_ANON_KEY=a_tua_chave_anonima_do_supabase
```

### 4. Executar em Modo de Desenvolvimento
Para iniciar o servidor local de desenvolvimento com recarregamento automático (Hot-Reload):

```bash
npx quasar dev
```

### 5. Compilar para Produção (Build)
Para gerar os ficheiros otimizados para distribuição web / PWA:

```bash
npx quasar build
```

---
*Projeto desenvolvido no âmbito do portfólio pessoal e académico de engenharia de software.*
