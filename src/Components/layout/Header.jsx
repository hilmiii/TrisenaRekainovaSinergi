import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu, X, User, Beaker, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header({ cartItemCount, onCartClick, user, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Beranda', path: 'Home' },
    { name: 'Katalog Produk', path: 'Catalog' },
    { name: 'Tentang Kami', path: 'About' },
    { name: 'Hubungi Kami', path: 'Contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-lg flex items-center justify-center">
              <Beaker className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                PT. Trisena Rekainova
              </h1>
              <p className="text-xs text-gray-500">Inspiring Solutions for Labs</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={createPageUrl(item.path)}
                className={`text-sm font-medium transition-colors hover:text-cyan-600 ${
                  location.pathname.includes(item.path)
                    ? 'text-cyan-600'
                    : 'text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-gray-600">{user.full_name}</span>
                {user.is_admin && (
                  <Link to={createPageUrl('AdminDashboard')}>
                    <Button variant="outline" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-gray-600"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to={createPageUrl('Login')} className="hidden sm:block">
                <Button variant="outline" className="gap-2">
                  <User className="w-4 h-4" />
                  Masuk
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t shadow-lg"
          >
            <nav className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                >
                  {item.name}
                </Link>
              ))}
              {!user && (
                <Link
                  to={createPageUrl('Login')}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 bg-teal-600 text-white rounded-lg font-medium text-center mt-4"
                >
                  Masuk / Daftar
                </Link>
              )}
              {user && (
                <>
                  {user.is_admin && (
                    <Link
                      to={createPageUrl('AdminDashboard')}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                    >
                      Dashboard Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full py-3 px-4 text-left text-red-600 hover:bg-red-50 rounded-lg font-medium"
                  >
                    Keluar
                  </button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}