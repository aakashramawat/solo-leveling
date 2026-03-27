import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '⚔' },
  { to: '/quests', label: 'Quests', icon: '📜' },
  { to: '/profile', label: 'Profile', icon: '🗡' },
];

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-void-900">
      {/* Sidebar */}
      <aside className="w-60 bg-void-800 border-r border-void-600 flex flex-col sticky top-0 h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-void-600">
          <h1 className="text-lg font-display font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-400 to-arcane-400">
            SOLO LEVELING
          </h1>
          <p className="text-[10px] font-mono text-gray-600 mt-1 tracking-wider">
            SYSTEM v1.0
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-neon-500/10 text-neon-400 shadow-neon/10'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-void-700'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span className="tracking-wide">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-void-600 space-y-1">
          <div className="text-[10px] font-mono text-gray-600 text-center">
            ARISE
          </div>
          <div className="text-[9px] font-mono text-gray-700 text-center">
            Developed by Aakash
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
