import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { AuthenticationResponse } from '@authentication/response/login.response';
import { compare, hashSync } from 'bcrypt';
import { UserService } from '@user/user.service';
import { CreateUserDto } from '@user/dto';
import { ActionRepository, RoleActionsRepository, RoleRepository } from '@authentication/model';
import { sign } from 'jsonwebtoken';
import { AuthenticationDto } from '@authentication/dto';
import { UserEntity } from '@user/model/user/user.entity';
import { JwtTokenInterface } from '@authentication/interface/jwt-token.interface';
import RoleActionsSeedJson from '@db/seed/role-actions.json';
import { ActionEnum, RoleEnum } from '@constant/enum';

@Injectable()
export class AuthenticationService implements OnModuleInit {
  constructor(
    private readonly userService: UserService,
    private readonly roleRepository: RoleRepository,
    private readonly actionRepository: ActionRepository,
    private readonly roleActionsRepository: RoleActionsRepository,
  ) {
  }

  async onModuleInit(): Promise<void> {
    const rolePermissionCount = await this.roleActionsRepository.count();
    if (!rolePermissionCount) {
      const flattened = Object.entries(RoleActionsSeedJson).flatMap(([role, actions]) =>
        actions.map(action => {
          return {
            role,
            action,
          };
        }),
      );
      const roleActions = await Promise.all(
        flattened.map(async dto => {
          const role = await this.roleRepository.findOne({ where: { name: dto.role as RoleEnum } });
          const action = await this.actionRepository.findOne({ where: { name: dto.action as ActionEnum } });
          return this.roleActionsRepository.create({
            actionId: action.id,
            roleId: role.id,
          });
        }),
      );
      await this.roleActionsRepository.save(roleActions);
    }
  }

  async signup(signupDto: AuthenticationDto): Promise<AuthenticationResponse> {
    const hashedPassword = this.hashPassword(signupDto.password);
    const role = await this.roleRepository.findOne({ where: { name: RoleEnum.CUSTOMER } });
    const createdUser = await this.userService.create(
      new CreateUserDto({
        username: signupDto.username,
        password: hashedPassword,
        roleId: role.id,
      }),
    );
    return new AuthenticationResponse({ result: 'success', token: this.createToken(createdUser) });
  }

  async login(loginDto: AuthenticationDto): Promise<AuthenticationResponse> {
    const user = await this.userService.getByUsername(loginDto.username);
    if (!user) throw new UnauthorizedException();
    const isPasswordCorrect = await compare(loginDto.password, user.password);
    if (!isPasswordCorrect) throw new UnauthorizedException();
    return new AuthenticationResponse({ result: 'success', token: this.createToken(user) });
  }

  private hashPassword(originalPassword: string): string {
    return hashSync(originalPassword, 12);
  }

  private createToken(user: UserEntity): string {
    const jwtPayload: JwtTokenInterface = {
      id: user.id,
      roleId: user.roleId,
    };
    return sign(jwtPayload, 'this is very strong!!', { expiresIn: '10 min' });
  }
}
