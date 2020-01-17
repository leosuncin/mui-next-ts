/* eslint-env jest */
import '@testing-library/jest-dom';
require('jest-fetch-mock').enableMocks();
import 'mutationobserver-shim';

jest.setMock('cross-fetch', fetch);
