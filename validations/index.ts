export const username = {
  required: 'Username should not be empty',
  minLength: {
    value: 5,
    message: 'Username too short (at least 5 characters required)',
  },
};

export const password = {
  required: 'Password should not be empty',
  minLength: {
    value: 8,
    message: 'Password too short (at least 8 characters required)',
  },
};

export const firstName = {
  required: 'First name should not be empty',
};

export const lastName = {
  required: 'Last name should not be empty',
};

export const email = {
  required: 'Email should not be empty',
  pattern: {
    value: /^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    message: 'Email is invalid',
  },
};
