// Carrega o conteúdo do informativo a partir de uma planilha do Google Sheets
// publicada/compartilhada como "qualquer pessoa com o link pode ver".
//
// Não há backend: a planilha é lida diretamente no navegador via endpoint CSV
// do Google (gviz). Assim o site continua 100% estático e independente de deploy.
//
// Configure no arquivo .env (veja .env.example):
//   VITE_SHEET_ID    -> id da planilha (parte da URL entre /d/ e /edit)
//   VITE_SHEET_NAME  -> nome da aba/guia (padrão: "Conteudo")
//
// Formato esperado da planilha (primeira linha = cabeçalho):
//   section | key | value | extra | level
// Veja o README para a tabela completa de exemplo.

const SHEET_ID = import.meta.env.VITE_SHEET_ID;
const SHEET_NAME = import.meta.env.VITE_SHEET_NAME || "Conteudo";
// Aba com os itens de mídia (fotos/vídeos) da galeria de ações e eventos.
const GALLERY_SHEET = import.meta.env.VITE_GALLERY_SHEET || "Galeria";

// Conteúdo de exemplo exibido quando nenhuma planilha está configurada.
// Garante que a página sempre renderize algo coerente.
export const SAMPLE_DATA = {
  title: "Front Park News",
  subtitle: "Informativo do condomínio — atualizações e melhorias",
  edition: "Edição de exemplo",
  highlights: {
    label: "Destaque do mês",
    title: "Configure sua planilha para publicar a edição real",
    description:
      "Este é um conteúdo de demonstração. Defina VITE_SHEET_ID no arquivo .env apontando para sua planilha do Google para exibir as informações reais do condomínio.",
  },
  summary: {
    title: "Resumo do mês",
    items: [
      { value: "4", label: "Melhorias concluídas" },
      { value: "2", label: "Avisos importantes" },
      { value: "1", label: "Reunião realizada" },
      { value: "3", label: "Próximos passos" },
    ],
  },
  improvements: {
    title: "Melhorias e atualizações",
    items: [
      "Pintura da fachada concluída.",
      "Nova iluminação de LED na garagem.",
      "Manutenção preventiva dos elevadores.",
    ],
  },
  warnings: {
    title: "Avisos importantes",
    items: [
      {
        title: "Manutenção da caixa d'água",
        description: "Haverá interrupção no fornecimento de água no dia 10/06, das 9h às 12h.",
        level: "alerta",
      },
      {
        title: "Nova coleta seletiva",
        description: "A coleta de recicláveis passa a ocorrer às terças e quintas.",
        level: "info",
      },
    ],
  },
  next: {
    title: "Próximos passos",
    items: [
      "Reforma do salão de festas (orçamento em análise).",
      "Instalação de câmeras na portaria.",
      "Assembleia geral em julho.",
    ],
  },
  meetings: {
    title: "Reuniões",
    items: ["Assembleia ordinária — 28/05, 19h, salão de festas."],
  },
  leisure: {
    title: "Lazer",
    items: ["Aulas de yoga aos sábados, 9h.", "Cinema ao ar livre no último domingo do mês."],
  },
  barbecue: {
    title: "Churrasqueira",
    description: "Agende pelo aplicativo do condomínio com 48h de antecedência. Respeite o silêncio após as 22h.",
  },
  footer: {
    description:
      "Este informativo é produzido pela administração do condomínio. Dúvidas e sugestões podem ser enviadas à portaria ou pelo aplicativo.",
    thanks: "Obrigado por fazer parte do Front Park! 💚",
  },
  gallery: [
    {
      type: "video",
      url: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
      title: "Poda da grama",
      date: "2026-05-20",
      description: "Manutenção mensal dos jardins e áreas verdes.",
      category: "Manutenção",
    },
    {
      type: "foto",
      url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      title: "Confraternização",
      date: "2026-05-10",
      description: "Encontro dos moradores no salão de festas.",
      category: "Eventos",
    },
    {
      type: "foto",
      url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      title: "Nova iluminação da garagem",
      date: "2026-04-28",
      description: "Troca por lâmpadas de LED concluída.",
      category: "Obras",
    },
  ],
};

// Parser de CSV que respeita aspas, vírgulas e quebras de linha dentro de campos.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

