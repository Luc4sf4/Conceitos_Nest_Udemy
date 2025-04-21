import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Recado {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255 })
  texto: string;
  @Column({ type: 'varchar', length: 255 })
  de: string;
  @Column({ type: 'varchar', length: 255 })
  para: string;

  @Column({ default: false })
  lido: boolean;

  @Column()
  data: Date; // createdAt

  @CreateDateColumn()
  createdAt?: Date; // createdAt

  @UpdateDateColumn()
  updatedAt?: Date; // updatedAt
}
