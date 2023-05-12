import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Employee, (employee) => employee.roles)
  employees: Employee[];
}
