import React from 'react';
import {render} from '@testing-library/react';
import App from './App';
import * as bookHooks from 'hooks/useBookSearch';
import {setupIntersectionObserverMock} from '__mocks__/mockIntersectionObserver';

describe('App', () => {
  it('Should render the loading text', () => {
    jest.spyOn(bookHooks, 'default').mockImplementation(() => ({
      loading: true,
      error: false,
      books: [],
      hasMore: false,
    }));

    const {getByText, getByTestId} = render(<App />);

    expect(getByTestId('search-input-field')).toBeInTheDocument;
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('Should render error when the hook return a error', () => {
    jest.spyOn(bookHooks, 'default').mockImplementation(() => ({
      loading: false,
      error: true,
      books: [],
      hasMore: false,
    }));

    const {getByText, getByTestId} = render(<App />);

    expect(getByTestId('search-input-field')).toBeInTheDocument;
    expect(getByText('Error...')).toBeTruthy();
  });

  it('Should render a list of books', () => {
    setupIntersectionObserverMock();

    jest.spyOn(bookHooks, 'default').mockImplementation(() => ({
      loading: false,
      error: false,
      books: [
        {
          id: 1,
          title: 'Frankenstein',
          authors: ['Shelley', 'Mary Wollstonecraft'],
          bookshelves: [],
          copyright: true,
          download_count: 200,
          languages: [],
          formats: {},
          subjects: [],
          translators: [],
          media_type: undefined,
        },
        {
          id: 2,
          title: 'Pride and Prejudice',
          authors: ['Austen', 'Jane'],
          bookshelves: [],
          copyright: true,
          download_count: 300,
          languages: [],
          formats: {},
          subjects: [],
          translators: [],
          media_type: undefined,
        },
        {
          id: 3,
          title: `Alice/'s Adventures in Wonderland`,
          authors: ['Carrol', 'Lewis'],
          bookshelves: [],
          copyright: true,
          download_count: 400,
          languages: [],
          formats: {},
          subjects: [],
          translators: [],
          media_type: undefined,
        },
      ],
      hasMore: true,
    }));

    const {getAllByTestId, getByTestId} = render(<App />);

    expect(getByTestId('search-input-field')).toBeInTheDocument;
    expect(getAllByTestId('card-book')).toHaveLength(3);
  });
});
