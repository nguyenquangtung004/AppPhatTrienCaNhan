import { createSlice } from '@reduxjs/toolkit';

// Create slice for thank you notes
const thankYouNotesSlice = createSlice({
  name: 'thankYouNotes',
  initialState: [],
  reducers: {
    setThankYouNotes(state, action) {
      return action.payload;
    },
    addThankYouNote(state, action) {
      state.push(action.payload);
    }
  }
});

export const { setThankYouNotes, addThankYouNote } = thankYouNotesSlice.actions;
export default thankYouNotesSlice.reducer;
