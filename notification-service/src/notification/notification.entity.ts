import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum NotificationType {
  RIDE_MATCHED = 'ride_matched',
  RIDE_ACCEPTED = 'ride.accepted',
  RIDE_COMPLETED = 'ride.completed',
  RIDE_CANCELLED = 'ride.cancelled',
}

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  type: string;

  @Column({ type: 'jsonb' })
  payload: object;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
