import set from 'lodash.set';
import {
  EventObject,
  MachineConfig,
  StateMachine,
  StateSchema,
  createMachine,
} from 'xstate';

import { users } from '@app/libs/db/users';

export interface RegisterTestStateSchema extends StateSchema<never> {
  states: {
    pristine: Record<string, unknown>;
    invalid: {
      states: {
        firstName: Record<string, unknown>;
        lastName: Record<string, unknown>;
        username: Record<string, unknown>;
        password: Record<string, unknown>;
      };
    };
    valid: Record<string, unknown>;
    duplicateCredentials: Record<string, unknown>;
    success: Record<string, unknown>;
    fail: Record<string, unknown>;
  };
}
interface TypeFirstNameEvent extends EventObject {
  firstName: string;
}
interface TypeLastNameEvent extends EventObject {
  lastName: string;
}
interface TypeUsernameEvent extends EventObject {
  username: string;
}
interface TypePasswordEvent extends EventObject {
  password: string;
}
export interface FillEvent
  extends TypeFirstNameEvent,
    TypeLastNameEvent,
    TypeUsernameEvent,
    TypePasswordEvent {}

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
  testSuite: Record<string, CallableFunction>,
): StateMachine<never, RegisterTestStateSchema, FillEvent> => {
  Object.entries(testSuite).forEach(([state, test]) => {
    const path = `states.${state.replace(/\./g, '.states.')}.meta.test`;
    set(registerTestConfig, path, test);
  });

  return createMachine(registerTestConfig);
};
