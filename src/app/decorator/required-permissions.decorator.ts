import { SetMetadata } from '@nestjs/common';
import { ActionEnum } from '@constant/enum';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...actions: ActionEnum[]) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata(PERMISSIONS_KEY, actions)(target, propertyKey, descriptor);
  };
};
