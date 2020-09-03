import set from 'lodash.set';
import {
  MachineConfig,
  StateMachine,
  StateSchema,
  createMachine,
} from 'xstate';

import { users } from '../libs/db/users';

export interface RegisterTestStateSchema extends StateSchema<never> {
  states: {
    pristine: {};
    invalid: {
      states: {
        firstName: {};
        lastName: {};
        username: {};
        password: {};
      };
    };
    valid: {};
    duplicateCredentials: {};
    success: {};
    fail: {};
  };
}
export type TypeFirstNameEvent = {
  type: string;
  firstName: string;
};
export type TypeLastNameEvent = {
  type: string;
  lastName: string;
};
export type TypeUsernameEvent = {
  type: string;
  username: string;
};
export type TypePasswordEvent = {
  type: string;
  password: string;
};
export type FillEvent = TypeFirstNameEvent &
  TypeLastNameEvent &
  TypeUsernameEvent &
  TypePasswordEvent;

function isValidFirstName(firstName: string): boolean {
  firstName = firstName.includes('{backspace}') ? '' : firstName;
  return typeof firstName === 'string' && firstName.trim().length > 0;
}
function isValidLastName(lastName: string): boolean {
  lastName = lastName.includes('{backspace}') ? '' : lastName;
  return typeof lastName === 'string' && lastName.trim().length > 0;
}
function isValidUsername(username: string): boolean {
  username = username.includes('{backspace}')
    ? ''
    : username.replace('{enter}', '');
  return typeof username === 'string' && username.length >= 5;
}
function isValidPassword(password: string): boolean {
  password = password.includes('{backspace}')
    ? ''
    : password.replace('{enter}', '');
  return typeof password === 'string' && password.trim().length >= 8;
}

const registerTestConfig: MachineConfig<
  never,
  RegisterTestStateSchema,
  FillEvent
> = {
  id: 'register-test',
  initial: 'pristine',
  states: {
    pristine: {
      on: {
        FILL_FORM: [
          {
            target: 'invalid.firstName',
            cond: (_, event: TypeFirstNameEvent) =>
              !isValidFirstName(event.firstName),
          },
          {
            target: 'invalid.lastName',
            cond: (_, event: TypeLastNameEvent) =>
              !isValidLastName(event.lastName),
          },
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
            target: 'duplicateCredentials',
            cond: (_, event) =>
              isValidFirstName(event.firstName) &&
              isValidLastName(event.lastName) &&
              isValidPassword(event.password) &&
              users.some(user => user.username === event.username),
          },
          {
            target: 'valid',
            cond: (_, event) =>
              isValidFirstName(event.firstName) &&
              isValidLastName(event.lastName) &&
              isValidUsername(event.username) &&
              isValidPassword(event.password),
          },
        ],
      },
    },
    invalid: {
      states: {
        firstName: {},
        lastName: {},
        username: {},
        password: {},
      },
    },
    valid: {
      on: {
        SUBMIT: { target: 'success' },
      },
    },
    duplicateCredentials: {
      on: {
        SUBMIT: { target: 'fail' },
      },
    },
    success: {
      type: 'final',
    },
    fail: {
      type: 'final',
    },
  },
};

export default (
  testSuite: Record<string, Function>,
): StateMachine<never, RegisterTestStateSchema, FillEvent> => {
  Object.entries(testSuite).forEach(([state, test]) => {
    const path = `states.${state.replace(/\./g, '.states.')}.meta.test`;
    set(registerTestConfig, path, test);
  });

  return createMachine(registerTestConfig);
};
