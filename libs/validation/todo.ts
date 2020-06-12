import { object, string } from 'yup';

export const createTodoSchema = object({
  text: string().required().trim().max(140).label('Text'),
}).required();
