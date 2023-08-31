import { IsString, IsEmail } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'Почта должна быть строкой' })
  @IsEmail({}, { message: 'Не корректная почта' })
  readonly email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  readonly password: string;
}
