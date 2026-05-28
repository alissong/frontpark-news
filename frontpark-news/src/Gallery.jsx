import { useEffect, useMemo, useState } from "react";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

// Converte uma data ISO (yyyy-mm-dd) para o formato brasileiro dd/mm/aaaa.
function formatDate(date) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date || "");
  return m ? `${m[3]}/${m[2]}/${m[1]}` : date || "";
}

function Lightbox({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title || "Mídia"}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="absolute top-4 right-6 text-white/80 hover:text-white text-4xl leading-none"
      >
        &times;
      </button>
      <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        {item.type === "video" ? (
          <video
            src={item.url}
            controls
            autoPlay
            className="w-full max-h-[80vh] rounded-2xl bg-black"
          />
        ) : (
          <img
            src={item.url}
            alt={item.title || "Foto"}
            className="w-full max-h-[80vh] object-contain rounded-2xl"
          />
        )}
        {(item.title || item.description) && (
          <div className="text-center text-white mt-4">
            {item.title && <h4 className="text-xl font-bold">{item.title}</h4>}
            {item.description && <p className="opacity-80 mt-1">{item.description}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Gallery({ items, title = "Galeria de Ações & Eventos" }) {
  const [active, setActive] = useState("Todos");
  const [selected, setSelected] = useState(null);

  const categories = useMemo(() => {
    const set = new Set((items || []).map((i) => i.category).filter(Boolean));
    return ["Todos", ...set];
  }, [items]);

  const filtered = useMemo(
    () => (active === "Todos" ? items : items.filter((i) => i.category === active)),
    [items, active]
  );

  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <section className="p-10 bg-white border-t border-gray-100">
      <h3 className="text-3xl font-black text-slate-800 mb-6">{title}</h3>

      {categories.length > 2 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                active === cat
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelected(item)}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-800"
            aria-label={item.title || (item.type === "video" ? "Reproduzir vídeo" : "Ver foto")}
          >
            {item.type === "video" ? (
              <>
                <video
                  src={item.url}
                  preload="metadata"
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-black/50 text-white rounded-full p-3 group-hover:bg-black/70 transition-colors">
                    <PlayIcon />
                  </span>
                </span>
              </>
            ) : (
              <img
                src={item.url}
                alt={item.title || "Foto"}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            )}
            {(item.title || item.date) && (
              <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left">
                {item.title && (
                  <span className="block text-white text-sm font-semibold truncate">{item.title}</span>
                )}
                {item.date && <span className="block text-white/70 text-xs">{formatDate(item.date)}</span>}
              </span>
            )}
          </button>
        ))}
      </div>

      {selected && <Lightbox item={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
