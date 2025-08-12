import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IJob } from '../interfaces/jobs.interface';

@Entity()
@Index(['externalId', 'source'], { unique: true })
export class Job implements IJob{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  externalId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ default: false })
  remote: boolean;

  @Column({ nullable: true })
  jobType: string;

  @Column({ type: 'int', nullable: true })
  minSalary: number;

  @Column({ type: 'int', nullable: true })
  maxSalary: number;

  @Column({ nullable: true })
  currency: string;

  @Column()
  companyName: string;

  @Column({ nullable: true })
  companyIndustry: string;

  @Column({ type: 'int', nullable: true })
  experience: number;

  @Column('text', { array: true, nullable: true })
  skills: string[];

  @Index()
  @Column({ type: 'timestamp' })
  postedDate: Date;

  @Column()
  source: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
}
