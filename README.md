# WAKE — Propostas leves

Interface em HTML, CSS e JavaScript, sem React, Next, dependências instaladas ou pasta `app`.

- Palavra de acesso validada no servidor, configurada fora do repositório.
- Até 10 propostas ativas, cada uma com seu link público.
- Edição direta de cliente, logo, escopo, entregáveis e investimento.
- Adição/remoção de itens, exclusão de propostas e cópia de links.
- 22 logos de referência, marca WAKE branca e fonte Inter local preservadas.
- Dados e links anteriores preservados no D1/R2 do serviço existente.

## GitHub e Vercel

Importe este repositório na Vercel. Use preset **Other**, comando `node scripts/build.mjs --static` e saída `web` (já definidos em `vercel.json`). Não há dependências para instalar.

A interface estática é hospedada na Vercel, que encaminha as chamadas da API ao serviço existente. As propostas, sessões e imagens ficam no serviço WAKE existente em `wake-propostas.andrezacavichioli.chatgpt.site`. Esse serviço precisa continuar ativo. Nenhuma chave administrativa fica no navegador ou neste repositório. A Vercel não cria um banco separado nem duplica os dados.

## Arquivos

`src/` contém a interface, API e um único catálogo de imagens/fontes incorporadas. `scripts/build.mjs` cria o Worker do Sites e a interface estática para Vercel. `migrations.sql` documenta o esquema inicial para instalações novas; não execute novamente em banco existente.

## Desenvolvimento local

Node.js 22.13+. Configure `.local-access.json` com `salt` e `hash` PBKDF2-SHA256 de uma palavra de teste (100.000 iterações); este arquivo fica fora do Git. Execute `npm run dev`. O banco local fica em `.local-data/`, separado da produção.

`npm test` verifica o acesso, o limite de propostas, a edição, publicação e exclusão usando um banco SQLite em memória.

A Vercel recebe somente os arquivos estáticos de `web`. O preset é fixado em Other (`framework: null`). A API persistente é gerada como Worker apenas para o serviço WAKE, fora da compilação da Vercel.
