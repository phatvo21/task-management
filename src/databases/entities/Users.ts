import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { genSaltSync, hashSync } from "bcrypt";

@Entity("users")
export class Users {
   @PrimaryGeneratedColumn({ type: "int", name: "id" })
   id: number;

   @Column("varchar", { name: "name", nullable: true, length: 255 })
   name: string | null;

   @Column("varchar", { name: "email", nullable: false })
   email: string | null;

   @Column("varchar", { name: "password", nullable: false })
   password: string | null;

   @Column("datetime", { name: "created_at", nullable: true })
   createdAt: Date;

   @Column("datetime", { name: "updated_at", nullable: true })
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
