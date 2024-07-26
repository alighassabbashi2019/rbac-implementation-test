import { ActionEnum, RoleEnum } from '@constant/enum';

export interface RequiredPermission {
  roles: RoleEnum[];
  actions: ActionEnum[];
}
