import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="flex min-h-screen">
      <Outlet />
    </div>
  );
};

export default App;
