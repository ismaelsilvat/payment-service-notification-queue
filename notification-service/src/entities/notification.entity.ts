import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  paymentId!: number;

  @Column()
  message!: string;

  @CreateDateColumn()
  sentAt!: Date;
}