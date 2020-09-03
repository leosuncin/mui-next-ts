import set from 'lodash.set';
import {
  MachineConfig,
  StateMachine,
  StateSchema,
  createMachine,
} from 'xstate';

export interface RegisterTestStateSchema extends StateSchema<never> {
  states: {
    pristine: {};
    invalid: {
      states: {
        firstName: {};
        lastName: {};
        email: {};
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
export type TypeEmailEvent = {
  type: string;
  email: string;
};
export type TypePasswordEvent = {
  type: string;
  password: string;
};
export type FillEvent = TypeFirstNameEvent &
  TypeLastNameEvent &
  TypeEmailEvent &
  TypePasswordEvent;

function isValidFirstName(firstName: string): boolean {
  firstName = firstName.includes('{backspace}') ? '' : firstName;
  return typeof firstName === 'string' && firstName.trim().length > 0;
}
function isValidLastName(lastName: string): boolean {
  lastName = lastName.includes('{backspace}') ? '' : lastName;
  return typeof lastName === 'string' && lastName.trim().length > 0;
}
function isValidEmail(email: string): boolean {
  email = email.includes('{backspace}') ? '' : email;
  return (
    typeof email === 'string' &&
    /^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      email,
    )
  );
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
            target: 'invalid.email',
            cond: (_, event: TypeEmailEvent) => !isValidEmail(event.email),
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
              ['admin', 'john_doe', 'jane@doe.me'].includes(event.email),
          },
          {
            target: 'valid',
            cond: (_, event) =>
              isValidFirstName(event.firstName) &&
              isValidLastName(event.lastName) &&
              isValidEmail(event.email) &&
              isValidPassword(event.password),
          },
        ],
      },
    },
    invalid: {
      states: {
        firstName: {},
        lastName: {},
        email: {},
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
