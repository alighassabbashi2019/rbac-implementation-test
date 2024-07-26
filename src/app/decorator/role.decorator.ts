import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '@constant/enum';

export const Roles = (...roles: RoleEnum[]) => {
  return (target: any) => {
    SetMetadata(target.prototype.constructor.name, roles)(target);
  };
};
