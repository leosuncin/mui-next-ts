import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import RegisterForm, { validations } from 'src/components/forms/register';

jest.mock(
  'next/link',
  () =>
    ({ children, href }) =>
      React.cloneElement(React.Children.only(children), { href }),
);

describe('<RegisterForm />', () => {
  it('should render', () => {
    expect(render(<RegisterForm onSubmit={jest.fn()} />)).toBeDefined();
  });

  it('should require the fields', async () => {
    render(<RegisterForm onSubmit={jest.fn()} />);

    userEvent.click(screen.getByRole('button'));

    await expect(
      screen.findByText(validations.firstName.required),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(validations.lastName.required),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(validations.username.required),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(validations.password.required),
    ).resolves.toBeInTheDocument();
  });

  it('should submit the form', async () => {
    const handleSubmit = jest.fn();
    render(<RegisterForm onSubmit={handleSubmit} />);

    userEvent.type(screen.getByLabelText(/First name/i), 'Joe');
    userEvent.type(screen.getByLabelText(/Last name/i), 'Doe');
    userEvent.type(screen.getByLabelText(/Username/i), 'joe_doe');
    userEvent.type(screen.getByLabelText(/Password/i), 'Pa$$w0rd!');
    userEvent.click(screen.getByRole('button'));

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

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
