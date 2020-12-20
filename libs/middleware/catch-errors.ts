import { StatusCodes } from 'http-status-codes';
import { ErrorResponse, HttpApiError, NextHttpHandler } from 'types';

function isValidationObjectErrors(
  context: unknown,
): context is Record<string, string> {
  return (
    context !== null &&
    typeof context === 'object' &&
    !(context instanceof Error) &&
    Object.keys(context).length > 0
  );
}

export function catchErrors(
  handler: NextHttpHandler,
): NextHttpHandler<ErrorResponse> {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (error) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'test') {
        // silent log on test environment
        console.debug(`[${req.method}] ${req.url}`);
        console.error(error);
      }

      if (HttpApiError.isHttpApiError(error)) {
        const { message, statusCode, context } = error;

        return res.status(statusCode).json({
          message,
          statusCode,
          errors: isValidationObjectErrors(context) ? context : undefined,
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  };
}
