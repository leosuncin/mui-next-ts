import { bool, build, fake, perBuild } from '@jackfranklin/test-data-bot';
import {
  AuthLogin,
  AuthRegister,
  TodoResponse,
  UserWithoutPassword,
} from 'types';

export function randomArrayElement<Element>(array: Element[]): Element {
  const index = Math.floor(Math.random() * array.length);

  return array[index];
}

export function shuffleArray<Element>(array: Element[]): Element[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

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

export const createTodoBuild = build<Pick<TodoResponse, 'text'>>({
  fields: {
    text: fake(f => f.lorem.words()),
  },
  traits: {
    invalid: {
      overrides: {
        text: fake(f => f.lorem.paragraphs()),
      },
    },
    search: {
      overrides: {
        text: fake(f => f.lorem.word()),
      },
    },
  },
});

export const loginBuild = build<AuthLogin>({
  fields: {
    username: fake(f => f.internet.userName().toLocaleLowerCase()),
    password: fake(f => f.internet.password(12, true)),
  },
  traits: {
    invalid: {
      overrides: {
        password: fake(f => f.internet.password(7)),
      },
    },
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

const toBase64 = (str: String) => Buffer.from(str).toString('base64');
const toBase64UrlSafe = (str: String) =>
  Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');

export const tokenBuilder = build<{ token: string }>({
  fields: {
    token: fake(f =>
      f.lorem.sentences(3).split('. ').map(toBase64UrlSafe).join('.'),
    ),
  },
  traits: {
    slug: {
      overrides: {
        token: fake(f => f.lorem.slug()),
      },
    },
    base64: {
      overrides: {
        token: fake(f =>
          f.lorem.paragraphs(3).split('\n \r').map(toBase64).join('.'),
        ),
      },
    },
    uuid: {
      overrides: {
        token: fake(f => f.random.uuid()),
      },
    },
  },
});
