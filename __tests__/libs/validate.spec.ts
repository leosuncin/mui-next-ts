import { validateLogin, validateRegister } from 'libs/validate';

describe('validate login', () => {
  const username = 'john_doe';
  const password = 'password';

  it('should require the username and password', () => {
    expect(validateLogin({})).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [],
          "constraints": Object {
            "isDefined": "username should not be null or undefined",
            "isString": "username must be a string",
            "minLength": "username must be longer than or equal to 5 characters",
          },
          "property": "username",
          "value": undefined,
        },
        Object {
          "children": Array [],
          "constraints": Object {
            "isDefined": "password should not be null or undefined",
            "isString": "password must be a string",
            "minLength": "password must be longer than or equal to 8 characters",
          },
          "property": "password",
          "value": undefined,
        },
      ]
    `);
  });

  it('should require the username', () => {
    expect(validateLogin({ password })).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [],
          "constraints": Object {
            "isDefined": "username should not be null or undefined",
            "isString": "username must be a string",
            "minLength": "username must be longer than or equal to 5 characters",
          },
          "property": "username",
          "value": undefined,
        },
      ]
    `);
  });

  it('should require the password', () => {
    expect(validateLogin({ username })).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [],
          "constraints": Object {
            "isDefined": "password should not be null or undefined",
            "isString": "password must be a string",
            "minLength": "password must be longer than or equal to 8 characters",
          },
          "property": "password",
          "value": undefined,
        },
      ]
    `);
  });

  it('should validate the username and password length', () => {
    expect(validateLogin({ username: 'user', password: 'qwerty' }))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [],
          "constraints": Object {
            "minLength": "username must be longer than or equal to 5 characters",
          },
          "property": "username",
          "value": "user",
        },
        Object {
          "children": Array [],
          "constraints": Object {
            "minLength": "password must be longer than or equal to 8 characters",
          },
          "property": "password",
          "value": "qwerty",
        },
      ]
    `);
  });

  it('should validate the username and password type', () => {
    expect(validateLogin({ username: true, password: 123456 }))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [],
          "constraints": Object {
            "isString": "username must be a string",
            "minLength": "username must be longer than or equal to 5 characters",
          },
          "property": "username",
          "value": true,
        },
        Object {
          "children": Array [],
          "constraints": Object {
            "isString": "password must be a string",
            "minLength": "password must be longer than or equal to 8 characters",
          },
          "property": "password",
          "value": 123456,
        },
      ]
    `);
  });
});

describe('validate register', () => {
  it('should require all the fields', () => {
    expect(validateRegister({})).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [],
          "constraints": Object {
            "isDefined": "firstName should not be null or undefined",
            "isString": "firstName must be a string",
            "minLength": "firstName must be longer than or equal to 1 characters",
          },
          "property": "firstName",
          "value": undefined,
        },
        Object {
          "children": Array [],
          "constraints": Object {
            "isDefined": "lastName should not be null or undefined",
            "isString": "lastName must be a string",
            "minLength": "lastName must be longer than or equal to 1 characters",
          },
          "property": "lastName",
          "value": undefined,
        },
        Object {
          "children": Array [],
          "constraints": Object {
            "isDefined": "email should not be null or undefined",
            "isEmail": "email must be an email",
            "isString": "email must be a string",
            "minLength": "email must be longer than or equal to 1 characters",
          },
          "property": "email",
          "value": undefined,
        },
        Object {
          "children": Array [],
          "constraints": Object {
            "isDefined": "password should not be null or undefined",
            "isString": "password must be a string",
            "minLength": "password must be longer than or equal to 8 characters",
          },
          "property": "password",
          "value": undefined,
        },
      ]
    `);
  });
});
