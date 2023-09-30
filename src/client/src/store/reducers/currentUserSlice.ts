import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { TokensTriplet, UserData } from "../../api/homeApiSlice";
import { PURGE } from "redux-persist";

const initialState: UserData = {
  access_token: "",
  refresh_token: "",
  id_token: "",
  username: "",
  language: "",
  time_zone: "",
  features: [],
};

export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<UserData>) => {
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.id_token = action.payload.id_token;
      state.username = action.payload.username;
      state.language = action.payload.language;
      state.time_zone = action.payload.time_zone;
      state.features = action.payload.features;
    },
    setNewTokens: (state, action: PayloadAction<TokensTriplet>) => {
      state.access_token = action.payload.access_token
        ? action.payload.access_token
        : state.access_token;
      state.refresh_token = action.payload.refresh_token
        ? action.payload.refresh_token
        : state.refresh_token;
      state.id_token = action.payload.id_token
        ? action.payload.id_token
        : state.id_token;
    },
  },
  extraReducers(builder) {
    builder.addCase(PURGE, state => {
      state.access_token = "";
      state.refresh_token = "";
      state.id_token = "";
      state.username = "";
      state.language = "";
      state.time_zone = "";
      state.features = [];
    });
  },
});

export const { setCurrentUser, setNewTokens } = currentUserSlice.actions;
export const selectCurrentUser = (state: RootState) => state.currentUser;
export default currentUserSlice.reducer;
