import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm, { validations } from 'components/forms/register';
import React from 'react';

jest.mock('next/link', () => ({ children, href }) =>
  React.cloneElement(React.Children.only(children), { href }),
);

describe('<RegisterForm />', () => {
  it('should render', () => {
    expect(render(<RegisterForm onSubmit={jest.fn as any} />)).toBeDefined();
  });

  it('should require the fields', async () => {
    render(<RegisterForm onSubmit={jest.fn as any} />);

    await act(async () => {
      fireEvent.submit(screen.getByTitle('register form'));
    });

    expect(
      screen.getByText(validations.firstName.required),
    ).toBeInTheDocument();
    expect(screen.getByText(validations.lastName.required)).toBeInTheDocument();
    expect(screen.getByText(validations.username.required)).toBeInTheDocument();
    expect(screen.getByText(validations.password.required)).toBeInTheDocument();
  });

  it('should submit the form', async () => {
    const handleSubmit = jest.fn();
    render(<RegisterForm onSubmit={handleSubmit} />);

    userEvent.type(screen.getByLabelText(/First name/i), 'Joe');
    userEvent.type(screen.getByLabelText(/Last name/i), 'Doe');
    userEvent.type(screen.getByLabelText(/Username/i), 'joe_doe');
    userEvent.type(screen.getByLabelText(/Password/i), 'Pa$$w0rd!');
    await act(async () => {
      fireEvent.submit(screen.getByTitle('register form'));
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
