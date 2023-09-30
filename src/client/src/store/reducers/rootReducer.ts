import { combineReducers } from "@reduxjs/toolkit";
import { globalApi } from "../../api/globalApi";
import currentUserSlice from "./currentUserSlice";
import forcedLoadingSlice from "./forcedLoadingSlice";
import themeSlice from "./themeSlice";
import userPopupSlice from "./userPopupSlice";

export const rootReducer = combineReducers({
  // API
  [globalApi.reducerPath]: globalApi.reducer,
  // Layout
  forcedLoading: forcedLoadingSlice,
  // Users
  userPopup: userPopupSlice,
  currentUser: currentUserSlice,
  // Theme
  theme: themeSlice,
});
