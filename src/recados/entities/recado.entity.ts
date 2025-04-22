import { Pessoa } from 'src/pessoas/entities/pessoa.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Recado {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255 })
  texto: string;

  @ManyToOne(() => Pessoa) //muitos recados de uma pessoa
  @JoinColumn({ name: 'de' }) //especifica a coluna que armazena o ID de Pessoa
  de: Pessoa;

  @ManyToOne(() => Pessoa) //muitos recados para uma pessoa
  @JoinColumn({ name: 'para' })
  para: Pessoa;

  @Column({ default: false })
  lido: boolean;

  @Column()
  data: Date; // createdAt

  @CreateDateColumn()
  createdAt?: Date; // createdAt

  @UpdateDateColumn()
  updatedAt?: Date; // updatedAt
}
