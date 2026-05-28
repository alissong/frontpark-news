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

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx = {
    section: header.indexOf("section"),
    key: header.indexOf("key"),
    value: header.indexOf("value"),
    extra: header.indexOf("extra"),
    level: header.indexOf("level"),
  };

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

  for (let i = 1; i < rows.length; i++) {
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

export async function fetchContent(signal) {
  if (!SHEET_ID) {
    // Sem planilha configurada: usa o conteúdo de exemplo.
    return SAMPLE_DATA;
  }

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    SHEET_NAME
  )}`;

  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error("Não foi possível carregar a planilha do informativo.");
  }

  const text = await res.text();
  const data = rowsToData(parseCsv(text));

  if (!data || !data.title) {
    throw new Error("A planilha foi carregada, mas está vazia ou em formato inesperado.");
  }

  return data;
}
