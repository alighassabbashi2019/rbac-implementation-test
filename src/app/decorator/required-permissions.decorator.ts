import { SetMetadata } from '@nestjs/common';
import { ActionEnum, RoleEnum } from '@constant/enum';

export const REQUIRED_PERMISSIONS = 'requiredPermissions';
export const RequiredPermissions = (roles: RoleEnum[], actions: ActionEnum[]) => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      SetMetadata(REQUIRED_PERMISSIONS, { roles, actions })(target, propertyKey, descriptor);
    } else {
      SetMetadata(target.prototype.constructor.name, { roles, actions })(target.prototype.constructor);
    }
  };
};
