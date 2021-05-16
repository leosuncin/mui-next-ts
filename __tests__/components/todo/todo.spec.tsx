import {
  render,
  screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import Todo from '@app/components/todo';
import { createTodoBuild, randomArrayElement } from '@app/utils/factories';
import server from '@app/utils/test-server';
import { respondWithServiceUnavailable } from '@app/utils/test-server/handlers/handle-with-error';

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

    screen.getByText(/5 items left/i);
    screen.getByRole('button', { name: /All \(10\)/i });
    screen.getByRole('button', { name: /Active \(5\)/i });
    screen.getByRole('button', { name: /Completed \(5\)/i });

    expect(screen.getAllByRole('listitem')).toHaveLength(10); // Check all todos are listed, by default 10
  });

  it('should create a new todo and add to list', async () => {
    const { text } = createTodoBuild();
    render(<Todo />);

    await waitForElementToBeRemoved(screen.getByTestId('loading-todos')); // Wait until loader to disappear

    userEvent.type(screen.getByRole('textbox', { name: /Text/ }), text); // Typing the new todo
    userEvent.click(screen.getByRole('button', { name: /^Add$/i })); // Submit the form

    await screen.findByTestId('loading-todos'); // Wait until loader appear
    await waitForElementToBeRemoved(screen.queryByTestId('loading-todos')); // Then, wait until loader to disappear

    expect(screen.getByText(text)).toBeInTheDocument(); // Find the new todo in the list
  });

  it('should edit one todo', async () => {
    const { text } = createTodoBuild();
    render(<Todo />);

    await waitForElementToBeRemoved(screen.getByTestId('loading-todos')); // Wait until loader to disappear
    const item = randomArrayElement(screen.getAllByRole('listitem'));

    // Activate the edit state
    userEvent.dblClick(item.querySelector('span + time')); // eslint-disable-line testing-library/no-node-access
    userEvent.clear(screen.getByRole('textbox', { name: /Edit text/i })); // Clear the input
    userEvent.type(
      screen.getByRole('textbox', { name: /Edit text/i }),
      text + '{enter}',
    ); // Type changes and save with Enter

    expect(screen.getByText(text)).toBeInTheDocument(); // Find the change in the list

    await screen.findByTestId('saving-todos'); // Wait until loader appear
    await waitForElementToBeRemoved(screen.queryByTestId('saving-todos')); // Then, wait until loader to disappear
  });

  it('should remove one todo', async () => {
    render(<Todo />);

    await waitForElementToBeRemoved(screen.getByTestId('loading-todos')); // Wait until loader to disappear

    const element = randomArrayElement(screen.getAllByRole('listitem')); // Get one random todo item
    userEvent.click(
      within(element).getByRole('button', { name: /Delete todo/ }),
    ); // Delete it

    expect(element).not.toBeInTheDocument(); // Check not exist anymore
  });

  it('should filter the displayed todos', async () => {
    render(<Todo />);

    await waitForElementToBeRemoved(screen.getByTestId('loading-todos')); // Wait until loader to disappear

    userEvent.click(screen.getByRole('button', { name: /Active \(\d+\)/i })); // Display only active

    expect(screen.getAllByRole('listitem')).toHaveLength(5);

    userEvent.click(screen.getByRole('button', { name: /All \(\d+\)/i })); // Display all

    expect(screen.getAllByRole('listitem')).toHaveLength(10);

    userEvent.click(screen.getByRole('button', { name: /Completed \(\d+\)/i })); // Display only completed

    expect(screen.getAllByRole('listitem')).toHaveLength(5);
  });

  it('should clear the completed ones', async () => {
    render(<Todo />);

    await waitForElementToBeRemoved(screen.getByTestId('loading-todos')); // Wait until loader to disappear

    const clearButton = screen.getByRole('button', {
      name: /Clear completed/i,
    });
    userEvent.click(clearButton);

    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(clearButton).not.toBeInTheDocument();

    screen.getByRole('button', { name: /Completed \(0\)/i });
  });
});
