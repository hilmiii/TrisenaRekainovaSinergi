import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import Header from '@/Components/layout/Header';
import Footer from '@/Components/layout/Footer';
import CartDrawer from '@/Components/cart/CartDrawer';
import WhatsAppButton from '@/Components/ui/WhatsAppButton';

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  
  // State keranjang sekarang dimulai dari kosong, menuggu data user dimuat
  const [cartItems, setCartItems] = useState([]);
  
  // State penjaga (Gatekeeper) agar keranjang tidak tertimpa sebelum data dimuat
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // 1. LOAD USER & KERANJANG SPESIFIK
  useEffect(() => {
    const loadUserAndCart = async () => {
      let currentUser = null;
      
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const response = await base44.get('/user');
          currentUser = response.data;
          setUser(currentUser);
        }
      } catch (e) {
        console.log('Sesi tidak valid atau belum login');
        localStorage.removeItem('auth_token');
      }

      // Tentukan nama 'kunci' memori berdasarkan user yang login
      const cartKey = currentUser ? `trisena_cart_${currentUser.id}` : 'trisena_cart_guest';
      
      // Ambil keranjang milik user tersebut
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      
      // Beri tanda bahwa keranjang sudah selesai dimuat
      setIsCartLoaded(true);
    };

    loadUserAndCart();
  }, []);

  // TAMBAHKAN KODE INI: Menarik jumlah riwayat pesanan setiap kali user terdeteksi login
  useEffect(() => {
    const fetchOrderCount = async () => {
      if (user && user.role !== 'admin') { // Admin tidak butuh badge pesanan saya
        try {
          const response = await base44.get('/my-orders');
          // Hitung jumlah pesanan (faktur) yang unik
          const uniqueOrders = new Set(response.data.map(item => item.order_number));
          setOrderCount(uniqueOrders.size);
        } catch (error) {
          console.error("Gagal menarik jumlah pesanan", error);
        }
      }
    };
    fetchOrderCount();
  }, [user]);

  // 2. AUTO-SAVE KERANJANG SPESIFIK (Hanya berjalan jika keranjang sudah dimuat)
  useEffect(() => {
    if (!isCartLoaded) return; // Cegah penyimpanan prematur

    const cartKey = user ? `trisena_cart_${user.id}` : 'trisena_cart_guest';
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, user, isCartLoaded]);

  // 3. LISTENER KERANJANG
  useEffect(() => {
    const handleAddToCart = (event) => {
      setCartItems((prev) => [...prev, event.detail]);
    };

    const handleCartUpdated = (event) => {
      setCartItems(event.detail); 
    };

    window.addEventListener('addToCart', handleAddToCart);
    window.addEventListener('cartUpdated', handleCartUpdated);
    
    return () => {
      window.removeEventListener('addToCart', handleAddToCart);
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, []);

  const handleRemoveItem = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateQuantity = (index, quantity) => {
    setCartItems(prev => prev.map((item, i) => 
      i === index ? { ...item, quantity } : item
    ));
  };

  // 4. LOGOUT SEKALIGUS BERSIHKAN TAMPILAN
const handleLogout = async () => {
    try {
      await base44.post('/logout');
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      localStorage.removeItem('auth_token');
      
      // PERBAIKAN 1: Bersihkan juga memori keranjang guest agar benar-benar kosong saat logout
      localStorage.removeItem('trisena_cart_guest');

      // PERBAIKAN 2: Kita HAPUS baris setUser(null) di sini agar mesin Auto-Save 
      // tidak salah paham dan menimpa keranjang guest sebelum halaman di-refresh.

      window.location.href = '/'; 
    }
  };

  // Halaman Admin tidak menggunakan layout reguler (Header/Footer publik)
  const isAdminPage = currentPageName?.startsWith('Admin');
  const isAuthPage = currentPageName === 'CompleteProfile';
  
  if (isAdminPage || isAuthPage) {
    return children;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        cartItemCount={cartItems.length}
        orderCount={orderCount}
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