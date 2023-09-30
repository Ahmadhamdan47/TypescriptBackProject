import { User, UserForm } from "../pages/Users/Users";
import { globalApi } from "./globalApi";

const usersApi = globalApi.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query<User[], void>({
      // <return type, arg type> => we retrieve all users, no arg
      query: () => "/users",
      providesTags: ["Users"],
      // Need for transformResponse ?
    }),
    addUser: builder.mutation<void, UserForm>({
      query: user => ({
        url: "/users",
        method: "POST",
        body: {
          name: user.name,
          password: user.password,
          description: user.description,
          language: user.language,
          time_zone: user.time_zone,
        },
      }),
      invalidatesTags: ["Users"],
    }),
    modifyUser: builder.mutation<void, UserForm>({
      query: user => ({
        url: `/users/${user.id}`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation<void, string>({
      query: userId => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useModifyUserMutation,
  useDeleteUserMutation,
} = usersApi;
