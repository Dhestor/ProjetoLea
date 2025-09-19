import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Property } from './property.entity';
import { PropertySubtype } from './property-subtype.entity';

@Entity('property_types')
export class PropertyType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @OneToMany(() => Property, property => property.propertyType)
  properties?: Property[];

  @OneToMany(() => PropertySubtype, subtype => subtype.propertyType)
  subtypes?: PropertySubtype[];
}
