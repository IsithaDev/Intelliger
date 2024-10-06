import api from "@/app/api/api";
import { setAuthor } from "../auth/authSlice";
import { IGetMeResponse } from "@/lib/types/response";

const userApi = api
  .enhanceEndpoints({ addTagTypes: ["user"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getMe: builder.query<IGetMeResponse, null>({
        query: () => ({
          url: "/users/me",
          method: "GET",
          credentials: "include",
        }),
        onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
          try {
            const { data } = await queryFulfilled;

            dispatch(setAuthor({ user: data?.data?.data }));
          } catch (error: any) {
            console.error("Error fetching user: ", error);
          }
        },
      }),
    }),
  });

export const { useGetMeQuery } = userApi;

export default userApi;
