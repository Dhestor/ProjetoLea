import axios from 'axios';
import { CreatePropertyDTO, Property, PropertyType, PropertySubtype } from '@/types/Property';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`
});

export async function getPropertyTypes(): Promise<PropertyType[]> {
  const response = await api.get('/property-types');
  return response.data;
}

export async function getPropertySubtypes(typeId: number): Promise<PropertySubtype[]> {
  const response = await api.get(`/property-types/${typeId}/subtypes`);
  return response.data;
}

export async function createProperty(data: CreatePropertyDTO): Promise<Property> {
  console.log('URL da API:', api.defaults.baseURL);
  console.log('Dados enviados:', data);

  const response = await api.post('/properties', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
}

export async function getAllProperties(page: number = 1, limit: number = 10): Promise<{ data: Property[]; count: number }> {
  console.log('Fetching properties from:', `${api.defaults.baseURL}/properties`);
  try {
    const response = await api.get('/properties', {
      params: { page, limit }
    });
    console.log('Properties response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
}

export async function getProperty(id: number): Promise<Property> {
  const response = await api.get(`/properties/${id}`);
  return response.data;
}

export async function updateProperty(id: number, data: Partial<CreatePropertyDTO>): Promise<Property> {
  const response = await api.put(`/properties/${id}`, data);
  return response.data;
}

export async function deleteProperty(id: number): Promise<void> {
  await api.delete(`/properties/${id}`);
}
