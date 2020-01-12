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
