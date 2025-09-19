import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`
});

export async function savePropertyMedia(propertyId: number, urls: string[]) {
  const response = await api.post(`/properties/${propertyId}/media`, { urls });
  return response.data;
}

export async function deletePropertyMedia(mediaId: number) {
  const response = await api.delete(`/properties/media/${mediaId}`);
  return response.data;
}