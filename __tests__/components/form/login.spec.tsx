import { act, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm, { validations } from 'components/forms/login';
import React from 'react';

describe('<LoginForm />', () => {
  it('should render', () => {
    expect(render(<LoginForm onSubmit={jest.fn} />)).toBeDefined();
  });

  it('should require the fields', async () => {
    const { getByTitle, getByText } = render(<LoginForm onSubmit={jest.fn} />);

    await act(async () => {
      fireEvent.submit(getByTitle('login form'));
    });

    expect(getByText(validations.username.required)).toBeInTheDocument();
    expect(getByText(validations.password.required)).toBeInTheDocument();
  });

  it('should validate the length of fields', async () => {
    const { getByLabelText, getByTitle, getByText } = render(
      <LoginForm onSubmit={jest.fn} />,
    );

    userEvent.type(getByLabelText(/Username/), 'user');
    userEvent.type(getByLabelText(/Password/), 'pwd');
    await act(async () => {
      fireEvent.submit(getByTitle('login form'));
    });

    expect(
      getByText(validations.username.minLength.message),
    ).toBeInTheDocument();
    expect(
      getByText(validations.password.minLength.message),
    ).toBeInTheDocument();
  });

  it('should submit the form', async () => {
    const handleSubmit = jest.fn();
    const { getByLabelText, getByTitle } = render(
      <LoginForm onSubmit={handleSubmit} />,
    );

    userEvent.type(getByLabelText(/Username/), 'admin');
    userEvent.type(getByLabelText(/Password/), 'Pa$$w0rd!');
    await act(async () => {
      fireEvent.submit(getByTitle('login form'));
    });

    expect(handleSubmit).toHaveBeenCalledWith({
      username: 'admin',
      password: 'Pa$$w0rd!',
    });
  });
});
