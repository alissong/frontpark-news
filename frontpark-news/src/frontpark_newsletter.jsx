import { useEffect, useState } from "react";
import { fetchContent } from "./lib/content";
import Gallery from "./Gallery";

// Mapa fixo de cores para os avisos. Usar classes literais garante que o
// Tailwind as detecte (classes geradas dinamicamente seriam removidas no build).
const WARNING_COLORS = {
  alerta: "border-red-500",
  aviso: "border-amber-500",
  info: "border-blue-500",
  ok: "border-green-500",
};

function Skeleton() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 animate-pulse">
        <div className="bg-slate-200 h-40" />
        <div className="p-10 space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3" />
          <div className="h-24 bg-slate-100 rounded" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-40 bg-slate-100 rounded" />
            <div className="h-40 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-200 p-10 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-3">Não foi possível carregar</h2>
        <p className="text-slate-600 mb-6">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="bg-slate-800 text-white font-semibold px-6 py-3 rounded-full hover:bg-slate-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

function Section({ children }) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">{children}</div>
  );
}

export default function FrontParkNews() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Enquanto não há dado nem erro, estamos carregando (estado derivado, para
  // evitar chamar setState de forma síncrona dentro do efeito).
  const loading = data === null && error === null;

  useEffect(() => {
    const controller = new AbortController();
    fetchContent(controller.signal)
      .then((json) => setData(json))
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Erro ao buscar dados.");
      });
    return () => controller.abort();
  }, [reloadKey]);

  const retry = () => {
    setData(null);
    setError(null);
    setReloadKey((k) => k + 1);
  };

  if (loading) return <Skeleton />;
  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (!data) return null;

  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <header className="bg-gradient-to-r from-slate-800 to-slate-600 text-white p-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight">{data.title}</h1>
              <p className="text-lg mt-3 opacity-90">{data.subtitle}</p>
            </div>
            {data.edition && (
              <div className="bg-white/15 rounded-2xl p-5 backdrop-blur-sm">
                <p className="text-sm uppercase tracking-widest opacity-80">Edição</p>
                <p className="text-2xl sm:text-3xl font-bold">{data.edition}</p>
              </div>
            )}
          </div>
        </header>

        {/* Hero */}
        <section className="grid md:grid-cols-2 gap-8 p-10 bg-gradient-to-b from-slate-50 to-white">
          <div>
            {data.highlights?.label && (
              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                {data.highlights.label}
              </span>
            )}
            <h2 className="text-3xl sm:text-4xl font-black mt-6 text-slate-800 leading-tight">
              {data.highlights?.title}
            </h2>
            <p className="text-slate-600 mt-5 text-lg leading-relaxed">
              {data.highlights?.description}
            </p>
          </div>
          {hasItems(data.summary?.items) && (
            <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-6">{data.summary?.title}</h3>
              <div className="grid grid-cols-2 gap-5">
                {data.summary.items.map((item, idx) => (
                  <div key={idx} className="bg-white/10 rounded-2xl p-5">
                    <p className="text-4xl font-black">{item.value}</p>
                    <p className="opacity-80 mt-2">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 p-10 bg-gray-50">
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            {hasItems(data.improvements?.items) && (
              <Section>
                <h3 className="text-3xl font-black text-slate-800 mb-6">
                  {data.improvements?.title}
                </h3>
                <ul className="space-y-4 text-slate-700 text-lg">
                  {data.improvements.items.map((item, idx) => (
                    <li key={idx} className="p-4 bg-slate-50 rounded-2xl">
                      {item}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {hasItems(data.warnings?.items) && (
              <Section>
                <h3 className="text-3xl font-black text-slate-800 mb-6">{data.warnings?.title}</h3>
                <div className="space-y-5 text-slate-700">
                  {data.warnings.items.map((item, idx) => (
                    <div
                      key={idx}
                      className={`border-l-4 pl-5 ${WARNING_COLORS[item.level] || "border-slate-300"}`}
                    >
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}
            {hasItems(data.next?.items) && (
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-3xl p-8 text-white shadow-xl">
                <h3 className="text-3xl font-black mb-5">{data.next?.title}</h3>
                <ul className="space-y-3 text-lg opacity-95 list-disc list-inside">
                  {data.next.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {/* Right */}
          <div className="space-y-8">
            {hasItems(data.meetings?.items) && (
              <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-black text-slate-800 mb-5">{data.meetings?.title}</h3>
                <ul className="space-y-4 text-slate-700">
                  {data.meetings.items.map((item, idx) => (
                    <li key={idx} className="bg-slate-50 rounded-2xl p-4">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {hasItems(data.leisure?.items) && (
              <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-black text-slate-800 mb-5">{data.leisure?.title}</h3>
                <ul className="space-y-4 text-slate-700">
                  {data.leisure.items.map((item, idx) => (
                    <li key={idx} className="p-4 bg-slate-50 rounded-2xl">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.barbecue?.description && (
              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-7">
                <h3 className="text-2xl font-black text-amber-900 mb-4">{data.barbecue?.title}</h3>
                <p className="text-amber-800 leading-relaxed">{data.barbecue?.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Galeria de Ações & Eventos */}
        <Gallery items={data.gallery || []} />

        {/* Footer */}
        <footer className="bg-slate-900 text-white p-8 text-center">
          <p className="text-lg leading-relaxed opacity-90 max-w-3xl mx-auto">
            {data.footer?.description}
          </p>
          {data.footer?.thanks && <div className="mt-6 text-2xl font-bold">{data.footer.thanks}</div>}
        </footer>
      </div>
    </div>
  );
}
