import { IsString, Length } from 'class-validator';

export class StatusDto {
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @Length(3, 20, {
    message: 'Статус должен быть не больше 20 символов',
  })
  readonly status: string;
}
