import { NextHttpHandler, UnprocessableEntityError } from 'types';
import type { AnyObjectSchema } from 'yup';

export function validateBody(schema: AnyObjectSchema) {
  return (handler: NextHttpHandler): NextHttpHandler => async (
    request,
    res,
  ) => {
    try {
      request.body = await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      await handler(request, res);
      return;
    } catch (error) {
      throw new UnprocessableEntityError(
        'Validation errors',
        UnprocessableEntityError.transformValidationError(error),
      );
    }
  };
}
