export interface Property {
  id: number;
  title: string;
  internal_code?: string;
  rip_id?: string;
  address: string;
  reference_point?: string;
  google_maps_link?: string;
  property_type_id: number;
  property_subtype_id: number;
  built_area?: number;
  land_area?: number;
  bedrooms?: number;
  bathrooms?: number;
  garage_spots?: number;
  construction_year?: number;
  description: string;
  internal_notes?: string;
  market_price: number;
  minimum_price: number;
  deadline: string;
  payment_type: 'cash' | 'installments';
  min_down_payment?: number;
  max_installments?: number;
  status: 'active' | 'pending' | 'sold' | 'expired';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
  whatsapp?: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyType {
  id: number;
  name: string;
  description?: string;
}

export interface PropertySubtype {
  id: number;
  name: string;
  description?: string;
  property_type_id: number;
}

export interface PropertyMedia {
  id: number;
  property_id: number;
  type: 'image' | 'video' | 'document';
  url: string;
  title?: string;
  description?: string;
  is_featured: boolean;
  created_at: string;
}
