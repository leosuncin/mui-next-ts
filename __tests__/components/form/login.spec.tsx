import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import LoginForm, { validations } from '@app/components/forms/login';

jest.mock(
  'next/link',
  () =>
    ({ children, href }) =>
      React.cloneElement(React.Children.only(children), { href }),
);

describe('<LoginForm />', () => {
  const usernameLabel = /Username/i;
  const passwordLabel = /Password/i;

  it('should render', () => {
    expect(render(<LoginForm onSubmit={jest.fn} />)).toBeDefined();
  });

  it('should require the fields', async () => {
    render(<LoginForm onSubmit={jest.fn} />);

    userEvent.click(screen.getByRole('button'));

    await expect(
      screen.findByText(validations.username.required),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(validations.password.required),
    ).resolves.toBeInTheDocument();
  });

  it('should validate the length of fields', async () => {
    render(<LoginForm onSubmit={jest.fn} />);

    userEvent.type(screen.getByLabelText(usernameLabel), 'user');
    userEvent.type(screen.getByLabelText(passwordLabel), 'pwd');
    userEvent.click(screen.getByRole('button'));

    await expect(
      screen.findByText(validations.username.minLength.message),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(validations.password.minLength.message),
    ).resolves.toBeInTheDocument();
  });

  it('should show error message', async () => {
    const handleSubmit = jest.fn(() => {
      throw new Error('Wrong password');
    });
    render(<LoginForm onSubmit={handleSubmit} />);

    userEvent.type(screen.getByLabelText(usernameLabel), 'admin');
    userEvent.type(screen.getByLabelText(passwordLabel), 'ji32k7au4a83');
    userEvent.click(screen.getByRole('button'));

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
    userEvent.click(screen.getByRole('button'));
    await waitForElementToBeRemoved(screen.getByRole('progressbar'));

    userEvent.click(screen.getByRole('button'));
    await waitForElementToBeRemoved(screen.getByRole('progressbar'));

    userEvent.click(screen.getByRole('button'));
    await waitForElementToBeRemoved(screen.getByRole('progressbar'));

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
    userEvent.click(screen.getByRole('button'));
    await waitForElementToBeRemoved(screen.getByRole('progressbar'));

    expect(handleSubmit).toHaveBeenCalledWith({
      username: 'admin',
      password: 'Pa$$w0rd!',
    });
  });
});
