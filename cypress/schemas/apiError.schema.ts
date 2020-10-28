import { ObjectSchema, versionSchemas } from '@cypress/schema-tools';

const apiError100: ObjectSchema = {
  version: {
    major: 1,
    minor: 0,
    patch: 0,
  },
  schema: {
    type: 'object',
    title: 'ApiError',
    description: 'Error response returned by the API',
    properties: {
      statusCode: {
        type: 'integer',
        minimum: 400,
        maximum: 599,
        description: 'The status code of the error',
      },
      message: {
        type: 'string',
        description: 'The message of the error',
      },
      errors: {
        type: 'object',
        description: 'Validation error messages',
      },
    },
    required: ['statusCode', 'message'],
    additionalProperties: false,
  },
  example: {
    statusCode: 422,
    message: 'Unprocessable Entity',
    errors: {
      firstName: 'First name is a required field',
      lastName: 'Last name is a required field',
      password: 'Password is a required field',
      username: 'Username is a required field',
    },
  },
};

export default versionSchemas(apiError100);
