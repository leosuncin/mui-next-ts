import { NextHttpHandler, UnprocessableEntityError } from 'types';
import type { AnyObjectSchema, ValidationError } from 'yup';

export function validateBody(schema: AnyObjectSchema) {
  return (handler: NextHttpHandler): NextHttpHandler => async (
    request,
    response,
  ) => {
    try {
      request.body = await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      await handler(request, response);
      return;
    } catch (error: unknown) {
      throw new UnprocessableEntityError(
        'Validation errors',
        UnprocessableEntityError.transformValidationError(
          error as ValidationError,
        ),
      );
    }
  };
}
