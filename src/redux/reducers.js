import { createSlice } from '@reduxjs/toolkit';

// Tạo slice cho các ghi chú cảm ơn
const thankYouNotesSlice = createSlice({
  name: 'thankYouNotes', // Tên của slice
  initialState: [], // Trạng thái ban đầu là một mảng rỗng
  reducers: {
    // Reducer để thiết lập danh sách các ghi chú cảm ơn
    setThankYouNotes(state, action) {
      return action.payload; // Cập nhật trạng thái với payload là danh sách các ghi chú
    },
    // Reducer để thêm một ghi chú cảm ơn
    addThankYouNote(state, action) {
      state.push(action.payload); // Thêm ghi chú mới vào mảng trạng thái hiện tại
    }
  }
});

// Xuất các action creators được tạo bởi createSlice
export const { setThankYouNotes, addThankYouNote } = thankYouNotesSlice.actions;

// Xuất reducer của slice này để sử dụng trong store
export default thankYouNotesSlice.reducer;
