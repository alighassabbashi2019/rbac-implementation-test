import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RolePermissionEntity } from '@authentication/model';
import { ActionEnum } from '@constant/enum';

@Entity('actions')
export class ActionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ActionEnum })
  name: ActionEnum;

  @OneToMany(() => RolePermissionEntity, rolePermission => rolePermission.action)
  roles: RolePermissionEntity;
}
