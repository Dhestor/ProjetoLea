import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Property } from './property.entity';
import { User } from './user.entity';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column('text', { nullable: true })
  message: string;

  @Column({ default: 'new' })
  status: 'new' | 'contacted' | 'qualified' | 'disqualified';

  @ManyToOne(() => Property, property => property.leads)
  property: Property;

  @ManyToOne(() => User, { nullable: true })
  assigned_to: User;

  @CreateDateColumn()
  created_at: Date;
}
