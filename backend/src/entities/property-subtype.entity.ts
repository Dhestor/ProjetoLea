import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { PropertyType } from './property-type.entity';
import { Property } from './property.entity';

@Entity('property_subtypes')
export class PropertySubtype {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'property_type_id' })
  property_type_id: number;

  @ManyToOne(() => PropertyType)
  @JoinColumn({ name: 'property_type_id' })
  propertyType: PropertyType;

  @OneToMany(() => Property, property => property.propertySubtype)
  properties?: Property[];
}
