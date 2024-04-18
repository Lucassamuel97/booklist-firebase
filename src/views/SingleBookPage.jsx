import { useParams, Link, useNavigate } from 'react-router-dom';
import Notes from '../components/Notes.jsx';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { eraseBook, toggleRead, fetchBooks } from '../store/booksSlice.js';
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from '../firebase/config.js';

function SingleBookPage() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { id } = useParams();
  const [book, setBook] = useState("");
  const [fetchStatus, setfetchStatus] = useState("idle");



  function handleEraseBook(id) {
    if (confirm('Are you sure you want to erase this book and all notes associated with it?')) {
      dispatch(eraseBook(id));
      navigate("/");
    }
  }

  function handleToggleRead(info) {
    dispatch(toggleRead({ id: info.id, isRead: info.isRead}));
    setBook({...book, isRead: !info.isRead});
  }

  const fetchBook = async(book_id)=>{
    setfetchStatus('loading');
    try{
    const bookRef = doc(db, "books", book_id);
    const bookSnap = await getDoc(bookRef);
    if (bookSnap.exists()) {
      const bookData = bookSnap.data();
      setBook({...bookData, id: bookSnap.id});
      setfetchStatus('success');
    }
    } catch (error) {
      console.error("Error fetching book: ", error);
      setfetchStatus('error');
    }
  }
  useEffect(() => {
    if (fetchStatus == 'idle') {
      fetchBook(id);
    }
  }, []);
  
  return (
    <>
      <div className="container">
        <Link to="/">
          <button className="btn">
            ← Back to Books
          </button>
        </Link>

        {book ?

          <div>
            <div className="single-book">
              <div className="book-cover">
                <img src={book.cover} />
              </div>

              <div className="book-details">
                <h3 className="book-title">{book.title}</h3>
                <h4 className="book-author">{book.author}</h4>
                <p>{book.synopsis}</p>
                <div className="read-checkbox">
                  <input
                    onClick={() => {handleToggleRead({ id: book.id, isRead: book.isRead }) }}
                    type="checkbox"
                    defaultChecked={book.isRead} />
                  <label>{book.isRead ? "Already Read It" : "Haven't Read it yet"}</label>
                </div>
                <div onClick={() => handleEraseBook(book.id)} className="erase-book">
                  Erase book
                </div>
              </div>
            </div>

            <Notes bookId={id} />
          </div>

          : fetchStatus == 'success' ?

          <div>
            <p>Book not found. Click the button above to go back to the list of books.</p>
          </div>
          : fetchStatus == 'error' ?
          <div>
            <p>There was an error fetching the book. Please try again later.</p>
          </div>
          : 
          <div>
            <p>Loading...</p>
          </div>
        }


      </div>


    </>
  )
}

export default SingleBookPage
