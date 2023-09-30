import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "~styles/main-style.scss";
import "~styles/custom-bootstrap.scss";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/Errors/ErrorBoundary.tsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store/store.ts";

import "./i18n/i18n";
import Loader from "./components-basics/Loader/Loader.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={<Loader />} persistor={persistor}>
          <ErrorBoundary>
            <Suspense fallback={<Loader />}>
              <App />
            </Suspense>
          </ErrorBoundary>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
