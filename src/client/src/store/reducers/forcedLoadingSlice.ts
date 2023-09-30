import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const forcedLoadingSlice = createSlice({
  name: "forcedLoading",
  initialState: {
    loadingForced: true,
  },
  reducers: {
    setForcedLoading: (state, action: PayloadAction<boolean>) => {
      state.loadingForced = action.payload;
    },
  },
});

export const { setForcedLoading } = forcedLoadingSlice.actions;
export const selectForcedLoading = (state: RootState) =>
  state.forcedLoading.loadingForced;
export default forcedLoadingSlice.reducer;
