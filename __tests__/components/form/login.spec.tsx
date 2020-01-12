import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import LoginForm from 'components/forms/login';
import { username, password } from 'validations';

describe('<LoginForm />', () => {
  it('should render', () => {
    expect(render(<LoginForm onSubmit={jest.fn} />)).toBeDefined();
  });

  it('should require the fields', async () => {
    const { getByRole, getByText } = render(<LoginForm onSubmit={jest.fn} />);

    await act(async () => {
      fireEvent.submit(getByRole('form'));
    });

    expect(getByText(username.required)).toBeInTheDocument();
    expect(getByText(password.required)).toBeInTheDocument();
  });

  it('should validate the length of fields', async () => {
    const { getByLabelText, getByRole, getByText } = render(
      <LoginForm onSubmit={jest.fn} />,
    );

    userEvent.type(getByLabelText(/Username/), 'user');
    userEvent.type(getByLabelText(/Password/), 'pwd');
    await act(async () => {
      fireEvent.submit(getByRole('form'));
    });

    expect(getByText(username.minLength.message)).toBeInTheDocument();
    expect(getByText(password.minLength.message)).toBeInTheDocument();
  });

  it('should submit the form', async () => {
    const handleSubmit = jest.fn();
    const { getByLabelText, getByRole } = render(
      <LoginForm onSubmit={handleSubmit} />,
    );

    userEvent.type(getByLabelText(/Username/), 'admin');
    userEvent.type(getByLabelText(/Password/), 'Pa$$w0rd!');
    await act(async () => {
      fireEvent.submit(getByRole('form'));
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      {
        username: 'admin',
        password: 'Pa$$w0rd!',
      },
      expect.anything(),
    );
  });
});
