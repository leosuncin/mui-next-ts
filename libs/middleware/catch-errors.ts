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
  return async (request, res) => {
    try {
      await handler(request, res);
      return;
    } catch (error) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'test') {
        // Silent log on test environment
        console.debug(`[${request.method}] ${request.url}`);
        console.error(error);
      }

      if (HttpApiError.isHttpApiError(error)) {
        const { message, statusCode, context } = error;

        res.status(statusCode).json({
          message,
          statusCode,
          errors: isValidationObjectErrors(context) ? context : undefined,
        });
        return;
      }

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  };
}
