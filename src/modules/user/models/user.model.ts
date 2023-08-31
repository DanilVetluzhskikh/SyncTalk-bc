import {
  Column,
  Model,
  Table,
  DataType,
  UpdatedAt,
  CreatedAt,
  HasMany,
  DeletedAt,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { ServerMember } from 'src/modules/server/models/serverMember.model';
import { Friendship } from './friendship.model';
import { Profile } from './profile.model';

export interface UserCreationAttributes {
  username: string;
  email: string;
  passwordHash: string;
  profileId: number;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  passwordHash: string;

  @ForeignKey(() => Profile)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  profileId: number;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;

  @DeletedAt
  @Column
  deletedAt: Date;

  @HasMany(() => ServerMember, 'userId')
  servers: ServerMember[];

  @HasMany(() => Friendship, 'userId')
  friends: Friendship[];

  @BelongsTo(() => Profile, 'profileId')
  profile: Profile;
}
