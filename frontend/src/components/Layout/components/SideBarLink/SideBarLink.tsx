import React from "react";
import { Link, useMatchRoute } from "@tanstack/react-router";

interface SideBarLinkProps {
  icon: React.JSX.Element;
  title: string;
  to: string;
  color?: string;
}

const SideBarLink = ({
  icon,
  title,
  to,
  color = "text-gray-500",
}: SideBarLinkProps) => {
  const matchRoute = useMatchRoute();
  const isActive = matchRoute({ to, fuzzy: true });
  return (
    <Link
      to={to}
      className={`flex py-2 px-3 rounded items-center gap-2 text-md transition ${
        isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
      }`}
    >
      <span className={color}>{icon}</span>
      {title}
    </Link>
  );
};

export default SideBarLink;
