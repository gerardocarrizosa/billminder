function Layout() {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {' '}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{' '}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Parent</a>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Item 1</a>
          </li>
          <li>
            <details>
              <summary>Parent</summary>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <a>Item 3</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <a className="btn">Button</a>
      </div>
    </div>
  );
}

// function Layout() {
//   return (
//     <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//       <div className="min-h-screen flex flex-col bg-background text-foreground">
//         {/* Header */}
//         <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//           <div className="container flex h-14 items-center">
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="mr-2 md:hidden"
//               aria-label="Toggle Menu"
//             >
//               {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//             <div className="flex items-center flex-1">
//               <h1 className="text-xl font-bold">MyPWA</h1>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={toggleTheme}
//                 aria-label="Toggle Theme"
//               >
//                 {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//               </Button>
//               <Button variant="ghost" size="icon" aria-label="Notifications">
//                 <Bell size={20} />
//               </Button>
//               <Button variant="ghost" size="icon" aria-label="Profile">
//                 <User size={20} />
//               </Button>
//             </div>
//           </div>
//         </header>

//         <div className="flex flex-1">
//           {/* Sidebar - Mobile */}
//           {sidebarOpen && (
//             <div className="fixed inset-0 z-50 md:hidden">
//               <div
//                 className="fixed inset-0 bg-black/50"
//                 onClick={() => setSidebarOpen(false)}
//               />
//               <nav className="fixed top-0 left-0 bottom-0 w-3/4 max-w-xs bg-background p-6 shadow-lg">
//                 <div className="mb-8">
//                   <h2 className="text-xl font-bold">Menu</h2>
//                 </div>
//                 <div className="space-y-4">
//                   <a
//                     href="#"
//                     className="flex items-center gap-2 py-2 text-foreground hover:text-primary"
//                   >
//                     <Home size={20} />
//                     <span>Home</span>
//                   </a>
//                   <a
//                     href="#"
//                     className="flex items-center gap-2 py-2 text-foreground hover:text-primary"
//                   >
//                     <Search size={20} />
//                     <span>Search</span>
//                   </a>
//                   <a
//                     href="#"
//                     className="flex items-center gap-2 py-2 text-foreground hover:text-primary"
//                   >
//                     <Bell size={20} />
//                     <span>Notifications</span>
//                   </a>
//                   <a
//                     href="#"
//                     className="flex items-center gap-2 py-2 text-foreground hover:text-primary"
//                   >
//                     <User size={20} />
//                     <span>Profile</span>
//                   </a>
//                 </div>
//               </nav>
//             </div>
//           )}

//           {/* Sidebar - Desktop */}
//           <nav className="hidden md:block w-64 border-r p-6">
//             <div className="space-y-4">
//               <a
//                 href="#"
//                 className="flex items-center gap-2 py-2 text-foreground hover:text-primary"
//               >
//                 <Home size={20} />
//                 <span>Home</span>
//               </a>
//               <a
//                 href="#"
//                 className="flex items-center gap-2 py-2 text-foreground hover:text-primary"
//               >
//                 <Search size={20} />
//                 <span>Search</span>
//               </a>
//               <a
//                 href="#"
//                 className="flex items-center gap-2 py-2 text-foreground hover:text-primary"
//               >
//                 <Bell size={20} />
//                 <span>Notifications</span>
//               </a>
//               <a
//                 href="#"
//                 className="flex items-center gap-2 py-2 text-foreground hover:text-primary"
//               >
//                 <User size={20} />
//                 <span>Profile</span>
//               </a>
//             </div>
//           </nav>

//           {/* Main Content */}
//           <main className="flex-1 p-6">{children}</main>
//         </div>

//         {/* Footer */}
//         <footer className="border-t py-4">
//           <div className="container flex items-center justify-between">
//             <p className="text-sm text-muted-foreground">
//               © {new Date().getFullYear()} MyPWA. All rights reserved.
//             </p>
//             <div className="flex items-center gap-4">
//               <a
//                 href="#"
//                 className="text-sm text-muted-foreground hover:text-foreground"
//               >
//                 Privacy
//               </a>
//               <a
//                 href="#"
//                 className="text-sm text-muted-foreground hover:text-foreground"
//               >
//                 Terms
//               </a>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </ThemeProvider>
//   );
// }

export default Layout;
