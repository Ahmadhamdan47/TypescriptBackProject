import { Component, ReactNode } from "react";
import DefaultErrorPage from "../../pages/DefaultErrorPage/DefaultErrorPage";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { manageUnauthorizedError } from "./errors_utilities";
import Loader from "../../components-basics/Loader/Loader";

interface Props {
  fallback?: ReactNode;
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  isErrorHandled?: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error | FetchBaseQueryError) {
    if ("status" in error && error.status === "PARSING_ERROR") {
      this.state.isErrorHandled = true;
      switch (error.originalStatus) {
        case 401:
          (async () => {
            console.error("Unauthorized");
            await manageUnauthorizedError(error);
          })();
          break;
        default:
          console.error("Unknown fetch error");
      }
    } else {
      this.state.isErrorHandled = false;
      console.error("Unknown error", error);
    }
  }

  public render() {
    if (this.state.hasError && !this.state.isErrorHandled) {
      return this.props.fallback ?? <DefaultErrorPage />;
    } else if (this.state.hasError && this.state.isErrorHandled) {
      return <Loader />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
