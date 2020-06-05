/* eslint-env jest */
import '@testing-library/jest-dom';
require('jest-fetch-mock').enableMocks();

jest.setMock('cross-fetch', fetch);
