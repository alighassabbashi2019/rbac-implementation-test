import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RoleActionsEntity } from '@authentication/model';

@Injectable()
export class RoleActionsRepository extends Repository<RoleActionsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(RoleActionsEntity, dataSource.createEntityManager());
  }
}
