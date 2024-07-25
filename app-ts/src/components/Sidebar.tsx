import React, { useState } from "react";

interface SidebarProps {
  active?: number;
}

interface SidebarOption {
  index: number;
  text: string;
  link: string;
  icon: string;
  target?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ active = -1 }) => {
  const username = sessionStorage.getItem("username")?.replace(/ /g, "_").toLowerCase() || "";
  const [collapsed, setCollapsed] = useState(false);

  const sidebarOptions: SidebarOption[] = [
    {
      index: 0,
      text: "Explore",
      link: "/",
      icon: "fa fa-lines-leaning",
      target: "_blank",
    },
    {
      index: 1,
      text: "Dashboard",
      link: "/dashboard",
      icon: "fa fa-compass",
    },
    {
      index: 2,
      text: "Collections",
      link: "/collections",
      icon: "fa fa-book",
    },
    { index: 3, text: "Drafts", link: "/drafts", icon: "fa fa-pencil" },
    { index: 4, text: "Review", link: "/review", icon: "fa fa-check-to-slot" },
    { index: 5, text: "Settings", link: "/settings", icon: "fa fa-cog" },
  ];

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar h-100 ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-secondary h-100">
        <div className="d-flex justify-content-between align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
          <a
            href="#"
            className="d-flex align-items-center text-white text-decoration-none"
            onClick={toggleCollapse}
          >
            <span className="fs-4">
              <i className={`fa ${collapsed ? 'fa-bars' : 'fa-times'} mx-3 mb-4 mt-5 pt-auto`}></i>
              {collapsed ? '' : 'Menu'}
            </span>
          </a>
          {collapsed && (
            <button onClick={toggleCollapse} className="btn btn-primary ml-auto">
              <i className="fa fa-bars"></i>
            </button>
          )}
        </div>
        <div className="text-center mb-4">
          <img src={`https://avatars.dicebear.com/api/initials/${username}.svg`} alt="Avatar" className="rounded-circle" width="50" height="50" />
          {!collapsed && <h6 className="mt-2">{username}</h6>}
        </div>
        <ul className="nav nav-pills flex-column mb-auto">
          {sidebarOptions.map((data) => (
            <li key={data.index} className="nav-item my-1">
              <a
                href={data.link}
                target={data.target || "_self"}
                className={
                  data.index === active
                    ? "nav-link active flex-shrink-0"
                    : "nav-link text-white"
                }
                aria-current="page"
                title={collapsed ? data.text : ''}
              >
                <i className={data.icon + " mx-2"}></i>
                {!collapsed && data.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;