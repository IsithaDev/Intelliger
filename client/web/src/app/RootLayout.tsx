import { Outlet } from "react-router-dom";

import Topbar from "../components/shared/Topbar";
import Sidebar from "../components/shared/Sidebar";
import Bottombar from "../components/shared/Bottombar";

const RootLayout = () => {
  return (
    <div className="flex-1 flex flex-col relative">
      <Topbar />
      <div className="flex flex-1 relative">
        <Sidebar />
        <div className="flex-1 flex">
          <Outlet />
        </div>
      </div>
      <Bottombar />
    </div>
  );
};

export default RootLayout;
