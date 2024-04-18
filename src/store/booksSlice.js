import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, addDoc} from "firebase/firestore";
import { db, auth } from '../firebase/config.js';

export const booksSlice = createSlice({
  name: 'books',
  initialState: {
    books: [],
    status: 'idle',
  },
  reducers: {
    // addBook: (books, action) => {
    //   let newBook = action.payload;
    //   newBook.id = books.length ? Math.max(...books.map(book => book.id)) + 1 : 1;
    //   books.push(newBook);
    // },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        console.log(action.error.message);
      })
      .addCase(toggleRead.fulfilled, (state, action) => {
        state.books.map(book => {
          if (book.id == action.payload) {
            book.isRead = !book.isRead;
          }
        });
      })
      .addCase(toggleRead.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(eraseBook.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(eraseBook.fulfilled, (state, action) => {
        state.books = state.books.filter(book => book.id != action.payload);
        state.status = 'successed';
      })
      .addCase(eraseBook.rejected, (state, action) => {
        state.status = 'failed';
        console.log(action.error.message);
      })
      .addCase(addBook.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.books.push(action.payload);
        state.status = 'successed';
      })
      .addCase(addBook.rejected, (state, action) => {
        state.status = 'failed';
        console.log(action.error.message);
      })
  }
})

export const selectBooks = state => state.books;

export default booksSlice.reducer;

export const fetchBooks = createAsyncThunk('books/fetchBooks', async () => {
  const q = query(collection(db, "books"), where("user_id", "==", auth.currentUser.uid));
  let bookList = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    bookList.push({ id: doc.id, ...doc.data() });
    //console.log(doc.id, " => ", doc.data());
  });

  return bookList;
});

export const toggleRead = createAsyncThunk('books/toggleRead', async (payload) => {
  const bookRef = doc(db, "books", payload.id);
  await updateDoc(bookRef, {
    isRead: !payload.isRead
  });
  return payload.id;
});

export const eraseBook = createAsyncThunk('books/eraseBook', async (payload) => {
  const bookRef = doc(db, "books", payload);
  await deleteDoc(bookRef);
  return payload;
});

export const addBook = createAsyncThunk('books/addBook', async (payload) => {
  let newBook = payload;
  newBook.user_id = auth.currentUser.uid;
  const docRef = await addDoc(collection(db, "books"), newBook);
  newBook.id = docRef.id;
  console.log("Document written with ID: ", docRef.id);
  return newBook;
});