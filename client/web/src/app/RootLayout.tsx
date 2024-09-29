import { Outlet } from "react-router-dom";

import Topbar from "../components/shared/Topbar";
import Sidebar from "../components/shared/Sidebar";
import Bottombar from "../components/shared/Bottombar";

const RootLayout = () => {
  return (
    <div className="relative flex flex-1 flex-col">
      <Topbar />
      <div className="relative flex flex-1">
        <Sidebar />
        <div className="flex flex-1">
          <Outlet />
        </div>
      </div>
      <Bottombar />
    </div>
  );
};

export default RootLayout;
