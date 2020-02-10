import { act, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm, { validations } from 'components/forms/login';
import React from 'react';

describe('<LoginForm />', () => {
  it('should render', () => {
    expect(render(<LoginForm onSubmit={jest.fn} />)).toBeDefined();
  });

  it('should require the fields', async () => {
    const { getByRole, getByText } = render(<LoginForm onSubmit={jest.fn} />);

    await act(async () => {
      fireEvent.submit(getByRole('form'));
    });

    expect(getByText(validations.username.required)).toBeInTheDocument();
    expect(getByText(validations.password.required)).toBeInTheDocument();
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

    expect(getByText(validations.username.minLength)).toBeInTheDocument();
    expect(getByText(validations.password.minLength)).toBeInTheDocument();
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
