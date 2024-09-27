import { createContext, ReactNode, useState } from "react";

import { IUser } from "@/lib/types";

interface AuthProviderState {
  user: IUser | null;
  accessToken: string | null;
  setCredentials: (user: IUser, accessToken: string) => void;
  logout: () => void;
}

const initialState: AuthProviderState = {
  user: null,
  accessToken: null,
  setCredentials: () => null,
  logout: () => null,
};

export const AuthProviderContext =
  createContext<AuthProviderState>(initialState);

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children, ...props }: AuthProviderProps) {
  const [user, setUser] = useState<IUser | null>(initialState.user);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const setCredentials = (user: IUser, accessToken: string) => {
    setUser(user);
    setAccessToken(accessToken);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
  };

  const value = {
    user,
    accessToken,
    setCredentials,
    logout,
  };

  return (
    <AuthProviderContext.Provider {...props} value={value}>
      {children}
    </AuthProviderContext.Provider>
  );
}

export default AuthProvider;
