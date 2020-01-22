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

export const address1 = {
  required: 'Address line 1 should not be empty',
};

export const city = {
  required: 'City should not be empty',
};

export const zip = {
  required: 'Zip / Postal code should not be empty',
};

export const country = {
  required: 'Country should not be empty',
};

export const cardName = {
  required: 'Card on name should not be empty',
};

export const cardNumber = {
  required: 'Card number should not be empty',
  pattern: {
    value: /((3(4[0-9]{2}|7[0-9]{2})( |-|)[0-9]{6}( |-|)[0-9]{5}))|((3(7[0-9]{2}|7[0-9]{2})( |-|)[0-9]{4}( |-|)[0-9]{4}( |-|)[0-9]{4}))|((4[0-9]{3}( |-|)([0-9]{4})( |-|)([0-9]{4})( |-|)([0-9]{4})))|((5[0-9]{3}( |-|)([0-9]{4})( |-|)([0-9]{4})( |-|)([0-9]{4})))/,
    message: 'Card number is invalid',
  },
};

export const expDate = {
  required: 'Expiry date should not be empty',
  pattern: {
    value: /\d{2}\/\d{2,4}/,
    message: 'Expiry date is invalid',
  },
};

export const cvv = {
  required: 'CVV should not be empty',
  pattern: {
    value: /\d{3}/,
    message: 'CVV is invalid',
  },
};
