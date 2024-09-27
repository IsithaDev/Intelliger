import { Outlet } from "react-router-dom";

import AuthProvider from "@/contexts/auth-provider";

const App = () => {
  return (
    <AuthProvider>
      <div className="flex min-h-screen">
        <Outlet />
      </div>
    </AuthProvider>
  );
};

export default App;
