import { boolean, object, string } from 'yup';

export const createTodoSchema = object({
  text: string().required().trim().max(140).label('Text'),
}).required();

export const editTodoSchema = object({
  text: string().trim().max(140).label('Text'),
  done: boolean().label('Done'),
}).required();
