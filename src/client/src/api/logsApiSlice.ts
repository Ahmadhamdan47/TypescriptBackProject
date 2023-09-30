import { globalApi } from "./globalApi";
import { Logs } from "../pages/Log/Logs";

const logsApi = globalApi.injectEndpoints({
  endpoints: builder => ({
    getLogs: builder.query<Logs, void>({
      query: () => "/logs",
      providesTags: ["Logs"],
    }),
    getLogsFileByName: builder.query({
      query: (name: string) => ({
        url: `/logs/file/${name}`,
        responseHandler: response => response.text(),
        refetchOnMountOrArgChange: true,
        provideTags: ["Logs"],
      }),
    }),

    downloadAllFiles: builder.query({
      query: () => ({
        url: `/logs/all`,
        responseHandler: response => response.blob(),
        cacheResponse: false,
        skip: () => true,
      }),
    }),

    downloadSelectedFiles: builder.query({
      query: (filenames: string) => ({
        url: `/logs/files/${filenames}`,
        responseHandler: response => response.blob(),
        refetchOnMountOrArgChange: true,
        cacheResponse: false,
        skip: () => true,
      }),
    }),

    deleteLogs: builder.mutation({
      query: filenames => ({
        url: `/logs/files/${filenames}`,
        method: "DELETE",
      }),
    }),

    deleteAllLogs: builder.mutation<void, string>({
      query: () => ({
        url: `/logs/all`,
        method: "DELETE",
        unvalidatedTags: ["Logs"],
      }),
    }),
  }),
});

export const {
  useGetLogsQuery,
  useGetLogsFileByNameQuery,
  useDownloadAllFilesQuery,
  useDownloadSelectedFilesQuery,
  useDeleteAllLogsMutation,
  useDeleteLogsMutation,
} = logsApi;
