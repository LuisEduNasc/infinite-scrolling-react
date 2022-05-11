import React from 'react';
import {render} from '@testing-library/react';
import App from './App';

it('renders Hello Word text', () => {
  const {getByText} = render(<App />);

  expect(getByText('Hello World')).toBeTruthy();
});
