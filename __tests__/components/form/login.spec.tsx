import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm, { validations } from 'components/forms/login';
import React from 'react';

jest.mock('next/link', () => ({ children, href }) =>
  React.cloneElement(React.Children.only(children), { href }),
);

describe('<LoginForm />', () => {
  const usernameLabel = /Username/i;
  const passwordLabel = /Password/i;
  const formTitle = 'login form';

  it('should render', () => {
    expect(render(<LoginForm onSubmit={jest.fn} />)).toBeDefined();
  });

  it('should require the fields', async () => {
    render(<LoginForm onSubmit={jest.fn} />);

    await act(async () => {
      fireEvent.submit(screen.getByTitle(formTitle));
    });

    expect(screen.getByText(validations.username.required)).toBeInTheDocument();
    expect(screen.getByText(validations.password.required)).toBeInTheDocument();
  });

  it('should validate the length of fields', async () => {
    render(<LoginForm onSubmit={jest.fn} />);

    userEvent.type(screen.getByLabelText(usernameLabel), 'user');
    userEvent.type(screen.getByLabelText(passwordLabel), 'pwd');
    await act(async () => {
      fireEvent.submit(screen.getByTitle(formTitle));
    });

    expect(
      screen.getByText(validations.username.minLength.message),
    ).toBeInTheDocument();
    expect(
      screen.getByText(validations.password.minLength.message),
    ).toBeInTheDocument();
  });

  it('should show error message', async () => {
    const handleSubmit = jest.fn(() => {
      throw new Error('Wrong password');
    });
    render(<LoginForm onSubmit={handleSubmit} />);

    userEvent.type(screen.getByLabelText(usernameLabel), 'admin');
    userEvent.type(screen.getByLabelText(passwordLabel), 'ji32k7au4a83');
    fireEvent.submit(screen.getByTitle(formTitle));
    await expect(
      screen.findByText(/Wrong password/),
    ).resolves.toBeInTheDocument();
  });

  it('should lock the form after three failed attempts', async () => {
    const handleSubmit = jest.fn(() => {
      throw new Error('Wrong password');
    });
    render(<LoginForm onSubmit={handleSubmit} />);

    userEvent.type(screen.getByLabelText(usernameLabel), 'admin');
    userEvent.type(screen.getByLabelText(passwordLabel), 'ji32k7au4a83');
    await act(async () => {
      fireEvent.submit(screen.getByTitle(formTitle));
    });
    await act(async () => {
      fireEvent.submit(screen.getByTitle(formTitle));
    });
    await act(async () => {
      fireEvent.submit(screen.getByTitle(formTitle));
    });
    await expect(
      screen.findByText(/Too many failed attempts/),
    ).resolves.toBeInTheDocument();

    expect(screen.getByLabelText(usernameLabel)).toBeDisabled();
    expect(screen.getByLabelText(passwordLabel)).toBeDisabled();
  });

  it('should submit the form', async () => {
    const handleSubmit = jest.fn();
    render(<LoginForm onSubmit={handleSubmit} />);

    userEvent.type(screen.getByLabelText(usernameLabel), 'admin');
    userEvent.type(screen.getByLabelText(passwordLabel), 'Pa$$w0rd!');
    await act(async () => {
      fireEvent.submit(screen.getByTitle(formTitle));
    });

    expect(handleSubmit).toHaveBeenCalledWith({
      username: 'admin',
      password: 'Pa$$w0rd!',
    });
  });
});
