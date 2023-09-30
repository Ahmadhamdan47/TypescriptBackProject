import { globalApi } from "./globalApi";

export interface Backup {
  name: string;
  creationDate: string;
}
export type NewBackup = {
  dbName?: string;
  backupName?: string;
  description?: string;
};

const backupRestoreApi = globalApi.injectEndpoints({
  endpoints: builder => ({
    getAllBackup: builder.query<Backup, string>({
      query: type => `/databases/backupNames/${type}`,
      providesTags: ["Backups"],
    }),

    backupDatabase: builder.mutation<void, NewBackup>({
      query: (body: NewBackup) => ({
        url: `/databases/backup`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Backups"],
    }),

    restoreDatabase: builder.mutation<void, string>({
      query: (body: string) => ({
        url: `/databases/restore`,
        method: "POST",
        body: body,
      }),
    }),

    uploadBackupFile: builder.mutation<void, FormData>({
      query: file => ({
        url: `/databases/upload`,
        method: "POST",
        body: file,
      }),
    }),

    deleteBackup: builder.mutation({
      query: filesname => ({
        url: `/databases/${filesname}`,
        method: "DELETE",
      }),
    }),

    downloadAllBackupFiles: builder.query({
      query: type => ({
        url: `/databases/all/${type}`,
        responseHandler: response => response.blob(),
        refetchOnMountOrArgChange: true,
        cacheResponse: false,
        skip: () => true,
      }),
    }),

    downloadSelectedBackupFiles: builder.query({
      query: (args: [string, string]) => ({
        url: `/databases/files/${args[0]}/${args[1]}`,
        responseHandler: (response: any) => response.blob(),
        refetchOnMountOrArgChange: true,
        cacheResponse: false,
        skip: () => true,
      }),
    }),
  }),
});

export const {
  useGetAllBackupQuery,
  useBackupDatabaseMutation,
  useRestoreDatabaseMutation,
  useUploadBackupFileMutation,
  useDeleteBackupMutation,
  useDownloadAllBackupFilesQuery,
  useDownloadSelectedBackupFilesQuery,
} = backupRestoreApi;
