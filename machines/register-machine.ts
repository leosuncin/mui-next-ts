import isEmail from 'validator/lib/isEmail';
import isEmpty from 'validator/lib/isEmpty';
import isLength from 'validator/lib/isLength';
import {
  Machine,
  MachineConfig,
  MachineOptions,
  StateSchema,
  assign,
} from 'xstate';

type RegisterContext = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  errorMessage?: string;
};
interface RegisterStateSchema extends StateSchema<RegisterContext> {
  states: {
    fill: {
      states: {
        firstName: {
          states: {
            valid: {};
            invalid: {
              states: {
                empty: {};
                tooShort: {};
              };
            };
          };
        };
        lastName: {
          states: {
            valid: {};
            invalid: {
              states: {
                empty: {};
                tooShort: {};
              };
            };
          };
        };
        email: {
          states: {
            valid: {};
            invalid: {
              states: {
                empty: {};
                tooShort: {};
                format: {};
                incorrect: {};
              };
            };
          };
        };
        password: {
          states: {
            valid: {};
            invalid: {
              states: {
                empty: {};
                tooShort: {};
                insecure: {};
              };
            };
          };
        };
      };
    };
    send: {};
    successful: {};
    error: {};
  };
}
type SetFirstNameEvent = {
  type: 'SET_FIRST_NAME';
  firstName: string;
};
type SetLastNameEvent = {
  type: 'SET_LAST_NAME';
  lastName: string;
};
type SetEmailEvent = {
  type: 'SET_EMAIL';
  email: string;
};
type SetPasswordEvent = {
  type: 'SET_PASSWORD';
  password: string;
};
type SubmitEvent = {
  type: 'SUBMIT';
};
type SuccessEvent = {
  type: string;
  data: any;
};
type FailEvent = {
  type: string;
  data: Error;
};
type RegisterEvent =
  | SetFirstNameEvent
  | SetLastNameEvent
  | SetEmailEvent
  | SetPasswordEvent
  | SubmitEvent
  | SuccessEvent
  | FailEvent;

const registerConfig: MachineConfig<
  RegisterContext,
  RegisterStateSchema,
  RegisterEvent
> = {
  id: 'register',
  initial: 'fill',
  context: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  },
  states: {
    fill: {
      type: 'parallel',
      states: {
        firstName: {
          initial: 'valid',
          states: {
            valid: {},
            invalid: {
              initial: 'empty',
              states: {
                empty: {},
                tooShort: {},
              },
            },
          },
          on: {
            SET_FIRST_NAME: [
              {
                target: '.invalid.empty',
                actions: 'setFirstName',
                cond: 'isFirstNameEmpty',
              },
              {
                target: '.invalid.tooShort',
                actions: 'setFirstName',
                cond: 'isFirstNameShort',
              },
              { target: '.valid', actions: 'setFirstName' },
            ],
          },
        },
        lastName: {
          initial: 'valid',
          states: {
            valid: {},
            invalid: {
              initial: 'empty',
              states: {
                empty: {},
                tooShort: {},
              },
            },
          },
          on: {
            SET_LAST_NAME: [
              {
                target: '.invalid.empty',
                actions: 'setLastName',
                cond: 'isLastNameEmpty',
              },
              {
                target: '.invalid.tooShort',
                actions: 'setLastName',
                cond: 'isLastNameShort',
              },
              { target: '.valid', actions: 'setLastName' },
            ],
          },
        },
        email: {
          initial: 'valid',
          states: {
            valid: {},
            invalid: {
              initial: 'empty',
              states: {
                empty: {},
                tooShort: {},
                format: {},
                incorrect: {},
              },
            },
          },
          on: {
            SET_EMAIL: [
              {
                target: '.invalid.empty',
                actions: 'setEmail',
                cond: 'isEmailEmpty',
              },
              {
                target: '.invalid.tooShort',
                actions: 'setEmail',
                cond: 'isEmailShort',
              },
              {
                target: '.invalid.format',
                actions: 'setEmail',
                cond: 'isEmailFormat',
              },
              { target: '.valid', actions: 'setEmail' },
            ],
          },
        },
        password: {
          initial: 'valid',
          states: {
            valid: {},
            invalid: {
              initial: 'empty',
              states: {
                empty: {},
                tooShort: {},
                insecure: {},
              },
            },
          },
          on: {
            SET_PASSWORD: [
              {
                target: '.invalid.empty',
                actions: 'setPassword',
                cond: 'isPasswordEmpty',
              },
              {
                target: '.invalid.tooShort',
                actions: 'setPassword',
                cond: 'isPasswordShort',
              },
              { target: '.valid', actions: 'setPassword' },
            ],
          },
        },
      },
      on: {
        SUBMIT: [
          {
            target: 'send',
            cond: 'validPayload',
          },
        ],
      },
    },
    send: {
      entry: assign<RegisterContext>(() => ({ errorMessage: null })),
      invoke: {
        src: 'register',
        onDone: 'successful',
        onError: [
          {
            target: 'fill.email.invalid.incorrect',
            cond: 'isEmailIncorrect',
          },
          {
            target: 'fill.password.invalid.insecure',
            cond: 'isPasswordInsecure',
          },
          { target: 'error', actions: 'setError' },
        ],
      },
    },
    successful: {
      type: 'final',
    },
    error: {
      after: {
        1000: { target: 'fill' },
      },
    },
  },
};
const registerOptions: Partial<MachineOptions<
  RegisterContext,
  RegisterEvent
