import {useCallback, useEffect, useState} from 'react';
import axios, {CancelTokenSource} from 'axios';

interface Person {
  birth_year: number | null;
  death_year: number | null;
  name: string;
}

interface Book {
  id: number;
  title: string;
  authors: Array<Person> | Array<string>;
  translators: Array<Person> | Array<string>;
  subjects: Array<string>;
  bookshelves: Array<string>;
  languages: Array<string>;
  copyright: boolean | null;
  media_type?: string;
  formats: object;
  download_count: number;
}

interface UsebooksSearch {
  loading: boolean;
  error: boolean;
  books: Book[];
  hasMore: boolean;
}

export default function useBookSearch(
  {query, pageNumber}: {query: string | undefined, pageNumber: number | undefined}
): UsebooksSearch {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const getBooks = useCallback(({axiosSource}: {axiosSource: CancelTokenSource}) => {
    setLoading(true);
    setError(false);

    axios({
      method: 'GET',
      url: 'https://gutendex.com/books',
      params: {search: query, page: pageNumber},
      cancelToken: axiosSource.token
    }).then(res => {
      setBooks(prevBooks => {
        return [...prevBooks, ...res.data.results];
      });
      setHasMore(!!res.data.next);
    }).catch(err => {
      if (axios.isCancel(err)) return;
      setError(true);
    }).finally(() => setLoading(false));
  }, [query, pageNumber]);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    getBooks({axiosSource: source});

    return () => source.cancel('Operation canceled by the user.');
  }, [query, pageNumber, getBooks]);
  
  return {
    loading,
    error,
    books,
    hasMore
  };
}