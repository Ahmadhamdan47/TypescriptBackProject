import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    dark: false,
  },
  reducers: {
    toggleTheme: state => {
      state.dark = !state.dark;
    },
  },
});
export const { toggleTheme } = themeSlice.actions;
export const selectTheme = (state: RootState) => state.theme.dark;
export default themeSlice.reducer;
