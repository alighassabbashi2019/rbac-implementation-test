import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RolePermissionEntity } from '@authentication/model';

@Injectable()
export class RolePermissionRepository extends Repository<RolePermissionEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(RolePermissionEntity, dataSource.createEntityManager());
  }
}
