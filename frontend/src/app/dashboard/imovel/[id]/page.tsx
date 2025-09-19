'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Property } from '@/types/Property';
import { getProperty } from '@/services/properties';
import { sanitizeInput } from '@/lib/sanitize';
import EditableField from '@/components/EditableField';
import ImageUpload from '@/components/ImageUpload';
import { uploadMultipleImages } from '@/lib/supabaseStorage';
import { savePropertyMedia, deletePropertyMedia } from '@/services/media';

export default function PropertyDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editingImages, setEditingImages] = useState(false);
  const [newImages, setNewImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (params.id) {
          const data = await getProperty(Number(params.id));
          setProperty(data);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Imóvel não encontrado</h1>
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

  const handleEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleSave = async (field: string) => {
    try {
      const sanitizedValue = sanitizeInput(editValue);
      console.log(`Updating ${field} to:`, sanitizedValue);
      
      if (property) {
        setProperty({
          ...property,
          [field]: field.includes('price') ? parseFloat(sanitizedValue) : sanitizedValue
        });
      }
      
      setEditingField(null);
      setEditValue('');
    } catch (error) {
      console.error('Error updating field:', error);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleFieldSave = (field: string, value: string) => {
    if (property) {
      const numericFields = ['bedrooms', 'bathrooms', 'garage_spots', 'built_area', 'market_price', 'minimum_price'];
      setProperty({
        ...property,
        [field]: numericFields.includes(field) ? parseFloat(value) || 0 : value
      });
    }
  };

  const handleSaveImages = async () => {
    if (!property || newImageFiles.length === 0) return;
    
    try {
      const uploadedUrls = await uploadMultipleImages(newImageFiles, property.id);
      if (uploadedUrls.length > 0) {
        await savePropertyMedia(property.id, uploadedUrls);
        // Atualizar propriedade com novas imagens
        const updatedProperty = await getProperty(property.id);
        setProperty(updatedProperty);
      }
      setEditingImages(false);
      setNewImages([]);
      setNewImageFiles([]);
    } catch (error) {
      console.error('Erro ao salvar imagens:', error);
    }
  };

  const handleDeleteImage = async (mediaId: number) => {
    if (!property || !property.media) return;
    
    // Verificar se é a única imagem
    if (property.media.length <= 1) {
      alert('Deve existir pelo menos uma imagem principal.');
      return;
    }
    
    try {
      await deletePropertyMedia(mediaId);
      // Atualizar propriedade
      const updatedProperty = await getProperty(property.id);
      setProperty(updatedProperty);
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header com navegação */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              <i className="fas fa-arrow-left"></i>
              <span className="ml-2">Voltar</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Detalhes do Imóvel</h1>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Seção de imagens */}
          <div className="relative h-96">
            <img
              src={property.media?.[currentImageIndex]?.url || '/images/property-placeholder.jpg'}
              alt={property.title}
              className="w-full h-full object-cover"
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
            
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => setEditingImages(true)}
                className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
              >
                <i className="fas fa-edit text-blue-600"></i>
              </button>
            </div>
          </div>

          {/* Informações do imóvel */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Coluna da esquerda */}
              <div>
                <div className="mb-4">
                  <EditableField
                    field="title"
                    value={property.title}
                    label="Título"
                    onSave={handleFieldSave}
                  />
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-600">
                      {property.property_type?.name} - ID: {property.id}
                    </span>
                    <span className={`text-sm font-semibold px-3 py-1 rounded ${
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
                </div>

                <div className="space-y-4">
                  <EditableField
                    field="address"
                    value={property.address}
                    label="Endereço"
                    onSave={handleFieldSave}
                  />

                  <EditableField
                    field="market_price"
                    value={property.market_price}
                    label="Preço"
                    type="currency"
                    onSave={handleFieldSave}
                  />

                  {property.property_features && property.property_features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {property.property_features.map((feature, index) => (
                        <span key={index} className="text-xs text-gray-600 bg-gray-200 rounded-full px-3 py-1">
                          {feature.feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Coluna da direita */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Características</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <EditableField
                      field="bedrooms"
                      value={property.bedrooms || 0}
                      label="Quartos"
                      type="number"
                      onSave={handleFieldSave}
                    />
                    <EditableField
                      field="bathrooms"
                      value={property.bathrooms || 0}
                      label="Banheiros"
                      type="number"
                      onSave={handleFieldSave}
                    />
                    <EditableField
                      field="garage_spots"
                      value={property.garage_spots || 0}
                      label="Vagas"
                      type="number"
                      onSave={handleFieldSave}
                    />
                    <EditableField
                      field="built_area"
                      value={property.built_area || 0}
                      label="Área (m²)"
                      type="number"
                      onSave={handleFieldSave}
                    />
                  </div>
                </div>

                <EditableField
                  field="description"
                  value={property.description}
                  label="Descrição"
                  onSave={handleFieldSave}
                />

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Valores</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <EditableField
                      field="market_price"
                      value={property.market_price}
                      label="Valor de Mercado"
                      type="currency"
                      onSave={handleFieldSave}
                    />
                    <EditableField
                      field="minimum_price"
                      value={property.minimum_price}
                      label="Valor Mínimo"
                      type="currency"
                      onSave={handleFieldSave}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de Edição de Imagens */}
      {editingImages && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Editar Imagens</h3>
                <button
                  onClick={() => setEditingImages(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Imagens Atuais:</h4>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {property.media?.map((media, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={media.url}
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      {media.is_featured && (
                        <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                          Principal
                        </span>
                      )}
                      {property.media && property.media.length > 1 && (
                        <button
                          onClick={() => handleDeleteImage(media.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <i className="fas fa-times text-xs"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Adicionar Novas Imagens:</h4>
                <ImageUpload
                  images={newImages}
                  onImagesChange={setNewImages}
                  files={newImageFiles}
                  onFilesChange={setNewImageFiles}
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setEditingImages(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveImages}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={newImageFiles.length === 0}
                >
                  Salvar Imagens
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
