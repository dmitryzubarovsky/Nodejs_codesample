import { DeepPartial, EntityRepository, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { BaseEntity } from './base-entity';

@EntityRepository()
export class BaseRepository<E> extends Repository<E & BaseEntity> {
  async createEntity(entity: DeepPartial<E & BaseEntity>, returningRelations?: Array<string> ): Promise<E> {
    const createdEntity = this.create(entity);
    const savedEntity = await this.save(createdEntity);
    const condition: FindOneOptions<E & BaseEntity> = { where: { id: savedEntity.id, }, };
    if (returningRelations) {
      condition.relations = returningRelations;
    }
    return this.findOne(condition);
  }

  async createManyEntities(entities: Array<DeepPartial<E & BaseEntity>>): Promise<Array<E & BaseEntity>> {
    const createdEntities = this.create(entities);
    const savedEntities = await this.save(createdEntities);
    const ids = savedEntities.map(item => item.id);
    return this.findByIds(ids);
  }

  readEntity(options?: FindOneOptions<E & BaseEntity>): Promise<E & BaseEntity | undefined> {
    const findOptions = { ...options, withDeleted: false, };
    return this.findOne(findOptions);
  }

  readEntityById(id: number | string, options?: FindOneOptions<E & BaseEntity>): Promise<E & BaseEntity | undefined> {
    if (!id) {
      throw new Error('Id is undefined');
    }
    if (options?.select && !options.select.includes('id')) {
      options.select.push('id', 'createdAt', 'updatedAt', 'deletedAt');
    }
    const findOptions = { ...options, withDeleted: false, };
    return this.findOne(id, findOptions);
  }

  readAllEntities(options?: FindManyOptions<E & BaseEntity>): Promise<Array<E & BaseEntity>> {
    if (options?.select && !options.select.includes('id')) {
      options.select.push('id', 'createdAt', 'updatedAt', 'deletedAt');
    }
    const findOptions = { ...options, withDeleted: false, };
    return this.find(findOptions);
  }

  async updateEntity(id: number | string, partialEntity: QueryDeepPartialEntity<E & BaseEntity>): Promise<E & BaseEntity> {
    if (!id) {
      throw new Error('Id is undefined');
    }
    await this.update(id, partialEntity);
    return this.findOne(id);
  }

  async softDeleteEntity(id: number | string): Promise<void> {
    if (!id) {
      throw new Error('Id is undefined');
    }
    await this.softDelete(id);
  }

  async softDeleteManyEntities(ids: Array<number>): Promise<void> {
    await this.softDelete(ids);
  }

  async hardDeleteEntity(id: number | string): Promise<void> {
    if (!id) {
      throw new Error('Id is undefined');
    }
    await this.delete(id);
  }

  async hardDeleteEntities(ids: Array<number>): Promise<void> {
    await this.delete(ids);
  }

  updateFewEntities(ids: Array<number | string>, partialEntity: QueryDeepPartialEntity<E & BaseEntity>): Promise<Array<unknown>> {
    const promises = ids.map(id => {
      return this.update(id, partialEntity);
    });

    return Promise.all(promises);
  }
}
