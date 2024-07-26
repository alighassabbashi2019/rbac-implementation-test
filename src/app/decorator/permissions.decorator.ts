import { SetMetadata } from '@nestjs/common';
import { ActionEnum, RoleEnum } from '@constant/enum';

export const ALLOWED_ACTIONS_KEY = 'allowedActions';
export const RoleActions = (role: RoleEnum, actions: ActionEnum[]) => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      SetMetadata(ALLOWED_ACTIONS_KEY, actions)(target, propertyKey, descriptor);
    } else {
      SetMetadata(target.prototype.constructor.name, actions)(target.prototype.constructor);
    }
  };
};
