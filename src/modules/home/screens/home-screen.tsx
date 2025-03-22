import { useTheme } from '@/modules/common/components/theme-controller';
import { Button } from '@/modules/common/components/ui/button';
import { DollarSign, Home, Menu, Moon, Sun, User, X } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

function HomeScreen() {
  const { setTheme, theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const routes = [
    {
      path: '/home',
      name: 'Home',
      icon: <Home size={20} />,
    },
    {
      path: '#',
      name: 'Bills',
      icon: <DollarSign size={20} />,
    },
    // {
    //   path: '#',
    //   name: 'Notifications',
    //   icon: <Bell size={20} />,
    // },
    // {
    //   path: '#',
    //   name: 'Profile',
    //   icon: <User size={20} />,
    // },
  ];

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

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
            <h1 className="text-xl font-bold">billminder</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            {/* <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell size={20} />
            </Button> */}
            <a href="profile">
              <Button variant="ghost" size="icon" aria-label="Profile">
                <User size={20} />
              </Button>
            </a>
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
                  <a
                    href={r.path}
                    className="flex items-center gap-2 py-2 text-foreground hover:text-primary"
                  >
                    {r.icon}
                    <span>{r.name}</span>
                  </a>
                ))}
              </div>
            </nav>
          </div>
        )}

        {/* Sidebar - Desktop */}
        <nav className="hidden md:block w-64 border-r p-6">
          <div className="space-y-4">
            {routes.map((r) => (
              <a
                href={r.path}
                className="flex items-center gap-2 py-2 text-foreground hover:text-primary"
              >
                {r.icon}
                <span>{r.name}</span>
              </a>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 container mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      {/* <footer className="border-t py-4">
        <div className="container flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MyPWA. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms
            </a>
          </div>
        </div>
      </footer> */}
    </div>
  );
}

export default HomeScreen;
