import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ActionEntity, RoleEntity } from '@authentication/model';

@Entity('role_actions')
export class RoleActionsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roleId: string;

  @Column()
  actionId: string;

  @ManyToOne(() => RoleEntity, role => role.permissions)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @ManyToOne(() => ActionEntity, permission => permission.roles)
  @JoinColumn({ name: 'actionId' })
  action: ActionEntity;
}
