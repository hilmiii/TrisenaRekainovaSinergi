import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/Components/ui/button';
import { ShoppingCart, Menu, X, User, LogOut, Package } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

export default function Header({ cartItemCount, orderCount, onCartClick, user, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isAuthenticated = !!localStorage.getItem('auth_token') || !!user;

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
          <Link to={createPageUrl('Home') || '/'} className="flex items-center gap-3">
            {/* PERBAIKAN: Menggunakan tag <img> untuk memanggil file logo.png */}
            <img 
              src="/img/logo.png" 
              alt="PT. Trisena Rekainova Logo" 
              className="h-10 w-auto object-contain" 
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Trisena Rekainova Sinergi
              </h1>
              <p className="text-xs text-gray-500">Inspiring Solutions for Labs</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={createPageUrl(item.path) || `/${item.path.toLowerCase()}`}
                className={`text-sm font-medium transition-colors hover:text-teal-600 ${
                  location.pathname.includes(item.path.toLowerCase()) || 
                  (item.path === 'Home' && location.pathname === '/')
                    ? 'text-teal-600'
                    : 'text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <Link
                to="/my-orders"
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Pesanan Saya"
              >
                <Package className="w-6 h-6 text-gray-700" />
                {orderCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
                    {orderCount}
                  </span>
                )}
              </Link>
            )}

           {/* Tombol Keranjang */}
            <button
              onClick={onCartClick}
              data-cy="tombol-keranjang-header" 
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Keranjang Belanja"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Desktop Login / Profile Button */}
            <div className="hidden sm:flex items-center gap-2 border-l border-gray-200 pl-3 ml-1">
              {isAuthenticated ? (
                <>
                  {(user?.role === 'admin' || user?.is_admin) && (
                    <Link to="/admin/dashboard">
                      <Button variant="outline" size="sm" className="hidden lg:flex border-teal-200 text-teal-700 hover:bg-teal-50">
                        Dashboard Admin
                      </Button>
                    </Link>
                  )}
                  {/* Tombol Profil */}
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-xl font-medium transition-all text-sm"
                  >
                    <User className="w-4 h-4" />
                    Profil
                  </Link>
                </>
              ) : (
                <Link to="/login">
                  <Button variant="outline" className="gap-2 border-gray-300 rounded-xl px-5 text-gray-700">
                    <User className="w-4 h-4" />
                    Masuk
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors ml-1"
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
            className="lg:hidden bg-white border-t shadow-xl overflow-hidden"
          >
            <nav className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path) || `/${item.path.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-teal-600 rounded-xl font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="border-t border-gray-100 my-2 pt-2"></div>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/my-orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-teal-600 rounded-xl font-medium transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5" /> Pesanan Saya
                    </div>
                    {orderCount > 0 && (
                      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {orderCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-4 text-teal-700 bg-teal-50 rounded-xl font-medium"
                  >
                    <User className="w-5 h-5" /> Profil Saya
                  </Link>
                  
                  {(user?.role === 'admin' || user?.is_admin) && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-xl font-medium"
                    >
                      Dashboard Admin
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      if(onLogout) onLogout();
                      setIsMobileMenuOpen(false);
                      localStorage.removeItem('auth_token');
                      window.location.href = '/';
                    }}
                    className="flex items-center gap-3 w-full py-3 px-4 text-left text-red-600 hover:bg-red-50 rounded-xl font-medium mt-1"
                  >
                    <LogOut className="w-5 h-5" /> Keluar
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3.5 px-4 bg-teal-600 text-white hover:bg-teal-700 rounded-xl font-medium text-center mt-4 transition-colors shadow-sm"
                >
                  Masuk / Daftar Akun
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}