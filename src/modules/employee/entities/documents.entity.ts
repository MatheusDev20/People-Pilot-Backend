import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employee } from './employee.entity';
import { isoToLocale } from 'src/helpers';
import { Transform } from 'class-transformer';

@Entity()
export class Documents {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  documentType: string;

  @Column('json')
  metadata: Record<string, any>;

  @Column()
  fileUrl: string;

  @ManyToOne(() => Employee, (employee) => employee.documents)
  employee: Employee;

  @Transform(({ value }) => isoToLocale(value, 'pt-BR'))
  @CreateDateColumn()
  uploaded_at: Date;

  @Transform(({ value }) => isoToLocale(value, 'pt-BR'))
  @UpdateDateColumn()
  updated_at: Date;
}
