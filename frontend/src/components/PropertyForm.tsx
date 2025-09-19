import React, { useEffect, useState } from 'react';
import { getPropertyTypes, getPropertySubtypes } from '@/services/properties';
import { PropertyType, PropertySubtype } from '@/types/Property';
import { fetchCepData } from '@/services/cep';
import MaskedInput from './MaskedInput';

export default function PropertyForm() {
  console.log('PropertyForm component rendered'); // Log para verificar a renderização do componente
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [propertySubtypes, setPropertySubtypes] = useState<PropertySubtype[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [cepLoading, setCepLoading] = useState(false);
  const [showGravamesDetails, setShowGravamesDetails] = useState(false);

  useEffect(() => {
  async function fetchTypes() {
  const types = await getPropertyTypes();
  setPropertyTypes(types);
  }
  fetchTypes();
  }, []);

  useEffect(() => {
  async function fetchSubtypes() {
  if (selectedType) {
  const subtypes = await getPropertySubtypes(Number(selectedType));
  setPropertySubtypes(subtypes);
  } else {
  setPropertySubtypes([]);
  }
  }
  fetchSubtypes();
  }, [selectedType]);

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Cadastro de Imóvel</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log('Form submission started'); // Log inicial para verificar o acionamento do evento
          const formData = new FormData(e.currentTarget);
          const data: any = {};
          formData.forEach((value, key) => {
            data[key] = value;
          });
          const titleInput = document.getElementById('title') as HTMLInputElement | null;
          console.log('Valor do campo title:', titleInput?.value); // Log direto do campo title corrigido
          console.log('Valor do campo title (FormData):', data.title); // Log específico para o campo title
          // Montar endereço completo
          const addressParts = [];
          if (data.street) addressParts.push(data.street);
          if (data.number) addressParts.push(data.number);
          if (data.complement) addressParts.push(data.complement);
          if (data.neighborhood) addressParts.push(data.neighborhood);
          if (data.city) addressParts.push(data.city);
          if (data.state) addressParts.push(data.state);
          if (data.cep) addressParts.push(`CEP: ${data.cep}`);
          
          data.address = addressParts.join(', ');
          
          // Converter campos numéricos
          ['property_type_id', 'property_subtype_id', 'built_area', 'land_area', 'bedrooms', 'bathrooms', 'garage_spots', 'construction_year', 'market_price', 'minimum_price', 'min_down_payment', 'max_installments'].forEach(field => {
            if (data[field] !== undefined && data[field] !== '') {
              data[field] = Number(data[field]);
            }
          });
          // Log para depuração
          console.log('Dados enviados:', data);
          // Enviar para backend usando o serviço correto
          try {
            // Importação dinâmica para evitar problemas de import recursivo
            const { createProperty } = await import('@/services/properties');
            await createProperty(data);
            alert('Imóvel cadastrado com sucesso!');
          } catch (err) {
            alert('Erro ao cadastrar imóvel!');
          }
        }}
      >
        {/* Informações Básicas */}
        <fieldset className="mb-6 border border-gray-200 rounded-md p-4">
          <legend className="font-semibold px-2">Informações Básicas</legend>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="internal_code" className="block text-sm font-medium text-gray-700 mb-1">
                  Código Interno
                </label>
                <input
                  type="text"
                  id="internal_code"
                  name="internal_code"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="rip_id" className="block text-sm font-medium text-gray-700 mb-1">
                  RIP (Registro Imobiliário Patrimonial)
                </label>
                <input
                  type="text"
                  id="rip_id"
                  name="rip_id"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </fieldset>

        {/* Localização */}
        <fieldset className="mb-6 border border-gray-200 rounded-md p-4">
          <legend className="font-semibold px-2">Localização</legend>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">
                  CEP *
                </label>
                <MaskedInput
                  mask="99999-999"
                  id="cep"
                  name="cep"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  onChange={async (e) => {
                    const cep = e.target.value.replace(/\D/g, '');
                    if (cep.length === 8) {
                      setCepLoading(true);
                      const cepData = await fetchCepData(cep);
                      if (cepData) {
                        const streetInput = document.getElementById('street') as HTMLInputElement;
                        const neighborhoodInput = document.getElementById('neighborhood') as HTMLInputElement;
                        const cityInput = document.getElementById('city') as HTMLInputElement;
                        const stateInput = document.getElementById('state') as HTMLInputElement;
                        
                        if (streetInput) streetInput.value = cepData.logradouro;
                        if (neighborhoodInput) neighborhoodInput.value = cepData.bairro;
                        if (cityInput) cityInput.value = cepData.localidade;
                        if (stateInput) stateInput.value = cepData.uf;
                      }
                      setCepLoading(false);
                    }
                  }}
                />
                {cepLoading && <p className="text-sm text-blue-600 mt-1">Buscando CEP...</p>}
              </div>
              
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                  Rua/Logradouro *
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                  Número
                </label>
                <input
                  type="text"
                  id="number"
                  name="number"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="complement" className="block text-sm font-medium text-gray-700 mb-1">
                  Complemento
                </label>
                <input
                  type="text"
                  id="complement"
                  name="complement"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                  Bairro *
                </label>
                <input
                  type="text"
                  id="neighborhood"
                  name="neighborhood"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="reference_point" className="block text-sm font-medium text-gray-700 mb-1">
                Ponto de Referência
              </label>
              <input
                type="text"
                id="reference_point"
                name="reference_point"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="google_maps_link" className="block text-sm font-medium text-gray-700 mb-1">
                Link do Google Maps
              </label>
              <input
                type="url"
                id="google_maps_link"
                name="google_maps_link"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </fieldset>

        {/* Características */}
        <fieldset className="mb-6 border border-gray-200 rounded-md p-4">
          <legend className="font-semibold px-2">Características</legend>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo do Imóvel
                </label>
                <select
                  id="property_type"
                  name="property_type_id"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  defaultValue=""
                  onChange={e => setSelectedType(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {propertyTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="property_subtype" className="block text-sm font-medium text-gray-700 mb-1">
                  Subtipo do Imóvel
                </label>
                <select
                  id="property_subtype"
                  name="property_subtype_id"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  defaultValue=""
                >
                  <option value="">Selecione...</option>
                  {propertySubtypes.map(subtype => (
                    <option key={subtype.id} value={subtype.id}>{subtype.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="built_area" className="block text-sm font-medium text-gray-700 mb-1">
                  Área Construída (m²) (0-9,999,999.99)
                </label>
                <input
                  type="number"
                  id="built_area"
                  name="built_area"
                  step="0.01"
                  min="0"
                  max="9999999.99"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="land_area" className="block text-sm font-medium text-gray-700 mb-1">
                  Área do Terreno (m²) (0-9,999,999.99)
                </label>
                <input
                  type="number"
                  id="land_area"
                  name="land_area"
                  step="0.01"
                  min="0"
                  max="9999999.99"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                  Quartos (0-100)
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  min="0"
                  max="100"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                  Banheiros (0-50)
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  min="0"
                  max="50"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="garage_spots" className="block text-sm font-medium text-gray-700 mb-1">
                  Vagas de Garagem
                </label>
                <input
                  type="number"
                  id="garage_spots"
                  name="garage_spots"
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="construction_year" className="block text-sm font-medium text-gray-700 mb-1">
                  Ano de Construção
                </label>
                <input
                  type="number"
                  id="construction_year"
                  name="construction_year"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </fieldset>

        {/* Descrição */}
        <fieldset className="mb-6 border border-gray-200 rounded-md p-4">
          <legend className="font-semibold px-2">Descrição</legend>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição Pública
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
            </div>

            <div>
              <label htmlFor="internal_notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notas Internas
              </label>
              <textarea
                id="internal_notes"
                name="internal_notes"
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>
        </fieldset>

        {/* Informações Jurídicas */}
        <fieldset className="mb-6 border border-gray-200 rounded-md p-4">
          <legend className="font-semibold px-2">Informações Jurídicas</legend>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="matricula" className="block text-sm font-medium text-gray-700 mb-1">
                  Matrícula do Bem
                </label>
                <input
                  type="text"
                  id="matricula"
                  name="matricula"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="processo" className="block text-sm font-medium text-gray-700 mb-1">
                  Processo
                </label>
                <input
                  type="text"
                  id="processo"
                  name="processo"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="juizo" className="block text-sm font-medium text-gray-700 mb-1">
                  Juízo
                </label>
                <input
                  type="text"
                  id="juizo"
                  name="juizo"
                  placeholder="ex: 08ª Vara de Execuções Fiscais Federal"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="cartorio" className="block text-sm font-medium text-gray-700 mb-1">
                  Cartório
                </label>
                <input
                  type="text"
                  id="cartorio"
                  name="cartorio"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gravames
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="has_gravames"
                    value="sim"
                    className="mr-2"
                    onChange={() => setShowGravamesDetails(true)}
                  />
                  Sim
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="has_gravames"
                    value="nao"
                    className="mr-2"
                    onChange={() => setShowGravamesDetails(false)}
                  />
                  Não
                </label>
              </div>
              
              {showGravamesDetails && (
                <div className="mt-4">
                  <label htmlFor="gravames_details" className="block text-sm font-medium text-gray-700 mb-1">
                    Detalhes dos Gravames
                  </label>
                  <textarea
                    id="gravames_details"
                    name="gravames_details"
                    rows={4}
                    placeholder="ex: Penhora (AV.18, AV.21, AV.33, AV.34) Arrolamento (R.20) Indisponibilidade (AV.22, AV.23, AV.24, AV.25, AV.26, AV.27, AV.28, AV.29, AV.30, AV.31, AV.32)"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
              )}
            </div>
          </div>
        </fieldset>

        {/* Valores */}
        <fieldset className="mb-6 border border-gray-200 rounded-md p-4">
          <legend className="font-semibold px-2">Valores e Condições</legend>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="market_price" className="block text-sm font-medium text-gray-700 mb-1">
                  Valor de Mercado
                </label>
                <input
                  type="number"
                  id="market_price"
                  name="market_price"
                  min="0"
                  step="0.01"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="minimum_price" className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Mínimo
                </label>
                <input
                  type="number"
                  id="minimum_price"
                  name="minimum_price"
                  min="0"
                  step="0.01"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                  Data Limite
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="payment_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Forma de Pagamento
                </label>
                <select
                  id="payment_type"
                  name="payment_type"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="cash">À Vista</option>
                  <option value="installments">Parcelado</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="min_down_payment" className="block text-sm font-medium text-gray-700 mb-1">
                  Entrada Mínima (%)
                </label>
                <input
                  type="number"
                  id="min_down_payment"
                  name="min_down_payment"
                  min="0"
                  max="100"
                  step="0.01"
                  defaultValue="25.00"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="max_installments" className="block text-sm font-medium text-gray-700 mb-1">
                  Máximo de Parcelas
                </label>
                <input
                  type="number"
                  id="max_installments"
                  name="max_installments"
                  min="1"
                  max="240"
                  defaultValue="59"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </fieldset>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Salvar Imóvel
          </button>
        </div>
      </form>
    </div>
  );
}
