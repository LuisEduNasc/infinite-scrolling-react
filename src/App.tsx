import React, {useState, useRef, useCallback} from 'react';
import useBookSearch from 'hooks/useBookSearch';

function App() {
  const [query, setQuery] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number | undefined>(undefined);

  const {loading, error, books, hasMore} = useBookSearch({query, pageNumber});

  const observer: React.MutableRefObject<IntersectionObserver | undefined> =
    useRef();

  const lastBookElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber(prevPageNumber =>
            prevPageNumber ? prevPageNumber + 1 : 2,
          );
        }
      });

      if (node) observer.current?.observe(node);
    },
    [loading, hasMore],
  );

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>): void {
    setQuery(event.target.value);
    setPageNumber(1);
  }

  return (
    <div className="App">
      <input
        type="text"
        name="search-field"
        id="search-field"
        placeholder="Type your book search here"
        onChange={handleSearch}
        value={query}
        data-testid="search-input-field"
      />
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return (
            <div
              key={book.id}
              ref={lastBookElementRef}
              className="card-book"
              data-testid="card-book"
            >
              <div>
                <p>Title</p>
                <h2>{book.title}</h2>
                <p>Authors</p>
                {book.authors.map(author => (
                  <h3 key={typeof author === 'string' ? author : author.name}>
                    {typeof author === 'string' ? author : author.name}
                  </h3>
                ))}
              </div>
              <div>
                <p>Downloaded: {book.download_count} times.</p>
              </div>

              <hr />
            </div>
          );
        } else {
          return (
            <div key={book.id} className="card-book" data-testid="card-book">
              <div>
                <p>Title</p>
                <h2>{book.title}</h2>
                <p>Authors</p>
                {book.authors.map(author => (
                  <h3 key={typeof author === 'string' ? author : author.name}>
                    {typeof author === 'string' ? author : author.name}
                  </h3>
                ))}
              </div>
              <div>
                <p>Downloaded: {book.download_count} times.</p>
              </div>

              <hr />
            </div>
          );
        }
      })}
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error...'}</div>
    </div>
  );
}

export default App;
