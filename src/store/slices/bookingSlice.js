import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    pendingBooking: null,
    returnPath: null,
  },
  reducers: {
    setPendingBooking: (state, action) => {
      state.pendingBooking = action.payload;
    },
    clearPendingBooking: (state) => {
      state.pendingBooking = null;
    },
    setReturnPath: (state, action) => {
      state.returnPath = action.payload;
    },
    clearReturnPath: (state) => {
      state.returnPath = null;
    },
  },
});

export const {
  setPendingBooking,
  clearPendingBooking,
  setReturnPath,
  clearReturnPath,
} = bookingSlice.actions;

export const selectPendingBooking = (state) => state.booking.pendingBooking;
export const selectReturnPath = (state) => state.booking.returnPath;

export default bookingSlice.reducer;
