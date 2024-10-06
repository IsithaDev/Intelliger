import { Outlet, ScrollRestoration } from "react-router-dom";

const App = () => {
  return (
    <div className="flex min-h-screen">
      <Outlet />
      <ScrollRestoration
        getKey={(location) => {
          return location.key;
        }}
      />
    </div>
  );
};

export default App;
