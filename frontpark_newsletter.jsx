export default function FrontParkNews() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-600 text-white p-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-5xl font-black tracking-tight">📰 FRONT PARK NEWS</h1>
              <p className="text-lg mt-3 opacity-90">
                Informativo mensal do condomínio • Maio 2026
              </p>
            </div>

            <div className="bg-white/15 rounded-2xl p-5 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-widest opacity-80">Edição</p>
              <p className="text-3xl font-bold">#01</p>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-8 p-10 bg-gradient-to-b from-slate-50 to-white">
          <div>
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
              ✨ Destaques do mês
            </span>

            <h2 className="text-4xl font-black mt-6 text-slate-800 leading-tight">
              Melhorias, avisos e novidades do Front Park
            </h2>

            <p className="text-slate-600 mt-5 text-lg leading-relaxed">
              Confira tudo o que aconteceu no condomínio durante o mês: melhorias realizadas,
              reuniões, manutenções, avisos importantes e próximos projetos.
            </p>
          </div>

          <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-6">📊 Resumo rápido</h3>

            <div className="grid grid-cols-2 gap-5">
              <div className="bg-white/10 rounded-2xl p-5">
                <p className="text-4xl font-black">18</p>
                <p className="opacity-80 mt-2">Manutenções</p>
              </div>

              <div className="bg-white/10 rounded-2xl p-5">
                <p className="text-4xl font-black">42</p>
                <p className="opacity-80 mt-2">Chamados</p>
              </div>

              <div className="bg-white/10 rounded-2xl p-5">
                <p className="text-4xl font-black">5</p>
                <p className="opacity-80 mt-2">Melhorias</p>
              </div>

              <div className="bg-white/10 rounded-2xl p-5">
                <p className="text-4xl font-black">3</p>
                <p className="opacity-80 mt-2">Reuniões</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 p-10 bg-gray-50">
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-3xl font-black text-slate-800 mb-6">
                🛠️ Melhorias realizadas
              </h3>

              <div className="space-y-4 text-slate-700 text-lg">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  ✅ Troca de iluminação das áreas comuns
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl">
                  ✅ Revisão preventiva dos elevadores
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl">
                  ✅ Reforço da limpeza e manutenção do paisagismo
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl">
                  ✅ Ajustes operacionais na academia
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-3xl font-black text-slate-800 mb-6">
                🚨 Avisos importantes
              </h3>

              <div className="space-y-5 text-slate-700">
                <div className="border-l-4 border-orange-400 pl-5">
                  <h4 className="font-bold text-lg">🔇 Silêncio</h4>
                  <p>Evite barulhos excessivos após às 22h.</p>
                </div>

                <div className="border-l-4 border-blue-400 pl-5">
                  <h4 className="font-bold text-lg">🪟 Fachada</h4>
                  <p>
                    Não é permitido pendurar roupas, toalhas, bandeiras ou objetos nas varandas.
                  </p>
                </div>

                <div className="border-l-4 border-red-400 pl-5">
                  <h4 className="font-bold text-lg">🛵 Circulação</h4>
                  <p>
                    Entregadores podem acessar os blocos a pé, porém motos não podem circular até as portas.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-3xl p-8 text-white shadow-xl">
              <h3 className="text-3xl font-black mb-5">👷 O que vem por aí</h3>

              <ul className="space-y-3 text-lg opacity-95">
                <li>• Melhorias em análise para áreas comuns</li>
                <li>• Revisão de equipamentos da academia</li>
                <li>• Novos projetos de integração entre moradores</li>
                <li>• Estudos para melhorias de segurança</li>
              </ul>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-black text-slate-800 mb-5">
                📅 Reuniões
              </h3>

              <div className="space-y-4 text-slate-700">
                <div className="bg-slate-50 rounded-2xl p-4">
                  Reunião sobre regras de convivência.
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  Discussão sobre melhorias futuras.
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  Revisão de processos internos.
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-black text-slate-800 mb-5">
                🎉 Áreas de lazer
              </h3>

              <div className="space-y-4 text-slate-700">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  Reservas devem ser feitas antecipadamente.
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl">
                  Após o uso, o ambiente deve ser entregue limpo.
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl">
                  Todo lixo deve ser descartado corretamente.
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-7">
              <h3 className="text-2xl font-black text-amber-900 mb-4">
                🔥 Churrasqueira
              </h3>

              <p className="text-amber-800 leading-relaxed">
                Churrasco com carvão é permitido apenas nas coberturas.
                Não é permitido nos gardens e no segundo andar.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-900 text-white p-8 text-center">
          <p className="text-lg leading-relaxed opacity-90 max-w-3xl mx-auto">
            Este informativo apresenta um resumo das principais ações e orientações do condomínio.
            Consulte o regulamento interno completo para mais informações.
          </p>

          <div className="mt-6 text-2xl font-bold">
            💙 Obrigado pela colaboração de todos!
          </div>
        </div>
      </div>
    </div>
  )
}
