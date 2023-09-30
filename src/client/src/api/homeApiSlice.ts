import { globalApi } from "./globalApi";

export type UserData = {
  access_token: string;
  refresh_token: string;
  id_token: string;
  username: string;
  language: string;
  time_zone: string;
  features: string[];
};

export type TokensTriplet = {
  access_token?: string;
  refresh_token?: string;
  id_token?: string;
};

const homeApi = globalApi.injectEndpoints({
  endpoints: builder => ({
    getUserData: builder.mutation<UserData, string>({
      // <return type, arg type>
      query: code => ({
        url: `/home/?code=${code}`,
        method: "POST",
      }),
    }),
    refreshToken: builder.query<TokensTriplet, string>({
      query: refresh_token => `/home/refreshToken/${refresh_token}`,
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `/home/`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useGetUserDataMutation, useLogoutMutation } = homeApi;
export const {
  endpoints: { refreshToken },
} = homeApi; // no hook for this one because it is used in a function but not in a component
