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
import { Message } from 'src/modules/message/models/messages.model';
import { Server } from 'src/modules/server/models/server.model';

interface ChannelCreationAttributes {
  name: string;
  serverId: number;
}

@Table({ tableName: 'channels' })
export class Channel extends Model<Channel, ChannelCreationAttributes> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ForeignKey(() => Server)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  serverId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @BelongsTo(() => Server, 'serverId')
  server: Server;

  @HasMany(() => Message, 'channelId')
  messages: Message[];
}
