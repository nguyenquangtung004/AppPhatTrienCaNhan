// Định nghĩa các hằng số cho các hành động
export const ADD_THANK_YOU_NOTE = 'ADD_THANK_YOU_NOTE';
export const SET_THANK_YOU_NOTES = 'SET_THANK_YOU_NOTES';

// Hành động thêm một ghi chú cảm ơn
// Hàm này tạo ra một đối tượng hành động với kiểu ADD_THANK_YOU_NOTE và payload là ghi chú được thêm vào
export const addThankYouNote = (note) => ({
  type: ADD_THANK_YOU_NOTE,
  payload: note,
});

// Hành động thiết lập danh sách các ghi chú cảm ơn
// Hàm này tạo ra một đối tượng hành động với kiểu SET_THANK_YOU_NOTES và payload là danh sách các ghi chú
export const setThankYouNotes = (notes) => ({
  type: SET_THANK_YOU_NOTES,
  payload: notes,
});
