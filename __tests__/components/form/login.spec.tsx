import { act, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm, { validations } from 'components/forms/login';
import React from 'react';

describe('<LoginForm />', () => {
  const usernameLabel = /Username/i;
  const passwordLabel = /Password/i;
  const formTitle = 'login form';

  it('should render', () => {
    expect(render(<LoginForm onSubmit={jest.fn} />)).toBeDefined();
  });

  it('should require the fields', async () => {
    const { getByTitle, getByText } = render(<LoginForm onSubmit={jest.fn} />);

    await act(async () => {
      fireEvent.submit(getByTitle(formTitle));
    });

    expect(getByText(validations.username.required)).toBeInTheDocument();
    expect(getByText(validations.password.required)).toBeInTheDocument();
  });

  it('should validate the length of fields', async () => {
    const { getByLabelText, getByTitle, getByText } = render(
      <LoginForm onSubmit={jest.fn} />,
    );

    userEvent.type(getByLabelText(usernameLabel), 'user');
    userEvent.type(getByLabelText(passwordLabel), 'pwd');
    await act(async () => {
      fireEvent.submit(getByTitle(formTitle));
    });

    expect(
      getByText(validations.username.minLength.message),
    ).toBeInTheDocument();
    expect(
      getByText(validations.password.minLength.message),
    ).toBeInTheDocument();
  });

  it('should show error message', async () => {
    const handleSubmit = jest.fn(() => {
      throw new Error('Wrong password');
    });
    const { getByLabelText, getByTitle, findByText } = render(
      <LoginForm onSubmit={handleSubmit} />,
    );

    userEvent.type(getByLabelText(usernameLabel), 'admin');
    userEvent.type(getByLabelText(passwordLabel), 'ji32k7au4a83');
    fireEvent.submit(getByTitle(formTitle));
    await expect(findByText(/Wrong password/)).resolves.toBeInTheDocument();
  });

  it('should lock the form after three failed attempts', async () => {
    const handleSubmit = jest.fn(() => {
      throw new Error('Wrong password');
    });
    const { getByLabelText, getByTitle, findByText } = render(
      <LoginForm onSubmit={handleSubmit} />,
    );

    userEvent.type(getByLabelText(usernameLabel), 'admin');
    userEvent.type(getByLabelText(passwordLabel), 'ji32k7au4a83');
    await act(async () => {
      fireEvent.submit(getByTitle(formTitle));
    });
    await act(async () => {
      fireEvent.submit(getByTitle(formTitle));
    });
    await act(async () => {
      fireEvent.submit(getByTitle(formTitle));
    });
    await expect(
      findByText(/Too many failed attempts/),
    ).resolves.toBeInTheDocument();

    expect(getByLabelText(usernameLabel)).toBeDisabled();
    expect(getByLabelText(passwordLabel)).toBeDisabled();
  });

  it('should submit the form', async () => {
    const handleSubmit = jest.fn();
    const { getByLabelText, getByTitle } = render(
      <LoginForm onSubmit={handleSubmit} />,
    );

    userEvent.type(getByLabelText(usernameLabel), 'admin');
    userEvent.type(getByLabelText(passwordLabel), 'Pa$$w0rd!');
    await act(async () => {
      fireEvent.submit(getByTitle(formTitle));
    });

    expect(handleSubmit).toHaveBeenCalledWith({
      username: 'admin',
      password: 'Pa$$w0rd!',
    });
  });
});
