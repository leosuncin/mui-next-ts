import { object, string } from 'yup';

export const loginSchema = object({
  username: string().required().trim().min(5).lowercase().label('Username'),
  password: string().required().min(8).label('Password'),
}).required();
