import { FindOneOptions, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseRepository<T> {
  protected constructor(protected readonly repository: Repository<T>) {}

  async create(entity: T): Promise<T> {
    const createdEntity = this.repository.create(entity);
    return await this.repository.save(createdEntity);
  }

  async findOne(options: FindOneOptions<T>): Promise<T> {
    return this.repository.findOne(options);
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async update(id: number, options: FindOneOptions<T>, entity: T): Promise<T> {
    await this.repository.update(id, entity as QueryDeepPartialEntity<T>);
    return this.findOne(options);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}