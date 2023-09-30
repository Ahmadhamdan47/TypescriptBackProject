import { configureStore } from "@reduxjs/toolkit";
import { globalApi } from "../api/globalApi";
import { rootReducer } from "./reducers/rootReducer";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage/session";

const persistConfig = {
  key: "root",
  storage: storage, // session storage
  whitelist: ["currentUser"], // only currentUser will be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(globalApi.middleware),
});

export default store;
export let persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
