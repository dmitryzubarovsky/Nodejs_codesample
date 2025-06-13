import { TransformFnParams } from 'class-transformer';

export function toLowerCase(fnParams: TransformFnParams): string {
  return fnParams.value.toLowerCase();
}