>> = {
  actions: {
    setFirstName: assign<RegisterContext, RegisterEvent>({
      firstName: (context, event: SetFirstNameEvent) => event.firstName,
    }),
    setLastName: assign<RegisterContext, RegisterEvent>({
      lastName: (context, event: SetLastNameEvent) => event.lastName,
    }),
    setEmail: assign<RegisterContext, RegisterEvent>({
      email: (context, event: SetEmailEvent) => event.email,
    }),
    setPassword: assign<RegisterContext, RegisterEvent>({
      password: (context, event: SetPasswordEvent) => event.password,
    }),
    setError: assign<RegisterContext, RegisterEvent>({
      errorMessage: (context, event: FailEvent) => event.data.message,
    }),
  },
  guards: {
    isFirstNameEmpty(context, event: SetFirstNameEvent) {
      return isEmpty(event.firstName, { ignore_whitespace: true });
    },
    isFirstNameShort(context, event: SetFirstNameEvent) {
      return !isLength(event.firstName, { min: 2 });
    },
    isLastNameEmpty(context, event: SetLastNameEvent) {
      return isEmpty(event.lastName, { ignore_whitespace: true });
    },
    isLastNameShort(context, event: SetLastNameEvent) {
      return !isLength(event.lastName, { min: 2 });
    },
    isEmailEmpty(context, event: SetEmailEvent) {
      return isEmpty(event.email, { ignore_whitespace: true });
    },
    isEmailShort(context, event: SetEmailEvent) {
      return !isLength(event.email, { min: 3 });
    },
    isEmailFormat(context, event: SetEmailEvent) {
      return !isEmail(event.email);
    },
    isPasswordEmpty(context, event: SetPasswordEvent) {
      return isEmpty(event.password, { ignore_whitespace: true });
    },
    isPasswordShort(context, event: SetPasswordEvent) {
      return !isLength(event.password, { min: 8 });
    },
    validPayload({ firstName, lastName, email, password }) {
      return (
        isLength(firstName, { min: 2 }) &&
        isLength(lastName, { min: 2 }) &&
        isEmail(email) &&
        isLength(password, { min: 8 })
      );
    },
    isEmailIncorrect(context, event: FailEvent) {
      return /email/i.test(event.data.message);
    },
    isPasswordInsecure(context, event: FailEvent) {
      return /password/i.test(event.data.message);
    },
  },
};

export default Machine(registerConfig, registerOptions);
