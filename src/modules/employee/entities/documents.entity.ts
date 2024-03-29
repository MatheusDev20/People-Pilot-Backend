import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from './employee.entity';

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
}
