import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layout
import Layout from './Layout.jsx';

// Pages
import Home from './Pages/Home';
import Catalog from './Pages/Catalog';
import ProductDetail from './Pages/ProductDetail';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Checkout from './Pages/Checkout';
import CompleteProfile from './Pages/CompleteProfile';
import AdminLogin from './Pages/AdminLogin';
import AdminDashboard from './Pages/AdminDashboard';

// Styles
import './index.css';
import './App.css';

// Setup QueryClient untuk data fetching
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
      <Router>
        <Routes>
          {/* Public Routes dengan Layout */}
          <Route 
            path="/" 
            element={
              <Layout currentPageName="Home">
                <Home />
              </Layout>
            } 
          />
          <Route 
            path="/home" 
            element={<Navigate to="/" replace />} 
          />
          <Route 
            path="/catalog" 
            element={
              <Layout currentPageName="Catalog">
                <Catalog />
              </Layout>
            } 
          />
          <Route 
            path="/product-detail" 
            element={
              <Layout currentPageName="ProductDetail">
                <ProductDetail />
              </Layout>
            } 
          />
          <Route 
            path="/about" 
            element={
              <Layout currentPageName="About">
                <About />
              </Layout>
            } 
          />
          <Route 
            path="/contact" 
            element={
              <Layout currentPageName="Contact">
                <Contact />
              </Layout>
            } 
          />
          
          {/* Transaction Routes */}
          <Route 
            path="/checkout" 
            element={
              <Layout currentPageName="Checkout">
                <Checkout />
              </Layout>
            } 
          />
          <Route 
            path="/complete-profile" 
            element={
              <Layout currentPageName="CompleteProfile">
                <CompleteProfile />
              </Layout>
            } 
          />

          {/* Admin Routes (Layout ditangani di dalam component atau berbeda) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/login" element={<Navigate to="/admin/login" replace />} />
          
          <Route 
            path="/admin/dashboard" 
            element={ 
              // AdminDashboard biasanya punya layout sendiri (sidebar), 
              // jadi tidak dibungkus Layout utama website
              <AdminDashboard />
            } 
          /> 

          {/* 404 Fallback */}
          <Route 
            path="*" 
            element={
              <Layout currentPageName="404">
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 pt-20">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-8">Halaman tidak ditemukan.</p>
                  <a href="/" className="text-teal-600 hover:underline">Kembali ke Beranda</a>
                </div>
              </Layout>
            } 
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;