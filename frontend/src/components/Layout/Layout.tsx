import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <main>
      <h1>Header</h1>
      {children}
      <h1>Footer</h1>
    </main>
  );
}

export default Layout;