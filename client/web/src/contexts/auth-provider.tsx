import { createContext, ReactNode, useState } from "react";

import { IUser } from "@/lib/types";

interface AuthProviderState {
  user: IUser | null;
  setUser: (user: IUser) => void;
  logout: () => void;
}

const initialState: AuthProviderState = {
  user: null,
  setUser: () => null,
  logout: () => null,
};

export const AuthProviderContext =
  createContext<AuthProviderState>(initialState);

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children, ...props }: AuthProviderProps) {
  const [user, setUser] = useState<IUser | null>(initialState.user);

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    setUser,
    logout,
  };

  return (
    <AuthProviderContext.Provider {...props} value={value}>
      {children}
    </AuthProviderContext.Provider>
  );
}

export default AuthProvider;
