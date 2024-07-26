import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from '@user/dto';
import { Roles } from '@decorator/role.decorator';
import { AuthGuard, RoleGuard } from '../../app/guard';
import { CurrentUser } from '@decorator/current-user.decorator';
import { UserEntity } from '@user/model/user/user.entity';
import { RoleActions } from '@decorator/permissions.decorator';
import { ActionEnum, RoleEnum } from '@constant/enum';

@Controller('user')
@UseGuards(RoleGuard)
@UseGuards(AuthGuard)
@Roles(RoleEnum.ADMIN, RoleEnum.CUSTOMER)
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get('/')
  @RoleActions(RoleEnum.ADMIN, [ActionEnum.USER_READ_ALL])
  getAllUsers() {
    return this.userService.getAll();
  }

  @Post('/')
  @UseGuards(RoleGuard)
  createNewUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch('/:id')
  @RoleActions(RoleEnum.ADMIN, [ActionEnum.USER_UPDATE])
  @RoleActions(RoleEnum.CUSTOMER, [ActionEnum.USER_UPDATE])
  updateUser(
    @CurrentUser() currentUser: UserEntity,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(currentUser, id, updateUserDto);
  }

  @Delete('/:id')
  @RoleActions(RoleEnum.ADMIN, [ActionEnum.USER_DELETE])
  deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.delete(id);
  }
}
