import { CircleCheckBig, Home, Menu, Notebook, X } from 'lucide-react';
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import ProfileDropdown from '@/modules/home/components/profile-dropdown-menu';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const routes = [
    {
      path: 'home',
      name: 'Inicio',
      icon: <Home size={20} />,
    },
    {
      path: 'bills',
      name: 'Recordatorios',
      icon: <CircleCheckBig size={20} />,
    },
    {
      path: 'expenses',
      name: 'Gastos',
      icon: <Notebook size={20} />,
    },
    {
      path: 'budget',
      name: 'Presupuesto mensual',
      icon: <Notebook size={20} />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 flex h-14 items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-2 md:hidden"
            aria-label="Toggle Menu"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center flex-1">
            <Link to="/home">
              <h1 className="text-xl font-bold">billminder</h1>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ProfileDropdown />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <nav className="fixed top-0 left-0 bottom-0 w-3/4 max-w-xs bg-background p-6 shadow-lg">
              <div className="mb-8">
                <h2 className="text-xl font-bold">Menu</h2>
              </div>
              <div className="space-y-4">
                {routes.map((r) => (
                  <Link
                    key={r.path}
                    to={r.path}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="flex items-center gap-2 py-2 text-foreground hover:text-primary"
                  >
                    {r.icon}
                    <span>{r.name}</span>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}

        {/* Sidebar - Desktop */}
        <nav className="hidden md:block w-64 border-r p-6">
          <div className="space-y-4">
            {routes.map((r) => (
              <Link
                key={r.path}
                to={r.path}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center gap-2 py-2 text-foreground hover:text-primary"
              >
                {r.icon}
                <span>{r.name}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 container mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
