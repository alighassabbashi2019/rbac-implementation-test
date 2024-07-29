import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ActionEntity, RoleActionsEntity } from '@authentication/model';
import { ActionEnum } from '@constant/enum';

@Injectable()
export class RoleActionsRepository extends Repository<RoleActionsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(RoleActionsEntity, dataSource.createEntityManager());
  }

  async getRoleActions(roleId: string): Promise<ActionEnum[]> {
    const actions = await this.createQueryBuilder('roleActions')
      .leftJoinAndSelect('roleActions.action', 'action')
      .select('action.name', 'name')
      .where('roleActions.roleId = :roleId', { roleId })
      .getRawMany<ActionEntity>();
    return actions.map(action => action.name);
  }
}
