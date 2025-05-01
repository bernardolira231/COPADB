import { ReactNode } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';

interface LayoutProps {
  onGroupChange?: (groupId: string | null) => void;
  children: ReactNode;
}

const Layout = ({ onGroupChange ,children }: LayoutProps) => {

  const { user, initializing } = useAuth();
  const router = useRouter();

  // Proteger rutas: si no hay usuario y ya terminó de inicializar, redirige a login
  useEffect(() => {
    if (!initializing && !user) {
      router.navigate({ to: '/', replace: true });
    }
  }, [user, initializing, router]);

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-100">
        <Header onGroupChange={onGroupChange}/>
        <div className="p-6 flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
