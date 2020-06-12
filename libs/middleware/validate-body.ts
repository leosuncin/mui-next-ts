import { UNPROCESSABLE_ENTITY, getStatusText } from 'http-status-codes';
import { NextHttpHandler } from 'types';
import { ObjectSchema } from 'yup';

export function validateBody(
  schema: ObjectSchema,
  handler: NextHttpHandler,
): NextHttpHandler {
  return async (req, res) => {
    try {
      req.body = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      return handler(req, res);
    } catch (error) {
      return res.status(UNPROCESSABLE_ENTITY).json({
        statusCode: UNPROCESSABLE_ENTITY,
        message: getStatusText(UNPROCESSABLE_ENTITY),
        errors: error.inner.reduce(
          (prev, error) => ({ ...prev, [error.path]: error.errors[0] }),
          {},
        ),
      });
    }
  };
}
