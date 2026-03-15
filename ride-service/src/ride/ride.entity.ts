import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RideStatus {
  SEARCHING = 'searching',
  MATCHED = 'matched',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('rides')
export class RideEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  riderId: string;

  @Column({ nullable: true })
  driverId: string;

  @Column('decimal', { precision: 10, scale: 7 })
  pickupLat: number;

  @Column('decimal', { precision: 10, scale: 7 })
  pickupLng: number;

  @Column('decimal', { precision: 10, scale: 7 })
  dropoffLat: number;

  @Column('decimal', { precision: 10, scale: 7 })
  dropoffLng: number;

  @Column({ type: 'enum', enum: RideStatus, default: RideStatus.SEARCHING })
  status: RideStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedaAt: Date;
}
