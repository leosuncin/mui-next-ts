import '@testing-library/jest-dom/extend-expect';
import { GlobalWithFetchMock } from 'jest-fetch-mock';
import 'mutationobserver-shim';

const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock;
customGlobal.fetch = require('jest-fetch-mock');
customGlobal.fetchMock = customGlobal.fetch;

jest.setMock('cross-fetch', fetch);
