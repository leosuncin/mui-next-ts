import { ObjectSchema, versionSchemas } from '@cypress/schema-tools';

export const user100: ObjectSchema = {
  version: {
    major: 1,
    minor: 0,
    patch: 0,
  },
  schema: {
    type: 'object',
    title: 'User',
    description: 'User response returned by the API',
    properties: {
      id: {
        type: 'string',
        description: 'The identifier of the user',
        format: 'uuid',
      },
      firstName: {
        type: 'string',
        description: 'The first name of the user',
      },
      lastName: {
        type: 'string',
        description: 'The last name of the user',
      },
      username: {
        type: 'string',
        description: 'The username of the user',
      },
      bio: {
        type: 'string',
        description: 'The biography of the user',
      },
      picture: {
        type: 'string',
        format: 'url',
        description: 'The picture URL of the user',
      },
    },
    required: true,
    additionalProperties: false,
  },
  example: {
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    firstName: 'John',
    id: '760add88-0a2b-4358-bc3f-7d82245c5dea',
    lastName: 'Doe',
    picture: 'https://i.pravatar.cc/200',
    username: 'admin',
  },
};

export default versionSchemas(user100);
