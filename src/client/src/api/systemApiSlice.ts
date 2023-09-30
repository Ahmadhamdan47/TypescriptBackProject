import { globalApi } from "./globalApi";

export interface SystemList {
  address: string;
  kind: string;
  name: string;
  port: string;
  managementArea: string;
  category: string;
  brand: string;
  createdBy: string;
  authMode: string;
  createdAt: string;
  id: number;
  password: string;
  release: string;
  state: string;
  updatedAt: string;
  updatedBy: string;
  user: string;
}
export type System = SystemList[];

export interface NewSystem {
  name: string;
  kind: string;
  address: string;
  brand: string;
  category: string;
  managementArea: string;
  port: string;
  createdBy: string;
  authMode: string;
  user: string;
  password: string;
}
const systemApi = globalApi.injectEndpoints({
  endpoints: builder => ({
    getAllSystem: builder.query<System, void>({
      query: () => ({
        url: "/systems/",
        responseType: "json",
        refetchOnMountOrArgChange: true,
      }),
      providesTags: ["Systems"],
    }),

    getAuthModes: builder.query<Array<string>, void>({
      query: () => ({
        url: "/systems/authModes",
        responseType: "json",
      }),
    }),

    getBrands: builder.query<Array<string>, void>({
      query: () => ({
        url: "/systems/brands",
        responseType: "json",
      }),
    }),

    addSystem: builder.mutation<void, NewSystem>({
      query: (body: NewSystem) => ({
        url: `/systems/`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Systems"],
    }),

    updateSystem: builder.mutation<
      void,
      { body: Partial<NewSystem>; id: string }
    >({
      query: ({ body, id }) => ({
        url: `/systems/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Systems"],
    }),

    deleteSystem: builder.mutation({
      query: id => ({
        url: `/systems/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Systems"],
    }),
  }),
});

export const {
  useGetAllSystemQuery,
  useGetAuthModesQuery,
  useGetBrandsQuery,
  useAddSystemMutation,
  useUpdateSystemMutation,
  useDeleteSystemMutation,
} = systemApi;
