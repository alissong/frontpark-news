# Front Park News

Página de informativo do condomínio **Front Park**: últimas atualizações, melhorias, avisos e novidades. Feita em React + Vite + Tailwind CSS.

O conteúdo é gerenciado por uma **planilha do Google Sheets** — sem necessidade de backend ou de editar código a cada edição. O site é 100% estático e pode ser publicado em qualquer hospedagem (Vercel, Netlify, GitHub Pages, etc.).

## Como rodar localmente

```bash
npm install
npm run dev
```

Sem configurar a planilha, a página exibe um **conteúdo de exemplo**.

## Configurando o conteúdo (Google Sheets)

1. Crie uma planilha no Google Sheets.
2. Em **Compartilhar**, defina como **"Qualquer pessoa com o link pode ver"**.
3. Copie o **ID** da planilha (na URL: `https://docs.google.com/spreadsheets/d/`**`<ID>`**`/edit`).
4. Copie `.env.example` para `.env` e preencha:

   ```
   VITE_SHEET_ID=seu_id_aqui
   VITE_SHEET_NAME=Conteudo
   ```

5. Reinicie o `npm run dev`.

### Formato da planilha

A primeira linha deve ter o cabeçalho com estas colunas:

| section | key | value | extra | level |
|---|---|---|---|---|

Exemplo de preenchimento:

| section | key | value | extra | level |
|---|---|---|---|---|
| meta | title | Front Park News | | |
| meta | subtitle | Informativo do condomínio | | |
| meta | edition | Maio/2026 | | |
| highlights | label | Destaque do mês | | |
| highlights | title | Fachada reformada | | |
| highlights | description | A pintura foi concluída... | | |
| summary | title | Resumo do mês | | |
| summary | item | 4 | Melhorias concluídas | |
| summary | item | 2 | Avisos importantes | |
| improvements | title | Melhorias e atualizações | | |
| improvements | item | Nova iluminação na garagem | | |
| warnings | title | Avisos importantes | | |
| warnings | item | Manutenção da água | Sem água dia 10/06, 9h-12h | alerta |
| next | title | Próximos passos | | |
| next | item | Reforma do salão de festas | | |
| meetings | title | Reuniões | | |
| meetings | item | Assembleia — 28/05, 19h | | |
| leisure | title | Lazer | | |
| leisure | item | Yoga aos sábados, 9h | | |
| barbecue | title | Churrasqueira | | |
| barbecue | description | Agende com 48h de antecedência. | | |
| footer | description | Dúvidas? Fale com a portaria. | | |
| footer | thanks | Obrigado por fazer parte do Front Park! | | |

**Observações:**

- **`section`**: define a seção. Valores aceitos: `meta`, `highlights`, `summary`, `improvements`, `warnings`, `next`, `meetings`, `leisure`, `barbecue`, `footer`.
- **`key`**: use `title`/`item` para listas; para `meta`, `highlights`, `barbecue` e `footer` use os campos diretos (ex.: `title`, `subtitle`, `description`).
- **`value`** e **`extra`**: em `summary` o `value` é o número e o `extra` é o rótulo; em `warnings` o `value` é o título e o `extra` é a descrição.
- **`level`** (só em `warnings`): cor da borda do aviso — `alerta` (vermelho), `aviso` (âmbar), `info` (azul) ou `ok` (verde).

## Build de produção

```bash
npm run build
npm run preview
```

> As variáveis `VITE_*` são embutidas no build. Ao publicar, configure-as no painel da hospedagem (ou no `.env` antes do build).
