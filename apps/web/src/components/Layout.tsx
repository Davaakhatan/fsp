import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plane, AlertCircle, Calendar, LayoutDashboard } from 'lucide-react';
import { clsx } from 'clsx';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Bookings', href: '/bookings', icon: Calendar },
    { name: 'Weather Alerts', href: '/alerts', icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg group-hover:shadow-xl transition-shadow">
                <Plane className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Flight Schedule Pro
                </h1>
                <p className="text-xs text-gray-500">Weather Management System</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={clsx(
                      'flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium relative',
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:scale-105'
                    )}
                  >
                    <Icon className={clsx('h-5 w-5', isActive && 'animate-pulse')} />
                    <span className="hidden sm:inline">{item.name}</span>
                    {isActive && (
                      <span className="absolute -bottom-px left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              © 2025 Flight Schedule Pro. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-gray-600">System Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
