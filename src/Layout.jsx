import React, { useState, useEffect } from 'react';
import { base44 } from './api/base44Client';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import WhatsAppButton from './components/ui/WhatsAppButton';

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const userData = await base44.auth.me();
          setUser(userData);
        }
      } catch (e) {
        console.log('Not authenticated');
      }
    };
    loadUser();
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('trisena_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('trisena_cart', JSON.stringify(cartItems));
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cartItems }));
  }, [cartItems]);

  // Listen for cart additions
  useEffect(() => {
    const handleAddToCart = (event) => {
      setCartItems(prev => [...prev, event.detail]);
    };
    window.addEventListener('addToCart', handleAddToCart);
    return () => window.removeEventListener('addToCart', handleAddToCart);
  }, []);

  const handleRemoveItem = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateQuantity = (index, quantity) => {
    setCartItems(prev => prev.map((item, i) => 
      i === index ? { ...item, quantity } : item
    ));
  };

  const handleLogout = async () => {
    await base44.auth.logout();
    setUser(null);
  };

  // Admin pages and CompleteProfile don't need the regular layout
  const isAdminPage = currentPageName?.startsWith('Admin');
  const isAuthPage = currentPageName === 'CompleteProfile';
  
  if (isAdminPage || isAuthPage) {
    return children;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        cartItemCount={cartItems.length}
        onCartClick={() => setIsCartOpen(true)}
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
      
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
      />
      
      <WhatsAppButton floating />
    </div>
  );
}