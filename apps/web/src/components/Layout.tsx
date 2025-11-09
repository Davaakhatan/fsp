import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Sparkles, Calculator, Menu, X, LogIn, LogOut, User, ChevronDown, Mail, Star, LayoutDashboard, Calendar, CloudRain } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/search', label: 'Browse Schools', icon: Search },
    { path: '/find-match', label: 'Find My Match', icon: Sparkles },
    { path: '/financing', label: 'Financing', icon: Calculator },
  ];

  const portalLinks = [
    { path: '/portal/inquiries', label: 'Inquiries', icon: Mail },
    { path: '/portal/reviews', label: 'Reviews', icon: Star },
  ];

  const adminPortalLinks = [
    { path: '/admin/portal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/portal/bookings', label: 'Bookings', icon: Calendar },
    { path: '/admin/portal/weather', label: 'Weather Alerts', icon: CloudRain },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                <span className="text-white font-bold text-xl">FSP</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Flight School Pro
                </div>
                <div className="text-xs text-gray-500 -mt-1">Find Your Perfect School</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {/* Marketplace Links */}
              <div className="flex items-center space-x-1">
                {navLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                      isActive(path)
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>

              {/* Auth Buttons */}
              {user ? (
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-300">
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                        location.pathname.startsWith('/admin')
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <User className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  )}
                  
                  {/* Portal Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                        location.pathname.startsWith('/portal')
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <User className="h-4 w-4" />
                      <span>Portal</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    {portalDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                        {portalLinks.map(({ path, label, icon: Icon }) => (
                          <Link
                            key={path}
                            to={path}
                            onClick={() => setPortalDropdownOpen(false)}
                            className={`flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-all ${
                              location.pathname === path ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{label}</span>
                          </Link>
                        ))}
                        
                        {/* Admin-only portal links */}
                        {isAdmin && (
                          <>
                            <div className="border-t border-gray-200 my-2"></div>
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Admin Tools</div>
                            {adminPortalLinks.map(({ path, label, icon: Icon }) => (
                              <Link
                                key={path}
                                to={path}
                                onClick={() => setPortalDropdownOpen(false)}
                                className={`flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-all ${
                                  location.pathname === path ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                                <span>{label}</span>
                              </Link>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 pl-4 border-l border-gray-300">
                  <Link
                    to="/signin"
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <span>Get Started</span>
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="px-4 py-4 space-y-2">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive(path)
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">FSP</span>
                </div>
                <div className="text-lg font-bold text-gray-900">Flight School Pro</div>
              </div>
              <p className="text-gray-600 text-sm max-w-md">
                Find and compare flight schools across North America. Discover the perfect training program for your aviation goals.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">For Students</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/search" className="text-gray-600 hover:text-blue-600 transition-colors">Browse Schools</Link></li>
                <li><Link to="/find-match" className="text-gray-600 hover:text-blue-600 transition-colors">Find My Match</Link></li>
                <li><Link to="/financing" className="text-gray-600 hover:text-blue-600 transition-colors">Financing Options</Link></li>
              </ul>
            </div>

            {/* School Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">For Schools</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Claim Your Profile</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2025 Flight School Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
