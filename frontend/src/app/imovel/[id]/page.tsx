'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Property } from '@/types/Property';
import { getProperty } from '@/services/properties';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function PropertyDetails() {
  const router = useRouter();
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    async function fetchProperty() {
      try {
        if (params.id) {
          const data = await getProperty(Number(params.id));
          setProperty(data);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        setError('Erro ao carregar os detalhes do imóvel');
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Imóvel não encontrado</h1>
            <Link href="/" className="mt-4 inline-block text-orange-600 hover:text-orange-700">
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Calculate second auction date (7 days after deadline)
  const firstAuctionDate = new Date(property.deadline);
  const secondAuctionDate = new Date(firstAuctionDate);
  secondAuctionDate.setDate(secondAuctionDate.getDate() + 7);

  // Format dates
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-gray-100">
      <Header />

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Voltar */}
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center">
            <i className="fas fa-arrow-left mr-2"></i>
            Voltar para listagem
          </Link>
        </div>

        {/* Detalhes do Imóvel */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Galeria de Imagens */}
          <div className="relative h-96">
            <img
              src={property.media?.[currentImageIndex]?.url || '/images/property-placeholder.jpg'}
              alt={property.title}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setShowImageModal(true)}
            />
            
            {/* Navegação de imagens */}
            {property.media && property.media.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : property.media!.length - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button
                  onClick={() => setCurrentImageIndex(prev => prev < property.media!.length - 1 ? prev + 1 : 0)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {property.media.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* Botão de ampliar */}
            <button
              onClick={() => setShowImageModal(true)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              <i className="fas fa-expand"></i>
            </button>
            
            {/* Contador de imagens */}
            {property.media && property.media.length > 0 && (
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {property.media.length}
              </div>
            )}
          </div>

          {/* Informações do Imóvel */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Coluna 1: Informações Principais */}
              <div className="lg:col-span-2">
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {property.property_type?.name} em {property.address?.split(',')[0]}
                  </h1>
                </div>

                <div className="space-y-6">
                  {/* Endereço */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Localização</h2>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p className="text-gray-800 font-medium">{property.address}</p>
                      {property.reference_point && (
                        <p className="text-gray-600">
                          <i className="fas fa-map-pin mr-2 text-gray-400"></i>
                          Referência: {property.reference_point}
                        </p>
                      )}
                      <div className="flex items-center text-gray-600">
                        <i className="fas fa-map-marker-alt mr-2 text-gray-400"></i>
                        <span>{property.address?.split(',').slice(-2).join(', ')?.trim()}</span>
                      </div>
                      {property.google_maps_link && (
                        <a 
                          href={property.google_maps_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-2"
                        >
                          <i className="fas fa-external-link-alt mr-2"></i>
                          Ver no Google Maps
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Preço */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-gray-600 mb-1">Valor atual:</p>
                        <p className="text-3xl font-bold text-orange-600">
                          {formatCurrency(property.market_price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Valor mínimo:</p>
                        <p className="text-xl text-gray-500">
                          {formatCurrency(property.minimum_price)}
                        </p>
                      </div>
                    </div>
                  </div>                  {/* Características */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Características</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {property.bedrooms && (
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-bed text-gray-400"></i>
                          <span>{property.bedrooms} Quartos</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-bath text-gray-400"></i>
                          <span>{property.bathrooms} Banheiros</span>
                        </div>
                      )}
                      {property.garage_spots && (
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-car text-gray-400"></i>
                          <span>{property.garage_spots} Vaga{property.garage_spots > 1 ? 's' : ''}</span>
                        </div>
                      )}
                      {property.built_area && (
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-vector-square text-gray-400"></i>
                          <span>{property.built_area} m²</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Informações Jurídicas */}
                  {(property.matricula || property.processo || property.juizo || property.cartorio || property.has_gravames) && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações Jurídicas</h2>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
                        {property.matricula && (
                          <div>
                            <span className="font-medium text-gray-700">Matrícula do Bem:</span>
                            <span className="ml-2 text-gray-600">{property.matricula}</span>
                          </div>
                        )}
                        {property.processo && (
                          <div>
                            <span className="font-medium text-gray-700">Processo:</span>
                            <span className="ml-2 text-gray-600">{property.processo}</span>
                          </div>
                        )}
                        {property.juizo && (
                          <div>
                            <span className="font-medium text-gray-700">Juízo:</span>
                            <span className="ml-2 text-gray-600">{property.juizo}</span>
                          </div>
                        )}
                        {property.cartorio && (
                          <div>
                            <span className="font-medium text-gray-700">Cartório:</span>
                            <span className="ml-2 text-gray-600">{property.cartorio}</span>
                          </div>
                        )}
                        {property.has_gravames && (
                          <div>
                            <span className="font-medium text-gray-700">Gravames:</span>
                            <span className="ml-2 text-gray-600">
                              {property.has_gravames === 'sim' ? (
                                <>
                                  Sim
                                  {property.gravames_details && (
                                    <details className="mt-2">
                                      <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                                        Ver detalhes
                                      </summary>
                                      <div className="mt-2 p-3 bg-white border rounded text-sm">
                                        {property.gravames_details}
                                      </div>
                                    </details>
                                  )}
                                </>
                              ) : (
                                'Não'
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {property.property_features?.map((feature, index) => (
                      <span key={index} className="text-sm text-gray-600 bg-gray-200 rounded-full px-4 py-1">
                        {feature.feature}
                      </span>
                    ))}
                  </div>

                  {/* Descrição */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Descrição do Imóvel</h2>
                    <p className="text-gray-600 leading-relaxed">{property.description}</p>
                  </div>

                  {/* Normas */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-blue-900 mb-4">Normas</h2>
                    <div className="space-y-6 text-sm text-blue-800">
                      <div>
                        <h3 className="font-semibold mb-2">1 - Características do negócio</h3>
                        <p className="mb-3">
                          <strong>Para venda judicial:</strong> A compra de bens no Comprei é causa originária de aquisição de propriedade, portanto, o comprador recebe o bem desembaraçado e livre de ônus em registro público, salvo disposição judicial em sentido diverso. Portanto, é importante conferir se há ressalvas na decisão judicial que incluiu o bem na plataforma. A alienação de bens ocorre ad corpus, ou seja, os bens serão vendidos no estado de conservação em que se encontrarem, não havendo responsabilidade do Comprei ou do credor quanto a dimensões, consertos, reparos ou mesmo providências referentes à retirada, embalagem, impostos, encargos sociais e transportes.
                        </p>
                        <p>
                          <strong>Para venda extrajudicial:</strong> Venda sem litígio, em que o devedor ofereceu um bem para pagamento da dívida. Modalidade mais rápida e simplificada, sem resistência do devedor, que entregará o bem ao comprador desocupado. O negócio será particular, entre o comprador e o devedor/vendedor, figurando o credor como interveniente/anuente no Contrato de Compra e Venda. Nesta modalidade, o devedor/vendedor responde por todos os riscos e débitos que gravem o bem até o momento da entrega, incluindo a evicção e impugnações/exigências em registro público, ficando os posteriores a cargo do comprador.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">2 - Proposta de compra</h3>
                        <p>
                          Após ativação do anúncio, uma proposta abaixo do valor da avaliação poderá virar compra se não superada em um prazo máximo de 30 dias; se igual ou superior ao valor da avaliação, efetivará a compra imediata. A proposta será feita exclusivamente na plataforma web Comprei (comprei.pgfn.gov.br). Verifique sempre se está no ambiente digital governamental. Não terá validade propostas oferecidas fora do Comprei, ainda que em plataformas de corretores ou leiloerios credenciados no programa, podendo neste último caso tais meios serem utilizados exclusivamente para fins publicitários.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">3 - Pagamento</h3>
                        <p>
                          O pagamento no Comprei deverá será realizado no prazo máximo de 2 (dois) dias úteis após a disponibilização da guia de recolhimento (o Comprei não gera boleto bancário), que poderá ser DARF (Documento de Arrecadação de Receitas Federais) emitido na plataforma ou DJE (Guia Judicial) emitida pelo seu vendedor, a depender do caso. O Comprei não envia links de pagamento. O comprador pagará ao intermediário (leiloeiro ou corretor) deste anúncio, a título de comissão, o percentual fixado em decisão judicial ou administrativa, que será informado por ocasião da formalização da proposta (no geral, o valor será de 5% sobre o valor da compra). O valor será pago via transferência bancária, não tendo o Comprei ingerencia sobre este aspecto do negócio.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">4 - Venda Parcelada</h3>
                        <p>
                          Antes de concluir sua proposta, simule as condições de parcelamento, que podem variar em função das circunstâncias do negócio. Você pode também consultar o vendedor anunciante. Sendo a credora a União, o parcelamento segue o disposto na Portaria PGFN nº 3.050, de 2022. Neste caso, o valor de cada parcela será acrescido de juros equivalentes à taxa SELIC, calculada mensalmente a partir da data de alienação até o mês anterior ao pagamento e de 1% (um porcento) relativamente ao mês em que o pagamento estiver sendo efetuado. Em caso de venda judicial, deverá ser registrada hipoteca em favor do credor, a qual será cancelada mediante apresentação de termo de quitação de parcelamento, quando da quitação do acordo. No caso de atraso no pagamento de qualquer das prestações, o saldo devedor remanescente vencerá antecipadamente, sendo acrescido em 50% (cinquenta por cento) de seu valor a título de multa. O inadimplemento autoriza a promoção, em face do comprador, da execução do valor devido e multa, nos termos do art. 98, da Lei nº 8.212, de 1991.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">5 - Documento de negócio</h3>
                        <p>
                          Para venda judicial, a compra é feita por meio de Auto de Alienação. Após o pagamento, o documento é emitido pelo Comprei e disponibilizado para assinatura pelo comprador e vendedor. Após, um representante do credor (no caso da União, um Procurador da Fazenda Nacional) assinará o documento e o apresentará em Juízo para homologação. Para venda extrajudicial, o credor é interveniente/anuente em Contrato de compra e venda, emitido pelo Comprei e disponibilizado para assinatura dos envolvidos no negócio. Neste caso, o pagamento ocorre após assinatura do contrato.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">6 - Entrega do bem (imissão na posse) e registro da propriedade</h3>
                        <p>
                          Na venda judicial, a entrega ocorrerá após a assinatura, pelo Juiz, da Carta de Alienação. Na extrajudicial, em até 15 dias após o pagamento. O intermediário auxiliará o comprador até a conclusão do processo de venda, em especial no registro de propriedade e na efetiva entrega do bem. O comprador arcará com despesas e custos relativos à desmontagem, remoção, transporte e transferência patrimonial dos bens adquiridos. No prazo de 30 dias após a imissão na posse ou recebimento do bem, o comprador deve registrar sua propriedade (e, se for o caso, a hipoteca), sob pena de invalidação do negócio. O ato deve ser feito rapidamente, para evitar problemas futuros envolvendo a manutenção do bem em nome de terceiros.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">7 - Vedações ao negócio</h3>
                        <p>
                          O usuário está ciente, em conformidade com o termo de aceite do usuário, das limitações para celebração de negócio previstas no art. 890, da Lei nº 13.105, de 2015 (Código de processo civil).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coluna 2: Informações da Negociação e Formulário */}
              <div>
                {/* Card da Negociação */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações da Oferta</h2>
                  <div className="space-y-4">
                    {property.deadline && (
                      <div>
                        <p className="text-gray-600 mb-1">Oferta válida até:</p>
                        <p className="font-semibold text-gray-900">{formatDate(new Date(property.deadline))}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600 mb-1">1º Período:</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(property.market_price)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">2º Período:</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(property.minimum_price)}</p>
                    </div>
                    
                    {property.payment_type === 'installments' && (
                      <div>
                        <p className="text-gray-600 mb-1">Condições de Pagamento:</p>
                        <p className="font-semibold text-gray-900">
                          Entrada mínima: {formatCurrency(property.min_down_payment)}<br />
                          Até {property.max_installments}x
                        </p>
                      </div>
                    )}

                    {/* Botão de Compra */}
                    <div className="mt-6">
                      <button onClick={() => {
                        document.getElementById('modalInstrucoes')?.classList.remove('hidden');
                        document.body.style.overflow = 'hidden';
                      }}
                        className="w-full bg-orange-600 text-white px-4 py-3 rounded-md hover:bg-orange-700 flex items-center justify-center font-semibold">
                        <i className="fas fa-handshake mr-2"></i>
                        Iniciar Negociação
                      </button>
                    </div>
                  </div>
                </div>

                {/* Formulário de Contato */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Dúvidas? Fale Conosco</h2>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const nome = (document.getElementById('nome') as HTMLInputElement).value;
                    const mensagem = (document.getElementById('mensagem') as HTMLTextAreaElement).value;
                    
                    // Aqui você deve configurar o número do WhatsApp em uma variável de ambiente
                    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '19999052345';
                    
                    const text = `Olá! Me chamo ${nome} e tenho interesse no imóvel ${property.internal_code || ''} (${property.property_type?.name} em ${property.address?.split(',')[0]}).\n\nInformações do imóvel:\n- Valor: ${formatCurrency(property.market_price)}\n- Localização: ${property.address}${mensagem ? '\n\nMensagem adicional:\n' + mensagem : ''}`;
                    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
                    window.open(whatsappUrl, '_blank');
                  }} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nome">
                        Nome Completo
                      </label>
                      <input type="text" id="nome" name="nome" required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="mensagem">
                        Mensagem (opcional)
                      </label>
                      <textarea id="mensagem" name="mensagem" rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Digite sua mensagem aqui..."></textarea>
                    </div>
                    <button type="submit"
                      className="w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 flex items-center justify-center">
                      <i className="fab fa-whatsapp mr-2 text-xl"></i>
                      Enviar Mensagem no WhatsApp
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Imagem Ampliada */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={property.media?.[currentImageIndex]?.url || '/images/property-placeholder.jpg'}
              alt={property.title}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Botão fechar */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              <i className="fas fa-times"></i>
            </button>
            
            {/* Navegação no modal */}
            {property.media && property.media.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : property.media!.length - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70"
                >
                  <i className="fas fa-chevron-left text-xl"></i>
                </button>
                <button
                  onClick={() => setCurrentImageIndex(prev => prev < property.media!.length - 1 ? prev + 1 : 0)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70"
                >
                  <i className="fas fa-chevron-right text-xl"></i>
                </button>
                
                {/* Contador no modal */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
                  {currentImageIndex + 1} / {property.media.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal de Instruções */}
      <div id="modalInstrucoes" className="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center">
        <div className="bg-white rounded-lg max-w-2xl w-full mx-4 overflow-hidden">
          {/* Cabeçalho do Modal */}
          <div className="bg-orange-600 p-4 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              Atenção - Instruções Importantes
            </h3>
            <button onClick={() => {
              document.getElementById('modalInstrucoes')?.classList.add('hidden');
              document.body.style.overflow = '';
            }} className="text-white hover:text-gray-200">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          {/* Conteúdo do Modal */}
          <div className="p-6">
            <div className="bg-orange-50 border-l-4 border-orange-600 p-4 mb-6">
              <p className="text-orange-800 font-semibold">
                Após enviar sua oferta de negociação, não será possível cancelá-la. Certifique-se de que está preparado para prosseguir.
              </p>
            </div>

            <h4 className="text-lg font-semibold text-gray-800 mb-4">Como negociar seu imóvel:</h4>

            <div className="space-y-4">
              {[
                {
                  title: 'Acesso via GOV.BR',
                  desc: 'Acesse o portal através do seu login GOV.BR. Caso não tenha, será necessário criar uma conta no portal do governo.'
                },
                {
                  title: 'Acesso Comprador',
                  desc: 'Na plataforma Comprei, selecione a opção "Acesso Comprador" para acessar a área de propostas.'
                },
                {
                  title: 'Validação de Documentos',
                  desc: 'Confira se seus documentos no GOV.BR estão atualizados. O sistema utilizará as informações já validadas pelo governo.'
                },
                {
                  title: 'Negociação',
                  desc: 'Negocie o preço: Prepare-se para discutir o valor do imóvel e as condições de pagamento, incluindo a forma de financiamento.'
                },
                {
                  title: 'Análise do Contrato',
                  desc: 'Leia atentamente todas as cláusulas do contrato, se necessário, consulte um advogado.'
                },
                {
                  title: 'Acompanhamento',
                  desc: 'Após enviar sua proposta, acompanhe o status através do painel do comprador na plataforma Comprei.'
                }
              ].map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                    {index + 1}
                  </div>
                  <div className="ml-4">
                    <h5 className="font-semibold text-gray-800">{step.title}</h5>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button onClick={() => {
                document.getElementById('modalInstrucoes')?.classList.add('hidden');
                document.body.style.overflow = '';
              }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Cancelar
              </button>
              <button onClick={() => window.location.href = 'https://comprei.pgfn.gov.br'}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                Prosseguir para Comprei
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
