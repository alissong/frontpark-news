# Front Park News

Página de informativo do condomínio **Front Park**: últimas atualizações, melhorias, avisos e novidades. Feita em React + Vite + Tailwind CSS.

O conteúdo é gerenciado por uma **planilha do Google Sheets** — sem necessidade de backend ou de editar código a cada edição. O site é 100% estático e pode ser publicado em qualquer hospedagem (Vercel, Netlify, GitHub Pages, etc.).

## Como rodar localmente

### Pré-requisitos

- **Node.js 18 ou superior** (recomendado 20+). Verifique com `node -v`. Se não tiver, baixe em [nodejs.org](https://nodejs.org).
- O **npm** já vem junto com o Node.

### Passo a passo

> O projeto fica na pasta `frontpark-news/`. Rode os comandos a partir dela.

```bash
# 1. Entre na pasta do projeto
cd frontpark-news

# 2. Instale as dependências (só na primeira vez)
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

O terminal vai mostrar algo como:

```
  VITE v8.x  ready in 300 ms

  ➜  Local:   http://localhost:5173/
```

Abra **http://localhost:5173/** no navegador. A página recarrega sozinha a cada alteração no código (hot reload). Para parar o servidor, pressione **Ctrl + C**.

Sem configurar a planilha, a página já abre com um **conteúdo de exemplo** (incluindo a galeria), então dá para ver tudo funcionando antes de conectar o Google Sheets.

### Visualizar o build de produção localmente

Para conferir exatamente o que vai pro ar:

```bash
npm run build     # gera a pasta dist/
npm run preview   # serve o build em http://localhost:4173/
```

## Configurando o conteúdo (Google Sheets)

> **Atalho — modelos prontos para importar:** a pasta [`exemplos/`](./exemplos) tem `Conteudo.csv` e `Galeria.csv` já preenchidos. No Google Sheets, crie uma planilha, vá em **Arquivo → Importar → Fazer upload**, selecione o CSV e escolha **"Inserir nova(s) planilha(s)"**. Depois **renomeie as abas** para `Conteudo` e `Galeria`. Pronto: é só ajustar os textos.

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

## Galeria de Ações & Eventos (fotos e vídeos)

A página tem uma seção de galeria (grade com lightbox) alimentada por uma **segunda aba** da mesma planilha, chamada **`Galeria`** (configurável via `VITE_GALLERY_SHEET`). Diferente da aba de conteúdo, aqui cada **linha é um item de mídia** e as colunas são diretas:

| tipo | url | titulo | data | descricao | categoria |
|---|---|---|---|---|---|
| video | https://res.cloudinary.com/SEU/video/upload/poda.mp4 | Poda da grama | 2026-05-20 | Manutenção dos jardins | Manutenção |
| foto | https://res.cloudinary.com/SEU/image/upload/festa.jpg | Festa junina | 2026-06-15 | Confraternização no salão | Eventos |

- **`tipo`**: `video` ou `foto` (se ficar em branco, é detectado pela extensão do arquivo).
- **`url`**: link direto da mídia.
- **`data`**: use o formato `aaaa-mm-dd` (os itens são ordenados do mais recente ao mais antigo).
- **`categoria`**: opcional; quando há categorias, aparece um filtro (ex.: Manutenção, Eventos, Obras).

### Hospedando as mídias no Cloudinary (grátis)

1. Crie uma conta em [cloudinary.com](https://cloudinary.com).
2. Suba a foto/vídeo no **Media Library**.
3. Copie a **URL** do arquivo (botão de compartilhar/copiar link) e cole na coluna `url`.

> Vídeos tocam direto na página (player nativo) e fotos abrem ampliadas no lightbox. Sem essa aba, a galeria simplesmente não aparece.

## Build e publicação

Gere os arquivos estáticos com `npm run build` (saída na pasta `dist/`) e publique-os em qualquer hospedagem estática (Vercel, Netlify, GitHub Pages, etc.). Para conferir o build localmente antes, use `npm run preview` (veja [Visualizar o build de produção localmente](#visualizar-o-build-de-produção-localmente)).

> As variáveis `VITE_*` são embutidas no build. Ao publicar, configure-as no painel da hospedagem (ou no `.env` antes de rodar `npm run build`).
