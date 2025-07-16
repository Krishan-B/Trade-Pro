import { useState } from 'react';
import { Navigation } from './Navigation';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex flex-col flex-1">
        <Navigation onMenuToggle={handleMenuToggle} />
        <main className="flex-1 overflow-y-auto">
          <div className="md:ml-64">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}