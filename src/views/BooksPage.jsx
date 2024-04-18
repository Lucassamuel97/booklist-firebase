import Book from '../components/Book.jsx';
import Header from '../components/Header.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { selectBooks, fetchBooks } from '../store/booksSlice.js';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function BooksPage() {
  const dispatch = useDispatch();
  const pageTitle = "📖 Book List with Router, Redux & Firebase";
  const books = useSelector(selectBooks).books;
  const booksStatus = useSelector(selectBooks).status;

  useEffect(() => {
    if (booksStatus == 'idle') {
      dispatch(fetchBooks());
    }
  }, []);
  return (
    <>
      <div className="container">
        <Header pageTitle={pageTitle} />
        <div className="books-container">

          { books.length ?
            <div className="books-list">

              {books.map(book =>

                <Book key={book.id} book={book} />

              )}
            </div> : booksStatus == 'loading' ?
            <div className="loading">Loading...</div>
            : <div className="no-books">Your book list is empty, <Link to="/add-book">Click here</Link> to add a new book</div>
          }
        </div>
      </div>
    </>
  )
}

export default BooksPage
