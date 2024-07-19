export const ADD_THANK_YOU_NOTE = 'ADD_THANK_YOU_NOTE';
export const SET_THANK_YOU_NOTES = 'SET_THANK_YOU_NOTES';

export const addThankYouNote = (note) => ({
  type: ADD_THANK_YOU_NOTE,
  payload: note,
});

export const setThankYouNotes = (notes) => ({
  type: SET_THANK_YOU_NOTES,
  payload: notes,
});
