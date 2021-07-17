import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('tasks')
export class Tasks {
  @PrimaryGeneratedColumn({type: 'int', name: 'id'})
  id: number;

  @Column({type: 'varchar', name: 'title', nullable: false, length: 255})
  title: string | null;

  @Column({type: 'text', name: 'description', nullable: true})
  description: string | null;

  @Column({type: 'varchar', name: 'task_identity', nullable: false, length: 255})
  taskIdentity: string | null;

  @Column()
  status: 'pending' | 'completed' | null;

  @Column({type: 'datetime', name: 'created_at', nullable: true})
  createdAt: Date;

  @Column({type: 'datetime', name: 'updated_at', nullable: true})
  updatedAt: Date;
}
