import { TodoEvent, TodoState, todoReducer } from 'hooks/use-todo';

describe('useTodo Hook', () => {
  describe('reducer', () => {
    it('should return the state by default', () => {
      expect(
        todoReducer(undefined, {} as TodoEvent, jest.fn() as any),
      ).toStrictEqual({
        all: [],
        completed: [],
        active: [],
        loading: false,
        _filter: 'all',
      });
    });

    it('should handle FETCH_TODOS event', () => {
      const prevState: TodoState = {
        all: [],
        completed: [],
        active: [],
        loading: false,
        _filter: 'all',
      };
      const mockExec = jest.fn();

      expect(todoReducer(prevState, { type: 'FETCH_TODOS' }, mockExec as any))
        .toMatchInlineSnapshot(`
        Object {
          "_filter": "all",
          "active": Array [],
          "all": Array [],
          "completed": Array [],
          "loading": true,
        }
      `);
      expect(mockExec).toHaveBeenCalledWith({ type: 'fetchTodos' });
    });

    it('should handle TODOS_FETCHED event', () => {
      const prevState: TodoState = {
        _filter: 'all',
        active: [],
        all: [],
        completed: [],
        loading: true,
      };
      const event: TodoEvent = {
        type: 'TODOS_FETCHED',
        payload: [
          {
            id: '0f81d175-11b8-40d4-82da-b74e7ffbd2a4',
            text: 'Absence makes the heart grow fonder -- of somebody else.',
            done: false,
            createdAt: '2020-06-08T16:00:00.000Z',
            updatedAt: '2020-06-08T16:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '3b3a687a-3be9-4ad7-ab32-8dd2a89b85a8',
            text:
              'This life is a test. Had this been an actual life, you would have received further instructions as to what to do and where to go.',
            done: true,
            createdAt: '2020-06-09T15:00:00.000Z',
            updatedAt: '2020-06-09T15:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '74817834-8cdc-4c52-9e60-6a3916c8640a',
            text: 'War is peace.  Freedom is slavery.  Ketchup is a vegetable.',
            done: false,
            createdAt: '2020-06-10T01:00:00.000Z',
            updatedAt: '2020-06-10T01:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '33d31700-e451-4ff8-932a-b824ea7f3aaa',
            text:
              'They are ill discoverers that think there is no land, when they can see nothing but sea.',
            done: true,
            createdAt: '2020-06-10T01:00:00.000Z',
            updatedAt: '2020-06-10T01:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '68a552ea-b3d8-4af5-9bce-fb73e6870296',
            text: 'Never do today what you can put off until tomorrow.',
            done: false,
            createdAt: '2020-06-11T13:00:00.000Z',
            updatedAt: '2020-06-11T13:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '86a0e075-c3e5-4089-ba9d-9875197fcaa5',
            text:
              'Logic is a systematic method of coming to the wrong conclusion with confidence.',
            done: true,
            createdAt: '2020-06-11T17:00:00.000Z',
            updatedAt: '2020-06-11T17:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '2d701533-91f3-4f05-8923-f30559d6ffc9',
            text:
              'The average, healthy, well-adjusted adult gets up at seven-thirty in the morning feeling just terrible.',
            done: true,
            createdAt: '2020-06-12T21:00:00.000Z',
            updatedAt: '2020-06-12T21:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '596ca525-6910-4633-88c9-f9a9b27071ae',
            text: 'I often quote myself; it adds spice to my conversation.',
            done: false,
            createdAt: '2020-06-12T22:00:00.000Z',
            updatedAt: '2020-06-12T22:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '1adc286a-7ac2-48c4-9ef1-aae9b9f502b2',
            text:
              'Experiments must be reproducible; they should all fail in the same way.',
            done: true,
            createdAt: '2020-06-13T17:00:00.000Z',
            updatedAt: '2020-06-13T17:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: 'ac41212a-ea2f-4959-9800-d1d42f1afee4',
            text: "We've upped our standards, so up yours!",
            done: false,
            createdAt: '2020-06-13T18:00:00.000Z',
            updatedAt: '2020-06-13T18:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
        ],
      };

      const nextState = todoReducer(prevState, event, jest.fn() as any);

      expect(nextState.all).toHaveLength(10);
      expect(nextState.active).toHaveLength(5);
      expect(nextState.completed).toHaveLength(5);
      expect(nextState.loading).toBe(false);
    });

    it('should handle ADD_TODO event', () => {
      const prevState: TodoState = {
        _filter: 'all',
        active: [],
        all: [],
        completed: [],
        loading: false,
      };
      const event: TodoEvent = {
        type: 'ADD_TODO',
        payload: { text: 'Conquer the world' },
      };
      const mockExec = jest.fn();

      const nextState = todoReducer(prevState, event, mockExec as any);

      expect(nextState).toHaveProperty('loading', true);
      expect(nextState.error).toBeUndefined();
      expect(mockExec).toHaveBeenCalledWith({
        type: 'addTodo',
        payload: { text: 'Conquer the world' },
      });
    });

    it('should handle TODO_SAVED event', () => {
      const prevState: TodoState = {
        _filter: 'all',
        active: [],
        all: [],
        completed: [],
        loading: true,
      };
      const event: TodoEvent = {
        type: 'TODO_SAVED',
        payload: {
          id: 'a4a28db9-9034-4eb3-98d5-572f9ed2f8e7',
          text: 'Conquer the world',
          done: false,
          createdAt: '2020-09-12T17:00:00.000Z',
          updatedAt: '2020-09-12T17:00:00.000Z',
          createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
        },
      };

      const nextState = todoReducer(prevState, event, jest.fn() as any);

      expect(nextState).toHaveProperty('loading', false);
      expect(nextState.all).toStrictEqual([event.payload]);
      expect(nextState.active).toStrictEqual([event.payload]);
    });

    it('should handle EDIT_TODO event', () => {
      const prevState: TodoState = {
        _filter: 'all',
        all: [
          {
            id: '0f81d175-11b8-40d4-82da-b74e7ffbd2a4',
            text: 'Absence makes the heart grow fonder -- of somebody else.',
            done: false,
            createdAt: '2020-06-08T16:00:00.000Z',
            updatedAt: '2020-06-08T16:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '3b3a687a-3be9-4ad7-ab32-8dd2a89b85a8',
            text:
              'This life is a test. Had this been an actual life, you would have received further instructions as to what to do and where to go.',
            done: true,
            createdAt: '2020-06-09T15:00:00.000Z',
            updatedAt: '2020-06-09T15:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '74817834-8cdc-4c52-9e60-6a3916c8640a',
            text: 'War is peace.  Freedom is slavery.  Ketchup is a vegetable.',
            done: false,
            createdAt: '2020-06-10T01:00:00.000Z',
            updatedAt: '2020-06-10T01:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '68a552ea-b3d8-4af5-9bce-fb73e6870296',
            text: 'Never do today what you can put off until tomorrow.',
            done: false,
            createdAt: '2020-06-11T13:00:00.000Z',
            updatedAt: '2020-06-11T13:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '2d701533-91f3-4f05-8923-f30559d6ffc9',
            text:
              'The average, healthy, well-adjusted adult gets up at seven-thirty in the morning feeling just terrible.',
            done: true,
            createdAt: '2020-06-12T21:00:00.000Z',
            updatedAt: '2020-06-12T21:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '1adc286a-7ac2-48c4-9ef1-aae9b9f502b2',
            text:
              'Experiments must be reproducible; they should all fail in the same way.',
            done: true,
            createdAt: '2020-06-13T17:00:00.000Z',
            updatedAt: '2020-06-13T17:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
        ],
        active: [
          {
            id: '0f81d175-11b8-40d4-82da-b74e7ffbd2a4',
            text: 'Absence makes the heart grow fonder -- of somebody else.',
            done: false,
            createdAt: '2020-06-08T16:00:00.000Z',
            updatedAt: '2020-06-08T16:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '74817834-8cdc-4c52-9e60-6a3916c8640a',
            text: 'War is peace.  Freedom is slavery.  Ketchup is a vegetable.',
            done: false,
            createdAt: '2020-06-10T01:00:00.000Z',
            updatedAt: '2020-06-10T01:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '68a552ea-b3d8-4af5-9bce-fb73e6870296',
            text: 'Never do today what you can put off until tomorrow.',
            done: false,
            createdAt: '2020-06-11T13:00:00.000Z',
            updatedAt: '2020-06-11T13:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
        ],
        completed: [
          {
            id: '3b3a687a-3be9-4ad7-ab32-8dd2a89b85a8',
            text:
              'This life is a test. Had this been an actual life, you would have received further instructions as to what to do and where to go.',
            done: true,
            createdAt: '2020-06-09T15:00:00.000Z',
            updatedAt: '2020-06-09T15:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '2d701533-91f3-4f05-8923-f30559d6ffc9',
            text:
              'The average, healthy, well-adjusted adult gets up at seven-thirty in the morning feeling just terrible.',
            done: true,
            createdAt: '2020-06-12T21:00:00.000Z',
            updatedAt: '2020-06-12T21:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '1adc286a-7ac2-48c4-9ef1-aae9b9f502b2',
            text:
              'Experiments must be reproducible; they should all fail in the same way.',
            done: true,
            createdAt: '2020-06-13T17:00:00.000Z',
            updatedAt: '2020-06-13T17:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
        ],
        loading: false,
      };
      const event: TodoEvent = {
        type: 'EDIT_TODO',
        payload: {
          id: '68a552ea-b3d8-4af5-9bce-fb73e6870296',
          body: {
            done: true,
            text: 'Do every night: Try to take over the world',
          },
        },
      };
      const mockExec = jest.fn();

      const nextState = todoReducer(prevState, event, mockExec as any);

      expect(mockExec).toHaveBeenCalledWith({
        type: 'editTodo',
        payload: {
          id: '68a552ea-b3d8-4af5-9bce-fb73e6870296',
          body: {
            done: true,
            text: 'Do every night: Try to take over the world',
          },
        },
      });
      expect(nextState.all).toHaveLength(6);
      expect(nextState.active).toHaveLength(2);
      expect(nextState.completed).toHaveLength(4);
      expect(nextState.all[3]).toHaveProperty('done', true);
    });

    it('should handle TODO_CHANGED event', () => {
      const prevState: TodoState = {
        _filter: 'all',
        all: [
          {
            id: '0f81d175-11b8-40d4-82da-b74e7ffbd2a4',
            text: 'Absence makes the heart grow fonder -- of somebody else.',
            done: false,
            createdAt: '2020-06-08T16:00:00.000Z',
            updatedAt: '2020-06-08T16:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '3b3a687a-3be9-4ad7-ab32-8dd2a89b85a8',
            text:
              'This life is a test. Had this been an actual life, you would have received further instructions as to what to do and where to go.',
            done: true,
            createdAt: '2020-06-09T15:00:00.000Z',
            updatedAt: '2020-06-09T15:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '74817834-8cdc-4c52-9e60-6a3916c8640a',
            text: 'War is peace.  Freedom is slavery.  Ketchup is a vegetable.',
            done: false,
            createdAt: '2020-06-10T01:00:00.000Z',
            updatedAt: '2020-06-10T01:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '68a552ea-b3d8-4af5-9bce-fb73e6870296',
            text: 'Do every night: Try to take over the world',
            done: true,
            createdAt: '2020-06-11T13:00:00.000Z',
            updatedAt: '2020-06-11T15:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '2d701533-91f3-4f05-8923-f30559d6ffc9',
            text:
              'The average, healthy, well-adjusted adult gets up at seven-thirty in the morning feeling just terrible.',
            done: true,
            createdAt: '2020-06-12T21:00:00.000Z',
            updatedAt: '2020-06-12T21:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '1adc286a-7ac2-48c4-9ef1-aae9b9f502b2',
            text:
              'Experiments must be reproducible; they should all fail in the same way.',
            done: true,
            createdAt: '2020-06-13T17:00:00.000Z',
            updatedAt: '2020-06-13T17:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
        ],
        active: [
          {
            id: '0f81d175-11b8-40d4-82da-b74e7ffbd2a4',
            text: 'Absence makes the heart grow fonder -- of somebody else.',
            done: false,
            createdAt: '2020-06-08T16:00:00.000Z',
            updatedAt: '2020-06-08T16:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '74817834-8cdc-4c52-9e60-6a3916c8640a',
            text: 'War is peace.  Freedom is slavery.  Ketchup is a vegetable.',
            done: false,
            createdAt: '2020-06-10T01:00:00.000Z',
            updatedAt: '2020-06-10T01:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
        ],
        completed: [
          {
            id: '3b3a687a-3be9-4ad7-ab32-8dd2a89b85a8',
            text:
              'This life is a test. Had this been an actual life, you would have received further instructions as to what to do and where to go.',
            done: true,
            createdAt: '2020-06-09T15:00:00.000Z',
            updatedAt: '2020-06-09T15:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '68a552ea-b3d8-4af5-9bce-fb73e6870296',
            text: 'Do every night: Try to take over the world',
            done: true,
            createdAt: '2020-06-11T13:00:00.000Z',
            updatedAt: '2020-06-11T15:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '2d701533-91f3-4f05-8923-f30559d6ffc9',
            text:
              'The average, healthy, well-adjusted adult gets up at seven-thirty in the morning feeling just terrible.',
            done: true,
            createdAt: '2020-06-12T21:00:00.000Z',
            updatedAt: '2020-06-12T21:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '1adc286a-7ac2-48c4-9ef1-aae9b9f502b2',
            text:
              'Experiments must be reproducible; they should all fail in the same way.',
            done: true,
            createdAt: '2020-06-13T17:00:00.000Z',
            updatedAt: '2020-06-13T17:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
        ],
        loading: false,
      };
      const event: TodoEvent = {
        type: 'TODO_CHANGED',
        payload: {
          id: '68a552ea-b3d8-4af5-9bce-fb73e6870296',
          text: 'Do every night: Try to take over the world',
          done: true,
          createdAt: '2020-06-11T13:00:00.000Z',
          updatedAt: '2020-06-11T15:00:00.000Z',
          createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
        },
      };

      const nextState = todoReducer(prevState, event, jest.fn() as any);

      expect(nextState.all).toHaveLength(6);
      expect(nextState.active).toHaveLength(2);
      expect(nextState.completed).toHaveLength(4);
    });

    it('should handle TODO_REVERT_CHANGE event', () => {
      const prevState: TodoState = {
        _filter: 'all',
        all: [
          {
            id: '0f81d175-11b8-40d4-82da-b74e7ffbd2a4',
            text: 'Absence makes the heart grow fonder -- of somebody else.',
            done: false,
            createdAt: '2020-06-08T16:00:00.000Z',
            updatedAt: '2020-06-08T16:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '3b3a687a-3be9-4ad7-ab32-8dd2a89b85a8',
            text:
              'This life is a test. Had this been an actual life, you would have received further instructions as to what to do and where to go.',
            done: true,
            createdAt: '2020-06-09T15:00:00.000Z',
            updatedAt: '2020-06-09T15:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '74817834-8cdc-4c52-9e60-6a3916c8640a',
            text: 'War is peace.  Freedom is slavery.  Ketchup is a vegetable.',
            done: false,
            createdAt: '2020-06-10T01:00:00.000Z',
            updatedAt: '2020-06-10T01:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '68a552ea-b3d8-4af5-9bce-fb73e6870296',
            text: 'Do every night: Try to take over the world',
            done: true,
            createdAt: '2020-06-11T13:00:00.000Z',
            updatedAt: '2020-06-11T15:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '2d701533-91f3-4f05-8923-f30559d6ffc9',
            text:
              'The average, healthy, well-adjusted adult gets up at seven-thirty in the morning feeling just terrible.',
            done: true,
            createdAt: '2020-06-12T21:00:00.000Z',
            updatedAt: '2020-06-12T21:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '1adc286a-7ac2-48c4-9ef1-aae9b9f502b2',
            text:
              'Experiments must be reproducible; they should all fail in the same way.',
            done: true,
            createdAt: '2020-06-13T17:00:00.000Z',
            updatedAt: '2020-06-13T17:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
        ],
        active: [
          {
            id: '0f81d175-11b8-40d4-82da-b74e7ffbd2a4',
            text: 'Absence makes the heart grow fonder -- of somebody else.',
            done: false,
            createdAt: '2020-06-08T16:00:00.000Z',
            updatedAt: '2020-06-08T16:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '74817834-8cdc-4c52-9e60-6a3916c8640a',
            text: 'War is peace.  Freedom is slavery.  Ketchup is a vegetable.',
            done: false,
            createdAt: '2020-06-10T01:00:00.000Z',
            updatedAt: '2020-06-10T01:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
        ],
        completed: [
          {
            id: '3b3a687a-3be9-4ad7-ab32-8dd2a89b85a8',
            text:
              'This life is a test. Had this been an actual life, you would have received further instructions as to what to do and where to go.',
            done: true,
            createdAt: '2020-06-09T15:00:00.000Z',
            updatedAt: '2020-06-09T15:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '68a552ea-b3d8-4af5-9bce-fb73e6870296',
            text: 'Do every night: Try to take over the world',
            done: true,
            createdAt: '2020-06-11T13:00:00.000Z',
            updatedAt: '2020-06-11T15:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '2d701533-91f3-4f05-8923-f30559d6ffc9',
            text:
              'The average, healthy, well-adjusted adult gets up at seven-thirty in the morning feeling just terrible.',
            done: true,
            createdAt: '2020-06-12T21:00:00.000Z',
            updatedAt: '2020-06-12T21:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '1adc286a-7ac2-48c4-9ef1-aae9b9f502b2',
            text:
              'Experiments must be reproducible; they should all fail in the same way.',
            done: true,
            createdAt: '2020-06-13T17:00:00.000Z',
            updatedAt: '2020-06-13T17:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
        ],
        loading: false,
        _position: 3,
        _todo: {
          id: '68a552ea-b3d8-4af5-9bce-fb73e6870296',
          text: 'Never do today what you can put off until tomorrow.',
          done: false,
          createdAt: '2020-06-11T13:00:00.000Z',
          updatedAt: '2020-06-11T13:00:00.000Z',
          createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
        },
      };
      const event: TodoEvent = {
        type: 'TODO_REVERT_CHANGE',
        payload: 'Database connection error',
      };

      const nextState = todoReducer(prevState, event, jest.fn() as any);

      expect(nextState).toHaveProperty('error', 'Database connection error');
      expect(nextState._position).toBeUndefined();
      expect(nextState._todo).toBeUndefined();
      expect(nextState.all).toHaveLength(6);
      expect(nextState.active).toHaveLength(3);
      expect(nextState.completed).toHaveLength(3);
      expect(nextState.all[3]).toStrictEqual({
        id: '68a552ea-b3d8-4af5-9bce-fb73e6870296',
        text: 'Never do today what you can put off until tomorrow.',
        done: false,
        createdAt: '2020-06-11T13:00:00.000Z',
        updatedAt: '2020-06-11T13:00:00.000Z',
        createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
      });
      expect(nextState.active[2]).toStrictEqual({
        id: '68a552ea-b3d8-4af5-9bce-fb73e6870296',
        text: 'Never do today what you can put off until tomorrow.',
        done: false,
        createdAt: '2020-06-11T13:00:00.000Z',
        updatedAt: '2020-06-11T13:00:00.000Z',
        createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
      });
    });

    it('should handle REMOVE_TODO event', () => {
      const prevState: TodoState = {
        _filter: 'all',
        loading: false,
        all: [
          {
            id: '0f81d175-11b8-40d4-82da-b74e7ffbd2a4',
            text: 'Absence makes the heart grow fonder -- of somebody else.',
            done: false,
            createdAt: '2020-06-08T16:00:00.000Z',
            updatedAt: '2020-06-08T16:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '3b3a687a-3be9-4ad7-ab32-8dd2a89b85a8',
            text:
              'This life is a test. Had this been an actual life, you would have received further instructions as to what to do and where to go.',
            done: true,
            createdAt: '2020-06-09T15:00:00.000Z',
            updatedAt: '2020-06-09T15:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '33d31700-e451-4ff8-932a-b824ea7f3aaa',
            text:
              'They are ill discoverers that think there is no land, when they can see nothing but sea.',
            done: false,
            createdAt: '2020-06-10T01:00:00.000Z',
            updatedAt: '2020-06-10T01:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '86a0e075-c3e5-4089-ba9d-9875197fcaa5',
            text:
              'Logic is a systematic method of coming to the wrong conclusion with confidence.',
            done: true,
            createdAt: '2020-06-11T17:00:00.000Z',
            updatedAt: '2020-06-11T17:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '596ca525-6910-4633-88c9-f9a9b27071ae',
            text: 'I often quote myself; it adds spice to my conversation.',
            done: false,
            createdAt: '2020-06-12T22:00:00.000Z',
            updatedAt: '2020-06-12T22:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: 'ac41212a-ea2f-4959-9800-d1d42f1afee4',
            text: "We've upped our standards, so up yours!",
            done: true,
            createdAt: '2020-06-13T18:00:00.000Z',
            updatedAt: '2020-06-13T18:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
        ],
        active: [
          {
            id: '0f81d175-11b8-40d4-82da-b74e7ffbd2a4',
            text: 'Absence makes the heart grow fonder -- of somebody else.',
            done: false,
            createdAt: '2020-06-08T16:00:00.000Z',
            updatedAt: '2020-06-08T16:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '33d31700-e451-4ff8-932a-b824ea7f3aaa',
            text:
              'They are ill discoverers that think there is no land, when they can see nothing but sea.',
            done: false,
            createdAt: '2020-06-10T01:00:00.000Z',
            updatedAt: '2020-06-10T01:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '596ca525-6910-4633-88c9-f9a9b27071ae',
            text: 'I often quote myself; it adds spice to my conversation.',
            done: false,
            createdAt: '2020-06-12T22:00:00.000Z',
            updatedAt: '2020-06-12T22:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
        ],
        completed: [
          {
            id: '3b3a687a-3be9-4ad7-ab32-8dd2a89b85a8',
            text:
              'This life is a test. Had this been an actual life, you would have received further instructions as to what to do and where to go.',
            done: true,
            createdAt: '2020-06-09T15:00:00.000Z',
            updatedAt: '2020-06-09T15:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: '86a0e075-c3e5-4089-ba9d-9875197fcaa5',
            text:
              'Logic is a systematic method of coming to the wrong conclusion with confidence.',
            done: true,
            createdAt: '2020-06-11T17:00:00.000Z',
            updatedAt: '2020-06-11T17:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
          {
            id: 'ac41212a-ea2f-4959-9800-d1d42f1afee4',
            text: "We've upped our standards, so up yours!",
            done: true,
            createdAt: '2020-06-13T18:00:00.000Z',
            updatedAt: '2020-06-13T18:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
        ],
      };
      const event: TodoEvent = {
        type: 'REMOVE_TODO',
        payload: {
          todo: {
            id: '86a0e075-c3e5-4089-ba9d-9875197fcaa5',
            text:
              'Logic is a systematic method of coming to the wrong conclusion with confidence.',
            done: true,
            createdAt: '2020-06-11T17:00:00.000Z',
            updatedAt: '2020-06-11T17:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          },
        },
      };
      const mockExec = jest.fn();

      const nextState = todoReducer(prevState, event, mockExec as any);

      expect(mockExec).toHaveBeenCalledWith({
        type: 'removeTodo',
        payload: '86a0e075-c3e5-4089-ba9d-9875197fcaa5',
      });
      expect(nextState).toHaveProperty('_position', 3);
      expect(nextState).toHaveProperty('_todo', {
        createdAt: '2020-06-11T17:00:00.000Z',
        createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
        done: true,
        id: '86a0e075-c3e5-4089-ba9d-9875197fcaa5',
        text:
          'Logic is a systematic method of coming to the wrong conclusion with confidence.',
        updatedAt: '2020-06-11T17:00:00.000Z',
      });
      expect(nextState.all).toHaveLength(5);
      expect(nextState.active).toHaveLength(3);
      expect(nextState.completed).toHaveLength(2);
    });

    it('should handle REMOVE_TODO_FAILED event', () => {
      const prevState: TodoState = {
        _filter: 'all',
        _position: 3,
        _todo: {
          createdAt: '2020-06-11T17:00:00.000Z',
          createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          done: true,
          id: '86a0e075-c3e5-4089-ba9d-9875197fcaa5',
          text:
            'Logic is a systematic method of coming to the wrong conclusion with confidence.',
          updatedAt: '2020-06-11T17:00:00.000Z',
        },
        active: [
          {
            createdAt: '2020-06-08T16:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
            done: false,
            id: '0f81d175-11b8-40d4-82da-b74e7ffbd2a4',
            text: 'Absence makes the heart grow fonder -- of somebody else.',
            updatedAt: '2020-06-08T16:00:00.000Z',
          },
          {
            createdAt: '2020-06-10T01:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
            done: false,
            id: '33d31700-e451-4ff8-932a-b824ea7f3aaa',
            text:
              'They are ill discoverers that think there is no land, when they can see nothing but sea.',
            updatedAt: '2020-06-10T01:00:00.000Z',
          },
          {
            createdAt: '2020-06-12T22:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
            done: false,
            id: '596ca525-6910-4633-88c9-f9a9b27071ae',
            text: 'I often quote myself; it adds spice to my conversation.',
            updatedAt: '2020-06-12T22:00:00.000Z',
          },
        ],
        all: [
          {
            createdAt: '2020-06-08T16:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
            done: false,
            id: '0f81d175-11b8-40d4-82da-b74e7ffbd2a4',
            text: 'Absence makes the heart grow fonder -- of somebody else.',
            updatedAt: '2020-06-08T16:00:00.000Z',
          },
          {
            createdAt: '2020-06-09T15:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
            done: true,
            id: '3b3a687a-3be9-4ad7-ab32-8dd2a89b85a8',
            text:
              'This life is a test. Had this been an actual life, you would have received further instructions as to what to do and where to go.',
            updatedAt: '2020-06-09T15:00:00.000Z',
          },
          {
            createdAt: '2020-06-10T01:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
            done: false,
            id: '33d31700-e451-4ff8-932a-b824ea7f3aaa',
            text:
              'They are ill discoverers that think there is no land, when they can see nothing but sea.',
            updatedAt: '2020-06-10T01:00:00.000Z',
          },
          {
            createdAt: '2020-06-12T22:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
            done: false,
            id: '596ca525-6910-4633-88c9-f9a9b27071ae',
            text: 'I often quote myself; it adds spice to my conversation.',
            updatedAt: '2020-06-12T22:00:00.000Z',
          },
          {
            createdAt: '2020-06-13T18:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
            done: true,
            id: 'ac41212a-ea2f-4959-9800-d1d42f1afee4',
            text: "We've upped our standards, so up yours!",
            updatedAt: '2020-06-13T18:00:00.000Z',
          },
        ],
        completed: [
          {
            createdAt: '2020-06-09T15:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
            done: true,
            id: '3b3a687a-3be9-4ad7-ab32-8dd2a89b85a8',
            text:
              'This life is a test. Had this been an actual life, you would have received further instructions as to what to do and where to go.',
            updatedAt: '2020-06-09T15:00:00.000Z',
          },
          {
            createdAt: '2020-06-13T18:00:00.000Z',
            createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
            done: true,
            id: 'ac41212a-ea2f-4959-9800-d1d42f1afee4',
            text: "We've upped our standards, so up yours!",
            updatedAt: '2020-06-13T18:00:00.000Z',
          },
        ],
        error: undefined,
        loading: false,
      };
      const event: TodoEvent = {
        type: 'REMOVE_TODO_FAILED',
        payload: 'Database connection error',
      };

      const nextState = todoReducer(prevState, event, jest.fn() as any);

      expect(nextState).toHaveProperty('error', 'Database connection error');
      expect(nextState._position).toBeUndefined();
      expect(nextState._todo).toBeUndefined();
      expect(nextState.all).toHaveLength(6);
      expect(nextState.all).toStrictEqual([
        {
          id: '0f81d175-11b8-40d4-82da-b74e7ffbd2a4',
          text: 'Absence makes the heart grow fonder -- of somebody else.',
          done: false,
          createdAt: '2020-06-08T16:00:00.000Z',
          updatedAt: '2020-06-08T16:00:00.000Z',
          createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
        },
        {
          id: '3b3a687a-3be9-4ad7-ab32-8dd2a89b85a8',
          text:
            'This life is a test. Had this been an actual life, you would have received further instructions as to what to do and where to go.',
          done: true,
          createdAt: '2020-06-09T15:00:00.000Z',
          updatedAt: '2020-06-09T15:00:00.000Z',
          createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
        },
        {
          id: '33d31700-e451-4ff8-932a-b824ea7f3aaa',
          text:
            'They are ill discoverers that think there is no land, when they can see nothing but sea.',
          done: false,
          createdAt: '2020-06-10T01:00:00.000Z',
          updatedAt: '2020-06-10T01:00:00.000Z',
          createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
        },
        {
          id: '86a0e075-c3e5-4089-ba9d-9875197fcaa5',
          text:
            'Logic is a systematic method of coming to the wrong conclusion with confidence.',
          done: true,
          createdAt: '2020-06-11T17:00:00.000Z',
          updatedAt: '2020-06-11T17:00:00.000Z',
          createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
        },
        {
          id: '596ca525-6910-4633-88c9-f9a9b27071ae',
          text: 'I often quote myself; it adds spice to my conversation.',
          done: false,
          createdAt: '2020-06-12T22:00:00.000Z',
          updatedAt: '2020-06-12T22:00:00.000Z',
          createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
        },
        {
          id: 'ac41212a-ea2f-4959-9800-d1d42f1afee4',
          text: "We've upped our standards, so up yours!",
          done: true,
          createdAt: '2020-06-13T18:00:00.000Z',
          updatedAt: '2020-06-13T18:00:00.000Z',
          createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
        },
      ]);
      expect(nextState.active).toHaveLength(3);
      expect(nextState.active).toStrictEqual([
        {
          id: '0f81d175-11b8-40d4-82da-b74e7ffbd2a4',
          text: 'Absence makes the heart grow fonder -- of somebody else.',
          done: false,
          createdAt: '2020-06-08T16:00:00.000Z',
          updatedAt: '2020-06-08T16:00:00.000Z',
          createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
        },
        {
          id: '33d31700-e451-4ff8-932a-b824ea7f3aaa',
          text:
            'They are ill discoverers that think there is no land, when they can see nothing but sea.',
          done: false,
          createdAt: '2020-06-10T01:00:00.000Z',
          updatedAt: '2020-06-10T01:00:00.000Z',
          createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
        },
        {
          id: '596ca525-6910-4633-88c9-f9a9b27071ae',
          text: 'I often quote myself; it adds spice to my conversation.',
          done: false,
          createdAt: '2020-06-12T22:00:00.000Z',
          updatedAt: '2020-06-12T22:00:00.000Z',
          createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
        },
      ]);
      expect(nextState.completed).toHaveLength(3);
      expect(nextState.completed).toStrictEqual([
        {
          id: '3b3a687a-3be9-4ad7-ab32-8dd2a89b85a8',
          text:
            'This life is a test. Had this been an actual life, you would have received further instructions as to what to do and where to go.',
          done: true,
          createdAt: '2020-06-09T15:00:00.000Z',
          updatedAt: '2020-06-09T15:00:00.000Z',
          createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
        },
        {
          id: '86a0e075-c3e5-4089-ba9d-9875197fcaa5',
          text:
            'Logic is a systematic method of coming to the wrong conclusion with confidence.',
          done: true,
          createdAt: '2020-06-11T17:00:00.000Z',
          updatedAt: '2020-06-11T17:00:00.000Z',
          createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
        },
        {
          id: 'ac41212a-ea2f-4959-9800-d1d42f1afee4',
          text: "We've upped our standards, so up yours!",
          done: true,
          createdAt: '2020-06-13T18:00:00.000Z',
          updatedAt: '2020-06-13T18:00:00.000Z',
          createdBy: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
        },
      ]);
    });

    it('should handle SWITCH_FILTER event', () => {
      const prevState: TodoState = {
        _filter: 'all',
        active: [],
        all: [],
        completed: [],
        loading: false,
      };

      expect(
        todoReducer(
          prevState,
          { type: 'SWITCH_FILTER', payload: 'active' },
          jest.fn() as any,
        ),
      ).toHaveProperty('_filter', 'active');
      expect(
        todoReducer(
          prevState,
          { type: 'SWITCH_FILTER', payload: 'completed' },
          jest.fn() as any,
        ),
      ).toHaveProperty('_filter', 'completed');
    });

    it('should handle ERROR event', () => {
      const prevState: TodoState = {
        _filter: 'all',
        active: [],
        all: [],
        completed: [],
        loading: true,
      };
      const event: TodoEvent = { type: 'ERROR', payload: 'Network Error' };

      const nextState = todoReducer(prevState, event, jest.fn() as any);

      expect(nextState).toHaveProperty('loading', false);
      expect(nextState).toHaveProperty('error', 'Network Error');
    });
  });
});
