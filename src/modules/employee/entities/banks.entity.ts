import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('banks')
export class Bank {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  code: number;
}
