import { uuid } from '@nano-sql/core/lib/interfaces';

export interface User {
  id: uuid;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  picture: string;
  bio: string;
}
