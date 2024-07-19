import { configureStore } from '@reduxjs/toolkit';
import thankYouNotesReducer from './reducers'; // Import reducer

const store = configureStore({
  reducer: {
    thankYouNotes: thankYouNotesReducer
  }
});

export default store;
