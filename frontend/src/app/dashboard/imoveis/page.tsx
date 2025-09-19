'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllProperties, deleteProperty } from '@/services/properties';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types/Property';

export default function GerenciarImoveis() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage] = useState(9);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; property: Property | null }>({ show: false, property: null });

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        const response = await getAllProperties(currentPage, itemsPerPage);
        setProperties(response.data);
        setTotalCount(response.count);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Erro ao carregar os imóveis. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [currentPage, itemsPerPage]);

  const handleDeleteProperty = async (property: Property) => {
    setDeleteModal({ show: true, property });
  };

  const confirmDelete = async () => {
    if (!deleteModal.property) return;
    
    try {
      await deleteProperty(deleteModal.property.id);
      setDeleteModal({ show: false, property: null });
      // Recarregar lista
      const response = await getAllProperties(currentPage, itemsPerPage);
      setProperties(response.data);
      setTotalCount(response.count);
    } catch (error) {
      console.error('Erro ao deletar imóvel:', error);
      alert('Erro ao deletar imóvel. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header com título e botões de ação */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Gerenciar Imóveis</h1>
            <div className="flex space-x-4">
              <Link
                href="/dashboard/imovel/novo"
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
              >
                <i className="fas fa-plus mr-2"></i>Novo Imóvel
              </Link>
              <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                <i className="fas fa-filter mr-2"></i>Filtrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de cards de imóveis */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="relative">
                  <PropertyCard property={property} />
                  <button
                    onClick={() => handleDeleteProperty(property)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"
                  >
                    <i className="fas fa-trash text-sm"></i>
                  </button>
                </div>
              ))}
            </div>

            {properties.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">Nenhum imóvel cadastrado</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Comece cadastrando seu primeiro imóvel clicando no botão "Novo Imóvel"
                </p>
              </div>
            )}

            {/* Paginação */}
            {totalCount > itemsPerPage && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                
                <span className="px-4 py-2 text-sm text-gray-700">
                  Página {currentPage} de {Math.ceil(totalCount / itemsPerPage)} ({totalCount} imóveis)
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage >= Math.ceil(totalCount / itemsPerPage)}
                  className="px-3 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Modal de Confirmação de Exclusão */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <i className="fas fa-exclamation-triangle text-red-500 text-2xl mr-3"></i>
              <h3 className="text-lg font-semibold text-gray-900">Confirmar Exclusão</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Você tem certeza que deseja deletar o imóvel <strong>"{deleteModal.property?.title}"</strong>?
              <br /><br />
              Esta ação não pode ser desfeita.
            </p>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteModal({ show: false, property: null })}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Deletar Imóvel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
