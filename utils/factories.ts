import { bool, build, fake, perBuild } from '@jackfranklin/test-data-bot';
import {
  AuthLogin,
  AuthRegister,
  TodoResponse,
  UserWithoutPassword,
} from 'types';

export const userBuild = build<UserWithoutPassword>({
  fields: {
    id: fake(f => f.random.uuid()),
    firstName: fake(f => f.name.firstName()),
    lastName: fake(f => f.name.lastName()),
    username: fake(f => f.internet.userName().toLocaleLowerCase()),
    picture: fake(f => f.image.avatar()),
    bio: fake(f => f.lorem.paragraph()),
  },
});

export const todoBuild = build<TodoResponse>({
  fields: {
    id: fake(f => f.random.uuid()),
    text: fake(f => f.lorem.sentence()),
    done: bool(),
    createdAt: perBuild(() => new Date().toISOString()),
    updatedAt: perBuild(() => new Date().toISOString()),
    createdBy: fake(f => f.random.uuid()),
  },
  traits: {
    old: {
      overrides: {
        createdAt: fake(f => f.date.past().toISOString()),
        updatedAt: fake(f => f.date.past().toISOString()),
      },
    },
  },
});

export const loginBuild = build<AuthLogin>({
  fields: {
    username: fake(f => f.internet.userName().toLocaleLowerCase()),
    password: fake(f => f.internet.password(12, true)),
  },
});

export const registerBuild = build<AuthRegister>({
  fields: {
    firstName: fake(f => f.name.firstName()),
    lastName: fake(f => f.name.lastName()),
    username: fake(f => f.internet.userName().toLocaleLowerCase()),
    password: fake(f => f.internet.password(12, true)),
  },
});
