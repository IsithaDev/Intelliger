import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sticky left-0 top-0 flex h-screen w-[84px] flex-col gap-y-8 bg-secondary p-4 max-md:hidden lg:w-[320px]">
      <div>Logo</div>
      <ul className="flex flex-1 flex-col justify-between">
        <div>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/explore">Explore</Link>
          </li>
          <li>
            <Link to="/saved">Saved</Link>
          </li>
        </div>
        <li>Logout</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
