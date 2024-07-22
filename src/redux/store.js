import { configureStore } from '@reduxjs/toolkit';
import thankYouNotesReducer from './reducers'; // Import reducer

// Cấu hình store của Redux
const store = configureStore({
  reducer: {
    thankYouNotes: thankYouNotesReducer // Gán reducer cho slice 'thankYouNotes'
  }
});

export default store;