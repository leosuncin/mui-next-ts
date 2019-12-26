import validate from 'libs/validate';

describe('validate', () => {
  const username = 'john_doe';
  const password = 'password';

  it('should require the username and password', () => {
    expect(validate({})).toMatchInlineSnapshot(`
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
    expect(validate({ password })).toMatchInlineSnapshot(`
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
    expect(validate({ username })).toMatchInlineSnapshot(`
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
    expect(validate({ username: 'user', password: 'qwerty' }))
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
    expect(validate({ username: true, password: 123456 }))
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
