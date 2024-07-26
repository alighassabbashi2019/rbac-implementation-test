import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolePermissionRepository } from '@authentication/model';
import { ALLOWED_ACTIONS_KEY } from '@decorator/permissions.decorator';
import { In } from 'typeorm';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly RolePermissionRepository: RolePermissionRepository,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = context.switchToHttp().getRequest().currentUser;
    const limitedRoles = this.reflector.get<string[]>(context.getClass().name, context.getClass());
    if (limitedRoles?.length && !limitedRoles.includes(user.role.name)) throw new UnauthorizedException();

    const requiredPermissions: string[] = this.reflector.getAllAndOverride<string[]>(ALLOWED_ACTIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) as string[];
    const rolePermissions = await this.RolePermissionRepository.find({
      relations: ['action'],
      where: {
        roleId: user.role.id,
        action: {
          name: In(requiredPermissions),
        },
      },
    });
    return requiredPermissions.length === rolePermissions.length;
  }
}
