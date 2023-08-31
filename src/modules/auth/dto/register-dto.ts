import { IsString, Length, IsEmail } from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'Почта должна быть строкой' })
  @IsEmail({}, { message: 'Не корректная почта' })
  readonly email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @Length(4, 16, { message: 'Пароль должен быть от 4 до 16 символов' })
  readonly password: string;
}
