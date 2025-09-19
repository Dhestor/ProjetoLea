import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ComoFunciona() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Como Funciona a Compra de Imóveis com Desconto?</h1>

          <div className="space-y-8">
            {/* Seção 1: O que é um leilão de imóveis */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">O que são Imóveis com Desconto da União?</h2>
              <p className="text-gray-600 leading-relaxed">
                São imóveis oferecidos pela União através da plataforma Comprei, com valores até 50% abaixo do mercado. 
                Estes imóveis são provenientes de execuções fiscais e ofertas extrajudiciais, proporcionando oportunidades únicas de aquisição.
              </p>
            </div>

            {/* Seção 2: Etapas do Processo */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Etapas do Processo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-800 mb-2">1º Período</h3>
                  <p className="text-gray-600">
                    Proposta igual ou superior ao valor de avaliação efetiva compra imediata. 
                    Proposta abaixo do valor pode virar compra se não for superada em 30 dias.
                  </p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-800 mb-2">2º Período</h3>
                  <p className="text-gray-600">
                    Após 30 dias, o valor mínimo é reduzido, oferecendo ainda mais desconto 
                    para facilitar a aquisição do imóvel.
                  </p>
                </div>
              </div>
            </div>

            {/* Seção 3: Vantagens */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Vantagens dos Imóveis com Desconto</h2>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <li className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-3">
                    <i className="fas fa-percentage text-orange-600 text-xl"></i>
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">Descontos Reais</h3>
                  </div>
                  <p className="text-gray-600">Imóveis com descontos de até 50% do valor de mercado através da plataforma oficial Comprei.</p>
                </li>
                <li className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-3">
                    <i className="fas fa-file-contract text-orange-600 text-xl"></i>
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">Documentação Legal</h3>
                  </div>
                  <p className="text-gray-600">Processo transparente e documentação verificada por especialistas.</p>
                </li>
                <li className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-3">
                    <i className="fas fa-home text-orange-600 text-xl"></i>
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">Diversidade</h3>
                  </div>
                  <p className="text-gray-600">Grande variedade de imóveis disponíveis em diferentes localizações.</p>
                </li>
              </ul>
            </div>

            {/* Seção 4: Como Participar */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Como Funciona Nosso Site</h2>
              <div className="bg-blue-50 p-6 rounded-lg space-y-4">
                <ol className="list-decimal list-inside space-y-3 text-gray-600">
                  <li>Navegue pelos imóveis disponíveis em nosso site</li>
                  <li>Clique no imóvel de seu interesse para ver detalhes</li>
                  <li>Clique em "Iniciar Negociação" para ser redirecionado</li>
                  <li>Você será direcionado para a plataforma oficial Comprei</li>
                  <li>Faça login com sua conta GOV.BR</li>
                  <li>Complete sua proposta diretamente na plataforma Comprei</li>
                </ol>
              </div>
            </div>

            {/* Seção 5: Formas de Pagamento */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Formas de Pagamento</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Pagamento via DARF ou DJE</h3>
                    <p className="text-gray-600 mb-3">
                      O pagamento deve ser realizado em até 2 dias úteis após disponibilização da guia:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>DARF (Documento de Arrecadação de Receitas Federais) - emitido na plataforma</li>
                      <li>DJE (Guia Judicial) - emitida pelo vendedor</li>
                      <li>Comissão de 5% paga ao intermediário via transferência bancária</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Parcelamento (quando disponível)</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Juros equivalentes à taxa SELIC</li>
                      <li>Registro de hipoteca em favor do credor</li>
                      <li>Multa de 50% em caso de atraso</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção 6: Documentação e Entrega */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Documentação e Entrega</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Venda Judicial</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Auto de Alienação emitido pelo Comprei</li>
                    <li>Assinatura do Procurador da Fazenda Nacional</li>
                    <li>Homologação judicial</li>
                    <li>Entrega após Carta de Alienação</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Venda Extrajudicial</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Contrato de Compra e Venda</li>
                    <li>Credor como interveniente/anuente</li>
                    <li>Pagamento após assinatura</li>
                    <li>Entrega em até 15 dias</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Seção 7: Importante */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Informações Importantes</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                <div className="space-y-3 text-gray-700">
                  <p><strong>Registro obrigatório:</strong> O comprador deve registrar a propriedade em até 30 dias após a imissão na posse.</p>
                  <p><strong>Propostas válidas:</strong> Apenas na plataforma oficial Comprei (comprei.pgfn.gov.br).</p>
                  <p><strong>Estado do imóvel:</strong> Vendido "ad corpus" - no estado em que se encontra.</p>
                  <p><strong>Custos adicionais:</strong> Despesas de transferência, registro e impostos por conta do comprador.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Pronto para encontrar seu imóvel com desconto?</p>
            <a href="/" className="inline-block bg-orange-600 text-white px-8 py-3 rounded-md hover:bg-orange-700">
              Ver Imóveis Disponíveis
            </a>
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
