import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  DataType,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Channel } from 'src/modules/channel/models/channel.model';
import { User } from 'src/modules/user/models/user.model';
import { ServerMember } from './serverMember.model';

export interface ServerCreationAttributes {
  name: string;
  ownerId: number;
}

@Table({ tableName: 'servers' })
export class Server extends Model<Server, ServerCreationAttributes> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ownerId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @BelongsTo(() => User, 'ownerId')
  owner: User;

  @HasMany(() => Channel, 'serverId')
  channels: Channel[];

  @HasMany(() => ServerMember, 'serverId')
  members: ServerMember[];
}
