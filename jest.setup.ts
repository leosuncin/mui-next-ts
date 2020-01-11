/* eslint-env jest */
import '@testing-library/jest-dom/extend-expect';
require('jest-fetch-mock').enableMocks();
import 'mutationobserver-shim';

jest.setMock('cross-fetch', fetch);
