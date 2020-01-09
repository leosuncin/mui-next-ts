import { isNullOrUndefined, isString } from 'util';
import { AuthLogin } from 'services/login';
import { AuthRegister } from 'services/register';

type PartialOf<T> = Partial<Record<keyof T, any>>;

const isEmail = value =>
  /^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
    value,
  );
export function constraint(
  property: string,
  value: any,
  length: number,
  email = false,
) {
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
  if (email && !isEmail(value)) {
    valid = false;
    constraints['isEmail'] = `${property} must be an email`;
  }

  return valid
    ? false
    : {
        value,
        property,
        children: [],
        constraints,
      };
}
/**
 * Mock class-validatpr
 */
export function validateLogin(body: PartialOf<AuthLogin>) {
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
export function validateRegister(body: PartialOf<AuthRegister>) {
  const firstNameConstraints = constraint('firstName', body.firstName, 1);
  const lastNameConstraints = constraint('lastName', body.lastName, 1);
  const emailConstraints = constraint('email', body.email, 1, true);
  const passwordConstraints = constraint('password', body.password, 8);
  let messages = [];

  if (firstNameConstraints) {
    messages.push(firstNameConstraints);
  }
  if (lastNameConstraints) {
    messages.push(lastNameConstraints);
  }
  if (emailConstraints) {
    messages.push(emailConstraints);
  }
  if (passwordConstraints) {
    messages.push(passwordConstraints);
  }

  return messages;
}
