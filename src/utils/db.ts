import { factory, oneOf, primaryKey } from '@mswjs/data';
import { todos } from 'src/libs/db/todos';
import { users } from 'src/libs/db/users';
import { uuid } from 'src/utils/factories';

export const db = factory({
  users: {
    id: primaryKey(() => uuid()),
    firstName: String,
    lastName: String,
    username: String,
    picture: String,
    bio: String,
  },
  todo: {
    id: primaryKey(() => uuid()),
    text: String,
    done: Boolean,
    createdAt: Date,
    updatedAt: Date,
    createdBy: oneOf('users'),
  },
});

users.forEach(user => {
  db.users.create(user as unknown);
});
/* const _users = users.map((user) => db.users.create(user as unknown)); */

todos.forEach(todo => {
  const owner = db.users.findFirst({
    where: { id: { equals: todo.createdBy as string } },
    strict: true,
  });
  /* const owner = _users.find(user => user.id === todo.createdBy); */

  db.todo.create({ ...todo, createdBy: owner } as unknown);
});