// Converte as linhas da planilha no formato de dados consumido pela página.
function rowsToData(rows) {
  if (rows.length === 0) return null;

  // O endpoint do Google às vezes inclui a linha de cabeçalho, às vezes não.
  // Procuramos a linha que contém "section"; se não existir, assumimos a ordem
  // fixa das colunas e tratamos todas as linhas como dados.
  const FIELDS = ["section", "key", "value", "extra", "level"];
  const headerRow = rows.findIndex((r) =>
    r.some((c) => c.trim().toLowerCase() === "section")
  );

  let idx;
  let startRow;
  if (headerRow >= 0) {
    const header = rows[headerRow].map((h) => h.trim().toLowerCase());
    idx = Object.fromEntries(FIELDS.map((f) => [f, header.indexOf(f)]));
    startRow = headerRow + 1;
  } else {
    idx = { section: 0, key: 1, value: 2, extra: 3, level: 4 };
    startRow = 0;
  }

  const data = {
    highlights: {},
    summary: { items: [] },
    improvements: { items: [] },
    warnings: { items: [] },
    next: { items: [] },
    meetings: { items: [] },
    leisure: { items: [] },
    barbecue: {},
    footer: {},
  };

  const get = (cols, name) => (idx[name] >= 0 ? (cols[idx[name]] ?? "").trim() : "");

  for (let i = startRow; i < rows.length; i++) {
    const cols = rows[i];
    const section = get(cols, "section").toLowerCase();
    const key = get(cols, "key").toLowerCase();
    const value = get(cols, "value");
    const extra = get(cols, "extra");
    const level = get(cols, "level").toLowerCase();

    if (!section) continue;

    switch (section) {
      case "meta":
        // title / subtitle / edition
        if (key) data[key] = value;
        break;
      case "highlights":
        if (key) data.highlights[key] = value;
        break;
      case "summary":
        if (key === "title") data.summary.title = value;
        else if (key === "item") data.summary.items.push({ value, label: extra });
        break;
      case "warnings":
        if (key === "title") data.warnings.title = value;
        else if (key === "item")
          data.warnings.items.push({ title: value, description: extra, level });
        break;
      case "improvements":
      case "next":
      case "meetings":
      case "leisure":
        if (key === "title") data[section].title = value;
        else if (key === "item") data[section].items.push(value);
        break;
      case "barbecue":
        if (key) data.barbecue[key] = value;
        break;
      case "footer":
        if (key) data.footer[key] = value;
        break;
      default:
        break;
    }
  }

  return data;
}

// Monta a URL do endpoint CSV (gviz) para uma aba específica da planilha.
function gvizUrl(sheetName) {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    sheetName
  )}`;
}

// Converte as linhas da aba "Galeria" numa lista de itens de mídia.
function rowsToGallery(rows) {
  if (rows.length === 0) return [];

  // Detecta a linha de cabeçalho (procura "url"); sem cabeçalho, usa a ordem
  // fixa das colunas: tipo | url | titulo | data | descricao | categoria.
  const headerRow = rows.findIndex((r) =>
    r.some((c) => ["url", "link"].includes(c.trim().toLowerCase()))
  );

  let col;
  let startRow;
  if (headerRow >= 0) {
    const header = rows[headerRow].map((h) => h.trim().toLowerCase());
    const find = (...names) => header.findIndex((h) => names.includes(h));
    col = {
      type: find("tipo", "type"),
      url: find("url", "link"),
      title: find("titulo", "título", "title"),
      date: find("data", "date"),
      description: find("descricao", "descrição", "description"),
      category: find("categoria", "category"),
    };
    startRow = headerRow + 1;
  } else {
    col = { type: 0, url: 1, title: 2, date: 3, description: 4, category: 5 };
    startRow = 0;
  }

  const get = (cols, i) => (i >= 0 ? (cols[i] ?? "").trim() : "");
  const items = [];

  for (let i = startRow; i < rows.length; i++) {
    const cols = rows[i];
    const url = get(cols, col.url);
    if (!url) continue;

    let type = get(cols, col.type).toLowerCase();
    if (type !== "video" && type !== "foto") {
      // Detecta pelo formato do arquivo quando o tipo não é informado.
      type = /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url) ? "video" : "foto";
    }

    items.push({
      type,
      url,
      title: get(cols, col.title),
      date: get(cols, col.date),
      description: get(cols, col.description),
      category: get(cols, col.category),
    });
  }

  // Mais recentes primeiro (datas ISO yyyy-mm-dd ordenam corretamente como texto).
  items.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  return items;
}

async function fetchGallery(signal) {
  try {
    const res = await fetch(gvizUrl(GALLERY_SHEET), { signal });
    if (!res.ok) return [];
    const text = await res.text();
    // Aba inexistente devolve uma página HTML de erro em vez de CSV.
    if (text.trimStart().startsWith("<")) return [];
    return rowsToGallery(parseCsv(text));
  } catch (err) {
    if (err.name === "AbortError") throw err;
    return [];
  }
}

export async function fetchContent(signal) {
  if (!SHEET_ID) {
    // Sem planilha configurada: usa o conteúdo de exemplo.
    return SAMPLE_DATA;
  }

  const [res, gallery] = await Promise.all([
    fetch(gvizUrl(SHEET_NAME), { signal }),
    fetchGallery(signal),
  ]);

  if (!res.ok) {
    throw new Error("Não foi possível carregar a planilha do informativo.");
  }

  const text = await res.text();

  // Quando a planilha não está pública, o Google devolve uma página HTML
  // (login/permissão) em vez do CSV.
  if (text.trimStart().startsWith("<")) {
    throw new Error(
      'Não foi possível ler a planilha. Verifique se o compartilhamento está como "Qualquer pessoa com o link" (Leitor).'
    );
  }

  const data = rowsToData(parseCsv(text));

  if (!data || !data.title) {
    throw new Error(
      'A planilha foi lida, mas não encontrei o conteúdo esperado. Confira o nome da aba (VITE_SHEET_NAME) e o cabeçalho "section, key, value, extra, level".'
    );
  }

  data.gallery = gallery;
  return data;
}
