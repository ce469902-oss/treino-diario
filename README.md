# EVOLVE

PWA mobile-first para organizar treino em casa, corrida, alimentação, hidratação, recuperação e evolução pessoal. Os dados são persistidos no próprio navegador e podem ser exportados pelo usuário.

Aplicação publicada: **https://ce469902-oss.github.io/treino-diario/**

## Desenvolvimento

Requisitos: Node.js 20 ou superior e npm.

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`. Para validar uma versão de produção:

```bash
npm test
npm run build
npm run preview
```

Para gerar uma demonstração em um único arquivo, sem servidor local:

```bash
npm run build:standalone
```

Abra `standalone/index.html` diretamente no navegador. Essa versão é adequada para demonstração; instalação como PWA, GPS e service worker precisam de uma publicação HTTPS.

## Instalação no celular

Depois de publicar o app em HTTPS, abra-o no navegador do celular e use **Adicionar à tela de início** (Android/Chrome) ou **Compartilhar → Adicionar à Tela de Início** (iOS/Safari).

## Privacidade e limites

Por padrão, os dados ficam no armazenamento local do navegador. A sincronização Supabase é opcional e só é ativada após o usuário entrar e escolher enviar os dados. O app fornece organização e educação; não substitui avaliação médica, nutricional ou de educação física.

O workflow `.github/workflows/deploy-pages.yml` testa, compila e publica automaticamente cada alteração enviada à branch `main`.

## Sincronização com Supabase

O aplicativo possui sincronização opcional por link mágico. Para ativar:

1. Crie um projeto gratuito no Supabase.
2. Execute [`supabase/schema.sql`](supabase/schema.sql) no SQL Editor.
3. Em **Authentication → URL Configuration**, adicione a URL publicada do EVOLVE aos Redirect URLs.
4. No GitHub, crie a variável de Actions `VITE_SUPABASE_URL` e o secret `VITE_SUPABASE_ANON_KEY`.
5. Para desenvolvimento local, copie `.env.example` para `.env.local` e preencha as mesmas configurações.

A chave `anon`/publishable é usada no cliente e a segurança depende das políticas RLS incluídas no schema. Nunca use a chave `service_role` no aplicativo. Fotos de evolução permanecem somente no aparelho.
