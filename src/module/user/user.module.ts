import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@user/model/user/user.repository';
import { RoleActionsRepository } from '@authentication/model';

const repositories = [UserRepository, RoleActionsRepository];

@Module({
  imports: [TypeOrmModule.forFeature(repositories)],
  controllers: [UserController],
  providers: [...repositories, UserService],
  exports: [UserService],
})
export class UserModule {
}
