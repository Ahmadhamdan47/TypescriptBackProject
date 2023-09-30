import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const userPopupSlice = createSlice({
  name: "userPopup",
  initialState: {
    showUserPopup: false,
  },
  reducers: {
    toggleUserPopup: state => {
      state.showUserPopup = !state.showUserPopup;
    },
  },
});

export const { toggleUserPopup } = userPopupSlice.actions;
export const selectUserPopup = (state: RootState) =>
  state.userPopup.showUserPopup;
export default userPopupSlice.reducer;
