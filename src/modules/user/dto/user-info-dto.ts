import { IsString, Length } from 'class-validator';

export class UserInfoDto {
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @Length(3, 12, {
    message:
      'Имя пользователя должно быть не меньше 3 символов и не больше 12 символов',
  })
  readonly username: string;

  @IsString({ message: 'URL на аватар пользователя должен быть строкой' })
  @Length(3, 256, {
    message:
      'URL на аватар должнен быть не меньше 1 символа и не больше 256 символов',
  })
  readonly avatar: string;
}
