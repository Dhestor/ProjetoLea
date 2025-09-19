import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Property } from './property.entity';

@Entity('property_media')
export class PropertyMedia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: 'image' | 'video' | 'document';

  @Column()
  url: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  is_featured: boolean;

  @ManyToOne(() => Property, property => property.media)
  property: Property;
}
