import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Provider untuk Notifikasi
import { ToasterProvider } from '@/components/ui/toaster';

// Layout
import Layout from '@/Layout';

// Pages
import Home from '@/Pages/Home';
import Catalog from '@/Pages/Catalog';
import ProductDetail from '@/Pages/ProductDetail';
import About from '@/Pages/About';
import Contact from '@/Pages/Contact';
import Checkout from '@/Pages/Checkout';
import CompleteProfile from '@/Pages/CompleteProfile';
import AdminLogin from '@/Pages/AdminLogin';
import AdminDashboard from '@/Pages/AdminDashboard';

// Styles
import '@/index.css';
import '@/App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToasterProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout currentPageName="Home"><Home /></Layout>} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            
            <Route path="/catalog" element={<Layout currentPageName="Catalog"><Catalog /></Layout>} />
            
            {/* Route Detail Produk dengan ID dinamis */}
            {/* Route untuk Detail Produk dengan ID */}
            <Route 
              path="/product/:id" 
              element={
                <Layout currentPageName="ProductDetail">
                  <ProductDetail />
                </Layout>
              } 
            />

            {/* Fallback untuk kompatibilitas lama (opsional) */}
            <Route path="/product-detail" element={<Navigate to="/catalog" replace />} />   

            <Route path="/about" element={<Layout currentPageName="About"><About /></Layout>} />
            <Route path="/contact" element={<Layout currentPageName="Contact"><Contact /></Layout>} />
            
            {/* Transaction Routes */}
            <Route path="/checkout" element={<Layout currentPageName="Checkout"><Checkout /></Layout>} />
            <Route path="/complete-profile" element={<Layout currentPageName="CompleteProfile"><CompleteProfile /></Layout>} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/login" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* 404 Fallback */}
            <Route path="*" element={
              <Layout currentPageName="404">
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                  <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-8 text-lg">Halaman tidak ditemukan.</p>
                  <a href="/" className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 hover:bg-gray-900/90">
                    Kembali ke Beranda
                  </a>
                </div>
              </Layout>
            } />
          </Routes>
        </Router>
      </ToasterProvider>
    </QueryClientProvider>
  );
}

export default App;