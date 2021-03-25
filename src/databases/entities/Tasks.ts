import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tasks")
export class Tasks {
   @PrimaryGeneratedColumn({ type: "int", name: "id" })
   id: number;

   @Column("varchar", { name: "title", nullable: false, length: 255 })
   title: string | null;

   @Column("text", { name: "description", nullable: true })
   description: string | null;

   @Column("varchar", { name: "task_identity", nullable: false, length: 255 })
   taskIdentity: string | null;

   @Column("enum", {
      name: "status",
      nullable: true,
      enum: ["pending", "completed"],
   })
   status: "pending" | "completed" | null;

   @Column("datetime", { name: "created_at", nullable: true })
   createdAt: Date;

   @Column("datetime", { name: "updated_at", nullable: true })
   updatedAt: Date;
}
