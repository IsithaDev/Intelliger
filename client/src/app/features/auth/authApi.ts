import api from "@/app/api/api";
import { ILoginRequest } from "@/lib/types/request";
import { ILoginResponse } from "@/lib/types/response";
import userApi from "../user/userApi";

const authApi = api
  .enhanceEndpoints({ addTagTypes: ["auth"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      login: builder.mutation<ILoginResponse, ILoginRequest>({
        query: (body) => ({
          url: "/auth/login",
          method: "POST",
          body,
          credentials: "include",
        }),
        onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
          try {
            await queryFulfilled;
            await dispatch(userApi.endpoints.getMe.initiate(null));
          } catch (error: any) {
            console.error(error);
          }
        },
      }),
    }),
  });

export const { useLoginMutation } = authApi;

export default authApi;
