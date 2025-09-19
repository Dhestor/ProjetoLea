import { Property } from '@/types/Property';
import Link from 'next/link';

interface PropertyCardProps {
  property: Property;
  isPublic?: boolean;
}

export default function PropertyCard({ property, isPublic = false }: PropertyCardProps) {
  const featuredImage = property.media?.find(m => m.is_featured)?.url || property.media?.[0]?.url || '/images/property-placeholder.jpg';
  
  // console.log('Property media:', property.media); // Debug
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(property.market_price);
  
  // Create a location string from property type and address
  const location = `${property.property_type?.name || ''} em ${property.address?.split(',')[0] || ''}`;
  
  // Get city/state from the last part of the address
  const cityState = property.address?.split(',').slice(-1)[0]?.trim() || '';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <Link href={isPublic ? `/imovel/${property.id}` : `/dashboard/imovel/${property.id}`}>
        <div className="relative">
          <img
            alt={property.title || 'Imóvel'}
            className="w-full h-48 sm:h-52 object-cover"
            src={featuredImage}
          />
          <div className="absolute top-2 left-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${
              property.status === 'active' ? 'bg-green-100 text-green-800' :
              property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              property.status === 'sold' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {property.status === 'active' ? 'Ativo' :
               property.status === 'pending' ? 'Pendente' :
               property.status === 'sold' ? 'Vendido' :
               property.status === 'expired' ? 'Expirado' : property.status}
            </span>
          </div>
          {!isPublic && (
            <div className="absolute top-2 right-2 bg-white bg-opacity-90 text-xs text-gray-600 px-2 py-1 rounded">
              ID: {property.id}
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {property.title}
          </h2>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {property.address}
          </p>
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <i className="fas fa-map-marker-alt mr-2 text-xs"></i>
            <span className="truncate">{cityState}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-orange-600 font-bold text-lg sm:text-xl">
              {formattedPrice}
            </div>
            {!isPublic && (
              <button className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors">
                <i className="fas fa-edit"></i>
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
