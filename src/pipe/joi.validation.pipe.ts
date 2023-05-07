import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpStatus,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

import ClientException from '@exception/client.exception';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    if (error) {
      throw new ClientException('Validation failed', HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
