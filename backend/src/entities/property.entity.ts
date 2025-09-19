import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { PropertyType } from './property-type.entity';
import { PropertySubtype } from './property-subtype.entity';
import { PropertyFeature } from './property-feature.entity';
import { PropertyMedia } from './property-media.entity';
import { Lead } from './lead.entity';
import { User } from './user.entity';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  internal_code?: string;

  @Column({ nullable: true })
  rip_id?: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  reference_point?: string;

  @Column({ nullable: true })
  google_maps_link?: string;

  @Column({ nullable: true })
  cep?: string;

  @Column({ nullable: true })
  street?: string;

  @Column({ nullable: true })
  number?: string;

  @Column({ nullable: true })
  complement?: string;

  @Column({ nullable: true })
  neighborhood?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  matricula?: string;

  @Column({ nullable: true })
  processo?: string;

  @Column({ nullable: true })
  juizo?: string;

  @Column({ nullable: true })
  cartorio?: string;

  @Column({ nullable: true })
  has_gravames?: string;

  @Column({ type: 'text', nullable: true })
  gravames_details?: string;

  @Column({ name: 'property_type_id' })
  property_type_id: number;

  @Column({ name: 'property_subtype_id' })
  property_subtype_id: number;

  @ManyToOne(() => PropertyType)
  @JoinColumn({ name: 'property_type_id' })
  propertyType: PropertyType;

  @ManyToOne(() => PropertySubtype)
  @JoinColumn({ name: 'property_subtype_id' })
  propertySubtype: PropertySubtype;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  built_area?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  land_area?: number;

  @Column({ nullable: true })
  bedrooms?: number;

  @Column({ nullable: true })
  bathrooms?: number;

  @Column({ nullable: true })
  garage_spots?: number;

  @Column({ nullable: true })
  construction_year?: number;

  @Column('text')
  description: string;

  @Column({ type: 'text', nullable: true })
  internal_notes?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  market_price: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  minimum_price: number;

  @Column({ type: 'timestamp' })
  deadline: Date;

  @Column()
  payment_type: 'cash' | 'installments';

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, default: 25.00 })
  min_down_payment?: number;

  @Column({ nullable: true, default: 59 })
  max_installments?: number;

  @Column({ default: 'active' })
  status: 'active' | 'pending' | 'sold' | 'expired';

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => PropertyFeature, feature => feature.property)
  features: PropertyFeature[];

  @OneToMany(() => PropertyMedia, media => media.property)
  media: PropertyMedia[];

  @OneToMany(() => Lead, lead => lead.property)
  leads: Lead[];
}
