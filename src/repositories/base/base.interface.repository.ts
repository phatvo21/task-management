import {DeleteResult, UpdateResult} from 'typeorm';

export interface BaseInterfaceRepository<T> {
  create(data: T | any): Promise<T>;

  update(data: T | any, id: number): Promise<T | UpdateResult>;

  findOneById(id: number): Promise<T>;

  findByCondition(filterCondition: any): Promise<T>;

  findAll(): Promise<[T[], number]>;

  remove(id: string): Promise<DeleteResult>;

  findWithRelations(relations: any): Promise<T[]>;

  multipleCreate(data: T[] | any[]): Promise<T[]>;
}
