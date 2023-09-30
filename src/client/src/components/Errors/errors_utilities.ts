import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { setNewTokens } from "../../store/reducers/currentUserSlice";
import store, { persistor } from "../../store/store";
import { refreshToken } from "../../api/homeApiSlice";

export async function manageUnauthorizedError(error: FetchBaseQueryError) {
  const userData = store.getState().currentUser;

  if (userData.refresh_token) {
    console.log("refreshing token");
    try {
      const newTokens = await store
        .dispatch(refreshToken.initiate(userData.refresh_token))
        .unwrap();
      console.log("newTokens: ", newTokens);
      store.dispatch(setNewTokens(newTokens));
      window.location.reload();
      store
        .dispatch(refreshToken.initiate(userData.refresh_token))
        .unsubscribe();
    } catch (error: any) {
      console.log(error);
      if (error.data) {
        console.log("Attempting to redirect to login page :", error.data);
        persistor.purge();
        window.location.replace(error.data);
      } else {
        throw new Error("No redirect url provided");
      }
    }
  } else {
    console.log("no refresh token provided");
    if (error.status === "PARSING_ERROR") {
      persistor.purge();
      window.location.replace(error.data);
    } else {
      throw new Error("Unable to manage unauthorized error");
    }
  }
}
