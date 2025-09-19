import { Property } from '@/types/Property';
import PropertyCard from '@/components/PropertyCard';
import Banner from '@/components/Banner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

async function getProperties() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030';
    const res = await fetch(`${baseUrl}/api/properties`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch properties');
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

export default async function Home() {
  const properties = await getProperties();
  
  return (
    <div className="min-h-screen">
      <Header />
      <Banner />
      
      <section className="bg-white px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {properties && properties.length > 0 ? (
              properties.map((property: Property) => (
                <PropertyCard key={property.id} property={property} isPublic={true} />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-500 text-lg mb-4">Nenhum imóvel encontrado.</p>
                <p className="text-gray-400 text-sm">Novos imóveis serão adicionados em breve.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Seção Informativa */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Imóveis com Desconto - União
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
            <div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Participar das ofertas de imóveis com desconto da União é uma excelente oportunidade para adquirir um imóvel com valores até 50% abaixo do mercado.
              </p>
            </div>
            <div>
              <p className="text-gray-600 leading-relaxed">
                A União Imóveis oferece diversas oportunidades em todo o Brasil, incluindo casas, apartamentos, terrenos e imóveis comerciais. Nossa equipe está pronta para auxiliar você em todas as etapas do processo.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
