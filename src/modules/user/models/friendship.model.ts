import {
  Column,
  Model,
  Table,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';

export interface FriendshipCreationAttributes {
  userId: number;
  friendId: number;
  status: string;
}

@Table({ tableName: 'friendships' })
export class Friendship extends Model<
  Friendship,
  FriendshipCreationAttributes
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  friendId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string; // Could be 'pending', 'accepted', or 'declined'

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;

  @DeletedAt
  @Column
  deletedAt: Date;

  @BelongsTo(() => User, 'userId')
  user: User;

  @BelongsTo(() => User, 'friendId')
  friend: User;
}
