import React, { useEffect, useState } from "react";

export default function FrontParkNews() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/notion")
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar dados");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center">Carregando...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;
  if (!data) return null;

  // Exemplo de estrutura esperada em data:
  // {
  //   title, subtitle, edition, highlights, summary, improvements, warnings, next, meetings, leisure, barbecue, footer
  // }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-600 text-white p-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-5xl font-black tracking-tight">{data.title}</h1>
              <p className="text-lg mt-3 opacity-90">{data.subtitle}</p>
            </div>
            <div className="bg-white/15 rounded-2xl p-5 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-widest opacity-80">Edição</p>
              <p className="text-3xl font-bold">{data.edition}</p>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-8 p-10 bg-gradient-to-b from-slate-50 to-white">
          <div>
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
              {data.highlights?.label}
            </span>
            <h2 className="text-4xl font-black mt-6 text-slate-800 leading-tight">
              {data.highlights?.title}
            </h2>
            <p className="text-slate-600 mt-5 text-lg leading-relaxed">
              {data.highlights?.description}
            </p>
          </div>
          <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-6">{data.summary?.title}</h3>
            <div className="grid grid-cols-2 gap-5">
              {data.summary?.items?.map((item, idx) => (
                <div key={idx} className="bg-white/10 rounded-2xl p-5">
                  <p className="text-4xl font-black">{item.value}</p>
                  <p className="opacity-80 mt-2">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 p-10 bg-gray-50">
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-3xl font-black text-slate-800 mb-6">
                {data.improvements?.title}
              </h3>
              <div className="space-y-4 text-slate-700 text-lg">
                {data.improvements?.items?.map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl">{item}</div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-3xl font-black text-slate-800 mb-6">
                {data.warnings?.title}
              </h3>
              <div className="space-y-5 text-slate-700">
                {data.warnings?.items?.map((item, idx) => (
                  <div key={idx} className={`border-l-4 pl-5 ${item.color || ''}`}>
                    <h4 className="font-bold text-lg">{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-3xl p-8 text-white shadow-xl">
              <h3 className="text-3xl font-black mb-5">{data.next?.title}</h3>
              <ul className="space-y-3 text-lg opacity-95">
                {data.next?.items?.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
          {/* Right */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-black text-slate-800 mb-5">
                {data.meetings?.title}
              </h3>
              <div className="space-y-4 text-slate-700">
                {data.meetings?.items?.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-2xl p-4">{item}</div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-black text-slate-800 mb-5">
                {data.leisure?.title}
              </h3>
              <div className="space-y-4 text-slate-700">
                {data.leisure?.items?.map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl">{item}</div>
                ))}
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-7">
              <h3 className="text-2xl font-black text-amber-900 mb-4">
                {data.barbecue?.title}
              </h3>
              <p className="text-amber-800 leading-relaxed">
                {data.barbecue?.description}
              </p>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="bg-slate-900 text-white p-8 text-center">
          <p className="text-lg leading-relaxed opacity-90 max-w-3xl mx-auto">
            {data.footer?.description}
          </p>
          <div className="mt-6 text-2xl font-bold">
            {data.footer?.thanks}
          </div>
        </div>
      </div>
    </div>
  );
}
