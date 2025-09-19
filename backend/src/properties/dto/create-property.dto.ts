import { IsString, IsNumber, IsOptional, IsEnum, IsISO8601, Min, Max, ValidateIf } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreatePropertyDto {
  @Transform(({ value }) => {
    console.log('Transforming features:', value);
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  internal_code?: string;

  @IsString()
  @IsOptional()
  rip_id?: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  reference_point?: string;

  @IsString()
  @IsOptional()
  google_maps_link?: string;

  @IsString()
  @IsOptional()
  cep?: string;

  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  number?: string;

  @IsString()
  @IsOptional()
  complement?: string;

  @IsString()
  @IsOptional()
  neighborhood?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  matricula?: string;

  @IsString()
  @IsOptional()
  processo?: string;

  @IsString()
  @IsOptional()
  juizo?: string;

  @IsString()
  @IsOptional()
  cartorio?: string;

  @IsString()
  @IsOptional()
  has_gravames?: string;

  @IsString()
  @IsOptional()
  gravames_details?: string;

  @IsNumber()
  @Type(() => Number)
  property_type_id: number;

  @IsNumber()
  @Type(() => Number)
  property_subtype_id: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(9999999.99)
  built_area?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(9999999.99)
  land_area?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  bedrooms?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(50)
  bathrooms?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  garage_spots?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1800)
  @Max(new Date().getFullYear())
  construction_year?: number;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  internal_notes?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(999999999.99)
  market_price: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(999999999.99)
  minimum_price: number;

  @IsISO8601()
  deadline: string;

  @IsEnum(['cash', 'installments'])
  payment_type: 'cash' | 'installments';

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  min_down_payment?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Max(240)
  max_installments?: number;

  @IsEnum(['active', 'pending', 'sold', 'expired'])
  @IsOptional()
  status?: 'active' | 'pending' | 'sold' | 'expired';

  @IsString()
  @IsOptional()
  user_id?: string;

  @IsOptional()
  @Transform(({ value }) => {
    console.log('Transforming features:', value);
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return Array.isArray(value) ? value : [];
  })
  features?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return Array.isArray(value) ? value : [];
  })
  media_urls?: string[];
}
