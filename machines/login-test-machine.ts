import set from 'lodash.set';
import {
  MachineConfig,
  StateMachine,
  StateSchema,
  createMachine,
} from 'xstate';

export interface LoginTestStateSchema extends StateSchema<never> {
  states: {
    pristine: {};
    invalid: {
      states: {
        username: {};
        password: {};
      };
    };
    valid: {};
    correctCredentials: {};
    incorrectCredentials: {};
    success: {};
    retry: {};
    locked: {};
  };
}
export type TypeUsernameEvent = {
  type: string;
  username: string;
};
export type TypePasswordEvent = {
  type: string;
  password: string;
};
export type FillEvent = TypeUsernameEvent & TypePasswordEvent;

function isValidUsername(username: string): boolean {
  return typeof username === 'string' && username.trim().length >= 5;
}
function isValidPassword(password: string): boolean {
  return typeof password === 'string' && password.trim().length >= 8;
}

const loginTestConfig: MachineConfig<never, LoginTestStateSchema, FillEvent> = {
  id: 'login-test',
  initial: 'pristine',
  states: {
    pristine: {
      on: {
        FILL_FORM: [
          {
            target: 'invalid.username',
            cond: (_, event: TypeUsernameEvent) =>
              !isValidUsername(event.username),
          },
          {
            target: 'invalid.password',
            cond: (_, event: TypePasswordEvent) =>
              !isValidPassword(event.password),
          },
          {
            target: 'correctCredentials',
            cond: (_, event) =>
              event.username === 'admin' && event.password === 'Pa$$w0rd!',
          },
          {
            target: 'valid',
            cond: (_, event) =>
              isValidUsername(event.username) &&
              isValidPassword(event.password),
          },
        ],
      },
    },
    invalid: {
      states: {
        username: {},
        password: {},
      },
    },
    valid: {
      on: {
        SUBMIT: { target: 'incorrectCredentials' },
      },
    },
    correctCredentials: {
      on: {
        SUBMIT: { target: 'success' },
      },
    },
    incorrectCredentials: {
      on: {
        RETRY: { target: 'retry' },
      },
    },
    success: {
      type: 'final',
    },
    retry: {
      on: {
        SUBMIT: { target: 'locked' },
      },
    },
    locked: {
      type: 'final',
    },
  },
};

export default (
  testSuite: Record<string, Function>,
): StateMachine<never, LoginTestStateSchema, FillEvent> => {
  Object.entries(testSuite).forEach(([state, test]) => {
    const path = `states.${state.replace(/\./g, '.states.')}.meta.test`;
    set(loginTestConfig, path, test);
  });

  return createMachine(loginTestConfig);
};
