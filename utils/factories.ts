import { bool, build, fake, perBuild } from '@jackfranklin/test-data-bot';
import { TodoResponse, UserWithoutPassword } from 'types';

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
    createdAt: perBuild(() => new Date()),
    updatedAt: perBuild(() => new Date()),
    createdBy: fake(f => f.random.uuid()),
  },
  traits: {
    old: {
      overrides: {
        createdAt: fake(f => f.date.past()),
        updatedAt: fake(f => f.date.past()),
      },
    },
  },
});
