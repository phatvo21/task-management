import {BeforeInsert, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {genSaltSync, hashSync} from 'bcrypt';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn({type: 'int', name: 'id'})
  id: number;

  @Column({type: 'varchar', name: 'name', nullable: true, length: 255})
  name: string | null;

  @Column({type: 'varchar', name: 'email', nullable: false})
  email: string | null;

  @Column({type: 'varchar', name: 'password', nullable: false})
  password: string | null;

  @Column({type: 'datetime', name: 'created_at', nullable: true})
  createdAt: Date;

  @Column({type: 'datetime', name: 'updated_at', nullable: true})
  updatedAt: Date;

  @BeforeInsert()
  generatePasswordHash(): void {
    this.password = hashSync(this.password, genSaltSync(10));
  }

  @BeforeInsert()
  lowercaseEmail(): void {
    this.email = this.email.toLowerCase();
  }
}
