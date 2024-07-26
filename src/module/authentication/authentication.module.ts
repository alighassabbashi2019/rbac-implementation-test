import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionRepository, RoleActionsRepository, RoleRepository } from '@authentication/model';
import { UserModule } from '@user/user.module';

const repositories = [RoleRepository, ActionRepository, RoleActionsRepository];

@Module({
  imports: [
    TypeOrmModule.forFeature(repositories),
    UserModule,
  ],
  controllers: [AuthenticationController],
  providers: [...repositories, AuthenticationService],
})
export class AuthenticationModule {
}
