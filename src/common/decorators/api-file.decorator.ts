import { ApiBody } from '@nestjs/swagger';

export const ApiFile = (fileName: string): MethodDecorator => (
  target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor
): TypedPropertyDescriptor<never> | void => {
  ApiBody({
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        [fileName]: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })(target, propertyKey, descriptor);
};
