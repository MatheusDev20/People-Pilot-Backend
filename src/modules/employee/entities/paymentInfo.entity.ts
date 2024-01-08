import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class PaymentInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bankName: string;

  @Column()
  accountType: string;

  @Column()
  accountNumber: string;

  @Column()
  agencyNumber: string;

  @Column()
  pixKey: string;

  @OneToOne(() => Employee, (employee) => employee.paymentInfo)
  employee: Employee;
}
