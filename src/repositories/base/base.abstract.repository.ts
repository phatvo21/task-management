import {DeleteResult, Repository, UpdateResult} from 'typeorm';
import {getManager} from 'typeorm';
import {BaseInterfaceRepository} from './base.interface.repository';

export abstract class BaseAbstractRepository<T> implements BaseInterfaceRepository<T> {
  private entity: Repository<T>;
  public entityManager = getManager();

  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  public create(data: T | any): Promise<T> {
    try {
      return this.entity.save(data);
    } catch (err) {
      throw err;
    }
  }

  public update(data: T | any, id: number): Promise<T | UpdateResult> {
    try {
      return this.entity.update(id, data);
    } catch (err) {
      throw err;
    }
  }

  public multipleCreate(data: T[] | any[]): Promise<T[]> {
    try {
      return this.entity.save(data);
    } catch (err) {
      throw err;
    }
  }

  public findOneById(id: number): Promise<T> {
    try {
      return this.entity.findOne(id);
    } catch (err) {
      throw err;
    }
  }

  public findByCondition(filterCondition: any): Promise<T> {
    try {
      return this.entity.findOne({where: filterCondition});
    } catch (err) {
      throw err;
    }
  }

  public findWithRelations(relations: any): Promise<T[]> {
    try {
      return this.entity.find(relations);
    } catch (err) {
      throw err;
    }
  }

  public findAll(): Promise<[T[], number]> {
    try {
      return this.entity.findAndCount();
    } catch (err) {
      throw err;
    }
  }

  public remove(id: string): Promise<DeleteResult> {
    try {
      return this.entity.delete(id);
    } catch (err) {
      throw err;
    }
  }
}
