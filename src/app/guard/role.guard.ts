import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleActionsRepository } from '@authentication/model';
import { REQUIRED_PERMISSIONS } from '@decorator/required-permissions.decorator';
import { In } from 'typeorm';
import { RequiredPermission } from '@interface/required-permission.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleActionsRepository: RoleActionsRepository,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = context.switchToHttp().getRequest().currentUser;
    const limitedRoles = this.reflector.get<string[]>(context.getClass().name, context.getClass());
    if (limitedRoles?.length && !limitedRoles.includes(user.role.name)) throw new UnauthorizedException();

    const requiredPermissions: RequiredPermission = this.reflector.getAllAndOverride<string[]>(REQUIRED_PERMISSIONS, [
      context.getHandler(),
      context.getClass(),
    ]) as unknown as RequiredPermission;
    if (!requiredPermissions.roles.includes(user.role.name)) throw new UnauthorizedException();
    const thisRolePermissions = requiredPermissions.actions;
    const savedRolePermissions = await this.roleActionsRepository.find({
      relations: ['action'],
      where: {
        roleId: user.role.id,
        action: {
          name: In(thisRolePermissions),
        },
      },
    });
    return thisRolePermissions.length === savedRolePermissions.length;
  }
}
