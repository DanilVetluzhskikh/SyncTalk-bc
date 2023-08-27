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
} from 'sequelize-typescript';
import { Server } from './server.model';
import { User } from 'src/modules/user/models/user.model';

export interface ServerMemberCreationAttributes {
  userId: number;
  serverId: number;
  joinedAt: Date;
  role: string;
}

@Table({ tableName: 'serverMembers' })
export class ServerMember extends Model<
  ServerMember,
  ServerMemberCreationAttributes
> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => Server)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  serverId: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  joinedAt: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @BelongsTo(() => User, 'userId')
  user: User;

  @BelongsTo(() => Server, 'serverId')
  server: Server;
}
