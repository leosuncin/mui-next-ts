import type { AnyObjectSchema } from 'yup';

import { NextHttpHandler, UnprocessableEntityError } from '@app/types';

export function validateBody(schema: AnyObjectSchema) {
  return (handler: NextHttpHandler): NextHttpHandler =>
    async (req, res) => {
      try {
        req.body = await schema.validate(req.body, {
          abortEarly: false,
          stripUnknown: true,
        });

        return handler(req, res);
      } catch (error) {
        throw new UnprocessableEntityError(
          'Validation errors',
          UnprocessableEntityError.transformValidationError(error),
        );
      }
    };
}
