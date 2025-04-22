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

//Cascade tem o efeito cascata, ou seja, se eu começo deletando de cima,
//vai deletando o resto em efeito cascata, assim como o update

@Entity()
export class Recado {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255 })
  texto: string;

  //muitos recados de uma pessoa
  @ManyToOne(() => Pessoa, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  //especifica a coluna que armazena o ID de Pessoa que envia o recado
  @JoinColumn({ name: 'de' })
  de: Pessoa;

  //muitos recados para uma pessoa
  @ManyToOne(() => Pessoa, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  //especifica a coluna que armazena o ID de pessoa que recebe o recado
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
