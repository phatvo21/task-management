import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { getManager } from "typeorm";
import { BaseInterfaceRepository } from "./base.interface.repository";

export abstract class BaseAbstractRepository<T> implements BaseInterfaceRepository<T> {
   private entity: Repository<T>;
   public entityManager = getManager();

   protected constructor(entity: Repository<T>) {
      this.entity = entity;
   }

   public create(data: T | any): Promise<T> {
      return this.entity.save(data);
   }

   public update(data: T | any, id: number): Promise<T | UpdateResult> {
      return this.entity.update(id, data);
   }

   public multipleCreate(data: T[] | any[]): Promise<T[]> {
      return this.entity.save(data);
   }

   public findOneById(id: number): Promise<T> {
      return this.entity.findOne(id);
   }

   public findByCondition(filterCondition: any): Promise<T> {
      return this.entity.findOne({ where: filterCondition });
   }

   public findWithRelations(relations: any): Promise<T[]> {
      return this.entity.find(relations);
   }

   public findAll(): Promise<[T[], number]> {
      return this.entity.findAndCount();
   }

   public remove(id: string): Promise<DeleteResult> {
      return this.entity.delete(id);
   }
}
