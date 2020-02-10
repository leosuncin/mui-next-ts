import isEmpty from 'validator/lib/isEmpty';
import isLength from 'validator/lib/isLength';
import {
  assign,
  Machine,
  MachineConfig,
  MachineOptions,
  StateSchema,
} from 'xstate';

function validateLogin(username: string, password: string): boolean {
  return isLength(username, { min: 5 }) && isLength(password, { min: 8 });
}

type LoginContext = {
  username: string;
  password: string;
  errorMessage?: string;
  retries: number;
};
interface LoginStateSchema extends StateSchema<LoginContext> {
  states: {
    fill: {
      states: {
        username: {
          states: {
            valid: {};
            invalid: {
              states: {
                empty: {};
                tooShort: {};
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
                incorrect: {};
              };
            };
          };
        };
      };
    };
    send: {};
    successful: {};
    error: {};
    locked: {};
  };
}
type SetUsernameEvent = {
  type: 'SET_USERNAME';
  data: string;
};
type SetPasswordEvent = {
  type: 'SET_PASSWORD';
  data: string;
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
type LoginEvent =
  | SetUsernameEvent
  | SetPasswordEvent
  | SubmitEvent
  | SuccessEvent
  | FailEvent;

const loginConfig: MachineConfig<LoginContext, LoginStateSchema, LoginEvent> = {
  id: 'login',
  initial: 'fill',
  context: {
    username: '',
    password: '',
    retries: 0,
  },
  states: {
    fill: {
      type: 'parallel',
      states: {
        username: {
          initial: 'valid',
          states: {
            valid: {},
            invalid: {
              initial: 'empty',
              states: {
                empty: {},
                tooShort: {},
                incorrect: {},
              },
            },
          },
          on: {
            SET_USERNAME: [
              {
                target: '.invalid.empty',
                actions: 'setUsername',
                cond: 'isUsernameEmpty',
              },
              {
                target: '.invalid.tooShort',
                actions: 'setUsername',
                cond: 'isUsernameShort',
              },
              { target: '.valid', actions: 'setUsername' },
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
                incorrect: {},
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
      entry: assign<LoginContext>(() => ({ errorMessage: null })),
      invoke: {
        src: 'login',
        onDone: 'successful',
        onError: [
          { target: 'locked', cond: 'fail2ban' },
          {
            target: 'fill.username.invalid.incorrect',
            actions: 'incrementRetries',
            cond: 'isUsernameIncorrect',
          },
          {
            target: 'fill.password.invalid.incorrect',
            actions: 'incrementRetries',
            cond: 'isPasswordIncorrect',
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
    locked: {
      type: 'final',
      entry: assign<LoginContext>(() => ({
        errorMessage: 'Too many failed attempts',
      })),
    },
  },
};
const loginOptions: Partial<MachineOptions<LoginContext, LoginEvent>> = {
  actions: {
    setUsername: assign<LoginContext, LoginEvent>({
      username: (context, event: SetUsernameEvent) => event.data,
    }),
    setPassword: assign<LoginContext, LoginEvent>({
      password: (context, event: SetPasswordEvent) => event.data,
    }),
    setError: assign<LoginContext, LoginEvent>({
      errorMessage: (context, event: FailEvent) => event.data.message,
    }),
    incrementRetries: assign<LoginContext>({
      retries: context => context.retries + 1,
    }),
  },
  guards: {
    isUsernameEmpty(context, event: SetUsernameEvent) {
      return isEmpty(event.data);
    },
    isUsernameShort(context, event: SetUsernameEvent) {
      return !isLength(event.data, { min: 5 });
    },
    isPasswordEmpty(context, event: SetPasswordEvent) {
      return isEmpty(event.data);
    },
    isPasswordShort(context, event: SetPasswordEvent) {
      return !isLength(event.data, { min: 8 });
    },
    validPayload({ username, password }) {
      return validateLogin(username, password);
    },
    fail2ban(context) {
      return context.retries >= 3;
    },
    isUsernameIncorrect(context, event: FailEvent) {
      return /any user/i.test(event.data.message);
    },
    isPasswordIncorrect(context, event: FailEvent) {
      return /Wrong password/i.test(event.data.message);
    },
  },
};

export default Machine(loginConfig, loginOptions);
