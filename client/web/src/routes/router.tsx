import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { App, NotFound, RootLayout } from "../app";
import { ForgotPassword, ResetPassword, SignIn, SignUp } from "../app/(auth)";
import { Explore, Home, Profile, Saved } from "../app/(base)";
import { Dashboard } from "../app/(dashboard)";
import PageLoading from "../components/ui/PageLoading";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />} errorElement={<NotFound />}>
      {/* Public Routes */}

      <Route
        path="/sign-in"
        element={
          <PageLoading>
            <SignIn />
          </PageLoading>
        }
      />
      <Route
        path="/sign-up"
        element={
          <PageLoading>
            <SignUp />
          </PageLoading>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PageLoading>
            <ForgotPassword />
          </PageLoading>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PageLoading>
            <ResetPassword />
          </PageLoading>
        }
      />

      {/* Private Routes */}
      <Route
        element={
          <PageLoading>
            <RootLayout />
          </PageLoading>
        }
      >
        {/* User Routes */}
        <Route
          index
          element={
            <PageLoading>
              <Home />
            </PageLoading>
          }
        />
        <Route
          path="/explore"
          element={
            <PageLoading>
              <Explore />
            </PageLoading>
          }
        />
        <Route
          path="/saved"
          element={
            <PageLoading>
              <Saved />
            </PageLoading>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <PageLoading>
              <Profile />
            </PageLoading>
          }
        />

        {/* Admin Routes */}
        <Route path="/dashboard">
          <Route
            index
            element={
              <PageLoading>
                <Dashboard />
              </PageLoading>
            }
          />
        </Route>
      </Route>
    </Route>
  )
);

export default router;
