import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RolePermissionEntity } from '@authentication/model';
import { RoleEnum } from '@constant/enum';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'enum', enum: RoleEnum })
  name: RoleEnum;

  @OneToMany(() => RolePermissionEntity, rolePermission => rolePermission.role)
  permissions: RolePermissionEntity;
}
