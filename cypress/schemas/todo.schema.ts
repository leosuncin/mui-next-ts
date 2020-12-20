import { ObjectSchema, versionSchemas } from '@cypress/schema-tools';

const todo100: ObjectSchema = {
  version: {
    major: 1,
    minor: 0,
    patch: 0,
  },
  schema: {
    type: 'object',
    title: 'Todo',
    description: 'Todo response returned by the API',
    properties: {
      id: {
        type: 'string',
        description: 'The identifier of the todo',
        format: 'uuid',
      },
      text: {
        type: 'string',
        description: 'The text of the todo',
      },
      done: {
        type: 'boolean',
        defaultValue: true,
        description: 'Is todo done',
      },
      createdAt: {
        type: 'string',
        format: 'datetime',
        description: 'Created at of the todo',
      },
      updatedAt: {
        type: 'string',
        format: 'datetime',
        description: 'Updated at of the todo',
      },
      createdBy: {
        type: 'string',
        description: 'The creator of the todo',
        format: 'uuid',
      },
    },
    required: true,
    additionalProperties: false,
  },
  example: {
    id: 'bcf13961-75a5-44a4-9ed6-2c15d25424ae',
    text: 'Make a salad',
    done: true,
    createdAt: '2020-06-02T20:00:00.000Z',
    updatedAt: '2020-06-02T20:00:00.000Z',
    createdBy: '760add88-0a2b-4358-bc3f-7d82245c5dea',
  },
};

export default versionSchemas(todo100);
