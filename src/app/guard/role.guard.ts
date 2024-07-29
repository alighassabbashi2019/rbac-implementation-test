import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleActionsRepository } from '@authentication/model';
import { ROLES_KEY } from '@decorator/role.decorator';
import { ActionEnum, RoleEnum } from '@constant/enum';
import { PERMISSIONS_KEY } from '@decorator/required-permissions.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleActionsRepository: RoleActionsRepository,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = context.switchToHttp().getRequest().currentUser;
    const classLimitedRoles: RoleEnum[] = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [context.getClass()]);
    const handlerLimitedRoles: RoleEnum[] = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
    ]);
    const limitedRoles: RoleEnum[] = handlerLimitedRoles || classLimitedRoles;

    if (limitedRoles && !limitedRoles.includes(user.role.name)) {
      throw new UnauthorizedException();
    }

    const permissions = this.reflector.getAllAndOverride<ActionEnum[]>(
      PERMISSIONS_KEY, [context.getHandler()],
    );
    const roleActions = await this.roleActionsRepository.getRoleActions(user.roleId);
    return permissions.every(permission => roleActions.includes(permission));
  }
}
