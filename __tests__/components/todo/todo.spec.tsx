import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import Todo from 'components/todo';
import React from 'react';
import server from 'utils/test-server';
import { respondWithServiceUnavailable } from 'utils/test-server/handlers/handle-with-error';

describe('<Todo />', () => {
  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  it('should render', () => {
    expect(render(<Todo />)).toBeDefined();
  });

  it('should show error message', async () => {
    server.use(respondWithServiceUnavailable('/api/todos', 'get')); // Make the request fails due a DB connection error
    render(<Todo />);

    await expect(screen.findByRole('alert')).resolves.toHaveTextContent(
      'Database connection error',
    ); // Check the error message is showed
  });

  it('should list the todos', async () => {
    render(<Todo />);

    await waitForElementToBeRemoved(screen.getByTestId('loading-todos')); // Wait until loader to disappear

    expect(
      screen.getByRole('list', { name: 'List of todo' }).children,
    ).toHaveLength(10); // Check all todos are listed, by default 10
  });
});
