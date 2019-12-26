import { isNullOrUndefined, isString } from 'util';

type BodyType = {
  username?: any;
  password?: any;
};
/**
 * Mock class-validatpr
 */
export default function validate(body: BodyType) {
  const constraint = (property: string, value: any, length: number) => {
    const constraints = {};
    let valid = true;

    if (isNullOrUndefined(value)) {
      valid = false;
      constraints['isDefined'] = `${property} should not be null or undefined`;
    }
    if (!isString(value)) {
      valid = false;
      constraints['isString'] = `${property} must be a string`;
    }
    if (!isString(value) || (isString(value) && value.length < length)) {
      valid = false;
      constraints[
        'minLength'
      ] = `${property} must be longer than or equal to ${length} characters`;
    }

    return valid
      ? false
      : {
          value,
          property,
          children: [],
          constraints,
        };
  };

  const usernameConstraints = constraint('username', body.username, 5);
  const passwordConstraints = constraint('password', body.password, 8);
  let messages = [];
  if (usernameConstraints) {
    messages.push(usernameConstraints);
  }
  if (passwordConstraints) {
    messages.push(passwordConstraints);
  }

  return messages;
}
