import { CustomFormat, combineSchemas, detectors } from '@cypress/schema-tools';

import apiErrorSchema from './apiError.schema';
import todoSchema from './todo.schema';
import userSchema from './user.schema';

const datetime: CustomFormat = {
  name: 'datetime',
  description: 'Date time ISO format',
  detect: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
  example: new Date().toISOString(),
};

const uuid: CustomFormat = {
  name: 'uuid',
  description: 'uuid v4',
  detect: /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
  example: '760add88-0a2b-4358-bc3f-7d82245c5dea',
};

export const schemas = combineSchemas(apiErrorSchema, userSchema, todoSchema);

export const formats = detectors({ datetime, uuid });
