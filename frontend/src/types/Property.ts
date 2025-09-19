interface Property {
  id: number;
  title: string;
  internal_code?: string;
  rip_id?: string;
  address: string;
  reference_point?: string;
  google_maps_link?: string;
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  matricula?: string;
  processo?: string;
  juizo?: string;
  cartorio?: string;
  has_gravames?: string;
  gravames_details?: string;
  property_type: PropertyType;
  property_subtype: PropertySubtype;
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
  min_down_payment: number;
  max_installments: number;
  status: 'active' | 'pending' | 'sold' | 'expired';
  property_features: PropertyFeature[];
  property_media: PropertyMedia[];
  created_at: string;
  updated_at: string;
}

interface PropertyType {
  id: number;
  name: string;
}

interface PropertySubtype {
  id: number;
  name: string;
  property_type_id: number;
}

interface PropertyFeature {
  property_id: number;
  feature: string;
}

interface PropertyMedia {
  id: number;
  property_id: number;
  type: 'photo' | 'video' | 'virtual_tour';
  url: string;
  is_featured: boolean;
  order_index: number;
}

interface CreatePropertyDTO {
  title: string;
  internal_code?: string;
  rip_id?: string;
  address?: string;
  reference_point?: string;
  google_maps_link?: string;
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  matricula?: string;
  processo?: string;
  juizo?: string;
  cartorio?: string;
  has_gravames?: string;
  gravames_details?: string;
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
  status?: 'active' | 'pending' | 'sold' | 'expired';
  features?: string[];
  media_urls?: string[];
}

export type { Property, PropertyType, PropertySubtype, PropertyFeature, PropertyMedia, CreatePropertyDTO };
