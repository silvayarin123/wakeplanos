# WAKE — Propostas comerciais

Sistema responsivo para criar, editar, publicar e excluir até 10 propostas comerciais ativas. O acesso protegido começa em `/editar` e direciona para `/painel`. Cada proposta publicada recebe um link individual para o cliente.

## Conteúdo do modelo

- Identificação e logo do cliente.
- Escopo da parceria com título editável.
- Entregáveis individuais com inclusão e remoção de itens.
- Investimento exibido em quadrante separado.
- Faixa contínua com 22 marcas de referência.
- Visual grafite responsivo para celular e computador.

## Desenvolvimento

Requisitos: Node.js 22.13+ e pnpm.

```bash
pnpm install
pnpm dev
```

Verificação e compilação:

```bash
node node_modules/typescript/bin/tsc --noEmit
pnpm build
```

## GitHub

Extraia o ZIP, crie um repositório e envie todos os arquivos. Arquivos de segredo, dependências instaladas, banco local e builds não estão incluídos.

## Hospedagem e Vercel

A versão funcional publicada usa Cloudflare Workers, D1 e R2. Os bindings esperados são `DB` e `BUCKET`; as migrations estão em `drizzle/`. A senha é configurada no servidor pelo segredo `EDITOR_PASSWORD_CONFIG`, contendo apenas `salt` e hash PBKDF2-SHA256.

O código pode ser armazenado no GitHub normalmente. Para manter login, propostas e uploads na Vercel, substitua D1/R2 por um banco e armazenamento compatíveis com Vercel, como Postgres e Blob. Publicar o projeto na Vercel sem essa adaptação não preserva o painel funcional. Para executar sem alterações, use Cloudflare Workers/Sites.

## Segurança

Não inclua senhas em arquivos `.env` versionados. A senha em texto puro não faz parte deste ZIP. O login usa cookie HttpOnly e as rotas de edição exigem sessão válida.
