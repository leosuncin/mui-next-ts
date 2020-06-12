import { act, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm, { validations } from 'components/forms/register';
import React from 'react';

describe('<RegisterForm />', () => {
  it('should render', () => {
    expect(render(<RegisterForm onSubmit={jest.fn as any} />)).toBeDefined();
  });

  it('should require the fields', async () => {
    const { getByTitle, getByText } = render(
      <RegisterForm onSubmit={jest.fn as any} />,
    );

    await act(async () => {
      fireEvent.submit(getByTitle('register form'));
    });

    expect(getByText(validations.firstName.required)).toBeInTheDocument();
    expect(getByText(validations.lastName.required)).toBeInTheDocument();
    expect(getByText(validations.username.required)).toBeInTheDocument();
    expect(getByText(validations.password.required)).toBeInTheDocument();
  });

  it('should submit the form', async () => {
    const handleSubmit = jest.fn();
    const { getByLabelText, getByTitle } = render(
      <RegisterForm onSubmit={handleSubmit} />,
    );

    userEvent.type(getByLabelText(/First name/i), 'Joe');
    userEvent.type(getByLabelText(/Last name/i), 'Doe');
    userEvent.type(getByLabelText(/Username/i), 'joe_doe');
    userEvent.type(getByLabelText(/Password/i), 'Pa$$w0rd!');
    await act(async () => {
      fireEvent.submit(getByTitle('register form'));
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      {
        firstName: 'Joe',
        lastName: 'Doe',
        username: 'joe_doe',
        password: 'Pa$$w0rd!',
      },
      expect.anything(),
    );
  });
});
