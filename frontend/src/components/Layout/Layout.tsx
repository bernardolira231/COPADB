import { ReactNode, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {

  useEffect(() => {
    const checkToken = () => {
      if (!localStorage.getItem("token")) {
        window.location.replace("/login");
      }
    };

    checkToken();

    window.addEventListener("storage", checkToken);

    return () => {
      window.removeEventListener("storage", checkToken);
    };
  }, []);

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-100">
        <Header />
        <div className="p-6 flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
