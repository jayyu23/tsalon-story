import React from "react";

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

  return (
    <div className="h-100" style={{ minWidth: 100 }}>
      <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-secondary h-100">
        <a
          href="#"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
        >
          <span className="fs-4">
            <i className="fa fa-bars mx-3 mb-4 mt-5 pt-auto"></i>
            Menu
          </span>
        </a>
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
              >
                <i className={data.icon + " mx-2"}></i>
                {data.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;