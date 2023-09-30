import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { httPrefix } from "../../client.config";
import { RootState } from "../store/store";

export const globalApi = createApi({
  // reducerPath: "api", => default value
  baseQuery: fetchBaseQuery({
    credentials: "same-origin",
    baseUrl: `${httPrefix}:5001`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).currentUser.access_token;
      const id_token = (getState() as RootState).currentUser.id_token;

      if (token) headers.set("authorization", `Bearer ${token}`);
      if (id_token) headers.set("id_token", id_token);

      return headers;
    },
  }),
  tagTypes: ["Users", "Dashboards", "Logs", "Backups", "Systems"],
  endpoints: () => ({}),
});
