'use client';

import { useState, useEffect } from 'react';
import { FormSection, FormGroup, Input, Select, TextArea } from '@/components/dashboard/FormComponents';
import { useRouter } from 'next/navigation';
import { createProperty, getPropertyTypes, getPropertySubtypes } from '@/services/properties';
import type { PropertyType, PropertySubtype } from '@/types/Property';
import MaskedInput from '@/components/MaskedInput';
import { fetchCepData } from '@/services/cep';

export default function NovoImovel() {
  const router = useRouter();
  const [types, setTypes] = useState<PropertyType[]>([]);
  const [subtypes, setSubtypes] = useState<PropertySubtype[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [showGravamesDetails, setShowGravamesDetails] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    property_type_id: '',
    property_subtype_id: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    reference_point: '',
    matricula: '',
    processo: '',
    juizo: '',
    cartorio: '',
    has_gravames: '',
    gravames_details: '',
    bedrooms: '',
    bathrooms: '',
    built_area: '',
    market_price: '',
    minimum_price: '',
    description: '',
    deadline: new Date().toISOString().split('T')[0],
    payment_type: 'cash' as 'cash' | 'installments',
    max_installments: '',
    min_down_payment: ''
  });

  useEffect(() => {
    getPropertyTypes().then(setTypes).catch(console.error);
  }, []);

  useEffect(() => {
    if (formData.property_type_id) {
      getPropertySubtypes(Number(formData.property_type_id))
        .then(setSubtypes)
        .catch(console.error);
    } else {
      setSubtypes([]);
    }
  }, [formData.property_type_id]);

  const handleCepChange = async (cep: string) => {
    setFormData(prev => ({ ...prev, cep }));
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setCepLoading(true);
      const cepData = await fetchCepData(cleanCep);
      if (cepData) {
        setFormData(prev => ({
          ...prev,
          street: cepData.logradouro,
          neighborhood: cepData.bairro,
          city: cepData.localidade,
          state: cepData.uf
        }));
      }
      setCepLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const addressParts = [];
      if (formData.street) addressParts.push(formData.street);
      if (formData.number) addressParts.push(formData.number);
      if (formData.complement) addressParts.push(formData.complement);
      if (formData.neighborhood) addressParts.push(formData.neighborhood);
      if (formData.city) addressParts.push(formData.city);
      if (formData.state) addressParts.push(formData.state);
      if (formData.cep) addressParts.push(`CEP: ${formData.cep}`);
      
      const address = addressParts.join(', ');
      
      await createProperty({
        ...formData,
        address,
        property_type_id: Number(formData.property_type_id),
        property_subtype_id: Number(formData.property_subtype_id),
        bedrooms: Number(formData.bedrooms) || undefined,
        bathrooms: Number(formData.bathrooms) || undefined,
        built_area: Number(formData.built_area) || undefined,
        market_price: Number(formData.market_price),
        minimum_price: Number(formData.minimum_price),
        max_installments: Number(formData.max_installments) || undefined,
        min_down_payment: Number(formData.min_down_payment) || undefined
      });
      
      router.push('/dashboard/imoveis');
    } catch (error) {
      console.error('Erro ao criar imóvel:', error);
      alert('Erro ao criar imóvel');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Cadastro de Imóvel</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Identificação */}
        <FormSection title="Identificação">
          <FormGroup label="Título do imóvel" required>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </FormGroup>
          <FormGroup label="Tipo de imóvel" required>
            <Select
              options={types.map(type => ({ value: String(type.id), label: type.name }))}
              value={formData.property_type_id}
              onChange={(e) => setFormData(prev => ({ ...prev, property_type_id: e.target.value, property_subtype_id: '' }))}
              required
            />
          </FormGroup>
          <FormGroup label="Subtipo" required>
            <Select
              options={subtypes.map(subtype => ({ value: String(subtype.id), label: subtype.name }))}
              value={formData.property_subtype_id}
              onChange={(e) => setFormData(prev => ({ ...prev, property_subtype_id: e.target.value }))}
              required
            />
          </FormGroup>
        </FormSection>

        {/* Localização */}
        <FormSection title="Localização">
          <FormGroup label="CEP" required>
            <MaskedInput
              mask="99999-999"
              value={formData.cep}
              onChange={(e) => handleCepChange(e.target.value)}
              required
            />
            {cepLoading && <p className="text-sm text-blue-600 mt-1">Buscando CEP...</p>}
          </FormGroup>
          <FormGroup label="Rua/Logradouro" required>
            <Input
              type="text"
              value={formData.street}
              onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
              required
            />
          </FormGroup>
          <FormGroup label="Número">
            <Input
              type="text"
              value={formData.number}
              onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
            />
          </FormGroup>
          <FormGroup label="Bairro" required>
            <Input
              type="text"
              value={formData.neighborhood}
              onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
              required
            />
          </FormGroup>
          <FormGroup label="Cidade" required>
            <Input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              required
            />
          </FormGroup>
          <FormGroup label="Estado" required>
            <Input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
              required
            />
          </FormGroup>
        </FormSection>

        {/* Informações Jurídicas */}
        <FormSection title="Informações Jurídicas">
          <FormGroup label="Matrícula do Bem">
            <Input
              type="text"
              value={formData.matricula}
              onChange={(e) => setFormData(prev => ({ ...prev, matricula: e.target.value }))}
            />
          </FormGroup>
          <FormGroup label="Processo">
            <Input
              type="text"
              value={formData.processo}
              onChange={(e) => setFormData(prev => ({ ...prev, processo: e.target.value }))}
            />
          </FormGroup>
          <FormGroup label="Juízo">
            <Input
              type="text"
              value={formData.juizo}
              onChange={(e) => setFormData(prev => ({ ...prev, juizo: e.target.value }))}
            />
          </FormGroup>
          <FormGroup label="Cartório">
            <Input
              type="text"
              value={formData.cartorio}
              onChange={(e) => setFormData(prev => ({ ...prev, cartorio: e.target.value }))}
            />
          </FormGroup>
          <FormGroup label="Gravames">
            <div className="flex items-center space-x-4 mb-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="has_gravames"
                  value="sim"
                  checked={formData.has_gravames === 'sim'}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, has_gravames: e.target.value }));
                    setShowGravamesDetails(true);
                  }}
                  className="mr-2"
                />
                Sim
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="has_gravames"
                  value="nao"
                  checked={formData.has_gravames === 'nao'}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, has_gravames: e.target.value, gravames_details: '' }));
                    setShowGravamesDetails(false);
                  }}
                  className="mr-2"
                />
                Não
              </label>
            </div>
            {showGravamesDetails && formData.has_gravames === 'sim' && (
              <TextArea
                value={formData.gravames_details}
                onChange={(e) => setFormData(prev => ({ ...prev, gravames_details: e.target.value }))}
                rows={3}
                placeholder="ex: Penhora (AV.18, AV.21, AV.33, AV.34) Arrolamento (R.20) Indisponibilidade (AV.22, AV.23, AV.24, AV.25, AV.26, AV.27, AV.28, AV.29, AV.30, AV.31, AV.32)"
              />
            )}
          </FormGroup>
        </FormSection>

        {/* Características */}
        <FormSection title="Características">
          <FormGroup label="Quartos">
            <Input
              type="number"
              value={formData.bedrooms}
              onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
            />
          </FormGroup>
          <FormGroup label="Banheiros">
            <Input
              type="number"
              value={formData.bathrooms}
              onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
            />
          </FormGroup>
          <FormGroup label="Área construída (m²)">
            <Input
              type="number"
              value={formData.built_area}
              onChange={(e) => setFormData(prev => ({ ...prev, built_area: e.target.value }))}
            />
          </FormGroup>
        </FormSection>

        {/* Valores */}
        <FormSection title="Valores">
          <FormGroup label="Valor de mercado" required>
            <MaskedInput
              type="currency"
              value={formData.market_price}
              onChange={(e) => setFormData(prev => ({ ...prev, market_price: e.target.value }))}
              required
            />
          </FormGroup>
          <FormGroup label="Valor mínimo" required>
            <MaskedInput
              type="currency"
              value={formData.minimum_price}
              onChange={(e) => setFormData(prev => ({ ...prev, minimum_price: e.target.value }))}
              required
            />
          </FormGroup>
          <FormGroup label="Data limite" required>
            <Input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              required
            />
          </FormGroup>
          <FormGroup label="Forma de pagamento" required>
            <Select
              options={[
                { value: 'cash', label: 'À vista' },
                { value: 'installments', label: 'Parcelado' }
              ]}
              value={formData.payment_type}
              onChange={(e) => setFormData(prev => ({ ...prev, payment_type: e.target.value as 'cash' | 'installments' }))}
              required
            />
          </FormGroup>
          {formData.payment_type === 'installments' && (
            <FormGroup label="Número de parcelas">
              <Input
                type="number"
                value={formData.max_installments || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, max_installments: e.target.value }))}
                min="1"
                max="240"
                placeholder="Ex: 60"
              />
            </FormGroup>
          )}
        </FormSection>

        {/* Descrição */}
        <FormSection title="Descrição">
          <FormGroup label="Descrição detalhada">
            <TextArea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              required
            />
          </FormGroup>
        </FormSection>
      </div>

      <div className="flex justify-end gap-4 bg-white p-6 rounded-lg shadow">
        <button
          type="button"
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          onClick={() => router.push('/dashboard/imoveis')}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Imóvel'}
        </button>
      </div>
    </form>
  );
}
