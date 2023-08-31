import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationExpection } from '../../exceptions/validate.exception';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value, metadata: ArgumentMetadata) {
    const obj = plainToClass(metadata.metatype, value);
    const errors = await validate(obj);

    if (errors.length) {
      const messages = errors.map((err) => {
        return `${err.property} = ${Object.values(err.constraints).join(', ')}`;
      });
      throw new ValidationExpection(messages);
    }

    return value;
  }
}
