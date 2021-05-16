export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  picture: string;
  bio: string;
}

export type UserWithoutPassword = Omit<User, 'password'>;
