import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './booksSlice.js';
import usersReducer from './usersSlice.js';

export default configureStore({
  reducer: {
    books: booksReducer,
    users: usersReducer
  }
})