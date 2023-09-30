import { globalApi } from "./globalApi";

type DashboardProps = {
  dashboardId?: string;
  name: string;
  description: string;
  widgets: string;
  layout: string;
  userId: number;
};

type mutationLinkDashboardProps = {
  dashboardId: number;
  userId: number;
};

const dashboardsApi = globalApi.injectEndpoints({
  endpoints: builder => ({
    getAllDashboards: builder.query<DashboardProps[], void>({
      query: () => "/dashboards",
      providesTags: ["Dashboards"],
      // transformResponse: (response: string) => {
      //   return JSON.parse(response).filter((dashboard: dashboardProps) => dashboard.userId === localStorage.getItem("userId"));
      // },
    }),
    getDashboardById: builder.query<DashboardProps, string>({
      query: dashboardId => `/dashboards/${dashboardId}`,
    }),
    deleteDashboard: builder.mutation<string, string>({
      query: dashboardId => ({
        url: `/dashboards/${dashboardId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Dashboards"],
    }),
    addDashboard: builder.mutation<number, DashboardProps>({
      query: dashboardProps => ({
        url: "/dashboards",
        method: "POST",
        body: dashboardProps,
      }),
      invalidatesTags: ["Dashboards"],
    }),
    udpateDashboard: builder.mutation<number, DashboardProps>({
      query: mutationProps => ({
        url: `/dashboards/${mutationProps.dashboardId}`,
        method: "PUT",
        body: {
          name: mutationProps.name,
          description: mutationProps.description,
          widgets: mutationProps.widgets,
          layouts: mutationProps.layout,
        },
      }),
      invalidatesTags: ["Dashboards"],
    }),
    linkDashboardToUser: builder.mutation<void, mutationLinkDashboardProps>({
      query: mutationProps => ({
        url: "/dashboards/linkUsers",
        method: "POST",
        body: mutationProps,
      }),
    }),
  }),
});

export const {
  useGetAllDashboardsQuery,
  useGetDashboardByIdQuery,
  useDeleteDashboardMutation,
  useAddDashboardMutation,
  useUdpateDashboardMutation,
  useLinkDashboardToUserMutation,
} = dashboardsApi;
