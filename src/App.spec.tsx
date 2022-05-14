import React from 'react';
import {render} from '@testing-library/react';
import App from './App';
import * as bookHooks from 'hooks/useBookSearch';

describe('App', () => {
  it('Should render the loading text', () => {
    jest.spyOn(bookHooks, 'default')
      .mockImplementation(() => (
        {loading: true, error: false, books: [], hasMore: false}
      ));
    
    const {getByText, getByTestId} = render(<App />);
  
    expect(getByTestId('search-input-field')).toBeInTheDocument;
    expect(getByText('Loading...')).toBeTruthy();
  });
});
