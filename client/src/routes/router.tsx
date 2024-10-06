/* import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { App, NotFound, RootLayout, Unauthorized } from "..";
import { ForgotPassword, ResetPassword, SignIn, SignUp } from "../(auth)";
import { Explore, Home, Profile, Saved } from "../(base)";
import { Dashboard } from "../(dashboard)";
import PageLoading from "../components/ui/PageLoading";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />} errorElement={<NotFound />}>
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

      <Route
        element={
          <PageLoading>
            <RootLayout />
          </PageLoading>
        }
      >

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

      <Route
        path="/unauthorized"
        element={
          <PageLoading>
            <Unauthorized />
          </PageLoading>
        }
      />
    </Route>,
  ),
);

export default router;
 */

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { App, NotFound, RootLayout, Unauthorized } from "..";
import { ForgotPassword, ResetPassword, SignIn, SignUp } from "@/(auth)";
import { Explore, Home, Saved } from "@/(base)";
import { Dashboard } from "@/(dashboard)";
import PageLoading from "@/components/ui/PageLoading";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
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

      <Route
        element={
          <PageLoading>
            <RootLayout />
          </PageLoading>
        }
      >
        <Route
          index
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <PageLoading>
                <Home />
              </PageLoading>
            </ProtectedRoute>
          }
        />

        <Route
          path="/explore"
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <PageLoading>
                <Explore />
              </PageLoading>
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved"
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <PageLoading>
                <Saved />
              </PageLoading>
            </ProtectedRoute>
          }
        />

        <Route path="/dashboard">
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <PageLoading>
                  <Dashboard />
                </PageLoading>
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>

      <Route
        path="/unauthorized"
        element={
          <PageLoading>
            <Unauthorized />
          </PageLoading>
        }
      />
      <Route
        path="*"
        element={
          <PageLoading>
            <NotFound />
          </PageLoading>
        }
      />
    </Route>,
  ),
);

export default router;
