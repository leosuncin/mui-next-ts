import { object, string } from 'yup';

export const registerSchema = object({
  firstName: string().required().trim().min(2).label('First name'),
  lastName: string().required().trim().min(2).label('Last name'),
  username: string().required().trim().min(5).lowercase().label('Username'),
  password: string().required().min(8).label('Password'),
}).required();
